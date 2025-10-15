# XL Benefits Fantasy Football Platform

A complete fantasy football management platform built for XL Benefits broker partners. Features lineup submission, automated scoring via API, real-time results, and email notifications.

## 🏈 Features

### Public Pages
- **Landing Page** (`/fantasy-football`) - Rules, prizes, scoring details
- **Lineup Submission** (`/fantasy-football/submit`) - Simple 3-field form + player selection
- **Results** (`/fantasy-football/results`) - Weekly, Round, and Season leaderboards
- **Rosters** (`/fantasy-football/rosters`) - View all submitted lineups (grid/list view)

### Admin Dashboard
- **Dashboard** (`/admin/dashboard`) - Overview stats and recent submissions
- **Players** (`/admin/players`) - Manage player database *(coming soon)*
- **Lineups** (`/admin/lineups`) - View/edit submitted lineups *(coming soon)*
- **Scoring** (`/admin/scoring`) - Sync stats from API and calculate scores
- **Emails** (`/admin/emails`) - Send notifications to participants *(coming soon)*

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account (for PostgreSQL database)
- Resend account (for emails - optional)
- NFL Stats API (ESPN, Sleeper, Yahoo, etc. - optional for now)

### Installation

```bash
# Clone the repository
git clone https://github.com/edw4rdsinc/xlb.git
cd xlb

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials
```

### Environment Variables

