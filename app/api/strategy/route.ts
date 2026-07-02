import { NextRequest, NextResponse } from "next/server";
import { blackScholes } from "../../lib/blackScholes";

// ── Monte Carlo engine ─────────────────────────────────────────────────────

function runMonteCarlo(
  S: number,       // current price
  sigma: number,   // implied volatility
  T: number,       // time to expiration in years
  r: number,       // risk-free rate
  simulations: number,
  steps: number
) {
  const dt = T / steps;
  const paths: number[][] = [];

  for (let i = 0; i < simulations; i++) {
    const path: number[] = [S];
    let price = S;

    for (let j = 0; j < steps; j++) {
      // Box-Muller transform for normal random number
      const u1 = Math.random(), u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      price = price * Math.exp((r - 0.5 * sigma ** 2) * dt + sigma * Math.sqrt(dt) * z);
      path.push(price);
    }

    paths.push(path);
  }

  return paths;
}

// ── Route handler ──────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      ticker,
      currentPrice,
      strikePrice,
      expirationDays,
      impliedVolatility,
      optionType,        // "call" | "put"
      simulations = 200,
    } = body;

    if (!currentPrice || !strikePrice || !expirationDays || !impliedVolatility || !optionType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const T = expirationDays / 365;
    const r = 0.05; // risk-free rate (approx US treasury)
    const sigma = impliedVolatility / 100;

    // 1. Black-Scholes pricing + Greeks
    const options = blackScholes(currentPrice, strikePrice, T, r, sigma, optionType);

    // 2. Monte Carlo simulation
    const steps = Math.min(expirationDays, 50);
    const paths = runMonteCarlo(currentPrice, sigma, T, r, simulations, steps);

    // 3. Calculate P&L for each simulation
    const finalPrices = paths.map(p => p[p.length - 1]);
    const pnl = finalPrices.map(finalPrice => {
      const payoff = optionType === "call"
        ? Math.max(finalPrice - strikePrice, 0)
        : Math.max(strikePrice - finalPrice, 0);
      return payoff - options.price; // profit/loss after premium
    });

    // 4. Summary stats
    const profitable = pnl.filter(p => p > 0).length;
    const avgProfit = pnl.filter(p => p > 0).reduce((a, b) => a + b, 0) / (profitable || 1);
    const avgLoss = pnl.filter(p => p <= 0).reduce((a, b) => a + b, 0) / ((simulations - profitable) || 1);

    return NextResponse.json({
      ticker,
      optionType,
      currentPrice,
      strikePrice,
      expirationDays,
      impliedVolatility,
      blackScholes: {
        price: +options.price.toFixed(4),
        delta: +options.delta.toFixed(4),
        gamma: +options.gamma.toFixed(4),
        theta: +options.theta.toFixed(4),
        vega:  +options.vega.toFixed(4),
      },
      monteCarlo: {
        simulations,
        paths: paths.slice(0, 50), // send 50 paths to frontend for charting
        profitProbability: +((profitable / simulations) * 100).toFixed(1),
        avgProfit: +avgProfit.toFixed(2),
        avgLoss:  +avgLoss.toFixed(2),
      },
    });

  } catch {
    return NextResponse.json({ error: "Simulation failed" }, { status: 500 });
  }
}
