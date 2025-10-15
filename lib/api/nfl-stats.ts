import { type PlayerStats } from '../scoring/calculator';

export interface NFLPlayerStats extends PlayerStats {
  player_id: string;
  player_name: string;
  position: string;
  team: string;
}

// Mock API - Replace with real NFL stats API later
export class NFLStatsAPI {
  async fetchWeeklyStats(weekNumber: number): Promise<NFLPlayerStats[]> {
    // TODO: Replace with real API call
    // Examples: ESPN API, Sleeper API, Yahoo Fantasy API, RapidAPI NFL stats

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
    // TODO: Test real API connection
    console.log('[MOCK API] Testing connection...');
    return true;
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
