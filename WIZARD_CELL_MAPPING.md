# ISL Deductible Analyzer - Wizard to Excel Cell Mapping

## Quick Reference for Development

This document provides the exact cell addresses for reading/writing data between the wizard interface and Excel workbook.

---

## WRITE Operations (Wizard Input → Excel)

### Sheet: "ISL Analsys - Historical Claims"

#### Step 1: Basic Information
```javascript
{
  companyName: 'A1',           // String
  effectiveDate: 'J2',         // String (formatted: "Effective Date: MM/DD/YYYY")
  trendRate: 'K5'              // Decimal (e.g., 0.07 for 7%)
}
```

#### Step 2: Historical Claims Data
**Rows 8-44** (up to 37 claimants, but typically use rows 8-42 for 35 claimants)

```javascript
// For each claimant (i = 0 to 34):
const row = 8 + i;
{
  claimantName: `B${row}`,     // String (e.g., "Claimant 1")
  year2022: `C${row}`,         // Number (currency)
  year2023: `D${row}`,         // Number (currency)
  year2024: `E${row}`,         // Number (currency)
  year2025: `F${row}`          // Number (currency)
}
```

**Example:**
```javascript
// Claimant 1 (Row 8)
worksheet['B8'] = { v: 'Claimant 1', t: 's' };
worksheet['C8'] = { v: 1094597, t: 'n', z: '$#,##0' };
worksheet['D8'] = { v: 957518, t: 'n', z: '$#,##0' };
worksheet['E8'] = { v: 1273422, t: 'n', z: '$#,##0' };
worksheet['F8'] = { v: 851985, t: 'n', z: '$#,##0' };
```

### Sheet: "ISL Analysis - Premium v Claims"

#### Step 3: Deductible Options (Optional - defaults exist)
**Row 7-12, Column C** (if you want to customize deductibles)

```javascript
{
  currentDeductible: 'C8',     // Number (default: 225000)
  option1Deductible: 'C9',     // Number (default: 250000)
  option2Deductible: 'C10',    // Number (default: 300000)
  option3Deductible: 'C11',    // Number (default: 350000)
  option4Deductible: 'C12'     // Number (default: 400000)
}
```

**Note:** If deductibles are changed, you must also update the corresponding cells in the Historical Claims sheet (row 7, columns P-AO). It's recommended to keep defaults unless user specifically requests custom deductibles.

#### Step 4: Premium Quotes
**Row 17-20** (Premium comparison section)

```javascript
{
  // Row 17: Carrier names
  carrierCurrent: 'C17',       // String
  carrierRenewal: 'D17',       // String (usually same as current)
  carrierOption1: 'E17',       // String
  carrierOption2: 'F17',       // String
  carrierOption3: 'G17',       // String
  carrierOption4: 'H17',       // String

  // Row 20: Premium amounts (KEY INPUTS)
  premiumCurrent: 'C20',       // Number (current year premium)
  premiumRenewal: 'D20',       // Number (renewal quote at current deductible)
  premiumOption1: 'E20',       // Number (quote for Option 1 deductible)
  premiumOption2: 'F20',       // Number (quote for Option 2 deductible)
  premiumOption3: 'G20',       // Number (quote for Option 3 deductible)
  premiumOption4: 'H20'        // Number (quote for Option 4 deductible)
}
```

#### Step 5: Recommendation (Optional)
**Row 26** (merged cells B26:J26)

```javascript
{
  recommendationText: 'B26'    // String (long text, can include line breaks)
}
```

---

## READ Operations (Excel Results → Wizard Display)

### Sheet: "ISL Analysis - Premium v Claims"

#### Section 1: Claims Analysis Results (Rows 8-12)

