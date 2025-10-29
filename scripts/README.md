# Fantasy Football Python Scripts

Automated weekly stats import using **nflreadpy** (free, no API key needed).

## Quick Start

### 1. Install Dependencies

```bash
cd /home/sam/Documents/github-repos/xlb/xlb
chmod +x scripts/install.sh
./scripts/install.sh
```

This creates a Python virtual environment and installs:
- `nflreadpy` - NFL stats (free, open source)
- `supabase` - Database client
- `pandas` / `polars` - Data processing
- `fuzzywuzzy` - Player name matching
- `python-dotenv` - Environment variables

### 2. Import Team Rosters

Place your roster CSV file in `data/rosters/`:

```bash
# Use the template
cp data/rosters/TEMPLATE.csv data/rosters/round_1_rosters.csv

# Edit with your team rosters
nano data/rosters/round_1_rosters.csv

# Import (dry run first to preview)
source scripts/venv/bin/activate
python scripts/import_rosters.py data/rosters/round_1_rosters.csv --dry-run

# Import for real
python scripts/import_rosters.py data/rosters/round_1_rosters.csv
```

### 3. Sync Weekly NFL Stats

Every Tuesday morning after Monday Night Football:

```bash
# Activate virtual environment
source scripts/venv/bin/activate

# Sync stats for current week (dry run first)
python scripts/sync_nfl_stats.py --week 8 --dry-run

# Sync for real
python scripts/sync_nfl_stats.py --week 8

# Deactivate when done
deactivate
```

---

## Scripts Overview

### `sync_nfl_stats.py`
**Purpose:** Pull weekly player stats from nflreadpy and save to database

**Usage:**
```bash
python scripts/sync_nfl_stats.py --week 8
python scripts/sync_nfl_stats.py --week 8 --season 2024
python scripts/sync_nfl_stats.py --week 8 --dry-run  # Preview only
```

**What it does:**
1. Fetches stats from nflreadpy (free, no API key)
2. Matches players to your database using fuzzy matching
3. Transforms to your schema (`player_weekly_stats` table)
4. Calculates fantasy points using PPR scoring
5. Upserts to Supabase database

**Output:**
```
✅ Found 247 players with stats for Week 8
✅ Matched 185 players to database
⚠️  62 players not matched (shows list)
✅ Successfully upserted 185 player stats
```

---

### `import_rosters.py`
**Purpose:** Import team rosters from CSV/JSON files

**Usage:**
```bash
python scripts/import_rosters.py data/rosters/round_1_rosters.csv
python scripts/import_rosters.py data/rosters/round_2_rosters.json
python scripts/import_rosters.py data/rosters/round_1_rosters.csv --dry-run
```

**What it does:**
1. Reads roster file (CSV or JSON)
2. Creates users if they don't exist
3. Creates/updates players if they don't exist
4. Creates lineups with player references
5. Validates elite player restrictions (max 2)

**CSV Format:**
```csv
team_name,participant_name,participant_email,round_number,qb,rb1,rb2,wr1,wr2,te,k,def
XL Crushers,John Smith,john@example.com,1,Josh Allen,CMC,Derrick Henry,Tyreek Hill,CeeDee Lamb,Travis Kelce,Harrison Butker,49ers
```

---

## Weekly Workflow

### Tuesday Morning (After MNF)
1. **Sync NFL Stats**
   ```bash
   source scripts/venv/bin/activate
   python scripts/sync_nfl_stats.py --week 8
   ```

2. **Go to Admin Dashboard**
   - Navigate to `http://localhost:3000/admin/scoring`
   - Click "Calculate Scores" (applies stats to all lineups)
   - Review results preview
   - Click "Publish Results & Notify"

3. **Results Published**
   - Participants see scores at `/fantasy-football/results`
   - Weekly winner announced
   - Leaderboards updated

---

## Data Flow

```
Tuesday 3-5 AM ET
↓
nflverse updates stats (automatic)
↓
YOU: Run sync_nfl_stats.py --week 8
↓
Stats saved to player_weekly_stats table
↓
YOU: Click "Calculate Scores" in admin
↓
Lineup scores calculated and saved
↓
YOU: Click "Publish Results"
↓
Participants see results on website
```

---

## Environment Variables

Required in `.env.local`:
```env
# Supabase (for database access)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...  # Admin key, not anon key!
```

**Important:** Scripts use `SUPABASE_SERVICE_ROLE_KEY` (admin access) not the anon key.

---

## Player Name Matching

The script uses fuzzy matching to handle name variations:

**Exact matches:**
- "Patrick Mahomes" → "Patrick Mahomes" ✅

**Fuzzy matches (85%+ similarity):**
- "Pat Mahomes" → "Patrick Mahomes" ✅
- "C. McCaffrey" → "Christian McCaffrey" ✅
- "Travis Kelce" → "Travis Kelce" ✅

**No match:**
- "Tom Brady" (retired, not in database) ❌

**Unmatched players:**
- Listed in output for manual review
- Add to database or fix roster

---

## Troubleshooting

### "Module not found: nflreadpy"
```bash
source scripts/venv/bin/activate
pip install -r scripts/requirements.txt
```

### "Missing Supabase credentials"
Add to `.env.local`:
```env
SUPABASE_SERVICE_ROLE_KEY=your-admin-key-here
```

### "Player not matched"
Options:
1. Add player to database manually
2. Fix player name in roster
3. Script shows list of unmatched players

### "Access denied" or "Insufficient privileges"
Use `SUPABASE_SERVICE_ROLE_KEY` (admin), not anon key.

---

## Next Steps

After roster import and first stats sync:

1. ✅ Rosters imported
2. ✅ Week 8 stats synced
3. 🔄 Build scoring calculation API endpoint
4. 🔄 Build leaderboard aggregation logic
5. 🔄 Add "Sync Stats" button to admin dashboard
6. 🔄 Add email notifications

---

## Cost & Rate Limits

- **nflreadpy:** Free, open source, no API key needed
- **Rate limits:** None (pulls from public datasets)
- **Update frequency:** Nightly at 3-5 AM ET during season
- **Data source:** nflverse (Pro Football Reference, NFL NGS)

---

## Support

- **nflreadpy docs:** https://nflreadpy.nflverse.com/
- **Issues:** Check script output for specific errors
- **Player matching:** Review unmatched player list in output

---

**Ready to test!** Place your rosters in `data/rosters/` and let me know when you're ready to do the first import.
