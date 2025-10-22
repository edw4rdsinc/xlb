import { type PlayerStats } from '../scoring/calculator';
import { mysportsfeedsAPI } from './mysportsfeeds';

export interface NFLPlayerStats extends PlayerStats {
  player_id: string;
  player_name: string;
  position: string;
  team: string;
}

// Mock API - Fallback for testing when MySportsFeeds is unavailable
class MockNFLStatsAPI {
  async fetchWeeklyStats(weekNumber: number): Promise<NFLPlayerStats[]> {
    console.log(`[MOCK API] Fetching stats for week ${weekNumber}`);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return mock data for testing
    return [
      {
        player_id: 'mock-mahomes',
        player_name: 'Patrick Mahomes',
        position: 'QB',
        team: 'KC',
        passing_tds: 3,
        passing_yards: 320,
        rushing_yards: 15,
      },
      {
        player_id: 'mock-mccaffrey',
        player_name: 'Christian McCaffrey',
        position: 'RB',
        team: 'SF',
        rushing_tds: 2,
        rushing_yards: 125,
        receptions: 6,
        receiving_yards: 45,
      },
      {
        player_id: 'mock-hill',
        player_name: 'Tyreek Hill',
        position: 'WR',
        team: 'MIA',
        receiving_tds: 1,
        receptions: 8,
        receiving_yards: 110,
      },
      {
        player_id: 'mock-kelce',
        player_name: 'Travis Kelce',
        position: 'TE',
        team: 'KC',
        receiving_tds: 1,
        receptions: 7,
        receiving_yards: 85,
      },
      {
        player_id: 'mock-tucker',
        player_name: 'Justin Tucker',
        position: 'K',
        team: 'BAL',
        field_goals: 3,
        pats: 4,
      },
      {
        player_id: 'mock-49ers-def',
        player_name: 'San Francisco 49ers',
        position: 'DEF',
        team: 'SF',
        def_tds: 1,
        interceptions: 2,
        sacks: 4,
      },
    ];
  }

  async testConnection(): Promise<boolean> {
    console.log('[MOCK API] Testing connection...');
    return true;
  }
}

// NFL Stats API - Uses MySportsFeeds (real API) or Mock API (fallback)
export class NFLStatsAPI {
  private useMock: boolean;
  private mockAPI: MockNFLStatsAPI;

  constructor() {
    // Use mock API if MySportsFeeds credentials aren't configured
    const hasCredentials = process.env.MYSPORTSFEEDS_API_KEY && process.env.MYSPORTSFEEDS_PASSWORD;
    this.useMock = !hasCredentials;
    this.mockAPI = new MockNFLStatsAPI();

    if (this.useMock) {
      console.warn('[NFL Stats API] MySportsFeeds credentials not found - using MOCK API');
    } else {
      console.log('[NFL Stats API] Using MySportsFeeds API');
    }
  }

  async fetchWeeklyStats(weekNumber: number): Promise<NFLPlayerStats[]> {
    if (this.useMock) {
      return this.mockAPI.fetchWeeklyStats(weekNumber);
    }

    try {
      return await mysportsfeedsAPI.fetchWeeklyStats(weekNumber);
    } catch (error) {
      console.error('[NFL Stats API] MySportsFeeds failed, falling back to mock API:', error);
      return this.mockAPI.fetchWeeklyStats(weekNumber);
    }
  }

  async testConnection(): Promise<boolean> {
    if (this.useMock) {
      return this.mockAPI.testConnection();
    }

    return await mysportsfeedsAPI.testConnection();
  }

  /**
   * Check which API is currently in use
   */
  getAPIStatus(): { provider: string; isConfigured: boolean } {
    return {
      provider: this.useMock ? 'Mock API' : 'MySportsFeeds',
      isConfigured: !this.useMock,
    };
  }
}

export const nflStatsAPI = new NFLStatsAPI();

// Helper to match API players with database players
export function matchPlayerToDatabase(
  apiPlayer: NFLPlayerStats,
  dbPlayers: any[]
): string | null {
  // Try exact name match first
  let match = dbPlayers.find(p =>
    p.name.toLowerCase() === apiPlayer.player_name.toLowerCase() &&
    p.position === apiPlayer.position
  );

  if (match) return match.id;

  // Try team + position match
  match = dbPlayers.find(p =>
    p.team === apiPlayer.team &&
    p.position === apiPlayer.position
  );

  return match?.id || null;
}
