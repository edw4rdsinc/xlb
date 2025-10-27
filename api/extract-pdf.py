from http.server import BaseHTTPRequestHandler
import json
import base64
import tempfile
import os

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

            # Get base64 encoded PDF data
            pdf_base64 = data.get('pdf_data')
            if not pdf_base64:
                self.send_error(400, 'No PDF data provided')
                return

            # Decode base64 PDF
            pdf_bytes = base64.b64decode(pdf_base64)

            # Create temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
                tmp_file.write(pdf_bytes)
                tmp_path = tmp_file.name

            try:
                # Extract text using pdfplumber
                text = ""
                page_count = 0

                with pdfplumber.open(tmp_path) as pdf:
                    page_count = len(pdf.pages)
                    for page in pdf.pages:
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text + "\n\n"

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
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()

            response = {
                'success': False,
                'error': str(e)
            }

            self.wfile.write(json.dumps(response).encode('utf-8'))
