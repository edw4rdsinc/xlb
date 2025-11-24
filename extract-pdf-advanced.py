#!/usr/bin/env python3
import pdfplumber
import sys
import json

def extract_lineup_from_pdf(pdf_path):
    """Extract fantasy football lineup from PDF with form fields"""

    with pdfplumber.open(pdf_path) as pdf:
        page = pdf.pages[0]

        # Get all text with positions
        words = page.extract_words()

        # Build a position map of all players
        players_by_position = {}
        for word in words:
            x = word.get('x0', 0)
            y = word.get('top', 0)
            text = word['text']

            # Map players to their positions
            key = f"{int(y/10)}_{int(x/10)}"  # Grid position
            if key not in players_by_position:
                players_by_position[key] = []
            players_by_position[key].append(text)

        # Extract form field values
        form_data = {
            'participant': {},
            'selections': [],
            'defense': '',
            'kicker': ''
        }

        if page.annots:
            for annot in page.annots:
                data = annot.get('data', {})
                field_name = data.get('T', b'').decode('utf-8', errors='ignore')
                field_value = data.get('V', b'').decode('utf-8', errors='ignore')

                if field_value:
                    # Participant info
                    if field_name == 'Name':
                        form_data['participant']['name'] = field_value
                    elif field_name == 'Team Name':
                        form_data['participant']['team_name'] = field_value
                    elif field_name == 'Email Address':
                        form_data['participant']['email'] = field_value
                    elif field_name == 'Phone Number':
                        form_data['participant']['phone'] = field_value

                    # Defense and Kicker
                    elif 'DEFENSE' in field_name:
                        form_data['defense'] = field_value
                    elif 'KICKER' in field_name:
                        form_data['kicker'] = field_value

                    # Player selections (checkboxes with 'x')
                    elif field_value.lower() == 'x':
                        rect = data.get('Rect', [0, 0, 0, 0])
                        x_pos = rect[0]
                        y_pos = rect[1]

                        # Find nearby player text
                        closest_player = find_closest_player(x_pos, y_pos, words)
                        if closest_player:
                            form_data['selections'].append({
                                'field': field_name,
                                'player': closest_player,
                                'x': x_pos,
                                'y': y_pos
                            })

        return form_data

def find_closest_player(x_pos, y_pos, words):
    """Find the player name closest to a checkbox position"""

    # Look for player names near this position
    candidates = []

    for word in words:
        word_x = word.get('x0', 0)
        word_y = word.get('top', 0)

        # Check if word is on same line (within 15 pixels vertically)
        # and to the right of checkbox (within 200 pixels)
        if abs(word_y - y_pos) < 15 and word_x > x_pos and word_x - x_pos < 200:
            candidates.append(word['text'])

    # Join the first few words to get player name and team
    if candidates:
        # Common NFL player name pattern: First Last TEAM
        player_text = ' '.join(candidates[:3])

        # Clean up and format
        if any(team in player_text for team in ['BUF', 'KC', 'SF', 'BAL', 'LAR', 'DAL', 'IND']):
            return player_text

    return None

def map_selections_to_positions(form_data):
    """Map the selected players to their positions based on Y coordinates"""

    selections = sorted(form_data['selections'], key=lambda x: x['y'], reverse=True)

    lineup = {
        'quarterback': None,
        'running_backs': [],
        'wide_receivers': [],
        'tight_end': None
    }

    # Approximate Y positions for each section (based on typical form layout)
    # These would need to be calibrated for the specific form
    for selection in selections:
        y = selection['y']
        player = selection['player']

        if y > 540:  # QB section
            lineup['quarterback'] = player
        elif y > 480 and y < 540:  # RB section
            lineup['running_backs'].append(player)
        elif y > 420 and y < 480:  # WR section
            lineup['wide_receivers'].append(player)
        elif y > 360 and y < 420:  # TE section
            lineup['tight_end'] = player

    return lineup

if __name__ == '__main__':
    pdf_path = '/home/sam/Downloads/chaos-theory-lineup-rd3.pdf'

    result = extract_lineup_from_pdf(pdf_path)

    print("=== EXTRACTED LINEUP DATA ===")
    print(json.dumps(result, indent=2))

    # Map to positions
    lineup = map_selections_to_positions(result)

    print("\n=== FINAL LINEUP ===")
    print(f"Name: {result['participant'].get('name', '')}")
    print(f"Team: {result['participant'].get('team_name', '')}")
    print(f"Email: {result['participant'].get('email', '')}")
    print(f"Phone: {result['participant'].get('phone', '')}")
    print(f"\nQB: {lineup['quarterback']}")
    print(f"RB1: {lineup['running_backs'][0] if len(lineup['running_backs']) > 0 else ''}")
    print(f"RB2: {lineup['running_backs'][1] if len(lineup['running_backs']) > 1 else ''}")
    print(f"WR1: {lineup['wide_receivers'][0] if len(lineup['wide_receivers']) > 0 else ''}")
    print(f"WR2: {lineup['wide_receivers'][1] if len(lineup['wide_receivers']) > 1 else ''}")
    print(f"TE: {lineup['tight_end']}")
    print(f"Defense: {result['defense']}")
    print(f"Kicker: {result['kicker']}")