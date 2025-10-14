// Sales Representative Territory Mapping
// Maps US states/regions to the appropriate sales representative

export interface SalesRep {
  name: string
  email: string
  phone?: string
  bookingUrl?: string
  territory: string[]
}

export const salesReps: Record<string, SalesRep> = {
  daron: {
    name: 'Daron Pitts',
    email: 'daron@xlbenefits.com',
    phone: '(555) 123-4567', // Update with actual phone
    bookingUrl: '', // No booking link - contact via email/phone
    territory: [
      // West Coast & Mountain States
      'CA', 'OR', 'WA', 'NV', 'AZ', 'UT', 'ID', 'MT', 'WY', 'CO', 'NM',
      'AK', 'HI'
    ]
  },
  jennifer: {
    name: 'Jennifer Baird',
    email: 'jennifer@xlbenefits.com',
    phone: '(555) 234-5678', // Update with actual phone
    bookingUrl: 'https://outlook.office.com/bookwithme/user/4222c27974ba40aa8cd9fa739cfd7d6a@xlbenefits.com?anonymous&ismsaljsauthenabled&ep=pcard',
    territory: [
      // East Coast & Southeast
      'NC', 'SC', 'GA', 'FL', 'VA', 'WV', 'MD', 'DE', 'DC', 'PA', 'NJ',
      'NY', 'CT', 'RI', 'MA', 'VT', 'NH', 'ME', 'AL', 'MS', 'TN', 'KY'
    ]
  },
  sam: {
    name: 'Samuel Edwards',
    email: 'sam@xlbenefits.com',
    phone: '(555) 345-6789', // Update with actual phone
    bookingUrl: 'https://outlook.office.com/bookwithme/user/1a47160b5696400daebe957e6952dbe7@foundationrp.net/meetingtype/TYZOJFFz3UK835t3s89qWA2?anonymous&ismsaljsauthenabled&ep=mlink',
    territory: [
      // Midwest & Central (formerly Steve's territory)
      'IL', 'IN', 'OH', 'MI', 'WI', 'MN', 'IA', 'MO', 'KS', 'NE', 'SD',
      'ND', 'OK', 'TX', 'AR', 'LA'
    ]
  }
}

/**
 * Get the appropriate sales rep based on state code
 * @param stateCode - Two-letter US state code
 * @returns Sales rep information or default rep (Daron) if state not found
 */
export function getSalesRepByState(stateCode: string): SalesRep {
  const normalizedState = stateCode.toUpperCase()

  for (const [key, rep] of Object.entries(salesReps)) {
    if (rep.territory.includes(normalizedState)) {
      return rep
    }
  }

  // Default to Daron if state not found
  return salesReps.daron
}

/**
 * Get all sales reps
 */
export function getAllSalesReps(): SalesRep[] {
  return Object.values(salesReps)
}

/**
 * Update booking URL for a sales rep
 */
export function updateBookingUrl(repEmail: string, bookingUrl: string): void {
  for (const rep of Object.values(salesReps)) {
    if (rep.email === repEmail) {
      rep.bookingUrl = bookingUrl
      break
    }
  }
}
