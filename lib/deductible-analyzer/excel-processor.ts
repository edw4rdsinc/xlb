import * as XLSX from 'xlsx';
import type { AnalyzerInputs, AnalyzerResults, ClaimsAnalysisRow, PremiumComparisonRow } from './types';

export class ExcelProcessor {
  private workbook: XLSX.WorkBook;
  private sheet1: XLSX.WorkSheet; // ISL Analsys - Historical Claims
  private sheet2: XLSX.WorkSheet; // ISL Analysis - Premium v Claims

  constructor(templateBuffer: ArrayBuffer) {
    this.workbook = XLSX.read(templateBuffer, { type: 'array', cellFormula: true });
    this.sheet1 = this.workbook.Sheets['ISL Analsys - Historical Claims'];
    this.sheet2 = this.workbook.Sheets['ISL Analysis - Premium v Claims'];
  }

  // Write inputs to Excel
  public writeInputs(inputs: AnalyzerInputs): void {
    // Sheet 1: Basic Info
    this.sheet1['A1'] = { t: 's', v: inputs.companyName };
    this.sheet1['J2'] = { t: 's', v: `Effective Date: ${inputs.effectiveDate}` };
    this.sheet1['K5'] = { t: 'n', v: inputs.medicalTrendRate, z: '0.0%' };

    // Sheet 1: Current Deductible (row 7)
    this.sheet1['P7'] = { t: 'n', v: inputs.currentDeductible, z: '$#,##0' };

    // Sheet 1: Alternative Deductibles (columns T, X, AB, AF, AJ)
    const deductibleColumns = ['T', 'X', 'AB', 'AF', 'AJ'];
    inputs.deductibleOptions.forEach((option, index) => {
      if (index < deductibleColumns.length) {
        const col = deductibleColumns[index];
        this.sheet1[`${col}7`] = { t: 'n', v: option.amount, z: '$#,##0' };
      }
    });

    // Sheet 1: Historical Claims Data (rows 8-42)
    for (let i = 0; i < 35; i++) {
      const row = 8 + i;
      const claimant = inputs.claimants[i];

      if (claimant) {
        // Claimant name
        this.sheet1[`B${row}`] = { t: 's', v: claimant.name };

        // Claims data
        if (claimant.claims.year2022 !== undefined) {
          this.sheet1[`C${row}`] = { t: 'n', v: claimant.claims.year2022, z: '$#,##0' };
        }
        if (claimant.claims.year2023 !== undefined) {
          this.sheet1[`D${row}`] = { t: 'n', v: claimant.claims.year2023, z: '$#,##0' };
        }
        if (claimant.claims.year2024 !== undefined) {
          this.sheet1[`E${row}`] = { t: 'n', v: claimant.claims.year2024, z: '$#,##0' };
        }
        if (claimant.claims.year2025 !== undefined) {
          this.sheet1[`F${row}`] = { t: 'n', v: claimant.claims.year2025, z: '$#,##0' };
        }
      } else {
        // Clear the row if no claimant
        this.sheet1[`B${row}`] = { t: 's', v: '' };
        this.sheet1[`C${row}`] = { t: 'n', v: 0, z: '$#,##0' };
        this.sheet1[`D${row}`] = { t: 'n', v: 0, z: '$#,##0' };
        this.sheet1[`E${row}`] = { t: 'n', v: 0, z: '$#,##0' };
        this.sheet1[`F${row}`] = { t: 'n', v: 0, z: '$#,##0' };
      }
    }

    // Sheet 2: Premium Quotes
    // Current year premium (C20) and Renewal premium (D20)
    this.sheet2['C20'] = { t: 'n', v: inputs.renewalPremium, z: '$#,##0' };
    this.sheet2['D20'] = { t: 'n', v: inputs.renewalPremium, z: '$#,##0' };

    // Carrier names and premiums for alternatives (E-H columns)
    const premiumColumns = ['E', 'F', 'G', 'H'];
    inputs.deductibleOptions.forEach((option, index) => {
      if (index < premiumColumns.length) {
        const col = premiumColumns[index];
        // Carrier name (row 17)
        this.sheet2[`${col}17`] = { t: 's', v: option.carrierName };
        // Premium quote (row 20)
        this.sheet2[`${col}20`] = { t: 'n', v: option.premium, z: '$#,##0' };
      }
    });

    // Force recalculation
    this.recalculateFormulas();
  }

