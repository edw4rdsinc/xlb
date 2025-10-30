/**
 * Safe Excel Processor
 * Runs Excel calculations in isolated worker threads with timeouts
 * Prevents ReDoS and prototype pollution attacks
 */

import { Worker } from 'worker_threads';
import path from 'path';

export interface SafeProcessorOptions {
  timeoutMs?: number;
  maxMemoryMb?: number;
}

export interface CalculationResults {
  claimsAnalysis: Array<{
    deductibleAmount: number;
    averageISLClaims: number;
    additionalClaims: number;
    yearlyBreakdown: {
      year2022: number;
      year2023: number;
      year2024: number;
      year2025: number;
    };
  }>;
  premiumComparison: Array<{
    carrierName: string;
    deductibleAmount: number;
    premiumQuote: number;
    premiumSavings: number;
    additionalClaims: number;
    netProjectedSavings: number;
  }>;
  recommendation: {
    optimalDeductible: number;
    netSavings: number;
    carrier: string;
  };
}

export class SafeExcelProcessor {
  private options: SafeProcessorOptions;

  constructor(options: SafeProcessorOptions = {}) {
    this.options = {
      timeoutMs: options.timeoutMs || 5000, // 5 second default
      maxMemoryMb: options.maxMemoryMb || 256, // 256MB default
    };
  }

