from http.server import BaseHTTPRequestHandler
import json
import tempfile
import os
from urllib.request import urlopen

try:
    import pdfplumber
except ImportError:
    pdfplumber = None

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Read request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))

            # Check if pdfplumber is available
            if pdfplumber is None:
                self.send_error(500, 'pdfplumber not installed')
                return

            # Get PDF URL (signed URL from Wasabi)
            pdf_url = data.get('pdf_url')
            if not pdf_url:
                self.send_error(400, 'No PDF URL provided')
                return

            # Download PDF from URL
            with urlopen(pdf_url) as response:
                pdf_bytes = response.read()

            # Create temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
                tmp_file.write(pdf_bytes)
                tmp_path = tmp_file.name

            try:
                # Extract text using pdfplumber
                text = ""
                page_count = 0
                tables_text = ""

                with pdfplumber.open(tmp_path) as pdf:
                    page_count = len(pdf.pages)
                    for page in pdf.pages:
                        # Extract regular text
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text + "\n\n"

                        # Also extract tables (important for checkbox forms)
                        tables = page.extract_tables()
                        if tables:
                            for table in tables:
                                for row in table:
                                    if row:
                                        row_text = ' | '.join([str(cell) if cell else '' for cell in row])
                                        tables_text += row_text + "\n"
                            tables_text += "\n"

                        # Extract characters for form checkbox detection
                        chars = page.chars
                        x_marks = [c for c in chars if c.get('text', '').upper() == 'X']
                        if x_marks:
                            text += f"\n[Found {len(x_marks)} X marks/checkboxes on this page]\n"

                # Combine text and tables
                if tables_text:
                    text += "\n\n=== TABLE DATA ===\n" + tables_text

                # Send success response
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
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
            self.end_headers()

            response = {
                'success': False,
                'error': str(e),
                'error_type': type(e).__name__,
                'traceback': error_traceback
            }

            self.wfile.write(json.dumps(response).encode('utf-8'))
