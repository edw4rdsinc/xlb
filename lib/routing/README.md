# IP-Based Geographic Routing System

This system automatically routes website visitors to the appropriate sales representative based on their geographic location.

## How It Works

1. **IP Geolocation**: Uses the ipapi.co free API to detect the visitor's state based on their IP address
2. **Territory Mapping**: Each sales rep is assigned specific US states as their territory
3. **Smart Routing**: Automatically connects visitors with their territory specialist
4. **Fallback**: Defaults to Daron Pitts for international visitors or if geolocation fails

## Files

- `salesRepMapping.ts`: Defines sales rep territories and contact information
- `useGeolocation.ts`: React hook for IP geolocation and rep selection
- `ContactButton.tsx`: Reusable component that links to the correct rep

## Sales Rep Territories

### Steve Caler - Southwest/South Region
- **Headquarters**: California
- **Territory**: CA, NV, AZ, TX, OK, AR, LA, MS, AL, KY, TN
- **Coverage**: 111.5M people (33%), ~97,000 companies (33%)
- **Business Density**: 0.87 companies per 1,000 residents
- **Booking**: Contact via email/phone (no online booking)

### Samuel Edwards - Mountain/Plains/Midwest Region
- **Headquarters**: Oregon
- **Territory**: OR, WA, ID, MT, WY, CO, UT, NM, ND, SD, NE, KS, MN, WI, IA, MO, IL, IN, MI, OH, AK, HI
- **Coverage**: 88.1M people (26%), ~76,500 companies (26%)
- **Business Density**: 0.87 companies per 1,000 residents
- **Booking**: [Microsoft Bookings Link](https://outlook.office.com/bookwithme/user/1a47160b5696400daebe957e6952dbe7@foundationrp.net/meetingtype/TYZOJFFz3UK835t3s89qWA2?anonymous&ismsaljsauthenabled&ep=mlink)

### Jennifer Baird - Eastern Seaboard Region
- **Headquarters**: North Carolina
- **Territory**: ME, NH, VT, MA, RI, CT, NY, NJ, DE, MD, DC, VA, NC, SC, GA, FL, WV, PA
- **Coverage**: 112.6M people (37%), ~82,000 companies (37%)
- **Booking**: [Microsoft Bookings Link](https://outlook.office.com/bookwithme/user/4222c27974ba40aa8cd9fa739cfd7d6a@xlbenefits.com?anonymous&ismsaljsauthenabled&ep=pcard)

## Usage

### Contact Button Component
```tsx
import ContactButton from '@/components/shared/ContactButton'

<ContactButton variant="primary" size="lg">
  Schedule a Consultation
</ContactButton>
```

### Direct Hook Usage
```tsx
import { useGeolocation } from '@/lib/routing/useGeolocation'

const { salesRep, location, loading } = useGeolocation()
```

### Manual Rep Selection
```tsx
import { useSalesRepSelector } from '@/lib/routing/useGeolocation'

const { selectedRep, selectRep } = useSalesRepSelector()
selectRep('daron@xlbenefits.com')
```

## Adding Booking URLs

Once Microsoft Bookings/Calendly links are provided, update them in `salesRepMapping.ts`:

```typescript
export const salesReps: Record<string, SalesRep> = {
  daron: {
    name: 'Daron Pitts',
    email: 'daron@xlbenefits.com',
    phone: '(555) 123-4567',
    bookingUrl: 'https://bookings.microsoft.com/...',  // Add here
    territory: [...]
  },
  // ...
}
```

## Limitations & Considerations

1. **API Limits**: ipapi.co free tier allows 1000 requests/day
   - Consider upgrading for production or using alternative services
   - Alternative APIs: ip-api.com, ipgeolocation.io, geojs.io

2. **Privacy**: IP geolocation is visible in browser network tab
   - Only collects: state, country, city (no personal data stored)
   - Can be disabled by user's VPN/proxy

3. **Accuracy**: IP geolocation is ~95% accurate at state level

4. **Fallback**: Always defaults to Daron for:
   - International visitors
   - Failed API requests
   - Unknown/unassigned states

## Testing

To test different territories locally:
1. Use a VPN to connect from different states
2. Or manually override in the component:
```tsx
const testRep = getSalesRepByState('CA') // Test California routing
```

## Future Enhancements

- [ ] Add caching to reduce API calls
- [ ] Implement server-side routing for better performance
- [ ] Add analytics tracking for territory performance
- [ ] Support for manual territory selection override
- [ ] International territory support
