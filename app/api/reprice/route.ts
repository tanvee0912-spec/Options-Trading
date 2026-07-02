import { NextRequest, NextResponse } from "next/server";
import { blackScholes } from "../../lib/blackScholes";

export async function POST(req: NextRequest) {
  try {
    const { currentPrice, strikePrice, daysToExpiration, impliedVolatility, optionType } = await req.json();

    if (
      currentPrice == null ||
      strikePrice == null ||
      daysToExpiration == null ||
      impliedVolatility == null ||
      !optionType
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const T = Math.max(daysToExpiration, 0) / 365;
    const r = 0.05; // risk-free rate (approx US treasury)
    const sigma = impliedVolatility / 100;

    const result = blackScholes(currentPrice, strikePrice, T, r, sigma, optionType);

    return NextResponse.json({
      price: +result.price.toFixed(4),
      delta: +result.delta.toFixed(4),
      gamma: +result.gamma.toFixed(4),
      theta: +result.theta.toFixed(4),
      vega: +result.vega.toFixed(4),
    });
  } catch {
    return NextResponse.json({ error: "Repricing failed" }, { status: 500 });
  }
}
