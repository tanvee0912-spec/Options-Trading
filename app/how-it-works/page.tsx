import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <main style={{
      backgroundColor: '#0a0f0a',
      minHeight: '100vh',
      color: '#e8f0e8',
      fontFamily: 'sans-serif',
      padding: '0 0 4rem',
    }}>

      {/* Back arrow */}
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '1.5rem 2rem 0' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#7a9c7a', textDecoration: 'none' }}
          className="hover:text-green-400 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to home
        </Link>
      </div>

      {/* Hero */}
      <div style={{
        padding: '2rem 2rem 2.5rem',
        borderBottom: '0.5px solid #1e2d1e',
        marginBottom: '3rem',
        maxWidth: '680px',
        margin: '0 auto',
      }}>
        <p style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5fc97a', marginBottom: '1rem', paddingTop: '1.5rem' }}>
          How it works
        </p>
        <h1 style={{ fontSize: '34px', fontWeight: 500, lineHeight: 1.2, color: '#e8f0e8', marginBottom: '1rem', maxWidth: '480px' }}>
          From a ticker symbol to a full picture of your risk
        </h1>
        <p style={{ fontSize: '16px', color: '#7a9c7a', lineHeight: 1.7, maxWidth: '500px' }}>
          Most investing tools tell you what might happen on average. QuantShield shows you the full range of outcomes — so you can make decisions with your eyes open.
        </p>
      </div>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 2rem' }}>

        {/* Steps */}
        <div style={{ marginBottom: '3rem' }}>
          <p style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4a6b4a', marginBottom: '1.5rem' }}>
            The 3-step process
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Step 1 */}
            <div style={{ background: '#0f180f', border: '0.5px solid #1e2d1e', borderRadius: '12px', padding: '1.5rem', display: 'grid', gridTemplateColumns: '48px 1fr', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#122b17', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5fc97a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 500, color: '#4a6b4a', marginBottom: '4px' }}>Step 1</p>
                <p style={{ fontSize: '16px', fontWeight: 500, color: '#e8f0e8', marginBottom: '6px' }}>Pick your position</p>
                <p style={{ fontSize: '14px', color: '#7a9c7a', lineHeight: 1.6, marginBottom: '10px' }}>
                  Enter a stock, ETF, or option. Set your investment amount and how long you&apos;re thinking of holding it. No account or brokerage link needed.
                </p>
                <div style={{ fontSize: '13px', color: '#7a9c7a', background: '#122b17', borderRadius: '8px', padding: '10px 12px', borderLeft: '2px solid #5fc97a' }}>
                  <strong style={{ color: '#5fc97a', fontWeight: 500 }}>Example:</strong> $500 in Tesla (TSLA) calls expiring in 60 days
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div style={{ background: '#0f180f', border: '0.5px solid #1e2d1e', borderRadius: '12px', padding: '1.5rem', display: 'grid', gridTemplateColumns: '48px 1fr', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#122b17', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5fc97a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 500, color: '#4a6b4a', marginBottom: '4px' }}>Step 2</p>
                <p style={{ fontSize: '16px', fontWeight: 500, color: '#e8f0e8', marginBottom: '6px' }}>Run the simulation</p>
                <p style={{ fontSize: '14px', color: '#7a9c7a', lineHeight: 1.6, marginBottom: '10px' }}>
                  QuantShield runs thousands of Monte Carlo simulations using real historical volatility, modeling how your position could behave across good, bad, and tail-risk scenarios.
                </p>
                <div style={{ fontSize: '13px', color: '#7a9c7a', background: '#122b17', borderRadius: '8px', padding: '10px 12px', borderLeft: '2px solid #5fc97a' }}>
                  <strong style={{ color: '#5fc97a', fontWeight: 500 }}>Example:</strong> 10,000 price paths generated in seconds, spanning a 95% confidence interval
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div style={{ background: '#0f180f', border: '0.5px solid #1e2d1e', borderRadius: '12px', padding: '1.5rem', display: 'grid', gridTemplateColumns: '48px 1fr', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#2a1f08', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f0a050" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a7 7 0 0 1 7 7c0 3.87-3.13 7-7 7s-7-3.13-7-7a7 7 0 0 1 7-7z"/><path d="M12 16v2M9 20h6"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 500, color: '#4a6b4a', marginBottom: '4px' }}>Step 3</p>
                <p style={{ fontSize: '16px', fontWeight: 500, color: '#e8f0e8', marginBottom: '6px' }}>Understand what you&apos;re seeing</p>
                <p style={{ fontSize: '14px', color: '#7a9c7a', lineHeight: 1.6, marginBottom: '10px' }}>
                  Our AI breaks down the simulation results into plain language — your probability of profit, max loss, and what market conditions could push you to either extreme.
                </p>
                <div style={{ fontSize: '13px', color: '#7a9c7a', background: '#122b17', borderRadius: '8px', padding: '10px 12px', borderLeft: '2px solid #5fc97a' }}>
                  <strong style={{ color: '#5fc97a', fontWeight: 500 }}>Example:</strong> &quot;There&apos;s a 68% chance this trade breaks even or better — but a 12% chance of losing your entire premium if TSLA stays flat.&quot;
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Why it matters */}
        <div style={{ marginBottom: '3rem' }}>
          <p style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4a6b4a', marginBottom: '1.5rem' }}>
            Why it matters
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { num: '93%', label: 'of retail traders lose money in options in their first year' },
              { num: '1 in 5', label: 'high schoolers say they\u2019ve invested, but fewer than 10% understand tail risk' },
              { num: '0', label: 'financial education tools built around probability distributions for students' },
            ].map((stat) => (
              <div key={stat.num} style={{ background: '#0f180f', border: '0.5px solid #1e2d1e', borderRadius: '8px', padding: '1rem' }}>
                <div style={{ fontSize: '26px', fontWeight: 500, color: '#f0a050', lineHeight: 1.1 }}>{stat.num}</div>
                <div style={{ fontSize: '13px', color: '#7a9c7a', marginTop: '4px', lineHeight: 1.4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison */}
        <div style={{ marginBottom: '3rem' }}>
          <p style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4a6b4a', marginBottom: '1.5rem' }}>
            Traditional tools vs QuantShield
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '0.5px solid #1e2d1e', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ background: '#0f180f', borderRight: '0.5px solid #1e2d1e' }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '0.5px solid #1e2d1e' }}>
                <span style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#4a6b4a' }}>Traditional tools</span>
              </div>
              {[
                'Expected return only — one number, no context',
                'No visibility into how bad the downside could get',
                'Jargon-heavy output designed for professionals',
                'Static charts with no scenario exploration',
              ].map((text, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '10px 1.25rem', borderBottom: i < 3 ? '0.5px solid #1a261a' : 'none' }}>
                  <span style={{ color: '#4a6b4a', fontSize: '15px', marginTop: '1px', flexShrink: 0 }}>✕</span>
                  <span style={{ fontSize: '14px', color: '#4a6b4a', lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>
            <div style={{ background: '#0f180f' }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '0.5px solid #1e2d1e', background: '#122b17' }}>
                <span style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#5fc97a' }}>QuantShield</span>
              </div>
              {[
                'Full outcome distribution — best case, worst case, and everything between',
                'Explicit tail-risk estimates with plain-language context',
                'AI explanations built for students and first-time investors',
                'Interactive \u201cwhat if\u201d scenarios powered by real simulations',
              ].map((text, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '10px 1.25rem', borderBottom: i < 3 ? '0.5px solid #1a261a' : 'none' }}>
                  <span style={{ color: '#5fc97a', fontSize: '15px', marginTop: '1px', flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: '14px', color: '#c0dcc0', lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: '#122b17', border: '0.5px solid #2a4a2a', borderRadius: '12px', padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#e8f0e8', marginBottom: '4px' }}>Ready to see your own position?</h3>
            <p style={{ fontSize: '14px', color: '#7a9c7a' }}>Run your first simulation in under a minute — no account needed.</p>
          </div>
          <Link href="/simulator" style={{ background: '#5fc97a', color: '#0a0f0a', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Try the simulator →
          </Link>
        </div>

      </div>
    </main>
  );
}