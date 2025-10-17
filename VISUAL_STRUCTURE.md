# ISL Deductible Analyzer - Visual Structure Diagram

## Excel Workbook Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ISL Ded Analysis.xlsx                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Sheet 1: ISL Analsys - Historical Claims  (DATA ENTRY + CALCULATIONS)     │
│  Sheet 2: ISL Analysis - Premium v Claims  (SUMMARY + OUTPUT)              │
│  Sheet 3: Sheet3                           (UNUSED)                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Sheet 1: ISL Analsys - Historical Claims

### Visual Layout

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ A              B           C          D          E          F      G    H         I      J   │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│1  [Company Name]                                                                             │
│2                                                     [Effective Date: MM/DD/YYYY]            │
│3                                                                                             │
│4                                                                                             │
│5           Historical Claims Report              2026 Equivalents   Trend: [7.0%]           │
│6                                                                                             │
│7           Top Claimants    2022      2023      2024      2025*        2022   2023   2024... │
│8           Claimant 1      [$amt]    [$amt]    [$amt]    [$amt]      [CALC] [CALC] [CALC]   │
│9           Claimant 2      [$amt]    [$amt]    [$amt]    [$amt]      [CALC] [CALC] [CALC]   │
│10          Claimant 3      [$amt]    [$amt]    [$amt]    [$amt]      [CALC] [CALC] [CALC]   │
│...                                                                                           │
│42          Claimant 35     [$amt]    [$amt]    [$amt]    [$amt]      [CALC] [CALC] [CALC]   │
│43          (blank/total)                                                                     │
│44                                                                                            │
│45                                                                                            │
│46          ISL Deductible  $225K     $225K     $225K     $225K       [SUM]  [SUM]  [SUM]    │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

EXTENDED VIEW (Columns O→AO): Excess Claims Calculations
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ O     P       Q       R       S       T    U  V       W       X       Y       Z      AA      │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│7     2022    [Deductible Options: 225K, 250K, 300K, 350K, 400K]                             │
│8            [CALC] [CALC] [CALC] [CALC] [CALC]  [CALC] [CALC] [CALC] [CALC] [CALC] [CALC]   │
│9            [CALC] [CALC] [CALC] [CALC] [CALC]  [CALC] [CALC] [CALC] [CALC] [CALC] [CALC]   │
│...                                                                                           │
│46           [SUM]  [SUM]  [SUM]  [SUM]  [SUM]   [SUM]  [SUM]  [SUM]  [SUM]  [SUM]  [SUM]    │
│                                                                                              │
│   Pattern continues: AC-AH (2024), AJ-AO (2025)                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow Diagram

```
USER INPUTS (Columns C-F)              TRENDING (Columns H-K)
┌──────────────────────┐              ┌──────────────────────┐
│ 2022 Plan Year (C)   │─────────────>│ 2022 → 2026 (H)      │
│ 2023 Plan Year (D)   │─────────────>│ 2023 → 2026 (I)      │
│ 2024 Plan Year (E)   │─────────────>│ 2024 → 2026 (J)      │
│ 2025 Plan Year (F)   │─────────────>│ 2025 → 2026 (K)      │
└──────────────────────┘              └──────────────────────┘
         ↑                                       ↓
         │                                       │
    ┌────┴────┐                         ┌────────┴─────────┐
    │ Trend   │                         │ Excess Claims    │
    │ Rate    │                         │ Calculations     │
    │ (K5)    │                         │ (Columns P-AO)   │
    └─────────┘                         └──────────────────┘
                                                 ↓
                                        ┌────────────────────┐
                                        │ Row 46 Totals      │
                                        │ (SUM by deductible)│
                                        └────────────────────┘
                                                 ↓
                                        ┌────────────────────┐
                                        │ FEEDS TO SHEET 2   │
                                        └────────────────────┘
```

---

## Sheet 2: ISL Analysis - Premium v Claims

