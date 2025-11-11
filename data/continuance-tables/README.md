# Continuance Tables Data Documentation

## Overview

This directory contains 12 continuance tables extracted from the **2026 AV Calculator Excel file**. These tables provide detailed spending distribution data across different metal tier plans (Platinum, Gold, Silver, Bronze) and claim types (Medical Only, Rx Only, Combined).

**Extraction Date:** 2025-11-07
**Source File:** `2026-AV-Calculator.xlsm`
**Total Tables:** 12
**Rows per Table:** 166

## File Structure

### Individual Table Files (12 files)

Each metal tier has three separate tables:

#### Medical Only Tables (92 columns each)
- `platinum_med.json` - Platinum Plans, Medical Only
- `gold_med.json` - Gold Plans, Medical Only
- `silver_med.json` - Silver Plans, Medical Only
- `bronze_med.json` - Bronze Plans, Medical Only

#### Rx (Prescription Drug) Only Tables (12 columns each)
- `platinum_rx.json` - Platinum Plans, Drug Claims Only
- `gold_rx.json` - Gold Plans, Drug Claims Only
- `silver_rx.json` - Silver Plans, Drug Claims Only
- `bronze_rx.json` - Bronze Plans, Drug Claims Only

#### Combined Tables (100 columns each)
- `platinum_combined.json` - Platinum Plans, All Claims
- `gold_combined.json` - Gold Plans, All Claims
- `silver_combined.json` - Silver Plans, All Claims
- `bronze_combined.json` - Bronze Plans, All Claims

### Combined File
- `all-continuance-tables.json` - All 12 tables in a single file with metadata

## Data Structure

### JSON Schema

Each individual table file follows this structure:

```json
{
  "table_name": "Platinum_Med",
  "table_title": "Platinum Plans, Medical Only",
  "column_count": 92,
  "row_count": 166,
  "columns": ["Up To", "Percent of Enrollees", ...],
  "data": [
    {
      "Up To": 0,
      "Percent of Enrollees": 0.1351546903,
      "Avg. Cost per Enrollee (Max'd)": 0,
      ...
    },
    ...
  ],
  "extraction_date": "2025-11-07T08:31:00.000000"
}
```

### Key Fields

#### Metadata Fields
- **table_name**: Sheet name from Excel file (e.g., "Platinum_Med")
- **table_title**: Descriptive title (e.g., "Platinum Plans, Medical Only")
- **column_count**: Number of data columns
- **row_count**: Number of data rows (166 for all tables)
- **columns**: Array of all column names
- **extraction_date**: ISO 8601 timestamp of extraction

#### Common Data Columns

All tables include these core columns:

