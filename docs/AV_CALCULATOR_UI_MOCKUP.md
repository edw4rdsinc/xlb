# AV Calculator UI Mockup - Visual Description

## Page Layout Overview

### Hero Section
**Background:** Gradient from dark blue (#003366) to bright blue (#0099CC)
**Text Color:** White

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│   Actuarial Value Calculator                                 │
│   ═══════════════════════════════                            │
│                                                               │
│   Actuarial Value (AV) is a key metric that determines      │
│   how much of total healthcare costs a health plan covers   │
│   versus what enrollees pay through deductibles, copays,     │
│   and coinsurance...                                         │
│                                                               │
│   [3 paragraphs of explanatory text]                         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Email Gate (First View)
**Background:** Light grey (#F0F0F0)
**Card:** White with shadow

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│   ┌─────────────────────────────────────────────────────┐  │
│   │                                                       │  │
│   │   Access the AV Calculator                           │  │
│   │   ══════════════════════════                         │  │
│   │                                                       │  │
│   │   Enter your information to calculate actuarial      │  │
│   │   values and determine metal tier classifications.   │  │
│   │                                                       │  │
│   │   Email Address *                                     │  │
│   │   [your.email@example.com                    ]       │  │
│   │                                                       │  │
│   │   First Name *                                        │  │
│   │   [John                                      ]       │  │
│   │                                                       │  │
│   │   Last Name *                                         │  │
│   │   [Doe                                       ]       │  │
│   │                                                       │  │
│   │   Brokerage Name (Optional)                          │  │
│   │   [ABC Insurance Group                       ]       │  │
│   │                                                       │  │
│   │   Phone Number (Optional)                            │  │
│   │   [(555) 123-4567                            ]       │  │
│   │                                                       │  │
│   │   [ Access Tool ]                                    │  │
│   │                                                       │  │
│   │   We respect your privacy. Your information will     │  │
│   │   never be shared with third parties.                │  │
│   │                                                       │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Calculator Form (After Email Gate)
**Background:** Light grey (#F0F0F0)
**Form Card:** White with shadow

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│   Calculate Your Plan's Actuarial Value                     │
│   ══════════════════════════════════════                    │
│                                                               │
│   ┌─────────────────────────────────────────────────────┐  │
│   │ 1. Plan Basics (Optional)                            │  │
│   │ ═════════════════════════                            │  │
│   │                                                       │  │
│   │ Plan Name              Estimated Metal Tier          │  │
│   │ [Gold PPO 2000    ]    [Select...          ▼]        │  │
│   │                                                       │  │
│   ├───────────────────────────────────────────────────────┤  │
│   │ 2. Deductibles & Maximum Out-of-Pocket              │  │
│   │ ═══════════════════════════════════════════           │  │
│   │                                                       │  │
│   │ Individual Deductible *   Family Deductible *        │  │
│   │ $[2000              ]     $[4000              ]      │  │
│   │                                                       │  │
│   │ Individual MOOP *         Family MOOP *              │  │
│   │ $[6000              ]     $[12000             ]      │  │
│   │                                                       │  │
│   │ Deductible Type                                      │  │
│   │ ● Integrated (Medical + Drug)                        │  │
│   │ ○ Separate Deductibles                               │  │
│   │                                                       │  │
│   ├───────────────────────────────────────────────────────┤  │
│   │ 3. Coinsurance Rates                                 │  │
│   │ ══════════════════                                   │  │
│   │                                                       │  │
│   │ Medical Coinsurance       Drug Coinsurance           │  │
│   │ [20                ] %    [20                ] %     │  │
│   │ Enrollee's share after    Enrollee's share for      │  │
│   │ deductible                prescriptions              │  │
│   │                                                       │  │
│   ├───────────────────────────────────────────────────────┤  │
│   │ 4. Office Visit Copays                               │  │
│   │ ═════════════════════                                │  │
│   │                                                       │  │
│   │ Primary Care Copay        Specialist Copay           │  │
│   │ $[25                ]     $[50                ]      │  │
│   │ ☑ Subject to deductible   ☑ Subject to deductible   │  │
│   │                                                       │  │
│   ├───────────────────────────────────────────────────────┤  │
│   │ 5. Emergency & Hospital Services                     │  │
│   │ ═══════════════════════════════                      │  │
│   │                                                       │  │
│   │ ER Copay      Urgent Care    Inpatient Coinsurance  │  │
│   │ $[500    ]    $[75      ]    [20              ] %   │  │
│   │                                                       │  │
│   ├───────────────────────────────────────────────────────┤  │
│   │ 6. Imaging & Lab Services                            │  │
│   │ ════════════════════════                             │  │
│   │                                                       │  │
│   │ Imaging Coins.    Lab Copay      X-ray Coinsurance  │  │
│   │ [20         ] %   $[0       ]    [20            ] % │  │
│   │ MRI, CT, PET      Blood work,    -                   │  │
│   │ scans             tests                              │  │
│   │                                                       │  │
│   ├───────────────────────────────────────────────────────┤  │
│   │ 7. Prescription Drug Copays                          │  │
│   │ ══════════════════════════                           │  │
│   │                                                       │  │
│   │ Generic Copay             Preferred Brand Copay      │  │
│   │ $[10                ]     $[40                ]      │  │
│   │ ☐ Subject to deductible   ☐ Subject to deductible   │  │
│   │                                                       │  │
│   │ Non-Pref. Brand Copay     Specialty Copay            │  │
│   │ $[75                ]     $[150               ]      │  │
│   │ ☐ Subject to deductible   ☐ Subject to deductible   │  │
│   │                                                       │  │
│   ├───────────────────────────────────────────────────────┤  │
│   │ 8. Advanced Options (Optional)             ▼         │  │
│   │ ═════════════════════════════                        │  │
│   │                                                       │  │
│   │ [Collapsed - Click to expand]                        │  │
│   │                                                       │  │
│   ├───────────────────────────────────────────────────────┤  │
│   │                                                       │  │
│   │         [ Calculate Actuarial Value ]                │  │
│   │                                                       │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Results Display
**Background:** Light grey (#F0F0F0)
**Results Card:** White with shadow

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│   ┌─────────────────────────────────────────────────────┐  │
│   │                                                       │  │
│   │   Actuarial Value Result                             │  │
│   │   ═══════════════════════                            │  │
│   │   Gold PPO 2000                                      │  │
│   │                                                       │  │
│   │   ╔═════════════════════════════════════════════╗   │  │
│   │   ║                                              ║   │  │
│   │   ║              80.23%                          ║   │  │
│   │   ║                                              ║   │  │
│   │   ║         ┌─────────────────┐                 ║   │  │
│   │   ║         │   Gold Tier     │                 ║   │  │
│   │   ║         └─────────────────┘                 ║   │  │
│   │   ║         (Gold color badge)                   ║   │  │
│   │   ║                                              ║   │  │
│   │   ╚═════════════════════════════════════════════╝   │  │
│   │                                                       │  │
│   │   ┌──────────────────────┐  ┌──────────────────────┐│  │
│   │   │  Plan Pays           │  │  Enrollee Pays       ││  │
│   │   │  ═════════           │  │  ═════════════       ││  │
│   │   │                      │  │                      ││  │
│   │   │     80.23%           │  │     19.77%           ││  │
│   │   │                      │  │                      ││  │
│   │   │  of covered costs    │  │  through cost-sharing││  │
│   │   └──────────────────────┘  └──────────────────────┘│  │
│   │                                                       │  │
│   │   Metal Tier Ranges (ACA Standard)                  │  │
│   │   ═════════════════════════════════                 │  │
│   │                                                       │  │
│   │   ┌────────────────────────────────────────────┐    │  │
│   │   │                    ↓ 80.23%                 │    │  │
│   │   ├──┬─────┬──────┬──────┬─────────────────────┤    │  │
│   │   │C │Bronze│Silver│Gold ■│  Platinum           │    │  │
│   │   ├──┴─────┴──────┴──────┴─────────────────────┤    │  │
│   │   │ <60% │58-62%│68-72%│78-82%│  88-92%       │    │  │
│   │   └────────────────────────────────────────────┘    │  │
│   │                                                       │  │
│   │   Plan Cost-Sharing Summary                          │  │
│   │   ══════════════════════════                         │  │
│   │                                                       │  │
│   │   Individual Deductible  Family Deductible  Ind MOOP│  │
│   │   $2,000                 $4,000              $6,000  │  │
│   │                                                       │  │
│   │   Family MOOP  Medical Coinsurance  Primary Care    │  │
│   │   $12,000      20%                  $25              │  │
│   │                                                       │  │
│   │   ┌──────────────────────────────────────────────┐  │  │
│   │   │ ✓ ACA Compliant                              │  │
│   │   │                                              │  │
│   │   │ This plan meets ACA requirements for Gold    │  │
│   │   │ tier classification.                         │  │
│   │   └──────────────────────────────────────────────┘  │  │
│   │   (Green background)                                 │  │
│   │                                                       │  │
│   │   AV Breakdown by Category                           │  │
│   │   ═════════════════════════                          │  │
│   │                                                       │  │
│   │   Primary Care  Specialty    Emergency              │  │
│   │   85.3%         78.2%        75.0%                  │  │
│   │                                                       │  │
│   │   Inpatient     Outpatient   Pharmacy               │  │
│   │   80.0%         82.5%        76.8%                  │  │
│   │                                                       │  │
│   │   ┌──────────────────┐ ┌────────────────┐           │  │
│   │   │ Download PDF     │ │ Email Results  │           │  │
│   │   │ Report           │ │                │           │  │
│   │   └──────────────────┘ └────────────────┘           │  │
│   │                                                       │  │
│   │   ┌────────────────────────────────────┐             │  │
│   │   │ Calculate Another Plan             │             │  │
│   │   └────────────────────────────────────┘             │  │
│   │                                                       │  │
│   │   Calculated: November 7, 2025, 9:17 AM              │  │
│   │                                                       │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Metal Tier Range Chart Detail

```
Visual representation showing:

┌──────────────────────────────────────────────────────────────┐
│                                                                │
│                        ↓ 80.23%                                │
│                        │                                       │
│ ┌──────┬─────────┬───────────┬─────────────┬──────────────┐ │
│ │ Cat. │ Bronze  │  Silver   │    GOLD     │   Platinum   │ │
│ │      │         │           │   ■■■■■     │              │ │
│ └──────┴─────────┴───────────┴─────────────┴──────────────┘ │
│   <60%  58-62%     68-72%      78-82%         88-92%         │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Catastrophic  < 60%          Bronze       58-62%       │  │
│  │ Bronze        58-62%         Silver       68-72%       │  │
│  │ Silver        68-72%         Gold         78-82% ■     │  │
│  │ Gold          78-82% ■       Platinum     88-92%       │  │
│  │ Platinum      88-92%                                   │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                │
│  Metal tier ranges are based on ACA regulatory standards      │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

### Color Palette

**Metal Tiers:**
- Catastrophic: Dark brown (#8B4513)
- Bronze: Bronze (#CD7F32)
- Silver: Silver (#C0C0C0)
- Gold: Gold (#FFD700)
- Platinum: Light grey (#E5E4E2)

**XLB Brand:**
- Dark Blue: #003366
- Bright Blue: #0099CC
- Grey: #333333
- Light Grey: #F0F0F0
- White: #FFFFFF

**Status Colors:**
- Success (Compliant): Green backgrounds with green text
- Warning: Yellow backgrounds with yellow text
- Error: Red backgrounds with red text

### Mobile Responsive Layout (375px)

```
┌─────────────────────┐
│                     │
│  Actuarial Value    │
│  Calculator         │
│  ═════════════      │
│                     │
│  [Hero text]        │
│                     │
├─────────────────────┤
│                     │
│  ┌───────────────┐ │
│  │ Email Gate    │ │
│  │               │ │
│  │ [Stacked]     │ │
│  │ [Fields]      │ │
│  │               │ │
│  │ [Button]      │ │
│  └───────────────┘ │
│                     │
├─────────────────────┤
│  Form Section 1     │
│  [Full width]       │
├─────────────────────┤
│  Form Section 2     │
│  [Stacked inputs]   │
├─────────────────────┤
│  ...                │
├─────────────────────┤
│  [Calculate]        │
├─────────────────────┤
│                     │
│  Results:           │
│  ┌───────────────┐ │
│  │   80.23%      │ │
│  │   Gold Tier   │ │
│  └───────────────┘ │
│                     │
│  [Tier Chart]       │
│  [Stacked]          │
│                     │
│  [Actions]          │
│  [Stacked]          │
│                     │
└─────────────────────┘
```

## Interaction States

### Input Focus
```
Normal:   [               ]  border-gray-300
Focus:    [■■■■■■■■■■■■■■■]  ring-2 ring-xl-bright-blue
Error:    [               ]  border-red-500
```

### Buttons
```
Primary:   [ Calculate ]  bg-xl-bright-blue hover:bg-xl-dark-blue
Secondary: [ Reset ]      border-xl-dark-blue hover:bg-xl-light-grey
Disabled:  [ Loading ]    bg-gray-400 cursor-not-allowed
```

### Loading State
```
┌────────────────────────────────┐
│                                │
│        ⟳ (spinning)            │
│                                │
│   Calculating actuarial        │
│   value...                     │
│                                │
│   Processing plan cost-        │
│   sharing parameters           │
│                                │
└────────────────────────────────┘
```

## Accessibility Features

1. **Keyboard Navigation:** Tab through all inputs, Enter to submit
2. **Screen Reader Labels:** All inputs have proper ARIA labels
3. **Error Announcements:** Validation errors announced to screen readers
4. **Focus Indicators:** Clear blue ring on focused elements
5. **Color Contrast:** All text meets WCAG AA standards (4.5:1 minimum)
6. **Semantic HTML:** Proper heading hierarchy (h1 > h2 > h3)

## Animation Details

1. **Page Load:** Fade-up animation on hero content
2. **Form Sections:** Staggered fade-up (100ms delays)
3. **Submit Button:** Scale on hover (1.05x)
4. **Loading Spinner:** Continuous rotation
5. **Results Reveal:** Fade-in transition
6. **Tier Chart:** Highlight pulse on current tier

---

This mockup represents the complete UI implementation as coded in the React components.
All layouts are responsive and follow the XLB design system.
