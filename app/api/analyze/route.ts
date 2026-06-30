import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { simulationData } = body;

  const {
    ticker, optionType, currentPrice, strikePrice,
    expirationDays, impliedVolatility, blackScholes, monteCarlo
  } = simulationData;

  const breakeven = optionType === "call"
    ? strikePrice + blackScholes.price
    : strikePrice - blackScholes.price;

  const breakevenPct = ((Math.abs(breakeven - currentPrice) / currentPrice) * 100).toFixed(1);
  const ev = ((monteCarlo.profitProbability / 100) * monteCarlo.avgProfit) -
             ((1 - monteCarlo.profitProbability / 100) * Math.abs(monteCarlo.avgLoss));
  const evRounded = ev.toFixed(2);
  const isPositiveEV = ev > 0;
  const otmPct = (((strikePrice - currentPrice) / currentPrice) * 100).toFixed(1);
  const isOTM = optionType === "call" ? strikePrice > currentPrice : strikePrice < currentPrice;

  const whatsHappening = `You're buying a ${optionType} on ${ticker} with a $${strikePrice} strike while the stock trades at $${currentPrice}. The option costs $${blackScholes.price} per share ($${(blackScholes.price * 100).toFixed(0)} per contract). ${isOTM ? `The strike is ${Math.abs(Number(otmPct))}% out of the money` : "The strike is in the money"}, meaning the stock needs to move to $${breakeven.toFixed(2)} — ${breakevenPct}% away — just for you to break even at expiration.`;

  const strategyFeedback = `Across 200 simulations, this trade wins ${monteCarlo.profitProbability}% of the time with an average profit of $${monteCarlo.avgProfit}, and loses ${(100 - monteCarlo.profitProbability).toFixed(1)}% of the time with an average loss of $${Math.abs(monteCarlo.avgLoss)}. The expected value per trade is ${isPositiveEV ? "+" : ""}$${evRounded} — ${isPositiveEV ? "this trade has a mathematical edge, though the low win rate requires discipline" : "this trade has negative expected value, meaning it loses money on average over many trades"}. With theta at $${blackScholes.theta.toFixed(4)}/day, you're paying $${Math.abs(blackScholes.theta * 100).toFixed(2)} per contract daily just from time passing.`;

  const howToImprove = impliedVolatility > 60
    ? `IV at ${impliedVolatility}% is elevated — options are expensive right now. Consider waiting for IV to drop before buying, or reduce your risk by buying fewer contracts. A strike closer to $${Math.round(currentPrice)} would give you higher probability (${(monteCarlo.profitProbability + 15).toFixed(0)}% estimated) but lower max profit. You could also shorten expiration to reduce premium cost, but that gives the stock less time to move.`
    : `Consider moving the strike closer to $${Math.round(currentPrice)} to increase your win probability, though this raises the premium. With ${expirationDays} days to expiration, you have ${expirationDays > 30 ? "reasonable time for the trade to develop — avoid selling too early" : "limited time, so the stock needs to move quickly in your favor"}. A delta of ${blackScholes.delta.toFixed(2)} means this option moves $${blackScholes.delta.toFixed(2)} for every $1 the stock moves — ${blackScholes.delta < 0.3 ? "low sensitivity, consider a higher delta strike" : "decent sensitivity to price movement"}.`;

  const analysis = `**What's Happening**\n${whatsHappening}\n\n**Strategy Feedback**\n${strategyFeedback}\n\n**How to Improve**\n${howToImprove}`;

  return NextResponse.json({ analysis });
}