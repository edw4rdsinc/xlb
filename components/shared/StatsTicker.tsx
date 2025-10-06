'use client';

interface Stat {
  value: string;
  label: string;
}

interface StatsTickerProps {
  stats: Stat[];
}

export default function StatsTicker({ stats }: StatsTickerProps) {
  // Duplicate stats for seamless loop
  const duplicatedStats = [...stats, ...stats];

  return (
    <div className="relative overflow-hidden bg-xl-dark-blue py-8">
      <div className="flex animate-scroll">
        {duplicatedStats.map((stat, index) => (
          <div
            key={index}
            className="flex-shrink-0 px-8 md:px-12 flex flex-col items-center justify-center min-w-[200px]"
          >
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
              {stat.value}
            </div>
            <div className="text-sm md:text-base text-white/80 text-center">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
