# Mock Season Testing Guide

## 🎯 Purpose
Test the complete fantasy football system with 3 users (You, Joe, Daron) for a few weeks before rolling out to all 72 participants.

## 👥 Test Participants

1. **Your Email** - (add your email)
2. **Joe Landziak** - jlandziak@xlbenefits.com
3. **Daron Pitts** - dpitts@xlbenefits.com

## ✅ Scoring Persistence & Accessibility Verified

### How Scoring Works

**Data Flow:**
```
Week Ends (Monday Night)
  ↓
Tuesday: Run sync_nfl_stats.py
  ↓
Stats saved to player_weekly_stats table (PERSISTENT)
  ↓
Users can view scores via magic links
  ↓
Scores displayed in 3 places:
  1. Lineup submission page (shows your players' weekly points)
  2. Results page (weekly/round/season leaderboards)
  3. Rosters page (all lineups with scores)
```

**Persistence:** All scores are stored in Supabase database tables:
- `player_weekly_stats` - Individual player points per week
- `weekly_scores` - Team total points per week (calculated from lineup)
- Data persists indefinitely and can be viewed at any time

### Magic Links Are Reusable ✓

**After Lineup Submission:**
1. User clicks magic link → sees success screen
2. Can click "View Results" to see leaderboard
3. Can bookmark magic link and return anytime
4. Magic link remains valid for 7 days (even after submission)
5. Form shows:
   - Locked lineup (cannot be changed)
   - All selected players
   - Weekly points next to each player (Tuesdays onward)
   - Total team score

**Links Already Sent:**
- Joe: https://xlb.vercel.app/fantasy-football/submit?token=ugrH67F6EgKU00jjmOCw4fjjlDQW718wPXfpxG_wjdA
- Daron: https://xlb.vercel.app/fantasy-football/submit?token=DNB8oQjN-mxcRJmzRrWM2sGHWU_34CZHHAuP7N-CDHY

## 📅 Week-by-Week Testing Plan

### Week 1: Setup & Lineup Submission (Current Week)

**Tasks:**
1. ✅ Send magic links to all 3 test users (DONE via Nylas)
2. Have each user submit their lineup
3. Verify lineups are locked after submission
4. Confirm magic links still accessible after submission

**Success Criteria:**
- All 3 lineups submitted and saved to database
- Forms show as locked when revisiting magic link
- No errors during submission

### Week 2: First Scoring Test

**Monday Night (after games):**
```bash
cd ~/Documents/github-repos/xlb/xlb
source scripts/venv/bin/activate
python scripts/sync_nfl_stats.py --week 7 --season 2024
deactivate
```

**Tuesday:**
1. Check that stats imported successfully:
   - Visit `/admin/scoring` to verify stats in database
   - Or query database: `SELECT * FROM player_weekly_stats WHERE week_number = 7 LIMIT 10;`

2. **Test Score Viewing:**
   - Each user clicks their magic link
   - Verify weekly points appear next to player names (green badges: "15.3 pts")
   - Check Results page: `/fantasy-football/results`
   - Verify Weekly Results tab shows all 3 teams with scores
   - Check leaderboard ranking is correct

**Success Criteria:**
- Stats sync completes without errors
- All 3 users can see their weekly scores via magic link
- Leaderboard displays correct rankings
- Tie-breaker rules work (DEF points, then K points)

### Week 3: Scoring Persistence Test

**Monday Night:**
```bash
source scripts/venv/bin/activate
python scripts/sync_nfl_stats.py --week 8 --season 2024
deactivate
```

**Tuesday:**
1. Verify Week 7 scores still visible
2. Verify Week 8 scores appear
3. Check Round 2 standings accumulate both weeks
4. Test sorting/filtering on Results page

**Success Criteria:**
- Week 7 scores persist and remain visible
- Week 8 scores added correctly
- Round totals = Week 7 + Week 8 combined
- All users can access both weeks via magic links

### Week 4 (Optional): Full System Test

**Complete all features:**
- Weekly winner announcement ($25)
- Round standings (if Round 2 ends)
- Test search functionality on Results page
- Verify all 3 magic links still work after multiple weeks

## 🔍 What to Test

