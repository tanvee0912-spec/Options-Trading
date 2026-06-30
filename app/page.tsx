import Link from "next/link";
export default function Home() {
  return (
    <div className="min-h-screen w-full" style={{ background: "#0a0f0a", color: "#f0f4f0" }}>

      {/* NAV */}
      <nav style={{ borderBottom: "0.5px solid #1e2e1e" }} className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2">
          <div style={{ background: "#1a3d1a", borderRadius: 6 }} className="w-7 h-7 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5fc97a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span style={{ color: "#5fc97a", fontSize: 18, fontWeight: 500 }}>QuantShield</span>
        </div>
        <div className="hidden sm:flex items-center gap-6" style={{ fontSize: 13, color: "#7a9c7a" }}>
          <Link href="/how-it-works" style={{ color: "#7a9c7a", textDecoration: "none" }} className="hover:text-green-400 transition-colors">
            How it works
          </Link>
          <Link href="/simulator" style={{ color: "#7a9c7a", textDecoration: "none" }} className="hover:text-green-400 transition-colors">
            Simulator
          </Link>
          <Link href="/learn" style={{ color: "#7a9c7a", textDecoration: "none" }} className="hover:text-green-400 transition-colors">
            Learn
          </Link>
        </div>
        <Link href="/simulator">
          <button
            style={{ background: "#1e6b2e", color: "#a8f0b4", border: "0.5px solid #2e8b3e", borderRadius: 6, fontSize: 13, padding: "7px 16px", cursor: "pointer" }}
            className="hover:opacity-90 transition-opacity"
          >
            Try for free →
          </button>
        </Link>
      </nav>

      {/* HERO */}
      <section className="flex flex-col items-center text-center px-8 pt-16 pb-12">
        {/* Badge */}
        <div
          style={{ background: "#111e11", border: "0.5px solid #2a4a2a", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", fontSize: 12, color: "#5fc97a", marginBottom: 24 }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#5fc97a", display: "inline-block" }} />
          AI-powered risk intelligence
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 500, lineHeight: 1.2, color: "#eaf4ea", maxWidth: 600, marginBottom: 16 }}>
          See the <span style={{ color: "#5fc97a" }}>full range</span> of what your money could do
        </h1>
        <p style={{ fontSize: 15, color: "#7a9c7a", maxWidth: 480, lineHeight: 1.7, marginBottom: 32 }}>
          Most tools show you an average. QuantShield shows you everything — the wins, the losses, and the tail risks hiding in between.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <Link href="/simulator">
            <button style={{ background: "#1e6b2e", color: "#c8f4d0", border: "0.5px solid #2e8b3e", borderRadius: 8, fontSize: 14, padding: "10px 22px", cursor: "pointer" }}>
              Run your first simulation →
            </button>
          </Link>
          <button style={{ background: "transparent", color: "#b8d4b8", border: "0.5px solid #2a4a2a", borderRadius: 8, fontSize: 14, padding: "10px 22px", cursor: "pointer" }}>
            Watch a demo
          </button>
        </div>

        {/* Preview Card */}
        <div style={{ background: "#0f1a0f", border: "0.5px solid #1e3a1e", borderRadius: 12, maxWidth: 560, width: "100%", padding: 20, textAlign: "left" }}>
          <div className="flex items-center justify-between mb-4">
            <span style={{ fontSize: 13, color: "#7a9c7a" }}>S&P 500 · $5,000 invested · 10 yr outlook</span>
            <div className="flex gap-2">
              {[["Bull", "#5fc97a", "#1e4a1e", "#0f240f"], ["Bear", "#f0a050", "#4a2e0a", "#240f00"], ["Crash", "#e86060", "#4a1a1a", "#1a0a0a"]].map(([label, color, border, bg]) => (
                <span key={label} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, border: `0.5px solid ${border}`, background: bg, color }}>{label}</span>
              ))}
            </div>
          </div>

          {/* Mini Chart */}
          <div style={{ height: 90, marginBottom: 12 }}>
            <svg viewBox="0 0 520 90" preserveAspectRatio="none" width="100%" height="90" xmlns="http://www.w3.org/2000/svg">
              <polyline points="0,70 60,55 120,40 180,30 240,18 300,10 360,6 420,4 520,2" fill="none" stroke="#5fc97a" strokeWidth="1.5" opacity="0.9" />
              <polyline points="0,70 60,65 120,62 180,58 240,60 300,55 360,50 420,52 520,48" fill="none" stroke="#f0a050" strokeWidth="1.5" opacity="0.85" />
              <polyline points="0,70 60,72 120,75 180,80 240,82 300,78 360,82 420,85 520,84" fill="none" stroke="#e86060" strokeWidth="1.5" opacity="0.85" />
              <line x1="0" y1="70" x2="520" y2="70" stroke="#1a2e1a" strokeWidth="0.5" />
              <text x="4" y="86" fontSize="9" fill="#3a5a3a">Year 0</text>
              <text x="470" y="86" fontSize="9" fill="#3a5a3a">Year 10</text>
            </svg>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-2">
            {[
              ["Bull median", "$21,400", "#5fc97a"],
              ["Bear median", "$7,800", "#f0a050"],
              ["Crash 5th %ile", "$2,100", "#e86060"],
              ["Downside prob.", "34%", "#f0a050"],
            ].map(([label, value, color]) => (
              <div key={label} style={{ background: "#0a120a", border: "0.5px solid #1a2e1a", borderRadius: 6, padding: "8px 10px" }}>
                <div style={{ fontSize: 10, color: "#5a7a5a", marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-8 py-14">
        <p style={{ fontSize: 12, color: "#5fc97a", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>How it works</p>
        <h2 style={{ fontSize: 22, fontWeight: 500, color: "#eaf4ea", marginBottom: 32 }}>From input to insight in three steps</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            ["1", "Set your scenario", "Choose an asset, investment amount, and time horizon. Pick a market regime or let AI generate one."],
            ["2", "Run the simulation", "Monte Carlo engine runs thousands of paths, modeling volatility, drift, and regime shifts in real time."],
            ["3", "Understand your risk", "AI explains your outcome distribution in plain language — what could go wrong, and why."],
          ].map(([num, title, desc]) => (
            <div key={num} style={{ background: "#0f1a0f", border: "0.5px solid #1e3a1e", borderRadius: 10, padding: "20px 16px" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1a3d1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#5fc97a", fontWeight: 500, marginBottom: 14 }}>{num}</div>
              <h3 style={{ fontSize: 14, fontWeight: 500, color: "#c8e8c8", marginBottom: 6 }}>{title}</h3>
              <p style={{ fontSize: 12, color: "#5a7a5a", lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-8 pb-16">
        <p style={{ fontSize: 12, color: "#5fc97a", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Core features</p>
        <h2 style={{ fontSize: 22, fontWeight: 500, color: "#eaf4ea", marginBottom: 32 }}>Built for people who want real answers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5fc97a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="2" /><circle cx="6" cy="6" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" />
                  <line x1="8" y1="7" x2="10" y2="10" /><line x1="14" y1="10" x2="16" y2="7" /><line x1="8" y1="17" x2="10" y2="14" /><line x1="14" y1="14" x2="16" y2="17" />
                </svg>
              ),
              iconBg: "#1a3d1a",
              title: "Monte Carlo simulation",
              desc: "10,000+ paths per run. See the full distribution of outcomes, not just the optimistic average.",
            },
            {
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f0a050" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                </svg>
              ),
              iconBg: "#2e1e06",
              title: "AI scenario generation",
              desc: "Bull, bear, and crash regimes dynamically shift simulation parameters using AI-powered macroeconomic modeling.",
            },
            {
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a8f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              ),
              iconBg: "#0a1e3a",
              title: "Plain-language risk explainer",
              desc: "No jargon. AI explains why a strategy fails under certain conditions so you actually understand what's happening.",
            },
          ].map(({ icon, iconBg, title, desc }) => (
            <div key={title} style={{ background: "#0f1a0f", border: "0.5px solid #1e3a1e", borderRadius: 10, padding: "20px 16px" }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>{icon}</div>
              <h3 style={{ fontSize: 14, fontWeight: 500, color: "#c8e8c8", marginBottom: 6 }}>{title}</h3>
              <p style={{ fontSize: 12, color: "#5a7a5a", lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "0.5px solid #1a2e1a" }} className="flex items-center justify-between px-8 py-5">
        <span style={{ fontSize: 14, color: "#3a6a3a", fontWeight: 500 }}>QuantShield</span>
        <span style={{ fontSize: 11, color: "#3a5a3a" }}>Built for financial literacy learners · Not financial advice</span>
      </footer>

    </div>
  );
}
