# NFL Stats Sync - Automated Cron Job Documentation

## 📅 Overview

The NFL stats sync runs **automatically every Tuesday at 7:00 AM PST** to import the previous week's player statistics from nflreadpy and update the fantasy football scores.

## ✅ Installation Status

**Status:** ✅ INSTALLED AND WORKING

**Cron Schedule:**
```
0 9 * * 2 /home/sam/Documents/github-repos/xlb/xlb/scripts/cron-sync-stats.sh
```

This translates to:
- **Minute:** 0 (top of the hour)
- **Hour:** 9 (9 AM)
- **Day of Month:** * (any day)
- **Month:** * (any month)
- **Day of Week:** 2 (Tuesday, where 0=Sunday)

## 🛠️ How It Works

### 1. Automatic Week Calculation
The cron script automatically calculates which NFL week to sync based on:
- **Season Start:** September 4, 2025 (Thursday Night Football)
- **Current Date:** Uses system date to determine days elapsed
- **Week Formula:** `(days_since_start / 7) + 1`
- **Auto Adjustment:** Syncs the **previous week** (Week N-1) since games just finished Monday night

### 2. Script Flow

```bash
Tuesday 7:00 AM PST
  ↓
Calculate current NFL week (e.g., Week 9)
  ↓
Determine week to sync (Week 8 - previous week)
  ↓
Activate Python virtual environment
  ↓
Run: python scripts/sync_nfl_stats.py --week 8 --season 2025
  ↓
Fetch stats from nflreadpy (free, no API key)
  ↓
Match players to database (fuzzy matching)
  ↓
Calculate PPR fantasy points
  ↓
Upsert to player_weekly_stats table
  ↓
✅ Stats sync complete
  ↓
Run: python scripts/calculate_scores.py --week 8 --season 2025
  ↓
Fetch all lineups from database
  ↓
For each lineup, sum player points from player_weekly_stats
  ↓
Calculate round and season cumulative scores
  ↓
Upsert to weekly_scores table
  ↓
✅ Score calculation complete
  ↓
Deactivate virtual environment
  ↓
Log results to: logs/stats-sync-YYYY-MM-DD.log
  ↓
Exit with success/failure code
```

### 3. Files Involved

**Main Script:**
- `/home/sam/Documents/github-repos/xlb/xlb/scripts/cron-sync-stats.sh`
  - Cron wrapper with logging and error handling
  - Calculates NFL week automatically
  - Manages Python virtual environment

**Python Stats Sync:**
- `/home/sam/Documents/github-repos/xlb/xlb/scripts/sync_nfl_stats.py`
  - Fetches NFL stats from nflreadpy
  - Handles bye weeks (6 teams on bye Week 8)
  - Aggregates team defense stats
  - Matches players using fuzzy matching (85% similarity)
  - Calculates PPR fantasy points
  - Upserts to player_weekly_stats table

**Python Score Calculation:**
- `/home/sam/Documents/github-repos/xlb/xlb/scripts/calculate_scores.py`
  - Fetches all lineups from database
  - Retrieves player stats from player_weekly_stats for the week
  - Calculates total points for each lineup
  - Calculates round and season cumulative scores
  - Upserts to weekly_scores table

**Install Script:**
- `/home/sam/Documents/github-repos/xlb/xlb/scripts/install-cron.sh`
  - One-time setup to install cron job
  - Checks for existing jobs
  - Creates logs directory

**Log Files:**
- `/home/sam/Documents/github-repos/xlb/xlb/logs/stats-sync-YYYY-MM-DD.log`
  - One log file per day
  - Contains full sync output
  - Includes success/failure status

## 📊 What Gets Synced & Calculated

### Week 8 Example (Last Test Run)
**Stats Imported:**
- **Total Players:** 892 from nflreadpy
- **Matched to DB:** 306 players
- **Bye Week Teams:** 6 (ARI, DET, JAX, LA, LV, SEA)
- **Team Defense:** 1 (aggregated sacks, interceptions, etc.)
- **Unmatched:** 587 (mostly defensive players, punters not in fantasy)

**Scores Calculated:**
- **Lineups Processed:** 5 lineups
- **Weekly Scores:** Calculated for each lineup
- **Cumulative Scores:** Round and season totals updated

### Data Stored in Supabase

**Table 1: `player_weekly_stats`** (Individual Player Stats)

