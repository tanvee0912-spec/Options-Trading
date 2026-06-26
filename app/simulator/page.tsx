"use client";

import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ReferenceLine, ResponsiveContainer, AreaChart, Area
} from "recharts";

// ── Types ──────────────────────────────────────────────────────────────────

interface SimulationResult {
  ticker: string;
  optionType: string;
  currentPrice: number;
  strikePrice: number;
  expirationDays: number;
  impliedVolatility: number;
  blackScholes: {
    price: number;
    delta: number;
    gamma: number;
    theta: number;
    vega: number;
  };
  monteCarlo: {
    simulations: number;
    paths: number[][];
    profitProbability: number;
    avgProfit: number;
    avgLoss: number;
  };
}

// ── Education Content ──────────────────────────────────────────────────────

const EDU: Record<string, { title: string; def: string; why: string; example: string }> = {
  "Option Price": {
    title: "Option Price (Premium)",
    def: "The cost to buy this option contract, calculated using the Black-Scholes model.",
    why: "This is your maximum loss if you buy the option and it expires worthless. Lower premium = less risk but usually lower probability of profit.",
    example: "If the premium is $14.44, you pay $1,444 for 1 contract (100 shares). The stock must move enough for your payout to exceed that cost.",
  },
  "Profit Probability": {
    title: "Profit Probability",
    def: "The percentage of Monte Carlo simulations where this trade made money at expiration.",
    why: "Gives you a realistic sense of your odds — not a guarantee, but a data-driven estimate based on how volatile the stock has been.",
    example: "25% probability doesn't mean skip it. If your avg profit ($33) is much larger than avg loss ($13), the trade can still have positive expected value.",
  },
  "Avg Profit": {
    title: "Average Profit",
    def: "The mean profit across all simulations where the trade finished in the money.",
    why: "Tells you what a typical win looks like. Combine with Profit Probability to estimate expected value: (prob × avg profit) − ((1−prob) × avg loss).",
    example: "Avg profit of $33 with 25% win rate = $8.25 expected gain per simulation. Compare that to avg loss × 75% to see the full picture.",
  },
  "Avg Loss": {
    title: "Average Loss",
    def: "The mean loss across simulations where the trade expired worthless or out of the money.",
    why: "For a long option, your max loss is capped at the premium paid. This shows what you typically lose when the trade goes against you.",
    example: "If avg loss is $13.64, most losing trades lose close to the full premium. That's expected — options either work or they don't.",
  },
  "Breakeven": {
    title: "Breakeven Price",
    def: "The stock price at expiration where this trade neither profits nor loses money.",
    why: "The stock must cross this price for you to make money. The further breakeven is from today's price, the harder the trade is to win.",
    example: "Breakeven of $322 with stock at $293 means the stock needs to rise ~10% just to break even. Factor in your time horizon.",
  },
  "Delta": {
    title: "Delta (Δ)",
    def: "How much the option price moves for every $1 change in the stock price.",
    why: "Delta tells you your immediate exposure. It also approximates the probability that the option expires in the money.",
    example: "Delta of 0.43 means if the stock goes up $1, your option gains ~$0.43. It also suggests ~43% chance of finishing in the money.",
  },
  "Gamma": {
    title: "Gamma (Γ)",
    def: "How much Delta changes for every $1 move in the stock price.",
    why: "High gamma = your delta (and exposure) shifts rapidly as the stock moves. Matters most when you're close to the strike or expiration.",
    example: "Gamma of 0.008 means if stock rises $1, delta increases from 0.43 to 0.438. Small now, but compounds on big moves.",
  },
  "Theta": {
    title: "Theta (Θ) — Time Decay",
    def: "How much value your option loses each day just from time passing, holding everything else constant.",
    why: "Time decay is the silent enemy of option buyers. Every day that passes without a big move costs you money. Sellers benefit from this.",
    example: "Theta of -$0.35/day means your option loses $35 in value per contract per day. After 10 days with no move: -$350.",
  },
  "Vega": {
    title: "Vega (ν) — Volatility Sensitivity",
    def: "How much the option price changes for every 1% change in implied volatility.",
    why: "Options get more expensive when volatility rises (more uncertainty = bigger potential swings). Vega measures your exposure to that shift.",
    example: "Vega of 0.33 means if IV jumps from 60% to 61%, your option gains ~$0.33 in value — even if the stock doesn't move.",
  },
};

