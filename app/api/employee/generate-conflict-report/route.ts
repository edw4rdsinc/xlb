import { NextResponse } from 'next/server'

interface Conflict {
  topic: string
  severity: 'CRITICAL' | 'MEDIUM' | 'LOW'
  spd_text: string
  spd_page: string
  handbook_text: string
  handbook_page: string
  issue: string
  risk_analysis: string
  recommendations: string[]
}

interface Alignment {
  topic: string
  description: string
}

interface Analysis {
  conflicts: Conflict[]
  alignments: Alignment[]
  executive_summary: {
    total_conflicts: number
    critical: number
    medium: number
    low: number
    overall_risk: string
    key_findings: string
  }
}

export async function POST(request: Request) {
  try {
    const { job, analysis, spdPages, handbookPages } = await request.json()

    const branding = job.branding || {
      broker_name: 'XL Benefits',
      logo_url: null,
      primary_color: '#0066cc',
      secondary_color: '#003d7a',
    }

    const html = generateReportHTML(job, analysis, branding, spdPages, handbookPages)

    return NextResponse.json({ success: true, html })
  } catch (error: any) {
    console.error('Report generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate report', details: error.message },
      { status: 500 }
    )
  }
}

function generateReportHTML(
  job: any,
  analysis: Analysis,
  branding: any,
  spdPages: number,
  handbookPages: number
): string {
  const { conflicts, alignments, executive_summary } = analysis

  const criticalConflicts = conflicts.filter(c => c.severity === 'CRITICAL')
  const mediumConflicts = conflicts.filter(c => c.severity === 'MEDIUM')
  const lowConflicts = conflicts.filter(c => c.severity === 'LOW')

  const logoHTML = branding.logo_url
    ? `<img src="${branding.logo_url}" alt="${branding.broker_name}" style="max-height: 60px; max-width: 200px;" />`
    : `<h2 style="margin: 0; color: white;">${branding.broker_name}</h2>`

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Benefits Alignment Report - ${job.client_name || 'Client'}</title>
  <style>
    :root {
      --primary-color: ${branding.primary_color};
      --secondary-color: ${branding.secondary_color};
    }

    * { box-sizing: border-box; }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 20px;
      background: #f5f5f5;
    }

    .container {
      max-width: 1000px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
    }

    .header {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
      color: white;
      padding: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-content h1 {
      margin: 0 0 10px 0;
      font-size: 32px;
    }

    .header-content p {
      margin: 0;
      opacity: 0.9;
      font-size: 16px;
    }

    .content {
      padding: 40px;
    }

    .section {
      margin-bottom: 40px;
    }

    .section-title {
      font-size: 24px;
      color: var(--primary-color);
      border-bottom: 3px solid var(--primary-color);
      padding-bottom: 10px;
      margin-bottom: 20px;
    }

    .executive-summary {
      background: #f8f9fa;
      border-left: 5px solid var(--primary-color);
      padding: 20px;
      margin-bottom: 30px;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 15px;
    }

    .summary-item {
      background: white;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
    }

    .summary-item .number {
      font-size: 32px;
      font-weight: bold;
      color: var(--primary-color);
    }

    .summary-item .label {
      font-size: 14px;
      color: #666;
    }

    .conflict-card {
      background: white;
      border: 2px solid #ddd;
      border-radius: 8px;
      margin-bottom: 25px;
      overflow: hidden;
    }

    .conflict-card.critical {
      border-color: #dc3545;
    }

    .conflict-card.medium {
      border-color: #ffc107;
    }

    .conflict-card.low {
      border-color: #17a2b8;
    }

    .conflict-header {
      padding: 15px 20px;
      color: white;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .conflict-card.critical .conflict-header {
      background: #dc3545;
    }

    .conflict-card.medium .conflict-header {
      background: #ffc107;
      color: #333;
    }

    .conflict-card.low .conflict-header {
      background: #17a2b8;
    }

    .severity-badge {
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
    }

    .conflict-body {
      padding: 20px;
    }

    .comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin: 20px 0;
    }

    .document-box {
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
    }

    .document-box-header {
      background: var(--primary-color);
      color: white;
      padding: 10px 15px;
      font-weight: bold;
      font-size: 14px;
    }

    .document-box-content {
      padding: 15px;
      background: #f8f9fa;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.6;
      white-space: pre-wrap;
    }

    .page-ref {
      color: #666;
      font-size: 12px;
      font-style: italic;
      margin-top: 10px;
    }

    .issue-box {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 15px 0;
    }

    .risk-box {
      background: #f8d7da;
      border-left: 4px solid #dc3545;
      padding: 15px;
      margin: 15px 0;
    }

    .recommendations {
      background: #d1ecf1;
      border-left: 4px solid #17a2b8;
      padding: 15px;
      margin: 15px 0;
    }

    .recommendations ul {
      margin: 10px 0 0 0;
      padding-left: 20px;
    }

    .recommendations li {
      margin: 5px 0;
    }

    .alignment-card {
      background: #d4edda;
      border: 2px solid #28a745;
      border-radius: 8px;
      padding: 15px 20px;
      margin-bottom: 15px;
    }

    .alignment-card h4 {
      margin: 0 0 8px 0;
      color: #155724;
    }

    .alignment-card p {
      margin: 0;
      color: #155724;
    }

    .footer {
      background: #f8f9fa;
      padding: 30px 40px;
      text-align: center;
      border-top: 3px solid var(--primary-color);
    }

    .footer p {
      margin: 5px 0;
      color: #666;
      font-size: 14px;
    }

    .no-print {
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: var(--primary-color);
      color: white;
      padding: 15px 30px;
      border-radius: 30px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      border: none;
      font-size: 16px;
      z-index: 1000;
    }

    .no-print:hover {
      background: var(--secondary-color);
    }

    @media print {
      body { background: white; padding: 0; }
      .container { box-shadow: none; }
      .no-print { display: none; }
      .page-break { page-break-before: always; }
      .conflict-card { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="header-content">
        <h1>Benefits Alignment Report</h1>
        <p>
          <strong>${job.client_name || 'Client Name'}</strong>
          ${job.group_name ? `<br/>Group: ${job.group_name}` : ''}
          <br/>${new Date(job.review_date || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      <div class="logo">
        ${logoHTML}
      </div>
    </div>

    <!-- Content -->
    <div class="content">
      <!-- Executive Summary -->
      <div class="executive-summary">
        <h2 style="margin-top: 0; color: var(--primary-color);">📊 Executive Summary</h2>
        <p style="font-size: 16px; margin-bottom: 20px;">${executive_summary.key_findings}</p>

        <div class="summary-grid">
          <div class="summary-item">
            <div class="number">${executive_summary.total_conflicts}</div>
            <div class="label">Total Conflicts</div>
          </div>
          <div class="summary-item">
            <div class="number" style="color: #dc3545;">${executive_summary.critical}</div>
            <div class="label">Critical</div>
          </div>
          <div class="summary-item">
            <div class="number" style="color: #ffc107;">${executive_summary.medium}</div>
            <div class="label">Medium</div>
          </div>
          <div class="summary-item">
            <div class="number" style="color: #17a2b8;">  ${executive_summary.low}</div>
            <div class="label">Low</div>
          </div>
        </div>

        <p style="margin-top: 20px;"><strong>Overall Risk Level:</strong>
          <span style="color: ${executive_summary.overall_risk === 'HIGH' ? '#dc3545' : executive_summary.overall_risk === 'MEDIUM' ? '#ffc107' : '#28a745'}; font-weight: bold;">
            ${executive_summary.overall_risk}
          </span>
        </p>

        <p style="margin-top: 10px; font-size: 13px; color: #666;">
          <strong>Documents Analyzed:</strong> SPD (${spdPages} pages) • Employee Handbook (${handbookPages} pages)
        </p>
      </div>

      ${criticalConflicts.length > 0 ? `
      <!-- Critical Conflicts -->
      <div class="section page-break">
        <h2 class="section-title">🚨 Critical Conflicts</h2>
        ${criticalConflicts.map(conflict => renderConflict(conflict, 'critical')).join('')}
      </div>
      ` : ''}

      ${mediumConflicts.length > 0 ? `
      <!-- Medium Conflicts -->
      <div class="section">
        <h2 class="section-title">⚠️ Medium Priority Conflicts</h2>
        ${mediumConflicts.map(conflict => renderConflict(conflict, 'medium')).join('')}
      </div>
      ` : ''}

      ${lowConflicts.length > 0 ? `
      <!-- Low Conflicts -->
      <div class="section">
        <h2 class="section-title">ℹ️ Low Priority Conflicts</h2>
        ${lowConflicts.map(conflict => renderConflict(conflict, 'low')).join('')}
      </div>
      ` : ''}

      ${alignments && alignments.length > 0 ? `
      <!-- Alignments -->
      <div class="section page-break">
        <h2 class="section-title">✅ Correct Alignments</h2>
        ${alignments.map(alignment => `
          <div class="alignment-card">
            <h4>${alignment.topic}</h4>
            <p>${alignment.description}</p>
          </div>
        `).join('')}
      </div>
      ` : ''}
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>${branding.broker_name}</strong></p>
      <p>Report Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
      ${job.reviewer_name ? `<p>Reviewed by: ${job.reviewer_name}</p>` : ''}
      <p style="margin-top: 15px; font-size: 12px;">This report was automatically generated by the XL Benefits Employee Portal</p>
    </div>
  </div>

  <button class="no-print" onclick="window.print()">📄 Save as PDF</button>
</body>
</html>`
}

function renderConflict(conflict: Conflict, severity: string): string {
  return `
    <div class="conflict-card ${severity}">
      <div class="conflict-header">
        <span>${conflict.topic}</span>
        <span class="severity-badge">${conflict.severity}</span>
      </div>
      <div class="conflict-body">
        <div class="comparison-grid">
          <div class="document-box">
            <div class="document-box-header">SPD (Insured Coverage)</div>
            <div class="document-box-content">${escapeHtml(conflict.spd_text)}</div>
            <div class="page-ref">${conflict.spd_page}</div>
          </div>
          <div class="document-box">
            <div class="document-box-header">Employee Handbook (Promised)</div>
            <div class="document-box-content">${escapeHtml(conflict.handbook_text)}</div>
            <div class="page-ref">${conflict.handbook_page}</div>
          </div>
        </div>

        <div class="issue-box">
          <strong>⚠️ Conflict Identified:</strong>
          <p style="margin: 8px 0 0 0;">${escapeHtml(conflict.issue)}</p>
        </div>

        <div class="risk-box">
          <strong>📊 Risk Analysis:</strong>
          <p style="margin: 8px 0 0 0;">${escapeHtml(conflict.risk_analysis)}</p>
        </div>

        <div class="recommendations">
          <strong>✅ Recommended Actions:</strong>
          <ul>
            ${conflict.recommendations.map(rec => `<li>${escapeHtml(rec)}</li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
  `
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, m => map[m])
}
