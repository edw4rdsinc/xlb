'use client';

import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import type { WizardData } from '../FIECalculator';
import type { CalculationResults } from '@/lib/fie-calculator/calculations';
import { getTierConfig } from '@/lib/fie-calculator/calculations';

interface PDFReportProps {
  wizardData: WizardData;
  results: CalculationResults;
}

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: '#003366',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 8,
    borderBottom: 1,
    borderBottomColor: '#0099CC',
    paddingBottom: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottom: 0.5,
    borderBottomColor: '#E5E7EB',
  },
  rowLabel: {
    fontSize: 10,
    color: '#374151',
  },
  rowValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#003366',
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 5,
    fontWeight: 'bold',
    fontSize: 9,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 5,
    borderBottom: 0.5,
    borderBottomColor: '#E5E7EB',
    fontSize: 9,
  },
  tableCell: {
    flex: 1,
  },
  tableCellBold: {
    flex: 1,
    fontWeight: 'bold',
  },
  highlight: {
    backgroundColor: '#EFF6FF',
    padding: 10,
    marginVertical: 10,
    borderRadius: 4,
  },
  highlightText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#003366',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: '#9CA3AF',
    textAlign: 'center',
    borderTop: 0.5,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
});

// PDF Document Component
function FIEReportDocument({ wizardData, results }: { wizardData: WizardData; results: CalculationResults }) {
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>FIE Rate Analysis Report</Text>
          <Text style={styles.subtitle}>
            {wizardData.groupName} - Effective {effectiveDate.toLocaleDateString()}
          </Text>
        </View>

        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>

          <View style={styles.highlight}>
            <Text style={styles.highlightText}>
              {isPositiveSavings ? 'Potential Savings: ' : 'Rate Increase: '}
              {formatPercentage(Math.abs(results.savingsPercentage))} ({formatCurrency(Math.abs(results.annualSavings))})
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>{currentCostLabel}</Text>
            <Text style={styles.rowValue}>{formatCurrency(results.currentAnnualCost)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>{planYear} Maximum Cost</Text>
            <Text style={styles.rowValue}>{formatCurrency(results.fieAnnualCost)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Annual Difference</Text>
            <Text style={styles.rowValue}>
              {isPositiveSavings ? '-' : '+'}{formatCurrency(Math.abs(results.annualSavings))}
            </Text>
          </View>
        </View>

        {/* PEPM Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PEPM Cost Breakdown</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Administrative</Text>
            <Text style={styles.rowValue}>{formatCurrency(results.pepmBreakdown.admin)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Specific Stop-Loss</Text>
            <Text style={styles.rowValue}>{formatCurrency(results.pepmBreakdown.specific)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Aggregate Premium</Text>
            <Text style={styles.rowValue}>{formatCurrency(results.pepmBreakdown.aggregate)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Aggregate Attachment</Text>
            <Text style={styles.rowValue}>{formatCurrency(results.pepmBreakdown.aggregateAttachment)}</Text>
          </View>
          {results.pepmBreakdown.laser > 0 && (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Laser Liability</Text>
              <Text style={styles.rowValue}>{formatCurrency(results.pepmBreakdown.laser)}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Total PEPM</Text>
            <Text style={styles.rowValue}>{formatCurrency(results.pepmBreakdown.total)}</Text>
          </View>
        </View>

        {/* Rate Comparison by Plan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rate Comparison by Plan</Text>
          {wizardData.plans.map((plan, planIndex) => {
            const allocation = results.planAllocations[planIndex];
            return (
              <View key={planIndex} style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 5, color: '#003366' }}>
                  {plan.name}
                </Text>
                <View style={styles.tableHeader}>
                  <Text style={{ flex: 1 }}>Tier</Text>
                  <Text style={{ flex: 1, textAlign: 'right' }}>Current</Text>
                  <Text style={{ flex: 1, textAlign: 'right' }}>FIE Rate</Text>
                  <Text style={{ flex: 1, textAlign: 'right' }}>Difference</Text>
                </View>
                {tierCodes.map(tier => {
                  const current = plan.currentRates[tier] || 0;
                  const fie = allocation.fieRates[tier] || 0;
                  const diff = current - fie;
                  return (
                    <View key={tier} style={styles.tableRow}>
                      <Text style={styles.tableCell}>{tierLabelMap[tier]}</Text>
                      <Text style={{ flex: 1, textAlign: 'right' }}>{formatCurrency(current)}</Text>
                      <Text style={{ flex: 1, textAlign: 'right' }}>{formatCurrency(fie)}</Text>
                      <Text style={{ flex: 1, textAlign: 'right', color: diff >= 0 ? '#059669' : '#DC2626' }}>
                        {diff >= 0 ? '-' : '+'}{formatCurrency(Math.abs(diff))}
                      </Text>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated by XL Benefits FIE Calculator - {new Date().toLocaleDateString()}</Text>
          <Text>This analysis is for illustrative purposes only and should not be considered financial advice.</Text>
        </View>
      </Page>
    </Document>
  );
}

// Export the PDFDownloadLink wrapper
export default function PDFReport({ wizardData, results }: PDFReportProps) {
  return (
    <PDFDownloadLink
      document={<FIEReportDocument wizardData={wizardData} results={results} />}
      fileName={`FIE_Analysis_${wizardData.groupName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`}
    >
      {({ blob, url, loading, error }) => (
        <button
          disabled={loading}
          className="px-8 py-3 bg-xl-bright-blue text-white rounded-md font-semibold hover:bg-xl-dark-blue transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {loading ? 'Generating PDF...' : 'Download PDF Report'}
        </button>
      )}
    </PDFDownloadLink>
  );
}
