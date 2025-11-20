'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ResultsContent() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<any>(null);
  const [showShareToast, setShowShareToast] = useState(false);

  useEffect(() => {
    // First try to get from sessionStorage (preferred - avoids URL length limits)
    const storedResults = sessionStorage.getItem('assessmentResults');
    if (storedResults) {
      try {
        const decoded = JSON.parse(storedResults);
        setResults(decoded);
        // Clear after reading to avoid stale data
        sessionStorage.removeItem('assessmentResults');
        return;
      } catch (error) {
        console.error('Failed to parse stored results:', error);
      }
    }

    // Fallback to URL params for backward compatibility
    const resultsData = searchParams.get('data');
    if (resultsData) {
      try {
        const decoded = JSON.parse(decodeURIComponent(resultsData));
        setResults(decoded);
      } catch (error) {
        console.error('Failed to parse results:', error);
      }
    }
  }, [searchParams]);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = 'Self-Funding Readiness Assessment Results';
    const shareText = `I completed the Self-Funding Readiness Assessment and scored ${results.readinessScore}/100. Check out XL Benefits' assessment tool!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Share cancelled or failed:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 3000);
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!results) {
    return (
      <div className="min-h-screen bg-xl-light-grey flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-xl-bright-blue border-t-transparent mx-auto mb-4" />
          <p className="text-lg text-xl-grey">Loading your results...</p>
        </div>
      </div>
    );
  }

  const readinessConfig: Record<string, {
    label: string;
    description: string;
    textColor: string;
    bgColor: string;
    borderColor: string;
    gradientFrom: string;
    gradientTo: string;
  }> = {
    excellent: {
      label: 'Excellent Candidate',
      description: '80-100 Points',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      gradientFrom: 'from-green-600',
      gradientTo: 'to-emerald-500'
    },
    good: {
      label: 'Good Candidate with Guidance',
      description: '60-79 Points',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      gradientFrom: 'from-blue-600',
      gradientTo: 'to-cyan-500'
    },
    caution: {
      label: 'Proceed with Caution',
      description: '40-59 Points',
      textColor: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      gradientFrom: 'from-yellow-600',
      gradientTo: 'to-amber-500'
    },
    'not-ready': {
      label: 'Not Ready',
      description: 'Below 40 Points',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      gradientFrom: 'from-red-600',
      gradientTo: 'to-rose-500'
    },
  };

  const config = readinessConfig[results.readinessLevel] || readinessConfig.caution;

  return (
    <>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 0.5in;
            size: letter;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .print-break-before {
            break-before: page;
          }
          .print-break-avoid {
            break-inside: avoid;
          }
          /* Hide site header and footer - more specific selectors */
          header, footer, nav {
            display: none !important;
          }
          /* Target Next.js layout elements */
          body > div > header,
          body > div > footer,
          body > div > nav,
          #__next > header,
          #__next > footer,
          #__next > nav {
            display: none !important;
          }
          /* Hide any navigation elements with common class patterns */
          [class*="Navbar"],
          [class*="navbar"],
          [class*="Header"],
          [class*="Footer"],
          [class*="navigation"],
          [class*="site-header"],
          [class*="site-footer"] {
            display: none !important;
          }
          /* Ensure main content starts at top */
          main {
            padding-top: 0 !important;
            margin-top: 0 !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section with Score - White Background */}
        <section className="bg-white py-16 print:py-8 border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Branding Header */}
            {results.branding && (results.branding.clientName || results.branding.clientLogo || results.branding.brokerName || results.branding.brokerLogo) && (
              <div className="mb-8 pb-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                  {/* Client Branding */}
                  <div className="flex items-center gap-4">
                    {results.branding.clientLogo && (
                      <img
                        src={results.branding.clientLogo}
                        alt="Client logo"
                        className="max-h-32 w-auto object-contain aspect-auto flex-shrink-0"
                      />
                    )}
                    {results.branding.clientName && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Prepared for</p>
                        <p className="text-lg font-bold text-xl-dark-blue">{results.branding.clientName}</p>
                      </div>
                    )}
                  </div>

                  {/* Broker Branding */}
                  {(results.branding.brokerName || results.branding.brokerLogo) && (
                    <div className="flex items-center gap-4">
                      {results.branding.brokerLogo && (
                        <img
                          src={results.branding.brokerLogo}
                          alt="Broker logo"
                          className="max-h-32 w-auto object-contain aspect-auto flex-shrink-0"
                        />
                      )}
                      {results.branding.brokerName && (
                        <div className="text-right">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Presented by</p>
                          <p className="text-md font-semibold text-xl-dark-blue">{results.branding.brokerName}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-xl-dark-blue mb-6">
                Self-Funding Readiness Assessment
              </h1>

              {/* Score Display */}
              <div className="inline-block p-8 mb-6">
                <div className={`text-7xl sm:text-8xl font-bold mb-2 bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} bg-clip-text text-transparent`}>
                  {results.readinessScore}
                </div>
                <div className="text-xl text-gray-600">out of 100 points</div>
              </div>

              <div className="mb-4">
                <span className={`inline-block ${config.bgColor} ${config.textColor} px-4 py-2 rounded-full font-bold text-lg`}>
                  {config.label}
                </span>
              </div>
              <p className="text-gray-500 text-sm">{config.description}</p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Two Column Layout for Strengths and Improvements - First */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Key Strengths */}
            {results.keyStrengths && results.keyStrengths.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 print-break-avoid">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-xl-dark-blue">Key Strengths</h3>
                </div>
                <ul className="space-y-3">
                  {results.keyStrengths.map((strength: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Areas for Improvement */}
            {results.areasForImprovement && results.areasForImprovement.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 print-break-avoid">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-xl-dark-blue">Areas for Improvement</h3>
                </div>
                <ul className="space-y-3">
                  {results.areasForImprovement.map((area: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-orange-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="text-gray-700">{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Executive Summary */}
          {results.narrativeRecommendation && (
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8 print-break-avoid">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-xl-bright-blue/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-xl-dark-blue">Executive Summary</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                {results.narrativeRecommendation.split('\n\n').map((paragraph: string, index: number) => {
                  // Check if paragraph is a header (starts with # or **)
                  if (paragraph.startsWith('##') || paragraph.startsWith('**')) {
                    const headerText = paragraph.replace(/^#+\s*/, '').replace(/^\*\*|\*\*$/g, '');
                    return (
                      <h3 key={index} className="text-lg font-semibold text-xl-dark-blue mt-6 mb-3 first:mt-0">
                        {headerText}
                      </h3>
                    );
                  }
                  // Check if paragraph contains bullet points
                  if (paragraph.includes('\n- ') || paragraph.startsWith('- ')) {
                    const lines = paragraph.split('\n');
                    return (
                      <ul key={index} className="list-disc pl-5 space-y-2 mb-4">
                        {lines.map((line: string, lineIndex: number) => {
                          const bulletText = line.replace(/^-\s*/, '').trim();
                          if (bulletText) {
                            return (
                              <li key={lineIndex} className="text-gray-700 leading-relaxed">
                                {bulletText}
                              </li>
                            );
                          }
                          return null;
                        })}
                      </ul>
                    );
                  }
                  // Regular paragraph
                  return (
                    <p key={index} className="text-gray-700 leading-relaxed mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>
          )}

          {/* Important Considerations */}
          {results.guardrails && results.guardrails.length > 0 && (
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-6 mb-8 print-break-avoid">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="text-lg font-bold text-amber-800">Important Considerations</h3>
              </div>
              <ul className="space-y-2">
                {results.guardrails.map((guardrail: string, index: number) => (
                  <li key={index} className="flex items-start text-amber-700">
                    <span className="mr-2">•</span>
                    <span>{guardrail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommended Next Steps */}
          {results.nextSteps && results.nextSteps.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8 print-break-avoid">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-xl-bright-blue/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-xl-dark-blue">Recommended Next Steps</h2>
              </div>
              <ol className="space-y-4">
                {results.nextSteps.map((step: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 bg-xl-bright-blue text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 no-print">
            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print to PDF
            </button>
            <Link
              href="/solutions/self-funding-feasibility"
              className="px-6 py-3 bg-white text-xl-bright-blue border-2 border-xl-bright-blue font-semibold rounded-lg hover:bg-xl-light-grey transition-colors text-center"
            >
              Retake Assessment
            </Link>
            <button
              onClick={handleShare}
              className="px-6 py-3 bg-white text-xl-dark-blue border-2 border-xl-dark-blue font-semibold rounded-lg hover:bg-xl-light-grey transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
            <Link
              href="/contact"
              className="px-6 py-3 bg-gradient-to-r from-xl-dark-blue to-xl-bright-blue text-white font-semibold rounded-lg hover:from-xl-dark-blue hover:to-blue-600 transition-all shadow-md hover:shadow-lg text-center"
            >
              Schedule Consultation
            </Link>
          </div>

          {/* Powered by XL Benefits Footer */}
          <div className="text-center pt-8 border-t border-gray-200">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <span>Powered by</span>
              <img
                src="/images/logos/xl-logo-full.png"
                alt="XL Benefits"
                className="h-6 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Toast notification */}
        {showShareToast && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-xl-dark-blue text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in no-print">
            Link copied to clipboard!
          </div>
        )}
      </div>
    </>
  );
}

export default function AssessmentResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-xl-light-grey flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-xl-bright-blue border-t-transparent mx-auto mb-4" />
          <p className="text-lg text-xl-grey">Loading your results...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
