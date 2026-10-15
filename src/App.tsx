import { useState, useEffect, useCallback, useMemo } from 'react';
import { History as HistoryIcon, Volume2, VolumeX, HelpCircle, Sparkles } from 'lucide-react';
import { Display } from './components/Display';
import { Keypad } from './components/Keypad';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ShortcutsModal } from './components/ShortcutsModal';
import { Operator, HistoryItem } from './types';
import { evaluateTokens, isOperator, roundPrecision, formatExpression } from './utils/calculatorEngine';
import { playKeyClick } from './utils/sound';

const HISTORY_STORAGE_KEY = 'diamond_calculator_history';
const SOUND_STORAGE_KEY = 'diamond_calculator_sound';

export default function App() {
  const [display, setDisplay] = useState<string>('0');
  const [tokens, setTokens] = useState<string[]>([]);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  const [activeOperator, setActiveOperator] = useState<Operator | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Modals & Panels
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  // Sound preference
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SOUND_STORAGE_KEY);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // History list
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SOUND_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const addHistoryItem = useCallback((expr: string, res: string) => {
    const newItem: HistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      expression: expr,
      result: res,
      timestamp: Date.now(),
    };
    setHistory((prev) => {
      const updated = [newItem, ...prev.slice(0, 49)];
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  // Calculator logic handlers
  const handleDigit = useCallback(
    (digit: string) => {
      playKeyClick('number', soundEnabled);

      if (error) {
        setError(null);
        setDisplay(digit);
        setTokens([]);
        setWaitingForOperand(false);
        setHasCalculated(false);
        setActiveOperator(null);
        return;
      }

      if (hasCalculated) {
        setDisplay(digit);
        setTokens([]);
        setWaitingForOperand(false);
        setHasCalculated(false);
        setActiveOperator(null);
        return;
      }

      if (waitingForOperand) {
        setDisplay(digit);
        setWaitingForOperand(false);
        setActiveOperator(null);
        return;
      }

      setDisplay((prev) => {
        if (prev === '0') return digit;
        if (prev === '-0') return '-' + digit;
        // Limit digit length to prevent overflow while entering
        if (prev.replace(/[^0-9]/g, '').length >= 14) return prev;
        return prev + digit;
      });
    },
    [error, hasCalculated, waitingForOperand, soundEnabled]
  );

  const handleDecimal = useCallback(() => {
    playKeyClick('number', soundEnabled);

    if (error || hasCalculated) {
      setError(null);
      setDisplay('0.');
      setTokens([]);
      setWaitingForOperand(false);
      setHasCalculated(false);
      setActiveOperator(null);
      return;
    }

    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      setActiveOperator(null);
      return;
    }

    setDisplay((prev) => {
      if (prev.includes('.')) return prev;
      return prev + '.';
    });
  }, [error, hasCalculated, waitingForOperand, soundEnabled]);

  const handleNegate = useCallback(() => {
    playKeyClick('number', soundEnabled);
    if (error) return;

    if (hasCalculated) {
      const val = parseFloat(display);
      if (isNaN(val)) return;
      const negated = (-val).toString();
      setDisplay(negated);
      setTokens([]);
      setHasCalculated(false);
      return;
    }

    setDisplay((prev) => {
      if (prev === '0') return '0';
      if (prev.startsWith('-')) return prev.slice(1);
      return '-' + prev;
    });
  }, [error, hasCalculated, display, soundEnabled]);

  const handleOperator = useCallback(
    (op: Operator) => {
      playKeyClick('operator', soundEnabled);
      if (error) return;

      if (hasCalculated) {
        // Chained calculation using previous result
        setTokens([display, op]);
        setWaitingForOperand(true);
        setActiveOperator(op);
        setHasCalculated(false);
        return;
      }

      if (waitingForOperand) {
        // Change operator if pressed in succession
        setTokens((prev) => {
          if (prev.length === 0) return [display, op];
          const newTokens = [...prev];
          if (isOperator(newTokens[newTokens.length - 1])) {
            newTokens[newTokens.length - 1] = op;
          } else {
            newTokens.push(op);
          }
          return newTokens;
        });
        setActiveOperator(op);
        return;
      }

      // Append current display and operator
      setTokens((prev) => [...prev, display, op]);
      setWaitingForOperand(true);
      setActiveOperator(op);
    },
    [error, hasCalculated, waitingForOperand, display, soundEnabled]
  );

  const handlePercentage = useCallback(() => {
    playKeyClick('operator', soundEnabled);
    if (error) return;

    const currentVal = parseFloat(display);
    if (isNaN(currentVal)) return;

    if (tokens.length >= 2) {
      const lastOp = tokens[tokens.length - 1];
      const baseVal = parseFloat(tokens[tokens.length - 2]);

      let pctVal: number;
      if (!isNaN(baseVal) && (lastOp === '+' || lastOp === '-')) {
        // Percentage of base value (e.g., 200 + 10% => 200 + 20)
        pctVal = roundPrecision((baseVal * currentVal) / 100);
      } else {
        pctVal = roundPrecision(currentVal / 100);
      }
      setDisplay(pctVal.toString());
    } else {
      // Standalone percentage (e.g., 50% => 0.5)
      const pctVal = roundPrecision(currentVal / 100);
      setDisplay(pctVal.toString());
    }
  }, [error, display, tokens, soundEnabled]);

  const handleEquals = useCallback(() => {
    playKeyClick('equals', soundEnabled);
    if (error) return;

    if (tokens.length === 0) {
      // No expression pending
      return;
    }

    const fullTokens = [...tokens];
    if (!waitingForOperand) {
      fullTokens.push(display);
    }

    const { result, error: evalError } = evaluateTokens(fullTokens);

    if (evalError) {
      setError(evalError);
      setDisplay(evalError);
      setActiveOperator(null);
      setWaitingForOperand(false);
    } else {
      const exprStr = formatExpression(fullTokens, undefined, true);
      const resStr = result.toString();
      setDisplay(resStr);
      setTokens(fullTokens);
      setHasCalculated(true);
      setActiveOperator(null);
      setWaitingForOperand(false);
      setError(null);
      addHistoryItem(exprStr, resStr);
    }
  }, [error, tokens, waitingForOperand, display, addHistoryItem, soundEnabled]);

  const handleClear = useCallback(() => {
    playKeyClick('clear', soundEnabled);
    setDisplay('0');
    setTokens([]);
    setWaitingForOperand(false);
    setHasCalculated(false);
    setActiveOperator(null);
    setError(null);
  }, [soundEnabled]);

  const handleDelete = useCallback(() => {
    playKeyClick('clear', soundEnabled);
    if (error) {
      handleClear();
      return;
    }

    if (hasCalculated) {
      setTokens([]);
      setHasCalculated(false);
      return;
    }

    if (waitingForOperand) return;

    setDisplay((prev) => {
      if (prev.length <= 1 || (prev.length === 2 && prev.startsWith('-'))) {
        return '0';
      }
      return prev.slice(0, -1);
    });
  }, [error, hasCalculated, waitingForOperand, handleClear, soundEnabled]);

  const handleSelectHistoryResult = (result: string) => {
    setDisplay(result);
    setTokens([]);
    setWaitingForOperand(false);
    setHasCalculated(true);
    setActiveOperator(null);
    setError(null);
    setIsHistoryOpen(false);
  };

  // Keyboard navigation & hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture if user is in an input or modal input
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }

      // Handle copy (Ctrl+C / Cmd+C)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
        // Let native copy run or copy display
        navigator.clipboard?.writeText(display).catch(() => {});
        return;
      }

      // Flash visual key
      setPressedKey(e.key);
      const timer = setTimeout(() => setPressedKey(null), 150);

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === '.' || e.key === ',') {
        e.preventDefault();
        handleDecimal();
      } else if (e.key === '+') {
        e.preventDefault();
        handleOperator('+');
      } else if (e.key === '-') {
        e.preventDefault();
        handleOperator('-');
      } else if (e.key === '*' || e.key === 'x' || e.key === 'X') {
        e.preventDefault();
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleDelete();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (isHistoryOpen) {
          setIsHistoryOpen(false);
        } else if (isShortcutsOpen) {
          setIsShortcutsOpen(false);
        } else {
          handleClear();
        }
      } else if (e.key === '%') {
        e.preventDefault();
        handlePercentage();
      } else if (e.key === 'n' || e.key === 'N' || e.key === '_') {
        e.preventDefault();
        handleNegate();
      }

      return () => clearTimeout(timer);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    display,
    handleDigit,
    handleDecimal,
    handleOperator,
    handleEquals,
    handleDelete,
    handleClear,
    handlePercentage,
    handleNegate,
    isHistoryOpen,
    isShortcutsOpen,
  ]);

  // Expression string shown above main display
  const expressionString = useMemo(() => {
    if (hasCalculated) {
      return formatExpression(tokens, undefined, true);
    }
    if (tokens.length === 0) {
      return '';
    }
    return tokens.join(' ');
  }, [hasCalculated, tokens]);

  return (
    <div className="min-h-screen bg-[#111318] text-[#F3F4F6] flex flex-col items-center justify-center p-3 sm:p-6 select-none relative overflow-x-hidden">
      {/* Background ambient diamond glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#55DFFF]/5 rounded-full blur-[140px]"
        aria-hidden="true"
      />

      {/* Main Calculator Container */}
      <main className="relative w-full max-w-[380px] sm:max-w-[400px] bg-[#16181F] border border-white/[0.08] rounded-3xl p-4 sm:p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-sm z-10 transition-all">
        {/* Top Header Bar */}
        <header className="flex items-center justify-between pb-3 mb-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#55DFFF] shadow-[0_0_8px_#55DFFF]" />
            <h1 className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-gray-300 font-display">
              Diamond Calc
            </h1>
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center gap-1">
            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              type="button"
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.06] active:scale-95 transition-all cursor-pointer"
              title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
              aria-label={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-[#55DFFF]" />
              ) : (
                <VolumeX className="w-4 h-4 text-gray-500" />
              )}
            </button>

            {/* History Toggle */}
            <button
              onClick={() => {
                setIsHistoryOpen((prev) => !prev);
                setIsShortcutsOpen(false);
              }}
              type="button"
              className={`p-2 rounded-xl active:scale-95 transition-all cursor-pointer ${
                isHistoryOpen
                  ? 'bg-[#55DFFF]/15 text-[#55DFFF]'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
              }`}
              title="History"
              aria-label="History"
            >
              <HistoryIcon className="w-4 h-4" />
            </button>

            {/* Keyboard Shortcuts Guide */}
            <button
              onClick={() => {
                setIsShortcutsOpen((prev) => !prev);
                setIsHistoryOpen(false);
              }}
              type="button"
              className={`p-2 rounded-xl active:scale-95 transition-all cursor-pointer ${
                isShortcutsOpen
                  ? 'bg-[#55DFFF]/15 text-[#55DFFF]'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
              }`}
              title="Keyboard shortcuts"
              aria-label="Keyboard shortcuts"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Display Screen */}
        <Display expression={expressionString} displayValue={display} error={error} />

        {/* Keypad */}
        <Keypad
          onDigit={handleDigit}
          onOperator={handleOperator}
          onEquals={handleEquals}
          onClear={handleClear}
          onDelete={handleDelete}
          onDecimal={handleDecimal}
          onNegate={handleNegate}
          onPercentage={handlePercentage}
          activeOperator={activeOperator}
          pressedKey={pressedKey}
        />

        {/* Slide-over Overlays */}
        <HistoryDrawer
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          history={history}
          onSelectResult={handleSelectHistoryResult}
          onClearHistory={handleClearHistory}
        />

        <ShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
      </main>

      {/* Subtle bottom footer info */}
      <footer className="mt-4 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#55DFFF]/60" />
        <span>Precision Arithmetic</span>
        <span aria-hidden="true">·</span>
        <span>Keyboard Ready</span>
      </footer>
    </div>
  );
}