### 1. Lineup Submission Flow
- [ ] Magic link email received
- [ ] Link opens submission page
- [ ] Form pre-populates user info (name, email, team name)
- [ ] Player dropdowns show top 40 per position
- [ ] Search works in dropdowns
- [ ] Elite players marked with gold text + ELITE badge
- [ ] Elite player counter updates (max 2)
- [ ] Cannot select more than 2 elite players
- [ ] All 8 positions required
- [ ] Submit button works
- [ ] Success screen displays
- [ ] Lineup locked after first submission

### 2. Score Viewing
- [ ] Magic link works after submission
- [ ] Form shows locked lineup
- [ ] Weekly points appear on Tuesdays (green badges)
- [ ] Points accurate per player
- [ ] Total team score calculated correctly

### 3. Results Page (`/fantasy-football/results`)
- [ ] Weekly tab shows current week rankings
- [ ] Can select different weeks from dropdown
- [ ] Search filters teams correctly
- [ ] Sortable columns work (click headers)
- [ ] Round tab accumulates multiple weeks
- [ ] Season tab shows overall standings
- [ ] Tie-breakers work correctly (DEF > K points)

### 4. Data Persistence
- [ ] Stats remain after page refresh
- [ ] Old week scores don't disappear when new week synced
- [ ] Magic links work days/weeks after creation
- [ ] Database maintains all historical data

## 🛠️ Admin Testing Checklist

### Stats Sync Process
```bash
# 1. Activate Python environment
cd ~/Documents/github-repos/xlb/xlb
source scripts/venv/bin/activate

# 2. Sync specific week (Tuesdays after MNF)
python scripts/sync_nfl_stats.py --week 7 --season 2024

# 3. Check output for errors
# Should see:
# - "✅ Fetched 400+ player stats"
# - "✅ Matched X players to database (85%+ similarity)"
# - "✅ Calculated fantasy points using PPR scoring"
# - "✅ Upserted X stats to Supabase"

# 4. Deactivate when done
deactivate
```

### Database Queries (Verification)

**Check player stats imported:**
```sql
SELECT
  p.name,
  p.position,
  p.team,
  pws.week_number,
  pws.calculated_points
FROM player_weekly_stats pws
JOIN players p ON pws.player_id = p.id
WHERE pws.week_number = 7
ORDER BY pws.calculated_points DESC
LIMIT 20;
```

**Check team scores calculated:**
```sql
SELECT
  u.team_name,
  ws.week_number,
  ws.total_points,
  ws.qb_points,
  ws.rb1_points,
  ws.rb2_points,
  ws.wr1_points,
  ws.wr2_points,
  ws.te_points,
  ws.k_points,
  ws.def_points
FROM weekly_scores ws
JOIN lineups l ON ws.lineup_id = l.id
JOIN users u ON l.user_id = u.id
WHERE ws.week_number = 7
ORDER BY ws.total_points DESC;
```

**Check all magic links:**
```sql
SELECT
  u.name,
  u.email,
  u.team_name,
  ml.token,
  ml.expires_at,
  ml.created_at
FROM magic_links ml
JOIN users u ON ml.user_id = u.id
JOIN rounds r ON ml.round_id = r.id
WHERE r.is_active = true;
```

**Check lineups submitted:**
```sql
SELECT
  u.name,
  u.team_name,
  l.submitted_at,
  l.qb_id,
  l.rb1_id,
  l.rb2_id
FROM lineups l
JOIN users u ON l.user_id = u.id
WHERE l.round_id = '4a4a8d7d-dead-4181-9a30-abfa8f59412f'; -- Round 2 ID
```

## 🐛 Common Issues & Solutions

### Issue: Stats Not Appearing After Sync

**Solution:**
```bash
# Check Python script ran successfully
python scripts/sync_nfl_stats.py --week 7 --dry-run
# Look for error messages in output

# Verify player matching
# Script should show 85%+ match rate
# If low, check player names in database vs nflreadpy
```

### Issue: Weekly Points Not Showing on Form

**Checks:**
1. Is it Tuesday or later? (Sunday-Monday scores hidden)
2. Check current week calculation (based on Sept 4, 2025 season start)
3. Verify `player_weekly_stats` has data for that week

