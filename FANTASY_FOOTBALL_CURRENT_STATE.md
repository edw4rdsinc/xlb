# XL Benefits Fantasy Football - Current Implementation Status

**Last Updated:** October 30, 2025
**Primary Data Source:** nflreadpy (FREE, no API key required)
**Database:** Supabase (PostgreSQL)
**Frontend:** Next.js 15 + TypeScript + Tailwind CSS

---

## 🎯 Quick Summary

The fantasy football platform is **production-ready** with:
- ✅ Complete database schema (8 tables)
- ✅ Python script for NFL stats syncing (nflreadpy)
- ✅ PPR scoring calculation engine
- ✅ Lineup submission with validation
- ✅ Weekly/Round/Season leaderboards
- ✅ Admin dashboard for score management
- ✅ Fuzzy player name matching
- ✅ Bye week detection
- ⏳ Email notifications (Resend configured, templates pending)

---

## 📊 Current Data Flow

```
Tuesday 3-5 AM ET → nflverse updates stats (automatic)
    ↓
ADMIN: Run Python script
    ↓
scripts/sync_nfl_stats.py --week 8
    ↓
Python Process:
├─ Fetches from nflreadpy (FREE API)
├─ Checks bye weeks → 0 points
├─ Aggregates team defense stats
├─ Fuzzy matches player names (85% threshold)
├─ Calculates PPR fantasy points
└─ Upserts to player_weekly_stats table
    ↓
ADMIN: Visit /admin/scoring
    ↓
Click "Calculate Scores"
    ↓
lib/scoring/calculator.ts:
├─ Reads player_weekly_stats
├─ Applies PPR scoring rules
├─ Calculates weekly totals
├─ Updates round cumulative
└─ Updates season cumulative
    ↓
Click "Publish Results"
    ↓
Results live at /fantasy-football/results
```

---

## 🗄️ Database Schema (Supabase)

### 1. **users** - Participants
```sql
- id (UUID, PK)
- email (VARCHAR, UNIQUE) - User identification
- name (VARCHAR) - Participant name
- team_name (VARCHAR) - Fantasy team name
- created_at, updated_at (TIMESTAMP)
```

### 2. **rounds** - Season structure (3 rounds × 6 weeks)
```sql
- id (UUID, PK)
- round_number (INTEGER) - 1, 2, or 3
- start_week, end_week (INTEGER) - NFL weeks 1-18
- start_date, end_date (DATE)
- is_active (BOOLEAN) - Only one round active at a time
```

### 3. **players** - NFL player pool
```sql
- id (UUID, PK)
- api_player_id (VARCHAR) - External API reference
- name (VARCHAR) - Player full name
- position (VARCHAR) - QB/RB/WR/TE/K/DEF
- team (VARCHAR) - NFL team abbreviation (e.g., "KC", "BUF")
- is_elite (BOOLEAN) - Top performers (max 2 per lineup)
- is_custom (BOOLEAN) - User-submitted write-ins
- created_at, updated_at (TIMESTAMP)
```

**Elite Player Criteria:**
- QB: Top 3 quarterbacks
- RB: Top 6 running backs
- WR: Top 6 wide receivers
- TE: Top 3 tight ends
- K/DEF: Not elite (all standard)

### 4. **lineups** - Submitted rosters
```sql
- id (UUID, PK)
- user_id (UUID, FK → users)
- round_id (UUID, FK → rounds)
- qb_id, rb1_id, rb2_id (UUID, FK → players)
- wr1_id, wr2_id (UUID, FK → players)
- te_id, k_id, def_id (UUID, FK → players)
- submitted_at (TIMESTAMP)
- elite_count (INTEGER) - Validation tracking
- elite_player_ids (UUID[]) - Quick reference
- created_at, updated_at (TIMESTAMP)
- UNIQUE(user_id, round_id) - One lineup per participant per round
```

### 5. **player_weekly_stats** - Raw NFL stats from API
```sql
- id (UUID, PK)
- player_id (UUID, FK → players)
- week_number (INTEGER) - 1-18
- passing_tds, passing_yards (INTEGER)
- rushing_tds, rushing_yards (INTEGER)
- receiving_tds, receptions, receiving_yards (INTEGER)
- two_point_conversions (INTEGER)
- field_goals, pats (INTEGER) - Kicker stats
- def_tds, interceptions, safeties, sacks (INTEGER) - Defense stats
- calculated_points (DECIMAL) - PPR total
- UNIQUE(player_id, week_number)
```

