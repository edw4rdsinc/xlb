#!/usr/bin/env python3
"""Check for duplicate player_ids in Week 9 sync data"""

import nflreadpy as nfl
import pandas as pd
from supabase import create_client
from dotenv import load_dotenv
from fuzzywuzzy import fuzz
import os
from collections import Counter

load_dotenv('.env.local')

# Load stats
stats = nfl.load_player_stats([2025])
if hasattr(stats, 'to_pandas'):
    stats = stats.to_pandas()

week_stats = stats[stats['week'] == 9].copy()

# Aggregate team defenses (same as sync script)
team_col = 'team' if 'team' in week_stats.columns else 'recent_team'

agg_stats = week_stats.groupby(team_col).agg({
    'def_tds': 'sum',
    'def_interceptions': 'sum',
    'def_safeties': 'sum',
    'def_sacks': 'sum'
}).reset_index()

# Apply team mapping
team_mapping = {'LA': 'LAR'}
agg_stats[team_col] = agg_stats[team_col].replace(team_mapping)

# Create defense records
agg_stats['position'] = 'DEF'
agg_stats['player_display_name'] = agg_stats[team_col] + ' Defense'

# Filter out zero-stat defenses
agg_stats = agg_stats[
    (agg_stats['def_tds'] > 0) |
    (agg_stats['def_interceptions'] > 0) |
    (agg_stats['def_safeties'] > 0) |
    (agg_stats['def_sacks'] > 0)
]

# Combine with player stats
combined = pd.concat([week_stats, agg_stats], ignore_index=True)

print(f'Original player stats: {len(week_stats)}')
print(f'Team defense stats: {len(agg_stats)}')
print(f'Combined stats: {len(combined)}')

# Get database players
supabase = create_client(
    os.getenv('NEXT_PUBLIC_SUPABASE_URL'),
    os.getenv('SUPABASE_SERVICE_ROLE_KEY')
)
result = supabase.table('players').select('*').execute()
db_players = result.data

# Function to match players (updated to match sync script)
def match_player(name, position, db_players):
    position_matches = [p for p in db_players if p['position'] == position]
    if not position_matches:
        return None

    # For DEF position, require exact match only
    if position == 'DEF':
        for player in position_matches:
            if name.lower() == player['name'].lower():
                return player['id']
        return None

    # For other positions, use fuzzy matching
    for player in position_matches:
        if name.lower() == player['name'].lower():
            return player['id']

    best_match = None
    best_score = 0
    for player in position_matches:
        score = fuzz.ratio(name.lower(), player['name'].lower())
        if score > best_score and score >= 85:
            best_score = score
            best_match = player['id']

    return best_match

# Match all players
matched_records = []
for _, row in combined.iterrows():
    name = row.get('player_display_name') or row.get('player_name', '')
    position = row.get('position', '')

    if not name or not position:
        continue

    player_id = match_player(name, position, db_players)
    if player_id:
        matched_records.append({
            'player_id': player_id,
            'name': name,
            'position': position
        })

print(f'\nMatched players: {len(matched_records)}')

# Check for duplicates
player_ids = [r['player_id'] for r in matched_records]
print(f'Unique player IDs: {len(set(player_ids))}')

if len(player_ids) != len(set(player_ids)):
    print('\n⚠️  DUPLICATES FOUND!')
    counts = Counter(player_ids)
    duplicates = [(pid, count) for pid, count in counts.items() if count > 1]

    print(f'Number of duplicated IDs: {len(duplicates)}')
    print('\nDuplicate entries:')

    for pid, count in duplicates:
        # Find all records with this ID
        dup_records = [r for r in matched_records if r['player_id'] == pid]
        print(f'\n  Player ID: {pid}')
        print(f'  Appears {count} times:')
        for rec in dup_records:
            print(f'    - {rec["name"]} ({rec["position"]})')
else:
    print('\n✅ No duplicates found!')