**Fix:**
```javascript
// In submit/page.tsx, check:
const dayOfWeek = today.getDay(); // Should be 2+ for Tuesday
const currentWeek = Math.min(Math.floor(daysSinceStart / 7) + 1, 18);
console.log({ dayOfWeek, currentWeek, showWeeklyScores });
```

### Issue: Magic Link Expired

**Solution:**
```bash
# Regenerate magic link
scripts/venv/bin/python scripts/send_magic_link_nylas.py
# Update users array in script first
```

### Issue: Lineup Not Locked After Submission

**Check:**
```sql
SELECT * FROM lineups WHERE user_id = 'USER_UUID' AND round_id = 'ROUND_UUID';
```

If lineup exists but form not locking, check `checkForExistingLineup()` function in submit/page.tsx.

## 📊 Success Metrics

After 3 weeks of testing, confirm:

**Technical:**
- ✅ 100% stat sync success rate (no failed weeks)
- ✅ 100% magic link accessibility (all users can view scores)
- ✅ 0 data loss (all historical scores preserved)
- ✅ Correct scoring calculations (manual spot-check vs ESPN/NFL.com)

**User Experience:**
- ✅ Easy lineup submission (< 5 min per user)
- ✅ Clear score visibility (users understand their points)
- ✅ Mobile-friendly (tested on phones)
- ✅ No confusion about locked lineups

**Business Logic:**
- ✅ Elite player limits enforced
- ✅ Tie-breaker rules work correctly
- ✅ Weekly winner identified correctly
- ✅ Round totals accumulate properly

## 🚀 Go-Live Readiness Checklist

Before inviting all 72 participants:

- [ ] 3+ weeks of successful testing completed
- [ ] All 3 test users can view scores
- [ ] No database errors or data loss
- [ ] Stats sync runs smoothly every week
- [ ] Magic link system works reliably
- [ ] Leaderboards display correctly
- [ ] Mobile experience is good
- [ ] Backup plan documented (if stats sync fails)
- [ ] Support email ready (jlandziak@xlbenefits.com)
- [ ] Prize payment process confirmed

## 📞 Test User Contacts

**Questions During Testing:**
- Joe Landziak: jlandziak@xlbenefits.com
- Daron Pitts: dpitts@xlbenefits.com
- Admin/Dev: (your email)

**Weekly Sync Schedule:**
Every Tuesday at 9 AM ET:
1. Run stats sync script
2. Verify results on leaderboard
3. Notify test users scores are ready
4. Collect feedback

## 📝 Testing Log Template

Keep track of each week:

```
Week 7 (Nov 5-11, 2024)
- Lineups submitted: 3/3 ✅
- Stats sync: Success ✅
- Scores visible: Yes ✅
- Issues: None
- Notes: Joe's team won with 125.4 pts

Week 8 (Nov 12-18, 2024)
- Lineups locked: 3/3 ✅
- Stats sync: Success ✅
- Scores visible: Yes ✅
- Round 2 totals: Accurate ✅
- Issues: None
- Notes: Daron took lead in round standings
```

## 🎉 After Successful Testing

**Next Steps:**
1. Import remaining 69 users to database
2. Generate magic links for all 72 participants
3. Send batch emails via Nylas
4. Set up automated weekly reminders
5. Prepare weekly winner notifications
6. Document support process for Joe/Daron

**Communication Plan:**
- Week 1: Welcome email with magic links
- Every Tuesday: "Scores are in!" email
- Every Wednesday: Weekly winner announcement
- End of Round: Round standings email
- End of Season: Championship celebration email

---

## Quick Reference Links

- **Production App:** https://xlb.vercel.app
- **Results Page:** https://xlb.vercel.app/fantasy-football/results
- **Rosters Page:** https://xlb.vercel.app/fantasy-football/rosters
- **Admin Dashboard:** https://xlb.vercel.app/admin/scoring

**Magic Links Sent:**
- Joe: https://xlb.vercel.app/fantasy-football/submit?token=ugrH67F6EgKU00jjmOCw4fjjlDQW718wPXfpxG_wjdA
- Daron: https://xlb.vercel.app/fantasy-football/submit?token=DNB8oQjN-mxcRJmzRrWM2sGHWU_34CZHHAuP7N-CDHY

**Database:** Supabase - https://exzeayeoosiabwhgyquq.supabase.co