### 6. **weekly_scores** - Calculated fantasy points
```sql
- id (UUID, PK)
- lineup_id (UUID, FK → lineups)
- week_number (INTEGER) - 1-18
- qb_points, rb1_points, rb2_points (DECIMAL)
- wr1_points, wr2_points, te_points (DECIMAL)
- k_points, def_points (DECIMAL)
- total_points (DECIMAL) - Sum of all positions
- round_cumulative_points (DECIMAL) - Running total for round
- season_cumulative_points (DECIMAL) - Running total for season
- UNIQUE(lineup_id, week_number)
```

### 7. **draft_pools** - Available players per round
```sql
- id (UUID, PK)
- round_id (UUID, FK → rounds)
- player_id (UUID, FK → players)
- position (VARCHAR)
- rank (INTEGER) - Position-specific ranking
  - QB: 1-12
  - RB: 1-20
  - WR: 1-20
  - TE: 1-10
  - K: 1-10
  - DEF: 1-10
- total_points (DECIMAL) - From previous round (for ranking)
- is_elite (BOOLEAN) - Top performers
- UNIQUE(round_id, player_id)
```

### 8. **admin_users** - Admin authentication
```sql
- id (UUID, PK)
- email (VARCHAR, UNIQUE)
- password_hash (VARCHAR) - bcrypt hashed
- name (VARCHAR)
- created_at (TIMESTAMP)
```

---

## ⚙️ Python Scripts (Primary Data Source)

### `/scripts/sync_nfl_stats.py` - Weekly stats import

**Usage:**
```bash
# Basic usage - sync current week
python scripts/sync_nfl_stats.py --week 8

# Preview without saving
python scripts/sync_nfl_stats.py --week 8 --dry-run

# Specify season
python scripts/sync_nfl_stats.py --week 8 --season 2024
```

**What it does:**
1. **Fetches data** from nflreadpy (free, open-source)
2. **Checks bye weeks** - Automatically sets 0 points for teams on bye
3. **Aggregates defense** - Sums team defense stats (sacks, INTs, TDs, safeties)
4. **Fuzzy matching** - Matches API player names to database (85% similarity threshold)
5. **Calculates points** - Applies PPR scoring rules
6. **Upserts to DB** - Saves/updates player_weekly_stats table

**Dependencies (auto-installed by `scripts/install.sh`):**
- `nflreadpy` - NFL stats API wrapper
- `supabase` - Database client
- `pandas` - Data processing
- `fuzzywuzzy` - Fuzzy string matching
- `python-dotenv` - Environment variables

**Environment variables needed:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://exzeayeoosiabwhgyquq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Admin access for Python
```

### `/scripts/import_rosters.py` - Bulk roster import

**Usage:**
```bash
# Import from CSV
python scripts/import_rosters.py data/rosters/round_1_rosters.csv

