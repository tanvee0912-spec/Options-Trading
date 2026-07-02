// app/lib/types.ts

export interface Greeks {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
}

export interface Position {
  id: string;
  ticker: string;
  type: 'call' | 'put';
  strike: number;
  expirationDate: string;   // ISO date string, e.g. "2026-08-01"
  contracts: number;
  entryPrice: number;       // Black-Scholes price per share at entry
  entryDate: string;
  entryGreeks: Greeks;
  impliedVolatility: number; // IV used at entry, needed to reprice later
  status: 'open' | 'closed' | 'expired';
  exitPrice?: number;
  exitDate?: string;
}

export interface Portfolio {
  cashBalance: number;
  startingBalance: number;
  positions: Position[];
}

export const STARTING_BALANCE = 10000;
