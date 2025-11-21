#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Fantasy Football PDF Test Tool${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# Check if PDF file is provided
if [ -z "$1" ]; then
    echo -e "${RED}Usage: ./test-pdf.sh <path-to-pdf>${NC}"
    echo ""
    echo "Examples:"
    echo "  ./test-pdf.sh ~/Downloads/roster.pdf"
    echo "  ./test-pdf.sh ./test-files/sample.pdf"
    exit 1
fi

PDF_FILE="$1"

# Check if file exists
if [ ! -f "$PDF_FILE" ]; then
    echo -e "${RED}Error: File not found: $PDF_FILE${NC}"
    exit 1
fi

# Check for Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: Python 3 is required${NC}"
    exit 1
fi

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is required${NC}"
    exit 1
fi

# Install npm dependencies if needed
if [ ! -d "node_modules/@anthropic-ai" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install @anthropic-ai/sdk
fi

# Run the test
echo -e "${GREEN}Testing PDF: ${NC}$PDF_FILE"
echo ""

# Set API key if provided as second argument
if [ ! -z "$2" ]; then
    export ANTHROPIC_API_KEY="$2"
fi

# Run the Node.js test script
node test-pdf-local.js "$PDF_FILE"

echo ""
echo -e "${GREEN}Test complete!${NC}"