# Preview without saving
python scripts/import_rosters.py data/rosters/round_1_rosters.csv --dry-run
```

**CSV Format:**
```csv
email,name,team_name,QB,RB1,RB2,WR1,WR2,TE,K,DEF
john@example.com,John Doe,Thunder,Patrick Mahomes,Christian McCaffrey,Derrick Henry,Tyreek Hill,Ja'Marr Chase,Travis Kelce,Justin Tucker,SF 49ers
```

---

## 🎮 Scoring Engine (`/lib/scoring/calculator.ts`)

### PPR Scoring Rules

**Passing:**
- Touchdown: 6 points
- Yards: 1 point per 25 yards (rounded up)
  - Example: 248 yards = Math.ceil(248/25) = 10 points

**Rushing:**
- Touchdown: 6 points
- Yards: 1 point per 10 yards (rounded up)
  - Example: 87 yards = Math.ceil(87/10) = 9 points

**Receiving (PPR - Point Per Reception):**
- Touchdown: 6 points
- Reception: 1 point (PPR bonus)
- Yards: 1 point per 10 yards (rounded up)
  - Example: 5 catches, 73 yards, 1 TD = 5 + 8 + 6 = 19 points

**Kicker:**
- Field Goal: 3 points
- PAT (Extra Point): 1 point

**Defense:**
- Touchdown: 6 points (fumble return, INT return, etc.)
- Interception: 2 points
- Safety: 2 points
- Sack: 3 points

**Other:**
- Two-Point Conversion: 2 points (any position)

### Tie-Breaker Rules (in order)
1. Total points
2. Defense (DEF) points
3. Kicker (K) points

---

## 🌐 Frontend Pages & Components

### Public Pages

#### `/fantasy-football` - Landing Page
- Rules explanation
- Prize structure ($2,100+ total)
- Scoring system details
- "Submit Lineup" CTA

#### `/fantasy-football/submit` - Lineup Submission
**Components:**
- `LineupForm.tsx` - Main form container
- `PlayerSelect.tsx` - Position-specific dropdowns (8 positions)
- `CustomPlayerModal.tsx` - Write-in player form
- Elite player validation (max 2 with ⭐ indicator)
- Confirmation modal before submission

**Validation:**
- All 8 positions required (QB, RB1, RB2, WR1, WR2, TE, K, DEF)
- Maximum 2 elite players
- Duplicate player check (can't use same player twice)
- Active round check (can't submit if no active round)

#### `/fantasy-football/results` - Leaderboards
**Three views:**
1. **Weekly Results** - Top scorers for specific week
2. **Round Results** - Cumulative standings for current round (6 weeks)
3. **Season Results** - Overall season leaderboard (18 weeks)

**Components:**
- `WeeklyResults.tsx` - Weekly top performers
- `RoundResults.tsx` - Round cumulative with week-by-week breakdown
- `SeasonResults.tsx` - Season-long standings

#### `/fantasy-football/rosters` - View All Lineups
**Two display modes:**
1. **Grid View** (`RosterGrid.tsx`) - Card-based, visual
2. **List View** (`RosterList.tsx`) - Compact table

**Features:**
- Filter by round
- Search by team name or participant
- Elite players highlighted
- Shows submission timestamp

### Admin Pages

#### `/admin/dashboard` - Overview
- Total participants count
- Total lineups submitted
- Active round indicator
- Recent submissions list

#### `/admin/scoring` - Score Management (PRIMARY ADMIN TOOL)

**Step 1: Sync Stats**
- Button: "Sync Stats for Week X"
- Calls Python script in background
- Shows sync status and errors

**Step 2: Calculate Scores**
- Button: "Calculate All Scores"
- Reads player_weekly_stats
- Applies PPR rules via `calculator.ts`
- Saves to weekly_scores table
- Shows preview table before saving

**Step 3: Publish Results**
- Button: "Publish Results & Notify"
- Makes results visible on public leaderboards
- Triggers email notifications (when implemented)

#### `/admin/fantasy-football` - (Coming Soon)
- Player management
- Lineup editing
- Round management

---

## 🔄 Weekly Workflow (Admin Process)

### Tuesday Morning (After Monday Night Football)

**Step 1: Sync NFL Stats (3-5 AM ET or manual)**
```bash
cd /home/sam/Documents/github-repos/xlb/xlb
source scripts/venv/bin/activate
python scripts/sync_nfl_stats.py --week 8
deactivate
```

**Step 2: Admin Dashboard (`/admin/scoring`)**
1. Login with admin password
2. Click "Sync Stats for Week X" (if not using Python script directly)
3. Review sync results - check for any missing players
4. Click "Calculate All Scores"
5. Review score preview table - verify calculations
6. Click "Publish Results & Notify"

**Step 3: Participants View Results**
- Visit `/fantasy-football/results`
- View weekly winner ($25 prize)
- Check round cumulative standings
- Monitor season leaderboard

---

## 🚀 Testing the System

### 1. Environment Setup

**Check Python environment:**
```bash
cd ~/Documents/github-repos/xlb/xlb
ls scripts/venv  # Should exist, if not run: ./scripts/install.sh
source scripts/venv/bin/activate
python --version  # Should be 3.9+
pip list | grep nflreadpy  # Should show installed
deactivate
```

**Check .env.local:**
```bash
cat .env.local | grep SUPABASE  # Verify all keys present
```

### 2. Database Check

**Verify tables exist:**
```bash
# Can run this via Supabase SQL Editor or psql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';
```

Expected tables:
- users
- rounds
- players
- lineups
- player_weekly_stats
- weekly_scores
- draft_pools
- admin_users

### 3. Test NFL Stats Sync

**Option A: Dry run (no database writes)**
```bash
source scripts/venv/bin/activate
python scripts/sync_nfl_stats.py --week 8 --dry-run
```

Should show:
- Player stats fetched from nflreadpy
- Bye week detection
- Team defense aggregation
- Points calculation
- Player name matches

**Option B: Actual sync (writes to database)**
```bash
python scripts/sync_nfl_stats.py --week 8
```

Check database after:
```sql
SELECT player_id, week_number, calculated_points
FROM player_weekly_stats
WHERE week_number = 8
LIMIT 10;
```

### 4. Test Lineup Submission

1. Visit `http://localhost:3000/fantasy-football/submit`
2. Fill in form:
   - Name: Test User
   - Email: test@example.com
   - Team Name: Test Team
