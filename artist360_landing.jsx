import { useState, useEffect, useRef } from "react";

const NAV_ITEMS = ["Features", "How It Works", "Glossary", "Pricing"];

const FEATURES = [
  { icon: "🏆", tag: "LEADERBOARD", title: "Artist 360°",
    desc: "170+ artists ranked live across 18 Latin American markets. Composite scoring fuses iTunes chart points, Spotify monthly listeners, and global footprint — recalculated every time fresh data lands.",
    stats: ["170 Artists", "18 Markets", "Live Composite Score"], color: "#00e5a0",
    realtime: "Rankings update automatically as Spotify and iTunes push new chart snapshots — no manual refresh or spreadsheet upload required." },
  { icon: "⚡", tag: "DEBUT INTELLIGENCE", title: "Debuts/Chart",
    desc: "Every new chart entry flagged the moment it appears. Strongest debut, multi-track debutants, catalogue re-entries, and debut score vs. incumbents — all surfaced live for Week 20.",
    stats: ["101 New Entries/Wk", "Debut Score", "Strength vs Field"], color: "#f5c518",
    realtime: "New entries are detected within the same processing cycle as raw chart data — typically within minutes of iTunes or Spotify publishing their weekly snapshot." },
  { icon: "🏷️", tag: "LABEL INTELLIGENCE", title: "Label",
    desc: "Universal, Sony, Warner, Independent, and Other/Indie compared across 6.34B+ streams. Daily stream curves, week-over-week shifts, and live market share in a rolling 9-day window.",
    stats: ["6.34B Streams", "5 Label Groups", "9-Day Live Window"], color: "#7c6cf6",
    realtime: "The 9-day window rolls forward daily. Each morning's ingest drops the oldest day and adds the newest — trend lines never go stale without anyone touching a date filter." },
  { icon: "📈", tag: "POSITION INTELLIGENCE", title: "Chart Tracker",
    desc: "14-day rank trajectories for the current top 10 artists rendered as live line charts. Biggest riser (+7), biggest faller (-2), and average position tracked across all artists.",
    stats: ["14-Day Trajectories", "Risers & Fallers", "Avg Position"], color: "#ff6b6b",
    realtime: "Position data is appended on each run rather than overwritten — building a continuous history you can slice by 7, 14, or 30 days without any data loss." },
  { icon: "🎯", tag: "TRACK INTELLIGENCE", title: "Acquisition Track",
    desc: "613 tracks scored 0–100 on an Acquisition Score built from rank, stream momentum, and cross-platform presence. Filter by Rising / Stable / Falling across 7, 14, or 30-day windows.",
    stats: ["613 Tracks", "Acq Score 0–100", "Cross-Platform Signals"], color: "#00c2e0",
    realtime: "Scores are recalculated on every pipeline run — a track that explodes overnight shows an elevated score by morning, not next week." },
  { icon: "💡", tag: "COMMERCIAL SIGNALS", title: "Artist Acquisition",
    desc: "300 ranked artists assessed with composite STRONG BUY / HOLD signals. Pulls from Spotify listeners, iTunes WW rank, tracks in top 200, and listener trajectory over 21-day periods.",
    stats: ["300 Artists", "Strong Buy / Hold", "21-Day Trajectory"], color: "#ff9f43",
    realtime: "The recommendation engine re-scores all 300 artists on every run. A HOLD artist can become STRONG BUY the same day their listener curve inflects." },
  { icon: "⚖️", tag: "COMPARE", title: "Artist Comparison",
    desc: "Pick 2–5 artists and see rank, monthly listeners, song count, and LATAM country footprint side by side. Visual comparison charts draw from the same live dataset as the leaderboard.",
    stats: ["Up to 5 Artists", "Side-by-Side Metrics", "Visual Charts"], color: "#48dbfb",
    realtime: "All comparison metrics reflect the most recent leaderboard snapshot — comparing Drake vs. Michael Jackson today gives today's numbers, not yesterday's." },
  { icon: "🤖", tag: "AI ANALYST", title: "Ask Anything",
    desc: "Type a question in plain English. The AI translates it into a live PostgreSQL query against the full artist, track, and chart dataset — returning answers, tables, and charts in seconds.",
    stats: ["Natural Language", "Live PostgreSQL", "Charts + Tables"], color: "#a29bfe",
    realtime: "Queries run against the live database, not a cached export — asking 'Who debuted this week?' returns this week's actual entries, not a PDF from last Friday." },
];

