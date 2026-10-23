import React from 'react';

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
  prefix?: string;
  suffix?: string;
  presets?: number[];
  tooltip?: string;
}

export const SliderInput: React.FC<SliderInputProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  prefix = '',
  suffix = '',
  presets,
  tooltip,
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.-]/g, '');
    const num = parseFloat(raw);
    if (!isNaN(num)) {
      onChange(Math.min(Math.max(num, 0), max * 2));
    } else if (raw === '') {
      onChange(0);
    }
  };

  return (
    <div className="mb-6 bg-white dark:bg-[#181B20] p-4 rounded-xl border border-gray-100 dark:border-gray-800 transition-colors">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
          {tooltip && (
            <span
              title={tooltip}
              className="text-xs cursor-help text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              ⓘ
            </span>
          )}
        </div>

        {/* Number Input Box with prefix/suffix */}
        <div className="relative flex items-center bg-[#F3F4F6] dark:bg-[#22262E] px-3 py-1.5 rounded-lg border border-transparent focus-within:border-[#00D09C] focus-within:bg-white dark:focus-within:bg-[#14161A] transition-all">
          {prefix && (
            <span className="text-sm font-semibold text-[#00D09C] mr-1 select-none">
              {prefix}
            </span>
          )}
          <input
            type="text"
            value={value === 0 ? '' : value.toLocaleString('en-IN')}
            onChange={handleInputChange}
            placeholder="0"
            className="w-28 text-right font-bold text-gray-900 dark:text-gray-100 bg-transparent outline-none text-base tabular-nums"
          />
          {suffix && (
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1 select-none">
              {suffix}
            </span>
          )}
        </div>
      </div>

      {/* Styled Range Slider */}
      <div className="relative flex items-center py-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={Math.min(value, max)}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          style={{
            background: `linear-gradient(to right, #00D09C ${percentage}%, var(--bg-subtle) ${percentage}%)`,
          }}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Quick Presets */}
      {presets && presets.length > 0 && (
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Quick:</span>
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onChange(preset)}
              className={`text-xs px-2.5 py-1 rounded-md transition-all ${
                value === preset
                  ? 'bg-[#00D09C] text-white font-semibold'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {prefix}
              {preset >= 10000000
                ? `${preset / 10000000} Cr`
                : preset >= 100000
                ? `${preset / 100000} L`
                : preset >= 1000
                ? `${preset / 1000}k`
                : preset}
              {suffix}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
