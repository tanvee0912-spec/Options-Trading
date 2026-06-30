
import { NextRequest, NextResponse } from "next/server";
 
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ticker = searchParams.get("ticker")?.toUpperCase();
  const expiration = searchParams.get("expiration"); // YYYY-MM-DD
  const type = searchParams.get("type") ?? "call";   // "call" | "put"
 
  if (!ticker || !expiration) {
    return NextResponse.json({ error: "ticker and expiration are required" }, { status: 400 });
  }
 
  try {
    // Convert YYYY-MM-DD to Unix timestamp for Yahoo
    const ts = Math.floor(new Date(expiration).getTime() / 1000);
 
    const res = await fetch(
      `https://query1.finance.yahoo.com/v7/finance/options/${ticker}?date=${ts}`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );
    const data = await res.json();
 
    const result = data?.optionChain?.result?.[0];
    if (!result) {
      return NextResponse.json({ error: "No chain data found" }, { status: 404 });
    }
 
    const currentPrice: number = result.quote?.regularMarketPrice ?? 0;
    const raw = type === "call" ? result.options?.[0]?.calls : result.options?.[0]?.puts;
 
    if (!raw || raw.length === 0) {
      return NextResponse.json({ error: "No contracts found for this expiration" }, { status: 404 });
    }
 
    // Calculate days to expiration
    const today = new Date();
    const expDate = new Date(expiration);
    const daysToExp = Math.max(1, Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
 
    const contracts = raw.map((c: any) => ({
      strike: c.strike,
      premium: c.lastPrice ?? c.ask ?? 0,
      iv: c.impliedVolatility ? +(c.impliedVolatility * 100).toFixed(1) : null, // as %
      volume: c.volume ?? 0,
      openInterest: c.openInterest ?? 0,
      inTheMoney: c.inTheMoney ?? false,
    }));
 
    return NextResponse.json({
      ticker,
      expiration,
      daysToExpiration: daysToExp,
      currentPrice,
      type,
      contracts,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch options chain" }, { status: 500 });
  }
}