const REALTIME_TERMS = [
  { term: "Live", badge: "● LIVE", badgeColor: "#00e5a0", icon: "🟢",
    short: "The dashboard is connected to the source and updates automatically.",
    long: "When you see LIVE in Artist 360°, it means the dashboard is reading from a database that is actively written to by automated pipelines. There is no manual export, no emailed spreadsheet, and no stale screenshot. Every metric — rank, listener count, stream total — reflects the most recently ingested batch of chart data from Spotify and iTunes.",
    example: "The Leaderboard header reads '● LIVE' because the rank table is rebuilt each time new chart data arrives — typically within minutes of the platforms publishing it." },
  { term: "Last Run", badge: "LAST RUN 2026-05-19 00:34", badgeColor: "#f5c518", icon: "🕐",
    short: "The exact timestamp when the data pipeline last successfully completed.",
    long: "Artist 360° runs automated data pipelines — scripts that fetch raw chart data from Spotify and iTunes, clean it, compute scores, and write results to the database. 'Last Run' shows you the moment the most recent pipeline finished. It is a freshness guarantee: you always know how old the data is, down to the minute.",
    example: "'Last run: 2026-05-19 00:34' on the Chart Tracker means all rank trajectories were computed from data fetched at 12:34 AM today — not cached from a prior day." },
  { term: "Week 20 · May 2026", badge: "WK 20 · MAY 2026", badgeColor: "#7c6cf6", icon: "📅",
    short: "The current reporting week — aligned to iTunes and Spotify chart publish cycles.",
    long: "iTunes WW charts and Spotify global snapshots are published on a weekly cycle. Week 20 of 2026 runs May 12–19. Artist 360 aligns all debut reports, position changes, and acquisition scores to this same cycle — so when a label asks 'what debuted this week?' the answer maps exactly to data the platforms themselves have published.",
    example: "The Debut Report shows '101 new entries vs prior week · Week 20 · May 2026' — 101 tracks appeared on the chart for the first time in the May 12–19 window that were absent in Week 19." },
  { term: "9-Day Window", badge: "9-DAY WINDOW", badgeColor: "#ff9f43", icon: "🪟",
    short: "A rolling lookback period that advances daily, always showing the freshest 9 days.",
    long: "Rather than a fixed date range that goes stale, the 9-day window slides forward every day. The oldest day's data is dropped and the newest day is added. This means label stream curves, market share percentages, and week-over-week comparisons always reflect 'recent reality' without anyone manually updating a date filter.",
    example: "On May 19, the Label Market Dashboard shows May 11–19. On May 20, it automatically shows May 12–20 — Universal's share and Sony's rank recalculate against the new 9-day total." },
  { term: "WkA → WkB", badge: "WKA → WKB", badgeColor: "#00c2e0", icon: "📊",
    short: "Week-over-week comparison — the first half vs. second half of the current window.",
    long: "To show momentum without waiting for full calendar weeks, Artist 360° splits the 9-day window into two halves: Week A (May 11–14) and Week B (May 15–19). Comparing WkA→WkB streams gives an early signal on whether a label or artist is accelerating or decelerating inside the current period.",
    example: "Other/Indie went from 288.8M in WkA to 1.1B in WkB — a +270.4% surge. This is an intra-period momentum signal, not a full calendar-week comparison." },
  { term: "Debut Score", badge: "DEBUT SCORE", badgeColor: "#ff6b6b", icon: "⚡",
    short: "A composite metric measuring how strongly a track entered the chart relative to incumbents.",
    long: "Raw rank alone doesn't tell the full story. Debuting at #1 with 42.9M entry streams is very different from debuting at #50 with 1M. The Debut Score normalizes entry streams and rank into a single number, then computes 'Strength vs Field' (debut/incumbent ratio) to show whether new entrants are out-competing existing chart holders.",
    example: "Drake's 'Make Them Cry' debuted at #1 with entry score 42.9M — strongest single-track debut of Week 20. 'Strength vs Field: 0.76×' means debuts collectively were 76% as powerful as incumbents that week." },
  { term: "Acquisition Score", badge: "ACQ SCORE 0–100", badgeColor: "#48dbfb", icon: "🎯",
    short: "A 0–100 signal rating how attractive a track is for commercial acquisition right now.",
    long: "Computed fresh on every pipeline run by weighing four factors: current chart rank (how visible?), stream momentum (growing or shrinking?), cross-platform presence (Spotify and iTunes both?), and historical peak (how high has it gone?). A score of 68 — like Billie Jean — means it is a strong candidate worth watching, but not yet at STRONG BUY threshold.",
    example: "Billie Jean scores 68 with a WATCH signal: rank #1 on Spotify Global, 5.6M streams, +1.5% momentum, confirmed cross-platform. TOTO's Africa has faster growth (+9.9%) but a lower score because its rank position is weaker." },
  { term: "Strong Buy / Hold / Watch", badge: "STRONG BUY", badgeColor: "#00e5a0", icon: "💡",
    short: "Commercial acquisition signals derived from composite artist performance data.",
    long: "These are A&R and label acquisition signals, not financial trading terms. STRONG BUY means an artist's Spotify listener trajectory, iTunes WW rank, and chart footprint are all elevated simultaneously. HOLD means performance is stable but not inflecting. WATCH means one or two indicators are moving but the full signal hasn't confirmed yet.",
    example: "Michael Jackson shows STRONG BUY on May 19: 102.1M Spotify listeners at peak, iTunes WW #1, 17 simultaneous global tracks charting. Every signal column is green at the same time." },
  { term: "Cross-Platform", badge: "+ CROSS", badgeColor: "#7c6cf6", icon: "🌐",
    short: "A track charting on both Spotify Global and iTunes WW simultaneously.",
    long: "Most tracks chart strongly on one platform or the other. When a track appears in top tiers of both Spotify (stream-based) and iTunes WW (purchase/airplay-based), it signals broad audience appeal that is not algorithm-dependent. Artist 360 tags these tracks with CROSS and weights them higher in Acquisition Scores — cross-platform performance is a more durable signal of real-world demand.",
    example: "60 tracks in the current window carry the CROSS tag — including Billie Jean and SWIM by BTS — both appearing in the Track Acquisition table with elevated scores as a result." },
];

