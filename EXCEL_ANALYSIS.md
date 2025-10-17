# ISL (Individual Stop Loss) Deductible Analysis - Excel Structure Analysis

## Executive Summary

This Excel workbook is an **Individual Stop Loss (ISL) Deductible Analyzer** used by insurance brokers/consultants to help clients determine optimal stop-loss deductible levels for self-insured health plans. It analyzes historical claims data, trends it forward, and compares premium costs vs. projected claims liability across different deductible options.

**What it does:**
- Takes historical high-cost claimant data (up to 35 claimants across 4 plan years)
- Applies medical trend factors to project claims to future year
- Calculates excess claims above various deductible thresholds
- Compares premium savings vs. additional claims liability
- Provides recommendations on optimal deductible levels

---

## File Structure

### Files Analyzed
1. **ISL Ded Analysis.xlsx** - Blank template (105 KB)
2. **VCH - ISL Ded Analysis.xlsx** - Populated example for Valley Children's Hospital (50 KB)

### Worksheets
1. **ISL Analysis - Premium v Claims** (Main Summary/Output Sheet)
2. **ISL Analsys - Historical Claims** (Data Entry/Calculation Sheet)
3. **Sheet3** (Empty, unused)

---

## SHEET 1: ISL Analsys - Historical Claims (Data Entry & Calculations)

### Purpose
Primary data entry sheet where users input historical claims and the system calculates trended values and excess claims for each deductible option.

### Print Area
Defined as: **$A$1:$L$48** (visible summary section only)

### INPUT CELLS (User Entry Required)

#### 1. Company Information
| Cell | Field | Example |
|------|-------|---------|
| **A1** | Company Name | "Valley Children's Hospital" |
| **J2** | Effective Date | "Effective Date: 1/1/2026" |
| **K5** | Medical Trend Rate | 7.0% (0.07) |

#### 2. Historical Claims Data (Rows 8-43)
Up to **35 claimants** (Claimant 1 through Claimant 35, plus a "Total" row)

| Column | Field | Data Type |
|--------|-------|-----------|
| **B** | Claimant Name/Label | Text (e.g., "Claimant 1") |
| **C** | 2022 Plan Year Claims | Currency |
| **D** | 2023 Plan Year Claims | Currency |
| **E** | 2024 Plan Year Claims | Currency |
| **F** | 2025 Plan Year Claims* | Currency |

**Note:** Row 7 contains headers, rows 8-42 contain individual claimants, row 43 appears to be totals.

#### 3. Deductible Options (Row 7, hidden in calculation area)
These are hardcoded in the template but could be made configurable:
- **Current:** $225,000
- **Option 1:** $250,000
- **Option 2:** $300,000
- **Option 3:** $350,000
- **Option 4:** $400,000

Located in columns P, Q, R, S, T (for each plan year section)

---

### CALCULATED CELLS (Formulas)

#### Trended Claims to 2026 (Columns H-K)
These apply compound trend to bring all historical claims to 2026 dollar values.

| Column | Formula | Description |
|--------|---------|-------------|
| **H** | `=C8*((1+$K$5)^4)` | 2022 claims trended 4 years forward |
| **I** | `=D8*((1+$K$5)^3)` | 2023 claims trended 3 years forward |
| **J** | `=E8*((1+$K$5)^2)` | 2024 claims trended 2 years forward |
| **K** | `=F8*((1+$K$5)^1)` | 2025 claims trended 1 year forward |

#### Excess Claims Calculations (Columns P onwards)
For each plan year and each deductible option, calculate excess claims.

**2022 Plan Year (Columns P-T):**
- P: `=IF($H8>P$7,$H8-P$7,0)` - Excess over $225K
- Q: `=IF($H8>Q$7,$H8-Q$7,0)` - Excess over $250K
- R: `=IF($H8>R$7,$H8-R$7,0)` - Excess over $300K
- S: `=IF($H8>S$7,$H8-S$7,0)` - Excess over $350K
- T: `=IF($H8>T$7,$H8-T$7,0)` - Excess over $400K

**2023 Plan Year (Columns W-AA):**
Same pattern using column I (2023 trended claims)

**2024 Plan Year (Columns AD-AH):**
Same pattern using column J (2024 trended claims)

**2025 Plan Year (Columns AK-AO):**
Same pattern using column K (2025 trended claims)

#### Summary Totals (Row 46)
Each column P through AO contains a **SUM** of all excess claims for that deductible/year combination.

**Example:** Cell **P46** = SUM(P8:P45) = Total 2022 excess claims over $225K deductible

---

## SHEET 2: ISL Analysis - Premium v Claims (Summary/Output Sheet)

