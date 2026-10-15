export type Operator = '+' | '-' | '×' | '÷';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export interface CalculatorState {
  display: string; // The primary number or error shown on screen
  expression: string; // The formula history string, e.g. "12 + 4 × 2"
  tokens: string[]; // Token stream for precedence evaluation
  waitingForOperand: boolean;
  hasCalculated: boolean;
  error: string | null;
}