**Columns:**
- `player_id` - References players table
- `week_number` - NFL week (1-18)
- `passing_tds`, `passing_yards`
- `rushing_tds`, `rushing_yards`
- `receiving_tds`, `receptions`, `receiving_yards`
- `two_point_conversions`
- `field_goals`, `pats` (kickers)
- `def_tds`, `interceptions`, `safeties`, `sacks` (defense)
- `calculated_points` - PPR scoring formula result

**Table 2: `weekly_scores`** (Lineup Scores)

**Columns:**
- `lineup_id` - References lineups table
- `week_number` - NFL week (1-18)
- `qb_points`, `rb1_points`, `rb2_points`, `wr1_points`, `wr2_points`
- `te_points`, `k_points`, `def_points`
- `total_points` - Sum of all position points
- `round_cumulative_points` - Running total for current round
- `season_cumulative_points` - Running total for entire season

## 🔍 Monitoring & Verification

### Check if Cron Job is Running

```bash
# View current crontab
crontab -l | grep "Fantasy Football"

# Check last log file
tail -50 ~/Documents/github-repos/xlb/xlb/logs/stats-sync-*.log

# View all log files
ls -lh ~/Documents/github-repos/xlb/xlb/logs/
```

### Verify Stats Were Imported

**Via Supabase Dashboard:**
1. Go to https://exzeayeoosiabwhgyquq.supabase.co
2. Navigate to Table Editor → `player_weekly_stats`
3. Filter by `week_number = 8`
4. Should see ~306 records

**Via SQL:**
```sql
SELECT COUNT(*)
FROM player_weekly_stats
WHERE week_number = 8;
-- Should return: 306

SELECT
  p.name,
  p.position,
  pws.calculated_points
FROM player_weekly_stats pws
JOIN players p ON pws.player_id = p.id
WHERE pws.week_number = 8
ORDER BY pws.calculated_points DESC
LIMIT 20;
-- Should show top scorers for Week 8
```

### Check Cron Execution History

```bash
# View cron logs (if configured)
grep CRON /var/log/syslog | grep "cron-sync-stats"

# Or check mail for cron output
mail
```

## 🐛 Troubleshooting

### Issue: Cron Job Not Running

**Check Crontab:**
```bash
crontab -l
# Should see: 0 9 * * 2 /home/sam/Documents/github-repos/xlb/xlb/scripts/cron-sync-stats.sh
```

**Reinstall if Missing:**
```bash
cd ~/Documents/github-repos/xlb/xlb
./scripts/install-cron.sh
```

### Issue: Script Runs But Fails

**Check Log File:**
```bash
cat ~/Documents/github-repos/xlb/xlb/logs/stats-sync-$(date +%Y-%m-%d).log
```

**Common Failures:**
1. **Python venv not found** - Run `./scripts/install.sh` first
2. **NaN conversion errors** - Fixed in latest version (uses `safe_int()`)
3. **nflreadpy import error** - Reinstall: `pip install nflreadpy`
4. **Supabase connection error** - Check `.env.local` credentials

### Issue: Wrong Week Synced

**Manual Override:**
```bash
# Run manually for specific week
source ~/Documents/github-repos/xlb/xlb/scripts/venv/bin/activate
python ~/Documents/github-repos/xlb/xlb/scripts/sync_nfl_stats.py --week 7 --season 2025
deactivate
```

### Issue: Stats Not Showing in App

**Good news: This is now automated!**
- Stats are automatically synced to `player_weekly_stats` table
- Scores are automatically calculated and written to `weekly_scores` table
- Users can immediately view scores via their magic links

**Manual calculation (if needed):**
```bash
# Calculate scores for a specific week manually
source scripts/venv/bin/activate
python scripts/calculate_scores.py --week 8 --season 2025
deactivate
```

## 🧪 Manual Testing

### Test the Cron Script Directly

```bash
# Run as if cron executed it
~/Documents/github-repos/xlb/xlb/scripts/cron-sync-stats.sh

# Check exit code
echo $?
# Should be 0 for success
```

### Dry Run (No Database Changes)

```bash
cd ~/Documents/github-repos/xlb/xlb
source scripts/venv/bin/activate
python scripts/sync_nfl_stats.py --week 8 --season 2025 --dry-run
deactivate
```

### Force Sync Specific Week

```bash
source scripts/venv/bin/activate
python scripts/sync_nfl_stats.py --week 8 --season 2025
deactivate
```

