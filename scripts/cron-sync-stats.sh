#!/bin/bash
#
# Cron job wrapper for NFL stats sync
# Runs every Tuesday at 7:00 AM PST
#
# This script:
# 1. Calculates current NFL week based on season start date
# 2. Activates Python virtual environment
# 3. Runs stats sync script
# 4. Logs output to file
# 5. Sends email notification on success/failure (optional)

set -e  # Exit on error

# Project directory
PROJECT_DIR="/home/sam/Documents/github-repos/xlb/xlb"
LOG_DIR="$PROJECT_DIR/logs"
LOG_FILE="$LOG_DIR/stats-sync-$(date +%Y-%m-%d).log"

# Create logs directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Start logging
echo "================================================" | tee -a "$LOG_FILE"
echo "NFL Stats Sync - $(date)" | tee -a "$LOG_FILE"
echo "================================================" | tee -a "$LOG_FILE"

# Change to project directory
cd "$PROJECT_DIR" || exit 1

# Calculate current NFL week
# Season starts September 4, 2025 (Thursday Night Football)
# Week 1: Sept 4-10, Week 2: Sept 11-17, etc.
SEASON_START="2025-09-04"
TODAY=$(date +%Y-%m-%d)

# Calculate days since season start
DAYS_SINCE_START=$(( ($(date -d "$TODAY" +%s) - $(date -d "$SEASON_START" +%s)) / 86400 ))

# Calculate week number (1-18)
CURRENT_WEEK=$(( ($DAYS_SINCE_START / 7) + 1 ))

# Cap at week 18 (regular season)
if [ $CURRENT_WEEK -gt 18 ]; then
    CURRENT_WEEK=18
fi

# If season hasn't started yet, exit
if [ $CURRENT_WEEK -lt 1 ]; then
    echo "NFL season hasn't started yet. Exiting." | tee -a "$LOG_FILE"
    exit 0
fi

# Sync stats for the PREVIOUS week (games just finished Monday night)
WEEK_TO_SYNC=$(( $CURRENT_WEEK - 1 ))

# If we're in Week 1 Tuesday, there's nothing to sync yet
if [ $WEEK_TO_SYNC -lt 1 ]; then
    echo "Week 1 hasn't completed yet. Exiting." | tee -a "$LOG_FILE"
    exit 0
fi

echo "Current NFL Week: $CURRENT_WEEK" | tee -a "$LOG_FILE"
echo "Syncing stats for Week: $WEEK_TO_SYNC" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# Activate virtual environment
source "$PROJECT_DIR/scripts/venv/bin/activate"

# Run stats sync
echo "Running stats sync..." | tee -a "$LOG_FILE"
python "$PROJECT_DIR/scripts/sync_nfl_stats.py" --week $WEEK_TO_SYNC --season 2025 2>&1 | tee -a "$LOG_FILE"

SYNC_EXIT_CODE=${PIPESTATUS[0]}

if [ $SYNC_EXIT_CODE -ne 0 ]; then
    # Deactivate virtual environment
    deactivate

    echo "" | tee -a "$LOG_FILE"
    echo "================================================" | tee -a "$LOG_FILE"
    echo "❌ Stats sync failed with exit code: $SYNC_EXIT_CODE" | tee -a "$LOG_FILE"
    echo "   Check log file: $LOG_FILE" | tee -a "$LOG_FILE"

    # Optional: Send failure notification via email
    # Uncomment if you want email notifications
    # echo "Stats sync failed. Check logs at $LOG_FILE" | mail -s "❌ NFL Stats Sync Failed" sam@edw4rds.com

    exit 1
fi

# Stats sync succeeded, now calculate scores
echo "" | tee -a "$LOG_FILE"
echo "================================================" | tee -a "$LOG_FILE"
echo "✅ Stats sync completed successfully" | tee -a "$LOG_FILE"
echo "   Week $WEEK_TO_SYNC stats imported to Supabase" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

echo "Running score calculation..." | tee -a "$LOG_FILE"
python "$PROJECT_DIR/scripts/calculate_scores.py" --week $WEEK_TO_SYNC --season 2025 2>&1 | tee -a "$LOG_FILE"

CALC_EXIT_CODE=${PIPESTATUS[0]}

# Deactivate virtual environment
deactivate

echo "" | tee -a "$LOG_FILE"
echo "================================================" | tee -a "$LOG_FILE"

if [ $CALC_EXIT_CODE -eq 0 ]; then
    echo "✅ Score calculation completed successfully" | tee -a "$LOG_FILE"
    echo "   Week $WEEK_TO_SYNC scores calculated for all lineups" | tee -a "$LOG_FILE"

    # Optional: Send success notification via email
    # Uncomment if you want email notifications
    # echo "Stats sync and score calculation for Week $WEEK_TO_SYNC completed successfully" | mail -s "✅ NFL Stats & Scores Complete" sam@edw4rds.com

    exit 0
else
    echo "❌ Score calculation failed with exit code: $CALC_EXIT_CODE" | tee -a "$LOG_FILE"
    echo "   Stats were synced but scores not calculated" | tee -a "$LOG_FILE"
    echo "   Check log file: $LOG_FILE" | tee -a "$LOG_FILE"

    # Optional: Send failure notification via email
    # Uncomment if you want email notifications
    # echo "Score calculation failed. Check logs at $LOG_FILE" | mail -s "❌ Score Calculation Failed" sam@edw4rds.com

    exit 1
fi
