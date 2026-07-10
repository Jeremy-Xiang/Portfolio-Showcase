import { useEffect, useRef, useState } from "react";
import SplitFlap from "./SplitFlap";
import TapeField from "./TapeField";
import "./styles.css";

// ── Edit these two lines after publishing your repos ────────────────────────
const GITHUB_USER = "Jeremy-Xiang";
const THESIS_URL = "https://thesis.jeremyxiang.com";
// ─────────────────────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    name: "stock-forecast-bench",
    tag: "Forecasting · Backtesting",
    blurb:
      "Four OHLC forecasting models — naive persistence, a least-squares transition-matrix dynamical system, linear regression, random forest — compared under strict walk-forward evaluation, single ticker or whole basket. Includes a nightly-precompute caching API.",
    highlight: "Found & fixed an off-by-one bug where the live prediction path silently forecast the wrong day — now pinned by a test that requires live and batch paths to agree to float precision.",
  },
  {
    name: "alpha-factor-pipeline",
    tag: "Quant Research · ML",
    blurb:
      "A 17-factor alpha research pipeline: information-coefficient analysis selects factors with measured predictive power, a walk-forward gradient-boosted model trades the survivors, and a long-short backtest reports gross, net-of-cost, per-leg, and benchmark-relative results.",
    highlight: "Caught a seeding bug that manufactured an exact 1.0 correlation between synthetic price drift and P/E — fake 'value signal' from the RNG, not the market.",
  },
  {
    name: "multi-agent-analyst",
    tag: "AI Agents · Anthropic API",
    blurb:
      "A supervisor agent synthesizes three isolated subagents — technical, fundamental, sentiment — each restricted to exactly one data tool, so the final thesis combines genuinely independent reads. Structured output enforced via tool calls, with a deterministic offline mock mode.",
    highlight: "Each agent physically cannot see the others' data; the audit trail records every tool call behind every verdict.",
  },
  {
    name: "screener-alerts",
    tag: "Event Detection · Pipelines",
    blurb:
      "Six event-semantics screening rules — crossovers, 52-week breakouts, volume and volatility spikes — that fire when something happens, not every day a threshold stays crossed. Pluggable notifiers (console, file, Slack/Discord, email) and a scheduled-scan API.",
    highlight: "Integrated into the live THESIS dashboard as a mounted FastAPI router sharing its scheduler and rate limiter.",
  },
  {
    name: "filings-assistant",
    tag: "RAG · NLP",
    blurb:
      "Citation-grounded Q&A over financial filings and earnings transcripts. TF-IDF retrieval feeds a Claude generation step constrained to answer only from retrieved text — and to refuse, explicitly, when nothing relevant is indexed.",
    highlight: "A 14-word trailing chunk once scored 0.27 against a completely unrelated query — fixed with minimum-chunk merging, verified by a before/after test.",
  },
  {
    name: "ticker-clustering",
    tag: "Unsupervised ML",
    blurb:
      "Clusters tickers by behavior — return, volatility, momentum, liquidity, drawdown — instead of sector label. K-means or hierarchical over standardized features, PCA projection with interpretable axis loadings, silhouette-guided k selection.",
    highlight: "Anagram tickers (GS/KO) once received byte-identical synthetic data from a sum-of-ordinals seed — now a regression test.",
  },
];

function useTickerDemo() {
  // Cycles through plausible prices so the SplitFlap demo flips periodically.
  const seq = ["187.42", "187.61", "186.98", "188.05", "187.42"];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % seq.length), 2600);
    return () => clearInterval(t);
  }, []);
  return seq[i];
}

// Reveal-on-scroll: adds .in to observed elements the first time they enter view.
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = root.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("in");
          io.unobserve(e.target);
        }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return ref;
}

export default function App() {
  const demoPrice = useTickerDemo();
  const pageRef = useReveal();

  return (
    <div className="page" ref={pageRef}>
      <header className="hero">
        <TapeField />
        <p className="kicker">Jeremy Xiang · Quant &amp; Systems Portfolio</p>
        <h1>
          Six finance systems.
          <br />
          Built, tested, documented.
        </h1>
        <p className="sub">
          45 regression tests across six repos — every documented bug has a test
          that would catch it again. Python · FastAPI · scikit-learn · React.
        </p>
        <div className="flap-demo" aria-hidden="true">
          <span className="flap-label">NVDA</span>
          <SplitFlap value={demoPrice} prefix="$" />
          <span className="flap-note">live split-flap component, also running on THESIS</span>
        </div>
        <div className="hero-links">
          <a className="btn btn-solid" href={THESIS_URL} target="_blank" rel="noreferrer">
            THESIS Dashboard →
          </a>
          <a className="btn" href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="btn" href="https://jeremyxiang.com" target="_blank" rel="noreferrer">
            jeremyxiang.com
          </a>
        </div>
      </header>

      <div className="sechead" data-reveal>
        <h2 className="sechead-title">The six systems</h2>
        <span className="sechead-note">every card links to its repo · every repo runs offline</span>
      </div>

      <main className="grid">
        {PROJECTS.map((p, i) => (
          <a
            key={p.name}
            className="card"
            data-reveal
            style={{ "--d": `${(i % 3) * 70}ms` }}
            href={`https://github.com/${GITHUB_USER}/${p.name}`}
            target="_blank"
            rel="noreferrer"
          >
            <span className="idx" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <div className="card-top">
              <h2>{p.name}</h2>
              <span className="tag">{p.tag}</span>
            </div>
            <p className="blurb">{p.blurb}</p>
            <p className="highlight">→ {p.highlight}</p>
            <span className="card-cta">View repo <span className="cta-arrow">↗</span></span>
          </a>
        ))}
      </main>

      <footer>
        <p>
          Each repo runs offline out of the box (clearly-labeled synthetic fallbacks) and
          against live market data with zero code changes. <code>pytest tests/ -v</code> in any of them.
        </p>
      </footer>
    </div>
  );
}
