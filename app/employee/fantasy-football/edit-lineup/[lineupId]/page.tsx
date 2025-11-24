'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { PlayerAutocomplete } from '@/components/employee/PlayerAutocomplete';

interface DraftPlayer {
  id: string;
  name: string;
  team: string;
  position: string;
  rank: number;
  totalPoints: number;
  isElite: boolean;
}

interface LineupData {
  qb: string;
  rb1: string;
  rb2: string;
  wr1: string;
  wr2: string;
  te: string;
  k: string;
  def: string;
}

interface LineupInfo {
  id: string;
  user_id: string;
  round_id: string;
  is_locked: boolean;
  users: {
    name: string;
    team_name: string;
    email: string;
  };
  rounds: {
    round_number: number;
    start_week: number;
    end_week: number;
  };
}

export default function AdminEditLineupPage({ params }: { params: Promise<{ lineupId: string }> }) {
  const [lineupId, setLineupId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lineupInfo, setLineupInfo] = useState<LineupInfo | null>(null);
  const [draftPool, setDraftPool] = useState<Record<string, DraftPlayer[]>>({});
  const [lineup, setLineup] = useState<LineupData>({
    qb: '',
    rb1: '',
    rb2: '',
    wr1: '',
    wr2: '',
    te: '',
    k: '',
    def: '',
  });
  // Store player names for autocomplete display
  const [playerNames, setPlayerNames] = useState<LineupData>({
    qb: '',
    rb1: '',
    rb2: '',
    wr1: '',
    wr2: '',
    te: '',
    k: '',
    def: '',
  });
  const router = useRouter();

  useEffect(() => {
    params.then(p => {
      setLineupId(p.lineupId);
    });
  }, [params]);

  useEffect(() => {
    if (lineupId) {
      loadLineup();
    }
  }, [lineupId]);

  // Update player names when lineup or draft pool changes
  useEffect(() => {
    if (Object.keys(draftPool).length === 0) return;

    const newNames: LineupData = { qb: '', rb1: '', rb2: '', wr1: '', wr2: '', te: '', k: '', def: '' };

    for (const [pos, playerId] of Object.entries(lineup)) {
      if (!playerId) continue;
      const poolKey = pos === 'rb1' || pos === 'rb2' ? 'RB' :
                      pos === 'wr1' || pos === 'wr2' ? 'WR' :
                      pos.toUpperCase();
      const players = draftPool[poolKey] || [];
      const player = players.find(p => p.id === playerId);
      if (player) {
        newNames[pos as keyof LineupData] = player.name;
      }
    }

    setPlayerNames(newNames);
  }, [lineup, draftPool]);

  async function loadLineup() {
    try {
      setLoading(true);

      // Get lineup data - using correct column names with _id suffix
      const { data: lineupData, error: lineupError } = await supabase
        .from('lineups')
        .select(`
          id,
          user_id,
          round_id,
          is_locked,
          qb_id,
          rb1_id,
          rb2_id,
          wr1_id,
          wr2_id,
          te_id,
          k_id,
          def_id,
          users!inner(name, team_name, email),
          rounds!inner(round_number, start_week, end_week)
        `)
        .eq('id', lineupId)
        .single();

      if (lineupError) throw lineupError;

      setLineupInfo(lineupData);
      setLineup({
        qb: lineupData.qb_id || '',
        rb1: lineupData.rb1_id || '',
        rb2: lineupData.rb2_id || '',
        wr1: lineupData.wr1_id || '',
        wr2: lineupData.wr2_id || '',
        te: lineupData.te_id || '',
        k: lineupData.k_id || '',
        def: lineupData.def_id || '',
      });

      // Load draft pool for the round
      await loadDraftPool(lineupData.round_id);
    } catch (err: any) {
      console.error('Error loading lineup:', err);
      setError(err.message || 'Failed to load lineup');
    } finally {
      setLoading(false);
    }
  }

  async function loadDraftPool(roundId: string) {
    try {
      console.log('Loading draft pool for round:', roundId);

      // First, try to fetch from draft_pools table
      const { data: draftPoolData, error: draftError } = await supabase
        .from('draft_pools')
        .select(`
          *,
          players!inner(name, team)
        `)
        .eq('round_id', roundId)
        .order('position')
        .order('rank');

      // If draft_pools doesn't exist or is empty, load directly from players table
      let playersData = [];
      if (draftError || !draftPoolData || draftPoolData.length === 0) {
        console.log('Draft pool empty or error, loading all players instead');

        // Load all players directly
        const { data: allPlayers, error: playersError } = await supabase
          .from('players')
          .select('*')
          .in('position', ['QB', 'RB', 'WR', 'TE'])
          .order('position')
          .order('season_rank');

        if (playersError) {
          console.error('Error loading players:', playersError);
        } else {
          playersData = allPlayers || [];
        }
      }

      // Group by position
      const byPosition: Record<string, DraftPlayer[]> = {
        QB: [],
        RB: [],
        WR: [],
        TE: [],
        K: [],
        DEF: [],
      };

      // Process draft pool data if available
      if (draftPoolData && draftPoolData.length > 0) {
        for (const entry of draftPoolData) {
          const player = entry.players as any;
          if (byPosition[entry.position]) {
            byPosition[entry.position].push({
              id: entry.player_id,
              name: player.name,
              team: player.team,
              position: entry.position,
              rank: entry.rank,
              totalPoints: entry.total_points || 0,
              isElite: entry.is_elite || false,
            });
          }
        }
      }
      // Otherwise use players data directly
      else if (playersData.length > 0) {
        for (const player of playersData) {
          if (byPosition[player.position]) {
            // Take top 40 players per position
            if (byPosition[player.position].length < 40) {
              byPosition[player.position].push({
                id: player.id,
                name: player.name,
                team: player.team,
                position: player.position,
                rank: player.season_rank || byPosition[player.position].length + 1,
                totalPoints: player.season_points || 0,
                isElite: player.season_rank <= 3, // Top 3 at each position are elite
              });
            }
          }
        }
      }

      // If still no QB data, add default players for all positions
      if (byPosition.QB.length === 0) {
        console.log('No player data found, using default players');

        byPosition.QB = [
          { id: 'qb1', name: 'Patrick Mahomes', team: 'KC', position: 'QB', rank: 1, totalPoints: 380, isElite: true },
          { id: 'qb2', name: 'Josh Allen', team: 'BUF', position: 'QB', rank: 2, totalPoints: 370, isElite: true },
          { id: 'qb3', name: 'Jalen Hurts', team: 'PHI', position: 'QB', rank: 3, totalPoints: 360, isElite: true },
          { id: 'qb4', name: 'Lamar Jackson', team: 'BAL', position: 'QB', rank: 4, totalPoints: 350, isElite: false },
          { id: 'qb5', name: 'Dak Prescott', team: 'DAL', position: 'QB', rank: 5, totalPoints: 340, isElite: false },
          { id: 'qb6', name: 'Joe Burrow', team: 'CIN', position: 'QB', rank: 6, totalPoints: 330, isElite: false },
          { id: 'qb7', name: 'Justin Herbert', team: 'LAC', position: 'QB', rank: 7, totalPoints: 320, isElite: false },
          { id: 'qb8', name: 'Tua Tagovailoa', team: 'MIA', position: 'QB', rank: 8, totalPoints: 310, isElite: false },
          { id: 'qb9', name: 'Trevor Lawrence', team: 'JAX', position: 'QB', rank: 9, totalPoints: 300, isElite: false },
          { id: 'qb10', name: 'Justin Fields', team: 'CHI', position: 'QB', rank: 10, totalPoints: 290, isElite: false },
          { id: 'qb11', name: 'Kirk Cousins', team: 'MIN', position: 'QB', rank: 11, totalPoints: 280, isElite: false },
          { id: 'qb12', name: 'Geno Smith', team: 'SEA', position: 'QB', rank: 12, totalPoints: 270, isElite: false },
          { id: 'qb13', name: 'Daniel Jones', team: 'NYG', position: 'QB', rank: 13, totalPoints: 260, isElite: false },
          { id: 'qb14', name: 'Jared Goff', team: 'DET', position: 'QB', rank: 14, totalPoints: 250, isElite: false },
          { id: 'qb15', name: 'Aaron Rodgers', team: 'GB', position: 'QB', rank: 15, totalPoints: 240, isElite: false },
          { id: 'qb16', name: 'Russell Wilson', team: 'DEN', position: 'QB', rank: 16, totalPoints: 230, isElite: false },
          { id: 'qb17', name: 'Derek Carr', team: 'LV', position: 'QB', rank: 17, totalPoints: 220, isElite: false },
          { id: 'qb18', name: 'Mac Jones', team: 'NE', position: 'QB', rank: 18, totalPoints: 210, isElite: false },
          { id: 'qb19', name: 'Ryan Tannehill', team: 'TEN', position: 'QB', rank: 19, totalPoints: 200, isElite: false },
          { id: 'qb20', name: 'Matt Stafford', team: 'LAR', position: 'QB', rank: 20, totalPoints: 190, isElite: false },
          { id: 'qb21', name: 'Kenny Pickett', team: 'PIT', position: 'QB', rank: 21, totalPoints: 180, isElite: false },
          { id: 'qb22', name: 'Deshaun Watson', team: 'CLE', position: 'QB', rank: 22, totalPoints: 170, isElite: false },
          { id: 'qb23', name: 'Jimmy Garoppolo', team: 'SF', position: 'QB', rank: 23, totalPoints: 160, isElite: false },
          { id: 'qb24', name: 'Baker Mayfield', team: 'TB', position: 'QB', rank: 24, totalPoints: 150, isElite: false },
          { id: 'qb25', name: 'Sam Howell', team: 'WAS', position: 'QB', rank: 25, totalPoints: 140, isElite: false },
          { id: 'qb26', name: 'Bryce Young', team: 'CAR', position: 'QB', rank: 26, totalPoints: 130, isElite: false },
          { id: 'qb27', name: 'C.J. Stroud', team: 'HOU', position: 'QB', rank: 27, totalPoints: 120, isElite: false },
          { id: 'qb28', name: 'Anthony Richardson', team: 'IND', position: 'QB', rank: 28, totalPoints: 110, isElite: false },
          { id: 'qb29', name: 'Will Levis', team: 'TEN', position: 'QB', rank: 29, totalPoints: 100, isElite: false },
          { id: 'qb30', name: 'Jordan Love', team: 'GB', position: 'QB', rank: 30, totalPoints: 90, isElite: false },
          { id: 'qb31', name: 'Desmond Ridder', team: 'ATL', position: 'QB', rank: 31, totalPoints: 80, isElite: false },
          { id: 'qb32', name: 'Zach Wilson', team: 'NYJ', position: 'QB', rank: 32, totalPoints: 70, isElite: false },
          { id: 'qb33', name: 'Kyler Murray', team: 'ARI', position: 'QB', rank: 33, totalPoints: 60, isElite: false },
          { id: 'qb34', name: 'Matthew Stafford', team: 'LAR', position: 'QB', rank: 34, totalPoints: 50, isElite: false },
          { id: 'qb35', name: 'Tyler Huntley', team: 'BAL', position: 'QB', rank: 35, totalPoints: 40, isElite: false },
          { id: 'qb36', name: 'Marcus Mariota', team: 'ATL', position: 'QB', rank: 36, totalPoints: 30, isElite: false },
          { id: 'qb37', name: 'Andy Dalton', team: 'NO', position: 'QB', rank: 37, totalPoints: 20, isElite: false },
          { id: 'qb38', name: 'Gardner Minshew', team: 'IND', position: 'QB', rank: 38, totalPoints: 10, isElite: false },
          { id: 'qb39', name: 'Teddy Bridgewater', team: 'MIA', position: 'QB', rank: 39, totalPoints: 5, isElite: false },
          { id: 'qb40', name: 'Jacoby Brissett', team: 'WAS', position: 'QB', rank: 40, totalPoints: 0, isElite: false },
        ];

        byPosition.RB = [
          { id: 'rb1', name: 'Christian McCaffrey', team: 'SF', position: 'RB', rank: 1, totalPoints: 320, isElite: true },
          { id: 'rb2', name: 'Austin Ekeler', team: 'LAC', position: 'RB', rank: 2, totalPoints: 310, isElite: true },
          { id: 'rb3', name: 'Saquon Barkley', team: 'NYG', position: 'RB', rank: 3, totalPoints: 300, isElite: true },
          { id: 'rb4', name: 'Tony Pollard', team: 'DAL', position: 'RB', rank: 4, totalPoints: 290, isElite: false },
          { id: 'rb5', name: 'Josh Jacobs', team: 'LV', position: 'RB', rank: 5, totalPoints: 280, isElite: false },
          { id: 'rb6', name: 'Derrick Henry', team: 'TEN', position: 'RB', rank: 6, totalPoints: 270, isElite: false },
          { id: 'rb7', name: 'Nick Chubb', team: 'CLE', position: 'RB', rank: 7, totalPoints: 260, isElite: false },
          { id: 'rb8', name: 'Jonathan Taylor', team: 'IND', position: 'RB', rank: 8, totalPoints: 250, isElite: false },
          { id: 'rb9', name: 'Bijan Robinson', team: 'ATL', position: 'RB', rank: 9, totalPoints: 240, isElite: false },
          { id: 'rb10', name: 'Jahmyr Gibbs', team: 'DET', position: 'RB', rank: 10, totalPoints: 230, isElite: false },
          { id: 'rb11', name: 'Travis Etienne', team: 'JAX', position: 'RB', rank: 11, totalPoints: 220, isElite: false },
          { id: 'rb12', name: 'Breece Hall', team: 'NYJ', position: 'RB', rank: 12, totalPoints: 210, isElite: false },
          { id: 'rb13', name: 'Kenneth Walker', team: 'SEA', position: 'RB', rank: 13, totalPoints: 200, isElite: false },
          { id: 'rb14', name: 'Najee Harris', team: 'PIT', position: 'RB', rank: 14, totalPoints: 190, isElite: false },
          { id: 'rb15', name: 'Joe Mixon', team: 'CIN', position: 'RB', rank: 15, totalPoints: 180, isElite: false },
          { id: 'rb16', name: 'Aaron Jones', team: 'GB', position: 'RB', rank: 16, totalPoints: 170, isElite: false },
          { id: 'rb17', name: 'Rhamondre Stevenson', team: 'NE', position: 'RB', rank: 17, totalPoints: 160, isElite: false },
          { id: 'rb18', name: 'Miles Sanders', team: 'CAR', position: 'RB', rank: 18, totalPoints: 150, isElite: false },
          { id: 'rb19', name: 'Alexander Mattison', team: 'MIN', position: 'RB', rank: 19, totalPoints: 140, isElite: false },
          { id: 'rb20', name: 'Dameon Pierce', team: 'HOU', position: 'RB', rank: 20, totalPoints: 130, isElite: false },
          { id: 'rb21', name: 'James Conner', team: 'ARI', position: 'RB', rank: 21, totalPoints: 120, isElite: false },
          { id: 'rb22', name: 'Rachaad White', team: 'TB', position: 'RB', rank: 22, totalPoints: 110, isElite: false },
          { id: 'rb23', name: 'Javonte Williams', team: 'DEN', position: 'RB', rank: 23, totalPoints: 100, isElite: false },
          { id: 'rb24', name: 'Isiah Pacheco', team: 'KC', position: 'RB', rank: 24, totalPoints: 90, isElite: false },
          { id: 'rb25', name: 'Brian Robinson', team: 'WAS', position: 'RB', rank: 25, totalPoints: 80, isElite: false },
          { id: 'rb26', name: 'Zack Moss', team: 'IND', position: 'RB', rank: 26, totalPoints: 70, isElite: false },
          { id: 'rb27', name: 'Devon Achane', team: 'MIA', position: 'RB', rank: 27, totalPoints: 60, isElite: false },
          { id: 'rb28', name: 'Jaylen Warren', team: 'PIT', position: 'RB', rank: 28, totalPoints: 50, isElite: false },
          { id: 'rb29', name: 'Roschon Johnson', team: 'CHI', position: 'RB', rank: 29, totalPoints: 40, isElite: false },
          { id: 'rb30', name: 'Chuba Hubbard', team: 'CAR', position: 'RB', rank: 30, totalPoints: 30, isElite: false },
          { id: 'rb31', name: 'Zach Charbonnet', team: 'SEA', position: 'RB', rank: 31, totalPoints: 20, isElite: false },
          { id: 'rb32', name: 'Tyjae Spears', team: 'TEN', position: 'RB', rank: 32, totalPoints: 10, isElite: false },
          { id: 'rb33', name: 'Tank Bigsby', team: 'JAX', position: 'RB', rank: 33, totalPoints: 0, isElite: false },
          { id: 'rb34', name: 'Kendre Miller', team: 'NO', position: 'RB', rank: 34, totalPoints: 0, isElite: false },
          { id: 'rb35', name: 'De\'Von Achane', team: 'MIA', position: 'RB', rank: 35, totalPoints: 0, isElite: false },
          { id: 'rb36', name: 'Elijah Mitchell', team: 'SF', position: 'RB', rank: 36, totalPoints: 0, isElite: false },
          { id: 'rb37', name: 'Samaje Perine', team: 'DEN', position: 'RB', rank: 37, totalPoints: 0, isElite: false },
          { id: 'rb38', name: 'Khalil Herbert', team: 'CHI', position: 'RB', rank: 38, totalPoints: 0, isElite: false },
          { id: 'rb39', name: 'Antonio Gibson', team: 'WAS', position: 'RB', rank: 39, totalPoints: 0, isElite: false },
          { id: 'rb40', name: 'Cam Akers', team: 'LAR', position: 'RB', rank: 40, totalPoints: 0, isElite: false },
        ];

        byPosition.WR = [
          { id: 'wr1', name: 'Tyreek Hill', team: 'MIA', position: 'WR', rank: 1, totalPoints: 330, isElite: true },
          { id: 'wr2', name: 'Stefon Diggs', team: 'BUF', position: 'WR', rank: 2, totalPoints: 320, isElite: true },
          { id: 'wr3', name: 'Justin Jefferson', team: 'MIN', position: 'WR', rank: 3, totalPoints: 310, isElite: true },
          { id: 'wr4', name: 'CeeDee Lamb', team: 'DAL', position: 'WR', rank: 4, totalPoints: 300, isElite: false },
          { id: 'wr5', name: 'A.J. Brown', team: 'PHI', position: 'WR', rank: 5, totalPoints: 290, isElite: false },
          { id: 'wr6', name: 'Davante Adams', team: 'LV', position: 'WR', rank: 6, totalPoints: 280, isElite: false },
          { id: 'wr7', name: 'Amon-Ra St. Brown', team: 'DET', position: 'WR', rank: 7, totalPoints: 270, isElite: false },
          { id: 'wr8', name: 'DK Metcalf', team: 'SEA', position: 'WR', rank: 8, totalPoints: 260, isElite: false },
          { id: 'wr9', name: 'Cooper Kupp', team: 'LAR', position: 'WR', rank: 9, totalPoints: 250, isElite: false },
          { id: 'wr10', name: 'Jaylen Waddle', team: 'MIA', position: 'WR', rank: 10, totalPoints: 240, isElite: false },
          { id: 'wr11', name: 'Chris Olave', team: 'NO', position: 'WR', rank: 11, totalPoints: 230, isElite: false },
          { id: 'wr12', name: 'DeVonta Smith', team: 'PHI', position: 'WR', rank: 12, totalPoints: 220, isElite: false },
          { id: 'wr13', name: 'Amari Cooper', team: 'CLE', position: 'WR', rank: 13, totalPoints: 210, isElite: false },
          { id: 'wr14', name: 'Keenan Allen', team: 'LAC', position: 'WR', rank: 14, totalPoints: 200, isElite: false },
          { id: 'wr15', name: 'Calvin Ridley', team: 'JAX', position: 'WR', rank: 15, totalPoints: 190, isElite: false },
          { id: 'wr16', name: 'Terry McLaurin', team: 'WAS', position: 'WR', rank: 16, totalPoints: 180, isElite: false },
          { id: 'wr17', name: 'Mike Evans', team: 'TB', position: 'WR', rank: 17, totalPoints: 170, isElite: false },
          { id: 'wr18', name: 'DJ Moore', team: 'CHI', position: 'WR', rank: 18, totalPoints: 160, isElite: false },
          { id: 'wr19', name: 'Marquise Brown', team: 'ARI', position: 'WR', rank: 19, totalPoints: 150, isElite: false },
          { id: 'wr20', name: 'DeAndre Hopkins', team: 'TEN', position: 'WR', rank: 20, totalPoints: 140, isElite: false },
          { id: 'wr21', name: 'Christian Watson', team: 'GB', position: 'WR', rank: 21, totalPoints: 130, isElite: false },
          { id: 'wr22', name: 'Tyler Lockett', team: 'SEA', position: 'WR', rank: 22, totalPoints: 120, isElite: false },
          { id: 'wr23', name: 'Mike Williams', team: 'LAC', position: 'WR', rank: 23, totalPoints: 110, isElite: false },
          { id: 'wr24', name: 'Chris Godwin', team: 'TB', position: 'WR', rank: 24, totalPoints: 100, isElite: false },
          { id: 'wr25', name: 'Brandon Aiyuk', team: 'SF', position: 'WR', rank: 25, totalPoints: 90, isElite: false },
          { id: 'wr26', name: 'Diontae Johnson', team: 'PIT', position: 'WR', rank: 26, totalPoints: 80, isElite: false },
          { id: 'wr27', name: 'George Pickens', team: 'PIT', position: 'WR', rank: 27, totalPoints: 70, isElite: false },
          { id: 'wr28', name: 'Michael Pittman', team: 'IND', position: 'WR', rank: 28, totalPoints: 60, isElite: false },
          { id: 'wr29', name: 'Gabe Davis', team: 'BUF', position: 'WR', rank: 29, totalPoints: 50, isElite: false },
          { id: 'wr30', name: 'Jordan Addison', team: 'MIN', position: 'WR', rank: 30, totalPoints: 40, isElite: false },
          { id: 'wr31', name: 'Jaxon Smith-Njigba', team: 'SEA', position: 'WR', rank: 31, totalPoints: 30, isElite: false },
          { id: 'wr32', name: 'Quentin Johnston', team: 'LAC', position: 'WR', rank: 32, totalPoints: 20, isElite: false },
          { id: 'wr33', name: 'Zay Flowers', team: 'BAL', position: 'WR', rank: 33, totalPoints: 10, isElite: false },
          { id: 'wr34', name: 'Jonathan Mingo', team: 'CAR', position: 'WR', rank: 34, totalPoints: 0, isElite: false },
          { id: 'wr35', name: 'Courtland Sutton', team: 'DEN', position: 'WR', rank: 35, totalPoints: 0, isElite: false },
          { id: 'wr36', name: 'Jahan Dotson', team: 'WAS', position: 'WR', rank: 36, totalPoints: 0, isElite: false },
          { id: 'wr37', name: 'Rashod Bateman', team: 'BAL', position: 'WR', rank: 37, totalPoints: 0, isElite: false },
          { id: 'wr38', name: 'Jakobi Meyers', team: 'LV', position: 'WR', rank: 38, totalPoints: 0, isElite: false },
          { id: 'wr39', name: 'Elijah Moore', team: 'CLE', position: 'WR', rank: 39, totalPoints: 0, isElite: false },
          { id: 'wr40', name: 'Rondale Moore', team: 'ARI', position: 'WR', rank: 40, totalPoints: 0, isElite: false },
        ];

        byPosition.TE = [
          { id: 'te1', name: 'Travis Kelce', team: 'KC', position: 'TE', rank: 1, totalPoints: 280, isElite: true },
          { id: 'te2', name: 'T.J. Hockenson', team: 'MIN', position: 'TE', rank: 2, totalPoints: 220, isElite: true },
          { id: 'te3', name: 'Mark Andrews', team: 'BAL', position: 'TE', rank: 3, totalPoints: 210, isElite: true },
          { id: 'te4', name: 'George Kittle', team: 'SF', position: 'TE', rank: 4, totalPoints: 200, isElite: false },
          { id: 'te5', name: 'Dallas Goedert', team: 'PHI', position: 'TE', rank: 5, totalPoints: 190, isElite: false },
          { id: 'te6', name: 'Kyle Pitts', team: 'ATL', position: 'TE', rank: 6, totalPoints: 180, isElite: false },
          { id: 'te7', name: 'Darren Waller', team: 'NYG', position: 'TE', rank: 7, totalPoints: 170, isElite: false },
          { id: 'te8', name: 'Evan Engram', team: 'JAX', position: 'TE', rank: 8, totalPoints: 160, isElite: false },
          { id: 'te9', name: 'Pat Freiermuth', team: 'PIT', position: 'TE', rank: 9, totalPoints: 150, isElite: false },
          { id: 'te10', name: 'David Njoku', team: 'CLE', position: 'TE', rank: 10, totalPoints: 140, isElite: false },
          { id: 'te11', name: 'Tyler Higbee', team: 'LAR', position: 'TE', rank: 11, totalPoints: 130, isElite: false },
          { id: 'te12', name: 'Chigoziem Okonkwo', team: 'TEN', position: 'TE', rank: 12, totalPoints: 120, isElite: false },
          { id: 'te13', name: 'Cole Kmet', team: 'CHI', position: 'TE', rank: 13, totalPoints: 110, isElite: false },
          { id: 'te14', name: 'Greg Dulcich', team: 'DEN', position: 'TE', rank: 14, totalPoints: 100, isElite: false },
          { id: 'te15', name: 'Gerald Everett', team: 'LAC', position: 'TE', rank: 15, totalPoints: 90, isElite: false },
          { id: 'te16', name: 'Juwan Johnson', team: 'NO', position: 'TE', rank: 16, totalPoints: 80, isElite: false },
          { id: 'te17', name: 'Sam LaPorta', team: 'DET', position: 'TE', rank: 17, totalPoints: 70, isElite: false },
          { id: 'te18', name: 'Dalton Schultz', team: 'HOU', position: 'TE', rank: 18, totalPoints: 60, isElite: false },
          { id: 'te19', name: 'Michael Mayer', team: 'LV', position: 'TE', rank: 19, totalPoints: 50, isElite: false },
          { id: 'te20', name: 'Luke Musgrave', team: 'GB', position: 'TE', rank: 20, totalPoints: 40, isElite: false },
          { id: 'te21', name: 'Dalton Kincaid', team: 'BUF', position: 'TE', rank: 21, totalPoints: 30, isElite: false },
          { id: 'te22', name: 'Hunter Henry', team: 'NE', position: 'TE', rank: 22, totalPoints: 20, isElite: false },
          { id: 'te23', name: 'Hayden Hurst', team: 'CAR', position: 'TE', rank: 23, totalPoints: 10, isElite: false },
          { id: 'te24', name: 'Zach Ertz', team: 'ARI', position: 'TE', rank: 24, totalPoints: 0, isElite: false },
          { id: 'te25', name: 'Mike Gesicki', team: 'NE', position: 'TE', rank: 25, totalPoints: 0, isElite: false },
          { id: 'te26', name: 'Dawson Knox', team: 'BUF', position: 'TE', rank: 26, totalPoints: 0, isElite: false },
          { id: 'te27', name: 'Trey McBride', team: 'ARI', position: 'TE', rank: 27, totalPoints: 0, isElite: false },
          { id: 'te28', name: 'Noah Fant', team: 'SEA', position: 'TE', rank: 28, totalPoints: 0, isElite: false },
          { id: 'te29', name: 'Cade Otton', team: 'TB', position: 'TE', rank: 29, totalPoints: 0, isElite: false },
          { id: 'te30', name: 'Taysom Hill', team: 'NO', position: 'TE', rank: 30, totalPoints: 0, isElite: false },
          { id: 'te31', name: 'Irv Smith Jr.', team: 'CIN', position: 'TE', rank: 31, totalPoints: 0, isElite: false },
          { id: 'te32', name: 'Durham Smythe', team: 'MIA', position: 'TE', rank: 32, totalPoints: 0, isElite: false },
          { id: 'te33', name: 'Isaiah Likely', team: 'BAL', position: 'TE', rank: 33, totalPoints: 0, isElite: false },
          { id: 'te34', name: 'Tyler Conklin', team: 'NYJ', position: 'TE', rank: 34, totalPoints: 0, isElite: false },
          { id: 'te35', name: 'Kylen Granson', team: 'IND', position: 'TE', rank: 35, totalPoints: 0, isElite: false },
          { id: 'te36', name: 'Will Dissly', team: 'SEA', position: 'TE', rank: 36, totalPoints: 0, isElite: false },
          { id: 'te37', name: 'Logan Thomas', team: 'WAS', position: 'TE', rank: 37, totalPoints: 0, isElite: false },
          { id: 'te38', name: 'Jonnu Smith', team: 'ATL', position: 'TE', rank: 38, totalPoints: 0, isElite: false },
          { id: 'te39', name: 'Jelani Woods', team: 'IND', position: 'TE', rank: 39, totalPoints: 0, isElite: false },
          { id: 'te40', name: 'Austin Hooper', team: 'LV', position: 'TE', rank: 40, totalPoints: 0, isElite: false },
        ];
      }

      // Always add kickers
      if (byPosition.K.length === 0) {
        byPosition.K = [
          { id: 'k1', name: 'Justin Tucker', team: 'BAL', position: 'K', rank: 1, totalPoints: 150, isElite: false },
          { id: 'k2', name: 'Harrison Butker', team: 'KC', position: 'K', rank: 2, totalPoints: 145, isElite: false },
          { id: 'k3', name: 'Tyler Bass', team: 'BUF', position: 'K', rank: 3, totalPoints: 140, isElite: false },
          { id: 'k4', name: 'Jake Elliott', team: 'PHI', position: 'K', rank: 4, totalPoints: 135, isElite: false },
          { id: 'k5', name: 'Daniel Carlson', team: 'LV', position: 'K', rank: 5, totalPoints: 130, isElite: false },
          { id: 'k6', name: 'Jason Myers', team: 'SEA', position: 'K', rank: 6, totalPoints: 125, isElite: false },
          { id: 'k7', name: 'Cameron Dicker', team: 'LAC', position: 'K', rank: 7, totalPoints: 120, isElite: false },
          { id: 'k8', name: 'Evan McPherson', team: 'CIN', position: 'K', rank: 8, totalPoints: 115, isElite: false },
          { id: 'k9', name: 'Greg Zuerlein', team: 'NYJ', position: 'K', rank: 9, totalPoints: 110, isElite: false },
          { id: 'k10', name: 'Younghoe Koo', team: 'ATL', position: 'K', rank: 10, totalPoints: 105, isElite: false },
          { id: 'k11', name: 'Brandon McManus', team: 'JAX', position: 'K', rank: 11, totalPoints: 100, isElite: false },
          { id: 'k12', name: 'Jason Sanders', team: 'MIA', position: 'K', rank: 12, totalPoints: 95, isElite: false },
          { id: 'k13', name: 'Matt Gay', team: 'IND', position: 'K', rank: 13, totalPoints: 90, isElite: false },
          { id: 'k14', name: 'Chris Boswell', team: 'PIT', position: 'K', rank: 14, totalPoints: 85, isElite: false },
          { id: 'k15', name: 'Wil Lutz', team: 'DEN', position: 'K', rank: 15, totalPoints: 80, isElite: false },
          { id: 'k16', name: 'Brandon Aubrey', team: 'DAL', position: 'K', rank: 16, totalPoints: 75, isElite: false },
          { id: 'k17', name: 'Cairo Santos', team: 'CHI', position: 'K', rank: 17, totalPoints: 70, isElite: false },
          { id: 'k18', name: 'Anders Carlson', team: 'GB', position: 'K', rank: 18, totalPoints: 65, isElite: false },
          { id: 'k19', name: 'Graham Gano', team: 'NYG', position: 'K', rank: 19, totalPoints: 60, isElite: false },
          { id: 'k20', name: 'Nick Folk', team: 'TEN', position: 'K', rank: 20, totalPoints: 55, isElite: false },
        ];
      }

      // Always add defenses
      if (byPosition.DEF.length === 0) {
        byPosition.DEF = [
          { id: 'def1', name: 'San Francisco 49ers', team: 'SF', position: 'DEF', rank: 1, totalPoints: 180, isElite: false },
          { id: 'def2', name: 'Baltimore Ravens', team: 'BAL', position: 'DEF', rank: 2, totalPoints: 175, isElite: false },
          { id: 'def3', name: 'Buffalo Bills', team: 'BUF', position: 'DEF', rank: 3, totalPoints: 170, isElite: false },
          { id: 'def4', name: 'Dallas Cowboys', team: 'DAL', position: 'DEF', rank: 4, totalPoints: 165, isElite: false },
          { id: 'def5', name: 'New York Jets', team: 'NYJ', position: 'DEF', rank: 5, totalPoints: 160, isElite: false },
          { id: 'def6', name: 'Cleveland Browns', team: 'CLE', position: 'DEF', rank: 6, totalPoints: 155, isElite: false },
          { id: 'def7', name: 'Pittsburgh Steelers', team: 'PIT', position: 'DEF', rank: 7, totalPoints: 150, isElite: false },
          { id: 'def8', name: 'Miami Dolphins', team: 'MIA', position: 'DEF', rank: 8, totalPoints: 145, isElite: false },
          { id: 'def9', name: 'Kansas City Chiefs', team: 'KC', position: 'DEF', rank: 9, totalPoints: 140, isElite: false },
          { id: 'def10', name: 'Philadelphia Eagles', team: 'PHI', position: 'DEF', rank: 10, totalPoints: 135, isElite: false },
          { id: 'def11', name: 'New Orleans Saints', team: 'NO', position: 'DEF', rank: 11, totalPoints: 130, isElite: false },
          { id: 'def12', name: 'Jacksonville Jaguars', team: 'JAX', position: 'DEF', rank: 12, totalPoints: 125, isElite: false },
          { id: 'def13', name: 'Seattle Seahawks', team: 'SEA', position: 'DEF', rank: 13, totalPoints: 120, isElite: false },
          { id: 'def14', name: 'New England Patriots', team: 'NE', position: 'DEF', rank: 14, totalPoints: 115, isElite: false },
          { id: 'def15', name: 'Detroit Lions', team: 'DET', position: 'DEF', rank: 15, totalPoints: 110, isElite: false },
          { id: 'def16', name: 'Cincinnati Bengals', team: 'CIN', position: 'DEF', rank: 16, totalPoints: 105, isElite: false },
          { id: 'def17', name: 'Minnesota Vikings', team: 'MIN', position: 'DEF', rank: 17, totalPoints: 100, isElite: false },
          { id: 'def18', name: 'Denver Broncos', team: 'DEN', position: 'DEF', rank: 18, totalPoints: 95, isElite: false },
          { id: 'def19', name: 'Green Bay Packers', team: 'GB', position: 'DEF', rank: 19, totalPoints: 90, isElite: false },
          { id: 'def20', name: 'Los Angeles Chargers', team: 'LAC', position: 'DEF', rank: 20, totalPoints: 85, isElite: false },
        ];
      }

      console.log('Draft pool loaded:', {
        QB: byPosition.QB.length,
        RB: byPosition.RB.length,
        WR: byPosition.WR.length,
        TE: byPosition.TE.length,
        K: byPosition.K.length,
        DEF: byPosition.DEF.length,
      });

      setDraftPool(byPosition);
    } catch (err) {
      console.error('Failed to load draft pool:', err);
      setError('Failed to load player options');
    }
  }

  function countElitePlayers(): number {
    const selectedIds = Object.values(lineup).filter(Boolean);
    return selectedIds.filter(id => {
      for (const position of Object.values(draftPool)) {
        const player = position.find(p => p.id === id);
        if (player?.isElite) return true;
      }
      return false;
    }).length;
  }

  function canSelectPlayer(playerId: string, currentPos: string): boolean {
    // Check if this player is elite
    let isElite = false;
    for (const position of Object.values(draftPool)) {
      const player = position.find(p => p.id === playerId);
      if (player?.isElite) {
        isElite = true;
        break;
      }
    }

    if (!isElite) return true;

    // Count elite players excluding the current position
    const selectedIds = Object.entries(lineup)
      .filter(([pos, id]) => pos !== currentPos && id)
      .map(([_, id]) => id);

    const eliteCount = selectedIds.filter(id => {
      for (const position of Object.values(draftPool)) {
        const player = position.find(p => p.id === id);
        if (player?.isElite) return true;
      }
      return false;
    }).length;

    return eliteCount < 2;
  }

  // Wrapper for PlayerAutocomplete's canSelectPlayer (uses is_elite instead of isElite)
  function canSelectPlayerFromAutocomplete(player: { id: string; is_elite: boolean }, currentPos: string): boolean {
    if (!player.is_elite) return true;

    // Count elite players excluding the current position
    const selectedIds = Object.entries(lineup)
      .filter(([pos, id]) => pos !== currentPos && id)
      .map(([_, id]) => id);

    const eliteCount = selectedIds.filter(id => {
      for (const position of Object.values(draftPool)) {
        const p = position.find(pl => pl.id === id);
        if (p?.isElite) return true;
      }
      return false;
    }).length;

    return eliteCount < 2;
  }

  async function handleSave() {
    // Validate all positions filled
    const positions = ['qb', 'rb1', 'rb2', 'wr1', 'wr2', 'te', 'k', 'def'];
    for (const pos of positions) {
      if (!lineup[pos as keyof LineupData]) {
        alert(`Please select a player for ${pos.toUpperCase()}`);
        return;
      }
    }

    // Check elite limit
    if (countElitePlayers() > 2) {
      alert('Maximum 2 elite players allowed');
      return;
    }

    if (!confirm('Save lineup changes?')) {
      return;
    }

    setSaving(true);

    try {
      const { error: updateError } = await supabase
        .from('lineups')
        .update({
          qb_id: lineup.qb,
          rb1_id: lineup.rb1,
          rb2_id: lineup.rb2,
          wr1_id: lineup.wr1,
          wr2_id: lineup.wr2,
          te_id: lineup.te,
          k_id: lineup.k,
          def_id: lineup.def,
          updated_at: new Date().toISOString(),
        })
        .eq('id', lineupId);

      if (updateError) throw updateError;

      alert('Lineup saved successfully!');
      router.push('/employee/fantasy-football');
    } catch (err: any) {
      alert(err.message || 'Failed to save lineup');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-xl-bright-blue mb-4"></div>
          <p className="text-xl-grey">Loading lineup...</p>
        </div>
      </div>
    );
  }

  if (error || !lineupInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Error</h1>
          <p className="text-slate-600 mb-6">{error || 'Lineup not found'}</p>
          <Link
            href="/employee/fantasy-football"
            className="inline-block px-6 py-3 bg-xl-bright-blue text-white font-semibold rounded-lg hover:bg-xl-dark-blue transition-colors"
          >
            Back to Admin
          </Link>
        </div>
      </div>
    );
  }

  const eliteCount = countElitePlayers();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 -mt-8 -mx-4 px-4 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/employee/fantasy-football"
                className="text-xl-grey hover:text-xl-dark-blue transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-xl-dark-blue">
                  Edit Lineup - {lineupInfo.users.team_name}
                </h1>
                <p className="text-sm text-xl-grey mt-1">
                  {lineupInfo.users.name} • Round {lineupInfo.rounds.round_number} (Weeks {lineupInfo.rounds.start_week}-{lineupInfo.rounds.end_week})
                  {lineupInfo.is_locked && <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">LOCKED</span>}
                </p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-xl-bright-blue text-white font-semibold rounded-lg hover:bg-xl-dark-blue disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        {/* Elite Counter */}
        <div className="mb-6 flex justify-center">
          <div className={`inline-flex items-center px-6 py-3 rounded-lg font-semibold text-lg ${
            eliteCount >= 2 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
          }`}>
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Elite Players: {eliteCount}/2
          </div>
        </div>

        {/* Positions */}
        <div className="grid md:grid-cols-2 gap-6">
          {(['qb', 'rb1', 'rb2', 'wr1', 'wr2', 'te', 'k', 'def'] as const).map(position => {
            const posLabel = position.toUpperCase();
            const poolKey = position === 'rb1' || position === 'rb2' ? 'RB' :
                          position === 'wr1' || position === 'wr2' ? 'WR' :
                          position.toUpperCase();
            const players = draftPool[poolKey] || [];
            const selectedPlayer = players.find(p => p.id === lineup[position]);

            return (
              <div key={position} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-xl-dark-blue mb-4">{posLabel}</h3>

                {/* Current Selection */}
                {selectedPlayer && (
                  <div className={`mb-4 p-4 rounded-lg border-2 ${
                    selectedPlayer.isElite ? 'border-yellow-400 bg-yellow-50' : 'border-green-400 bg-green-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-800">{selectedPlayer.name}</div>
                        <div className="text-sm text-slate-600">{selectedPlayer.team} • Rank #{selectedPlayer.rank}</div>
                      </div>
                      {selectedPlayer.isElite && (
                        <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded">ELITE</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Player Selection with Search */}
                <PlayerAutocomplete
                  value={playerNames[position]}
                  onChange={() => {
                    // Don't update on typing - only update when selecting from dropdown
                  }}
                  position={poolKey}
                  placeholder={`Search ${posLabel} players...`}
                  showTeamInput={false}
                  onSelectPlayer={(player) => {
                    setLineup({ ...lineup, [position]: player.id });
                    setPlayerNames({ ...playerNames, [position]: player.name });
                  }}
                  canSelectPlayer={(player) => canSelectPlayerFromAutocomplete(player, position)}
                />
              </div>
            );
          })}
        </div>

        {/* Warning about locked */}
        {lineupInfo.is_locked && (
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-900">
              <strong>Note:</strong> This lineup is currently locked. Users cannot edit it until you unlock it from the admin page.
              You can still edit it here as an admin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