// ── Education Drawer ────────────────────────────────────────────────────────

function EduDrawer({ topic, onClose }: { topic: string | null; onClose: () => void }) {
  if (!topic) return null;
  const content = EDU[topic];
  if (!content) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 40,
        }}
      />
      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 360,
        background: "#0d150d", borderLeft: "0.5px solid #2a3a2a",
        zIndex: 50, padding: "28px 24px", overflowY: "auto",
        display: "flex", flexDirection: "column", gap: 20,
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ fontSize: 11, color: "#5fc97a", textTransform: "uppercase", letterSpacing: 1.5 }}>
            Education
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#5a7a5a", fontSize: 18, cursor: "pointer", lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        {/* Title */}
        <div style={{ fontSize: 20, fontWeight: 600, color: "#eaf4ea", lineHeight: 1.3 }}>
          {content.title}
        </div>

        {/* Sections */}
        {[
          { label: "What it is", text: content.def, color: "#7a9c7a" },
          { label: "Why it matters", text: content.why, color: "#5fc97a" },
          { label: "Example", text: content.example, color: "#5a7a5a" },
        ].map(({ label, text, color }) => (
          <div key={label} style={{
            background: "#111811", border: "0.5px solid #1e2e1e",
            borderRadius: 8, padding: "14px 16px",
          }}>
            <div style={{ fontSize: 10, color, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>
              {label}
            </div>
            <div style={{ fontSize: 13, color: "#b0ccb0", lineHeight: 1.6 }}>
              {text}
            </div>
          </div>
        ))}

        {/* Footer hint */}
        <div style={{ fontSize: 11, color: "#3a5a3a", marginTop: "auto", paddingTop: 8 }}>
          Click any metric card to learn more about it.
        </div>
      </div>
    </>
  );
}

// ── Clickable Stat Card ─────────────────────────────────────────────────────

function StatCard({
  label, value, sub, onLearn
}: { label: string; value: string; sub: string; onLearn: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onLearn}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#111e11" : "#0d150d",
        border: `0.5px solid ${hovered ? "#3a5a3a" : "#1e2e1e"}`,
        borderRadius: 8, padding: "14px 20px", flex: 1, minWidth: 140,
        cursor: "pointer", transition: "all 0.15s",
        position: "relative",
      }}
    >
      <div style={{ color: "#5a7a5a", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ color: "#5fc97a", fontSize: 20, fontWeight: 600, marginBottom: 2 }}>{value}</div>
      <div style={{ color: "#3a5a3a", fontSize: 11 }}>{sub}</div>
      {/* Learn indicator */}
      <div style={{
        position: "absolute", top: 10, right: 12,
        fontSize: 10, color: "#3a5a3a",
        opacity: hovered ? 1 : 0, transition: "opacity 0.15s",
      }}>
        learn ↗
      </div>
    </div>
  );
}

// ── Clickable Greek Card ────────────────────────────────────────────────────

