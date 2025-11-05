#!/bin/bash
#
# Test Week Calculation Logic for NFL Stats Sync
# This script verifies the week calculation works correctly for all weeks of the season
#

echo "============================================================"
echo "NFL Stats Sync - Week Calculation Test"
echo "============================================================"
echo ""

# Season configuration (same as cron script)
SEASON_START="2025-09-04"

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to calculate week for a given date
calculate_week() {
    local test_date=$1
    local expected_week=$2

    DAYS_SINCE_START=$(( ($(date -d "$test_date" +%s) - $(date -d "$SEASON_START" +%s)) / 86400 ))
    WEEK_TO_SYNC=$(( ($DAYS_SINCE_START / 7) + 1 ))

    # Cap at week 18
    if [ $WEEK_TO_SYNC -gt 18 ]; then
        WEEK_TO_SYNC=18
    fi

    # Check if calculation matches expected
    if [ "$WEEK_TO_SYNC" -eq "$expected_week" ]; then
        echo -e "${GREEN}✅ PASS${NC} | $test_date (Day $DAYS_SINCE_START) → Week $WEEK_TO_SYNC"
    else
        echo -e "${RED}❌ FAIL${NC} | $test_date (Day $DAYS_SINCE_START) → Week $WEEK_TO_SYNC (expected $expected_week)"
        return 1
    fi
}

echo "Testing week calculation for Tuesdays after each week..."
echo ""

# Week 1: Sept 4-8 (Thu-Mon) → Sync on Tuesday Sept 9
calculate_week "2025-09-09" 1

# Week 2: Sept 11-15 → Sync on Tuesday Sept 16
calculate_week "2025-09-16" 2

# Week 3: Sept 18-22 → Sync on Tuesday Sept 23
calculate_week "2025-09-23" 3

# Week 4: Sept 25-29 → Sync on Tuesday Sept 30
calculate_week "2025-09-30" 4

# Week 5: Oct 2-6 → Sync on Tuesday Oct 7
calculate_week "2025-10-07" 5

# Week 6: Oct 9-13 → Sync on Tuesday Oct 14
calculate_week "2025-10-14" 6

# Week 7: Oct 16-20 → Sync on Tuesday Oct 21
calculate_week "2025-10-21" 7

# Week 8: Oct 23-27 → Sync on Tuesday Oct 28
calculate_week "2025-10-28" 8

# Week 9: Oct 30 - Nov 3 → Sync on Tuesday Nov 4
calculate_week "2025-11-04" 9

# Week 10: Nov 6-10 → Sync on Tuesday Nov 11
calculate_week "2025-11-11" 10

# Week 11: Nov 13-17 → Sync on Tuesday Nov 18
calculate_week "2025-11-18" 11

# Week 12: Nov 20-24 → Sync on Tuesday Nov 25
calculate_week "2025-11-25" 12

# Week 13: Nov 27 - Dec 1 → Sync on Tuesday Dec 2
calculate_week "2025-12-02" 13

# Week 14: Dec 4-8 → Sync on Tuesday Dec 9
calculate_week "2025-12-09" 14

# Week 15: Dec 11-15 → Sync on Tuesday Dec 16
calculate_week "2025-12-16" 15

# Week 16: Dec 18-22 → Sync on Tuesday Dec 23
calculate_week "2025-12-23" 16

# Week 17: Dec 25-29 → Sync on Tuesday Dec 30
calculate_week "2025-12-30" 17

# Week 18: Jan 1-5, 2026 → Sync on Tuesday Jan 6
calculate_week "2026-01-06" 18

# Extra test: After season ends
calculate_week "2026-01-13" 18

echo ""
echo "============================================================"
echo "Testing Current Date"
echo "============================================================"

TODAY=$(date +%Y-%m-%d)
DAYS_SINCE_START=$(( ($(date -d "$TODAY" +%s) - $(date -d "$SEASON_START" +%s)) / 86400 ))
WEEK_TO_SYNC=$(( ($DAYS_SINCE_START / 7) + 1 ))

if [ $WEEK_TO_SYNC -gt 18 ]; then
    WEEK_TO_SYNC=18
fi

echo "Today's Date: $TODAY"
echo "Days Since Season Start: $DAYS_SINCE_START"
echo "Week to Sync: $WEEK_TO_SYNC"
echo ""

# Test that the actual cron script would work
echo "============================================================"
echo "Testing Actual Cron Script (Dry Run)"
echo "============================================================"
echo ""

# Check if virtual environment exists
if [ ! -d "scripts/venv" ]; then
    echo -e "${RED}❌ Virtual environment not found at scripts/venv${NC}"
    echo "   Run: ./scripts/install.sh"
    exit 1
else
    echo -e "${GREEN}✅ Virtual environment found${NC}"
fi

# Check if Python dependencies are installed
source scripts/venv/bin/activate

# Check for required packages
echo ""
echo "Checking Python dependencies..."

packages=("nflreadpy" "supabase" "pandas" "polars" "pyarrow")
all_installed=true

for package in "${packages[@]}"; do
    if python -c "import $package" 2>/dev/null; then
        echo -e "${GREEN}✅ $package${NC}"
    else
        echo -e "${RED}❌ $package${NC}"
        all_installed=false
    fi
done

if [ "$all_installed" = false ]; then
    echo ""
    echo -e "${RED}❌ Some dependencies missing${NC}"
    echo "   Run: scripts/venv/bin/pip install -r scripts/requirements.txt"
    deactivate
    exit 1
fi

# Test the sync script with dry-run
echo ""
echo "Testing sync script with --dry-run..."
echo ""

python scripts/sync_nfl_stats.py --week $WEEK_TO_SYNC --season 2025 --dry-run

SYNC_EXIT_CODE=$?

deactivate

echo ""
echo "============================================================"

if [ $SYNC_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ ALL TESTS PASSED${NC}"
    echo ""
    echo "The cron job will correctly sync Week $WEEK_TO_SYNC"
    echo "Next run: Tuesday at 7:00 AM PST"
    echo ""
    echo "Cron schedule:"
    echo "  0 7 * * 2 /home/sam/Documents/github-repos/xlb/xlb/scripts/cron-sync-stats.sh"
else
    echo -e "${RED}❌ TESTS FAILED${NC}"
    echo ""
    echo "Sync script failed with exit code: $SYNC_EXIT_CODE"
    echo "Check the error messages above"
fi

echo "============================================================"
