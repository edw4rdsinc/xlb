'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const waitlistSchema = z.object({
  email: z.string().email('Invalid email address'),
})

type WaitlistFormData = z.infer<typeof waitlistSchema>

interface ToolComingSoonProps {
  toolName: string
  description: string
  expectedDate?: string
}

export default function ToolComingSoon({ toolName, description, expectedDate }: ToolComingSoonProps) {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
  })

  const onSubmit = async (data: WaitlistFormData) => {
    // Placeholder for waitlist submission
    console.log('Waitlist submission:', data)
    await new Promise(resolve => setTimeout(resolve, 500))
    setSubmitted(true)
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8 text-center">
      <div className="max-w-md mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
          <svg
            className="w-8 h-8 text-primary-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-2">{toolName}</h3>
        <p className="text-gray-600 mb-6">{description}</p>

        {expectedDate && (
          <p className="text-sm text-gray-500 mb-6">
            Expected launch: <span className="font-semibold">{expectedDate}</span>
          </p>
        )}

        {!submitted ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                type="email"
                {...register('email')}
                placeholder="Enter your email for early access"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Joining...' : 'Join Waitlist'}
            </button>
          </form>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-green-800 font-semibold">
              Thank you! We'll notify you when this tool launches.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
