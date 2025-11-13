'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AnimatedSection from '@/components/shared/AnimatedSection';

function ResultsContent() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<any>(null);
  const [showShareToast, setShowShareToast] = useState(false);

  useEffect(() => {
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

    // Try Web Share API first (works on mobile and some desktop browsers)
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or share failed
        console.log('Share cancelled or failed:', error);
      }
    } else {
      // Fall back to copying link to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 3000);
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
      }
    }
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

  const readinessColors: Record<string, { text: string; bg: string; border: string }> = {
    excellent: { text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
    good: { text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
    caution: { text: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' },
    'not-ready': { text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
  };

  const colors = readinessColors[results.readinessLevel] || readinessColors.caution;

  return (
    <div className="min-h-screen bg-xl-light-grey py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fade-up">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-xl-dark-blue mb-6 text-center">
              Your Self-Funding Readiness Assessment
            </h1>

            {/* Overall Score */}
            <div className={`p-6 rounded-lg border-2 mb-8 ${colors.bg} ${colors.border}`}>
              <div className="text-center mb-4">
                <div className={`text-6xl font-bold mb-2 ${colors.text}`}>
                  {results.readinessScore}
                </div>
                <div className={`text-xl ${colors.text}`}>
                  out of 100 points
                </div>
              </div>
              <h2 className={`text-2xl font-bold mb-3 ${colors.text} text-center`}>
                {results.readinessLevel === 'excellent' && 'Excellent Candidate (80-100)'}
                {results.readinessLevel === 'good' && 'Good Candidate with Guidance (60-79)'}
                {results.readinessLevel === 'caution' && 'Proceed with Caution (40-59)'}
                {results.readinessLevel === 'not-ready' && 'Not Ready (<40)'}
              </h2>
              <p className="text-gray-700 text-center">{results.primaryRecommendation}</p>
            </div>

            {/* Guardrails */}
            {results.guardrails && results.guardrails.length > 0 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                <h3 className="text-lg font-bold text-yellow-800 mb-2">Important Considerations:</h3>
                <ul className="list-disc list-inside space-y-1 text-yellow-700">
                  {results.guardrails.map((guardrail: string, index: number) => (
                    <li key={index} className="text-sm">{guardrail}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Strengths */}
            {results.keyStrengths && results.keyStrengths.length > 0 && (
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-green-800 mb-3">Key Strengths</h3>
                <ul className="list-disc list-inside space-y-1 text-green-700">
                  {results.keyStrengths.map((strength: string, index: number) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Areas for Improvement */}
            {results.areasForImprovement && results.areasForImprovement.length > 0 && (
              <div className="bg-orange-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-orange-800 mb-3">Areas for Improvement</h3>
                <ul className="list-disc list-inside space-y-1 text-orange-700">
                  {results.areasForImprovement.map((area: string, index: number) => (
                    <li key={index}>{area}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next Steps */}
            {results.nextSteps && results.nextSteps.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-xl-dark-blue mb-3">Recommended Next Steps</h3>
                <ol className="list-decimal list-inside space-y-2 text-xl-grey">
                  {results.nextSteps.map((step: string, index: number) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/solutions/self-funding-feasibility"
                className="px-6 py-3 bg-white text-xl-bright-blue border-2 border-xl-bright-blue font-semibold rounded-lg hover:bg-xl-light-grey transition-colors text-center"
              >
                Retake Assessment
              </Link>
              <button
                onClick={handleShare}
                className="px-6 py-3 bg-white text-xl-dark-blue border-2 border-xl-dark-blue font-semibold rounded-lg hover:bg-xl-light-grey transition-colors text-center flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share Results
              </button>
              <Link
                href="/contact"
                className="px-6 py-3 bg-xl-bright-blue font-semibold rounded-lg hover:bg-xl-dark-blue transition-colors text-center"
                style={{ color: '#FFFFFF' }}
              >
                Schedule Consultation
              </Link>
            </div>

            {/* Toast notification for copy to clipboard */}
            {showShareToast && (
              <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-xl-dark-blue text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
                Link copied to clipboard!
              </div>
            )}
          </div>
        </AnimatedSection>
      </div>
    </div>
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