  // Force Excel to recalculate all formulas
  private recalculateFormulas(): void {
    // XLSX.js doesn't automatically recalculate formulas
    // We need to manually calculate key formulas

    // Calculate trended claims (Sheet1 H8:K42)
    for (let row = 8; row <= 42; row++) {
      const trend = this.getCellValue(this.sheet1['K5']) || 0.07;

      // H column: 2022 trended to 2026 (4 years)
      const val2022 = this.getCellValue(this.sheet1[`C${row}`]) || 0;
      this.sheet1[`H${row}`] = { t: 'n', v: val2022 * Math.pow(1 + trend, 4), z: '$#,##0' };

      // I column: 2023 trended to 2026 (3 years)
      const val2023 = this.getCellValue(this.sheet1[`D${row}`]) || 0;
      this.sheet1[`I${row}`] = { t: 'n', v: val2023 * Math.pow(1 + trend, 3), z: '$#,##0' };

      // J column: 2024 trended to 2026 (2 years)
      const val2024 = this.getCellValue(this.sheet1[`E${row}`]) || 0;
      this.sheet1[`J${row}`] = { t: 'n', v: val2024 * Math.pow(1 + trend, 2), z: '$#,##0' };

      // K column: 2025 trended to 2026 (1 year)
      const val2025 = this.getCellValue(this.sheet1[`F${row}`]) || 0;
      this.sheet1[`K${row}`] = { t: 'n', v: val2025 * Math.pow(1 + trend, 1), z: '$#,##0' };
    }

    // Calculate excess claims for each deductible option
    const deductibleColumns = [
      { col: 'P', dedCell: 'P7' },  // Current
      { col: 'T', dedCell: 'T7' },  // Option 1
      { col: 'X', dedCell: 'X7' },  // Option 2
      { col: 'AB', dedCell: 'AB7' }, // Option 3
      { col: 'AF', dedCell: 'AF7' }, // Option 4
    ];

    for (const dedInfo of deductibleColumns) {
      const deductible = this.getCellValue(this.sheet1[dedInfo.dedCell]) || 0;

      for (let row = 8; row <= 42; row++) {
        // Calculate excess for each year's trended claims
        const cols = ['H', 'I', 'J', 'K'];
        const excessCols = [
          dedInfo.col,  // 2022 excess
          String.fromCharCode(dedInfo.col.charCodeAt(0) + 1), // 2023 excess
          String.fromCharCode(dedInfo.col.charCodeAt(0) + 2), // 2024 excess
          String.fromCharCode(dedInfo.col.charCodeAt(0) + 3), // 2025 excess
        ];

        cols.forEach((sourceCol, idx) => {
          const claim = this.getCellValue(this.sheet1[`${sourceCol}${row}`]) || 0;
          const excess = claim > deductible ? claim - deductible : 0;
          this.sheet1[`${excessCols[idx]}${row}`] = { t: 'n', v: excess, z: '$#,##0' };
        });
      }

      // Calculate totals (row 46)
      for (let i = 0; i < 4; i++) {
        const col = String.fromCharCode(dedInfo.col.charCodeAt(0) + i);
        let total = 0;
        for (let row = 8; row <= 42; row++) {
          total += this.getCellValue(this.sheet1[`${col}${row}`]) || 0;
        }
        this.sheet1[`${col}46`] = { t: 'n', v: total, z: '$#,##0' };
      }
    }

    // Update Sheet2 with calculated values from Sheet1
    this.updateSheet2FromSheet1();
  }