### Visual Layout

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ A              B              C         D         E         F         G         H      I   J │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│1  [Company Name (from Sheet 1)]                                                             │
│2  Specific Deductible Analysis - Projected Premium vs. Claims    [Effective Date]          │
│3                                                                                             │
│4                                                                                             │
│5           Excess Claims Trended for 2026                                                    │
│6                                                                                             │
│7           Option      ISL Ded    2022     2023     2024     2025*   Average  Additional #  │
│8           Current     $225K     [CALC]   [CALC]   [CALC]   [CALC]   [CALC]      -      -   │
│9           Option 1    $250K     [CALC]   [CALC]   [CALC]   [CALC]   [CALC]   [CALC]  [CALC]│
│10          Option 2    $300K     [CALC]   [CALC]   [CALC]   [CALC]   [CALC]   [CALC]  [CALC]│
│11          Option 3    $350K     [CALC]   [CALC]   [CALC]   [CALC]   [CALC]   [CALC]  [CALC]│
│12          Option 4    $400K     [CALC]   [CALC]   [CALC]   [CALC]   [CALC]   [CALC]  [CALC]│
│13          * Footnote: 2025 data is immature, not included in average                       │
│14                                                                                            │
│15          Stop Loss Renewal Comparison                                                      │
│16                                                                                            │
│17          Carrier     [Name]    [Name]   [Name]   [Name]   [Name]   [Name]                 │
│18          Option      Current   Renewal  Opt 1    Opt 2    Opt 3    Opt 4                  │
│19          ISL Ded     $225K     $225K    $250K    $300K    $350K    $400K                   │
│20          ISL Prem    [INPUT]   [INPUT]  [INPUT]  [INPUT]  [INPUT]  [INPUT]                │
│21          Prem Sav       -         -     [CALC]   [CALC]   [CALC]   [CALC]                 │
│22          Add Claims     -         -     [CALC]   [CALC]   [CALC]   [CALC]                 │
│23          Proj Sav       -         -     [CALC]   [CALC]   [CALC]   [CALC]  ◄── NET $$$    │
│24                                                                                            │
│25          Recommendation                                                                    │
│26          [Text block with analysis recommendation - merged cells B26:J26]                 │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow Diagram

```
FROM SHEET 1                           SECTION 1: Claims Analysis
┌──────────────────────┐              ┌──────────────────────────┐
│ Row 46 Totals        │──────────────>│ D8:G12 (Year totals)     │
│ (P46, Q46, etc.)     │              │ H8:H12 (Averages)        │
└──────────────────────┘              │ I9:I12 (Additional $)    │
                                      │ J9:J12 (# Claimants)     │
                                      └──────────────────────────┘
                                                 ↓
USER INPUT                                       ↓
┌──────────────────────┐                        ↓
│ Row 20: Premiums     │──────────┐             ↓
└──────────────────────┘          │             ↓
                                  ↓             ↓
                          ┌───────────────────────────┐
                          │ SECTION 2: Premium Comp   │
                          │ Row 21: Prem Savings      │
                          │ Row 22: Add Claims (I→)   │
                          │ Row 23: NET SAVINGS ★     │
                          └───────────────────────────┘
                                      ↓
                          ┌───────────────────────────┐
                          │ SECTION 3: Recommendation │
                          │ (Manual text entry)       │
                          └───────────────────────────┘
```

---

## Calculation Formulas - Visual Reference

### Trending Formula (Sheet 1, Columns H-K)

```
Historical Claim × ((1 + Trend Rate)^Years Forward) = Trended Claim

Example:
┌──────────────┐
│ 2022 Claim   │        ┌──────────┐
│ $1,094,597   │  ×     │ Trend:   │    ^4 years    =   $1,434,794
└──────────────┘        │ (1.07)   │
                        └──────────┘
```

### Excess Claims Formula (Sheet 1, Columns P-AO)

```
IF (Trended Claim > Deductible) THEN (Trended Claim - Deductible) ELSE 0

Example:
┌──────────────┐        ┌──────────────┐
│ Trended      │        │ Deductible   │
│ $1,434,794   │   >    │ $225,000     │    ?
└──────────────┘        └──────────────┘
        ↓
    YES (claim exceeds deductible)
        ↓
$1,434,794 - $225,000 = $1,209,794 ← Excess Amount
```

### Additional Claims Formula (Sheet 2, Column I)

```
Current Deductible Avg Claims - Higher Deductible Avg Claims = Additional Claims

Example:
┌──────────────────┐        ┌──────────────────┐
│ Current ($225K)  │        │ Option 2 ($300K) │
│ Avg: $6,780,339  │   -    │ Avg: $5,158,791  │   =  $1,621,548
└──────────────────┘        └──────────────────┘
                                                    (Annual additional claims)
```

### Net Savings Formula (Sheet 2, Row 23)

```
Premium Savings - Additional Claims = Net Projected Savings

Example:
┌──────────────────┐        ┌──────────────────┐
│ Premium Savings  │        │ Additional       │
│ $2,221,873       │   -    │ Claims           │   =  $600,325
│ (renewal vs opt) │        │ $1,621,548       │
└──────────────────┘        └──────────────────┘
                                                    ★ NET ANNUAL SAVINGS ★
```

---

## Wizard User Interface Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         WIZARD STEP PROGRESSION                             │
└─────────────────────────────────────────────────────────────────────────────┘

STEP 1: Basic Information
┌───────────────────────────┐
│ Company Name: [_________] │     Write to: Sheet1!A1
│ Effective Date: [MM/DD/YY]│     Write to: Sheet1!J2
│ Trend Rate: [7.0]%        │     Write to: Sheet1!K5
└───────────────────────────┘
         ↓