1. **Up To** - Spending bucket upper limit (dollar amount)
2. **Percent of Enrollees** - Percentage of enrollees in this spending range
3. **Avg. Cost per Enrollee (Max'd)** - Average cost per enrollee (maxed)
4. **Avg. Cost per Enrollee (Bucket)** - Average cost per enrollee (bucket)

### Medical Only Tables (92 columns)

Medical tables include detailed service categories:

**Service Types:**
- Emergency Room (ER)
- Inpatient (IP)
- Primary Care
- Specialist
- Mental Health and Substance Use Disorder
- Imaging
- Speech Therapy
- Occupational + Physical Therapy
- Preventive Care
- Laboratory
- X-rays (Combined, Specialist, Primary, Unclassified)
- Skilled Nursing Facility (SNF)
- Outpatient Surgery
- Unclassified

**Frequency Metrics:**
- Average frequency for each service type
- Inpatient days (IP Max Days 1-10)
- SNF days
- Primary care visit frequencies (>1 through >10 visits)

**Facility vs Professional Split:**
- Many services broken down by OP Facility vs OP Professional

### Rx Only Tables (12 columns)

Prescription drug tables include:

**Drug Categories:**
- Generics
- Preferred Brand
- Non-Preferred Brand
- Specialty Drugs

**Metrics for Each Category:**
- Average cost
- Average prescriptions filled

### Combined Tables (100 columns)

Combined tables include all medical service columns PLUS prescription drug columns, providing a comprehensive view of total spending across both medical and pharmaceutical claims.

## Data Characteristics

### Spending Buckets

Each table contains **166 rows** representing spending ranges:
- Row 1: $0 (zero spenders)
- Row 2: Up to $100
- Row 3: Up to $200
- Row 4: Up to $300
- ...continuing through higher spending levels

### Numeric Precision

All numeric values are preserved with full precision as stored in the Excel file:
- Percentages stored as decimals (e.g., 0.1351546903 = 13.52%)
- Dollar amounts stored as floating-point numbers
- Frequencies stored as decimals

### Null Values

Missing or empty cells in the Excel file are represented as `null` in the JSON files.

## Usage Examples

### Python Example

```python
import json

# Load a single table
with open('continuance-tables/platinum_med.json', 'r') as f:
    platinum_med = json.load(f)

# Access metadata
print(f"Table: {platinum_med['table_title']}")
print(f"Rows: {platinum_med['row_count']}")
print(f"Columns: {platinum_med['column_count']}")

# Access data
for row in platinum_med['data'][:5]:
    up_to = row['Up To']
    pct = row['Percent of Enrollees']
    avg_cost = row["Avg. Cost per Enrollee (Max'd)"]
    print(f"Up to ${up_to}: {pct:.2%} of enrollees, avg cost ${avg_cost:.2f}")

# Load all tables at once
with open('continuance-tables/all-continuance-tables.json', 'r') as f:
    all_data = json.load(f)

# Access specific table from combined file
gold_rx = all_data['tables']['Gold_Rx']
```

### JavaScript Example

```javascript
// Load a single table
fetch('continuance-tables/platinum_combined.json')
  .then(response => response.json())
  .then(data => {
    console.log(`Table: ${data.table_title}`);
    console.log(`Rows: ${data.row_count}`);

    // Find high spenders (up to > $10,000)
    const highSpenders = data.data.filter(row => row['Up To'] > 10000);
    console.log(`High spender buckets: ${highSpenders.length}`);
  });
```

## Data Quality Validation

All extracted tables have been validated for:

✓ **Completeness**: All 12 expected tables extracted
✓ **Row counts**: All tables contain 166 rows
✓ **Column integrity**: All column headers preserved
✓ **Numeric precision**: Full precision maintained from source
✓ **Data types**: Appropriate null handling for empty cells

## Metal Tier Comparison

### Row Count Summary

| Metal Tier | Medical | Rx | Combined | Total Rows |
|-----------|---------|-----|----------|------------|
| Platinum  | 166     | 166 | 166      | 498        |
| Gold      | 166     | 166 | 166      | 498        |
| Silver    | 166     | 166 | 166      | 498        |
| Bronze    | 166     | 166 | 166      | 498        |
| **Total** | **664** | **664** | **664** | **1,992**  |

### Column Count Summary

| Table Type | Columns | Tables | Total Columns |
|-----------|---------|--------|---------------|
| Medical   | 92      | 4      | 368           |
| Rx        | 12      | 4      | 48            |
| Combined  | 100     | 4      | 400           |

## Sample Data

### Platinum Medical - First 5 Spending Buckets

```
Up To  | Percent of Enrollees | Avg. Cost (Max'd) | Avg. Cost (Bucket)
-------|---------------------|-------------------|-------------------
$0     | 13.52%              | $0.00             | $0.00
$100   | 2.73%               | $85.38            | $59.73
$200   | 5.18%               | $166.13           | $141.95
$300   | 3.45%               | $242.98           | $249.85
$400   | 3.24%               | $316.47           | $349.59
```

### Gold Rx - First 5 Spending Buckets

```
Up To  | Percent of Enrollees | Avg. Cost (Max'd) | Avg. Generics Rx
-------|---------------------|-------------------|------------------
$0     | 31.78%              | $0.00             | 0.000
$100   | 19.58%              | $54.95            | 1.446
$200   | 8.44%               | $96.99            | 2.485
$300   | 5.34%               | $133.02           | 3.390
$400   | 3.73%               | $165.18           | 4.217
```

## File Sizes

| File | Size |
|------|------|
| platinum_med.json | 684 KB |
| gold_med.json | 684 KB |
| silver_med.json | 684 KB |
| bronze_med.json | 685 KB |
| platinum_rx.json | 91 KB |
| gold_rx.json | 91 KB |
| silver_rx.json | 91 KB |
| bronze_rx.json | 90 KB |
| platinum_combined.json | 744 KB |
| gold_combined.json | 744 KB |
| silver_combined.json | 744 KB |
| bronze_combined.json | 744 KB |
| all-continuance-tables.json | 6.5 MB |
| **Total** | **13 MB** |

## Notes

1. **Percentage Format**: All percentage values are stored as decimals (0-1 range). To display as percentages, multiply by 100.

2. **Cost Buckets**: The "Up To" column represents cumulative spending ranges. Each row includes enrollees with spending up to that dollar amount.

3. **Frequency Metrics**: Frequency columns represent average number of occurrences (visits, prescriptions, days, etc.) for enrollees in that spending bucket.

4. **Combined Tables**: Include both medical and Rx columns, making them suitable for total cost of care analysis.

5. **Data Source**: All data extracted from 2026 AV Calculator, which is based on HHS actuarial standards for health plan metal tier calculations.

## Changelog

### Version 1.0 (2025-11-07)
- Initial extraction of all 12 continuance tables
- Created individual JSON files for each table
- Created combined file with all tables
- Generated documentation

## Contact & Support

For questions about this data structure or extraction process, refer to the extraction script: `extract_continuance_tables.py`
