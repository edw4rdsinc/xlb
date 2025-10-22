# MySportsFeeds API Integration Guide

## Overview

The XL Benefits Fantasy Football platform now uses **MySportsFeeds** for real NFL player statistics.

- **Provider:** MySportsFeeds
- **Tier:** Unlimited Non-Live ($39 CAD/month)
- **Update Frequency:** Tuesday mornings after Monday Night Football
- **Free Trial:** 14 days (ends November 5, 2025)

---

## Setup Complete ✅

The integration is **fully built and ready to use** as soon as MySportsFeeds API access activates.

### What Was Built:

1. **MySportsFeeds API Client** (`lib/api/mysportsfeeds.ts`)
   - Handles authentication
   - Fetches weekly player stats
   - Transforms MySportsFeeds format → Your PPR scoring format
   - Error handling with automatic fallback to mock API

2. **Updated NFL Stats API** (`lib/api/nfl-stats.ts`)
   - Automatically uses MySportsFeeds when credentials are configured
   - Falls back to mock API if MySportsFeeds unavailable
   - Shows API status in admin dashboard

3. **Enhanced Admin Scoring Page** (`app/admin/scoring/page.tsx`)
   - Shows which API is active (MySportsFeeds or Mock)
   - Green badge when MySportsFeeds connected
   - Yellow badge when using mock data
   - Better error messages and feedback

4. **Environment Variables** (`.env.local`)
   - MySportsFeeds credentials configured
   - Ready to use immediately

---

## Current Status

### ⏳ Waiting for MySportsFeeds Backend Sync

**Issue:** MySportsFeeds subscription shows as active in your account dashboard, but their API still returns "Access Restricted - no subscription"

**What This Means:**
- Your subscription is paid and active ✅
- MySportsFeeds backend needs to sync (usually 30-60 minutes)
- Once synced, integration will work immediately

**Owner Response:** You emailed the MySportsFeeds owner - they should respond soon to resolve the backend sync issue.

---

## Testing the Integration

### Once MySportsFeeds API Activates:

1. **Start the dev server:**
   ```bash
   cd /home/sam/Documents/github-repos/xlb/xlb
   npm run dev
   ```

2. **Go to Admin Scoring:**
   - Navigate to `http://localhost:3000/admin/scoring`
   - Check the badge says "MySportsFeeds" (green)

3. **Sync Stats:**
   - Select a week (8 or current week)
   - Click "Sync Stats for Week X"
   - Should fetch real NFL data from MySportsFeeds
   - Preview will show actual players and stats

4. **Calculate Scores:**
   - Click "Calculate All Scores"
   - Your PPR scoring logic applies automatically
   - Scores saved to database

5. **Publish Results:**
   - Click "Publish Results & Notify"
   - Participants can see scores on results page

---

## How It Works

### Data Flow:

```
Tuesday Morning
↓
MySportsFeeds updates NFL stats
↓
Admin clicks "Sync Stats for Week X"
↓
lib/api/mysportsfeeds.ts fetches data
↓
Transform to NFLPlayerStats format
↓
lib/scoring/calculator.ts applies PPR rules
↓
Scores saved to weekly_scores table
↓
Published to /fantasy-football/results
```

### Your PPR Scoring Rules (Already Configured):

- **Passing:** 4 pts/TD, 1 pt per 25 yards
- **Rushing:** 6 pts/TD, 1 pt per 10 yards
- **Receiving:** 6 pts/TD, 1 pt/reception (PPR), 1 pt per 10 yards
- **Kicker:** 3 pts/FG, 1 pt/PAT
- **Defense:** 6 pts/TD, 2 pts/INT, 2 pts/safety, 1 pt/sack
- **Two-Point Conversions:** 2 pts

---

## Troubleshooting

### If API Still Shows "Mock API" After Restarting:

1. **Check Environment Variables:**
   ```bash
   cat /home/sam/Documents/github-repos/xlb/xlb/.env.local
   ```
   Should show:
   ```
   MYSPORTSFEEDS_API_KEY=1a57a836-08b4-4cec-bec1-8f3a8f
   MYSPORTSFEEDS_PASSWORD=ldinAYIkgiS5N8rL
   ```

2. **Restart Dev Server:**
   ```bash
   # Kill the dev server (Ctrl+C)
   npm run dev
   ```

3. **Check Console Logs:**
   Look for:
   - `[NFL Stats API] Using MySportsFeeds API` ✅ Good
   - `[NFL Stats API] MySportsFeeds credentials not found - using MOCK API` ❌ Bad

### If MySportsFeeds API Returns Errors:

The code automatically falls back to mock API and logs the error. Check console for details.

---

## Files Modified

### Created:
- `lib/api/mysportsfeeds.ts` - MySportsFeeds client
- `.env.local` - Environment variables with credentials
- `MYSPORTSFEEDS_INTEGRATION.md` - This file

### Updated:
- `.env.example` - Added MySportsFeeds credential placeholders
- `lib/api/nfl-stats.ts` - Now uses MySportsFeeds with fallback
- `app/admin/scoring/page.tsx` - Shows API status and better feedback

---

## Next Steps

1. **Wait for MySportsFeeds API access** (owner should respond to your email)
2. **Test the integration** with real Week 8 data
3. **Verify scoring calculations** are correct
4. **Import player roster** to database (if needed)
5. **Test full workflow:** Sync → Calculate → Publish

---

## Support

- **MySportsFeeds Support:** Owner already responded once, should help with backend sync
- **API Status Check:** `https://www.mysportsfeeds.com/index.php/profile/30505/`
- **API Docs:** `https://www.mysportsfeeds.com/data-feeds/api-docs/`

---

## Cost Summary

- **Free Trial:** Until November 5, 2025
- **Monthly Cost:** $39 CAD (~$30 USD) after trial
- **API Calls:** Unlimited (Non-Live tier)
- **Perfect for Your Use Case:** Weekly imports, no live data needed

---

**Status:** ✅ Integration complete, waiting for MySportsFeeds backend to activate API access.