STEP 2: Historical Claims
┌───────────────────────────────────────────────────────┐
│ Option: [ Manual Entry | Upload CSV | Paste ]        │
│                                                       │
│ ┌─────────────────────────────────────────────────┐  │
│ │ Claimant  │  2022   │  2023   │  2024   │ 2025* │  │
│ ├──────────────────────────────────────────────────┤  │
│ │ Claim 1   │ [_____] │ [_____] │ [_____] │ [___] │  │  Write to: Sheet1!C8:F42
│ │ Claim 2   │ [_____] │ [_____] │ [_____] │ [___] │  │
│ │ ...       │         │         │         │       │  │
│ │ [+ Add Claimant] (up to 35)                     │  │
│ └─────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────┘
         ↓
STEP 3: Deductible Options
┌───────────────────────────────────────────────────────┐
│ Current Deductible: [$225,000]                        │  Write to: Sheet2!C8
│                                                       │
│ Alternative Options (up to 4):                        │
│   Option 1: [$250,000]  ☑ Include                    │  Write to: Sheet2!C9
│   Option 2: [$300,000]  ☑ Include                    │  Write to: Sheet2!C10
│   Option 3: [$350,000]  ☑ Include                    │  Write to: Sheet2!C11
│   Option 4: [$400,000]  ☑ Include                    │  Write to: Sheet2!C12
└───────────────────────────────────────────────────────┘
         ↓
STEP 4: Premium Quotes
┌───────────────────────────────────────────────────────┐
│ Carrier Name: [Symetra Life Ins. Co.]                │  Write to: Sheet2!C17
│                                                       │
│ Premium Quotes:                                       │
│   Current Year:        [$6,861,079]                   │  Write to: Sheet2!C20
│   Renewal (at $225K):  [$9,509,866]                   │  Write to: Sheet2!D20
│   Option 1 ($250K):    [$8,853,332]                   │  Write to: Sheet2!E20
│   Option 2 ($300K):    [$7,287,993]                   │  Write to: Sheet2!F20
│   Option 3 ($350K):    [$6,189,916]                   │  Write to: Sheet2!G20
│   Option 4 ($400K):    [$5,263,089]                   │  Write to: Sheet2!H20
└───────────────────────────────────────────────────────┘
         ↓
STEP 5: Review & Calculate
┌───────────────────────────────────────────────────────┐
│ ✓ Company: Valley Children's Hospital                │
│ ✓ 33 Claimants entered                                │
│ ✓ 4 Deductible options selected                       │
│ ✓ Premium quotes provided                             │
│                                                       │
│        [◄ Back]              [Calculate ►]            │
└───────────────────────────────────────────────────────┘
         ↓
    [Processing...]
    • Writing data to Excel
    • Excel auto-calculating formulas
    • Reading results
         ↓
STEP 6: Results
┌─────────────────────────────────────────────────────────────────────────────┐
│ CLAIMS ANALYSIS                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Option     Deductible  Avg Claims   Additional   # Claimants  [Chart] │ │  Read from:
│ │ Current    $225,000    $6,780,339   -            -                    │ │  Sheet2!C8:J12
│ │ Option 1   $250,000    $6,145,373   $634,966     25.4                 │ │
│ │ Option 2   $300,000    $5,158,791   $1,621,548   21.6    ★ BEST ★    │ │
│ │ Option 3   $350,000    $4,389,577   $2,390,762   19.1                 │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ PREMIUM COMPARISON                                                          │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Option    Deductible Premium    Prem Sav   Add Claims  NET SAVINGS   │ │  Read from:
│ │ Renewal   $225,000   $9,509,866 -          -           -             │ │  Sheet2!C19:H23
│ │ Option 1  $250,000   $8,853,332 $656,534   $634,966    $21,568       │ │
│ │ Option 2  $300,000   $7,287,993 $2,221,873 $1,621,548  $600,325 ★    │ │
│ │ Option 3  $350,000   $6,189,916 $3,319,950 $2,390,762  $929,188 ★★   │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ RECOMMENDATION                                                              │  Read from:
│ ┌─────────────────────────────────────────────────────────────────────────┐ │  Sheet2!B26
│ │ An increase in the ISL deductible is recommended...                    │ │
│ │ It is our recommendation to move to the $300,000 or $350,000 ISL       │ │
│ │ levels which would likely yield $600k-$900k in annual savings...       │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│    [◄ Back]    [Download Excel]    [Export PDF]    [Email]    [New]        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Cell Addresses Quick Reference

### Sheet 1: ISL Analsys - Historical Claims

