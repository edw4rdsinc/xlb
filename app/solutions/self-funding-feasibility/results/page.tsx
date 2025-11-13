'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AnimatedSection from '@/components/shared/AnimatedSection';

function ResultsContent() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<any>(null);

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
              <Link
                href="/contact"
                className="px-6 py-3 bg-xl-bright-blue text-white font-semibold rounded-lg hover:bg-xl-dark-blue transition-colors text-center"
              >
                Schedule Consultation
              </Link>
            </div>
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