  private updateSheet2FromSheet1(): void {
    // Map totals from Sheet1 row 46 to Sheet2 rows 8-12
    const mappings = [
      { sheet1Cols: ['P46', 'Q46', 'R46', 'S46'], sheet2Row: 8 },   // Current
      { sheet1Cols: ['T46', 'U46', 'V46', 'W46'], sheet2Row: 9 },   // Option 1
      { sheet1Cols: ['X46', 'Y46', 'Z46', 'AA46'], sheet2Row: 10 }, // Option 2
      { sheet1Cols: ['AB46', 'AC46', 'AD46', 'AE46'], sheet2Row: 11 }, // Option 3
      { sheet1Cols: ['AF46', 'AG46', 'AH46', 'AI46'], sheet2Row: 12 }, // Option 4
    ];

    mappings.forEach((mapping) => {
      const sheet2Cols = ['D', 'E', 'F', 'G'];
      mapping.sheet1Cols.forEach((sheet1Cell, idx) => {
        const value = this.getCellValue(this.sheet1[sheet1Cell]) || 0;
        this.sheet2[`${sheet2Cols[idx]}${mapping.sheet2Row}`] = { t: 'n', v: value, z: '$#,##0' };
      });

      // Calculate average (exclude 2025)
      const avg = (
        (this.getCellValue(this.sheet2[`D${mapping.sheet2Row}`]) || 0) +
        (this.getCellValue(this.sheet2[`E${mapping.sheet2Row}`]) || 0) +
        (this.getCellValue(this.sheet2[`F${mapping.sheet2Row}`]) || 0)
      ) / 3;
      this.sheet2[`H${mapping.sheet2Row}`] = { t: 'n', v: avg, z: '$#,##0' };

      // Calculate additional claims (difference from current)
      if (mapping.sheet2Row > 8) {
        const currentAvg = this.getCellValue(this.sheet2['H8']) || 0;
        const thisAvg = this.getCellValue(this.sheet2[`H${mapping.sheet2Row}`]) || 0;
        const additional = currentAvg - thisAvg;
        this.sheet2[`I${mapping.sheet2Row}`] = { t: 'n', v: additional, z: '$#,##0' };
      }
    });

    // Calculate net savings (row 23)
    const premiumCols = ['E', 'F', 'G', 'H'];
    premiumCols.forEach((col) => {
      const renewalPremium = this.getCellValue(this.sheet2['D20']) || 0;
      const altPremium = this.getCellValue(this.sheet2[`${col}20`]) || 0;
      const premiumSavings = renewalPremium - altPremium;
      this.sheet2[`${col}21`] = { t: 'n', v: premiumSavings, z: '$#,##0' };

      // Additional claims (from row 9-12 depending on option)
      const rowIndex = premiumCols.indexOf(col) + 9;
      const additionalClaims = this.getCellValue(this.sheet2[`I${rowIndex}`]) || 0;
      this.sheet2[`${col}22`] = { t: 'n', v: additionalClaims, z: '$#,##0' };

      // Net savings
      const netSavings = premiumSavings - additionalClaims;
      this.sheet2[`${col}23`] = { t: 'n', v: netSavings, z: '$#,##0' };
    });
  }