```
┌─────────────────────────────────────────────────────────┐
│ INPUTS (write here)                                     │
├─────────────────────────────────────────────────────────┤
│ A1          Company Name                                │
│ J2          Effective Date                              │
│ K5          Trend Rate (%)                              │
│ B8:B42      Claimant Names                              │
│ C8:C42      2022 Claims                                 │
│ D8:D42      2023 Claims                                 │
│ E8:E42      2024 Claims                                 │
│ F8:F42      2025 Claims                                 │
├─────────────────────────────────────────────────────────┤
│ OUTPUTS (read only - has formulas)                      │
├─────────────────────────────────────────────────────────┤
│ H8:H42      2022 Claims Trended to 2026                 │
│ I8:I42      2023 Claims Trended to 2026                 │
│ J8:J42      2024 Claims Trended to 2026                 │
│ K8:K42      2025 Claims Trended to 2026                 │
│ P46         Total Excess Claims - 2022 @ $225K          │
│ Q46         Total Excess Claims - 2022 @ $250K          │
│ R46         Total Excess Claims - 2022 @ $300K          │
│ ... (pattern continues through AO46)                    │
└─────────────────────────────────────────────────────────┘
```

### Sheet 2: ISL Analysis - Premium v Claims

```
┌─────────────────────────────────────────────────────────┐
│ INPUTS (write here)                                     │
├─────────────────────────────────────────────────────────┤
│ C17:H17     Carrier Names                               │
│ C20:H20     Premium Quotes (KEY INPUT)                  │
│ B26         Recommendation Text (optional)              │
├─────────────────────────────────────────────────────────┤
│ OUTPUTS (read only - has formulas)                      │
├─────────────────────────────────────────────────────────┤
│ D8:G12      Claims by Year (from Sheet 1)              │
│ H8:H12      Average Claims                              │
│ I9:I12      Additional Claims (savings)                 │
│ J9:J12      Number of Claimants                         │
│ C21:H21     Premium Savings                             │
│ C22:H22     Additional Claims (linked)                  │
│ C23:H23     Net Projected Savings ★★★                   │
└─────────────────────────────────────────────────────────┘
```

---

## Color Coding Legend (for UI Design)

```
┌──────────────────────────────────────────────────────────┐
│ 🟦 BLUE   = User Input Required                         │
│ 🟩 GREEN  = Calculated/Automatic                         │
│ 🟨 YELLOW = Important Result                             │
│ 🟥 RED    = Warning/Validation Error                     │
│ ⚪ GRAY   = Optional/Supplementary                       │
└──────────────────────────────────────────────────────────┘
```

---

## Print Layout Preview

### Sheet 1 Print Area ($A$1:$L$48)
```
┌─────────────────────────────────────────────┐
│ Valley Children's Hospital                  │
│ Specific Deductible Analysis -              │
│ Historical Claims                           │
│                                             │
│ Historical Claims Report  | 2026 Equiv.    │
│                                             │
│ [Table of 35 claimants with 4 years each]  │
│                                             │
│ Totals by deductible option                │
└─────────────────────────────────────────────┘
```

### Sheet 2 Print Area ($A$1:$K$26)
```
┌─────────────────────────────────────────────┐
│ Valley Children's Hospital                  │
│ Specific Deductible Analysis -              │
│ Projected Premium vs. Claims                │
│                                             │
│ Section 1: Claims Analysis Table            │
│                                             │
│ Section 2: Premium Comparison Table         │
│                                             │
│ Section 3: Recommendation                   │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Common Scenarios & Expected Results

### Scenario 1: Valley Children's Hospital (Real Example)
```
INPUT:
  • 33 claimants with historical data
  • 7% medical trend
  • Current deductible: $225K
  • Renewal premium: $9.5M

RESULT:
  • Option 2 ($300K): $600K net savings
  • Option 3 ($350K): $929K net savings ← RECOMMENDED
  • Reason: Best balance of savings vs. deductible increase
```

### Scenario 2: Small Employer (Hypothetical)
```
INPUT:
  • 5 claimants with high costs
  • 5% medical trend (lower)
  • Current deductible: $200K
  • Renewal premium: $2M

EXPECTED RESULT:
  • Lower savings potential
  • Fewer claimants to spread risk
  • Recommendation: Smaller deductible increase ($250K)
```

### Scenario 3: Large Employer (Hypothetical)
```
INPUT:
  • 35 claimants (full list)
  • 8% medical trend (higher)
  • Current deductible: $300K
  • Renewal premium: $15M

EXPECTED RESULT:
  • Higher absolute savings
  • More predictable claims pattern
  • Recommendation: Consider $400K+ deductible
```

---

This visual reference should help developers understand the complete structure and data flow of the ISL Deductible Analyzer workbook.