```javascript
// For each option (rows 8-12):
const resultsRow = (optionIndex) => {
  const row = 8 + optionIndex; // 0=Current, 1=Option1, 2=Option2, etc.
  return {
    optionName: `B${row}`,           // String (e.g., "Current", "Option 1")
    deductible: `C${row}`,           // Number (formatted as currency)
    claims2022: `D${row}`,           // Number (formatted as currency)
    claims2023: `E${row}`,           // Number (formatted as currency)
    claims2024: `F${row}`,           // Number (formatted as currency)
    claims2025: `G${row}`,           // Number (formatted as currency)
    averageClaims: `H${row}`,        // Number (formatted as currency)
    additionalClaims: `I${row}`,     // Number or "-" for current
    numClaimants: `J${row}`          // Number (1 decimal) or "-" for current
  };
};

// Example usage:
const currentResults = {
  deductible: worksheet['C8'].v,      // $225,000
  averageClaims: worksheet['H8'].v    // $6,780,339
};

const option1Results = {
  deductible: worksheet['C9'].v,      // $250,000
  averageClaims: worksheet['H9'].v,   // $6,145,373
  additionalClaims: worksheet['I9'].v, // $634,966
  numClaimants: worksheet['J9'].v     // 25.4
};
```

#### Section 2: Premium Comparison Results (Rows 17-23)

```javascript
// For each option (columns C-H):
const premiumResults = (columnIndex) => {
  const col = String.fromCharCode(67 + columnIndex); // C=0, D=1, E=2, etc.
  return {
    carrier: `${col}17`,             // String
    option: `${col}18`,              // String
    deductible: `${col}19`,          // Number (formatted as currency)
    premium: `${col}20`,             // Number (formatted as currency)
    premiumSavings: `${col}21`,      // Number or "-"
    additionalClaims: `${col}22`,    // Number or "-"
    projectedSavings: `${col}23`     // Number or "-"
  };
};

// Example usage:
const option2Premium = {
  deductible: worksheet['F19'].v,        // $300,000
  premium: worksheet['F20'].v,           // $7,287,993
  premiumSavings: worksheet['F21'].v,    // $2,221,873
  additionalClaims: worksheet['F22'].v,  // $1,621,548
  projectedSavings: worksheet['F23'].v   // $600,325 (NET SAVINGS)
};
```

#### Section 3: Recommendation
```javascript
{
  recommendationText: 'B26'    // String (merged cell)
}
```

---

## Complete Read Flow for Results Display

```javascript
async function readAnalysisResults(workbook) {
  const summarySheet = workbook.Sheets['ISL Analysis - Premium v Claims'];

  // 1. Company Info
  const companyName = summarySheet['A1'].v;
  const effectiveDate = summarySheet['I2'].v;

  // 2. Claims Analysis Table
  const claimsAnalysis = [];
  for (let row = 8; row <= 12; row++) {
    claimsAnalysis.push({
      option: summarySheet[`B${row}`].v,
      deductible: summarySheet[`C${row}`].v,
      claims2022: summarySheet[`D${row}`].v,
      claims2023: summarySheet[`E${row}`].v,
      claims2024: summarySheet[`F${row}`].v,
      claims2025: summarySheet[`G${row}`].v,
      averageClaims: summarySheet[`H${row}`].v,
      additionalClaims: summarySheet[`I${row}`]?.v || '-',
      numClaimants: summarySheet[`J${row}`]?.v || '-'
    });
  }

  // 3. Premium Comparison Table
  const premiumComparison = [];
  for (let colIdx = 0; colIdx < 6; colIdx++) {
    const col = String.fromCharCode(67 + colIdx); // C, D, E, F, G, H
    premiumComparison.push({
      carrier: summarySheet[`${col}17`].v,
      option: summarySheet[`${col}18`].v,
      deductible: summarySheet[`${col}19`].v,
      premium: summarySheet[`${col}20`].v,
      premiumSavings: summarySheet[`${col}21`]?.v || '-',
      additionalClaims: summarySheet[`${col}22`]?.v || '-',
      projectedSavings: summarySheet[`${col}23`]?.v || '-'
    });
  }

  // 4. Recommendation
  const recommendation = summarySheet['B26']?.v || '';

  return {
    companyName,
    effectiveDate,
    claimsAnalysis,
    premiumComparison,
    recommendation
  };
}
```

