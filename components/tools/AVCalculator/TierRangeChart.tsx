'use client';

import { AV_TIER_RANGES, METAL_TIER_COLORS, formatAVPercentage } from '@/types/av-calculator';

interface TierRangeChartProps {
  currentAV: number;
}

export default function TierRangeChart({ currentAV }: TierRangeChartProps) {
  const tiers = [
    { name: 'Catastrophic', range: AV_TIER_RANGES.catastrophic, color: METAL_TIER_COLORS.Catastrophic },
    { name: 'Bronze', range: AV_TIER_RANGES.bronze, color: METAL_TIER_COLORS.Bronze },
    { name: 'Silver', range: AV_TIER_RANGES.silver, color: METAL_TIER_COLORS.Silver },
    { name: 'Gold', range: AV_TIER_RANGES.gold, color: METAL_TIER_COLORS.Gold },
    { name: 'Platinum', range: AV_TIER_RANGES.platinum, color: METAL_TIER_COLORS.Platinum },
  ];

  // Calculate position percentage (0-100 scale)
  const getPosition = (av: number) => {
    // Scale from 0% to 100% AV across the entire chart
    return (av * 100);
  };

  const currentPosition = getPosition(currentAV);

  return (
    <div className="space-y-4">
      {/* Visual bar chart */}
      <div className="relative">
        {/* Tier bars */}
        <div className="flex h-16 rounded-lg overflow-hidden border border-gray-300">
          {tiers.map((tier, idx) => {
            const widthPercent = (tier.range.max - tier.range.min) * 100;
            const isCurrentTier = currentAV >= tier.range.min && currentAV <= tier.range.max;

            return (
              <div
                key={tier.name}
                className={`relative flex items-center justify-center transition-all ${
                  isCurrentTier ? 'ring-4 ring-xl-bright-blue z-10' : ''
                }`}
                style={{
                  width: `${widthPercent}%`,
                  backgroundColor: tier.color,
                  opacity: isCurrentTier ? 1 : 0.6,
                }}
              >
                <span
                  className={`text-sm font-bold ${
                    tier.name === 'Platinum' || tier.name === 'Silver' ? 'text-gray-800' : 'text-white'
                  }`}
                >
                  {tier.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Current AV indicator */}
        <div
          className="absolute top-0 -mt-2 transform -translate-x-1/2 z-20"
          style={{ left: `${currentPosition}%` }}
        >
          <div className="flex flex-col items-center">
            <div className="bg-xl-bright-blue text-white px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap shadow-lg">
              {formatAVPercentage(currentAV)}
            </div>
            <div className="w-0.5 h-20 bg-xl-bright-blue"></div>
          </div>
        </div>
      </div>

      {/* Tier details */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
        {tiers.map((tier) => {
          const isCurrentTier = currentAV >= tier.range.min && currentAV <= tier.range.max;

          return (
            <div
              key={tier.name}
              className={`p-3 rounded-lg border-2 transition-all ${
                isCurrentTier
                  ? 'border-xl-bright-blue bg-xl-bright-blue/10'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center mb-1">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: tier.color }}
                />
                <span className={`font-semibold ${isCurrentTier ? 'text-xl-bright-blue' : 'text-gray-700'}`}>
                  {tier.name}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {tier.name === 'Catastrophic'
                  ? '< 60%'
                  : `${formatAVPercentage(tier.range.min)} - ${formatAVPercentage(tier.range.max)}`}
              </p>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="text-xs text-gray-500 text-center">
        <p>Metal tier ranges are based on ACA regulatory standards</p>
      </div>
    </div>
  );
}
