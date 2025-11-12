/**
 * Centralized contact information for XL Benefits
 * This file serves as the single source of truth for all contact details
 */

export const CONTACT = {
  general: {
    email: 'info@xlbenefits.com',
    phone: '(916) 512-8340',
    phoneRaw: '9165128340', // For tel: links
    phoneOld: '(386) 999-0001' // Legacy number, may still be referenced
  },
  team: {
    daron: {
      name: 'Daron Pitts',
      title: 'President & Founder',
      email: 'dpitts@xlbenefits.com',
      linkedin: 'https://www.linkedin.com/in/daron-pitts-b0657063/'
    },
    jennifer: {
      name: 'Jennifer Baird-Flynn',
      title: 'Stop Loss Sales Consultant',
      email: 'jbaird@xlbenefits.com',
      linkedin: 'https://www.linkedin.com/in/jennifer-baird-flynn-a2aa113a/'
    },
    steve: {
      name: 'Steve Caler',
      title: 'Director of Business Development',
      email: 'scaler@xlbenefits.com',
      linkedin: 'https://www.linkedin.com/in/steve-caler-csfs-852a7451/'
    },
    sam: {
      name: 'Sam Edwards',
      title: 'Stop Loss Sales Consultant',
      email: 'sedwards@xlbenefits.com',
      linkedin: 'https://www.linkedin.com/in/samuel-edwards-1baba411a/'
    }
  },
  company: {
    name: 'XL Benefits, Corp.',
    license: 'CA License #0M93299',
    website: 'https://xlbenefits.com'
  },
  address: {
    // Add physical address when available
    mailing: ''
  }
} as const

// Type-safe helper to get team member by email
export function getTeamMemberByEmail(email: string) {
  return Object.values(CONTACT.team).find(member => member.email === email)
}

// Type-safe helper to get team member emails
export function getTeamEmails() {
  return Object.values(CONTACT.team).map(member => member.email)
}