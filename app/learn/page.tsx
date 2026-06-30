"use client";

import Link from "next/link";
import { useState } from "react";

const SECTIONS = [
  { id: "basics", label: "Market Basics" },
  { id: "options", label: "What Are Options" },
  { id: "greeks", label: "The Greeks" },
  { id: "reading", label: "Reading a Trade" },
  { id: "strategy", label: "Strategy Basics" },
];

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ marginBottom: 56, scrollMarginTop: 100 }}>
      <h2 style={{ fontSize: 22, fontWeight: 600, color: "#eaf4ea", marginBottom: 16 }}>{title}</h2>
      <div style={{ color: "#b0ccb0", fontSize: 15, lineHeight: 1.8 }}>{children}</div>
    </section>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: "#111811", border: "0.5px solid #2a3a2a", borderRadius: 8,
      padding: "14px 18px", margin: "16px 0", fontSize: 14, color: "#5fc97a",
    }}>
      {children}
    </div>
  );
}

export default function LearnPage() {
  const [activeSection, setActiveSection] = useState("basics");

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f0a", color: "#f0f4f0", fontFamily: "sans-serif" }}>

      {/* NAV */}
      <nav style={{ borderBottom: "0.5px solid #1e2e1e", padding: "12px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/" style={{ color: "#7a9c7a", fontSize: 13, textDecoration: "none" }}>← Back</Link>
          <span style={{ color: "#5fc97a", fontWeight: 600, fontSize: 16 }}>QuantShield</span>
        </div>
        <span style={{ color: "#7a9c7a", fontSize: 13 }}>Learn</span>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", display: "flex", gap: 48 }}>

        {/* SIDEBAR */}
        <aside style={{ width: 200, flexShrink: 0, position: "sticky", top: 32, alignSelf: "flex-start" }}>
          <div style={{ fontSize: 11, color: "#3a5a3a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>On this page</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                style={{
                  textAlign: "left", background: "none", border: "none",
                  padding: "8px 10px", borderRadius: 6, cursor: "pointer",
                  color: activeSection === s.id ? "#5fc97a" : "#7a9c7a",
                  fontSize: 13, fontWeight: activeSection === s.id ? 600 : 400,
                  borderLeft: activeSection === s.id ? "2px solid #5fc97a" : "2px solid transparent",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </aside>

        {/* CONTENT */}
        <main style={{ flex: 1, maxWidth: 700 }}>
          <div style={{ marginBottom: 40 }}>
            <h1 style={{ fontSize: 28, fontWeight: 600, color: "#eaf4ea", marginBottom: 8 }}>Options Trading, Explained Simply</h1>
            <p style={{ color: "#7a9c7a", fontSize: 14 }}>Everything you need to know before running your first simulation — no finance background required.</p>
          </div>

          <Section id="basics" title="Market Basics">
            <p>A <strong style={{ color: "#eaf4ea" }}>stock</strong> is a small piece of ownership in a company. When you buy one share of Apple, you own a tiny fraction of Apple. The price of that share goes up when more people want to buy it than sell it, and down when the opposite happens.</p>
            <p style={{ marginTop: 12 }}><strong style={{ color: "#eaf4ea" }}>Volatility</strong> measures how much a stock's price moves around over time. A stock that swings 5% in a day is highly volatile; one that barely moves 0.5% is low volatility. Tech stocks like Tesla tend to be more volatile than stable companies like Coca-Cola.</p>
            <Highlight>Volatility isn't inherently good or bad — it's just a measure of uncertainty. High volatility means bigger potential gains, but also bigger potential losses.</Highlight>
          </Section>

          <Section id="options" title="What Are Options">
            <p>An <strong style={{ color: "#eaf4ea" }}>option</strong> is a contract that gives you the right (but not the obligation) to buy or sell 100 shares of a stock at a specific price, by a specific date.</p>
            <p style={{ marginTop: 12 }}>There are two types:</p>
            <ul style={{ paddingLeft: 20, marginTop: 8 }}>
              <li style={{ marginBottom: 8 }}><strong style={{ color: "#5fc97a" }}>Call option</strong> — you're betting the stock price will go up. You profit if the stock rises above your strike price.</li>
              <li><strong style={{ color: "#f0a050" }}>Put option</strong> — you're betting the stock price will go down. You profit if the stock falls below your strike price.</li>
            </ul>
            <p style={{ marginTop: 12 }}>The <strong style={{ color: "#eaf4ea" }}>strike price</strong> is the price you agree to buy or sell at. The <strong style={{ color: "#eaf4ea" }}>premium</strong> is what you pay upfront for the contract — this is your maximum possible loss. The <strong style={{ color: "#eaf4ea" }}>expiration date</strong> is the deadline; after that, the option becomes worthless if it didn't work out.</p>
            <Highlight>Example: You buy a TSLA call with a $400 strike, paying a $15 premium. If TSLA rises to $430 before expiration, your option is worth at least $30 — a $15 profit per share, or $1,500 per contract.</Highlight>
          </Section>

          <Section id="greeks" title="The Greeks">
            <p>The Greeks are numbers that describe how an option's price reacts to different changes in the market. You'll see these in every simulation you run.</p>
            <ul style={{ paddingLeft: 20, marginTop: 12 }}>
              <li style={{ marginBottom: 10 }}><strong style={{ color: "#eaf4ea" }}>Delta</strong> — how much the option price moves for every $1 the stock moves. A delta of 0.5 means the option gains $0.50 when the stock gains $1.</li>
              <li style={{ marginBottom: 10 }}><strong style={{ color: "#eaf4ea" }}>Gamma</strong> — how fast delta itself changes. High gamma means your exposure can shift quickly.</li>
              <li style={{ marginBottom: 10 }}><strong style={{ color: "#eaf4ea" }}>Theta</strong> — how much value the option loses every day just from time passing. This works against option buyers.</li>
              <li><strong style={{ color: "#eaf4ea" }}>Vega</strong> — how sensitive the option is to changes in volatility. Rising volatility generally raises option prices.</li>
            </ul>
            <Highlight>You don't need to memorize formulas — just understand the intuition. Delta = direction sensitivity, Theta = time cost, Vega = volatility sensitivity.</Highlight>
          </Section>

          <Section id="reading" title="Reading a Trade">
            <p>When you run a simulation, you'll see several key numbers:</p>
            <ul style={{ paddingLeft: 20, marginTop: 12 }}>
              <li style={{ marginBottom: 10 }}><strong style={{ color: "#eaf4ea" }}>Profit Probability</strong> — the percentage of simulated outcomes where the trade made money.</li>
              <li style={{ marginBottom: 10 }}><strong style={{ color: "#eaf4ea" }}>Breakeven Price</strong> — the stock price needed at expiration for you to neither profit nor lose money.</li>
              <li><strong style={{ color: "#eaf4ea" }}>Avg Profit / Avg Loss</strong> — the typical size of a win versus a typical loss across simulations.</li>
            </ul>
            <p style={{ marginTop: 12 }}>A trade with a low win probability can still be worth taking if the potential profit is large enough relative to the loss. This is called <strong style={{ color: "#eaf4ea" }}>expected value</strong> — multiply your win probability by your average profit, then subtract your loss probability times your average loss.</p>
          </Section>

          <Section id="strategy" title="Strategy Basics">
            <p>A few principles to keep in mind as a beginner:</p>
            <ul style={{ paddingLeft: 20, marginTop: 12 }}>
              <li style={{ marginBottom: 10 }}><strong style={{ color: "#eaf4ea" }}>Only risk what you can afford to lose.</strong> Options can expire completely worthless — your entire premium is at risk.</li>
              <li style={{ marginBottom: 10 }}><strong style={{ color: "#eaf4ea" }}>Strikes closer to the current price</strong> have higher win probability but cost more and offer smaller percentage gains.</li>
              <li style={{ marginBottom: 10 }}><strong style={{ color: "#eaf4ea" }}>Longer expirations</strong> give your trade more time to work, but cost more in premium.</li>
              <li><strong style={{ color: "#eaf4ea" }}>Time decay (theta) is constant.</strong> The longer you hold without the stock moving in your favor, the more value you lose.</li>
            </ul>
            <Highlight>The best way to learn is to practice. Head to the Simulator and try running a few trades with different strikes and expirations to see how the numbers change.</Highlight>
            <div style={{ marginTop: 24 }}>
              <Link href="/simulator">
                <button style={{
                  background: "#5fc97a", color: "#0a0f0a", border: "none",
                  borderRadius: 6, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer",
                }}>
                  Try the Simulator →
                </button>
              </Link>
            </div>
          </Section>

        </main>
      </div>
    </div>
  );
}
