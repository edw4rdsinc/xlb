#!/bin/bash
#
# Install NFL Stats Sync Cron Job
# Run this script to add the Tuesday 9 AM cron job
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
CRON_SCRIPT="$SCRIPT_DIR/cron-sync-stats.sh"

echo "================================================"
echo "Installing NFL Stats Sync Cron Job"
echo "================================================"
echo ""

# Check if cron script exists
if [ ! -f "$CRON_SCRIPT" ]; then
    echo "❌ Error: Cron script not found at $CRON_SCRIPT"
    exit 1
fi

# Make cron script executable
chmod +x "$CRON_SCRIPT"
echo "✅ Made cron script executable"

# Create logs directory
mkdir -p "$PROJECT_DIR/logs"
echo "✅ Created logs directory"

# Check if cron job already exists
CRON_CHECK=$(crontab -l 2>/dev/null | grep -c "cron-sync-stats.sh" || true)

if [ "$CRON_CHECK" -gt 0 ]; then
    echo ""
    echo "⚠️  Cron job already exists!"
    echo ""
    echo "Current cron jobs with 'cron-sync-stats.sh':"
    crontab -l | grep "cron-sync-stats.sh"
    echo ""
    read -p "Do you want to replace it? (y/n) " -n 1 -r
    echo ""

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Installation cancelled."
        exit 0
    fi

    # Remove existing cron job
    crontab -l | grep -v "cron-sync-stats.sh" | crontab -
    echo "✅ Removed existing cron job"
fi

# Add new cron job
# Format: minute hour day month weekday command
# 0 9 * * 2 = Every Tuesday at 9:00 AM
(crontab -l 2>/dev/null; echo "# XL Benefits Fantasy Football - NFL Stats Sync (Every Tuesday at 9:00 AM)"; echo "0 9 * * 2 $CRON_SCRIPT") | crontab -

echo "✅ Added cron job to crontab"
echo ""
echo "================================================"
echo "Installation Complete!"
echo "================================================"
echo ""
echo "Cron Schedule: Every Tuesday at 9:00 AM ET"
echo "Script: $CRON_SCRIPT"
echo "Logs: $PROJECT_DIR/logs/stats-sync-YYYY-MM-DD.log"
echo ""
echo "Current crontab:"
crontab -l | grep -A 1 "XL Benefits Fantasy Football"
echo ""
echo "To test the cron job manually:"
echo "  $CRON_SCRIPT"
echo ""
echo "To view logs:"
echo "  tail -f $PROJECT_DIR/logs/stats-sync-*.log"
echo ""
echo "To remove the cron job:"
echo "  crontab -e"
echo "  (delete the line with 'cron-sync-stats.sh')"
echo ""
