import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { formatDisplayNumber } from '../utils/calculatorEngine';

interface DisplayProps {
  expression: string;
  displayValue: string;
  error: string | null;
}

export const Display: React.FC<DisplayProps> = ({ expression, displayValue, error }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = error || displayValue;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Ignore clipboard write failure
    }
  };

  const formattedValue = error ? error : formatDisplayNumber(displayValue);

  // Dynamic font sizing based on character length
  const getFontSizeClass = (len: number, isErr: boolean) => {
    if (isErr) return 'text-2xl sm:text-3xl text-rose-400 font-medium tracking-normal';
    if (len <= 7) return 'text-5xl sm:text-6xl font-light tracking-tight text-white';
    if (len <= 10) return 'text-4xl sm:text-5xl font-light tracking-tight text-white';
    if (len <= 13) return 'text-3xl sm:text-4xl font-normal tracking-tight text-white';
    if (len <= 16) return 'text-2xl sm:text-3xl font-normal tracking-tight text-white';
    return 'text-xl sm:text-2xl font-mono-numbers tracking-tight text-white';
  };

  return (
    <div className="relative w-full bg-[#15181E] border border-white/[0.06] rounded-2xl p-5 mb-4 shadow-inner flex flex-col justify-end min-h-[140px] select-text">
      {/* Top row: Expression and copy button */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="font-mono-numbers text-xs sm:text-sm text-gray-400 truncate tracking-wide min-h-[1.25rem]">
          {expression || <span className="opacity-0">0</span>}
        </div>

        <button
          onClick={handleCopy}
          type="button"
          aria-label="Copy result"
          title="Copy result (Ctrl+C)"
          className="p-1.5 rounded-lg text-gray-400 hover:text-[#55DFFF] hover:bg-white/5 active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          {copied ? (
            <span className="flex items-center gap-1 text-xs text-[#55DFFF] font-medium">
              <Check className="w-3.5 h-3.5" />
              <span>Copied</span>
            </span>
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Main value display */}
      <div className="w-full flex items-baseline justify-end overflow-hidden">
        <div
          className={`font-mono-numbers text-right w-full break-all transition-all duration-150 ${getFontSizeClass(
            formattedValue.length,
            Boolean(error)
          )}`}
        >
          {formattedValue}
        </div>
      </div>
    </div>
  );
};
