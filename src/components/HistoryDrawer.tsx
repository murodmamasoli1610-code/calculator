import React from 'react';
import { History, Trash2, X, ArrowUpRight } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectResult: (result: string) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectResult,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-30 bg-[#111318]/95 backdrop-blur-md rounded-3xl p-5 flex flex-col transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-200">
          <History className="w-4 h-4 text-[#55DFFF]" />
          <span>Calculation History</span>
        </div>
        <div className="flex items-center gap-1">
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              type="button"
              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
              title="Clear all history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Close history"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* History Items list */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500 text-xs">
            <History className="w-8 h-8 mb-2 opacity-30 text-gray-400" />
            <span>No calculations yet</span>
            <span className="text-[11px] text-gray-600 mt-1">
              Completed calculations will appear here.
            </span>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectResult(item.result)}
              className="group p-3 rounded-xl bg-[#161920] border border-white/[0.04] hover:border-[#55DFFF]/40 hover:bg-[#1A1F29] transition-all cursor-pointer flex flex-col gap-1 text-right"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectResult(item.result);
                }
              }}
            >
              <div className="font-mono-numbers text-xs text-gray-400 truncate flex items-center justify-between">
                <span className="text-[10px] text-gray-500 font-sans">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span>{item.expression}</span>
              </div>
              <div className="flex items-center justify-end gap-1.5 text-base sm:text-lg font-mono-numbers font-medium text-[#55DFFF]">
                <span>{item.result}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer hint */}
      {history.length > 0 && (
        <div className="pt-2 text-center text-[11px] text-gray-500 border-t border-white/[0.04] mt-2">
          Click an entry to load its result
        </div>
      )}
    </div>
  );
};
