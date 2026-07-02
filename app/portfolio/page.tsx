"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { getPortfolio, closePosition, settlePosition, resetPortfolio } from "../lib/portfolio";
import { Portfolio, Position } from "../lib/types";

// ── Types for live pricing ──────────────────────────────────────────────────

interface LivePricing {
  currentPrice: number;
  price: number;      // repriced option value right now
  delta: number;
  daysRemaining: number;
  unrealizedPnL: number;
}

// ── Helpers ──────────────────────────────────────────────────────────────

function daysBetween(from: Date, to: Date): number {
  return Math.ceil((to.getTime() - from.getTime()) / 86400000);
}

// ── Position Row ─────────────────────────────────────────────────────────

function OpenPositionRow({
  position,
  onClosed,
}: {
  position: Position;
  onClosed: () => void;
}) {
  const [live, setLive] = useState<LivePricing | null>(null);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loadLivePricing = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      // 1. Get current stock price
      const priceRes = await fetch(`/api/getstock?ticker=${position.ticker}`);
      const priceData = await priceRes.json();
      if (priceData.error) throw new Error(priceData.error);
      const currentPrice = priceData.price;

      const daysRemaining = daysBetween(new Date(), new Date(position.expirationDate));

      if (daysRemaining <= 0) {
        // Expired — settle it automatically
        settlePosition(position.id, currentPrice);
        onClosed();
        return;
      }

      // 2. Reprice the option live
      const repriceRes = await fetch("/api/reprice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPrice,
          strikePrice: position.strike,
          daysToExpiration: daysRemaining,
          impliedVolatility: position.impliedVolatility,
          optionType: position.type,
        }),
      });
      const repriceData = await repriceRes.json();
      if (repriceData.error) throw new Error(repriceData.error);

      const unrealizedPnL = (repriceData.price - position.entryPrice) * 100 * position.contracts;

      setLive({
        currentPrice,
        price: repriceData.price,
        delta: repriceData.delta,
        daysRemaining,
        unrealizedPnL,
      });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to load live price");
    } finally {
      setLoading(false);
    }
  }, [position, onClosed]);

  useEffect(() => {
    loadLivePricing();
  }, [loadLivePricing]);

  async function handleClose() {
    if (!live) return;
    setClosing(true);
    try {
      closePosition(position.id, live.price);
      onClosed();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to close position");
      setClosing(false);
    }
  }

  const isProfit = live ? live.unrealizedPnL >= 0 : true;

  return (
    <div style={{
      background: "#0d150d", border: "0.5px solid #1e2e1e", borderRadius: 10,
      padding: 18, marginBottom: 12, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
    }}>
      <div style={{ minWidth: 160 }}>
        <div style={{ color: "#eaf4ea", fontSize: 15, fontWeight: 600 }}>
          {position.ticker} ${position.strike} {position.type.toUpperCase()}
        </div>
        <div style={{ color: "#5a7a5a", fontSize: 12, marginTop: 2 }}>
          {position.contracts} contract{position.contracts > 1 ? "s" : ""} · entry ${position.entryPrice.toFixed(2)}
        </div>
      </div>

      {loading && (
        <div style={{ color: "#3a5a3a", fontSize: 13 }}>Loading live price...</div>
      )}

      {errorMsg && !loading && (
        <div style={{ color: "#e05555", fontSize: 12 }}>{errorMsg}</div>
      )}

      {live && !loading && (
        <>
          <div style={{ minWidth: 100 }}>
            <div style={{ color: "#5a7a5a", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Current</div>
            <div style={{ color: "#eaf4ea", fontSize: 14 }}>${live.currentPrice.toFixed(2)}</div>
          </div>

          <div style={{ minWidth: 100 }}>
            <div style={{ color: "#5a7a5a", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Value now</div>
            <div style={{ color: "#eaf4ea", fontSize: 14 }}>${live.price.toFixed(2)}</div>
          </div>

          <div style={{ minWidth: 90 }}>
            <div style={{ color: "#5a7a5a", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>DTE</div>
            <div style={{ color: "#eaf4ea", fontSize: 14 }}>{live.daysRemaining}d</div>
          </div>

          <div style={{ minWidth: 120 }}>
            <div style={{ color: "#5a7a5a", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Unrealized P&L</div>
            <div style={{ color: isProfit ? "#5fc97a" : "#e05555", fontSize: 15, fontWeight: 600 }}>
              {isProfit ? "+" : ""}{live.unrealizedPnL.toFixed(2)}
            </div>
          </div>

          <button
            onClick={handleClose}
            disabled={closing}
            style={{
              marginLeft: "auto", background: closing ? "#1a2e1a" : "#111811",
              border: "0.5px solid #2a3a2a", borderRadius: 6, padding: "8px 16px",
              color: "#f0a050", fontSize: 13, fontWeight: 600,
              cursor: closing ? "not-allowed" : "pointer",
            }}
          >
            {closing ? "Closing..." : "Close Position"}
          </button>
        </>
      )}
    </div>
  );
}

function ClosedPositionRow({ position }: { position: Position }) {
  const realizedPnL = position.exitPrice != null
    ? (position.exitPrice - position.entryPrice) * 100 * position.contracts
    : 0;
  const isProfit = realizedPnL >= 0;

  return (
    <div style={{
      background: "#0d150d", border: "0.5px solid #1e2e1e", borderRadius: 10,
      padding: 16, marginBottom: 10, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
      opacity: 0.75,
    }}>
      <div style={{ minWidth: 160 }}>
        <div style={{ color: "#b0ccb0", fontSize: 14, fontWeight: 600 }}>
          {position.ticker} ${position.strike} {position.type.toUpperCase()}
        </div>
        <div style={{ color: "#5a7a5a", fontSize: 12, marginTop: 2 }}>
          {position.contracts} contract{position.contracts > 1 ? "s" : ""} · entry ${position.entryPrice.toFixed(2)} → exit ${position.exitPrice?.toFixed(2)}
        </div>
      </div>

      <div style={{ minWidth: 90 }}>
        <div style={{ color: "#5a7a5a", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Status</div>
        <div style={{ color: "#7a9c7a", fontSize: 13 }}>{position.status === "expired" ? "Expired" : "Closed"}</div>
      </div>

      <div style={{ minWidth: 120, marginLeft: "auto" }}>
        <div style={{ color: "#5a7a5a", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Realized P&L</div>
        <div style={{ color: isProfit ? "#5fc97a" : "#e05555", fontSize: 15, fontWeight: 600 }}>
          {isProfit ? "+" : ""}{realizedPnL.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const refresh = useCallback(() => {
    setPortfolio(getPortfolio());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function handleReset() {
    resetPortfolio();
    setShowResetConfirm(false);
    refresh();
  }

  if (!portfolio) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0f0a", color: "#f0f4f0" }} />
    );
  }

  const openPositions = portfolio.positions.filter(p => p.status === "open");
  const closedPositions = portfolio.positions
    .filter(p => p.status === "closed" || p.status === "expired")
    .sort((a, b) => new Date(b.exitDate ?? 0).getTime() - new Date(a.exitDate ?? 0).getTime());

  const totalReturn = portfolio.cashBalance - portfolio.startingBalance;
  const totalReturnPct = (totalReturn / portfolio.startingBalance) * 100;
  const isPositiveReturn = totalReturn >= 0;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f0a", color: "#f0f4f0", fontFamily: "sans-serif" }}>

      {/* NAV */}
      <nav style={{ borderBottom: "0.5px solid #1e2e1e", padding: "12px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/" style={{ color: "#7a9c7a", fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
            ← Back
          </Link>
          <span style={{ color: "#5fc97a", fontWeight: 600, fontSize: 16 }}>QuantShield</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/simulator" style={{ color: "#7a9c7a", fontSize: 13, textDecoration: "none" }}>Simulator</Link>
          <span style={{ color: "#5fc97a", fontSize: 13 }}>Portfolio</span>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 600, color: "#eaf4ea", marginBottom: 8 }}>Paper Trading Portfolio</h1>
            <p style={{ color: "#7a9c7a", fontSize: 14 }}>Track your simulated positions with fake money. No real risk.</p>
          </div>
          <button
            onClick={() => setShowResetConfirm(true)}
            style={{
              background: "#111811", border: "0.5px solid #2a3a2a", borderRadius: 6,
              padding: "8px 16px", color: "#5a7a5a", fontSize: 12, cursor: "pointer",
            }}
          >
            Reset Portfolio
          </button>
        </div>

        {/* SUMMARY BAR */}
        <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
          <div style={{ background: "#0d150d", border: "0.5px solid #1e2e1e", borderRadius: 8, padding: "16px 20px", flex: 1, minWidth: 160 }}>
            <div style={{ color: "#5a7a5a", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Cash Balance</div>
            <div style={{ color: "#5fc97a", fontSize: 22, fontWeight: 600 }}>${portfolio.cashBalance.toFixed(2)}</div>
          </div>
          <div style={{ background: "#0d150d", border: "0.5px solid #1e2e1e", borderRadius: 8, padding: "16px 20px", flex: 1, minWidth: 160 }}>
            <div style={{ color: "#5a7a5a", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Starting Balance</div>
            <div style={{ color: "#eaf4ea", fontSize: 22, fontWeight: 600 }}>${portfolio.startingBalance.toFixed(2)}</div>
          </div>
          <div style={{ background: "#0d150d", border: "0.5px solid #1e2e1e", borderRadius: 8, padding: "16px 20px", flex: 1, minWidth: 160 }}>
            <div style={{ color: "#5a7a5a", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Total Return</div>
            <div style={{ color: isPositiveReturn ? "#5fc97a" : "#e05555", fontSize: 22, fontWeight: 600 }}>
              {isPositiveReturn ? "+" : ""}${totalReturn.toFixed(2)} ({isPositiveReturn ? "+" : ""}{totalReturnPct.toFixed(1)}%)
            </div>
          </div>
          <div style={{ background: "#0d150d", border: "0.5px solid #1e2e1e", borderRadius: 8, padding: "16px 20px", flex: 1, minWidth: 160 }}>
            <div style={{ color: "#5a7a5a", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Open Positions</div>
            <div style={{ color: "#eaf4ea", fontSize: 22, fontWeight: 600 }}>{openPositions.length}</div>
          </div>
        </div>

        {/* OPEN POSITIONS */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 15, color: "#eaf4ea", fontWeight: 600, marginBottom: 12 }}>Open Positions</div>
          {openPositions.length === 0 ? (
            <div style={{ color: "#3a5a3a", fontSize: 13, padding: "24px 0", textAlign: "center", border: "0.5px dashed #1e2e1e", borderRadius: 10 }}>
              No open positions. Head to the Simulator to paper trade your first one.
            </div>
          ) : (
            openPositions.map(p => (
              <OpenPositionRow key={p.id} position={p} onClosed={refresh} />
            ))
          )}
        </div>

        {/* CLOSED / EXPIRED POSITIONS */}
        {closedPositions.length > 0 && (
          <div>
            <div style={{ fontSize: 15, color: "#eaf4ea", fontWeight: 600, marginBottom: 12 }}>Position History</div>
            {closedPositions.map(p => (
              <ClosedPositionRow key={p.id} position={p} />
            ))}
          </div>
        )}
      </div>

      {/* RESET CONFIRM MODAL */}
      {showResetConfirm && (
        <div onClick={() => setShowResetConfirm(false)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#0d150d", border: "0.5px solid #2a3a2a", borderRadius: 12,
            padding: 28, width: 340,
          }}>
            <div style={{ fontSize: 15, color: "#eaf4ea", marginBottom: 8, fontWeight: 600 }}>Reset portfolio?</div>
            <div style={{ fontSize: 13, color: "#7a9c7a", marginBottom: 20 }}>
              This clears all positions and resets your cash balance to $10,000. This can&apos;t be undone.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleReset} style={{
                flex: 1, background: "#e05555", color: "#0a0f0a", border: "none",
                borderRadius: 6, padding: "10px 0", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>
                Reset
              </button>
              <button onClick={() => setShowResetConfirm(false)} style={{
                flex: 1, background: "#111811", color: "#7a9c7a", border: "0.5px solid #2a3a2a",
                borderRadius: 6, padding: "10px 0", fontSize: 13, cursor: "pointer",
              }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
