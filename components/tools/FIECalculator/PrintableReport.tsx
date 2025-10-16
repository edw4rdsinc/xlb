'use client';

import type { WizardData } from '../FIECalculator';
import type { CalculationResults } from '@/lib/fie-calculator/calculations';
import { getTierConfig } from '@/lib/fie-calculator/calculations';

interface PrintableReportProps {
  wizardData: WizardData;
  results: CalculationResults;
}

export function generateReportHTML(wizardData: WizardData, results: CalculationResults): string {
  const tierConfig = getTierConfig(wizardData.numberOfTiers);
  const tierCodes = tierConfig.map(t => t.code);
  const tierLabelMap = tierConfig.reduce((acc, tier) => {
    acc[tier.code] = tier.label;
    return acc;
  }, {} as Record<string, string>);

  // Parse effective date properly
  const [year, month, day] = wizardData.effectiveDate.split('-').map(Number);
  const effectiveDate = new Date(year, month - 1, day);
  const planYear = effectiveDate.getFullYear();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const isPositiveSavings = results.savingsPercentage > 0;

  const currentCostLabel = wizardData.currentFundingType === 'Fully-Insured'
    ? 'Current Fully Insured Annual Premium'
    : 'Current Annual Funding';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FIE Rate Analysis - ${wizardData.groupName}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #1f2937;
      background: white;
      padding: 40px;
      max-width: 900px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #003366;
    }

    .logo {
      max-width: 200px;
      height: auto;
    }

    .header-info {
      text-align: right;
    }

    h1 {
      color: #003366;
      font-size: 28pt;
      margin-bottom: 8px;
      font-weight: 700;
    }

    .subtitle {
      color: #6b7280;
      font-size: 12pt;
      margin-bottom: 4px;
    }

    .highlight-box {
      background: ${isPositiveSavings ? '#ecfdf5' : '#fef2f2'};
      border: 2px solid ${isPositiveSavings ? '#059669' : '#dc2626'};
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      text-align: center;
    }

    .highlight-text {
      font-size: 16pt;
      font-weight: bold;
      color: ${isPositiveSavings ? '#059669' : '#dc2626'};
    }

    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }

    .section-title {
      color: #003366;
      font-size: 16pt;
      font-weight: 600;
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 2px solid #0099CC;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 20px;
    }

    .metric-card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 16px;
    }

    .metric-label {
      font-size: 10pt;
      color: #6b7280;
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .metric-value {
      font-size: 20pt;
      color: #003366;
      font-weight: bold;
    }

    .metric-note {
      font-size: 9pt;
      color: #9ca3af;
      margin-top: 4px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
      font-size: 10pt;
    }

    th {
      background: #f3f4f6;
      color: #374151;
      font-weight: 600;
      text-align: left;
      padding: 10px;
      border: 1px solid #d1d5db;
    }

    td {
      padding: 10px;
      border: 1px solid #e5e7eb;
    }

    .text-right {
      text-align: right;
    }

    .text-center {
      text-align: center;
    }

    .plan-name {
      font-weight: 600;
      color: #003366;
      font-size: 11pt;
      margin-top: 16px;
      margin-bottom: 8px;
    }

    .positive {
      color: #059669;
      font-weight: 600;
    }

    .negative {
      color: #dc2626;
      font-weight: 600;
    }

    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      font-size: 9pt;
      color: #9ca3af;
    }

    .no-print {
      margin: 30px 0;
      text-align: center;
    }

    .btn {
      display: inline-block;
      padding: 12px 24px;
      margin: 0 8px;
      font-size: 11pt;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      text-decoration: none;
      border: none;
    }

    .btn-primary {
      background: #0099CC;
      color: white;
    }

    .btn-secondary {
      background: #6b7280;
      color: white;
    }

    .btn:hover {
      opacity: 0.9;
    }

    @media print {
      body {
        padding: 20px;
      }
      .no-print {
        display: none;
      }
      .highlight-box {
        border-width: 1px;
      }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <img src="/images/logos/xl-logo-full.png" alt="XL Benefits" class="logo">
    <div class="header-info">
      <div class="subtitle">Generated ${new Date().toLocaleDateString()}</div>
    </div>
  </div>

  <h1>FIE Rate Analysis Report</h1>
  <div class="subtitle" style="margin-bottom: 20px;">
    ${wizardData.groupName} - Effective ${effectiveDate.toLocaleDateString()}
  </div>

  <!-- Print/Download Buttons -->
  <div class="no-print">
    <button onclick="window.print()" class="btn btn-primary">🖨️ Print Report</button>
    <button onclick="window.print()" class="btn btn-secondary">📄 Save as PDF</button>
  </div>

  <!-- Executive Summary -->
  <div class="highlight-box">
    <div class="highlight-text">
      ${isPositiveSavings ? '💰 Potential Savings: ' : '⚠️ Rate Increase: '}
      ${formatPercentage(Math.abs(results.savingsPercentage))}
      (${formatCurrency(Math.abs(results.annualSavings))})
    </div>
  </div>

  <!-- Key Metrics -->
  <div class="section">
    <div class="section-title">Key Metrics</div>
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">${currentCostLabel}</div>
        <div class="metric-value">${formatCurrency(results.currentAnnualCost)}</div>
        <div class="metric-note">Based on current rates</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">${planYear} Maximum Cost</div>
        <div class="metric-value">${formatCurrency(results.fieAnnualCost)}</div>
        <div class="metric-note">Self-funded maximum liability</div>
      </div>
      <div class="metric-card" style="background: ${isPositiveSavings ? '#ecfdf5' : '#fef2f2'};">
        <div class="metric-label">Annual Difference</div>
        <div class="metric-value" style="color: ${isPositiveSavings ? '#059669' : '#dc2626'};">
          ${formatCurrency(Math.abs(results.annualSavings))}
        </div>
        <div class="metric-note">${isPositiveSavings ? 'Lower with self-funding' : 'Higher with self-funding'}</div>
      </div>
    </div>
  </div>

  <!-- PEPM Breakdown -->
  <div class="section">
    <div class="section-title">PEPM Cost Breakdown</div>
    <table>
      <tbody>
        <tr>
          <td>Administrative</td>
          <td class="text-right">${formatCurrency(results.pepmBreakdown.admin)}</td>
        </tr>
        <tr>
          <td>Specific Stop-Loss</td>
          <td class="text-right">${formatCurrency(results.pepmBreakdown.specific)}</td>
        </tr>
        <tr>
          <td>Aggregate Premium</td>
          <td class="text-right">${formatCurrency(results.pepmBreakdown.aggregate)}</td>
        </tr>
        <tr>
          <td>Aggregate Attachment</td>
          <td class="text-right">${formatCurrency(results.pepmBreakdown.aggregateAttachment)}</td>
        </tr>
        ${results.pepmBreakdown.laser > 0 ? `
        <tr>
          <td>Laser Liability</td>
          <td class="text-right">${formatCurrency(results.pepmBreakdown.laser)}</td>
        </tr>
        ` : ''}
        <tr style="background: #f3f4f6; font-weight: bold;">
          <td>Total PEPM</td>
          <td class="text-right">${formatCurrency(results.pepmBreakdown.total)}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Rate Comparison by Plan -->
  <div class="section">
    <div class="section-title">Rate Comparison by Plan</div>
    ${wizardData.plans.map((plan, planIndex) => {
      const allocation = results.planAllocations[planIndex];
      return `
        <div class="plan-name">${plan.name}</div>
        <table>
          <thead>
            <tr>
              <th>Tier</th>
              <th class="text-right">Current Rate</th>
              <th class="text-right">FIE Rate</th>
              <th class="text-right">Difference</th>
            </tr>
          </thead>
          <tbody>
            ${tierCodes.map(tier => {
              const current = plan.currentRates[tier] || 0;
              const fie = allocation.fieRates[tier] || 0;
              const diff = current - fie;
              return `
                <tr>
                  <td>${tierLabelMap[tier]}</td>
                  <td class="text-right">${formatCurrency(current)}</td>
                  <td class="text-right">${formatCurrency(fie)}</td>
                  <td class="text-right ${diff >= 0 ? 'positive' : 'negative'}">
                    ${diff >= 0 ? '-' : '+'}${formatCurrency(Math.abs(diff))}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    }).join('')}
  </div>

  <!-- Footer -->
  <div class="footer">
    <div style="margin-bottom: 8px;">
      <strong>XL Benefits</strong> - Stop-Loss General Agent
    </div>
    <div>
      This analysis is for illustrative purposes only and should not be considered financial advice.
    </div>
    <div style="margin-top: 8px; font-size: 8pt;">
      Generated by XL Benefits FIE Calculator on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function openPrintableReport(wizardData: WizardData, results: CalculationResults) {
  const reportHTML = generateReportHTML(wizardData, results);
  const printWindow = window.open('', '_blank');

  if (printWindow) {
    printWindow.document.write(reportHTML);
    printWindow.document.close();
  }
}