### Purpose
Executive summary showing comparison of claims vs. premium across deductible options, with recommendations.

### Print Area
Defined as: **$A$1:$K$26** (complete summary including recommendations)

---

### SECTION 1: Excess Claims Summary (Rows 1-13)

#### Header
| Cell | Content |
|------|---------|
| **A1** | Company name (linked from Historical sheet A1) |
| **A2** | "Specific Deductible Analysis - Projected Premium vs. Claims" |
| **I2** | "Effective Date: 1/1/2026" |
| **B5** | "Excess Claims Trended for 2026" |

#### Claims Comparison Table (Rows 7-12)

| Row | Column B | Column C | Columns D-G | Column H | Column I | Column J |
|-----|----------|----------|-------------|----------|----------|----------|
| **7** | "Option" | "ISL Deductible" | Historical Years | "Average ISL Claims" | "Additional ISL Claims" | "Number of Claimants" |
| **8** | "Current" | $225,000 | Year totals from Hist sheet | Average(D8:F8) | "-" | "-" |
| **9** | "Option 1" | $250,000 | Year totals from Hist sheet | Average(D9:F9) | H8-H9 | ROUND(I9/(C9-$C$8),1) |
| **10** | "Option 2" | $300,000 | Year totals from Hist sheet | Average(D10:F10) | H8-H10 | ROUND(I10/(C10-$C$8),1) |
| **11** | "Option 3" | $350,000 | Year totals from Hist sheet | Average(D11:F11) | H8-H11 | ROUND(I11/(C11-$C$8),1) |
| **12** | "Option 4" | $400,000 | Year totals from Hist sheet | Average(D12:F12) | H8-H12 | ROUND(I12/(C12-$C$8),1) |

**Formula Details:**
- **D8:** `='ISL Analsys - Historical Claims'!P46` (2022 totals for $225K)
- **E8:** `='ISL Analsys - Historical Claims'!W46` (2023 totals for $225K)
- **F8:** `='ISL Analsys - Historical Claims'!AD46` (2024 totals for $225K)
- **G8:** `='ISL Analsys - Historical Claims'!AK46` (2025 totals for $225K)
- **H8:** `=AVERAGE(D8:F8)` - Average of 2022-2024 (excludes 2025 as noted in footnote)
- **I9:** `=H8-H9` - Additional claims from increasing deductible
- **J9:** `=ROUND(I9/(C9-$C$8),1)` - Estimated number of claimants affected

**Row 13:** Footnote explaining why 2025 is excluded from average (immature data)

---

### SECTION 2: Stop Loss Renewal Comparison (Rows 15-23)

#### INPUT CELLS (Premium Data Entry)

| Row | Column B Label | Columns C-H | Data Type |
|-----|----------------|-------------|-----------|
| **17** | "Carrier" | Carrier names | Text |
| **18** | "Option" | Current/Renewal/Option 1-4 | Label |
| **19** | "ISL Deductible" | Deductible amounts | Currency (links to Section 1) |
| **20** | "ISL Premium" | **USER INPUT - Premium quotes** | Currency |

**Key Input Row:** **Row 20** requires user to enter premium quotes from carriers for each deductible option.

Example data:
- C20: $6,861,079 (Current premium)
- D20: $9,509,866 (Renewal premium at same deductible)
- E20: $8,853,332 (Quote for $250K deductible)
- F20: $7,287,993 (Quote for $300K deductible)
- G20: $6,189,916 (Quote for $350K deductible)
- H20: $5,263,089 (Quote for $400K deductible)

#### CALCULATED CELLS (Premium Analysis)

| Row | Column B Label | Formula | Description |
|-----|----------------|---------|-------------|
| **21** | "Premium Savings" | `=D20-E20` (for Option 1) | Savings vs. renewal |
| **22** | "Additional Claims" | `=I9` (for Option 1) | Links to Section 1 additional claims |
| **23** | "Projected Savings" | `=E21-E22` (for Option 1) | Net savings (premium - claims) |

**Net Savings Formula:** Premium Savings - Additional Claims = Projected Annual Savings

---

### SECTION 3: Recommendation (Rows 25-26)

| Row | Content |
|-----|---------|
| **25** | "Recommendation" (header) |
| **26** | Text block with recommendation (merged cells B26:J26) |

**Example Recommendation Text:**
> "An increase in the ISL deductible is recommended for the 2026 plan year. Based on a comparison of the historical claims trended for 2026, the premium savings at the higher deductibles would outweigh the projected additional claims liability for each of the four alternate deductible options. While the best savings would come at the $400,000 specific deductible, we do not recommend increasing the deductible that high considering the current deductible is $225,000. It is our recommendation to move to the $300,000 or $350,000 ISL levels which would likely yield $600k-$900k in annual savings versus the higher premium at the current deductible level (assuming 7% medical trend)."