3. Select players (remember max 2 elite)
4. Submit lineup

Check database:
```sql
SELECT * FROM users WHERE email = 'test@example.com';
SELECT * FROM lineups WHERE user_id = '[user_id_from_above]';
```

### 5. Test Score Calculation

1. Visit `/admin` (enter admin password)
2. Go to `/admin/scoring`
3. Select week number
4. Click "Calculate Scores"
5. Review preview table
6. Click "Save Scores"

Check database:
```sql
SELECT * FROM weekly_scores WHERE week_number = 8;
```

### 6. Test Leaderboards

Visit public results pages:
- `/fantasy-football/results?view=weekly&week=8`
- `/fantasy-football/results?view=round&roundId=[round_uuid]`
- `/fantasy-football/results?view=season`

Should show ranked participants with scores.

---

## 🐛 Common Issues & Solutions

### Issue: Python script can't connect to Supabase
**Solution:**
```bash
# Check environment variables
cat .env.local | grep SUPABASE_SERVICE_ROLE_KEY
# Make sure it's the SERVICE_ROLE_KEY, not ANON_KEY
```

### Issue: Player names not matching
**Solution:**
- Script uses 85% similarity threshold
- Check player name format in database vs API
- Manually add player with exact API name if needed

### Issue: Bye week players showing null instead of 0
**Solution:**
- Script automatically handles this
- If manual import, ensure bye weeks are set to 0 points

### Issue: Elite player validation failing
**Solution:**
```sql
-- Verify elite player flags
SELECT name, position, is_elite FROM players WHERE is_elite = true;
-- Should see top 3 QB/TE, top 6 RB/WR
```

### Issue: Admin scoring page shows "No stats found"
**Solution:**
1. Check if stats were synced for that week
```sql
SELECT COUNT(*) FROM player_weekly_stats WHERE week_number = 8;
```
2. If 0, run sync script again
3. Check Python script output for errors

---

## 📈 Production Readiness Checklist

### ✅ Complete
- [x] Database schema with all tables and relationships
- [x] Python script for NFL stats syncing (nflreadpy)
- [x] PPR scoring calculation engine
- [x] Fuzzy player name matching
- [x] Bye week detection
- [x] Team defense aggregation
- [x] Lineup submission with validation (elite player restriction)
- [x] Custom player write-ins
- [x] Weekly/Round/Season leaderboards
- [x] Admin dashboard with scoring workflow
- [x] Roster viewing (grid/list modes)

### ⏳ Pending
- [ ] Email notification templates (Resend configured)
- [ ] Admin player management UI
- [ ] Admin lineup editing UI
- [ ] CSV export for results
- [ ] Automated cron job for stats syncing
- [ ] Error monitoring (Sentry or similar)

### 🔒 Security Considerations
- Admin password is simple (localStorage-based) - consider JWT upgrade
- Python script requires SERVICE_ROLE_KEY (admin access) - secure storage needed
- No rate limiting on API routes - add for production
- User input sanitization on custom player submissions

---

## 📞 Next Steps

To test the fantasy football integration, let's:

1. **Verify Python environment is set up**
2. **Run a test sync for a recent NFL week**
3. **Create a test lineup submission**
4. **Calculate scores via admin dashboard**
5. **View results on leaderboards**

Ready to start testing! Let me know which step you'd like to begin with, or if you want me to check the current state of the database/environment first.
