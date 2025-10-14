'use client'

import { useState, useEffect } from 'react'
import { getSalesRepByState, type SalesRep, salesReps } from './salesRepMapping'

interface GeolocationData {
  state?: string
  country?: string
  city?: string
  ip?: string
}

/**
 * Hook to get user's geolocation and appropriate sales rep
 * Uses ipapi.co for IP geolocation (free tier: 1000 requests/day)
 * Falls back to default rep (Daron) if geolocation fails
 */
export function useGeolocation() {
  const [salesRep, setSalesRep] = useState<SalesRep>(salesReps.daron)
  const [location, setLocation] = useState<GeolocationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGeolocation() {
      try {
        // Using ipapi.co free tier (1000 requests/day, no API key needed)
        // Alternative services: ip-api.com, ipgeolocation.io, geojs.io
        const response = await fetch('https://ipapi.co/json/', {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch geolocation')
        }

        const data = await response.json()

        const locationData: GeolocationData = {
          state: data.region_code,
          country: data.country_code,
          city: data.city,
          ip: data.ip
        }

        setLocation(locationData)

        // Only route by state if in the US
        if (data.country_code === 'US' && data.region_code) {
          const rep = getSalesRepByState(data.region_code)
          setSalesRep(rep)
        } else {
          // Default to Daron for international or unknown locations
          setSalesRep(salesReps.daron)
        }
      } catch (err) {
        console.error('Geolocation error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        // Default to Daron on error
        setSalesRep(salesReps.daron)
      } finally {
        setLoading(false)
      }
    }

    fetchGeolocation()
  }, [])

  return { salesRep, location, loading, error }
}

/**
 * Manual override function to select a specific sales rep
 */
export function useSalesRepSelector() {
  const [selectedRep, setSelectedRep] = useState<SalesRep | null>(null)

  const selectRep = (repEmail: string) => {
    const rep = Object.values(salesReps).find(r => r.email === repEmail)
    if (rep) {
      setSelectedRep(rep)
    }
  }

  return { selectedRep, selectRep }
}
