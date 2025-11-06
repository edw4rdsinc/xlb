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
  steve: {
    name: 'Steve Caler',
    email: 'scaler@xlbenefits.com',
    bookingUrl: '', // No booking link - contact via email/phone
    territory: [
      // Southwest/South Region - HQ: California
      // Population: 111.5M (33%), Companies: ~97,000 (33%)
      'CA', 'NV', 'AZ', 'TX', 'OK', 'AR', 'LA', 'MS', 'AL', 'KY', 'TN'
    ]
  },
  sam: {
    name: 'Samuel Edwards',
    email: 'sedwards@xlbenefits.com',
    bookingUrl: 'https://outlook.office.com/bookwithme/user/1a47160b5696400daebe957e6952dbe7@foundationrp.net/meetingtype/TYZOJFFz3UK835t3s89qWA2?anonymous&ismsaljsauthenabled&ep=mlink',
    territory: [
      // Mountain/Plains/Midwest Region - HQ: Oregon
      // Population: 88.1M (26%), Companies: ~76,500 (26%)
      'OR', 'WA', 'ID', 'MT', 'WY', 'CO', 'UT', 'NM', 'ND', 'SD', 'NE',
      'KS', 'MN', 'WI', 'IA', 'MO', 'IL', 'IN', 'MI', 'OH', 'AK', 'HI'
    ]
  },
  jennifer: {
    name: 'Jennifer Baird',
    email: 'jbaird@xlbenefits.com',
    bookingUrl: 'https://outlook.office.com/bookwithme/user/4222c27974ba40aa8cd9fa739cfd7d6a@xlbenefits.com?anonymous&ismsaljsauthenabled&ep=pcard',
    territory: [
      // Eastern Seaboard Region - HQ: North Carolina
      // Population: 112.6M (37%), Companies: ~82,000 (37%)
      'ME', 'NH', 'VT', 'MA', 'RI', 'CT', 'NY', 'NJ', 'DE', 'MD', 'DC',
      'VA', 'NC', 'SC', 'GA', 'FL', 'WV', 'PA'
    ]
  }
}

/**
 * Get the appropriate sales rep based on state code
 * @param stateCode - Two-letter US state code
 * @returns Sales rep information or default rep (Steve) if state not found
 */
export function getSalesRepByState(stateCode: string): SalesRep {
  const normalizedState = stateCode.toUpperCase()

  for (const [key, rep] of Object.entries(salesReps)) {
    if (rep.territory.includes(normalizedState)) {
      return rep
    }
  }

  // Default to Steve if state not found
  return salesReps.steve
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
