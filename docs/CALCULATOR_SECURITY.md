# Calculator Security Implementation Guide

## Overview
This document explains how the calculator logic has been moved to the backend to protect intellectual property and prevent reverse engineering.

## Architecture

### Security Layers
1. **Rate Limiting** - Prevents brute force attempts to reverse engineer
2. **CAPTCHA (reCAPTCHA v3)** - Blocks bots and automated scrapers
3. **Input Validation** - Prevents malicious inputs and SQL injection
4. **Security Checks** - Blocks XSS and other attack vectors
5. **Audit Logging** - Tracks all usage for monitoring suspicious activity

### File Structure
```
/lib/api/security/
├── rate-limiter.ts      # Rate limiting logic
├── captcha.ts           # reCAPTCHA verification
├── validation.ts        # Input validation schemas
├── audit-logger.ts      # Usage tracking
└── api-handler.ts       # Main security wrapper

/app/api/calculators/
├── fie/calculate/route.ts       # FIE Calculator API
├── deductible/calculate/route.ts # Deductible Analyzer API
└── assessment/calculate/route.ts # Assessment API

/lib/hooks/
└── useCalculatorAPI.ts   # React hooks for frontend

/components/tools/
├── FIECalculatorClient.tsx      # Client component
├── DeductibleAnalyzerClient.tsx # Client component
└── AssessmentClient.tsx        # Client component
```

## Setup Instructions

### 1. Get reCAPTCHA Keys
1. Go to https://www.google.com/recaptcha/admin
2. Create a new site with reCAPTCHA v3
3. Add your domains (localhost for dev, xlbenefits.com for prod)
4. Copy the Site Key and Secret Key

### 2. Configure Environment Variables
```env
# .env.local
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here

# For development testing
NEXT_PUBLIC_ENABLE_CAPTCHA=false
```

### 3. Complete Implementation Steps

#### For Each Calculator:

1. **Create API Endpoint** (already done for FIE)
```typescript
// app/api/calculators/[calculator]/calculate/route.ts
export const POST = createSecureHandler({
  calculator: 'fie',
  schema: fieCalculatorSchema,
  rateLimit: { windowMs: 60000, maxRequests: 5 },
  requireCaptcha: true,
  handler: handleCalculation
});
```

2. **Move Calculation Logic**
- Keep all formulas and business logic in `/lib/[calculator]/`
- These files are NEVER imported by client components
- Only the API routes import and use them

3. **Update Frontend Components**
- Replace direct calculation calls with API calls
- Use the `useCalculatorAPI` hook
- Remove all imports of calculation logic

## Security Configuration

### Rate Limits (Configurable per Calculator)
- **FIE Calculator**: 5 requests/minute (most valuable)
- **Deductible Analyzer**: 10 requests/minute
- **Assessment**: 20 requests/minute (it's a quiz)

### CAPTCHA Scores (Configurable)
- **FIE Calculator**: 0.7 minimum (strictest)
- **Deductible Analyzer**: 0.5 minimum
- **Assessment**: 0.3 minimum (most lenient)

## How It Works

### Request Flow
1. User fills out form in browser
2. Frontend requests CAPTCHA token from Google
3. Frontend sends data + token to API endpoint
4. API checks rate limit → CAPTCHA → validation → security
5. If all pass, calculation runs server-side
6. Only results returned to frontend (no formulas exposed)

### What's Protected
- ✅ All calculation formulas
- ✅ Tier configurations and ratios
- ✅ Aggregate factors
- ✅ Business logic and algorithms
- ✅ Proprietary constants

### What's Visible to Users
- ✅ Final calculation results
- ✅ Input forms and UI
- ✅ General descriptions of what's calculated
- ❌ No formulas or implementation details
- ❌ No intermediate calculation steps

## Testing

### Development Mode
```bash
# Run with CAPTCHA disabled
NEXT_PUBLIC_ENABLE_CAPTCHA=false npm run dev

# Run with CAPTCHA enabled (need valid keys)
NEXT_PUBLIC_ENABLE_CAPTCHA=true npm run dev
```

### Test Rate Limiting
```javascript
// Make rapid requests to test rate limiting
for(let i = 0; i < 10; i++) {
  fetch('/api/calculators/fie/calculate', {
    method: 'POST',
    body: JSON.stringify({...})
  });
}
// After 5 requests, should get 429 error
```

### Monitor Usage
```typescript
// Check audit logs
GET /api/admin/audit-logs

// Check rate limit stats
GET /api/admin/rate-limit-stats
```

## Production Deployment

### Vercel Environment Variables
Add these in Vercel dashboard:
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- `RECAPTCHA_SECRET_KEY`
- Remove or set `NEXT_PUBLIC_ENABLE_CAPTCHA=true`

### Monitoring
- Check Vercel Functions logs for errors
- Monitor audit logs for suspicious patterns
- Set up alerts for high error rates

## Scaling Considerations

### Current Implementation (Good for Start)
- In-memory rate limiting
- In-memory audit logs
- Works well for < 1000 requests/day

### Future Scaling (When Needed)
- Move rate limiting to Redis
- Store audit logs in Supabase
- Add CDN caching for static assets
- Consider Edge Functions for lower latency

## Security Best Practices

1. **Never expose calculation logic in client bundles**
2. **Regularly review audit logs for suspicious patterns**
3. **Update CAPTCHA score thresholds based on usage**
4. **Monitor for unusual traffic patterns**
5. **Keep rate limits reasonable for legitimate users**
6. **Use HTTPS in production (Vercel handles this)**

## Troubleshooting

### "Too many requests" error
- User hitting rate limit
- Solution: Wait 60 seconds or adjust limits

### "CAPTCHA verification failed"
- Low score (likely bot)
- Solution: Check if legitimate user, adjust threshold

### "Calculation failed"
- Server error in calculation logic
- Solution: Check Vercel function logs

## Next Steps

1. ✅ Created security infrastructure
2. ✅ Implemented FIE Calculator API
3. ⏳ Implement Deductible Analyzer API
4. ⏳ Implement Assessment API
5. ⏳ Update all frontend components
6. ⏳ Add monitoring dashboard
7. ⏳ Deploy to production with reCAPTCHA keys