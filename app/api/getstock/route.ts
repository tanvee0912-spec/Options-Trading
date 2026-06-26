import { NextRequest, NextResponse } from "next/server";

const POLYGON_API_KEY = process.env.POLYGON_API_KEY;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ticker = searchParams.get("ticker")?.toUpperCase();

  if (!ticker) {
    return NextResponse.json({ error: "Ticker is required" }, { status: 400 });
  }

  try {
    // 1. Get latest price
    const priceRes = await fetch(
      `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`
    );
    const priceData = await priceRes.json();

    // 2. Get historical data (last 90 days)
    const toDate = new Date().toISOString().split("T")[0];
    const fromDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const histRes = await fetch(
      `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${fromDate}/${toDate}?adjusted=true&sort=asc&apiKey=${POLYGON_API_KEY}`
    );
    const histData = await histRes.json();

    // 3. Check if we got valid data
    if (!priceData.results || priceData.results.length === 0) {
      return NextResponse.json({ error: "Ticker not found" }, { status: 404 });
    }

    const latest = priceData.results[0];

    return NextResponse.json({
      ticker,
      price: latest.c,           // closing price
      open: latest.o,            // open
      high: latest.h,            // high
      low: latest.l,             // low
      volume: latest.v,          // volume
      timestamp: latest.t,       // timestamp
      isDelayed: true,           // free tier is delayed
      history: histData.results || [],
    });

  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stock data" }, { status: 500 });
  }
}