  private getCellValue(cell: XLSX.CellObject | undefined): number {
    if (!cell) return 0;
    if (cell.t === 'n') return cell.v as number;
    if (cell.t === 's') {
      const num = parseFloat(cell.v as string);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  }

  // Read results from Excel
  public readResults(): AnalyzerResults {
    const claimsAnalysis: ClaimsAnalysisRow[] = [];
    const premiumComparison: PremiumComparisonRow[] = [];

    // Read claims analysis from Sheet2 (rows 8-12)
    const deductibleAmounts = [
      this.getCellValue(this.sheet1['P7']),
      this.getCellValue(this.sheet1['T7']),
      this.getCellValue(this.sheet1['X7']),
      this.getCellValue(this.sheet1['AB7']),
      this.getCellValue(this.sheet1['AF7']),
    ];

    for (let row = 8; row <= 12; row++) {
      const dedIndex = row - 8;
      if (deductibleAmounts[dedIndex]) {
        claimsAnalysis.push({
          deductibleAmount: deductibleAmounts[dedIndex],
          claims2022: this.getCellValue(this.sheet2[`D${row}`]) || 0,
          claims2023: this.getCellValue(this.sheet2[`E${row}`]) || 0,
          claims2024: this.getCellValue(this.sheet2[`F${row}`]) || 0,
          claims2025: this.getCellValue(this.sheet2[`G${row}`]) || 0,
          averageISLClaims: this.getCellValue(this.sheet2[`H${row}`]) || 0,
          additionalClaims: this.getCellValue(this.sheet2[`I${row}`]) || 0,
          estimatedClaimantsAffected: this.getCellValue(this.sheet2[`J${row}`]) || 0,
        });
      }
    }

    // Read premium comparison (columns E-H)
    const premiumCols = ['E', 'F', 'G', 'H'];
    premiumCols.forEach((col, index) => {
      const carrierName = this.sheet2[`${col}17`]?.v as string;
      const premium = this.getCellValue(this.sheet2[`${col}20`]);

      if (carrierName && premium > 0) {
        premiumComparison.push({
          carrierName,
          deductibleAmount: deductibleAmounts[index + 1] || 0,
          premiumQuote: premium,
          premiumSavings: this.getCellValue(this.sheet2[`${col}21`]) || 0,
          additionalClaims: this.getCellValue(this.sheet2[`${col}22`]) || 0,
          netProjectedSavings: this.getCellValue(this.sheet2[`${col}23`]) || 0,
        });
      }
    });

    // Generate recommendation
    const bestOption = premiumComparison.reduce((best, current) =>
      current.netProjectedSavings > best.netProjectedSavings ? current : best
    , premiumComparison[0] || { netProjectedSavings: 0, deductibleAmount: 0 });

    const recommendation = {
      text: this.generateRecommendation(bestOption, claimsAnalysis),
      optimalDeductible: bestOption?.deductibleAmount || 0,
      netSavings: bestOption?.netProjectedSavings || 0,
    };

    // Generate Excel buffer for download
    const excelBuffer = XLSX.write(this.workbook, { type: 'array', bookType: 'xlsx' });

    return {
      claimsAnalysis,
      premiumComparison,
      recommendation,
      excelBuffer,
    };
  }

  private generateRecommendation(
    bestOption: PremiumComparisonRow | undefined,
    claimsAnalysis: ClaimsAnalysisRow[]
  ): string {
    if (!bestOption || bestOption.netProjectedSavings <= 0) {
      return 'Based on the analysis, maintaining your current deductible level appears to be the most cost-effective option. The additional claims liability from raising the deductible would exceed any premium savings.';
    }

    const currentDeductible = claimsAnalysis[0]?.deductibleAmount || 0;
    const savingsPercent = ((bestOption.netProjectedSavings / bestOption.premiumQuote) * 100).toFixed(1);

    return `We recommend moving to a $${bestOption.deductibleAmount.toLocaleString()} deductible with ${bestOption.carrierName}. ` +
           `This change would generate net projected savings of $${bestOption.netProjectedSavings.toLocaleString()} annually ` +
           `(${savingsPercent}% of premium), after accounting for $${bestOption.additionalClaims.toLocaleString()} in additional claims liability. ` +
           `This represents an increase from your current $${currentDeductible.toLocaleString()} deductible.`;
  }

  // Export the workbook
  public getWorkbook(): XLSX.WorkBook {
    return this.workbook;
  }
}