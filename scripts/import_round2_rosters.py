#!/usr/bin/env python3
"""
Import Round 2 Fantasy Football Rosters from Excel
Handles 72 teams with complete lineups
"""

import pandas as pd
import os
import sys
from datetime import datetime
import json
from typing import Dict, List, Optional, Tuple

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Defense name mappings (handle any remaining issues)
DEFENSE_MAPPINGS = {
    'Bills': 'BUF',
    'Browns': 'CLE',
    # Already correct formats will pass through
}

# Common player name variations to handle
PLAYER_NAME_MAPPINGS = {
    # QB variations
    'Pat Mahomes': 'Patrick Mahomes',

    # WR variations
    'AJ Brown': 'A.J. Brown',
    'TJ Hockenson': 'T.J. Hockenson',
    'JK Dobbins': 'J.K. Dobbins',
    'Marvin Harrison Jr': 'Marvin Harrison Jr.',
    "De'Von Achane": "De'Von Achane",  # standardize apostrophe

    # Kickers often listed by last name only
    'Aubrey': 'Brandon Aubrey',
    'Gay': 'Matt Gay',
    'Carlson': 'Daniel Carlson',
    'Reichard': 'Will Reichard',
    'Bates': 'Tyler Bass',  # Check if this is right
    'Lutz': 'Wil Lutz',
    'McPherson': 'Evan McPherson',
    'Tucker': 'Justin Tucker',
    'Butker': 'Harrison Butker',
    'Elliott': 'Jake Elliott',
    'Myers': 'Jason Myers',
    'McManus': 'Brandon McManus',
    'Moody': 'Jake Moody',
    'Prater': 'Matt Prater',
    'Pineiro': 'Eddy Pineiro',
    'Koo': 'Younghoe Koo',
    'Fairbairn': 'Ka\'imi Fairbairn',
    'Maher': 'Brett Maher',
    'McLaughlin': 'Chase McLaughlin',
    'Dicker': 'Cameron Dicker',
    'Boswell': 'Chris Boswell',
    'Santos': 'Cairo Santos',
    'Mevis': 'Harrison Mevis',
    'Fitzgerald': 'Ryan Fitzgerald',
    'Badgley': 'Mike Badgley',
    'Gonzalez': 'Zane Gonzalez',  # Atlanta Falcons kicker
}


def clean_defense_name(defense: str) -> str:
    """Clean defense team name to match database format."""
    if pd.isna(defense):
        return None

    defense = str(defense).strip()

    # Check if it needs mapping
    if defense in DEFENSE_MAPPINGS:
        return DEFENSE_MAPPINGS[defense]

    # Already in correct format (3-letter code)
    return defense.upper()


def clean_player_name(name: str, position: str) -> str:
    """Clean player name to match database format."""
    if pd.isna(name):
        return None

    name = str(name).strip()

    # Check for known mappings
    if name in PLAYER_NAME_MAPPINGS:
        return PLAYER_NAME_MAPPINGS[name]

    return name


def analyze_data(df: pd.DataFrame) -> Dict:
    """Analyze the Excel data before import."""

    analysis = {
        'total_teams': len(df),
        'missing_emails': df['Email'].isna().sum(),
        'missing_phones': df['Phone'].isna().sum(),
        'unique_defenses': list(df['DST'].dropna().unique()),
        'unique_kickers': list(df['K'].dropna().unique()),
        'roster_positions': ['QB', 'RB 1', 'RB 2', 'WR 1', 'WR 2', 'TE', 'DST', 'K'],
        'sample_teams': []
    }

    # Add sample teams
    for idx in range(min(3, len(df))):
        team = {
            'name': df.loc[idx, 'Name'],
            'email': df.loc[idx, 'Email'],
            'team_name': df.loc[idx, 'Team Name'],
            'roster': {}
        }
        for pos in analysis['roster_positions']:
            if pos in df.columns:
                player = df.loc[idx, pos]
                if pos == 'DST':
                    player = clean_defense_name(player)
                elif pos == 'K':
                    player = clean_player_name(player, 'K')
                team['roster'][pos] = player
        analysis['sample_teams'].append(team)

    return analysis


def prepare_import_data(df: pd.DataFrame) -> List[Dict]:
    """Prepare data for import to database."""

    teams = []

    for idx, row in df.iterrows():
        # Skip if no email (can't create user without it)
        if pd.isna(row['Email']):
            print(f"Skipping row {idx}: No email for {row['Name']}")
            continue

        team = {
            'user': {
                'name': str(row['Name']).strip(),
                'email': str(row['Email']).strip().lower(),
                'team_name': str(row['Team Name']).strip(),
            },
            'lineup': {
                'qb': clean_player_name(row['QB'], 'QB'),
                'rb1': clean_player_name(row['RB 1'], 'RB'),
                'rb2': clean_player_name(row['RB 2'], 'RB'),
                'wr1': clean_player_name(row['WR 1'], 'WR'),
                'wr2': clean_player_name(row['WR 2'], 'WR'),
                'te': clean_player_name(row['TE'], 'TE'),
                'defense': clean_defense_name(row['DST']),
                'kicker': clean_player_name(row['K'], 'K'),
            },
            'scores': {
                'round1_total': row.get('ROUND 1', 0),
                'round2_total': row.get('ROUND 2', 0),
                'season_total': row.get('Season', 0),
            }
        }

        teams.append(team)

    return teams


def main():
    """Main import function."""

    excel_file = 'clb-ff-rosters.xlsx'

    if not os.path.exists(excel_file):
        print(f"Error: {excel_file} not found!")
        sys.exit(1)

    print(f"Reading {excel_file}...")
    df = pd.read_excel(excel_file, engine='openpyxl')

    # Analyze data
    print("\n=== DATA ANALYSIS ===")
    analysis = analyze_data(df)
    print(f"Total teams: {analysis['total_teams']}")
    print(f"Missing emails: {analysis['missing_emails']}")
    print(f"Missing phones: {analysis['missing_phones']}")

    print("\nDefenses found:")
    for defense in sorted(analysis['unique_defenses']):
        cleaned = clean_defense_name(defense)
        if defense != cleaned:
            print(f"  {defense} -> {cleaned}")
        else:
            print(f"  {defense}")

    print("\nSample teams:")
    for team in analysis['sample_teams'][:2]:
        print(f"\n  {team['team_name']} ({team['name']})")
        print(f"    Email: {team['email']}")
        for pos, player in team['roster'].items():
            print(f"    {pos:5}: {player}")

    # Prepare import data
    print("\n=== PREPARING IMPORT ===")
    teams = prepare_import_data(df)
    print(f"Prepared {len(teams)} teams for import")

    # Save to JSON for review
    output_file = 'round2_import_data.json'
    with open(output_file, 'w') as f:
        json.dump(teams, f, indent=2)
    print(f"\nImport data saved to {output_file}")

    # Show summary
    print("\n=== IMPORT SUMMARY ===")
    print(f"Teams to import: {len(teams)}")
    print(f"Next step: Run import_to_supabase.py to import to database")
    print("\nThis will:")
    print("  1. Create/update users")
    print("  2. Create Round 2 lineups")
    print("  3. Match player names to database IDs")
    print("  4. Handle any custom players")

    return teams


if __name__ == '__main__':
    main()