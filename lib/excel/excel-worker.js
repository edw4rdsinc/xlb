/**
 * Excel Worker Thread
 * Isolated environment for Excel processing
 * This runs in a separate thread with resource limits
 */

const { parentPort, workerData } = require('worker_threads');
const XLSX = require('xlsx');

// Prevent prototype pollution by freezing prototypes
Object.freeze(Object.prototype);
Object.freeze(Array.prototype);
Object.freeze(String.prototype);

try {
  const { templateBuffer, inputs } = workerData;

  // Read the Excel workbook
  const workbook = XLSX.read(templateBuffer, {
    type: 'buffer',
    cellFormula: true,
    cellStyles: false, // Disable styles to improve performance
    sheetStubs: false,
  });

  // Get worksheets
  const sheet1 = workbook.Sheets['ISL Analsys - Historical Claims'];
  const sheet2 = workbook.Sheets['ISL Analysis - Premium v Claims'];

  if (!sheet1 || !sheet2) {
    throw new Error('Required worksheets not found in template');
  }

  // Write inputs to Excel
  writeInputsToExcel(sheet1, sheet2, inputs);

  // Force recalculation
  XLSX.utils.sheet_set_array_formula(sheet1, 'A1', 'A1');
  XLSX.utils.sheet_set_array_formula(sheet2, 'A1', 'A1');

  // Read calculated results
  const results = readResultsFromExcel(sheet1, sheet2, inputs);

  // Send results back to main thread
  parentPort.postMessage({
    success: true,
    results: results,
  });

} catch (error) {
  // Send error back to main thread
  parentPort.postMessage({
    error: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  });
}

/**
 * Write inputs to Excel cells
 */
function writeInputsToExcel(sheet1, sheet2, inputs) {
  // Company information
  sheet1['A1'] = { t: 's', v: inputs.companyName };
  sheet1['K1'] = { t: 's', v: inputs.effectiveDate };
  sheet1['L3'] = { t: 'n', v: inputs.medicalTrendRate / 100 };

  // Current deductible
  sheet1['P7'] = { t: 'n', v: inputs.currentDeductible };

  // Alternative deductibles
  const deductibleColumns = ['T', 'X', 'AB', 'AF', 'AJ'];
  inputs.deductibleOptions.forEach((option, index) => {
    if (index < deductibleColumns.length) {
      const col = deductibleColumns[index];
      sheet1[`${col}7`] = { t: 'n', v: option.amount };
    }
  });

  // Claimants data (rows 8-42)
  for (let i = 0; i < Math.min(35, inputs.claimants.length); i++) {
    const row = 8 + i;
    const claimant = inputs.claimants[i];

    // Name
    sheet1[`B${row}`] = { t: 's', v: claimant.name || '' };

    // Claims by year
    sheet1[`C${row}`] = { t: 'n', v: claimant.claims.year2022 || 0 };
    sheet1[`D${row}`] = { t: 'n', v: claimant.claims.year2023 || 0 };
    sheet1[`E${row}`] = { t: 'n', v: claimant.claims.year2024 || 0 };
    sheet1[`F${row}`] = { t: 'n', v: claimant.claims.year2025 || 0 };
  }

  // Premium data in Sheet 2
  if (inputs.renewalPremium) {
    sheet2['B5'] = { t: 'n', v: inputs.renewalPremium };
  }
}

/**
 * Read calculated results from Excel
 */
function readResultsFromExcel(sheet1, sheet2, inputs) {
  const results = {
    claimsAnalysis: [],
    premiumComparison: [],
    recommendation: {},
  };

  // Read claims analysis (rows 44-48 have summary data)
  const deductibleColumns = [
    { col: 'P', label: 'Current' },
    { col: 'T', label: 'Option1' },
    { col: 'X', label: 'Option2' },
    { col: 'AB', label: 'Option3' },
    { col: 'AF', label: 'Option4' },
    { col: 'AJ', label: 'Option5' },
  ];

  deductibleColumns.forEach((dedCol, index) => {
    const deductibleCell = sheet1[`${dedCol.col}7`];
    if (!deductibleCell || !deductibleCell.v) return;

    const deductibleAmount = deductibleCell.v;

    // Read summary rows
    const avgISLClaims = getCellValue(sheet1[`${dedCol.col}44`], 0);
    const additionalClaims = getCellValue(sheet1[`${dedCol.col}45`], 0);
    const year2022Total = getCellValue(sheet1[`${dedCol.col}46`], 0);
    const year2023Total = getCellValue(sheet1[`${dedCol.col}47`], 0);
    const year2024Total = getCellValue(sheet1[`${dedCol.col}48`], 0);
    const year2025Total = getCellValue(sheet1[`${dedCol.col}49`], 0);

    results.claimsAnalysis.push({
      deductibleAmount,
      averageISLClaims,
      additionalClaims,
      yearlyBreakdown: {
        year2022: year2022Total,
        year2023: year2023Total,
        year2024: year2024Total,
        year2025: year2025Total,
      },
    });
  });

  // Read premium comparison from Sheet 2
  const premiumStartRow = 10;
  for (let row = premiumStartRow; row < premiumStartRow + 10; row++) {
    const carrierName = getCellValue(sheet2[`A${row}`], '');
    if (!carrierName) break;

    const deductibleAmount = getCellValue(sheet2[`B${row}`], 0);
    const premiumQuote = getCellValue(sheet2[`C${row}`], 0);
    const premiumSavings = getCellValue(sheet2[`D${row}`], 0);
    const additionalClaims = getCellValue(sheet2[`E${row}`], 0);
    const netSavings = getCellValue(sheet2[`F${row}`], 0);

    results.premiumComparison.push({
      carrierName,
      deductibleAmount,
      premiumQuote,
      premiumSavings,
      additionalClaims,
      netProjectedSavings: netSavings,
    });
  }

  // Determine optimal recommendation
  const optimal = results.premiumComparison.reduce((best, current) => {
    if (!best || current.netProjectedSavings > best.netProjectedSavings) {
      return current;
    }
    return best;
  }, null);

  if (optimal) {
    results.recommendation = {
      optimalDeductible: optimal.deductibleAmount,
      netSavings: optimal.netProjectedSavings,
      carrier: optimal.carrierName,
    };
  }

  return results;
}

/**
 * Safely get cell value with fallback
 */
function getCellValue(cell, defaultValue) {
  if (!cell || cell.v === undefined || cell.v === null) {
    return defaultValue;
  }

  // Handle different cell types
  if (cell.t === 'n') {
    return Number(cell.v) || defaultValue;
  } else if (cell.t === 's') {
    return String(cell.v);
  } else if (cell.t === 'b') {
    return Boolean(cell.v);
  }

  return cell.v;
}