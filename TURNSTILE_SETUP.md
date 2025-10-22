# Cloudflare Turnstile Setup Guide

**Last Updated:** October 22, 2025

## Why Turnstile Instead of reCAPTCHA?

We've switched from Google reCAPTCHA to Cloudflare Turnstile for several reasons:

### Advantages of Turnstile:
- **🔐 Privacy-First:** No user tracking or profiling
- **🎯 Better UX:** No "I'm not a robot" puzzles
- **⚡ Faster:** Works seamlessly with Cloudflare CDN
- **🌍 GDPR Compliant:** No cookies, no personal data collection
- **💰 Free:** Up to 1 million requests/month
- **🤖 SEO-Friendly:** Allows legitimate bots to crawl content

## Quick Setup Steps

### 1. Get Your Turnstile Keys

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Turnstile** in the sidebar
3. Click **"Add Site"**
4. Configure:
   - **Site name:** `XL Benefits` (or your preference)
   - **Domain:**
     - Add your production domain (e.g., `xlbenefits.com`)
     - Add `localhost` for development
   - **Widget Mode:** Choose one:
     - **Invisible** - Runs in background, no user interaction
     - **Managed** - Shows widget only when suspicious
     - **Non-Interactive** - Always visible, no interaction needed
   - **Recommendation:** Start with **Managed** mode
5. Click **Create**
6. Copy your keys:
   - **Site Key** (public, for frontend)
   - **Secret Key** (private, for backend)

### 2. Configure Environment Variables

Add to `.env.local`:
```bash
# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAAVlPxxxxxxxxx
TURNSTILE_SECRET_KEY=0x4AAAAAAAVlPyyyyyyyyyyyyy

# Optional: Enable in development
# NEXT_PUBLIC_ENABLE_CAPTCHA=true
```

### 3. Configure AI Crawlers in Cloudflare

When setting up your domain in Cloudflare:

**For "Control how AI crawlers access your site":**
- Choose: **"Do not block (allow crawlers)"**

This allows:
- ✅ Search engines to index your content
- ✅ AI bots to understand your site for SEO
- ❌ Bots still can't submit forms (Turnstile blocks this)

### 4. Test Your Setup

```bash
# Start your dev server
npm run dev

# In another terminal, run the test
node test-turnstile.js
```

## How It Works

### For Legitimate Users:
1. User fills out calculator form
2. Turnstile runs invisibly in background
3. If user seems legitimate → Form submits normally
4. If suspicious → May show a simple challenge

### For Bots:
1. Can crawl and read all public content (good for SEO)
2. Cannot submit forms or use calculators (blocked by Turnstile)
3. Cannot spam fantasy football or quiz submissions

## Implementation Details

### Files Modified:
- `lib/api/security/captcha.ts` - Turnstile verification logic
- `lib/hooks/useCalculatorAPI.ts` - Client-side Turnstile integration
- `.env.local` - Environment variables
- `.env.example` - Example configuration

### API Endpoints Protected:
- `/api/calculators/fie/calculate` - FIE Calculator
- `/api/calculators/deductible/calculate` - Deductible Analyzer
- `/api/calculators/assessment/calculate` - Self-funding Assessment
- `/api/fantasy-football/submit-lineup` - Fantasy Football (needs update)

## Enabling in Production

When ready to go live:

1. **In API routes**, change:
   ```typescript
   // From:
   requireCaptcha: false,

   // To:
   requireCaptcha: true,
   ```

2. **Locations to update:**
   - `/app/api/calculators/fie/calculate/route.ts`
   - `/app/api/calculators/deductible/calculate/route.ts`
   - `/app/api/calculators/assessment/calculate/route.ts`

3. **Monitor in Cloudflare Dashboard:**
   - View analytics in Turnstile dashboard
   - Check challenge solve rate
   - Monitor for false positives

## Widget Modes Explained

### Invisible Mode
- Best for: Low-friction experience
- How it works: Runs completely in background
- User sees: Nothing (unless very suspicious)

### Managed Mode (Recommended)
- Best for: Balance of security and UX
- How it works: Shows widget only when needed
- User sees: Small widget occasionally

### Non-Interactive Mode
- Best for: Maximum transparency
- How it works: Always visible, no interaction
- User sees: Turnstile widget on every form

## Troubleshooting

### "TURNSTILE_SECRET_KEY not configured"
- Make sure you've added the key to `.env.local`
- Restart your Next.js dev server

### Widget not appearing
- Check browser console for errors
- Verify site key is correct
- Check domain is whitelisted in Turnstile settings

### High false positive rate
- Switch from Invisible to Managed mode
- Check if your IP is flagged (use VPN to test)
- Review Turnstile analytics dashboard

## Development Testing

### Bypass in Development:
The implementation automatically bypasses Turnstile in development unless you set:
```bash
NEXT_PUBLIC_ENABLE_CAPTCHA=true
```

### Test with Mock Token:
```javascript
// In development, you can use:
captchaToken: 'development-token'
```

### Force Challenge Display:
Add `?cf_turnstile_forced=true` to your URL to force the widget to appear.

## Monitoring & Analytics

### In Cloudflare Dashboard:
- **Requests:** Total verification attempts
- **Solve Rate:** Percentage of successful verifications
- **Challenge Rate:** How often challenges are shown
- **Time to Solve:** Average completion time

### In Your Supabase Database:
After running the audit_logs migration:
```sql
-- View recent Turnstile verifications
SELECT * FROM audit_logs
WHERE captcha_score IS NOT NULL
ORDER BY timestamp DESC
LIMIT 100;

-- Check suspicious activity
SELECT * FROM audit_logs
WHERE captcha_score = 0
ORDER BY timestamp DESC;
```

## Security Best Practices

1. **Never expose your secret key** - Keep it server-side only
2. **Rate limiting still applies** - Turnstile + rate limiting = defense in depth
3. **Monitor audit logs** - Check for patterns of abuse
4. **Update regularly** - Keep Turnstile script updated
5. **Test all forms** - Ensure protection on all endpoints

## Migration Checklist

- [x] Removed reCAPTCHA code
- [x] Added Turnstile verification
- [x] Updated client-side hooks
- [x] Updated environment variables
- [x] Created test scripts
- [ ] Get Turnstile keys from Cloudflare
- [ ] Add keys to `.env.local`
- [ ] Test in development
- [ ] Run audit_logs migration in Supabase
- [ ] Enable in production (set requireCaptcha: true)
- [ ] Monitor analytics dashboard

## Support

- [Cloudflare Turnstile Docs](https://developers.cloudflare.com/turnstile/)
- [Turnstile Dashboard](https://dash.cloudflare.com/?to=/:account/turnstile)
- [Migration Guide](https://developers.cloudflare.com/turnstile/migration/migrating-from-recaptcha/)

---

Remember: Turnstile is more privacy-friendly and user-friendly than reCAPTCHA while providing equivalent protection against bots!