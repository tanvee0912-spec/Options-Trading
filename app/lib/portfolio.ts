// app/lib/portfolio.ts

import { Portfolio, Position, STARTING_BALANCE } from './types';

const STORAGE_KEY = 'quantshield_portfolio';

export function getPortfolio(): Portfolio {
  if (typeof window === 'undefined') {
    return { cashBalance: STARTING_BALANCE, startingBalance: STARTING_BALANCE, positions: [] };
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const fresh: Portfolio = {
      cashBalance: STARTING_BALANCE,
      startingBalance: STARTING_BALANCE,
      positions: [],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }
  return JSON.parse(stored);
}

export function savePortfolio(portfolio: Portfolio): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
}

export function openPosition(newPosition: Omit<Position, 'id' | 'status'>): Portfolio {
  const portfolio = getPortfolio();
  const cost = newPosition.entryPrice * 100 * newPosition.contracts;

  if (cost > portfolio.cashBalance) {
    throw new Error('Insufficient paper trading balance');
  }

  const position: Position = {
    ...newPosition,
    id: crypto.randomUUID(),
    status: 'open',
  };

  portfolio.cashBalance -= cost;
  portfolio.positions.push(position);
  savePortfolio(portfolio);
  return portfolio;
}

export function closePosition(positionId: string, exitPrice: number): Portfolio {
  const portfolio = getPortfolio();
  const position = portfolio.positions.find(p => p.id === positionId);
  if (!position || position.status !== 'open') {
    throw new Error('Position not found or already closed');
  }

  const proceeds = exitPrice * 100 * position.contracts;
  portfolio.cashBalance += proceeds;
  position.status = 'closed';
  position.exitPrice = exitPrice;
  position.exitDate = new Date().toISOString();

  savePortfolio(portfolio);
  return portfolio;
}

export function settlePosition(positionId: string, settlementPrice: number): Portfolio {
  const portfolio = getPortfolio();
  const position = portfolio.positions.find(p => p.id === positionId);
  if (!position || position.status !== 'open') {
    return portfolio;
  }

  const intrinsic = position.type === 'call'
    ? Math.max(settlementPrice - position.strike, 0)
    : Math.max(position.strike - settlementPrice, 0);

  const proceeds = intrinsic * 100 * position.contracts;
  portfolio.cashBalance += proceeds;
  position.status = 'expired';
  position.exitPrice = intrinsic;
  position.exitDate = new Date().toISOString();

  savePortfolio(portfolio);
  return portfolio;
}

export function resetPortfolio(): Portfolio {
  const fresh: Portfolio = {
    cashBalance: STARTING_BALANCE,
    startingBalance: STARTING_BALANCE,
    positions: [],
  };
  savePortfolio(fresh);
  return fresh;
}