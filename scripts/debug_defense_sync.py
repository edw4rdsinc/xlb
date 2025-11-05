#!/usr/bin/env python3
"""Debug why only 15/28 defenses are being synced"""

import nflreadpy as nfl
import pandas as pd
from supabase import create_client
from dotenv import load_dotenv
from fuzzywuzzy import fuzz
import os
import sys
sys.path.insert(0, '/home/sam/Documents/github-repos/xlb/xlb/scripts')

load_dotenv('.env.local')

supabase = create_client(
    os.getenv('NEXT_PUBLIC_SUPABASE_URL'),
    os.getenv('SUPABASE_SERVICE_ROLE_KEY')
)

# Load stats
stats = nfl.load_player_stats([2025])
if hasattr(stats, 'to_pandas'):
    stats = stats.to_pandas()

week_stats = stats[stats['week'] == 9].copy()

# Aggregate defense stats (same as sync script)
team_col = 'team'
agg_stats = week_stats.groupby(team_col).agg({
    'def_tds': 'sum',
    'def_interceptions': 'sum',
    'def_safeties': 'sum',
    'def_sacks': 'sum'
}).reset_index()

# Apply team mapping
team_mapping = {'LA': 'LAR'}
agg_stats[team_col] = agg_stats[team_col].replace(team_mapping)

# Add required columns
agg_stats['week'] = 9
agg_stats['position'] = 'DEF'
agg_stats['player_display_name'] = agg_stats[team_col] + ' Defense'

# Add defaults
for col in ['def_tds', 'def_interceptions', 'def_safeties', 'def_sacks']:
    if col not in agg_stats.columns:
        agg_stats[col] = 0

# Filter
filtered = agg_stats[
    (agg_stats['def_tds'] > 0) |
    (agg_stats['def_interceptions'] > 0) |
    (agg_stats['def_safeties'] > 0) |
    (agg_stats['def_sacks'] > 0)
]

print(f'Aggregated defenses: {len(filtered)}')
print(f'Columns: {filtered.columns.tolist()}')
print()

# Check if 'week_number' vs 'week' issue
if 'week' in filtered.columns and 'week_number' not in filtered.columns:
    print('⚠️  Found "week" column but missing "week_number"')
    print('   The transform function may be expecting "week_number"')
    print()

# Combine with player stats
combined = pd.concat([week_stats, filtered], ignore_index=True)
print(f'Combined stats: {len(combined)}')
print(f'  - Player stats: {len(week_stats)}')
print(f'  - Defense stats: {len(filtered)}')
print()

# Check for defense records in combined
defense_records = combined[combined['position'] == 'DEF']
print(f'Defense records in combined: {len(defense_records)}')
print()

# List all defense teams
if len(defense_records) > 0:
    print('Defense teams in combined:')
    for _, row in defense_records.sort_values('player_display_name').iterrows():
        print(f'  - {row["player_display_name"]}')
