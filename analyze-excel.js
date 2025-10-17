const XLSX = require('xlsx');
const fs = require('fs');

function analyzeCellType(cell, formula) {
  if (!cell) return 'empty';

  // Check if cell has a formula
  if (formula && formula.startsWith('=')) {
    return 'calculated';
  }

  // If no formula, it's likely an input or label
  if (cell.v !== undefined && cell.v !== null && cell.v !== '') {
    return 'input/data';
  }

  return 'empty';
}

function getCellValue(cell) {
  if (!cell) return null;
  if (cell.w) return cell.w; // formatted value
  return cell.v; // raw value
}

function analyzeWorksheet(sheet, sheetName) {
  const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
  const analysis = {
    name: sheetName,
    range: sheet['!ref'],
    cells: [],
    formulas: [],
    potentialInputs: [],
    potentialOutputs: [],
    mergedCells: sheet['!merges'] || []
  };

  // Analyze each cell
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = sheet[cellAddress];

      if (!cell) continue;

      const cellInfo = {
        address: cellAddress,
        row: R + 1,
        col: C + 1,
        value: getCellValue(cell),
        type: cell.t,
        formula: cell.f
      };

      // Identify cell purpose
      if (cell.f) {
        cellInfo.cellType = 'calculated';
        analysis.formulas.push({
          address: cellAddress,
          formula: cell.f,
          value: getCellValue(cell)
        });
        analysis.potentialOutputs.push(cellInfo);
      } else if (cell.v !== undefined && cell.v !== null && cell.v !== '') {
        // Check if it's likely a label or input
        if (typeof cell.v === 'string' && cell.v.includes(':')) {
          cellInfo.cellType = 'label';
        } else if (typeof cell.v === 'number' || (typeof cell.v === 'string' && !cell.v.match(/^[A-Z\s]+$/))) {
          cellInfo.cellType = 'potential-input';
          analysis.potentialInputs.push(cellInfo);
        } else {
          cellInfo.cellType = 'label/text';
        }
      }

      if (cell.v !== undefined || cell.f) {
        analysis.cells.push(cellInfo);
      }
    }
  }

  return analysis;
}

function analyzeExcelFile(filePath) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`ANALYZING: ${filePath}`);
  console.log('='.repeat(80));

  const workbook = XLSX.readFile(filePath, { cellFormula: true, cellStyles: true });

  const fileAnalysis = {
    fileName: filePath,
    sheetNames: workbook.SheetNames,
    sheets: {}
  };

  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    fileAnalysis.sheets[sheetName] = analyzeWorksheet(sheet, sheetName);
  });

  return fileAnalysis;
}

function printDetailedAnalysis(analysis) {
  console.log(`\nFile: ${analysis.fileName}`);
  console.log(`Total Sheets: ${analysis.sheetNames.length}`);
  console.log(`Sheet Names: ${analysis.sheetNames.join(', ')}`);

  Object.values(analysis.sheets).forEach(sheet => {
    console.log(`\n${'-'.repeat(80)}`);
    console.log(`SHEET: ${sheet.name}`);
    console.log(`Range: ${sheet.range}`);
    console.log(`Total Cells with Data: ${sheet.cells.length}`);
    console.log(`Formulas: ${sheet.formulas.length}`);
    console.log(`Potential Inputs: ${sheet.potentialInputs.length}`);
    console.log(`Potential Outputs: ${sheet.potentialOutputs.length}`);

    if (sheet.mergedCells.length > 0) {
      console.log(`\nMerged Cells (typically headers/labels):`);
      sheet.mergedCells.slice(0, 10).forEach(merge => {
        console.log(`  ${XLSX.utils.encode_range(merge)}`);
      });
    }

    // Show first 50 cells to understand structure
    console.log(`\nCell Structure (first 50 cells with data):`);
    sheet.cells.slice(0, 50).forEach(cell => {
      const formula = cell.formula ? ` [FORMULA: ${cell.formula}]` : '';
      console.log(`  ${cell.address} (R${cell.row}C${cell.col}): ${JSON.stringify(cell.value)} ${formula}`);
    });

    // Show formulas
    if (sheet.formulas.length > 0) {
      console.log(`\nFormulas (first 30):`);
      sheet.formulas.slice(0, 30).forEach(f => {
        console.log(`  ${f.address}: ${f.formula} => ${f.value}`);
      });
    }
  });
}

// Analyze both files
const blankTemplate = analyzeExcelFile('/home/sam/Documents/github-repos/xlb/xlb/ISL Ded Analysis.xlsx');
const populatedExample = analyzeExcelFile('/home/sam/Documents/github-repos/xlb/xlb/VCH - ISL Ded Analysis.xlsx');

printDetailedAnalysis(blankTemplate);
printDetailedAnalysis(populatedExample);

// Save detailed analysis to JSON
fs.writeFileSync('/home/sam/Documents/github-repos/xlb/xlb/blank-analysis.json', JSON.stringify(blankTemplate, null, 2));
fs.writeFileSync('/home/sam/Documents/github-repos/xlb/xlb/populated-analysis.json', JSON.stringify(populatedExample, null, 2));

console.log(`\n${'='.repeat(80)}`);
console.log('SUMMARY');
console.log('='.repeat(80));
console.log('\nDetailed JSON analysis saved to:');
console.log('  - blank-analysis.json');
console.log('  - populated-analysis.json');
