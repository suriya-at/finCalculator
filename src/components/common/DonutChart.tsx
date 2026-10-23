import React from 'react';
import { formatINR, formatPercent } from '../../utils/formatters';

interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  centerTitle?: string;
  centerValue?: string;
  size?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  segments,
  centerTitle = 'Total',
  centerValue,
  size = 220,
}) => {
  const total = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0);
  const radius = 80;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-[#181B20] rounded-2xl border border-gray-100 dark:border-gray-800 transition-colors">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 200 200" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="transparent"
            stroke="var(--bg-subtle)"
            strokeWidth={strokeWidth}
          />

          {/* SVG Segments */}
          {total > 0 &&
            segments.map((seg, idx) => {
              const fraction = Math.max(0, seg.value) / total;
              const strokeDasharray = `${circumference * fraction} ${circumference * (1 - fraction)}`;
              const strokeDashoffset = -circumference * accumulatedPercent;
              accumulatedPercent += fraction;

              return (
                <circle
                  key={idx}
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out"
                />
              );
            })}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
          <span className="text-xs uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">
            {centerTitle}
          </span>
          <span className="text-lg font-bold text-gray-900 dark:text-white tabular-nums mt-0.5">
            {centerValue || formatINR(total, true)}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="w-full mt-6 space-y-2.5">
        {segments.map((seg, idx) => {
          const pct = total > 0 ? (Math.max(0, seg.value) / total) * 100 : 0;
          return (
            <div key={idx} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  {seg.label}
                </span>
              </div>
              <div className="flex items-center gap-2 tabular-nums">
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatINR(seg.value)}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  ({formatPercent(pct, 1)})
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