  /**
   * Process Excel calculations in a sandboxed environment
   */
  async processWithTimeout(
    templateBuffer: ArrayBuffer,
    inputs: any
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      // Create worker thread with resource limits
      const worker = new Worker(
        path.join(__dirname, 'excel-worker.js'),
        {
          workerData: {
            templateBuffer: Buffer.from(templateBuffer),
            inputs,
          },
          resourceLimits: {
            maxOldGenerationSizeMb: this.options.maxMemoryMb!,
            maxYoungGenerationSizeMb: Math.floor(this.options.maxMemoryMb! / 4),
          },
        }
      );

      // Set timeout for worker execution
      const timeout = setTimeout(() => {
        worker.terminate();
        reject(new Error('Excel processing timeout - calculation took too long'));
      }, this.options.timeoutMs);

      // Handle worker completion
      worker.on('message', (result) => {
        clearTimeout(timeout);
        if (result.error) {
          reject(new Error(result.error));
        } else {
          resolve(result);
        }
        worker.terminate();
      });

      // Handle worker errors
      worker.on('error', (err) => {
        clearTimeout(timeout);
        reject(new Error(`Excel worker error: ${err.message}`));
        worker.terminate();
      });

      // Handle worker exit
      worker.on('exit', (code) => {
        if (code !== 0 && code !== null) {
          clearTimeout(timeout);
          reject(new Error(`Excel worker exited with code ${code}`));
        }
      });
    });
  }

  /**
   * Validate Excel buffer before processing
   */
  validateBuffer(buffer: ArrayBuffer): boolean {
    // Check file size (max 10MB)
    if (buffer.byteLength > 10 * 1024 * 1024) {
      throw new Error('Excel file too large (max 10MB)');
    }

    // Check for valid Excel file signature
    const view = new DataView(buffer);
    const signature = view.getUint32(0, true);

    // Check for ZIP signature (XLSX files are ZIP archives)
    const ZIP_SIGNATURE = 0x504B0304;
    if (signature !== ZIP_SIGNATURE) {
      throw new Error('Invalid Excel file format');
    }

    return true;
  }

  /**
   * Generate CSV from calculation results
   */
  generateCSV(results: CalculationResults, inputs: any): string {
    const lines: string[] = [];

    // Header
    lines.push('XL Benefits Deductible Analysis Report');
    lines.push(`Company: ${inputs.companyName}`);
    lines.push(`Effective Date: ${inputs.effectiveDate}`);
    lines.push(`Medical Trend Rate: ${inputs.medicalTrendRate}%`);
    lines.push('');

    // Claims Analysis Section
    lines.push('CLAIMS ANALYSIS');
    lines.push('Deductible,Average ISL Claims,Additional Claims,2022,2023,2024,2025 (Projected)');

    results.claimsAnalysis.forEach(analysis => {
      lines.push([
        `$${analysis.deductibleAmount.toLocaleString()}`,
        `$${analysis.averageISLClaims.toLocaleString()}`,
        `$${analysis.additionalClaims.toLocaleString()}`,
        `$${analysis.yearlyBreakdown.year2022.toLocaleString()}`,
        `$${analysis.yearlyBreakdown.year2023.toLocaleString()}`,
        `$${analysis.yearlyBreakdown.year2024.toLocaleString()}`,
        `$${analysis.yearlyBreakdown.year2025.toLocaleString()}`
      ].join(','));
    });

    lines.push('');
    lines.push('PREMIUM COMPARISON');
    lines.push('Carrier,Deductible,Premium Quote,Premium Savings,Additional Claims,Net Projected Savings');

    results.premiumComparison.forEach(comparison => {
      lines.push([
        comparison.carrierName,
        `$${comparison.deductibleAmount.toLocaleString()}`,
        `$${comparison.premiumQuote.toLocaleString()}`,
        `$${comparison.premiumSavings.toLocaleString()}`,
        `$${comparison.additionalClaims.toLocaleString()}`,
        `$${comparison.netProjectedSavings.toLocaleString()}`
      ].join(','));
    });

    lines.push('');
    lines.push('RECOMMENDATION');
    lines.push(`Optimal Deductible: $${results.recommendation.optimalDeductible.toLocaleString()}`);
    lines.push(`Carrier: ${results.recommendation.carrier}`);
    lines.push(`Net Savings: $${results.recommendation.netSavings.toLocaleString()}`);

    return lines.join('\n');
  }

  /**
   * Generate HTML report from calculation results
   */
  generateHTML(results: CalculationResults, inputs: any): string {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Deductible Analysis Report - ${inputs.companyName}</title>
  <style>
    @media print {
      body { margin: 0; }
      .no-print { display: none; }
      table { page-break-inside: avoid; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    h1, h2 {
      color: #1e3d59;
      border-bottom: 2px solid #3b82f6;
      padding-bottom: 10px;
    }
    .header-info {
      background: #f3f4f6;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .header-info p {
      margin: 5px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    th {
      background: #3b82f6;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    tr:hover {
      background: #f9fafb;
    }
    .recommendation {
      background: #10b981;
      color: white;
      padding: 20px;
      border-radius: 8px;
      margin-top: 30px;
    }
    .recommendation h2 {
      color: white;
      border-bottom: 2px solid rgba(255,255,255,0.3);
      margin-top: 0;
    }
    .amount {
      text-align: right;
      font-family: 'Courier New', monospace;
    }
    .highlight {
      background: #fef3c7;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <h1>XL Benefits Deductible Analysis Report</h1>

  <div class="header-info">
    <p><strong>Company:</strong> ${inputs.companyName}</p>
    <p><strong>Effective Date:</strong> ${inputs.effectiveDate}</p>
    <p><strong>Medical Trend Rate:</strong> ${inputs.medicalTrendRate}%</p>
    <p><strong>Current Deductible:</strong> $${inputs.currentDeductible.toLocaleString()}</p>
    <p><strong>Report Generated:</strong> ${new Date().toLocaleDateString()}</p>
  </div>

  <h2>Claims Analysis</h2>
  <table>
    <thead>
      <tr>
        <th>Deductible</th>
        <th>Average ISL Claims</th>
        <th>Additional Claims</th>
        <th>2022</th>
        <th>2023</th>
        <th>2024</th>
        <th>2025 (Projected)</th>
      </tr>
    </thead>
    <tbody>
      ${results.claimsAnalysis.map((analysis, index) => `
      <tr class="${analysis.deductibleAmount === inputs.currentDeductible ? 'highlight' : ''}">
        <td class="amount">$${analysis.deductibleAmount.toLocaleString()}</td>
        <td class="amount">$${analysis.averageISLClaims.toLocaleString()}</td>
        <td class="amount">$${analysis.additionalClaims.toLocaleString()}</td>
        <td class="amount">$${analysis.yearlyBreakdown.year2022.toLocaleString()}</td>
        <td class="amount">$${analysis.yearlyBreakdown.year2023.toLocaleString()}</td>
        <td class="amount">$${analysis.yearlyBreakdown.year2024.toLocaleString()}</td>
        <td class="amount">$${analysis.yearlyBreakdown.year2025.toLocaleString()}</td>
      </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>Premium Comparison</h2>
  <table>
    <thead>
      <tr>
        <th>Carrier</th>
        <th>Deductible</th>
        <th>Premium Quote</th>
        <th>Premium Savings</th>
        <th>Additional Claims</th>
        <th>Net Projected Savings</th>
      </tr>
    </thead>
    <tbody>
      ${results.premiumComparison.map(comparison => `
      <tr class="${comparison.deductibleAmount === results.recommendation.optimalDeductible ? 'highlight' : ''}">
        <td>${comparison.carrierName}</td>
        <td class="amount">$${comparison.deductibleAmount.toLocaleString()}</td>
        <td class="amount">$${comparison.premiumQuote.toLocaleString()}</td>
        <td class="amount">$${comparison.premiumSavings.toLocaleString()}</td>
        <td class="amount">$${comparison.additionalClaims.toLocaleString()}</td>
        <td class="amount"><strong>$${comparison.netProjectedSavings.toLocaleString()}</strong></td>
      </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="recommendation">
    <h2>Recommendation</h2>
    <p><strong>Optimal Deductible:</strong> $${results.recommendation.optimalDeductible.toLocaleString()}</p>
    <p><strong>Recommended Carrier:</strong> ${results.recommendation.carrier}</p>
    <p><strong>Projected Net Savings:</strong> $${results.recommendation.netSavings.toLocaleString()}</p>
  </div>

  <div class="no-print" style="margin-top: 40px; text-align: center;">
    <button onclick="window.print()" style="background: #3b82f6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Print Report</button>
  </div>
</body>
</html>`;
  }
}