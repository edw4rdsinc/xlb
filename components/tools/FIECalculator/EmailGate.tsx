'use client';

import { useState } from 'react';
import { isValidEmail, formatPhoneNumber } from '@/lib/fie-calculator/validation';
import { formatPercentage } from '@/lib/fie-calculator/calculations';
import type { CalculationResults } from '@/lib/fie-calculator/calculations';

interface EmailGateProps {
  onSubmit: (data: ContactInfo) => void;
  results?: CalculationResults;
  isCalculating: boolean;
}

interface ContactInfo {
  name: string;
  email: string;
  company: string;
  phone?: string;
}

export default function EmailGate({ onSubmit, results, isCalculating }: EmailGateProps) {
  const [formData, setFormData] = useState<ContactInfo>({
    name: '',
    email: '',
    company: '',
    phone: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Please enter your full name';
    }

    if (!formData.email || !isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.company || formData.company.length < 2) {
      newErrors.company = 'Please enter your company name';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call delay
    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
    }, 1000);
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setFormData({ ...formData, phone: formatted });
  };

  // Calculate savings percentage for preview
  const savingsPercentage = results?.savingsPercentage || 0;
  const isPositiveSavings = savingsPercentage > 0;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Results Preview */}
      {results && !isCalculating && (
        <div className="mb-8 text-center">
          <div className="relative">
            {/* Blurred Background Chart Preview */}
            <div className="absolute inset-0 bg-gradient-to-b from-xl-bright-blue/10 to-white rounded-lg blur-xl" />

            {/* Main Savings Display */}
            <div className="relative bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-600 mb-2">Your Potential Annual Savings</h2>
              <div className={`text-5xl font-bold ${
                isPositiveSavings ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatPercentage(Math.abs(savingsPercentage))}
              </div>
              <p className="text-gray-600 mt-2">
                {isPositiveSavings
                  ? 'compared to current rates'
                  : 'increase from current rates'}
              </p>

              {/* Teaser Bars */}
              <div className="mt-6 space-y-2">
                <div className="h-3 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-3 bg-gray-200 rounded-full animate-pulse w-3/4" />
                <div className="h-3 bg-gray-200 rounded-full animate-pulse w-1/2" />
              </div>
            </div>
          </div>

          <p className="text-gray-600 mt-6 text-lg">
            Complete the form below to unlock your detailed FIE rate analysis and downloadable report
          </p>
        </div>
      )}

      {/* Loading State */}
      {isCalculating && (
        <div className="text-center py-12">
          <div className="inline-flex items-center">
            <svg className="animate-spin h-8 w-8 text-xl-bright-blue mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-xl text-gray-700">Calculating your FIE rates...</span>
          </div>
        </div>
      )}

      {/* Email Form */}
      {!isCalculating && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-xl-dark-blue mb-6">Get Your Complete Analysis</h3>

          <div className="space-y-5">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="John Smith"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Business Email *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="john@company.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Company Field */}
            <div>
              <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                Company/Brokerage *
              </label>
              <input
                type="text"
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue ${
                  errors.company ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="ABC Insurance Brokers"
              />
              {errors.company && (
                <p className="mt-1 text-sm text-red-600">{errors.company}</p>
              )}
            </div>

            {/* Phone Field (Optional) */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number <span className="text-gray-500 font-normal">(Optional)</span>
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full mt-6 px-6 py-3 rounded-md font-semibold text-lg transition-all ${
              isSubmitting
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-xl-bright-blue text-white hover:bg-xl-dark-blue hover:scale-[1.02]'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              'Get My Results'
            )}
          </button>

          {/* Privacy Note */}
          <p className="text-xs text-gray-500 text-center mt-4">
            We respect your privacy. Your information will only be used to send you the FIE analysis report
            and relevant stop-loss insights. You can unsubscribe at any time.
          </p>
        </form>
      )}

      {/* Benefits List */}
      {!isCalculating && (
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 0116 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-gray-700">Detailed Rate Analysis</p>
              <p className="text-xs text-gray-600">Side-by-side rate comparisons</p>
            </div>
          </div>

          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 0116 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-gray-700">PDF Report</p>
              <p className="text-xs text-gray-600">Client-ready presentation</p>
            </div>
          </div>

          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 0116 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-gray-700">Expert Follow-Up</p>
              <p className="text-xs text-gray-600">Optional consultation available</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}