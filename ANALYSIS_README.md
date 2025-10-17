# ISL Deductible Analysis - Excel Structure Analysis

## Overview

This analysis documents the structure, formulas, and data flow of the **Individual Stop Loss (ISL) Deductible Analyzer** Excel workbook. This tool is used by insurance brokers and consultants to help self-insured employers determine optimal stop-loss deductible levels.

## What This Tool Does

The ISL Deductible Analyzer:
1. Takes historical high-cost claimant data (up to 35 claimants across 4 plan years)
2. Applies medical trend factors to project future claim costs
3. Calculates excess claims above various deductible thresholds
4. Compares premium costs vs. projected claims liability
5. Provides net savings analysis and recommendations

**Business Value:** Helps clients save $500K-$1M+ annually by identifying optimal deductible levels that balance premium savings against additional claims exposure.

## Files Analyzed

| File | Size | Description |
|------|------|-------------|
| `ISL Ded Analysis.xlsx` | 105 KB | Blank template |
| `VCH - ISL Ded Analysis.xlsx` | 50 KB | Populated example (Valley Children's Hospital) |

## Documentation Files Created

| File | Purpose |
|------|---------|
| **EXCEL_ANALYSIS.md** | Complete detailed analysis of structure, formulas, and business logic |
| **WIZARD_CELL_MAPPING.md** | Developer reference for exact cell addresses and code examples |
| **VISUAL_STRUCTURE.md** | Visual diagrams of layout, data flow, and UI concepts |
| **blank-analysis.json** | Machine-readable analysis of blank template (all cells) |
| **populated-analysis.json** | Machine-readable analysis of populated example (all cells) |
| **analyze-excel.js** | Node.js script used to generate the analysis |

## Quick Start for Developers

### 1. Read the Documentation
Start with these files in order:
1. **This README** - Overview
2. **VISUAL_STRUCTURE.md** - Understand the layout visually
3. **EXCEL_ANALYSIS.md** - Detailed business logic
4. **WIZARD_CELL_MAPPING.md** - Implementation details

### 2. Key Insights

**INPUT CELLS (User must provide):**
- Company name, effective date, trend rate
- Historical claims for up to 35 claimants (4 years each)
- Premium quotes for each deductible option

**OUTPUT CELLS (Excel calculates):**
- Trended claims to future year
- Excess claims by deductible option
- Average claims, additional claims, estimated claimant counts
- Premium savings, net projected savings

**CALCULATION FLOW:**
```
Historical Claims → Trend Forward → Calculate Excess → Sum Totals →
→ Compare Premiums → Calculate Net Savings → Recommendation
```

### 3. Implementation Approach

**Recommended Technology Stack:**
- **Backend:** Node.js with ExcelJS or xlsx library
- **Frontend:** React/Vue/Angular multi-step wizard
- **PDF Generation:** PDFKit or Puppeteer (from Excel print areas)

**Workflow:**
1. User completes wizard steps (6 steps total)
2. Backend writes data to blank template Excel file
3. Excel auto-calculates all formulas
4. Backend reads results from calculated cells
5. Display results in UI + offer download/PDF options

## Key Cell Addresses

### Sheet 1: "ISL Analsys - Historical Claims" (Data Entry)

**Inputs:**
- `A1` - Company Name
- `J2` - Effective Date
- `K5` - Medical Trend Rate (%)
- `B8:B42` - Claimant Names
- `C8:F42` - Historical Claims (4 years × 35 claimants)

**Outputs:**
- `H8:K42` - Trended claims to 2026
- `P46:AO46` - Totals by deductible option (feeds Sheet 2)

### Sheet 2: "ISL Analysis - Premium v Claims" (Summary)

**Inputs:**
- `C17:H17` - Carrier names
- `C20:H20` - Premium quotes (CRITICAL INPUT)

**Outputs:**
- `C8:J12` - Claims analysis table
- `C19:H23` - Premium comparison with NET SAVINGS (Row 23)
- `B26` - Recommendation text

## Example Data (Valley Children's Hospital)

**Scenario:**
- 33 claimants with historical data
- 7% medical trend
- Current deductible: $225,000
- Renewal premium: $9,509,866

**Results:**
- **Option 2 ($300K deductible):** $600,325 net annual savings
- **Option 3 ($350K deductible):** $929,188 net annual savings
- **Recommendation:** Move to $300K or $350K deductible

**Calculation:**
- Premium savings at $300K: $2,221,873
- Minus additional claims: $1,621,548
- **Net savings: $600,325** ✓

## Business Logic to Preserve

### 1. Trending Formula
```
Trended_Claim = Historical_Claim × ((1 + Trend_Rate)^Years_Forward)
```

### 2. Excess Claims Formula
```
Excess = IF(Trended_Claim > Deductible, Trended_Claim - Deductible, 0)
```

### 3. Additional Claims (Savings)
```
Additional = Current_Deductible_Claims - Higher_Deductible_Claims
```

### 4. Net Savings
```
Net_Savings = Premium_Savings - Additional_Claims
```

## Validation Rules

| Field | Min | Max | Default | Notes |
|-------|-----|-----|---------|-------|
| Trend Rate | 0% | 20% | 7% | Typical medical trend |
| Claim Amount | $0 | $10M | - | Per claimant |
| Deductible | $100K | $1M | $225K | ISL typical range |
| Claimants | 1 | 35 | - | Template supports 35 |

## Print Areas (for PDF)

- **Sheet 1:** `$A$1:$L$48` - Historical data summary
- **Sheet 2:** `$A$1:$K$26` - Complete analysis with recommendation

## Important Notes

1. **Don't Overwrite Formulas:** Columns H-K, P-AO (Sheet 1) and calculated cells in Sheet 2 contain formulas
2. **2025 Data:** Included for reference but excluded from averages (immature data)
3. **Row 46 Totals:** Auto-calculated SUM formulas feed into Sheet 2
4. **Merged Cells:** Several header areas use merged cells
5. **Hidden Rows:** Rows 33-44 in Sheet 1 are hidden in populated example but still functional

## Testing with Real Data

Use the populated example (`VCH - ISL Ded Analysis.xlsx`) to:
1. Verify formulas are working correctly
2. Understand expected output format
3. Test edge cases (claimants with $0 in some years, etc.)
4. Validate that your wizard produces identical results

## Next Steps

1. **Design UI mockups** based on VISUAL_STRUCTURE.md wizard flow
2. **Set up backend** with ExcelJS library
3. **Implement Step 1-2:** Basic info and claims entry
4. **Test write operations** to verify data enters correctly
5. **Implement Step 3-4:** Deductible options and premium quotes
6. **Test calculation flow** end-to-end
7. **Implement results display** (Step 6)
8. **Add PDF export** using print areas
9. **Polish UX** with validation, charts, etc.

## Support Files

### analyze-excel.js
Node.js script that analyzes Excel files and generates JSON output. Can be modified to:
- Validate workbook structure
- Extract specific data for testing
- Generate reports on Excel file contents

**Usage:**
```bash
node analyze-excel.js
```

### JSON Analysis Files
- **blank-analysis.json** - Every cell in blank template with formulas
- **populated-analysis.json** - Every cell in populated example with values

These can be used for:
- Automated testing
- Understanding formula patterns
- Debugging calculation issues

## Contact & Questions

For questions about this analysis or the Excel structure:
- Review the detailed documentation files
- Examine the JSON analysis for specific cell details
- Use analyze-excel.js to explore the workbooks further

## Version History

- **v1.0** (2025-10-16) - Initial comprehensive analysis
  - Complete structure documentation
  - Cell mapping guide
  - Visual diagrams
  - Code examples

---

**Total Analysis Files Generated:** 7 files (4 markdown docs + 2 JSON + 1 script)

**Total Cells Analyzed:**
- Blank Template: 105 cells with data, 55 formulas
- Populated Example: 1,225 cells with data, 971 formulas

**Documentation Word Count:** ~15,000 words

This analysis provides everything needed to build a production-ready wizard interface for the ISL Deductible Analyzer.
