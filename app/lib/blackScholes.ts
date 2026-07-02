// app/lib/blackScholes.ts

function erf(x: number): number {
  const a1 =  0.254829592, a2 = -0.284496736, a3 =  1.421413741;
  const a4 = -1.453152027, a5 =  1.061405429, p  =  0.3275911;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t * Math.exp(-x*x);
  return sign * y;
}

function cdf(x: number): number {
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
}

export function blackScholes(
  S: number,   // current stock price
  K: number,   // strike price
  T: number,   // time to expiration in years
  r: number,   // risk-free rate
  sigma: number, // implied volatility
  type: "call" | "put"
) {
  if (T <= 0) {
    const intrinsic = type === "call" ? Math.max(S - K, 0) : Math.max(K - S, 0);
    return { price: intrinsic, delta: 0, gamma: 0, theta: 0, vega: 0 };
  }

  const d1 = (Math.log(S / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);

  let price: number, delta: number;

  if (type === "call") {
    price = S * cdf(d1) - K * Math.exp(-r * T) * cdf(d2);
    delta = cdf(d1);
  } else {
    price = K * Math.exp(-r * T) * cdf(-d2) - S * cdf(-d1);
    delta = cdf(d1) - 1;
  }

  const gamma = Math.exp(-0.5 * d1 ** 2) / (S * sigma * Math.sqrt(2 * Math.PI * T));
  const theta = (
    -(S * sigma * Math.exp(-0.5 * d1 ** 2)) / (2 * Math.sqrt(2 * Math.PI * T)) -
    r * K * Math.exp(-r * T) * (type === "call" ? cdf(d2) : cdf(-d2))
  ) / 365;
  const vega = S * Math.sqrt(T) * Math.exp(-0.5 * d1 ** 2) / Math.sqrt(2 * Math.PI) / 100;

  return { price, delta, gamma, theta, vega };
}