Create `.env.local` with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Admin Password
NEXT_PUBLIC_ADMIN_PASSWORD=xlb2024admin

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# NFL Stats API (optional - using mock data for now)
NFL_API_KEY=
NFL_API_URL=
```

### Database Setup

1. Create a new Supabase project
2. Run the schema in Supabase SQL Editor:

```bash
# Copy the SQL schema
cat db/schema.sql
```

3. Paste into Supabase SQL Editor and run

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📊 Scoring System

### PPR (Point Per Reception) Rules

**Passing:**
- Touchdown: 4 points
- Yards: 1 point per 25 yards

**Rushing:**
- Touchdown: 6 points
- Yards: 1 point per 10 yards

**Receiving:**
- Touchdown: 6 points
- Reception: 1 point (PPR)
- Yards: 1 point per 10 yards

**Kicker:**
- Field Goal: 3 points
- PAT: 1 point

**Defense:**
- Touchdown: 6 points
- Interception: 2 points
- Safety: 2 points
- Sack: 1 point

**Other:**
- Two-Point Conversion: 2 points

### Tie-Breaker Rules
1. Total points
2. Defense (DEF) points
3. Kicker (K) points

## 🎮 How to Use

### For Participants

1. Go to `/fantasy-football/submit`
2. Enter name, email, team name
3. Select 8 players:
   - 1 QB, 2 RB, 2 WR, 1 TE, 1 K, 1 DEF
   - Maximum 2 elite players (marked with ⭐)
4. Submit lineup
5. Check results at `/fantasy-football/results`

### For Admins

1. Go to `/admin` and enter password (default: `xlb2024admin`)
2. **Manage Scoring:**
   - Select week
   - Click "Sync Stats from API"
   - Click "Calculate All Scores"
   - Click "Publish Results & Notify"
3. View dashboard stats
4. Send emails to participants

## 🏗️ Project Structure

```
xlb/
├── app/
│   ├── fantasy-football/       # Public pages
│   │   ├── page.tsx           # Landing page
│   │   ├── submit/            # Lineup submission
│   │   ├── results/           # Results/leaderboards
│   │   └── rosters/           # View all rosters
│   ├── admin/                 # Admin dashboard
│   │   ├── page.tsx           # Login
│   │   ├── dashboard/         # Overview
│   │   ├── scoring/           # Scoring system
│   │   ├── players/           # Player management (WIP)
│   │   ├── lineups/           # Lineup viewer (WIP)
│   │   └── emails/            # Email system (WIP)
│   └── api/
│       └── fantasy-football/
│           └── submit-lineup/ # Lineup submission API
├── components/
│   ├── fantasy-football/      # Public components
│   │   ├── LineupForm.tsx
│   │   ├── WeeklyResults.tsx
│   │   ├── RoundResults.tsx
│   │   ├── SeasonResults.tsx
│   │   ├── RosterGrid.tsx
│   │   └── RosterList.tsx
│   └── admin/
│       └── AdminLayout.tsx    # Admin shell
├── lib/
│   ├── supabase/
│   │   └── client.ts          # Supabase setup + types
│   ├── scoring/
│   │   └── calculator.ts      # PPR scoring engine
│   └── api/
│       └── nfl-stats.ts       # NFL stats API (mock)
├── db/
│   └── schema.sql             # Database schema
└── README-FANTASY-FOOTBALL.md # This file
```

## 🗄️ Database Schema

### Tables
- **users** - Participants (name, email, team_name)
- **rounds** - Season rounds (3 rounds of 6 weeks each)
- **players** - NFL players (name, position, team, is_elite)
- **lineups** - Submitted lineups (8 position references)
- **weekly_scores** - Calculated scores per week
- **player_weekly_stats** - NFL stats (from API)
- **admin_users** - Admin credentials

### Key Features
- UUID primary keys
- Foreign key constraints with CASCADE
- Unique constraints (email, lineup per round)
- Indexes on frequently queried columns

## 🔌 API Integration

### Current Status: Mock API

The platform currently uses mock data for testing. To connect a real NFL stats API:

1. Choose an API provider:
   - **ESPN API** (free, limited)
   - **Sleeper API** (free, fantasy-focused)
   - **Yahoo Fantasy API** (requires OAuth)
   - **RapidAPI NFL Stats** (paid, reliable)
   - **SportsData.io** (paid, comprehensive)

2. Update `lib/api/nfl-stats.ts`:

```typescript
async fetchWeeklyStats(weekNumber: number): Promise<NFLPlayerStats[]> {
  const response = await fetch(`${YOUR_API_URL}/week/${weekNumber}`, {
    headers: {
      'Authorization': `Bearer ${YOUR_API_KEY}`
    }
  });

  const data = await response.json();

  // Transform API response to match NFLPlayerStats interface
  return data.map(transformApiPlayer);
}
```

3. Add API credentials to `.env.local`

## 📧 Email Notifications

### Templates (Coming Soon)
- **Lineup Confirmation** - Sent after submission
- **Weekly Scores** - Sent after scores published
- **Weekly Winner** - Congratulate $25 winner
- **Round Results** - End of round standings
- **Season Champion** - Final results

### Resend Setup

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain
3. Add API key to `.env.local`
4. Emails will be sent from `jlandziak@xlbenefits.com`

## 🎯 Prize Structure

### Weekly Prizes
- Highest scorer each week: **$25** (18 weeks = $450 total)

### Round Prizes (3 rounds)
- 1st place: **$150**
- 2nd place: **$100**
- 3rd place: **$50**
- Per round: **$300** × 3 = **$900 total**

### Season Championship
- 1st place: **$400**
- 2nd place: **$250**
- 3rd place: **$100**
- Season total: **$750**

**Grand Total: $2,100+ in prizes**

## 🔒 Security

- Simple password-based admin auth (localStorage)
- Client-side validation
- Server-side API validation
- Email-based user identification
- No payment processing (prizes handled manually)

## 🛠️ Tech Stack

- **Framework:** Next.js 15.5.4 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** Supabase (PostgreSQL)
- **Email:** Resend
- **Deployment:** Vercel (recommended)

## 📝 Current Status

### ✅ Completed
- [x] Landing page with rules and prizes
- [x] Lineup submission (3 fields + 8 positions)
- [x] Elite player restriction (max 2)
- [x] Custom player write-ins
- [x] Results page (Weekly, Round, Season)
- [x] Rosters page (Grid/List views)
- [x] Admin authentication (password-based)
- [x] Admin dashboard (stats overview)
- [x] Scoring system with API placeholder
- [x] PPR calculation engine
- [x] Database schema with all tables

### 🚧 Todo - Admin Features

**Player Management** (`/admin/players`)
- [ ] View all players in database (searchable table)
- [ ] Add new player (name, position, team, elite status)
- [ ] Edit existing player details
- [ ] Delete players (with confirmation)
- [ ] Bulk elite status updates (select multiple, mark as elite)
- [ ] CSV import for bulk player creation
- [ ] Filter by position (QB, RB, WR, TE, K, DEF)

**Lineup Management** (`/admin/lineups`)
- [ ] View all submitted lineups by round
- [ ] Search by team name or participant name
- [ ] Edit lineup on behalf of participant (one-time)
- [ ] Delete lineup (with confirmation)
- [ ] Export lineups to CSV
- [ ] View submission timestamps
- [ ] Filter by round

**Email System** (`/admin/emails`)
- [ ] Email templates:
  - Lineup confirmation (auto-sent on submission)
  - Weekly scores notification (after publishing)
  - Weekly winner announcement ($25)
  - Round results (top 3 placings)
  - Season championship results
- [ ] Resend integration setup
- [ ] Send test emails
- [ ] Send to all participants
- [ ] Send to specific round participants
- [ ] Email preview before sending
- [ ] Email history/logs
- [ ] Variable replacement ({{name}}, {{teamName}}, {{points}}, etc.)

**NFL Stats API Integration**
- [ ] Choose API provider (ESPN, Sleeper, Yahoo, RapidAPI, etc.)
- [ ] Update `lib/api/nfl-stats.ts` with real API calls
- [ ] Add API credentials to environment variables
- [ ] Test API connection
- [ ] Handle API errors gracefully
- [ ] Cache API responses to avoid rate limits
- [ ] Player name matching logic (API → Database)

**Additional Admin Features**
- [ ] Round management (create, edit, set active)
- [ ] View detailed scoring breakdown per lineup
- [ ] Export results to PDF
- [ ] Admin user management (multiple admin accounts)
- [ ] Activity log (who did what, when)
- [ ] Settings page (configure prizes, rules, etc.)

### 💡 Nice-to-Have Features

**Public Features**
- [ ] Participant profile page (view my lineups, my scores)
- [ ] Live scoring updates during games
- [ ] Mobile app (React Native)
- [ ] Push notifications for scores
- [ ] Social sharing (share results on Twitter/LinkedIn)
- [ ] Historical season data (archive old seasons)

**Analytics**
- [ ] Most picked players
- [ ] Elite player usage stats
- [ ] Average points by position
- [ ] Participant engagement metrics
- [ ] Winner streaks

**Gamification**
- [ ] Badges/achievements
- [ ] Trash talk comments section
- [ ] Weekly power rankings
- [ ] Prediction game (bonus points for guessing winners)

## 🤝 Contributing

This is a private project for XL Benefits. Contact the development team for access.

## 📄 License

Proprietary - XL Benefits

## 👥 Contact

**Admin/Support:** jlandziak@xlbenefits.com

## 🎉 Credits

Built with Claude Code for XL Benefits broker partner engagement.
