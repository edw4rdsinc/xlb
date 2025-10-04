import { z } from 'zod'

export const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  brokerage: z.string().optional(),
  phone: z.string().optional(),
})

export type EmailFormData = z.infer<typeof emailSchema>

export async function verifyEmail(email: string): Promise<boolean> {
  // Placeholder for actual email verification logic
  // In production, this would call an email verification API
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function submitEmailCapture(data: EmailFormData): Promise<{ success: boolean; message?: string }> {
  // Placeholder for actual API call to save email capture
  // In production, this would integrate with your email service provider

  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    console.log('Email capture submitted:', data)

    return {
      success: true,
      message: 'Thank you! Your email has been verified.',
    }
  } catch (error) {
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    }
  }
}
