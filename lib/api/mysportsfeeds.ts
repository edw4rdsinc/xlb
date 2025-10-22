import { type PlayerStats } from '../scoring/calculator';
import { type NFLPlayerStats } from './nfl-stats';

/**
 * MySportsFeeds API Client for NFL Stats
 * Documentation: https://www.mysportsfeeds.com/data-feeds/api-docs/
 */

// MySportsFeeds API response types
interface MySportsFeedsPlayer {
  id: number;
  firstName: string;
  lastName: string;
  primaryPosition: string;
  currentTeam?: {
    abbreviation: string;
  };
}

interface MySportsFeedsStats {
  passing?: {
    passTD?: number;
    passYards?: number;
  };
  rushing?: {
    rushTD?: number;
    rushYards?: number;
  };
  receiving?: {
    recTD?: number;
    receptions?: number;
    recYards?: number;
  };
  twoPointAttempts?: {
    twoPointPassConversions?: number;
    twoPointRushConversions?: number;
    twoPointRecConversions?: number;
  };
  fieldGoals?: {
    fgMade?: number;
  };
  extraPointAttempts?: {
    xpMade?: number;
  };
  defense?: {
    defTD?: number;
    interceptions?: number;
    safeties?: number;
    sacks?: number;
  };
}

interface MySportsFeedsGameLog {
  player: MySportsFeedsPlayer;
  stats: MySportsFeedsStats;
}

interface MySportsFeedsResponse {
  gamelogs: MySportsFeedsGameLog[];
}

export class MySportsFeedsAPI {
  private baseUrl = 'https://api.mysportsfeeds.com/v2.1';
  private apiKey: string;
  private password: string;
  private currentSeason: string;

  constructor() {
    // Get credentials from environment variables
    this.apiKey = process.env.MYSPORTSFEEDS_API_KEY || '';
    this.password = process.env.MYSPORTSFEEDS_PASSWORD || '';

    // Current NFL season (adjust as needed - format: YYYY-YYYY-regular)
    // For October 2025, we're in the 2024-2025 season
    this.currentSeason = '2024-2025-regular';

    if (!this.apiKey || !this.password) {
      console.warn('[MySportsFeeds] API credentials not configured in environment variables');
    }
  }

  /**
   * Fetch weekly stats for all players
   */
  async fetchWeeklyStats(weekNumber: number): Promise<NFLPlayerStats[]> {
    try {
      console.log(`[MySportsFeeds] Fetching stats for Week ${weekNumber}...`);

      const url = `${this.baseUrl}/pull/nfl/${this.currentSeason}/week/${weekNumber}/player_gamelogs.json`;

      const response = await fetch(url, {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${this.apiKey}:${this.password}`).toString('base64'),
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`MySportsFeeds API error (${response.status}): ${errorText}`);
      }

      const data: MySportsFeedsResponse = await response.json();

      if (!data.gamelogs || data.gamelogs.length === 0) {
        console.warn(`[MySportsFeeds] No stats found for Week ${weekNumber}`);
        return [];
      }

      // Transform MySportsFeeds format to our NFLPlayerStats format
      const stats = data.gamelogs.map(gamelog => this.transformGameLog(gamelog));

      console.log(`[MySportsFeeds] Successfully fetched ${stats.length} player stats`);
      return stats;

    } catch (error) {
      console.error('[MySportsFeeds] Error fetching stats:', error);
      throw error;
    }
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      console.log('[MySportsFeeds] Testing API connection...');

      // Try to fetch a simple endpoint (players list with limit 1)
      const url = `${this.baseUrl}/pull/nfl/players.json?limit=1`;

      const response = await fetch(url, {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${this.apiKey}:${this.password}`).toString('base64'),
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        console.log('[MySportsFeeds] ✅ Connection successful');
        return true;
      } else {
        const errorText = await response.text();
        console.error(`[MySportsFeeds] ❌ Connection failed (${response.status}): ${errorText}`);
        return false;
      }

    } catch (error) {
      console.error('[MySportsFeeds] ❌ Connection error:', error);
      return false;
    }
  }

  /**
   * Transform MySportsFeeds game log to our NFLPlayerStats format
   */
  private transformGameLog(gamelog: MySportsFeedsGameLog): NFLPlayerStats {
    const { player, stats } = gamelog;

    // Build player name
    const playerName = `${player.firstName} ${player.lastName}`;

    // Map position (MySportsFeeds uses different position codes sometimes)
    const position = this.normalizePosition(player.primaryPosition);

    // Get team abbreviation
    const team = player.currentTeam?.abbreviation || '';

    // Calculate two-point conversions (sum of all types)
    const twoPointConversions = (
      (stats.twoPointAttempts?.twoPointPassConversions || 0) +
      (stats.twoPointAttempts?.twoPointRushConversions || 0) +
      (stats.twoPointAttempts?.twoPointRecConversions || 0)
    );

    return {
      player_id: player.id.toString(),
      player_name: playerName,
      position,
      team,

      // Passing stats
      passing_tds: stats.passing?.passTD || 0,
      passing_yards: stats.passing?.passYards || 0,

      // Rushing stats
      rushing_tds: stats.rushing?.rushTD || 0,
      rushing_yards: stats.rushing?.rushYards || 0,

      // Receiving stats
      receiving_tds: stats.receiving?.recTD || 0,
      receptions: stats.receiving?.receptions || 0,
      receiving_yards: stats.receiving?.recYards || 0,

      // Two-point conversions
      two_point_conversions: twoPointConversions,

      // Kicker stats
      field_goals: stats.fieldGoals?.fgMade || 0,
      pats: stats.extraPointAttempts?.xpMade || 0,

      // Defense stats
      def_tds: stats.defense?.defTD || 0,
      interceptions: stats.defense?.interceptions || 0,
      safeties: stats.defense?.safeties || 0,
      sacks: stats.defense?.sacks || 0,
    };
  }

  /**
   * Normalize position codes to match our database
   */
  private normalizePosition(position: string): string {
    const positionMap: Record<string, string> = {
      'QB': 'QB',
      'RB': 'RB',
      'WR': 'WR',
      'TE': 'TE',
      'K': 'K',
      'PK': 'K',  // Place Kicker -> K
      'DEF': 'DEF',
      'D/ST': 'DEF', // Defense/Special Teams -> DEF
    };

    return positionMap[position] || position;
  }

  /**
   * Update the current season (useful for multi-year support)
   */
  setSeason(season: string): void {
    this.currentSeason = season;
    console.log(`[MySportsFeeds] Season set to: ${season}`);
  }
}

// Export singleton instance
export const mysportsfeedsAPI = new MySportsFeedsAPI();
