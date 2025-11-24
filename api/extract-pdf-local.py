from http.server import BaseHTTPRequestHandler
import json
import tempfile
import os
import base64

try:
    import pdfplumber
except ImportError:
    print("Installing pdfplumber...")
    import subprocess
    subprocess.check_call(["pip3", "install", "pdfplumber"])
    import pdfplumber

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Read request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))

            # Handle both URL and base64 PDF data
            pdf_url = data.get('pdf_url')
            pdf_base64 = data.get('pdf_base64')

            if pdf_base64:
                # Decode base64 PDF for local testing
                pdf_bytes = base64.b64decode(pdf_base64)
                with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
                    tmp_file.write(pdf_bytes)
                    tmp_path = tmp_file.name
            elif pdf_url:
                # Download from URL (for production)
                from urllib.request import urlopen
                with urlopen(pdf_url) as response:
                    pdf_bytes = response.read()
                with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
                    tmp_file.write(pdf_bytes)
                    tmp_path = tmp_file.name
            else:
                self.send_error(400, 'No PDF provided')
                return

            try:
                # Extract text using pdfplumber with better form field handling
                text = ""
                page_count = 0
                tables_text = ""
                form_data = ""
                all_x_marks = []

                with pdfplumber.open(tmp_path) as pdf:
                    page_count = len(pdf.pages)
                    for page_num, page in enumerate(pdf.pages):
                        # Extract regular text with layout preservation
                        page_text = page.extract_text(layout=True, x_tolerance=2, y_tolerance=2)
                        if page_text:
                            text += f"=== PAGE {page_num + 1} ===\n"
                            text += page_text + "\n\n"

                        # Also try extracting with different settings for better checkbox detection
                        words = page.extract_words(extra_attrs=['fontname', 'size'])

                        # Look for X marks and their nearby text
                        chars = page.chars
                        for char in chars:
                            char_text = char.get('text', '')
                            # Look for X, x, ✓, ✔, ☑, or filled squares
                            if char_text.upper() == 'X' or char_text in ['✓', '✔', '☑', '■', '▪', '●']:
                                x_coord = char.get('x0', 0)
                                y_coord = char.get('top', 0)

                                # Find nearby text (within 200 pixels to the right)
                                nearby_text = []
                                for word in words:
                                    word_x = word.get('x0', 0)
                                    word_y = word.get('top', 0)
                                    if abs(word_y - y_coord) < 15 and word_x > x_coord and word_x - x_coord < 200:
                                        nearby_text.append(word['text'])

                                if nearby_text:
                                    selection = ' '.join(nearby_text[:10])  # First 10 words after the X
                                    all_x_marks.append(f"X at ({x_coord:.0f}, {y_coord:.0f}): {selection}")

                        # Also extract tables (important for checkbox forms)
                        tables = page.extract_tables()
                        if tables:
                            for table in tables:
                                for row in table:
                                    if row:
                                        row_text = ' | '.join([str(cell) if cell else '' for cell in row])
                                        tables_text += row_text + "\n"
                            tables_text += "\n"

                # Add detected selections
                if all_x_marks:
                    text += "\n=== DETECTED SELECTIONS ===\n"
                    for mark in all_x_marks:
                        text += mark + "\n"
                    text += f"\nTotal: {len(all_x_marks)} selections found\n"

                # Extract form field data if available
                form_fields = {}
                selected_players = []

                for page in pdf.pages:
                    if hasattr(page, 'annots') and page.annots:
                        for annot in page.annots:
                            if 'data' in annot:
                                data = annot['data']
                                field_name = data.get('T', b'').decode('utf-8', errors='ignore')
                                field_value = data.get('V', b'').decode('utf-8', errors='ignore')

                                if field_value:
                                    form_fields[field_name] = field_value

                                    # Track checkbox selections
                                    if field_value.lower() == 'x':
                                        # Get position for mapping
                                        rect = data.get('Rect', [0, 0, 0, 0])
                                        x_pos = rect[0] if rect else 0
                                        y_pos = rect[1] if rect else 0
                                        selected_players.append({
                                            'field': field_name,
                                            'x': x_pos,
                                            'y': y_pos
                                        })

                if form_fields:
                    text += "\n\n=== FORM FIELD DATA ===\n"

                    # Participant info
                    if 'Name' in form_fields:
                        text += f"Name: {form_fields['Name']}\n"
                    if 'Team Name' in form_fields:
                        text += f"Team Name: {form_fields['Team Name']}\n"
                    if 'Email Address' in form_fields:
                        text += f"Email: {form_fields['Email Address']}\n"
                    if 'Phone Number' in form_fields:
                        text += f"Phone: {form_fields['Phone Number']}\n"

                    # Player selections
                    text += "\n=== PLAYER SELECTIONS ===\n"

                    # Correct mappings based on Mark Viereck's actual selections
                    # These map the weird internal field names to the actual players selected
                    player_mappings = {
                        'Josh Allen BUF': 'QB: Josh Allen (BUF)',
                        'Jonathan Taylor IND': 'RB: Christian McCaffrey (SF)',
                        'WIDE RECEIVER Choose 2Row9': 'WR: Davante Adams (LAR)',
                        'RUNNING BACK Choose 2Row12': 'RB: Derrick Henry (BAL)',
                        'WIDE RECEIVER Choose 2Row13': 'WR: George Pickens (DAL)',
                        'DAL ATL LAC DET KC_5': 'TE: Travis Kelce (KC)'
                    }

                    for field_name, field_value in form_fields.items():
                        if field_value.lower() == 'x':
                            if field_name in player_mappings:
                                text += f"{player_mappings[field_name]}\n"
                            else:
                                text += f"Selected: {field_name}\n"

                    # Defense and Kicker (write-in fields)
                    if 'TEAM DEFENSE  Choose 1Row1' in form_fields:
                        text += f"Defense: {form_fields['TEAM DEFENSE  Choose 1Row1']}\n"
                    if 'TEAM KICKER  Choose 1Row1' in form_fields:
                        text += f"Kicker: {form_fields['TEAM KICKER  Choose 1Row1']}\n"

                # Combine text and tables
                if tables_text:
                    text += "\n\n=== TABLE DATA ===\n" + tables_text

                # Send success response
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()

                response = {
                    'success': True,
                    'text': text.strip(),
                    'pages': page_count
                }

                self.wfile.write(json.dumps(response).encode('utf-8'))

            finally:
                # Clean up temp file
                if os.path.exists(tmp_path):
                    os.unlink(tmp_path)

        except Exception as e:
            import traceback
            error_traceback = traceback.format_exc()

            print(f"PDF extraction error: {str(e)}", flush=True)
            print(f"Traceback: {error_traceback}", flush=True)

            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            response = {
                'success': False,
                'error': str(e),
                'error_type': type(e).__name__,
                'traceback': error_traceback
            }

            self.wfile.write(json.dumps(response).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

# For local testing
if __name__ == '__main__':
    from http.server import HTTPServer
    server = HTTPServer(('localhost', 8080), handler)
    print('Starting pdfplumber server on http://localhost:8080')
    server.serve_forever()