---

## Cell Formatting Requirements

### Number Formats (z property in ExcelJS)

```javascript
const formats = {
  currency: '$#,##0',              // $1,234,567
  currencyWithCents: '$#,##0.00',  // $1,234,567.89
  percentage: '0.0%',              // 7.0%
  decimal1: '#,##0.0',             // 25.4
  integer: '#,##0'                 // 1,234
};

// Example usage:
worksheet['C8'] = { v: 225000, t: 'n', z: '$#,##0' };
worksheet['K5'] = { v: 0.07, t: 'n', z: '0.0%' };
worksheet['J9'] = { v: 25.4, t: 'n', z: '#,##0.0' };
```

### Cell Types

```javascript
const cellTypes = {
  string: 's',   // Text
  number: 'n',   // Numeric values
  boolean: 'b',  // True/False
  error: 'e',    // Error
  date: 'd'      // Date
};
```

---

## Data Validation Rules

### Input Validation

```javascript
const validation = {
  trendRate: {
    min: 0,
    max: 0.20,       // 20%
    default: 0.07,   // 7%
    errorMessage: 'Trend rate must be between 0% and 20%'
  },

  claimAmount: {
    min: 0,
    max: 10000000,   // $10M per claimant
    errorMessage: 'Claim amount must be between $0 and $10,000,000'
  },

  deductible: {
    min: 100000,     // $100K
    max: 1000000,    // $1M
    default: 225000, // $225K
    errorMessage: 'Deductible must be between $100,000 and $1,000,000'
  },

  premium: {
    min: 0,
    max: 100000000,  // $100M annual premium
    errorMessage: 'Premium must be a positive number less than $100,000,000'
  }
};
```

---

## Hidden Rows/Columns

### Historical Claims Sheet
- **Rows 33-44:** Some rows are hidden in the populated example
- These rows still contain formulas and should not be deleted
- When writing data, you can write to rows 8-42 (35 claimants)
- Rows 43-45 may contain summary data or be blank

### Calculation Columns
- **Columns M, N, O, U, V, AB, AC, AI, AJ:** Spacer columns (may be hidden)
- **Columns P-AO:** Contain excess claims calculations (visible in analysis)

---

## Print Areas (for PDF Generation)

### Sheet 1: "ISL Analysis - Premium v Claims"
**Print Area:** `$A$1:$K$26`

This includes:
- Company header
- Section 1: Claims analysis table (rows 1-13)
- Section 2: Premium comparison (rows 15-23)
- Section 3: Recommendation (rows 25-26)

### Sheet 2: "ISL Analsys - Historical Claims"
**Print Area:** `$A$1:$L$48`

This includes:
- Company header
- Input section with historical claims (rows 1-45)
- Summary totals (row 46)
- Excludes the detailed calculation columns (P-AO)

---

## Sample Code: Writing Claims Data

```javascript
const XLSX = require('xlsx');

function writeClaimsData(filePath, data) {
  // Read template
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets['ISL Analsys - Historical Claims'];

  // Write basic info
  worksheet['A1'] = { v: data.companyName, t: 's' };
  worksheet['J2'] = { v: `Effective Date: ${data.effectiveDate}`, t: 's' };
  worksheet['K5'] = { v: data.trendRate / 100, t: 'n', z: '0.0%' };

  // Write claimants
  data.claimants.forEach((claimant, index) => {
    const row = 8 + index;

    worksheet[`B${row}`] = { v: claimant.name, t: 's' };
    worksheet[`C${row}`] = { v: claimant.year2022 || 0, t: 'n', z: '$#,##0' };
    worksheet[`D${row}`] = { v: claimant.year2023 || 0, t: 'n', z: '$#,##0' };
    worksheet[`E${row}`] = { v: claimant.year2024 || 0, t: 'n', z: '$#,##0' };
    worksheet[`F${row}`] = { v: claimant.year2025 || 0, t: 'n', z: '$#,##0' };
  });

  // Save workbook
  XLSX.writeFile(workbook, filePath);
}

// Usage
const analysisData = {
  companyName: 'Valley Children\'s Hospital',
  effectiveDate: '1/1/2026',
  trendRate: 7.0,
  claimants: [
    { name: 'Claimant 1', year2022: 1094597, year2023: 957518, year2024: 1273422, year2025: 851985 },
    { name: 'Claimant 2', year2022: 936752, year2023: 852300, year2024: 1103046, year2025: 604471 },
    // ... more claimants
  ]
};

writeClaimsData('ISL Ded Analysis.xlsx', analysisData);
```

