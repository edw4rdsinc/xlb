import { type Player } from '@/lib/supabase/client';

interface Lineup {
  id: string;
  user: {
    name: string;
    team_name: string;
    email: string;
  };
  players: {
    qb: Player;
    rb1: Player;
    rb2: Player;
    wr1: Player;
    wr2: Player;
    te: Player;
    k: Player;
    def: Player;
  };
  submitted_at: string;
}

interface RosterGridProps {
  lineups: Lineup[];
}

export function RosterGrid({ lineups }: RosterGridProps) {
  const positions = [
    { key: 'qb', label: 'QB' },
    { key: 'rb1', label: 'RB1' },
    { key: 'rb2', label: 'RB2' },
    { key: 'wr1', label: 'WR1' },
    { key: 'wr2', label: 'WR2' },
    { key: 'te', label: 'TE' },
    { key: 'k', label: 'K' },
    { key: 'def', label: 'DEF' },
  ];

  const countElitePlayers = (players: Lineup['players']): number => {
    return Object.values(players).filter((p: any) => p?.is_elite).length;
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lineups.map(lineup => {
        const eliteCount = countElitePlayers(lineup.players);

        return (
          <div
            key={lineup.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h3 className="text-xl font-bold text-white">
                {lineup.user.team_name}
              </h3>
            </div>

            {/* Elite Counter */}
            {eliteCount > 0 && (
              <div className="px-6 py-2 bg-yellow-50 border-b border-yellow-100">
                <div className="flex items-center text-sm">
                  <svg className="w-4 h-4 text-yellow-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold text-yellow-700">
                    {eliteCount} Elite Player{eliteCount > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            )}

            {/* Roster */}
            <div className="p-6">
              <div className="space-y-3">
                {positions.map(pos => {
                  const player = lineup.players[pos.key as keyof Lineup['players']];

                  return (
                    <div
                      key={pos.key}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center min-w-0 flex-1">
                        <span className="font-bold text-slate-700 w-12 flex-shrink-0">
                          {pos.label}
                        </span>
                        <div className="ml-3 min-w-0 flex-1">
                          <p className="font-medium text-slate-900 truncate">
                            {player?.name || 'Unknown'}
                          </p>
                          {player?.team && (
                            <p className="text-xs text-slate-500">{player.team}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center ml-2 flex-shrink-0">
                        {player?.is_elite && (
                          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        )}
                        {player?.is_custom && (
                          <span className="ml-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded font-medium">
                            Custom
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submitted Time */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500 text-center">
                  Submitted {new Date(lineup.submitted_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