function GreekCard({
  label, value, description, onLearn
}: { label: string; value: string; description: string; onLearn: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onLearn}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#111e11" : "#111811",
        border: `0.5px solid ${hovered ? "#3a5a3a" : "#2a3a2a"}`,
        borderRadius: 8, padding: "16px", flex: 1, minWidth: 120,
        cursor: "pointer", transition: "all 0.15s",
        position: "relative",
      }}
    >
      <div style={{ color: "#5fc97a", fontSize: 11, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      <div style={{ color: "#eaf4ea", fontSize: 22, fontWeight: 600, marginBottom: 4 }}>{value}</div>
      <div style={{ color: "#5a7a5a", fontSize: 11 }}>{description}</div>
      <div style={{
        position: "absolute", top: 10, right: 12,
        fontSize: 10, color: "#3a5a3a",
        opacity: hovered ? 1 : 0, transition: "opacity 0.15s",
      }}>
        learn ↗
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function SimulatorPage() {
  const [ticker, setTicker] = useState("TSLA");
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [strikePrice, setStrikePrice] = useState("");
  const [expirationDays, setExpirationDays] = useState("30");
  const [impliedVolatility, setImpliedVolatility] = useState("60");
  const [optionType, setOptionType] = useState<"call" | "put">("call");
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingPrice, setFetchingPrice] = useState(false);
  const [error, setError] = useState("");
  const [eduTopic, setEduTopic] = useState<string | null>(null);

  async function fetchPrice() {
    if (!ticker) return;
    setFetchingPrice(true);
    setError("");
    try {
      const res = await fetch(`/api/getstock?ticker=${ticker}`);
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setCurrentPrice(data.price);
      setStrikePrice(Math.round(data.price * 1.05).toString());
    } catch {
      setError("Failed to fetch stock price");
    } finally {
      setFetchingPrice(false);
    }
  }

  async function runSimulation() {
    if (!currentPrice || !strikePrice || !expirationDays || !impliedVolatility) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticker, currentPrice,
          strikePrice: parseFloat(strikePrice),
          expirationDays: parseInt(expirationDays),
          impliedVolatility: parseFloat(impliedVolatility),
          optionType, simulations: 200,
        }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setResult(data);
    } catch {
      setError("Simulation failed");
    } finally {
      setLoading(false);
    }
  }

  function preparePathData() {
    if (!result) return [];
    const steps = result.monteCarlo.paths[0].length;
    return Array.from({ length: steps }, (_, i) => {
      const point: Record<string, number> = { day: Math.round((i / (steps - 1)) * result.expirationDays) };
      result.monteCarlo.paths.slice(0, 50).forEach((path, j) => { point[`p${j}`] = +path[i].toFixed(2); });
      return point;
    });
  }

  function preparePnLData() {
    if (!result) return [];
    const { currentPrice, strikePrice, blackScholes, optionType } = result;
    const min = currentPrice * 0.7, max = currentPrice * 1.3;
    return Array.from({ length: 60 }, (_, i) => {
      const price = min + (i / 59) * (max - min);
      const payoff = optionType === "call" ? Math.max(price - strikePrice, 0) : Math.max(strikePrice - price, 0);
      return { price: +price.toFixed(2), pnl: +(payoff - blackScholes.price).toFixed(2) };
    });
  }

  const pathData = preparePathData();
  const pnlData = preparePnLData();
  const breakeven = result
    ? optionType === "call" ? result.strikePrice + result.blackScholes.price : result.strikePrice - result.blackScholes.price
    : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f0a", color: "#f0f4f0", fontFamily: "sans-serif" }}>

      {/* Education Drawer */}
      <EduDrawer topic={eduTopic} onClose={() => setEduTopic(null)} />

      {/* NAV */}
      <nav style={{ borderBottom: "0.5px solid #1e2e1e", padding: "12px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "#5fc97a", fontWeight: 600, fontSize: 16 }}>QuantShield</span>
        <span style={{ color: "#7a9c7a", fontSize: 13 }}>Simulator</span>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

        {/* HEADER */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: "#eaf4ea", marginBottom: 8 }}>Options Simulator</h1>
          <p style={{ color: "#7a9c7a", fontSize: 14 }}>Run Monte Carlo simulations on real options. See every possible outcome before you trade.</p>
        </div>

        {/* INPUT PANEL */}
        <div style={{ background: "#0d150d", border: "0.5px solid #1e2e1e", borderRadius: 12, padding: 24, marginBottom: 32 }}>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end" }}>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 11, color: "#5a7a5a", textTransform: "uppercase", letterSpacing: 1 }}>Ticker</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input value={ticker} onChange={e => setTicker(e.target.value.toUpperCase())}
                  style={{ background: "#111811", border: "0.5px solid #2a3a2a", borderRadius: 6, padding: "8px 12px", color: "#eaf4ea", fontSize: 14, width: 90 }}
                  placeholder="TSLA" />
                <button onClick={fetchPrice} disabled={fetchingPrice}
                  style={{ background: "#1a2e1a", border: "0.5px solid #2e4e2e", borderRadius: 6, padding: "8px 14px", color: "#5fc97a", fontSize: 13, cursor: "pointer" }}>
                  {fetchingPrice ? "..." : "Fetch →"}
                </button>
              </div>
            </div>

            {[
              { label: "Current Price", value: currentPrice ?? "", onChange: (v: string) => setCurrentPrice(parseFloat(v)), placeholder: "$0.00" },
              { label: "Strike Price", value: strikePrice, onChange: (v: string) => setStrikePrice(v), placeholder: "$400" },
              { label: "Expiration (days)", value: expirationDays, onChange: (v: string) => setExpirationDays(v), placeholder: "30" },
              { label: "Implied Vol (%)", value: impliedVolatility, onChange: (v: string) => setImpliedVolatility(v), placeholder: "60" },
            ].map(f => (
              <div key={f.label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 11, color: "#5a7a5a", textTransform: "uppercase", letterSpacing: 1 }}>{f.label}</label>
                <input value={f.value} onChange={e => f.onChange(e.target.value)} type="number" placeholder={f.placeholder}
                  style={{ background: "#111811", border: "0.5px solid #2a3a2a", borderRadius: 6, padding: "8px 12px", color: "#eaf4ea", fontSize: 14, width: 110 }} />
              </div>
            ))}

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 11, color: "#5a7a5a", textTransform: "uppercase", letterSpacing: 1 }}>Type</label>
              <div style={{ display: "flex" }}>
                {(["call", "put"] as const).map(t => (
                  <button key={t} onClick={() => setOptionType(t)} style={{
                    padding: "8px 18px", fontSize: 13, cursor: "pointer", border: "0.5px solid #2a3a2a",
                    background: optionType === t ? "#5fc97a" : "#111811",
                    color: optionType === t ? "#0a0f0a" : "#7a9c7a",
                    borderRadius: t === "call" ? "6px 0 0 6px" : "0 6px 6px 0",
                    fontWeight: optionType === t ? 600 : 400,
                  }}>{t.toUpperCase()}</button>
                ))}
              </div>
            </div>

            <button onClick={runSimulation} disabled={loading || !currentPrice} style={{
              background: loading ? "#1a2e1a" : "#5fc97a", color: "#0a0f0a",
              border: "none", borderRadius: 6, padding: "8px 24px",
              fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? "Running..." : "Run Simulation →"}
            </button>
          </div>

          {error && <div style={{ color: "#e05555", fontSize: 13, marginTop: 12 }}>{error}</div>}
        </div>

        {/* RESULTS */}
        {result && (
          <>
            {/* Education hint */}
            <div style={{ fontSize: 11, color: "#3a5a3a", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "#5fc97a" }}>ⓘ</span>
              Click any card to learn what each number means
            </div>

            {/* STATS BAR */}
            <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
              {[
                { label: "Option Price", value: `$${result.blackScholes.price}`, sub: "Black-Scholes premium" },
                { label: "Profit Probability", value: `${result.monteCarlo.profitProbability}%`, sub: `across ${result.monteCarlo.simulations} simulations` },
                { label: "Avg Profit", value: `+$${result.monteCarlo.avgProfit}`, sub: "when simulation wins" },
                { label: "Avg Loss", value: `-$${Math.abs(result.monteCarlo.avgLoss)}`, sub: "when simulation loses" },
                { label: "Breakeven", value: `$${breakeven.toFixed(2)}`, sub: "at expiration" },
              ].map(s => (
                <StatCard key={s.label} label={s.label} value={s.value} sub={s.sub} onLearn={() => setEduTopic(s.label)} />
              ))}
            </div>

            {/* CHARTS ROW */}
            <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
              <div style={{ background: "#0d150d", border: "0.5px solid #1e2e1e", borderRadius: 12, padding: 24, flex: 2, minWidth: 340 }}>
                <div style={{ fontSize: 13, color: "#7a9c7a", marginBottom: 4 }}>Monte Carlo Price Paths</div>
                <div style={{ fontSize: 11, color: "#3a5a3a", marginBottom: 16 }}>50 simulated price paths over {result.expirationDays} days</div>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={pathData}>
                    <XAxis dataKey="day" stroke="#2a3a2a" tick={{ fill: "#5a7a5a", fontSize: 11 }} label={{ value: "Days", position: "insideBottom", fill: "#5a7a5a", fontSize: 11 }} />
                    <YAxis stroke="#2a3a2a" tick={{ fill: "#5a7a5a", fontSize: 11 }} domain={["auto", "auto"]} />
                    <ReferenceLine y={result.strikePrice} stroke="#5fc97a" strokeDasharray="4 4" label={{ value: "Strike", fill: "#5fc97a", fontSize: 11 }} />
                    <ReferenceLine y={result.currentPrice} stroke="#7a9c7a" strokeDasharray="2 4" label={{ value: "Current", fill: "#7a9c7a", fontSize: 11 }} />
                    {result.monteCarlo.paths.slice(0, 50).map((_, i) => (
                      <Line key={i} dataKey={`p${i}`} dot={false} strokeWidth={0.8}
                        stroke={result.monteCarlo.paths[i][result.monteCarlo.paths[i].length - 1] > result.strikePrice ? "#5fc97a" : "#e05555"}
                        opacity={0.4} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background: "#0d150d", border: "0.5px solid #1e2e1e", borderRadius: 12, padding: 24, flex: 1, minWidth: 280 }}>
                <div style={{ fontSize: 13, color: "#7a9c7a", marginBottom: 4 }}>P&L at Expiration</div>
                <div style={{ fontSize: 11, color: "#3a5a3a", marginBottom: 16 }}>Profit/loss vs stock price</div>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={pnlData}>
                    <XAxis dataKey="price" stroke="#2a3a2a" tick={{ fill: "#5a7a5a", fontSize: 10 }} />
                    <YAxis stroke="#2a3a2a" tick={{ fill: "#5a7a5a", fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: "#0d150d", border: "0.5px solid #2a3a2a", color: "#eaf4ea", fontSize: 12 }}
                      formatter={(v: number) => [`$${v.toFixed(2)}`, "P&L"]} />
                    <ReferenceLine y={0} stroke="#2a3a2a" />
                    <ReferenceLine x={breakeven} stroke="#5fc97a" strokeDasharray="4 4" label={{ value: "BE", fill: "#5fc97a", fontSize: 10 }} />
                    <Area dataKey="pnl" stroke="#5fc97a" fill="#5fc97a" fillOpacity={0.1} dot={false} strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* GREEKS */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: "#7a9c7a", marginBottom: 12 }}>The Greeks</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <GreekCard label="Delta" value={result.blackScholes.delta.toString()} description="Price change per $1 move in stock" onLearn={() => setEduTopic("Delta")} />
                <GreekCard label="Gamma" value={result.blackScholes.gamma.toString()} description="Rate of delta change" onLearn={() => setEduTopic("Gamma")} />
                <GreekCard label="Theta" value={`$${result.blackScholes.theta.toFixed(4)}/day`} description="Daily time decay cost" onLearn={() => setEduTopic("Theta")} />
                <GreekCard label="Vega" value={result.blackScholes.vega.toString()} description="Sensitivity to volatility change" onLearn={() => setEduTopic("Vega")} />
              </div>
            </div>
          </>
        )}

        {/* EMPTY STATE */}
        {!result && !loading && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#3a5a3a" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
            <div style={{ fontSize: 15, marginBottom: 6, color: "#5a7a5a" }}>Enter a ticker and run your first simulation</div>
            <div style={{ fontSize: 13 }}>Start by typing a stock symbol above and clicking Fetch →</div>
          </div>
        )}
      </div>
    </div>
  );
}