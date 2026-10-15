import React from 'react';
import { Delete, Percent, Plus, Minus, X, Divide, Equal } from 'lucide-react';
import { Operator } from '../types';

interface KeypadProps {
  onDigit: (digit: string) => void;
  onOperator: (op: Operator) => void;
  onEquals: () => void;
  onClear: () => void;
  onDelete: () => void;
  onDecimal: () => void;
  onNegate: () => void;
  onPercentage: () => void;
  activeOperator: Operator | null;
  pressedKey: string | null;
}

export const Keypad: React.FC<KeypadProps> = ({
  onDigit,
  onOperator,
  onEquals,
  onClear,
  onDelete,
  onDecimal,
  onNegate,
  onPercentage,
  activeOperator,
  pressedKey,
}) => {
  const isKeyActive = (keyId: string) => pressedKey === keyId;

  return (
    <div className="grid grid-cols-4 gap-2.5 sm:gap-3 w-full select-none">
      {/* ROW 1: AC, ⌫, %, ÷ */}
      <button
        type="button"
        onClick={onClear}
        className={`h-14 sm:h-16 rounded-2xl font-medium text-base sm:text-lg flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-[0.96] border border-white/[0.04] ${
          isKeyActive('Escape')
            ? 'bg-[#2A313E] text-white scale-[0.97]'
            : 'bg-[#1D212A] text-rose-400 hover:bg-[#252B36] hover:text-rose-300'
        }`}
        aria-label="All Clear"
        title="Clear all (Esc)"
      >
        AC
      </button>

      <button
        type="button"
        onClick={onDelete}
        className={`h-14 sm:h-16 rounded-2xl font-medium text-sm sm:text-base flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-[0.96] border border-white/[0.04] ${
          isKeyActive('Backspace')
            ? 'bg-[#2A313E] text-white scale-[0.97]'
            : 'bg-[#1D212A] text-gray-300 hover:bg-[#252B36] hover:text-white'
        }`}
        aria-label="Delete last digit"
        title="Delete last digit (Backspace)"
      >
        <Delete className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={onPercentage}
        className={`h-14 sm:h-16 rounded-2xl font-medium text-sm sm:text-base flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-[0.96] border border-white/[0.04] ${
          isKeyActive('%')
            ? 'bg-[#2A313E] text-white scale-[0.97]'
            : 'bg-[#1D212A] text-gray-300 hover:bg-[#252B36] hover:text-white'
        }`}
        aria-label="Percentage"
        title="Percentage (%)"
      >
        <Percent className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={() => onOperator('÷')}
        className={`h-14 sm:h-16 rounded-2xl font-medium text-lg sm:text-xl flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-[0.96] border ${
          activeOperator === '÷'
            ? 'bg-[#55DFFF]/20 border-[#55DFFF] text-[#55DFFF] shadow-[0_0_15px_rgba(85,223,255,0.2)]'
            : isKeyActive('/')
            ? 'bg-[#1F2C3A] text-[#55DFFF] border-[#55DFFF]/50 scale-[0.97]'
            : 'bg-[#16212D] text-[#55DFFF] border-[#55DFFF]/20 hover:bg-[#1C2A3A] hover:border-[#55DFFF]/40'
        }`}
        aria-label="Divide"
        title="Divide (/)"
      >
        <Divide className="w-5 h-5" />
      </button>

      {/* ROW 2: 7, 8, 9, × */}
      {['7', '8', '9'].map((digit) => (
        <button
          key={digit}
          type="button"
          onClick={() => onDigit(digit)}
          className={`h-14 sm:h-16 rounded-2xl font-medium text-xl sm:text-2xl font-mono-numbers flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-[0.96] border border-white/[0.04] ${
            isKeyActive(digit)
              ? 'bg-[#282E3B] text-white scale-[0.97]'
              : 'bg-[#1A1D24] text-gray-100 hover:bg-[#222731]'
          }`}
          aria-label={digit}
        >
          {digit}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onOperator('×')}
        className={`h-14 sm:h-16 rounded-2xl font-medium text-lg sm:text-xl flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-[0.96] border ${
          activeOperator === '×'
            ? 'bg-[#55DFFF]/20 border-[#55DFFF] text-[#55DFFF] shadow-[0_0_15px_rgba(85,223,255,0.2)]'
            : isKeyActive('*')
            ? 'bg-[#1F2C3A] text-[#55DFFF] border-[#55DFFF]/50 scale-[0.97]'
            : 'bg-[#16212D] text-[#55DFFF] border-[#55DFFF]/20 hover:bg-[#1C2A3A] hover:border-[#55DFFF]/40'
        }`}
        aria-label="Multiply"
        title="Multiply (*)"
      >
        <X className="w-5 h-5" />
      </button>

      {/* ROW 3: 4, 5, 6, - */}
      {['4', '5', '6'].map((digit) => (
        <button
          key={digit}
          type="button"
          onClick={() => onDigit(digit)}
          className={`h-14 sm:h-16 rounded-2xl font-medium text-xl sm:text-2xl font-mono-numbers flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-[0.96] border border-white/[0.04] ${
            isKeyActive(digit)
              ? 'bg-[#282E3B] text-white scale-[0.97]'
              : 'bg-[#1A1D24] text-gray-100 hover:bg-[#222731]'
          }`}
          aria-label={digit}
        >
          {digit}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onOperator('-')}
        className={`h-14 sm:h-16 rounded-2xl font-medium text-lg sm:text-xl flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-[0.96] border ${
          activeOperator === '-'
            ? 'bg-[#55DFFF]/20 border-[#55DFFF] text-[#55DFFF] shadow-[0_0_15px_rgba(85,223,255,0.2)]'
            : isKeyActive('-')
            ? 'bg-[#1F2C3A] text-[#55DFFF] border-[#55DFFF]/50 scale-[0.97]'
            : 'bg-[#16212D] text-[#55DFFF] border-[#55DFFF]/20 hover:bg-[#1C2A3A] hover:border-[#55DFFF]/40'
        }`}
        aria-label="Subtract"
        title="Subtract (-)"
      >
        <Minus className="w-5 h-5" />
      </button>

      {/* ROW 4: 1, 2, 3, + */}
      {['1', '2', '3'].map((digit) => (
        <button
          key={digit}
          type="button"
          onClick={() => onDigit(digit)}
          className={`h-14 sm:h-16 rounded-2xl font-medium text-xl sm:text-2xl font-mono-numbers flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-[0.96] border border-white/[0.04] ${
            isKeyActive(digit)
              ? 'bg-[#282E3B] text-white scale-[0.97]'
              : 'bg-[#1A1D24] text-gray-100 hover:bg-[#222731]'
          }`}
          aria-label={digit}
        >
          {digit}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onOperator('+')}
        className={`h-14 sm:h-16 rounded-2xl font-medium text-lg sm:text-xl flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-[0.96] border ${
          activeOperator === '+'
            ? 'bg-[#55DFFF]/20 border-[#55DFFF] text-[#55DFFF] shadow-[0_0_15px_rgba(85,223,255,0.2)]'
            : isKeyActive('+')
            ? 'bg-[#1F2C3A] text-[#55DFFF] border-[#55DFFF]/50 scale-[0.97]'
            : 'bg-[#16212D] text-[#55DFFF] border-[#55DFFF]/20 hover:bg-[#1C2A3A] hover:border-[#55DFFF]/40'
        }`}
        aria-label="Add"
        title="Add (+)"
      >
        <Plus className="w-5 h-5" />
      </button>

      {/* ROW 5: ±, 0, ., = */}
      <button
        type="button"
        onClick={onNegate}
        className={`h-14 sm:h-16 rounded-2xl font-medium text-lg sm:text-xl font-mono-numbers flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-[0.96] border border-white/[0.04] ${
          isKeyActive('n')
            ? 'bg-[#282E3B] text-white scale-[0.97]'
            : 'bg-[#1A1D24] text-gray-300 hover:bg-[#222731]'
        }`}
        aria-label="Toggle positive or negative"
        title="Negate (± or N)"
      >
        ±
      </button>

      <button
        type="button"
        onClick={() => onDigit('0')}
        className={`h-14 sm:h-16 rounded-2xl font-medium text-xl sm:text-2xl font-mono-numbers flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-[0.96] border border-white/[0.04] ${
          isKeyActive('0')
            ? 'bg-[#282E3B] text-white scale-[0.97]'
            : 'bg-[#1A1D24] text-gray-100 hover:bg-[#222731]'
        }`}
        aria-label="0"
      >
        0
      </button>

      <button
        type="button"
        onClick={onDecimal}
        className={`h-14 sm:h-16 rounded-2xl font-semibold text-2xl font-mono-numbers flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-[0.96] border border-white/[0.04] ${
          isKeyActive('.')
            ? 'bg-[#282E3B] text-white scale-[0.97]'
            : 'bg-[#1A1D24] text-gray-200 hover:bg-[#222731]'
        }`}
        aria-label="Decimal point"
        title="Decimal (.)"
      >
        .
      </button>

      <button
        type="button"
        onClick={onEquals}
        className={`h-14 sm:h-16 rounded-2xl font-semibold text-lg sm:text-xl flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-[0.95] bg-[#55DFFF] text-[#0A1118] shadow-[0_4px_20px_rgba(85,223,255,0.3)] hover:brightness-110 hover:shadow-[0_6px_25px_rgba(85,223,255,0.45)] ${
          isKeyActive('Enter') || isKeyActive('=') ? 'scale-[0.95] brightness-90 ring-2 ring-white/50' : ''
        }`}
        aria-label="Calculate equals"
        title="Equals (Enter or =)"
      >
        <Equal className="w-6 h-6 stroke-[2.5]" />
      </button>
    </div>
  );
};
