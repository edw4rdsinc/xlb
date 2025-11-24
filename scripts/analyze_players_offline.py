#!/usr/bin/env python3
"""
Offline analysis of player names to identify potential custom players
"""

import json
import os
from difflib import get_close_matches

# Common NFL players for 2024 season (top players by position)
KNOWN_PLAYERS = {
    'QB': [
        'Josh Allen', 'Patrick Mahomes', 'Jalen Hurts', 'Lamar Jackson', 'Dak Prescott',
        'Justin Herbert', 'Joe Burrow', 'Tua Tagovailoa', 'Trevor Lawrence', 'Jared Goff',
        'Kirk Cousins', 'Geno Smith', 'Jordan Love', 'C.J. Stroud', 'Justin Fields',
        'Baker Mayfield', 'Sam Howell', 'Brock Purdy', 'Deshaun Watson', 'Russell Wilson',
        'Aaron Rodgers', 'Derek Carr', 'Daniel Jones', 'Matthew Stafford', 'Mac Jones',
        'Drake Maye', 'Caleb Williams', 'Jayden Daniels', 'Bo Nix', 'Will Levis',
        'Anthony Richardson', 'Bryce Young', 'Kenny Pickett', 'Desmond Ridder'
    ],
    'RB': [
        'Christian McCaffrey', 'Austin Ekeler', 'Bijan Robinson', 'Saquon Barkley', 'Tony Pollard',
        'Nick Chubb', 'Josh Jacobs', 'Derrick Henry', 'Jonathan Taylor', 'Aaron Jones',
        'Najee Harris', 'Rhamondre Stevenson', 'Breece Hall', 'Kenneth Walker III', 'Miles Sanders',
        'Jahmyr Gibbs', 'Travis Etienne Jr.', 'Joe Mixon', 'James Cook', 'Dameon Pierce',
        'Alvin Kamara', "D'Andre Swift", 'Alexander Mattison', 'Rachaad White', 'Isiah Pacheco',
        'Brian Robinson Jr.', 'Javonte Williams', 'James Conner', 'David Montgomery', 'Cam Akers',
        "De'Von Achane", 'Zack Moss', 'Jerome Ford', 'Kyren Williams', 'Tyjae Spears',
        'Tank Bigsby', 'Roschon Johnson', 'Keaton Mitchell', 'Jaylen Warren'
    ],
    'WR': [
        'Tyreek Hill', 'Stefon Diggs', 'Justin Jefferson', "Ja'Marr Chase", 'CeeDee Lamb',
        'Davante Adams', 'A.J. Brown', 'Jaylen Waddle', 'Cooper Kupp', 'Amon-Ra St. Brown',
        'DK Metcalf', 'Keenan Allen', 'DeAndre Hopkins', 'Amari Cooper', 'Calvin Ridley',
        'Terry McLaurin', 'Chris Godwin', 'Mike Evans', 'DeVonta Smith', 'Garrett Wilson',
        'Chris Olave', 'DJ Moore', 'Jerry Jeudy', 'Michael Pittman Jr.', 'Tyler Lockett',
        'Christian Watson', 'Tee Higgins', 'Brandon Aiyuk', 'Marquise Brown', 'Diontae Johnson',
        'Puka Nacua', 'Drake London', 'George Pickens', 'Jordan Addison', 'Jaxon Smith-Njigba',
        'Quentin Johnston', 'Zay Flowers', 'Rashee Rice', 'Tank Dell', 'Marvin Harrison Jr.',
        'Rome Odunze', 'Malik Nabers', 'Brian Thomas Jr.', 'Emeka Egbuka'
    ],
    'TE': [
        'Travis Kelce', 'Mark Andrews', 'T.J. Hockenson', 'George Kittle', 'Darren Waller',
        'Kyle Pitts', 'Dallas Goedert', 'Pat Freiermuth', 'Evan Engram', 'David Njoku',
        'Cole Kmet', 'Tyler Higbee', 'Dalton Schultz', 'Chigoziem Okonkwo', 'Gerald Everett',
        'Sam LaPorta', 'Michael Mayer', 'Luke Musgrave', 'Dalton Kincaid', 'Tucker Kraft',
        'Trey McBride', 'Jake Ferguson', 'Hunter Henry', 'Juwan Johnson', 'Taysom Hill',
        'Isaiah Likely', 'Brock Bowers', 'Ben Sinnott'
    ],
    'K': [
        'Justin Tucker', 'Daniel Carlson', 'Harrison Butker', 'Tyler Bass', 'Jason Myers',
        'Jake Elliott', 'Evan McPherson', 'Matt Gay', 'Younghoe Koo', 'Brandon Aubrey',
        'Cameron Dicker', 'Greg Zuerlein', 'Cairo Santos', 'Jake Moody', 'Brandon McManus',
        "Ka'imi Fairbairn", 'Will Reichard', 'Wil Lutz', 'Matt Prater', 'Joey Slye',
        'Blake Grupe', 'Chad Ryland', 'Anders Carlson', 'Eddy Pineiro'
    ],
    'DEF': [
        'BUF', 'NE', 'DAL', 'SF', 'BAL', 'NYJ', 'NO', 'PIT', 'CLE', 'PHI',
        'MIA', 'DEN', 'GB', 'MIN', 'CIN', 'TB', 'WAS', 'IND', 'KC', 'DET',
        'SEA', 'TEN', 'LAC', 'JAX', 'ATL', 'CHI', 'NYG', 'CAR', 'LAR', 'HOU',
        'ARI', 'LV'
    ]
}