const METRICS = [
  { value: "170", suffix: "+", label: "Artists Tracked", color: "#00e5a0" },
  { value: "18", suffix: "", label: "LATAM Markets", color: "#7c6cf6" },
  { value: "6.34", suffix: "B", label: "Streams Monitored", color: "#f5c518" },
  { value: "613", suffix: "", label: "Tracks Scored Daily", color: "#00c2e0" },
];

function useIO(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Counter({ end, suffix }) {
  const [val, setVal] = useState(0);
  const [ref, vis] = useIO(0.4);
  useEffect(() => {
    if (!vis) return;
    let cur = 0;
    const target = parseFloat(end);
    const inc = target / 60;
    const t = setInterval(() => {
      cur += inc;
      if (cur >= target) { setVal(target); clearInterval(t); }
      else setVal(parseFloat(cur.toFixed(2)));
    }, 1000 / 60);
    return () => clearInterval(t);
  }, [vis, end]);
  return <span ref={ref}>{vis ? val : 0}{suffix}</span>;
}

function FeatureCard({ f, i }) {
  const [ref, vis] = useIO(0.06);
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? `linear-gradient(145deg,rgba(255,255,255,0.045),rgba(255,255,255,0.01))` : "rgba(255,255,255,0.025)", border: `1px solid ${hov ? f.color + "60" : "rgba(255,255,255,0.08)"}`, borderRadius: 18, padding: "1.75rem", position: "relative", overflow: "hidden", transform: vis ? (hov ? "translateY(-5px)" : "translateY(0)") : "translateY(28px)", opacity: vis ? 1 : 0, transition: "all 0.45s cubic-bezier(0.23,1,0.32,1)", transitionDelay: vis ? `${i * 55}ms` : "0ms" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: hov ? `linear-gradient(90deg,transparent,${f.color},transparent)` : "transparent", transition: "all 0.4s" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 26 }}>{f.icon}</span>
        <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.18em", color: f.color, fontFamily: "'Space Mono',monospace" }}>{f.tag}</span>
      </div>
      <h3 style={{ fontSize: "1.08rem", fontWeight: 700, fontFamily: "'Playfair Display',serif", marginBottom: 10 }}>{f.title}</h3>
      <p style={{ fontSize: "0.845rem", color: "rgba(255,255,255,0.52)", lineHeight: 1.72, marginBottom: hov ? 14 : 16 }}>{f.desc}</p>
      {hov && (
        <div style={{ marginBottom: 14, padding: "10px 13px", background: `${f.color}0d`, border: `1px solid ${f.color}22`, borderRadius: 10, fontSize: "0.78rem", color: f.color, lineHeight: 1.62 }}>
          ⏱ <strong>Real-time:</strong> {f.realtime}
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {f.stats.map((s, j) => <span key={j} style={{ background: `${f.color}12`, border: `1px solid ${f.color}28`, color: f.color, borderRadius: 6, padding: "3px 9px", fontSize: "0.7rem", fontFamily: "'Space Mono',monospace" }}>{s}</span>)}
      </div>
    </div>
  );
}

