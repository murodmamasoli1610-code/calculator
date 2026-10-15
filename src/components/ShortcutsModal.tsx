import React from 'react';
import { Keyboard, X } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '0 – 9', desc: 'Input digits' },
    { key: '+  -  *  /', desc: 'Basic operations' },
    { key: 'Enter or =', desc: 'Calculate result' },
    { key: 'Esc', desc: 'Clear all (AC)' },
    { key: 'Backspace', desc: 'Delete last digit' },
    { key: '.', desc: 'Decimal point' },
    { key: '%', desc: 'Percentage' },
    { key: 'N or ±', desc: 'Toggle sign (+/-)' },
    { key: 'Ctrl + C', desc: 'Copy result' },
  ];

  return (
    <div className="absolute inset-0 z-40 bg-[#111318]/95 backdrop-blur-md rounded-3xl p-5 flex flex-col transition-all duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-200">
          <Keyboard className="w-4 h-4 text-[#55DFFF]" />
          <span>Keyboard Shortcuts</span>
        </div>
        <button
          onClick={onClose}
          type="button"
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          title="Close shortcuts"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
        {shortcuts.map((s) => (
          <div
            key={s.key}
            className="flex items-center justify-between p-2 rounded-lg bg-[#161920] border border-white/[0.04]"
          >
            <span className="text-gray-300">{s.desc}</span>
            <kbd className="px-2 py-0.5 rounded bg-[#202530] text-[#55DFFF] font-mono-numbers text-[11px] border border-[#55DFFF]/20">
              {s.key}
            </kbd>
          </div>
        ))}
      </div>

      <div className="pt-3 text-center text-[11px] text-gray-500 border-t border-white/[0.04] mt-2">
        Type directly anywhere on the page to calculate
      </div>
    </div>
  );
};