def analyze_players():
    """Analyze player names from import data."""

    if not os.path.exists('round2_import_data.json'):
        print("Error: round2_import_data.json not found!")
        return

    with open('round2_import_data.json', 'r') as f:
        teams = json.load(f)

    print(f"Analyzing {len(teams)} teams...")

    # Collect all unique players by position
    players_by_position = {
        'QB': set(), 'RB': set(), 'WR': set(),
        'TE': set(), 'K': set(), 'DEF': set()
    }

    for team in teams:
        lineup = team['lineup']
        players_by_position['QB'].add(lineup['qb'])
        players_by_position['RB'].add(lineup['rb1'])
        players_by_position['RB'].add(lineup['rb2'])
        players_by_position['WR'].add(lineup['wr1'])
        players_by_position['WR'].add(lineup['wr2'])
        players_by_position['TE'].add(lineup['te'])
        players_by_position['K'].add(lineup['kicker'])
        players_by_position['DEF'].add(lineup['defense'])

    # Remove None values
    for pos in players_by_position:
        players_by_position[pos].discard(None)

    print("\n=== PLAYER ANALYSIS BY POSITION ===\n")

    potential_custom = []

    for position in ['QB', 'RB', 'WR', 'TE', 'K', 'DEF']:
        unique_players = sorted(players_by_position[position])
        print(f"{position} ({len(unique_players)} unique players):")

        for player in unique_players:
            if player in KNOWN_PLAYERS[position]:
                print(f"  ✓ {player}")
            else:
                # Try fuzzy match
                matches = get_close_matches(player, KNOWN_PLAYERS[position], n=1, cutoff=0.8)
                if matches:
                    print(f"  ? {player} → (maybe {matches[0]})")
                else:
                    print(f"  ✗ {player} - WOULD BE CUSTOM")
                    potential_custom.append(f"{player} ({position})")
        print()

    if potential_custom:
        print("\n=== PLAYERS THAT WOULD BE MARKED AS CUSTOM ===")
        print(f"Total: {len(potential_custom)}\n")
        for player in potential_custom:
            print(f"  • {player}")

        print("\n=== ACTION NEEDED ===")
        print("These players may need to be:")
        print("1. Added to the database before import")
        print("2. Have their names corrected in the Excel")
        print("3. Mapped to existing player names")
    else:
        print("\n✅ ALL PLAYERS APPEAR TO BE VALID NFL PLAYERS")

    return potential_custom


if __name__ == '__main__':
    analyze_players()