function GlossaryCard({ term, i }) {
  const [ref, vis] = useIO(0.06);
  const [open, setOpen] = useState(false);
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(20px)", transition: `all 0.5s ease ${i * 65}ms` }}>
      <div onClick={() => setOpen(!open)} style={{ background: open ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)", border: `1px solid ${open ? term.badgeColor + "45" : "rgba(255,255,255,0.08)"}`, borderRadius: open ? "16px 16px 0 0" : 16, padding: "18px 22px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, transition: "all 0.3s ease" }}>
        <span style={{ fontSize: 22, flexShrink: 0 }}>{term.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
            <span style={{ fontWeight: 700, fontSize: "0.98rem", fontFamily: "'Playfair Display',serif" }}>{term.term}</span>
            <span style={{ background: `${term.badgeColor}18`, border: `1px solid ${term.badgeColor}35`, color: term.badgeColor, borderRadius: 6, padding: "2px 9px", fontSize: "0.63rem", fontFamily: "'Space Mono',monospace", letterSpacing: "0.1em" }}>{term.badge}</span>
          </div>
          <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.42)" }}>{term.short}</p>
        </div>
        <span style={{ color: "rgba(255,255,255,0.28)", fontSize: "1.1rem", transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s", flexShrink: 0 }}>▾</span>
      </div>
      {open && (
        <div style={{ background: "rgba(255,255,255,0.015)", border: `1px solid ${term.badgeColor}28`, borderTop: "none", borderRadius: "0 0 16px 16px", padding: "18px 22px 22px" }}>
          <p style={{ fontSize: "0.87rem", color: "rgba(255,255,255,0.62)", lineHeight: 1.82, marginBottom: 16 }}>{term.long}</p>
          <div style={{ background: `${term.badgeColor}0b`, border: `1px solid ${term.badgeColor}22`, borderRadius: 10, padding: "12px 16px" }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: term.badgeColor, fontFamily: "'Space Mono',monospace", letterSpacing: "0.12em", marginBottom: 6 }}>EXAMPLE IN ARTIST 360</div>
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.56)", lineHeight: 1.72 }}>{term.example}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [heroVis, setHeroVis] = useState(false);
  const [ticker, setTicker] = useState(0);
  const [filter, setFilter] = useState("All");
  const PLATFORMS = ["Spotify Global · Daily Snapshots", "iTunes WW · Weekly Chart Cycle", "Cross-Platform Signal Engine"];
  const FILTERS = ["All", "Time & Freshness", "Scores", "Signals", "Platform"];
  const FILTER_MAP = {
    "All": REALTIME_TERMS,
    "Time & Freshness": REALTIME_TERMS.filter(t => ["Live","Last Run","Week 20 · May 2026","9-Day Window","WkA → WkB"].includes(t.term)),
    "Scores": REALTIME_TERMS.filter(t => ["Debut Score","Acquisition Score"].includes(t.term)),
    "Signals": REALTIME_TERMS.filter(t => ["Strong Buy / Hold / Watch"].includes(t.term)),
    "Platform": REALTIME_TERMS.filter(t => ["Cross-Platform"].includes(t.term)),
  };

  useEffect(() => {
    setTimeout(() => setHeroVis(true), 120);
    const onS = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onS);
    const t = setInterval(() => setTicker(p => (p + 1) % PLATFORMS.length), 3000);
    return () => { window.removeEventListener("scroll", onS); clearInterval(t); };
  }, []);

  const [mRef, mVis] = useIO(0.2);

  return (
    <div style={{ minHeight: "100vh", background: "#2d2e2d", color: "#fff", fontFamily: "'DM Sans',sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}
        ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:#070a10;}::-webkit-scrollbar-thumb{background:#00e5a033;border-radius:2px;}
        .gbtn:hover{box-shadow:0 0 36px rgba(0,229,160,0.38)!important;transform:translateY(-2px)!important;}
        .obtn:hover{background:rgba(255,255,255,0.07)!important;}
        @keyframes bgslow{0%{transform:translateY(0);}100%{transform:translateY(-60px);}}
        @keyframes ring{0%{transform:scale(1);opacity:.6;}100%{transform:scale(2.6);opacity:0;}}
        @keyframes ticker{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        @keyframes orbit{0%{transform:rotate(0deg) translateX(128px) rotate(0deg);}100%{transform:rotate(360deg) translateX(128px) rotate(-360deg);}}
        @keyframes orbit2{0%{transform:rotate(190deg) translateX(192px) rotate(-190deg);}100%{transform:rotate(550deg) translateX(192px) rotate(-550deg);}}
        @keyframes pulse{0%,100%{opacity:.7;transform:scale(1);}50%{opacity:1;transform:scale(1.04);}}
      `}</style>

      {/* FEATURES */}
      <section id="features" style={{ position: "relative", zIndex: 1, padding: "60px 2rem 100px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.7rem", color: "#7c6cf6", letterSpacing: "0.2em" }}>PLATFORM MODULES</span>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,4vw,3.2rem)", marginTop: 10, letterSpacing: "-0.02em", lineHeight: 1.1 }}>Artist 360° Platform</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", maxWidth: 500, margin: "14px auto 0", lineHeight: 1.75, fontSize: "0.88rem" }}>Hover any module to reveal what "real-time" specifically means for that view.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 18 }}>
            {FEATURES.map((f, i) => <FeatureCard key={i} f={f} i={i} />)}
          </div>
        </div>
      </section>

      {/* Atmosphere */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: "-60px", backgroundImage: `linear-gradient(rgba(0,229,160,0.032) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,160,0.032) 1px,transparent 1px)`, backgroundSize: "56px 56px", animation: "bgslow 50s linear infinite", maskImage: "radial-gradient(ellipse 90% 65% at 50% 0%,black 30%,transparent 100%)" }} />
        <div style={{ position: "absolute", top: "6%", left: "50%", transform: "translateX(-50%)", width: 860, height: 860, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,229,160,0.052) 0%,transparent 65%)" }} />
        <div style={{ position: "absolute", top: "58%", left: "4%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,108,246,0.07) 0%,transparent 70%)" }} />
        <div style={{ position: "absolute", top: "38%", right: "3%", width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,194,224,0.06) 0%,transparent 70%)" }} />
      </div>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2.5rem", background: scrolled ? "rgba(7,10,16,0.92)" : "transparent", backdropFilter: scrolled ? "blur(24px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none", transition: "all 0.35s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#00e5a0,#00c2e0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, animation: "pulse 4s ease-in-out infinite" }}>🎵</div>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.35rem" }}>Artist <span style={{ color: "#00e5a0" }}>360°</span> Intelligence</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 28, fontSize: "0.85rem" }}>
          {NAV_ITEMS.map(n => (
            <a key={n} href={`#${n.replace(/\s+/g,"-").toLowerCase()}`} style={{ color: "rgba(255, 255, 255, 0.91)", fontSize: "0.85rem", textDecoration: "none", fontWeight: 500, letterSpacing: "0.02em", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color="#fff"} onMouseLeave={e => e.target.style.color="rgba(255, 255, 255, 0.96)"}>{n}</a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 2rem 60px", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(3rem,7.5vw,6.8rem)", fontFamily: "'Playfair Display',serif", fontWeight: 400, lineHeight: 1.04, letterSpacing: "-0.03em", maxWidth: 1200, opacity: heroVis ? 1 : 0, transform: heroVis ? "translateY(0)" : "translateY(28px)", transition: "all 0.85s cubic-bezier(0.23,1,0.32,1) 0.1s" }}>
          The Intelligence layer<em style={{ color: "#00e5a0" }}> Latin music never had</em>
        </h1>

        <p style={{ fontSize: "1.08rem", color: "rgba(255,255,255,0.46)", maxWidth: 1080, lineHeight: 1.8, marginTop: 24, marginBottom: 12, opacity: heroVis ? 1 : 0, transform: heroVis ? "translateY(0)" : "translateY(20px)", transition: "all 0.85s cubic-bezier(0.23,1,0.32,1) 0.22s" }}>
          Real-time artist rankings, label market share, debut signals, and AI-powered analysis — unified across Spotify and iTunes for 18 LATAM markets. Every number you see is <strong style={{ color: "rgba(255,255,255,0.75)" }}>live, sourced, and timestamped.</strong>
        </p>

        <div style={{ height: 30, overflow: "hidden", marginBottom: 36, opacity: heroVis ? 1 : 0, transition: "opacity 0.8s ease 0.35s" }}>
          <div key={ticker} style={{ animation: "ticker 0.45s ease forwards", fontFamily: "'Space Mono',monospace", fontSize: "0.78rem", color: "#7c6cf6", letterSpacing: "0.1em" }}>▸ {PLATFORMS[ticker]}</div>
        </div>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginBottom: 70, opacity: heroVis ? 1 : 0, transform: heroVis ? "translateY(0)" : "translateY(20px)", transition: "all 0.85s cubic-bezier(0.23,1,0.32,1) 0.4s" }}>
          <button className="gbtn" style={{ background: "#00e5a0", color: "#070a10", border: "none", borderRadius: 10, padding: "13px 32px", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer", transition: "all 0.3s ease" }} onClick={() => window.open("https://artist360intelligence.streamlit.app", "_blank")}>Get Demo</button>
          <button className="obtn" onClick={() => document.getElementById("glossary")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.16)", borderRadius: 10, padding: "13px 28px", fontSize: "0.95rem", fontWeight: 500, cursor: "pointer", transition: "all 0.3s ease" }}>Explore the Glossary ↓</button>
        </div>

        {/* Dashboard mockup */}
        <div style={{ width: "100%", maxWidth: 1020, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 22, overflow: "hidden", opacity: heroVis ? 1 : 0, transform: heroVis ? "translateY(0) perspective(1200px) rotateX(3.5deg)" : "translateY(60px) perspective(1200px) rotateX(9deg)", transition: "all 1.1s cubic-bezier(0.23,1,0.32,1) 0.55s", boxShadow: "0 50px 140px rgba(0,0,0,0.65), 0 0 0 1px rgba(0,229,160,0.08)" }}>
          <div style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "12px 20px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", gap: 6 }}>{["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}</div>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 6, padding: "4px 14px", fontSize: "0.7rem", color: "rgba(255,255,255,0.26)", fontFamily: "'Space Mono',monospace" }}>chromadata.com · Artist 360° Intelligence</div>
            <div style={{ background: "rgba(0,229,160,0.13)", color: "#00e5a0", border: "1px solid rgba(0,229,160,0.28)", borderRadius: 6, padding: "3px 10px", fontSize: "0.65rem", fontFamily: "'Space Mono',monospace" }}>● LIVE · Last run 00:34</div>
          </div>
          <div style={{ padding: "22px 24px 0", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            {[
              { l: "CURRENTLY #1", v: "Drake", s: "94.26M listeners", c: "#00e5a0" },
              { l: "STRONGEST DEBUT", v: "#1 Entry", s: "Make Them Cry · 42.9M", c: "#f5c518" },
              { l: "TOP LABEL · STREAMS", v: "Universal", s: "1.74B · 27.4% share", c: "#7c6cf6" },
              { l: "STRONG BUY", v: "Michael J.", s: "102.1M · iTunes #1", c: "#ff9f43" },
            ].map((k, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${k.c}1e`, borderRadius: 12, padding: "14px" }}>
                <div style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.35)", marginBottom: 5, fontFamily: "'Space Mono',monospace", letterSpacing: "0.1em" }}>{k.l}</div>
                <div style={{ fontSize: "1.15rem", fontWeight: 700, color: k.c, fontFamily: "'Playfair Display',serif" }}>{k.v}</div>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.34)", marginTop: 4 }}>{k.s}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: "16px 24px 24px", display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16 }}>
            <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)", padding: "16px" }}>
              <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.28)", fontFamily: "'Space Mono',monospace", marginBottom: 12 }}>SPOTIFY GLOBAL · DAILY STREAMS BY LABEL · MAY 11–19</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 80 }}>
                {[38,55,80,42,95,68,100,58,72,44,88,62,76,50,92,38,65,55,80].map((h,i) => (
                  <div key={i} style={{ flex: 1, borderRadius: "3px 3px 0 0", background: i===14 ? "#00e5a0" : `rgba(0,229,160,${0.1+(h/100)*0.22})`, height: `${h}%` }} />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                {["May 11","","","","May 15","","","","May 19"].map((d,i) => <span key={i} style={{ fontSize: "0.56rem", color: "rgba(255,255,255,0.2)" }}>{d}</span>)}
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)", padding: "16px" }}>
              <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.28)", fontFamily: "'Space Mono',monospace", marginBottom: 12 }}>TOP TRACKS · ACQ SCORE</div>
              {[
                { t: "Billie Jean", a: "Michael Jackson", s: 68, c: "#00e5a0", sig: "WATCH" },
                { t: "SWIM", a: "BTS", s: 62, c: "#f5c518", sig: "HOLD" },
                { t: "Africa", a: "TOTO", s: 55, c: "#7c6cf6", sig: "RISING" },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.76rem", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.t}</div>
                    <div style={{ fontSize: "0.64rem", color: "rgba(255,255,255,0.34)" }}>{r.a}</div>
                  </div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: r.c, fontFamily: "'Playfair Display',serif", minWidth: 26, textAlign: "right" }}>{r.s}</div>
                  <div style={{ background: `${r.c}18`, border: `1px solid ${r.c}30`, color: r.c, borderRadius: 5, padding: "2px 7px", fontSize: "0.6rem", fontFamily: "'Space Mono',monospace" }}>{r.sig}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      

      {/* METRICS */}
      <section ref={mRef} style={{ position: "relative", zIndex: 1, padding: "40px 2rem 80px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 28 }}>
          {METRICS.map((m, i) => (
            <div key={i} style={{ textAlign: "center", opacity: mVis ? 1 : 0, transform: mVis ? "translateY(0)" : "translateY(20px)", transition: `all 0.6s ease ${i*100}ms` }}>
              <div style={{ fontSize: "clamp(2rem,4vw,3rem)", fontFamily: "'Playfair Display',serif", color: m.color }}><Counter end={m.value} suffix={m.suffix} /></div>
              <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.38)", marginTop: 6, letterSpacing: "0.04em" }}>{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ position: "relative", zIndex: 1, padding: "80px 2rem 100px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.7rem", color: "#00c2e0", letterSpacing: "0.2em" }}>PIPELINE ARCHITECTURE</span>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.8rem,4vw,3rem)", marginTop: 10, letterSpacing: "-0.02em", lineHeight: 1.1 }}>From raw chart data<br /><em style={{ color: "#00c2e0" }}>to live dashboard</em> in minutes</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", maxWidth: 500, margin: "14px auto 0", lineHeight: 1.75, fontSize: "0.88rem" }}>This is what makes every LIVE badge and Last Run timestamp meaningful.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0, position: "relative" }}>
            <div style={{ position: "absolute", top: 35, left: "12.5%", right: "12.5%", height: 2, background: "linear-gradient(90deg,#00e5a0,#7c6cf6,#00c2e0,#a29bfe)", opacity: 0.3, zIndex: 0 }} />
            {[
              { step: "01", icon: "📡", title: "Data Ingest", desc: "Automated scrapers fetch Spotify Global and iTunes WW chart snapshots daily — artist listener counts, track ranks, stream totals, and label attribution.", color: "#00e5a0" },
              { step: "02", icon: "⚙️", title: "Processing", desc: "Raw data is cleaned, normalized across 18 LATAM markets, and enriched with history. Debut detection, cross-platform matching, and label grouping happen here.", color: "#7c6cf6" },
              { step: "03", icon: "🧮", title: "Score Computation", desc: "Acquisition Scores, Debut Scores, momentum signals, and WkA→WkB deltas are computed from processed data and written to the live PostgreSQL database.", color: "#00c2e0" },
              { step: "04", icon: "🟢", title: "Live Dashboards", desc: "All views read directly from the live database. The LIVE badge and Last Run timestamp confirm the pipeline completed successfully and the data is fresh.", color: "#a29bfe" },
            ].map((s, i) => (
              <div key={i} style={{ padding: "0 18px", textAlign: "center", position: "relative", zIndex: 1 }}>
                <div style={{ width: 70, height: 70, borderRadius: "50%", background: `${s.color}14`, border: `2px solid ${s.color}38`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 16px" }}>{s.icon}</div>
                <div style={{ fontSize: "0.63rem", fontFamily: "'Space Mono',monospace", color: s.color, letterSpacing: "0.15em", marginBottom: 8 }}>STEP {s.step}</div>
                <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: "0.98rem", marginBottom: 10 }}>{s.title}</h4>
                <p style={{ fontSize: "0.77rem", color: "rgba(255,255,255,0.42)", lineHeight: 1.72 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GLOSSARY */}
      <section id="glossary" style={{ position: "relative", zIndex: 1, padding: "80px 2rem 100px" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.7rem", color: "#f5c518", letterSpacing: "0.2em" }}>REAL-TIME TERMINOLOGY</span>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,4vw,3rem)", marginTop: 10, letterSpacing: "-0.02em", lineHeight: 1.1, maxWidth: 1060 }}>What <em style={{ color: "#f5c518" }}>"real time"</em><br />actually means here</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", maxWidth: 560, margin: "14px auto 0", lineHeight: 1.8, fontSize: "0.9rem" }}>
              Every badge, label, and signal in Artist 360 has a precise definition. Click any term to see the full explanation and a real example pulled directly from the live data.
            </p>
          </div>

          {/* Filter pills */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
            {["All","Time & Freshness","Scores","Signals","Platform"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? "#f5c518" : "rgba(255,255,255,0.04)", color: filter === f ? "#070a10" : "rgba(255,255,255,0.52)", border: `1px solid ${filter === f ? "#f5c518" : "rgba(255,255,255,0.12)"}`, borderRadius: 100, padding: "6px 16px", fontSize: "0.76rem", fontWeight: filter === f ? 700 : 500, cursor: "pointer", transition: "all 0.25s ease", fontFamily: "'Space Mono',monospace", letterSpacing: "0.05em" }}>{f}</button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(FILTER_MAP[filter] || REALTIME_TERMS).map((term, i) => <GlossaryCard key={term.term} term={term} i={i} />)}
          </div>
        </div>
      </section>

      {/* AI SECTION */}
      <section style={{ position: "relative", zIndex: 1, padding: "60px 2rem 100px" }}>
        <div style={{ maxWidth: 940, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
            <div>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.7rem", color: "#a29bfe", letterSpacing: "0.2em" }}>AI DATA ANALYST</span>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", marginTop: 12, letterSpacing: "-0.02em", lineHeight: 1.15 }}>Ask questions.<br /><em style={{ color: "#a29bfe" }}>Get live answers.</em></h2>
              <p style={{ color: "rgba(255,255,255,0.44)", lineHeight: 1.8, marginTop: 16, fontSize: "0.87rem" }}>Type any question in plain English — the AI translates it to a live PostgreSQL query against the full artist, track, and chart database. Results include prose, tables, and charts.</p>
              <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { q: "Natural Language Input", d: "No SQL, no filters — type what you want to know." },
                  { q: "Live Database Query", d: "Runs against the real-time DB, not a cached snapshot." },
                  { q: "Instant Visual Output", d: "Returns prose, sortable tables, or rendered charts in seconds." },
                ].map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#a29bfe", marginTop: 6, flexShrink: 0 }} />
                    <div><span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{p.q} </span><span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.4)" }}>— {p.d}</span></div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 16 }}>🤖</span>
                <span style={{ fontWeight: 600, fontSize: "0.88rem" }}>AI Data Analyst</span>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00e5a0", animation: "ring 2s ease-out infinite" }} />
                  <span style={{ fontSize: "0.63rem", color: "#00e5a0", fontFamily: "'Space Mono',monospace" }}>LIVE DB</span>
                </div>
              </div>
              <div style={{ padding: "18px", display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { q: "Which label is growing fastest this week?", a: "Other/Indie is up +270.4% WkA→WkB, moving from 288.8M to 1.1B streams and now holding 21.4% market share — the largest intra-period surge of any label group." },
                  { q: "Who debuted strongest in Week 20?", a: "Drake's 'Make Them Cry' debuted at #1 with entry score 42.9M — the highest single-track debut of Week 20, and 76% as strong as the average incumbent track." },
                ].map((m, i) => (
                  <div key={i}>
                    <div style={{ background: "rgba(162,155,254,0.1)", border: "1px solid rgba(162,155,254,0.18)", borderRadius: "12px 12px 4px 12px", padding: "10px 14px", fontSize: "0.8rem", color: "rgba(255,255,255,0.8)", maxWidth: "78%", marginLeft: "auto" }}>{m.q}</div>
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "4px 12px 12px 12px", padding: "10px 14px", fontSize: "0.78rem", color: "rgba(255,255,255,0.58)", lineHeight: 1.65, maxWidth: "88%", marginTop: 7 }}>{m.a}</div>
                  </div>
                ))}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, padding: "10px 14px", display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ flex: 1, fontSize: "0.76rem", color: "rgba(255,255,255,0.18)" }}>Ask about artists, listeners, rankings, trends…</span>
                  <div style={{ width: 26, height: 26, borderRadius: 6, background: "#a29bfe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>↑</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" style={{ position: "relative", zIndex: 1, padding: "60px 2rem 120px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", background: "linear-gradient(135deg,rgba(0,229,160,0.06) 0%,rgba(124,108,246,0.06) 100%)", border: "1px solid rgba(0,229,160,0.14)", borderRadius: 28, padding: "64px 48px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -100, right: -100, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,229,160,0.1) 0%,transparent 70%)", pointerEvents: "none" }} />
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.7rem", color: "#00e5a0", letterSpacing: "0.2em" }}>GET STARTED</span>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,4vw,2.8rem)", marginTop: 12, letterSpacing: "-0.02em", lineHeight: 1.15 }}>Know your market.<br /><em style={{ color: "#00e5a0" }}>Before anyone else does.</em></h2>
          <p style={{ color: "rgba(255,255,255,0.44)", marginTop: 16, lineHeight: 1.78, marginBottom: 36, fontSize: "0.9rem" }}>Music labels, A&Rs, and managers across Latin America use Artist 360° Intelligence to act on real data — not last week's spreadsheet. Every metric is live, sourced, and timestamped.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="gbtn" style={{ background: "#00e5a0", color: "#070a10", border: "none", borderRadius: 10, padding: "14px 36px", fontSize: "1rem", fontWeight: 700, cursor: "pointer", transition: "all 0.3s ease" }}>Request Early Access</button>
            <button className="obtn" style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 10, padding: "14px 28px", fontSize: "1rem", fontWeight: 500, cursor: "pointer", transition: "all 0.3s ease" }}>Contact Sales</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 2.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ fontSize: "0.82rem", color: "#fff", fontFamily: "'Space Mono',monospace" }}>info@chromadata.com · © 2026 Chromadata</div>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy","Terms","Docs","Glossary"].map(l => (
            <a key={l} href="#" style={{ fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.97)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color="#fff"} onMouseLeave={e => e.target.style.color="rgba(255, 255, 255, 0.95)"}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}