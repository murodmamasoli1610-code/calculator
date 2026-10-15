// Precision-safe arithmetic and expression evaluator for Diamond Calculator

export function roundPrecision(num: number): number {
  if (!isFinite(num)) return num;
  // Eliminate 0.1 + 0.2 floating point dust
  return Number(Math.round(Number(num + 'e12')) + 'e-12');
}

export function evaluateTokens(tokens: string[]): { result: number; error: string | null } {
  if (tokens.length === 0) {
    return { result: 0, error: null };
  }

  // Filter or clone tokens
  const cleanTokens = [...tokens];

  // If the last token is an operator, remove it for evaluation
  if (isOperator(cleanTokens[cleanTokens.length - 1])) {
    cleanTokens.pop();
  }

  if (cleanTokens.length === 0) {
    return { result: 0, error: null };
  }

  // Pass 1: Handle multiplication (×) and division (÷)
  const pass1Tokens: string[] = [];
  let i = 0;
  while (i < cleanTokens.length) {
    const token = cleanTokens[i];

    if (token === '×' || token === '÷') {
      const prev = pass1Tokens.pop();
      const next = cleanTokens[i + 1];

      if (prev === undefined || next === undefined) {
        return { result: 0, error: 'Malformed expression' };
      }

      const num1 = parseFloat(prev);
      const num2 = parseFloat(next);

      if (isNaN(num1) || isNaN(num2)) {
        return { result: 0, error: 'Invalid number' };
      }

      let subResult = 0;
      if (token === '×') {
        subResult = roundPrecision(num1 * num2);
      } else {
        if (num2 === 0) {
          return { result: 0, error: 'Cannot divide by zero' };
        }
        subResult = roundPrecision(num1 / num2);
      }

      pass1Tokens.push(subResult.toString());
      i += 2; // skip operator and next number
    } else {
      pass1Tokens.push(token);
      i++;
    }
  }

  // Pass 2: Handle addition (+) and subtraction (-)
  let total = parseFloat(pass1Tokens[0]);
  if (isNaN(total)) {
    return { result: 0, error: 'Invalid number' };
  }

  let j = 1;
  while (j < pass1Tokens.length) {
    const op = pass1Tokens[j];
    const nextToken = pass1Tokens[j + 1];

    if (nextToken === undefined) break;
    const num = parseFloat(nextToken);

    if (isNaN(num)) {
      return { result: 0, error: 'Invalid number' };
    }

    if (op === '+') {
      total = roundPrecision(total + num);
    } else if (op === '-') {
      total = roundPrecision(total - num);
    }
    j += 2;
  }

  return { result: roundPrecision(total), error: null };
}

export function isOperator(token: string | undefined): boolean {
  return token === '+' || token === '-' || token === '×' || token === '÷';
}

/**
 * Formats a raw number string or calculation result for display.
 * Retains trailing dot and trailing zeroes while typing.
 */
export function formatDisplayNumber(valueStr: string): string {
  if (valueStr === 'Cannot divide by zero' || valueStr === 'Error' || valueStr === 'Infinity' || valueStr === '-Infinity') {
    return valueStr;
  }

  if (valueStr === '' || valueStr === '-') {
    return valueStr;
  }

  // Check for scientific notation already
  if (valueStr.includes('e') || valueStr.includes('E')) {
    return valueStr;
  }

  const isNegative = valueStr.startsWith('-');
  const unsigned = isNegative ? valueStr.slice(1) : valueStr;

  const hasDot = unsigned.includes('.');
  const [intPart, decimalPart = ''] = unsigned.split('.');

  // If number exceeds threshold, convert to scientific notation
  const numValue = parseFloat(valueStr);
  if (isFinite(numValue) && (Math.abs(numValue) >= 1e14 || (Math.abs(numValue) > 0 && Math.abs(numValue) < 1e-7))) {
    return numValue.toExponential(6).replace(/\+/, '');
  }

  // Format integer part with commas
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (hasDot) {
    return `${isNegative ? '-' : ''}${formattedInt}.${decimalPart}`;
  }

  return `${isNegative ? '-' : ''}${formattedInt}`;
}

/**
 * Formats the tokens array and current active operand into a readable expression string.
 */
export function formatExpression(tokens: string[], currentDisplay?: string, isFinished?: boolean): string {
  if (isFinished) {
    return `${tokens.join(' ')} =`;
  }

  if (tokens.length === 0) {
    return '';
  }

  return tokens.join(' ');
}