---

## Sample Code: Writing Premium Data

```javascript
function writePremiumData(filePath, data) {
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets['ISL Analysis - Premium v Claims'];

  // Write carriers (row 17)
  ['C', 'D', 'E', 'F', 'G', 'H'].forEach((col, idx) => {
    worksheet[`${col}17`] = { v: data.carriers[idx], t: 's' };
  });

  // Write premiums (row 20)
  worksheet['C20'] = { v: data.premiumCurrent, t: 'n', z: '$#,##0' };
  worksheet['D20'] = { v: data.premiumRenewal, t: 'n', z: '$#,##0' };
  worksheet['E20'] = { v: data.premiumOption1, t: 'n', z: '$#,##0' };
  worksheet['F20'] = { v: data.premiumOption2, t: 'n', z: '$#,##0' };
  worksheet['G20'] = { v: data.premiumOption3, t: 'n', z: '$#,##0' };
  worksheet['H20'] = { v: data.premiumOption4, t: 'n', z: '$#,##0' };

  // Save workbook
  XLSX.writeFile(workbook, filePath);
}

// Usage
const premiumData = {
  carriers: [
    'Symetra Life Ins. Co.',
    'Symetra Life Ins. Co.',
    'Symetra Life Ins. Co.',
    'Symetra Life Ins. Co.',
    'Symetra Life Ins. Co.',
    'Symetra Life Ins. Co.'
  ],
  premiumCurrent: 6861079,
  premiumRenewal: 9509866,
  premiumOption1: 8853332,
  premiumOption2: 7287993,
  premiumOption3: 6189916,
  premiumOption4: 5263089
};

writePremiumData('ISL Ded Analysis.xlsx', premiumData);
```

---

## Key Considerations for Wizard Development

1. **Preserve Formulas:** Never overwrite cells with formulas (columns H-K, P-AO, and summary sheet calculated cells)

2. **Update Range:** When writing the workbook, ensure the `!ref` range is properly updated if you write to cells outside the current range

3. **Auto-Calculate:** After writing data, Excel will automatically recalculate all formulas when the file is opened

4. **Cell Styling:** Copy formatting from the template to maintain consistent appearance

5. **Validation:** Validate all inputs before writing to Excel to prevent calculation errors

6. **Error Handling:** Check for formula errors (#DIV/0!, #VALUE!, etc.) when reading results

7. **Blank Cells:** Empty cells should be written as `{ v: 0, t: 'n', z: '$#,##0' }` for numeric fields, not left undefined

8. **String Formatting:** The effective date in cell J2 should include the prefix "Effective Date: "

9. **Merged Cells:** Be aware of merged cells when styling or reading data (A1, I2:K3, B13:J13, B26:J26)

10. **Row 46 Totals:** These are calculated by SUM formulas and should never be manually written

---

## Testing Checklist

- [ ] Write company name to A1 → displays on both sheets
- [ ] Write trend rate to K5 → affects all trended calculations
- [ ] Write 1 claimant → all calculations work
- [ ] Write 35 claimants → all calculations work
- [ ] Write premium data → savings calculations update
- [ ] Read claims analysis results → all fields present
- [ ] Read premium comparison → all fields present
- [ ] Export to PDF → print areas render correctly
- [ ] Open in Excel → all formulas intact
- [ ] Recalculate in Excel → values match wizard results
