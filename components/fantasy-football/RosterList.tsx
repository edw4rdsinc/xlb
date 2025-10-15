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

interface RosterListProps {
  lineups: Lineup[];
}

export function RosterList({ lineups }: RosterListProps) {
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

  const PlayerCell = ({ player }: { player: Player | undefined }) => {
    if (!player) return <span className="text-slate-400">-</span>;

    return (
      <div className="flex items-center">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-slate-900 truncate">{player.name}</p>
          {player.team && (
            <p className="text-xs text-slate-500">{player.team}</p>
          )}
        </div>
        {player.is_elite && (
          <svg className="w-4 h-4 text-yellow-500 ml-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
        {player.is_custom && (
          <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded font-medium flex-shrink-0">
            Custom
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider sticky left-0 bg-slate-50 z-10">
                Team
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                QB
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                RB1
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                RB2
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                WR1
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                WR2
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                TE
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                K
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                DEF
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Submitted
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {lineups.map(lineup => {
              const eliteCount = Object.values(lineup.players).filter(p => p?.is_elite).length;

              return (
                <tr key={lineup.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 sticky left-0 bg-white hover:bg-slate-50 z-10">
                    <div className="min-w-max">
                      <p className="font-semibold text-slate-900">{lineup.user.team_name}</p>
                      <p className="text-sm text-slate-500">{lineup.user.name}</p>
                      {eliteCount > 0 && (
                        <div className="flex items-center mt-1">
                          <svg className="w-3 h-3 text-yellow-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-xs text-yellow-700 font-medium">
                            {eliteCount} Elite
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <PlayerCell player={lineup.players.qb} />
                  </td>
                  <td className="px-4 py-4">
                    <PlayerCell player={lineup.players.rb1} />
                  </td>
                  <td className="px-4 py-4">
                    <PlayerCell player={lineup.players.rb2} />
                  </td>
                  <td className="px-4 py-4">
                    <PlayerCell player={lineup.players.wr1} />
                  </td>
                  <td className="px-4 py-4">
                    <PlayerCell player={lineup.players.wr2} />
                  </td>
                  <td className="px-4 py-4">
                    <PlayerCell player={lineup.players.te} />
                  </td>
                  <td className="px-4 py-4">
                    <PlayerCell player={lineup.players.k} />
                  </td>
                  <td className="px-4 py-4">
                    <PlayerCell player={lineup.players.def} />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <p className="text-sm text-slate-600">
                      {new Date(lineup.submitted_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(lineup.submitted_at).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