---

## Calculation Flow Summary

```
1. USER INPUTS (Historical Claims Sheet)
   ├─ Company Name (A1)
   ├─ Effective Date (J2)
   ├─ Trend Rate (K5)
   └─ Historical Claims (C8:F43)
        ├─ 2022 Plan Year (Column C)
        ├─ 2023 Plan Year (Column D)
        ├─ 2024 Plan Year (Column E)
        └─ 2025 Plan Year (Column F)

2. TREND CALCULATIONS
   └─ Apply compound trend to bring all claims to 2026 dollars (H8:K43)

3. EXCESS CLAIMS CALCULATION
   └─ For each claimant, calculate excess over each deductible option
      ├─ 2022 Trended: P8:T43
      ├─ 2023 Trended: W8:AA43
      ├─ 2024 Trended: AD8:AH43
      └─ 2025 Trended: AK8:AO43

4. TOTALS BY DEDUCTIBLE OPTION (Row 46)
   └─ Sum all excess claims for each deductible/year combination

5. SUMMARY SHEET - SECTION 1
   ├─ Pull totals from Historical sheet row 46
   ├─ Calculate averages (excluding 2025)
   ├─ Calculate additional claims vs. current
   └─ Estimate number of claimants affected

6. USER INPUTS (Summary Sheet)
   └─ Enter premium quotes for each deductible option (Row 20)

7. SUMMARY SHEET - SECTION 2
   ├─ Calculate premium savings vs. renewal
   ├─ Link additional claims from Section 1
   └─ Calculate net projected savings

8. RECOMMENDATION
   └─ Manual text entry based on analysis results
```

---

## Key Formulas to Preserve

### 1. Trending Formula
```excel
=Historical_Claim * ((1 + Trend_Rate)^Years_Forward)
```
**Example:** `=C8*((1+$K$5)^4)` for 2022 claims

### 2. Excess Claims Formula
```excel
=IF(Trended_Claim > Deductible, Trended_Claim - Deductible, 0)
```
**Example:** `=IF($H8>P$7,$H8-P$7,0)`

### 3. Additional Claims (Savings)
```excel
=Current_Deductible_Claims - Higher_Deductible_Claims
```
**Example:** `=H8-H9`

### 4. Estimated Claimants Affected
```excel
=ROUND(Additional_Claims / (New_Deductible - Current_Deductible), 1)
```
**Example:** `=ROUND(I9/(C9-$C$8),1)`

### 5. Net Savings
```excel
=Premium_Savings - Additional_Claims
```
**Example:** `=E21-E22`

---

## Wizard Interface Requirements

### Step 1: Basic Information
**Inputs:**
- Company Name
- Effective Date
- Medical Trend Rate (default: 7.0%)

### Step 2: Historical Claims Entry
**Options:**
- Manual entry (form with 35 claimant rows)
- Upload CSV/Excel
- Use template with existing data

**Fields per claimant:**
- Claimant identifier/name
- 2022 claim amount
- 2023 claim amount
- 2024 claim amount
- 2025 claim amount

**Validation:**
- At least 1 claimant required
- Claims must be positive numbers or blank
- Reasonable claim amounts (e.g., < $10M per claimant)

### Step 3: Deductible Options
**Inputs:**
- Current deductible (default: $225,000)
- Up to 4 alternative deductible options (defaults: $250K, $300K, $350K, $400K)

**Allow customization of deductible amounts**

### Step 4: Premium Quotes
**Inputs:**
- Carrier name(s)
- Current year premium
- Renewal premium quote (at current deductible)
- Premium quotes for each alternative deductible option

**Validation:**
- Premiums should generally decrease as deductibles increase
- Warning if relationship is reversed

### Step 5: Review & Calculate
**Display:**
- Summary of inputs
- "Calculate" button to process
- Loading indicator during calculation

### Step 6: Results Display

#### Panel 1: Claims Analysis
- Table showing excess claims by deductible option
- Average ISL claims
- Additional claims (savings)
- Estimated claimants affected

#### Panel 2: Financial Comparison
- Premium comparison table
- Premium savings
- Additional claims liability
- **Net projected savings** (highlighted)

#### Panel 3: Recommendation
- Auto-generated recommendation based on:
  - Which options have positive net savings
  - Magnitude of deductible increase vs. current
  - Total projected savings

