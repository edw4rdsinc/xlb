#!/bin/bash

echo "🏈 Starting Fantasy Football Roster Upload - Local Testing"
echo "========================================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check for Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed"
    exit 1
fi

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed"
    exit 1
fi

# Install Python dependencies
echo -e "${YELLOW}Installing Python dependencies...${NC}"
pip3 install pdfplumber --quiet

# Start Python PDF extraction server in background
echo -e "${GREEN}Starting PDF extraction server...${NC}"
python3 api/extract-pdf-local.py &
PYTHON_PID=$!
echo "PDF extraction server started (PID: $PYTHON_PID)"

# Give Python server time to start
sleep 2

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $PYTHON_PID 2>/dev/null
    exit
}
trap cleanup INT

echo ""
echo -e "${GREEN}Starting Next.js development server...${NC}"
echo ""
echo "📝 Instructions:"
echo "1. The app will open at http://localhost:3000"
echo "2. Go to: http://localhost:3000/employee/roster-upload"
echo "3. Upload your PDF and test the full flow"
echo "4. Check the terminal for debug logs"
echo "5. Press Ctrl+C to stop"
echo ""
echo "========================================================="
echo ""

# Start Next.js dev server
npm run dev