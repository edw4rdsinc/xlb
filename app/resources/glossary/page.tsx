'use client';

import { useState, useMemo } from 'react';
import MetaTags from '@/components/seo/MetaTags';
import StructuredData from '@/components/seo/StructuredData';
import {
  glossaryTerms,
  glossaryCategories,
  getTermsByCategory,
  searchTerms,
  type GlossaryCategory
} from '@/lib/glossary-data';

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategory>('All Terms');
  const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set());

  // Filter terms based on search and category
  const filteredTerms = useMemo(() => {
    let terms = selectedCategory === 'All Terms'
      ? glossaryTerms
      : getTermsByCategory(selectedCategory);

    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      terms = terms.filter(
        term =>
          term.term.toLowerCase().includes(lowerQuery) ||
          term.definition.toLowerCase().includes(lowerQuery)
      );
    }

    return terms.sort((a, b) => a.term.localeCompare(b.term));
  }, [searchQuery, selectedCategory]);

  // Toggle term expansion
  const toggleTerm = (slug: string) => {
    const newExpanded = new Set(expandedTerms);
    if (newExpanded.has(slug)) {
      newExpanded.delete(slug);
    } else {
      newExpanded.add(slug);
    }
    setExpandedTerms(newExpanded);
  };

  // Expand all / Collapse all
  const expandAll = () => {
    setExpandedTerms(new Set(filteredTerms.map(t => t.slug)));
  };

  const collapseAll = () => {
    setExpandedTerms(new Set());
  };

  return (
    <>
      <MetaTags
        title="Stop-Loss Insurance Glossary | XL Benefits"
        description="Comprehensive, searchable glossary of stop-loss insurance terminology. Understand self-funding, COBRA, aggregate deductibles, specific stop-loss, pharmacy benefits, and more."
        pageType="standard"
      />

      <StructuredData
        type="faq"
        questions={glossaryTerms.map(term => ({
          question: term.term,
          answer: term.definition
        }))}
      />

      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Stop-Loss Insurance Glossary
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              Your comprehensive, searchable guide to stop-loss insurance terminology.
              From self-funding basics to complex pharmacy benefit terms, find clear definitions
              for over {glossaryTerms.length} industry terms.
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="search" className="sr-only">
                  Search glossary
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="search"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search terms or definitions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={expandAll}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAll}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Collapse All
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <div className="flex flex-wrap gap-2">
                {glossaryCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredTerms.length} of {glossaryTerms.length} terms
            </div>
          </div>

          {/* Terms List */}
          <div className="bg-white rounded-lg shadow-sm">
            {filteredTerms.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-lg font-medium">No terms found</p>
                <p className="text-sm mt-1">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredTerms.map((term) => {
                  const isExpanded = expandedTerms.has(term.slug);
                  return (
                    <div key={term.slug} className="p-6 hover:bg-gray-50 transition-colors">
                      <button
                        onClick={() => toggleTerm(term.slug)}
                        className="w-full text-left flex items-start justify-between gap-4"
                      >
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {term.term}
                          </h3>
                          <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {term.category}
                          </span>
                        </div>
                        <div className="flex-shrink-0">
                          <svg
                            className={`h-6 w-6 text-gray-400 transition-transform ${
                              isExpanded ? 'transform rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="mt-4 space-y-4">
                          <p className="text-gray-700 leading-relaxed">
                            {term.definition}
                          </p>

                          {term.relatedTerms && term.relatedTerms.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                Related Terms:
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {term.relatedTerms.map((relatedTerm) => (
                                  <span
                                    key={relatedTerm}
                                    className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSearchQuery(relatedTerm);
                                    }}
                                  >
                                    {relatedTerm}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {term.relatedContent && term.relatedContent.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                Related Resources:
                              </h4>
                              <div className="space-y-2">
                                {term.relatedContent.map((content, idx) => (
                                  <a
                                    key={idx}
                                    href={content.url}
                                    className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                  >
                                    {content.type === 'tool' && '🔧 '}
                                    {content.type === 'blog' && '📝 '}
                                    {content.type === 'whitepaper' && '📄 '}
                                    {content.title}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="mt-12 bg-blue-600 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Still Have Questions?
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Our stop-loss experts can help you navigate these complex terms and
              apply them to your specific situation.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Talk to an Expert
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
