# ✅ Automated Scoring System - Complete

## Overview

Your XL Benefits Fantasy Football league now has **fully automated** stats sync and score calculation. Every Tuesday morning, the system will:

1. ✅ Import NFL player stats from nflreadpy
2. ✅ Calculate fantasy scores for all lineups
3. ✅ Update cumulative round and season totals
4. ✅ Make scores immediately visible to users

**No manual intervention required!**

---

## 🔄 What Happens Every Tuesday at 9:00 AM

### Step 1: Stats Sync (Automatic)
```
📊 Fetch NFL stats for previous week from nflreadpy
   ↓
🔍 Match ~300-400 players to database (fuzzy matching)
   ↓
📈 Calculate PPR fantasy points
   ↓
💾 Upsert to player_weekly_stats table
   ↓
✅ Stats sync complete
```

### Step 2: Score Calculation (Automatic)
```
📋 Fetch all lineups from database
   ↓
🔢 For each lineup, sum player points
   ↓
📊 Calculate round cumulative scores
   ↓
📊 Calculate season cumulative scores
   ↓
💾 Upsert to weekly_scores table
   ↓
✅ Scores immediately visible via magic links
```

---

## 📁 Files Created

### Core Scripts

**`scripts/calculate_scores.py`** (NEW)
- Calculates scores for all lineups automatically
- Fetches player stats from `player_weekly_stats` table
- Calculates individual position points
- Calculates round and season cumulative totals
- Upserts to `weekly_scores` table
- Supports dry-run mode for testing

**`scripts/cron-sync-stats.sh`** (UPDATED)
- Now runs both stats sync AND score calculation
- Automatic NFL week calculation
- Error handling for both steps
- Complete logging to `logs/` directory

**`scripts/sync_nfl_stats.py`** (EXISTING)
- Imports NFL stats from nflreadpy
- Handles bye weeks automatically
- Fuzzy player matching
- PPR scoring calculation

