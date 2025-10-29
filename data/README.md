# Fantasy Football Data Directory

This directory contains team rosters and current scores for the XL Benefits Fantasy Football league.

## Folder Structure

### `/rosters`
Place team roster files here. Supported formats:
- CSV files: `round_1_rosters.csv`, `round_2_rosters.csv`, etc.
- JSON files: `round_1_rosters.json`

**CSV Format:**
```csv
team_name,participant_name,participant_email,round_number,qb,rb1,rb2,wr1,wr2,te,k,def
XL Crushers,John Smith,john@xlbenefits.com,1,Josh Allen,Christian McCaffrey,Derrick Henry,Tyreek Hill,CeeDee Lamb,Travis Kelce,Harrison Butker,49ers
```

**JSON Format:**
```json
[
  {
    "team_name": "XL Crushers",
    "participant_name": "John Smith",
    "participant_email": "john@xlbenefits.com",
    "round_number": 1,
    "qb": "Josh Allen",
    "rb1": "Christian McCaffrey",
    "rb2": "Derrick Henry",
    "wr1": "Tyreek Hill",
    "wr2": "CeeDee Lamb",
    "te": "Travis Kelce",
    "k": "Harrison Butker",
    "def": "49ers"
  }
]
```

### `/scores`
Place current scores here if importing historical data:
- CSV files: `week_1_scores.csv`, `week_2_scores.csv`, etc.
- JSON files: `week_1_scores.json`

**CSV Format:**
```csv
team_name,week_number,qb_points,rb1_points,rb2_points,wr1_points,wr2_points,te_points,k_points,def_points,total_points
XL Crushers,1,24.5,18.3,12.1,15.7,22.4,8.9,9.0,12.0,122.9
```

## Import Process

1. Place roster files in `/rosters`
2. Place score files in `/scores` (optional - for backfilling historical data)
3. Run import script: `python scripts/import_rosters.py`
4. Verify import in admin dashboard

## Notes

- Player names must match NFL official names (e.g., "Patrick Mahomes", not "Pat Mahomes")
- Defense names: Use team name only (e.g., "49ers", "Chiefs", "Bills")
- Elite player restrictions enforced during import validation
