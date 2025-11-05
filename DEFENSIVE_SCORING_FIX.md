# Defensive Scoring Fix - November 4, 2025

## Problem Summary

Defensive scoring for all teams in Week 9 was incorrect. Only defensive TDs were being counted, while interceptions and sacks were showing as 0 points.

**Example:**
- TEN Defense should have had 26 points (1 TD + 1 INT + 6 sacks)
- But was only showing 6 points (just the 1 TD)

## Root Causes

### 1. Incorrect Column Name Mapping (PRIMARY ISSUE)
**Issue:** The sync script was using the wrong column names when reading defensive stats from nflreadpy.

**Details:**
- nflreadpy provides defensive stats as: `def_interceptions`, `def_safeties`, `def_sacks`
- But the script was looking for: `interceptions`, `safeties`, `sacks`
- This caused all INT/sack stats to read as 0

**Location:** `scripts/sync_nfl_stats.py:338-340`

### 2. Column Renaming Bug
**Issue:** The defense aggregation function was renaming columns, then the transform function couldn't find them.

**Flow:**
1. Aggregate defense stats by team → creates columns with `def_` prefix
2. Rename to remove `def_` prefix (interceptions, safeties, sacks)
3. Transform function looks for `def_interceptions` → not found → defaults to 0

**Location:** `scripts/sync_nfl_stats.py:163-173`

### 3. Fuzzy Matching False Positives
**Issue:** Team defense names like "ATL Defense" and "BAL Defense" were scoring 91% similarity, causing duplicate player_id matches.

**Impact:** Prevented successful database upsert due to constraint violations.

**Location:** `scripts/sync_nfl_stats.py:227-265`

## Fixes Applied

### Fix 1: Corrected Column Name Mapping ✅
Updated the transform function to read the correct column names from nflreadpy:

**Before:**
```python
'interceptions': safe_int(row.get('interceptions', 0)),
'safeties': safe_int(row.get('safeties', 0)),
'sacks': safe_int(row.get('sacks', 0)),
```

**After:**
```python
'interceptions': safe_int(row.get('def_interceptions', 0)),
'safeties': safe_int(row.get('def_safeties', 0)),
'sacks': safe_int(row.get('def_sacks', 0)),
```

### Fix 2: Preserved Column Names in Aggregation ✅
Removed the column renaming step to keep the `def_` prefix throughout the pipeline:

**Before:**
```python
rename_map = {
    team_col: 'team',
    'def_interceptions': 'interceptions',  # ❌ Renamed
    'def_safeties': 'safeties',            # ❌ Renamed
    'def_sacks': 'sacks'                   # ❌ Renamed
}
```

**After:**
```python
rename_map = {
    team_col: 'team'
    # Keep def_ prefix for consistency
}
```

### Fix 3: Exact Matching for Defenses ✅
Changed the player matching logic to require exact matches for DEF position:

**Before:**
```python
# Used fuzzy matching for all positions
score = fuzz.ratio(nfl_name.lower(), db_name.lower())
if score >= 85:
    return player['id']
```

**After:**
```python
# For DEF position, require exact match only
if nfl_position == 'DEF':
    for player in position_matches:
        if nfl_name.lower() == player['name'].lower():
            return player['id']
    return None  # No exact match found
```

### Fix 4: Team Abbreviation Normalization ✅
Added mapping for inconsistent team codes between nflreadpy and database:

```python
team_mapping = {
    'LA': 'LAR',  # Los Angeles Rams
}
```

## Verification Results

### Test Script Created: `scripts/verify_defense_scoring.py`

Run this script to verify defensive scoring for any week:
```bash
cd ~/Documents/github-repos/xlb/xlb
scripts/venv/bin/python scripts/verify_defense_scoring.py 9
```

### Week 9 Verification (November 4, 2025)
```
✅ All 15 defenses with Week 9 stats verified correct
✅ No calculation mismatches
✅ All scoring formulas working properly
```

**Sample Results:**
| Team | TDs | INTs | Safeties | Sacks | Total | Status |
|------|-----|------|----------|-------|-------|--------|
| TEN  | 1   | 1    | 0        | 6.0   | 26.0  | ✅ VERIFIED |
| PIT  | 0   | 3    | 0        | 5.0   | 21.0  | ✅ VERIFIED |
| ATL  | 0   | 1    | 0        | 6.0   | 20.0  | ✅ VERIFIED |
| LAR  | 0   | 1    | 0        | 1.0   | 5.0   | ✅ VERIFIED |
| LAC  | 0   | 0    | 0        | 4.0   | 12.0  | ✅ VERIFIED |

## Defensive Scoring Formula

```python
def calculate_defense_points(def_tds, interceptions, safeties, sacks):
    return (def_tds * 6) + (interceptions * 2) + (safeties * 2) + (sacks * 3)
```