**Recommendation Logic:**
```
IF net_savings > 0:
  - Option is recommended
  - Highlight options with best savings
  - Warn if deductible increase is too aggressive (>100% increase)
ELSE:
  - Not recommended
```

### Step 7: Export/Report
**Options:**
- Download populated Excel file
- Print PDF report (matching Excel print areas)
- Email results
- Save analysis (with ability to reload later)

---

## Data Validation & Business Rules

### Input Validation
1. **Trend Rate:** 0% - 20% (typical medical trend)
2. **Claims:** $0 - $10,000,000 per claimant
3. **Deductibles:** $100,000 - $1,000,000 (typical ISL range)
4. **Premiums:** Must be positive

### Business Logic
1. **2025 Data Handling:** Include in display but exclude from averages (immature data)
2. **Claimant Count Estimation:** Round to 1 decimal place
3. **Deductible Progression:** Options should be in ascending order
4. **Premium Relationship:** Generally expect premiums to decrease with higher deductibles

### Calculated Fields
1. **Average Claims:** Use only 2022-2024 data (not 2025)
2. **Additional Claims:** Always relative to current deductible
3. **Net Savings:** Premium savings minus additional claims

---

## Technical Considerations

### Excel Backend Processing
1. **Template Selection:** Use blank template as base
2. **Data Population:**
   - Write to cells C8:F42 (historical claims)
   - Write to cell K5 (trend rate)
   - Write to cell A1 (company name)
   - Write to cell J2 (effective date)
   - Write to row 20 (premium quotes)

3. **Calculation Trigger:** Excel will auto-calculate all formulas
4. **Read Results:**
   - Section 1: Read cells D8:J12
   - Section 2: Read cells C17:H23
   - Row 46 totals for detailed analysis

### Performance
- Small file size (~100KB)
- Fast calculations (all formulas are simple)
- No VBA macros required
- Compatible with ExcelJS/XLSX libraries

### Formatting Preservation
- Currency formatting for dollar amounts
- Percentage formatting for trend rate
- Decimal places (1 for claimant counts)
- Cell merging for headers and recommendation text
- Print areas for PDF generation

---

## Example Data (Valley Children's Hospital)

### Inputs
- **Company:** Valley Children's Hospital
- **Trend Rate:** 7.0%
- **Current Deductible:** $225,000
- **Top Claimants:**
  - Claimant 1: $1,094,597 (2022), $957,518 (2023), $1,273,422 (2024), $851,985 (2025)
  - Claimant 2: $936,752 (2022), $852,300 (2023), $1,103,046 (2024), $604,471 (2025)
  - [33 more claimants...]

### Results
- **Current Deductible ($225K):** Avg claims = $6,780,339
- **Option 1 ($250K):** Avg claims = $6,145,373, Savings = $634,966, ~25 claimants
- **Option 2 ($300K):** Avg claims = $5,158,791, Savings = $1,621,548, ~22 claimants
- **Option 3 ($350K):** Avg claims = $4,389,577, Savings = $2,390,762, ~19 claimants
- **Option 4 ($400K):** Avg claims = $3,747,227, Savings = $3,033,112, ~17 claimants

### Premium Comparison
- **Renewal at $225K:** $9,509,866
- **Option 2 ($300K):** $7,287,993 premium, **Net savings: $600,325**
- **Option 3 ($350K):** $6,189,916 premium, **Net savings: $929,188**

### Recommendation
Move to $300K or $350K deductible for $600K-$900K annual savings.

---

## Files Generated
- `/home/sam/Documents/github-repos/xlb/xlb/blank-analysis.json` - Complete cell-by-cell analysis of blank template
- `/home/sam/Documents/github-repos/xlb/xlb/populated-analysis.json` - Complete cell-by-cell analysis of populated example
- `/home/sam/Documents/github-repos/xlb/xlb/analyze-excel.js` - Node.js script used for analysis

---

## Next Steps for Wizard Development

1. **Frontend Design:**
   - Multi-step wizard interface
   - Responsive data tables for claims entry
   - Real-time calculation preview
   - Chart visualizations of premium vs. claims

2. **Backend Integration:**
   - ExcelJS for file manipulation
   - Write user inputs to appropriate cells
   - Read calculated results
   - Generate PDF from print areas

3. **Features to Add:**
   - CSV import for historical claims
   - Copy/paste from Excel
   - Save/load analysis sessions
   - Comparison of multiple scenarios
   - Historical analysis archive

4. **Validation & Error Handling:**
   - Input validation on frontend
   - Backend verification
   - Graceful error messages
   - Warning indicators for unusual data

5. **Reporting:**
   - Professional PDF output
   - Excel download with calculations
   - Email delivery
   - Sharing/collaboration features
