'use client';

import { useState } from 'react';
import { type Player, type Round } from '@/lib/supabase/client';
import { PlayerSelect } from './PlayerSelect';
import { CustomPlayerModal } from './CustomPlayerModal';

type Position = 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DEF';

interface LineupFormProps {
  players: Player[];
  currentRound: Round;
  onSuccess: (data: any) => void;
}

interface FormData {
  name: string;
  email: string;
  teamName: string;
  qb: string;
  rb1: string;
  rb2: string;
  wr1: string;
  wr2: string;
  te: string;
  k: string;
  def: string;
}

export function LineupForm({ players, currentRound, onSuccess }: LineupFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    teamName: '',
    qb: '',
    rb1: '',
    rb2: '',
    wr1: '',
    wr2: '',
    te: '',
    k: '',
    def: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [customPlayerModal, setCustomPlayerModal] = useState<{ open: boolean; position: Position | null }>({
    open: false,
    position: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [customPlayers, setCustomPlayers] = useState<Player[]>([]);

  // Get players by position
  const getPlayersByPosition = (position: Position): Player[] => {
    const dbPlayers = players.filter(p => p.position === position);
    const customPlayersForPosition = customPlayers.filter(p => p.position === position);
    return [...dbPlayers, ...customPlayersForPosition];
  };

  // Count elite players in current lineup
  const countElitePlayers = (): number => {
    const selectedPlayerIds = [
      formData.qb,
      formData.rb1,
      formData.rb2,
      formData.wr1,
      formData.wr2,
      formData.te,
      formData.k,
      formData.def,
    ].filter(id => id);

    return selectedPlayerIds.filter(id => {
      const player = [...players, ...customPlayers].find(p => p.id === id);
      return player?.is_elite;
    }).length;
  };

  const eliteCount = countElitePlayers();

  // Check if a player can be selected (elite limit check)
  const canSelectPlayer = (playerId: string): boolean => {
    const player = [...players, ...customPlayers].find(p => p.id === playerId);
    if (!player?.is_elite) return true;
    return eliteCount < 2;
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCustomPlayer = (player: Player) => {
    setCustomPlayers(prev => [...prev, player]);
    if (customPlayerModal.position) {
      const positionField = getPositionField(customPlayerModal.position);
      handleChange(positionField, player.id);
    }
    setCustomPlayerModal({ open: false, position: null });
  };

  const getPositionField = (position: Position): keyof FormData => {
    const map: Record<Position, keyof FormData> = {
      QB: 'qb',
      RB: 'rb1',
      WR: 'wr1',
      TE: 'te',
      K: 'k',
      DEF: 'def',
    };
    return map[position];
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    // Personal info validation
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.teamName.trim()) newErrors.teamName = 'Team name is required';

    // Position validation
    if (!formData.qb) newErrors.qb = 'QB is required';
    if (!formData.rb1) newErrors.rb1 = 'RB1 is required';
    if (!formData.rb2) newErrors.rb2 = 'RB2 is required';
    if (!formData.wr1) newErrors.wr1 = 'WR1 is required';
    if (!formData.wr2) newErrors.wr2 = 'WR2 is required';
    if (!formData.te) newErrors.te = 'TE is required';
    if (!formData.k) newErrors.k = 'K is required';
    if (!formData.def) newErrors.def = 'DEF is required';

    // Elite player limit
    if (eliteCount > 2) {
      newErrors.qb = 'Maximum 2 elite players allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const response = await fetch('/api/fantasy-football/submit-lineup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          roundId: currentRound.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit lineup');
      }

      onSuccess({
        ...formData,
        lineupId: data.lineupId,
        players: {
          qb: [...players, ...customPlayers].find(p => p.id === formData.qb),
          rb1: [...players, ...customPlayers].find(p => p.id === formData.rb1),
          rb2: [...players, ...customPlayers].find(p => p.id === formData.rb2),
          wr1: [...players, ...customPlayers].find(p => p.id === formData.wr1),
          wr2: [...players, ...customPlayers].find(p => p.id === formData.wr2),
          te: [...players, ...customPlayers].find(p => p.id === formData.te),
          k: [...players, ...customPlayers].find(p => p.id === formData.k),
          def: [...players, ...customPlayers].find(p => p.id === formData.def),
        },
      });
    } catch (error: any) {
      alert(error.message || 'Failed to submit lineup. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
        {/* Personal Information */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Personal Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="John Smith"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Team Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.teamName}
                onChange={(e) => handleChange('teamName', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.teamName ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Thunder Bolts"
              />
              {errors.teamName && <p className="text-red-500 text-sm mt-1">{errors.teamName}</p>}
            </div>
          </div>
        </div>

        {/* Elite Player Counter */}
        <div className="mb-6">
          <div className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold ${
            eliteCount >= 2 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
          }`}>
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Elite Players: {eliteCount}/2
          </div>
        </div>

        {/* Lineup Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Your Lineup</h2>

          <div className="space-y-4">
            {/* QB */}
            <PlayerSelect
              label="Quarterback (QB)"
              position="QB"
              players={getPlayersByPosition('QB')}
              value={formData.qb}
              onChange={(value) => handleChange('qb', value)}
              error={errors.qb}
              canSelectPlayer={canSelectPlayer}
              onAddCustom={() => setCustomPlayerModal({ open: true, position: 'QB' })}
            />

            {/* RB1 & RB2 */}
            <div className="grid md:grid-cols-2 gap-4">
              <PlayerSelect
                label="Running Back 1 (RB)"
                position="RB"
                players={getPlayersByPosition('RB')}
                value={formData.rb1}
                onChange={(value) => handleChange('rb1', value)}
                error={errors.rb1}
                canSelectPlayer={canSelectPlayer}
                excludePlayerIds={formData.rb2 ? [formData.rb2] : []}
                onAddCustom={() => setCustomPlayerModal({ open: true, position: 'RB' })}
              />
              <PlayerSelect
                label="Running Back 2 (RB)"
                position="RB"
                players={getPlayersByPosition('RB')}
                value={formData.rb2}
                onChange={(value) => handleChange('rb2', value)}
                error={errors.rb2}
                canSelectPlayer={canSelectPlayer}
                excludePlayerIds={formData.rb1 ? [formData.rb1] : []}
                onAddCustom={() => setCustomPlayerModal({ open: true, position: 'RB' })}
              />
            </div>

            {/* WR1 & WR2 */}
            <div className="grid md:grid-cols-2 gap-4">
              <PlayerSelect
                label="Wide Receiver 1 (WR)"
                position="WR"
                players={getPlayersByPosition('WR')}
                value={formData.wr1}
                onChange={(value) => handleChange('wr1', value)}
                error={errors.wr1}
                canSelectPlayer={canSelectPlayer}
                excludePlayerIds={formData.wr2 ? [formData.wr2] : []}
                onAddCustom={() => setCustomPlayerModal({ open: true, position: 'WR' })}
              />
              <PlayerSelect
                label="Wide Receiver 2 (WR)"
                position="WR"
                players={getPlayersByPosition('WR')}
                value={formData.wr2}
                onChange={(value) => handleChange('wr2', value)}
                error={errors.wr2}
                canSelectPlayer={canSelectPlayer}
                excludePlayerIds={formData.wr1 ? [formData.wr1] : []}
                onAddCustom={() => setCustomPlayerModal({ open: true, position: 'WR' })}
              />
            </div>

            {/* TE */}
            <PlayerSelect
              label="Tight End (TE)"
              position="TE"
              players={getPlayersByPosition('TE')}
              value={formData.te}
              onChange={(value) => handleChange('te', value)}
              error={errors.te}
              canSelectPlayer={canSelectPlayer}
              onAddCustom={() => setCustomPlayerModal({ open: true, position: 'TE' })}
            />

            {/* K */}
            <PlayerSelect
              label="Kicker (K)"
              position="K"
              players={getPlayersByPosition('K')}
              value={formData.k}
              onChange={(value) => handleChange('k', value)}
              error={errors.k}
              canSelectPlayer={canSelectPlayer}
              onAddCustom={() => setCustomPlayerModal({ open: true, position: 'K' })}
            />

            {/* DEF */}
            <PlayerSelect
              label="Defense (DEF)"
              position="DEF"
              players={getPlayersByPosition('DEF')}
              value={formData.def}
              onChange={(value) => handleChange('def', value)}
              error={errors.def}
              canSelectPlayer={canSelectPlayer}
              onAddCustom={() => setCustomPlayerModal({ open: true, position: 'DEF' })}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Submitting...' : 'Submit Lineup'}
          </button>
        </div>
      </form>

      {/* Custom Player Modal */}
      {customPlayerModal.position && (
        <CustomPlayerModal
          open={customPlayerModal.open}
          position={customPlayerModal.position}
          onClose={() => setCustomPlayerModal({ open: false, position: null })}
          onSubmit={handleCustomPlayer}
        />
      )}

    </>
  );
}