**Breakdown:**
- **Defensive TD:** 6 points
- **Interception:** 2 points
- **Safety:** 2 points
- **Sack:** 3 points

## How Defensive Scoring Works

As you correctly identified, defensive scoring works by:

1. **Aggregating Individual Players:** nflreadpy provides stats for individual defensive players (LB, DE, CB, etc.)
2. **Summing by Team:** All defensive stats from players on a team are summed together
3. **Creating Team Defense:** The aggregated stats become the "TEN Defense" or "PIT Defense" entry
4. **Calculating Points:** Apply the scoring formula to the team's total defensive stats

**Example for TEN Defense:**
- All TEN defensive players combined had:
  - 1 defensive TD
  - 1 total interception
  - 0 safeties
  - 6 total sacks (summed across all D-linemen, LBs)
- Result: TEN Defense = 26 points

## Data Flow (Fixed)

```
1. nflreadpy → Week 9 player stats
   ↓
2. Filter to defensive stats columns:
   - def_tds
   - def_interceptions  ✅ (was missing)
   - def_safeties       ✅ (was missing)
   - def_sacks          ✅ (was missing)
   ↓
3. Group by team, sum defensive stats
   ↓
4. Create "TEAM Defense" entries with aggregated stats
   ↓
5. Combine with player stats
   ↓
6. Match to database players (exact match for DEF)
   ↓
7. Transform to database schema (reads def_* columns)
   ↓
8. Calculate points using scoring formula
   ↓
9. Upsert to player_weekly_stats table
   ↓
10. Calculate lineup scores
```

## Files Modified

1. **scripts/sync_nfl_stats.py**
   - Lines 147-155: Fixed aggregation column names
   - Lines 163-171: Removed incorrect column renaming
   - Lines 190-200: Updated default value column names
   - Lines 227-265: Added exact matching for DEF position
   - Lines 337-340: Fixed column name mapping in transform
   - Lines 175-180: Added team abbreviation normalization

2. **scripts/verify_defense_scoring.py** (NEW)
   - Created verification script for defensive scoring
   - Validates calculation formulas
   - Compares expected vs stored points
   - Reports any mismatches

3. **scripts/check_duplicates.py** (NEW)
   - Helper script to detect duplicate player_id matches
   - Used for debugging the fuzzy matching issue

## Testing & Validation

### Manual Re-sync Performed
```bash
# Re-synced Week 9 with all fixes
scripts/venv/bin/python scripts/sync_nfl_stats.py --week 9 --season 2025

# Recalculated all lineup scores
scripts/venv/bin/python scripts/calculate_scores.py --week 9 --season 2025

# Verified all defensive calculations
scripts/venv/bin/python scripts/verify_defense_scoring.py 9
```

### Results
- ✅ 345 player/defense records synced
- ✅ 15 team defenses with stats
- ✅ All defensive calculations verified
- ✅ No duplicate player_id errors
- ✅ All lineup scores recalculated correctly

## Impact on Previous Weeks

**Question:** Do we need to re-sync other weeks?

**Analysis:**
- Week 9 was the first week affected (Nov 4 automatic sync)
- Weeks 1-8 were synced before this bug was introduced
- **IF** Weeks 1-8 were synced with the buggy code, they would also have incorrect defensive scores

**Recommendation:**
Run verification on previous weeks to check:
```bash
for week in {1..8}; do
    scripts/venv/bin/python scripts/verify_defense_scoring.py $week
done
```

If any weeks show all defenses with 0 interceptions/sacks, re-sync them:
```bash
scripts/venv/bin/python scripts/sync_nfl_stats.py --week X --season 2025
scripts/venv/bin/python scripts/calculate_scores.py --week X --season 2025
```

## Future Prevention

### Automated Testing
Consider adding a test that verifies:
1. At least some defenses have non-zero interceptions
2. At least some defenses have non-zero sacks
3. Total defensive points across all teams > expected minimum

### Monitoring
Add to cron job logging:
- Count of defenses with stats
- Sample defensive stats (top 3 scoring defenses)
- Alert if all defenses have 0 interceptions/sacks

## Summary

**Issue:** Defensive scoring was broken - only counting TDs, missing INTs and sacks
**Root Cause:** Column name mismatch between nflreadpy data and sync script
**Fix Applied:** Corrected column names, preserved naming through pipeline, exact matching for defenses
**Status:** ✅ Fixed and verified
**Impact:** Week 9 scores now correct, all 15 defenses verified
**Next Steps:** Verify weeks 1-8 if they were synced with buggy code

---

**Fixed by:** Claude Code
**Date:** November 4, 2025
**Verification Status:** ✅ All tests passing
