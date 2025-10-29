#!/bin/bash
# Install Python dependencies for Fantasy Football scripts

echo "================================================"
echo "Installing Python Dependencies"
echo "================================================"

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed"
    echo "   Install Python 3.8+ and try again"
    exit 1
fi

echo "✅ Python $(python3 --version) found"

# Create virtual environment if it doesn't exist
if [ ! -d "scripts/venv" ]; then
    echo ""
    echo "Creating virtual environment..."
    python3 -m venv scripts/venv
    echo "✅ Virtual environment created"
fi

# Activate virtual environment
echo ""
echo "Activating virtual environment..."
source scripts/venv/bin/activate

# Install dependencies
echo ""
echo "Installing dependencies from requirements.txt..."
pip install -r scripts/requirements.txt

echo ""
echo "================================================"
echo "✅ Installation Complete"
echo "================================================"
echo ""
echo "To use the scripts:"
echo "  1. Activate venv: source scripts/venv/bin/activate"
echo "  2. Run script: python scripts/sync_nfl_stats.py --week 8"
echo "  3. Deactivate: deactivate"
echo ""
echo "Quick test:"
echo "  python scripts/sync_nfl_stats.py --week 8 --dry-run"
echo ""
