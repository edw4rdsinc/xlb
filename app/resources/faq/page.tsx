'use client';

import { useState, useMemo } from 'react';
import MetaTags from '@/components/seo/MetaTags';
import StructuredData from '@/components/seo/StructuredData';
import Link from 'next/link';
import {
  faqItems,
  faqCategories,
  getQuestionsByCategory,
  searchQuestions,
  type FAQCategory
} from '@/lib/faq-data';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>('All Questions');
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  // Filter questions based on search and category
  const filteredQuestions = useMemo(() => {
    let questions = selectedCategory === 'All Questions'
      ? faqItems
      : getQuestionsByCategory(selectedCategory);

    if (searchQuery.trim()) {
      const searchResults = searchQuestions(searchQuery);
      questions = questions.filter(q => searchResults.some(sr => sr.id === q.id));
    }

    return questions;
  }, [searchQuery, selectedCategory]);

  // Toggle question expansion
  const toggleQuestion = (id: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedQuestions(newExpanded);
  };

  // Expand all / Collapse all
  const expandAll = () => {
    setExpandedQuestions(new Set(filteredQuestions.map(q => q.id)));
  };

  const collapseAll = () => {
    setExpandedQuestions(new Set());
  };

  return (
    <>
      <MetaTags
        title="Stop-Loss Insurance FAQ for Brokers | XL Benefits"
        description="Get answers to common questions about stop-loss insurance, self-funding, and working with XL Benefits. Expert guidance for insurance brokers."
        pageType="standard"
      />

      <StructuredData
        type="faq"
        questions={faqItems.map(item => ({
          question: item.question,
          answer: item.answer
        }))}
      />

      <div className="py-16 bg-xl-light-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-xl-dark-blue mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-xl-grey max-w-3xl">
              Get expert answers to your stop-loss insurance questions. From the basics of
              self-funding to advanced underwriting topics, find the guidance you need to
              serve your clients with confidence.
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="search" className="sr-only">
                  Search questions
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
                    placeholder="Search questions and answers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={expandAll}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAll}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
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
                {faqCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-xl-bright-blue text-white'
                        : 'bg-white text-xl-grey hover:bg-xl-light-grey border border-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredQuestions.length} of {faqItems.length} questions
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {filteredQuestions.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
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
                <p className="text-lg font-medium">No questions found</p>
                <p className="text-sm mt-1">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              <>
                {/* Category Sections */}
                {selectedCategory === 'All Questions' ? (
                  // Group by category when showing all questions
                  <>
                    {faqCategories
                      .filter(cat => cat !== 'All Questions')
                      .map(category => {
                        const categoryQuestions = filteredQuestions.filter(
                          q => q.category === category
                        );
                        if (categoryQuestions.length === 0) return null;

                        return (
                          <div key={category} className="mb-8">
                            <h2 className="text-2xl font-bold text-xl-dark-blue mb-4 pl-2">
                              {category}
                            </h2>
                            <div className="space-y-3">
                              {categoryQuestions.map((item) => (
                                <QuestionCard
                                  key={item.id}
                                  item={item}
                                  isExpanded={expandedQuestions.has(item.id)}
                                  onToggle={() => toggleQuestion(item.id)}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                  </>
                ) : (
                  // Show flat list when a specific category is selected
                  <div className="space-y-3">
                    {filteredQuestions.map((item) => (
                      <QuestionCard
                        key={item.id}
                        item={item}
                        isExpanded={expandedQuestions.has(item.id)}
                        onToggle={() => toggleQuestion(item.id)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* CTA Section */}
          <div className="mt-12 bg-gradient-to-r from-xl-bright-blue to-xl-dark-blue rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Still Have Questions?
            </h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Our stop-loss experts are here to help. Whether you need guidance on a specific
              case or want to explore self-funding options for your clients, we're just a
              conversation away.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 bg-white text-xl-bright-blue font-semibold rounded-lg hover:bg-xl-light-grey transition-colors"
            >
              Schedule a Conversation
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

// Question Card Component
interface QuestionCardProps {
  item: typeof faqItems[0];
  isExpanded: boolean;
  onToggle: () => void;
}

function QuestionCard({ item, isExpanded, onToggle }: QuestionCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={onToggle}
        className="w-full text-left p-6 flex items-start justify-between gap-4"
        aria-expanded={isExpanded}
      >
        <div className="flex-1">
          <h3 className="text-lg font-bold text-xl-dark-blue mb-1 pr-4">
            {item.question}
          </h3>
        </div>
        <div className="flex-shrink-0 pt-1">
          <svg
            className={`h-6 w-6 text-xl-bright-blue transition-transform ${
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
        <div className="px-6 pb-6 pt-0">
          <div className="border-t border-gray-200 pt-4">
            {/* Answer text with paragraph breaks preserved */}
            <div className="prose prose-lg max-w-none">
              {item.answer.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-gray-700 leading-relaxed mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Related Links */}
            {item.relatedLinks && item.relatedLinks.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Related Resources:
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {item.relatedLinks.map((link, idx) => (
                    <Link
                      key={idx}
                      href={link.url}
                      className="flex items-center gap-2 text-sm text-xl-bright-blue hover:text-xl-dark-blue hover:underline transition-colors"
                    >
                      <span className="text-base">
                        {link.type === 'tool' && '🔧'}
                        {link.type === 'blog' && '📝'}
                        {link.type === 'whitepaper' && '📄'}
                        {link.type === 'team' && '👤'}
                        {link.type === 'page' && '→'}
                      </span>
                      {link.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