**`scripts/send_sam_magic_link.py`** (NEW)
- Quick script to send magic link to sam@edw4rds.com
- Uses production URL (https://xlb.vercel.app)

---

## 🗄️ Database Tables

### Table 1: `player_weekly_stats`
Populated by `sync_nfl_stats.py`

**Purpose:** Store individual player statistics for each week

**Key Fields:**
- `player_id` - Which player
- `week_number` - Which NFL week (1-18)
- `calculated_points` - PPR fantasy points
- All stat fields (passing_tds, rushing_yards, etc.)

**Example:**
```
player_id: uuid-123
week_number: 8
calculated_points: 24.50
passing_yards: 325
passing_tds: 2
```

### Table 2: `weekly_scores`
Populated by `calculate_scores.py`

**Purpose:** Store lineup scores for each week

**Key Fields:**
- `lineup_id` - Which user's lineup
- `week_number` - Which NFL week
- `qb_points`, `rb1_points`, etc. - Points by position
- `total_points` - Sum of all positions
- `round_cumulative_points` - Running total for round
- `season_cumulative_points` - Running total for season

**Example:**
```
lineup_id: uuid-456
week_number: 8
qb_points: 24.50
rb1_points: 18.20
total_points: 142.70
round_cumulative_points: 285.40
season_cumulative_points: 642.10
```

---

## 🧪 Testing Results

### Test Run: Week 8 (October 30, 2025)

**Stats Sync:**
- ✅ 892 players fetched from nflreadpy
- ✅ 306 players matched to database
- ✅ 6 bye week teams handled (ARI, DET, JAX, LA, LV, SEA)
- ✅ All stats upserted to `player_weekly_stats`

**Score Calculation:**
- ✅ 5 lineups processed
- ✅ 324 player stats retrieved
- ✅ Individual position points calculated
- ✅ Round and season cumulative totals updated
- ✅ All scores upserted to `weekly_scores`

**Total Time:** ~3 seconds end-to-end

---

## 📋 Cron Job Details

**Schedule:** Every Tuesday at 9:00 AM ET

**Cron Expression:**
```
0 9 * * 2 /home/sam/Documents/github-repos/xlb/xlb/scripts/cron-sync-stats.sh
```

**What It Does:**
1. Calculates current NFL week based on season start (Sept 4, 2025)
2. Determines which week to sync (previous week)
3. Activates Python virtual environment
4. Runs stats sync
5. Runs score calculation
6. Deactivates virtual environment
7. Logs everything to `logs/stats-sync-YYYY-MM-DD.log`

**Verify It's Installed:**
```bash
crontab -l | grep "Fantasy Football"
```

Should show:
```
# XL Benefits Fantasy Football - NFL Stats Sync (Every Tuesday at 9:00 AM)
0 9 * * 2 /home/sam/Documents/github-repos/xlb/xlb/scripts/cron-sync-stats.sh
```

---

## 📊 Mock Season Testing

### Current Test Users (Magic Links Sent)

1. **Sam Edwards** - sam@edw4rds.com
   - Link: https://xlb.vercel.app/fantasy-football/submit?token=...
   - Expires: Nov 6, 2025

2. **Joe Landziak** - jlandziak@xlbenefits.com
   - Link: https://xlb.vercel.app/fantasy-football/submit?token=...
   - Expires: Nov 6, 2025

3. **Daron Pitts** - dpitts@xlbenefits.com
   - Link: https://xlb.vercel.app/fantasy-football/submit?token=...
   - Expires: Nov 6, 2025

### Testing Plan

**Week 8 (Oct 30 - Nov 3):**
- ✅ All 3 users submit lineups
- ✅ Wait for Tuesday Nov 4 at 9:00 AM
- ✅ Verify stats sync runs automatically
- ✅ Verify scores calculate automatically
- ✅ Check magic links to see scores

**Week 9 (Nov 4 - Nov 10):**
- ✅ Verify previous week scores are visible
- ✅ Wait for Tuesday Nov 11 at 9:00 AM
- ✅ Verify Week 9 scores appear

**Week 10 (Nov 11 - Nov 17):**
- ✅ Check cumulative scores are accurate
- ✅ Verify round totals are correct
- ✅ Ready for full league rollout

---

## 🔍 Monitoring

### View Logs
```bash
# View latest log
tail -f ~/Documents/github-repos/xlb/xlb/logs/stats-sync-*.log

# View specific date
cat ~/Documents/github-repos/xlb/xlb/logs/stats-sync-2025-11-04.log
```

### Verify Stats Were Imported
```bash
# Check if stats exist for Week 8
# Go to Supabase dashboard → Table Editor → player_weekly_stats
# Filter: week_number = 8
# Should see ~306 records
```

### Verify Scores Were Calculated
```bash
# Check if scores exist for Week 8
# Go to Supabase dashboard → Table Editor → weekly_scores
# Filter: week_number = 8
# Should see 5 records (one per lineup)
```

---

## 🐛 Troubleshooting

### Issue: Cron Job Didn't Run

**Check if installed:**
```bash
crontab -l | grep "Fantasy Football"
```

**Reinstall if needed:**
```bash
~/Documents/github-repos/xlb/xlb/scripts/install-cron.sh
```

### Issue: Stats Synced But Scores Not Calculated

**Check log file:**
```bash
cat ~/Documents/github-repos/xlb/xlb/logs/stats-sync-$(date +%Y-%m-%d).log
```

**Manually run score calculation:**
```bash
source ~/Documents/github-repos/xlb/xlb/scripts/venv/bin/activate
python ~/Documents/github-repos/xlb/xlb/scripts/calculate_scores.py --week 8 --season 2025
deactivate
```

### Issue: Wrong Week Synced

**Manual override for specific week:**
```bash
source ~/Documents/github-repos/xlb/xlb/scripts/venv/bin/activate
python ~/Documents/github-repos/xlb/xlb/scripts/sync_nfl_stats.py --week 7 --season 2025
python ~/Documents/github-repos/xlb/xlb/scripts/calculate_scores.py --week 7 --season 2025
deactivate
```

---

## 🎯 What Changed from Before

### Before (Manual Process)
1. ❌ Run stats sync manually
2. ❌ Wait for it to finish
3. ❌ Go to `/admin/scoring` page
4. ❌ Click "Calculate All Scores" button
5. ❌ Wait for it to finish
6. ❌ Notify users scores are ready

### After (Fully Automated)
1. ✅ **Nothing** - it all happens automatically every Tuesday at 9 AM
2. ✅ Users can check their magic links anytime after 9 AM
3. ✅ Scores are immediately visible

---

## 📚 Related Documentation

- **`CRON_SETUP_DOCUMENTATION.md`** - Complete cron job documentation
- **`MOCK_SEASON_TESTING_GUIDE.md`** - Testing guide for 3-user beta

---

## ✨ Summary

**What You Get:**
- ✅ Fully automated NFL stats import (nflreadpy)
- ✅ Fully automated score calculation
- ✅ Automatic cumulative score tracking
- ✅ Immediate score visibility via magic links
- ✅ Complete logging for monitoring
- ✅ Zero manual intervention required

**Every Tuesday at 9:00 AM:**
- Stats for previous week automatically imported
- All lineup scores automatically calculated
- Cumulative totals automatically updated
- Users can immediately check their scores

**Your Mock Season is Ready!**
- 3 users (Sam, Joe, Daron) have magic links
- Submit lineups anytime before games start
- Scores will automatically appear Tuesday after games finish
- Test for 2-3 weeks before full league rollout

---

**Status:** ✅ COMPLETE AND TESTED

**Installation Date:** October 30, 2025
**Last Tested:** October 30, 2025 (Week 8)
**Next Auto Run:** Tuesday, November 4, 2025 at 9:00 AM
