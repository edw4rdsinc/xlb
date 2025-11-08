'use client';

import { useState, useEffect, useRef } from 'react';
import { X, BookOpen, Send, Loader2, FileText, Search } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface VendorLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface OverviewData {
  readme: string;
  progress: string;
}

const VENDOR_TIERS = [
  { id: 1, name: 'Claims Cost Management', description: 'RBP, repricing, payment integrity' },
  { id: 2, name: 'Stop-Loss & Risk Partnership', description: 'Carriers, captives, consulting' },
  { id: 3, name: 'Pharmacy Transparency', description: 'Pass-through PBMs, specialty RX' },
  { id: 4, name: 'High-Cost Conditions', description: 'Cancer, dialysis, transplant, gene therapy' },
  { id: 5, name: 'High-Prevalence Conditions', description: 'Diabetes, MSK, cardiovascular' },
  { id: 6, name: 'Care Access & Delivery', description: 'Telemedicine, primary care, COEs' },
  { id: 7, name: 'Navigation & Advocacy', description: 'Patient navigation, second opinions' },
  { id: 8, name: 'Behavioral Health', description: 'Mental health, EAPs, digital therapeutics' },
  { id: 9, name: 'Utilization Governance', description: 'Prior auth, UR, appropriateness' },
  { id: 10, name: 'Compliance & Administration', description: 'ERISA, HSA/FSA, transparency' },
  { id: 11, name: 'Data & Analytics', description: 'Independent analytics, benchmarking' },
  { id: 12, name: 'TPAs', description: 'Full-service, tech-forward, specialized' },
  { id: 13, name: 'Emerging Solutions', description: 'AI assistants, SDOH, longevity' },
  { id: 14, name: 'Integration & Interoperability', description: 'APIs, care coordination' },
  { id: 15, name: 'Governance & Stewardship', description: 'Fiduciary advisors, vendor mgmt' },
];

export default function VendorLibraryModal({ isOpen, onClose }: VendorLibraryModalProps) {
  const [view, setView] = useState<'overview' | 'chat'>('overview');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load overview data when modal opens
  useEffect(() => {
    if (isOpen && !overview) {
      fetchOverview();
    }
  }, [isOpen]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchOverview = async () => {
    try {
      setLoadingOverview(true);
      const response = await fetch('/api/vendor-library?action=overview');
      const data = await response.json();
      setOverview(data);
    } catch (error) {
      console.error('Failed to fetch overview:', error);
    } finally {
      setLoadingOverview(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Search vendor library for relevant content
      const searchResponse = await fetch(
        `/api/vendor-library?action=search&query=${encodeURIComponent(inputMessage)}`
      );
      const searchData = await searchResponse.json();

      // Create AI response based on search results
      const assistantResponse = generateResponse(inputMessage, searchData);

      const assistantMessage: Message = {
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error searching the vendor library. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateResponse = (query: string, searchData: any): string => {
    if (!searchData.results || searchData.results.length === 0) {
      return `I couldn't find specific information about "${query}" in the vendor library.

The library contains research on 15 healthcare vendor tiers including pharmacy transparency, claims management, care delivery, and more.

Could you try rephrasing your question or ask about a specific vendor category?`;
    }

    const relevantFiles = searchData.results.slice(0, 3);
    let response = `I found ${searchData.results.length} relevant document(s) about "${query}":\n\n`;

    relevantFiles.forEach((file: any, index: number) => {
      response += `**${index + 1}. ${file.name}**\n`;
      if (file.snippet) {
        response += `"...${file.snippet}..."\n\n`;
      } else {
        response += `This document contains relevant information about your query.\n\n`;
      }
    });

    response += `\nWould you like me to provide more details about any of these documents?`;

    return response;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-xl-dark-blue to-xl-bright-blue text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Vendor Knowledge Library</h2>
              <p className="text-sm text-white/80">Healthcare Ecosystem Research</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex">
            <button
              onClick={() => setView('overview')}
              className={`px-6 py-3 font-semibold transition-colors ${
                view === 'overview'
                  ? 'text-xl-bright-blue border-b-2 border-xl-bright-blue bg-white'
                  : 'text-gray-600 hover:text-xl-dark-blue'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setView('chat')}
              className={`px-6 py-3 font-semibold transition-colors ${
                view === 'chat'
                  ? 'text-xl-bright-blue border-b-2 border-xl-bright-blue bg-white'
                  : 'text-gray-600 hover:text-xl-dark-blue'
              }`}
            >
              <Search className="w-4 h-4 inline mr-2" />
              Research Assistant
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {view === 'overview' && (
            <div className="p-6">
              {loadingOverview ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-xl-bright-blue" />
                </div>
              ) : (
                <>
                  {/* Core Philosophy */}
                  <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-2xl font-bold text-xl-dark-blue mb-4">Core Philosophy</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-xl-bright-blue/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          🗽
                        </div>
                        <div>
                          <h4 className="font-bold text-xl-dark-blue">Freedom</h4>
                          <p className="text-sm text-gray-600">Choice, portability, flexibility, no lock-in</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-xl-bright-blue/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          🔍
                        </div>
                        <div>
                          <h4 className="font-bold text-xl-dark-blue">Transparency</h4>
                          <p className="text-sm text-gray-600">Clear pricing, performance, methodology</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-xl-bright-blue/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          🤝
                        </div>
                        <div>
                          <h4 className="font-bold text-xl-dark-blue">Partnership</h4>
                          <p className="text-sm text-gray-600">Aligned incentives, risk-sharing</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-xl-bright-blue/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          💫
                        </div>
                        <div>
                          <h4 className="font-bold text-xl-dark-blue">Human Dignity</h4>
                          <p className="text-sm text-gray-600">Respect, compassion, connectability</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 15 Vendor Tiers */}
                  <div>
                    <h3 className="text-2xl font-bold text-xl-dark-blue mb-4">15 Vendor Tiers</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {VENDOR_TIERS.map((tier) => (
                        <div
                          key={tier.id}
                          className="bg-white border-2 border-gray-200 hover:border-xl-bright-blue rounded-lg p-4 transition-all hover:shadow-md group cursor-pointer"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-xl-bright-blue/10 group-hover:bg-xl-bright-blue/20 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-xl-bright-blue text-sm">
                              {tier.id}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-xl-dark-blue text-sm mb-1 group-hover:text-xl-bright-blue transition-colors">
                                {tier.name}
                              </h4>
                              <p className="text-xs text-gray-600">{tier.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Status:</strong> ✅ 100% Complete - All 45 research prompts + 2 gap-fill documents
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {view === 'chat' && (
            <div className="flex flex-col h-full">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-semibold mb-2">Ask me about healthcare vendors</p>
                    <p className="text-sm">I can help you search through our comprehensive vendor research library</p>
                    <div className="mt-6 space-y-2 text-left max-w-md mx-auto">
                      <p className="text-xs text-gray-400">Try asking:</p>
                      <div className="bg-gray-50 rounded-lg p-3 text-sm">
                        "What transparent PBM options are available?"
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-sm">
                        "Tell me about independent primary care vendors"
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-sm">
                        "What are the best stop-loss carriers?"
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            message.role === 'user'
                              ? 'bg-xl-bright-blue text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                          <p className="text-xs mt-2 opacity-70">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg p-4">
                          <Loader2 className="w-5 h-5 animate-spin text-xl-bright-blue" />
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about vendors, tiers, or research..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="px-6 py-3 bg-xl-bright-blue text-white rounded-lg hover:bg-xl-dark-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