## 📝 Weekly Schedule

### NFL Season Timeline

| Week | Games Dates | Stats Sync | Notes |
|------|-------------|------------|-------|
| 1 | Sept 4-8 | Tuesday Sept 9, 9 AM | Season opener |
| 2 | Sept 11-15 | Tuesday Sept 16, 9 AM | |
| 3 | Sept 18-22 | Tuesday Sept 23, 9 AM | |
| 4 | Sept 25-29 | Tuesday Sept 30, 9 AM | |
| 5 | Oct 2-6 | Tuesday Oct 7, 9 AM | |
| 6 | Oct 9-13 | Tuesday Oct 14, 9 AM | |
| 7 | Oct 16-20 | Tuesday Oct 21, 9 AM | |
| 8 | Oct 23-27 | Tuesday Oct 28, 9 AM | |
| 9 | Oct 30 - Nov 3 | Tuesday Nov 4, 9 AM | |
| ... | ... | ... | |
| 18 | Jan 4-5, 2026 | Tuesday Jan 6, 9 AM | Regular season ends |

**Bye Weeks:** Weeks 5-14 (varies by team)

## 🔧 Maintenance

### Update Season Dates

Edit `scripts/cron-sync-stats.sh`:
```bash
# Line 25-26
SEASON_START="2025-09-04"  # Change for 2026 season
```

### Change Cron Schedule

```bash
# Edit crontab
crontab -e

# Examples:
# Every Tuesday at 6 AM:  0 6 * * 2 /path/to/script
# Every day at 9 AM:      0 9 * * * /path/to/script
# Twice a week (Tue/Fri): 0 9 * * 2,5 /path/to/script
```

### Remove Cron Job

```bash
crontab -e
# Delete the line with: cron-sync-stats.sh
# Save and exit
```

Or:
```bash
crontab -l | grep -v "cron-sync-stats" | crontab -
```

### Email Notifications (Optional)

Uncomment lines in `cron-sync-stats.sh`:

```bash
# Line 92-94 (success notification)
echo "Stats sync for Week $WEEK_TO_SYNC completed successfully" | mail -s "✅ NFL Stats Sync Success" sam@edw4rds.com

# Line 99-101 (failure notification)
echo "Stats sync failed. Check logs at $LOG_FILE" | mail -s "❌ NFL Stats Sync Failed" sam@edw4rds.com
```

**Requires `mail` command to be configured.**

## 📞 Support

**Cron Issues:**
- Check system logs: `/var/log/syslog`
- Verify cron service: `systemctl status cron`
- Test script manually: Run `cron-sync-stats.sh` directly

**Stats Sync Issues:**
- Check script logs: `logs/stats-sync-*.log`
- Review Python errors in log file
- Verify Supabase connection
- Confirm nflreadpy is working: `python -c "import nflreadpy; print('OK')"`

**Database Issues:**
- Verify credentials in `.env.local`
- Check Supabase dashboard for errors
- Review row count: `SELECT COUNT(*) FROM player_weekly_stats WHERE week_number = 8`

## ✅ Success Metrics

After each Tuesday sync:

- ✅ Cron job executes at 7:00 AM PST
- ✅ Log file created: `logs/stats-sync-YYYY-MM-DD.log`
- ✅ ~300-400 player stats imported to `player_weekly_stats`
- ✅ All lineup scores calculated and written to `weekly_scores`
- ✅ Round and season cumulative scores updated
- ✅ Exit code: 0 (success)
- ✅ No errors in log file

## 🎯 What Happens Automatically

**Every Tuesday at 7:00 AM PST:**
1. ✅ **Stats Sync** - NFL player stats imported from nflreadpy
2. ✅ **Score Calculation** - All lineup scores calculated automatically
3. ✅ **Cumulative Updates** - Round and season totals updated
4. ✅ **Immediate Visibility** - Scores visible to users via magic links
5. ✅ **Logging** - Complete process logged to `logs/stats-sync-YYYY-MM-DD.log`

**No manual intervention required!** Users can check their magic links anytime after 7:00 AM PST Tuesday to see their scores.

---

**Installation Date:** October 30, 2025
**Installed By:** Sam Edwards
**Cron Expression:** `0 9 * * 2` (Every Tuesday at 7:00 AM PST)
**Status:** ✅ Active and Working
