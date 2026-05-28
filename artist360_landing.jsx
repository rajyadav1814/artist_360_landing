import { useState, useEffect, useRef } from "react";

const NAV_ITEMS = [
  { id: "features", label: "Features" },
  { id: "leaderboard", label: "Leaderboard" },
  { id: "label-intelligence", label: "Label Intel" },
  { id: "chart-tracker", label: "Chart Tracker" },
  { id: "movement-dashboard", label: "Movement" },
  { id: "track-acquisition", label: "Track Acquisition" },
  { id: "glossary", label: "Glossary" },
  { id: "ai-analyst", label: "AI Analyst" },
];

const FEATURES = [
  { icon: "🏆", tag: "LEADERBOARD", title: "Artist 360°",
    desc: "200+ Latin artists ranked by a composite score — iTunes points, Spotify listeners, and cross-market footprint. Rebuilt automatically on every data run.",
    fullDesc: "The single source of truth for Latin music power. 200+ artists ranked by a composite score that weighs iTunes chart points, Spotify monthly listeners, and cross-market footprint — rebuilt automatically every time fresh data arrives from either platform.",
    stats: ["200+ Artists", "18 LATAM Markets", "Live Composite Score"], color: "#00e5a0",
    realtime: "Rankings are rebuilt on every pipeline run. The moment Spotify or iTunes pushes a new chart snapshot, positions shift — no spreadsheet, no manual trigger, no delay." },
  { icon: "⚡", tag: "DEBUT INTELLIGENCE", title: "Debuts / Chart",
    desc: "Every chart debut flagged, scored, and stacked vs. incumbents — Debut Score, Strength vs Field ratio, and multi-track leaders, live for the current week.",
    fullDesc: "Catch breakout moments the instant they happen. Every first-time chart appearance is flagged, scored, and stacked against the incumbents it displaced — including Debut Score, Strength vs Field ratio, and multi-track debutant leaders, all live for the current week.",
    stats: ["101 New Entries / Wk", "Debut Score", "Strength vs Field"], color: "#f472b6",
    realtime: "Debut detection runs inside the same processing cycle as raw chart ingestion — a track that charts for the first time today surfaces within minutes, not at next week's report." },
  { icon: "🏷️", tag: "LABEL INTELLIGENCE", title: "Label Market Share",
    desc: "5 label groups tracked across 6.34B+ streams in a 9-day rolling window. Daily stream curves and week-over-week shifts show exactly who is gaining ground.",
    fullDesc: "Universal, Sony, Warner, Independent, and Other/Indie battle for share across 6.34B+ streams in a rolling 9-day window. Daily stream curves and week-over-week momentum shifts reveal exactly who is gaining ground — and who is losing it.",
    stats: ["6.34B+ Streams", "5 Label Groups", "9-Day Rolling Window"], color: "#818cf8",
    realtime: "Each morning's ingest automatically drops the oldest day and appends the newest. Trend lines stay perpetually current without anyone touching a date filter." },
  { icon: "📈", tag: "POSITION INTELLIGENCE", title: "Chart Tracker",
    desc: "14-day rank trajectories for the top 10. Surfaces the biggest riser, biggest faller, and average position — a trajectory, not just today's number.",
    fullDesc: "Watch rank momentum unfold over 14 days for the current top 10. Live line charts surface the biggest riser, biggest faller, and average position across the full cohort — giving you a trajectory, not just today's number.",
    stats: ["14-Day Trajectories", "Risers & Fallers", "Avg Position"], color: "#fb923c",
    realtime: "Position history is appended on every run rather than overwritten — building a continuously growing timeline you can slice to 7, 14, or 30 days with zero data loss." },
  { icon: "🎯", tag: "TRACK INTELLIGENCE", title: "Acquisition Track",
    desc: "613 tracks scored 0–100 on chart rank, stream momentum, and cross-platform signal. Filter Rising / Stable / Falling instantly to surface what's worth acting on.",
    fullDesc: "613 tracks ranked on an Acquisition Score from 0–100 derived from chart rank, stream momentum, and cross-platform signal strength. Filter by Rising / Stable / Falling across three time windows to surface exactly the tracks worth acting on now.",
    stats: ["613 Tracks Scored", "Acq Score 0–100", "Cross-Platform Signal"], color: "#22d3ee",
    realtime: "Scores are fully recalculated on every pipeline run. A track that goes viral overnight shows an elevated score by morning — not buried in next week's PDF." },
  { icon: "💡", tag: "COMMERCIAL SIGNALS", title: "Artist Acquisition",
    desc: "300 artists scored with a STRONG BUY / HOLD engine — drawing from Spotify listeners, iTunes rank, top-200 tracks, and a 21-day trajectory.",
    fullDesc: "300 artists assessed and ranked by a composite STRONG BUY / HOLD signal engine. Draws from Spotify listener counts, iTunes WW rank, tracks in the top 200, and 21-day listener trajectory to surface artists with durable upside before the market catches on.",
    stats: ["300 Ranked Artists", "Strong Buy / Hold", "21-Day Trajectory"], color: "#c084fc",
    realtime: "All 300 artists are re-scored on every run. A HOLD can flip to STRONG BUY the same day its listener curve inflects — giving you the edge before the signal becomes obvious." },
  { icon: "⚖️", tag: "COMPARE", title: "Artist Comparison",
    desc: "Compare 2–5 artists side-by-side: rank, listeners, track count, and LATAM footprint — bar and radar charts pulled from the live leaderboard.",
    fullDesc: "Stack any 2–5 artists side by side across rank, monthly listeners, track count, and LATAM country footprint. Visual bar and radar charts draw from the same live dataset as the global leaderboard for instant, apples-to-apples context.",
    stats: ["Up to 5 Artists", "Side-by-Side Metrics", "Visual Radar Charts"], color: "#34d399",
    realtime: "All comparison metrics pull from the most recent leaderboard snapshot — every head-to-head reflects today's live numbers, never a cached or stale export." },
  { icon: "🤖", tag: "AI ANALYST", title: "Ask Anything",
    desc: "Type a question in plain English — AI translates it into a live PostgreSQL query across artist, track, and chart data. Answers, tables, and charts in seconds.",
    fullDesc: "No SQL, no dashboards, no waiting. Type a question in plain English and the AI translates it into a live PostgreSQL query across the full artist, track, and chart dataset — surfacing answers, ranked tables, and visual charts in seconds.",
    stats: ["Natural Language", "Live PostgreSQL", "Charts + Tables"], color: "#a78bfa",
    realtime: "Every query runs directly against the live database — asking 'Who debuted this week with the highest stream count?' returns today's real answer, not a Friday export." },
];

const REALTIME_TERMS = [
  { term: "Live", badge: "● LIVE", badgeColor: "#00e5a0", icon: "🟢",
    short: "The dashboard is connected to the source and updates automatically.",
    long: "When you see LIVE in Artist 360°, it means the dashboard is reading from a database that is actively written to by automated pipelines. There is no manual export, no emailed spreadsheet, and no stale screenshot. Every metric — rank, listener count, stream total — reflects the most recently ingested batch of chart data from Spotify and iTunes.",
    example: "The Leaderboard header reads '● LIVE' because the rank table is rebuilt each time new chart data arrives — typically within minutes of the platforms publishing it." },
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
    const inc = target / 80;
    const t = setInterval(() => {
      cur += inc;
      if (cur >= target) { setVal(target); clearInterval(t); }
      else setVal(parseFloat(cur.toFixed(2)));
    }, 1000 / 60);
    return () => clearInterval(t);
  }, [vis, end]);
  return <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>{vis ? val : 0}{suffix}</span>;
}

function FeatureModal({ f, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(7,11,20,0.82)",
        backdropFilter: "blur(18px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1.5rem",
        animation: "fadeInUp 0.22s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: `linear-gradient(145deg,${f.color}10,rgba(13,20,40,0.98) 55%,rgba(10,16,32,0.99))`,
          border: `1px solid ${f.color}45`,
          borderRadius: 26,
          padding: "2.2rem 2.4rem 2rem",
          maxWidth: 560,
          width: "100%",
          position: "relative",
          boxShadow: `0 48px 120px rgba(0,0,0,0.65), 0 0 0 1px ${f.color}18, 0 0 60px ${f.color}10`,
          animation: "fadeInUp 0.28s cubic-bezier(0.23,1,0.32,1)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Top accent bar */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3, borderRadius: "26px 26px 0 0",
          background: `linear-gradient(90deg,transparent 0%,${f.color} 35%,${f.color}cc 65%,transparent 100%)`,
          boxShadow: `0 0 20px ${f.color}80`,
        }} />

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 18, right: 18,
            width: 32, height: 32, borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            border: `1px solid ${f.color}30`,
            color: "rgba(255,255,255,0.55)", fontSize: "1rem",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s",
            lineHeight: 1,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = `${f.color}20`; e.currentTarget.style.color = f.color; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
        >×</button>

        {/* Icon + tag */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
          <div style={{
            width: 54, height: 54, borderRadius: 16, flexShrink: 0,
            background: `${f.color}18`, border: `1px solid ${f.color}45`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26, boxShadow: `0 0 22px ${f.color}35, inset 0 1px 0 ${f.color}25`,
          }}>{f.icon}</div>
          <div>
            <div style={{
              fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.18em",
              color: f.color, fontFamily: "'Space Mono',monospace", marginBottom: 5,
            }}>{f.tag}</div>
            <h3 style={{
              fontSize: "1.45rem", fontWeight: 700, fontFamily: "'Playfair Display',serif",
              color: "#fff", lineHeight: 1.2,
            }}>{f.title}</h3>
          </div>
        </div>

        {/* Full description */}
        <p style={{
          fontSize: "0.92rem", color: "rgba(255,255,255,0.68)",
          lineHeight: 1.82, marginBottom: 22,
        }}>{f.fullDesc}</p>

        {/* Divider */}
        <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${f.color}30,transparent)`, marginBottom: 20 }} />

        {/* Real-time block */}
        <div style={{
          padding: "14px 16px", marginBottom: 22,
          background: `${f.color}0d`, border: `1px solid ${f.color}35`,
          borderRadius: 14,
          fontSize: "0.84rem", color: f.color, lineHeight: 1.72,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
            <span style={{ fontSize: "0.88rem" }}>⏱</span>
            <strong style={{ fontWeight: 700, fontSize: "0.72rem", fontFamily: "'Space Mono',monospace", letterSpacing: "0.14em" }}>REAL-TIME BEHAVIOUR</strong>
          </div>
          <p style={{ margin: 0, color: `${f.color}dd`, fontSize: "0.84rem" }}>{f.realtime}</p>
        </div>

        {/* Stats pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
          {f.stats.map((s, j) => (
            <span key={j} style={{
              background: `${f.color}16`, border: `1px solid ${f.color}45`,
              color: f.color, borderRadius: 8, padding: "6px 14px",
              fontSize: "0.72rem", fontFamily: "'Space Mono',monospace",
              fontWeight: 600, letterSpacing: "0.05em",
              boxShadow: `0 0 10px ${f.color}20`,
            }}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ f, i }) {
  const [ref, vis] = useIO(0.06);
  const [hov, setHov] = useState(false);
  const [open, setOpen] = useState(false);
  const num = String(i + 1).padStart(2, "0");
  return (
    <>
      {open && <FeatureModal f={f} onClose={() => setOpen(false)} />}
      <div ref={ref}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={() => setOpen(true)}
        style={{
          background: hov
            ? `linear-gradient(145deg,${f.color}0d,rgba(255,255,255,0.02) 60%,transparent)`
            : "rgba(255,255,255,0.028)",
          border: `1px solid ${hov ? f.color + "60" : "rgba(255,255,255,0.08)"}`,
          borderRadius: 22,
          padding: "1.75rem 1.9rem 1.65rem",
          position: "relative",
          overflow: "hidden",
          transform: vis ? (hov ? "translateY(-8px) scale(1.015)" : "translateY(0)") : "translateY(34px)",
          opacity: vis ? 1 : 0,
          transition: "all 0.48s cubic-bezier(0.23,1,0.32,1)",
          transitionDelay: vis ? `${i * 60}ms` : "0ms",
          boxShadow: hov
            ? `0 24px 64px rgba(0,0,0,0.38), 0 0 0 1px ${f.color}22, inset 0 1px 0 rgba(255,255,255,0.06)`
            : "0 4px 24px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.03)",
          cursor: "pointer",
        }}>

        {/* Top accent bar — always present, glows on hover */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: hov
            ? `linear-gradient(90deg,transparent 0%,${f.color} 40%,${f.color}bb 60%,transparent 100%)`
            : `linear-gradient(90deg,transparent,${f.color}30,transparent)`,
          transition: "all 0.45s ease",
          boxShadow: hov ? `0 0 16px ${f.color}90` : "none",
        }} />

        {/* Background radial glow corner */}
        <div style={{
          position: "absolute", bottom: -20, right: -20,
          width: 160, height: 160, borderRadius: "50%",
          background: `radial-gradient(circle,${f.color}${hov ? "12" : "07"} 0%,transparent 70%)`,
          transition: "all 0.5s ease",
          pointerEvents: "none",
        }} />

        {/* Card index watermark */}
        <div style={{
          position: "absolute", top: 14, right: 18,
          fontFamily: "'Space Mono',monospace", fontSize: "0.6rem",
          color: `${f.color}${hov ? "50" : "22"}`,
          fontWeight: 700, letterSpacing: "0.06em",
          transition: "color 0.4s",
          userSelect: "none",
        }}>{num}</div>

        {/* Icon box + tag */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 13, flexShrink: 0,
            background: hov ? `${f.color}1a` : `${f.color}10`,
            border: `1px solid ${f.color}${hov ? "40" : "22"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22,
            boxShadow: hov ? `0 0 18px ${f.color}30, inset 0 1px 0 ${f.color}20` : "none",
            transition: "all 0.4s ease",
            filter: hov ? `drop-shadow(0 0 6px ${f.color}60)` : "none",
          }}>{f.icon}</div>
          <span style={{
            fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.16em",
            color: hov ? f.color : f.color + "bb",
            fontFamily: "'Space Mono',monospace",
            transition: "color 0.3s",
            lineHeight: 1.3,
          }}>{f.tag}</span>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: "1.12rem", fontWeight: 700, fontFamily: "'Playfair Display',serif",
          marginBottom: 10, lineHeight: 1.25,
          color: hov ? "#fff" : "rgba(255,255,255,0.92)",
          transition: "color 0.3s",
        }}>{f.title}</h3>

        {/* Description */}
        <p style={{
          fontSize: "0.845rem", color: hov ? "rgba(255,255,255,0.62)" : "rgba(255,255,255,0.5)",
          lineHeight: 1.78, marginBottom: 16,
          transition: "color 0.3s",
        }}>{f.desc}</p>

        {/* Click-to-expand hint */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          opacity: hov ? 1 : 0.45,
          transition: "opacity 0.3s ease",
        }}>
        </div>
      </div>
    </>
  );
}

function GlossaryCard({ term, i }) {
  const [ref, vis] = useIO(0.06);
  const [open, setOpen] = useState(false);
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.5s ease ${i * 60}ms, transform 0.5s ease ${i * 60}ms` }}>
      <div
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: open ? `linear-gradient(135deg,${term.badgeColor}08,rgba(255,255,255,0.03))` : hov ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.018)",
          border: `1px solid ${open || hov ? term.badgeColor + "50" : "rgba(255,255,255,0.09)"}`,
          borderLeft: `3px solid ${open ? term.badgeColor : hov ? term.badgeColor + "80" : "rgba(255,255,255,0.12)"}`,
          borderRadius: open ? "14px 14px 0 0" : 14,
          padding: "16px 20px 16px 18px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 16,
          transition: "all 0.28s ease",
          boxShadow: open ? `0 4px 24px ${term.badgeColor}12` : hov ? "0 2px 14px rgba(0,0,0,0.18)" : "none",
        }}
      >
        <div style={{
          width: 42, height: 42, borderRadius: 10, background: `${term.badgeColor}12`,
          border: `1px solid ${term.badgeColor}28`, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 20, flexShrink: 0,
          boxShadow: open ? `0 0 12px ${term.badgeColor}30` : "none",
          transition: "all 0.28s ease",
        }}>{term.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap", marginBottom: 5 }}>
            <span style={{ fontWeight: 700, fontSize: "1rem", fontFamily: "'Playfair Display',serif" }}>{term.term}</span>
            <span style={{
              background: `${term.badgeColor}1a`, border: `1px solid ${term.badgeColor}40`,
              color: term.badgeColor, borderRadius: 20, padding: "2px 10px",
              fontSize: "0.615rem", fontFamily: "'Space Mono',monospace", letterSpacing: "0.12em",
              fontWeight: 700, boxShadow: open ? `0 0 8px ${term.badgeColor}28` : "none",
              transition: "box-shadow 0.28s",
            }}>{term.badge}</span>
          </div>
          <p style={{ fontSize: "0.795rem", color: "rgba(255,255,255,0.44)", lineHeight: 1.55, margin: 0 }}>{term.short}</p>
        </div>
        <div style={{
          width: 26, height: 26, borderRadius: "50%", background: open ? `${term.badgeColor}18` : "rgba(255,255,255,0.04)",
          border: `1px solid ${open ? term.badgeColor + "40" : "rgba(255,255,255,0.1)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, transition: "all 0.28s ease",
        }}>
          <span style={{ color: open ? term.badgeColor : "rgba(255,255,255,0.35)", fontSize: "0.75rem", transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.28s ease", display: "block", lineHeight: 1 }}>▾</span>
        </div>
      </div>
      {open && (
        <div style={{
          background: `linear-gradient(135deg,${term.badgeColor}06,rgba(255,255,255,0.01))`,
          border: `1px solid ${term.badgeColor}30`,
          borderLeft: `3px solid ${term.badgeColor}`,
          borderTop: "none",
          borderRadius: "0 0 14px 14px",
          padding: "20px 20px 22px 20px",
          animation: "fadeInUp 0.22s ease",
        }}>
          <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.85, marginBottom: 18 }}>{term.long}</p>
          <div style={{
            background: `${term.badgeColor}0d`, border: `1px solid ${term.badgeColor}28`,
            borderRadius: 10, padding: "13px 16px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: term.badgeColor }} />
              <span style={{ fontSize: "0.635rem", fontWeight: 700, color: term.badgeColor, fontFamily: "'Space Mono',monospace", letterSpacing: "0.14em" }}>LIVE EXAMPLE — ARTIST 360</span>
            </div>
            <p style={{ fontSize: "0.81rem", color: "rgba(255,255,255,0.58)", lineHeight: 1.75, margin: 0 }}>{term.example}</p>
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
  const [activeNav, setActiveNav] = useState("features");
  const [viewportWidth, setViewportWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);
  const SECTION_BACKGROUNDS = {
    app: "radial-gradient(130% 160% at 50% -20%, #16284f 0%, #0b1123 42%, #070b14 100%)",
    hero: "linear-gradient(180deg, rgba(18,31,58,0.92) 0%, rgba(13,22,42,0.82) 55%, rgba(10,17,33,0.72) 100%)",
    features: "linear-gradient(180deg, rgba(13,24,47,0.88) 0%, rgba(10,18,36,0.84) 100%)",
    workflow: "linear-gradient(180deg, rgba(9,25,42,0.9) 0%, rgba(8,18,30,0.85) 100%)",
    glossary: "linear-gradient(180deg, rgba(32,24,12,0.88) 0%, rgba(22,17,10,0.84) 100%)",
    ai: "linear-gradient(180deg, rgba(28,20,46,0.9) 0%, rgba(17,13,31,0.84) 100%)",
  };
  const SECTION_DIVIDER = "1px solid rgba(255,255,255,0.08)";
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

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const sections = NAV_ITEMS
      .map(item => document.getElementById(item.id))
      .filter(Boolean);

    if (!sections.length) return undefined;

    const obs = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target?.id) {
          setActiveNav(visible[0].target.id);
        }
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: [0.2, 0.35, 0.55, 0.75],
      }
    );

    sections.forEach(section => obs.observe(section));
    return () => obs.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (!target) return;
    setActiveNav(id);
    const y = target.getBoundingClientRect().top + window.scrollY - 118;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const isMd = viewportWidth <= 992;
  const isSm = viewportWidth <= 768;
  const twoColGrid = isMd ? "1fr" : "1fr 1fr";
  const fourColGrid = isSm ? "1fr" : isMd ? "repeat(2,1fr)" : "repeat(4,1fr)";
  const fiveColGrid = isSm ? "1fr" : isMd ? "repeat(2,1fr)" : "repeat(5,1fr)";

  const [mRef, mVis] = useIO(0.2);
  const [lbRef, lbVis] = useIO(0.12);
  const [laRef, laVis] = useIO(0.12);
  const [ctRef, ctVis] = useIO(0.12);
  const [mvRef, mvVis] = useIO(0.12);
  const [taRef, taVis] = useIO(0.12);

  return (
    <div style={{ minHeight: "100vh", background: SECTION_BACKGROUNDS.app, color: "#fff", fontFamily: "'DM Sans',sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:#0b0e1a;}::-webkit-scrollbar-thumb{background:linear-gradient(#00e5a0,#7c6cf6);border-radius:4px;}
        .gbtn:hover{box-shadow:0 0 48px rgba(0,229,160,0.55),0 8px 32px rgba(0,229,160,0.25)!important;transform:translateY(-3px) scale(1.02)!important;}
        .obtn:hover{background:rgba(255,255,255,0.09)!important;border-color:rgba(255,255,255,0.35)!important;box-shadow:0 0 20px rgba(255,255,255,0.06)!important;}
        .nav-link:hover{color:#00e5a0!important;text-shadow:0 0 14px rgba(0,229,160,0.5);}
        .top-nav-shell{display:flex;justify-content:center;flex-wrap:wrap;gap:10px;overflow:visible;padding:0 8px;}
        .top-nav-shell::-webkit-scrollbar{display:none;}
        .top-nav-btn{position:relative;isolation:isolate;border:1px solid rgba(255,255,255,0.15);background:linear-gradient(155deg,rgba(255,255,255,0.055),rgba(255,255,255,0.015));color:rgba(255,255,255,0.7);padding:8px 15px;border-radius:999px;font-size:.74rem;font-family:'Space Mono',monospace;letter-spacing:.06em;cursor:pointer;white-space:nowrap;transition:color .28s ease,border-color .28s ease,transform .28s ease,box-shadow .3s ease;backdrop-filter:blur(10px);animation:navSlideIn .52s cubic-bezier(0.23,1,0.32,1) both;}
        .top-nav-btn::before{content:"";position:absolute;inset:0;border-radius:inherit;background:linear-gradient(130deg,rgba(0,229,160,0.18),rgba(0,194,224,0.12));opacity:0;transition:opacity .28s ease;}
        .top-nav-btn span{position:relative;z-index:1;}
        .top-nav-btn:hover{transform:translateY(-2px);color:rgba(255,255,255,0.92);border-color:rgba(0,229,160,0.42);box-shadow:0 8px 24px rgba(0,0,0,0.35),0 0 18px rgba(0,229,160,0.2);}
        .top-nav-btn:hover::before{opacity:1;}
        .top-nav-btn.active{color:#0b0e1a;border-color:rgba(0,229,160,0.66);box-shadow:0 6px 16px rgba(0,229,160,0.24),0 0 10px rgba(0,229,160,0.18);}
        .top-nav-btn.active::before{opacity:1;background:linear-gradient(130deg,#00e5a0,#00c2e0);}
        @keyframes bgslow{0%{transform:translateY(0) rotate(0deg);}100%{transform:translateY(-60px) rotate(0.5deg);}}
        @keyframes ring{0%{transform:scale(1);opacity:.7;}100%{transform:scale(2.8);opacity:0;}}
        @keyframes navSlideIn{from{opacity:0;transform:translateY(-10px);}to{opacity:1;transform:translateY(0);}}
        @keyframes ticker{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
        @keyframes orbit{0%{transform:rotate(0deg) translateX(128px) rotate(0deg);}100%{transform:rotate(360deg) translateX(128px) rotate(-360deg);}}
        @keyframes orbit2{0%{transform:rotate(190deg) translateX(192px) rotate(-190deg);}100%{transform:rotate(550deg) translateX(192px) rotate(-550deg);}}
        @keyframes pulse{0%,100%{opacity:.7;transform:scale(1);}50%{opacity:1;transform:scale(1.06);}}
        @keyframes floatY{0%,100%{transform:translateY(0px);}50%{transform:translateY(-12px);}}
        @keyframes shimmer{0%{background-position:-200% center;}100%{background-position:200% center;}}
        @keyframes gradientShift{0%{background-position:0% 50%;}50%{background-position:100% 50%;}100%{background-position:0% 50%;}}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
        @keyframes glowPulse{0%,100%{box-shadow:0 0 20px rgba(0,229,160,0.2);}50%{box-shadow:0 0 40px rgba(0,229,160,0.45),0 0 80px rgba(0,229,160,0.15);}}
        @keyframes scanline{0%{top:-10%;}100%{top:110%;}}
        .metric-card:hover .metric-val{text-shadow:0 0 30px currentColor;}
        .step-circle:hover{transform:scale(1.1)!important;}
        .hero-badge{animation:fadeInUp 0.6s ease both;}
        .live-dot{animation:ring 1.8s ease-out infinite;}
        @media (max-width:1220px){
          .top-nav-shell{justify-content:flex-start;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;padding-bottom:4px;}
          .top-nav-shell::-webkit-scrollbar{display:none;}
        }
        @media (max-width:900px){
          .nav-brand-title{font-size:1.02rem!important;}
          .top-nav-btn{font-size:.68rem;padding:7px 12px;}
        }
        @media (max-width:640px){
          .nav-demo-btn{display:none;}
        }
      `}</style>

      {/* FEATURES */}
      <section id="features" style={{ position: "relative", zIndex: 1, padding: isSm ? "105px 1rem 80px" : isMd ? "105px 1.5rem 90px" : "105px 2rem 100px", scrollMarginTop: 128, background: SECTION_BACKGROUNDS.features, borderTop: SECTION_DIVIDER, borderBottom: SECTION_DIVIDER }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            {/* Section badge */}
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,4vw,3.2rem)", marginTop: 0, letterSpacing: "-0.025em", lineHeight: 1.08 }}>Artist 360° Platform</h2>
            <p style={{ color: "rgba(255,255,255,0.38)", maxWidth: 480, margin: "14px auto 0", lineHeight: 1.8, fontSize: "0.875rem" }}>
              Eight intelligence modules. One live database.{" "}
              <span style={{ color: "rgba(255,255,255,0.6)", borderBottom: "1px solid rgba(0,229,160,0.35)" }}>Click any card</span>{" "}to see the full details and real-time behaviour for that module.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 18 }}>
            {FEATURES.map((f, i) => <FeatureCard key={i} f={f} i={i} />)}
          </div>
        </div>
      </section>

      {/* LEADERBOARD PREVIEW */}
      <section id="leaderboard" ref={lbRef} style={{ position: "relative", zIndex: 1, padding: isSm ? "0 1rem 80px" : "0 2rem 100px", scrollMarginTop: 128, opacity: lbVis ? 1 : 0, transform: lbVis ? "translateY(0)" : "translateY(28px)", transition: "opacity 0.72s cubic-bezier(0.23,1,0.32,1), transform 0.72s cubic-bezier(0.23,1,0.32,1)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          {/* Section header */}
          <div style={{ textAlign: "center", marginBottom: 44, opacity: lbVis ? 1 : 0, transform: lbVis ? "translateY(0)" : "translateY(14px)", transition: "opacity 0.56s ease 70ms, transform 0.56s ease 70ms" }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.7rem,3.5vw,2.7rem)", letterSpacing: "-0.025em", lineHeight: 1.1, margin: 0 }}>Artist 360° Leaderboard — ranked live</h2>
            <p style={{ color: "rgba(255,255,255,0.38)", maxWidth: 500, margin: "12px auto 0", lineHeight: 1.8, fontSize: "0.875rem" }}>
              200+ artists ranked by iTunes performance, Spotify reach, and global footprint — with monthly listeners, peak listeners, points, and top market, all rebuilt on every data run.
            </p>
          </div>

          {/* Browser chrome wrapper */}
          <div style={{ background: "rgba(255,255,255,0.018)", border: "1px solid rgba(0,229,160,0.15)", borderRadius: 20, overflow: "hidden", boxShadow: "0 48px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,229,160,0.07), 0 0 60px rgba(0,229,160,0.05)", opacity: lbVis ? 1 : 0, transform: lbVis ? "translateY(0)" : "translateY(22px)", transition: "opacity 0.66s ease 140ms, transform 0.66s ease 140ms" }}>

            {/* Window chrome */}
            <div style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "11px 18px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", gap: 6 }}>{["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}</div>
              <div style={{ background: "rgba(0,229,160,0.12)", color: "#00e5a0", border: "1px solid rgba(0,229,160,0.28)", borderRadius: 6, padding: "3px 10px", fontSize: "0.63rem", fontFamily: "'Space Mono',monospace" }}>● LIVE</div>
            </div>

            {/* App header */}
            <div style={{ padding: "16px 24px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.15)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 20 }}>🏆</span>
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.4rem", fontWeight: 700 }}>Artist 360° Leaderboard</span>
              </div>
              <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.32)", fontFamily: "'Space Mono',monospace" }}>
                Top Latin artists ranked by iTunes performance, Spotify reach, and global footprint.
              </div>
            </div>

            {/* Main body: table left, charts right */}
            <div style={{ display: "grid", gridTemplateColumns: isMd ? "1fr" : "1fr 380px", opacity: lbVis ? 1 : 0, transition: "opacity 0.5s ease 190ms" }}>

              {/* Left: leaderboard table */}
              <div style={{ borderRight: isMd ? "none" : "1px solid rgba(255,255,255,0.06)", padding: "18px 0 0", overflowX: isSm ? "auto" : "visible", transform: lbVis ? "translateX(0)" : "translateX(-16px)", transition: "transform 0.58s ease 210ms" }}>
                <div style={{ padding: "0 20px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 16 }}>📋</span>
                    <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "rgba(255,255,255,0.88)" }}>Leaderboard table</span>
                  </div>
                  <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.33)" }}>Scroll through the latest rank, listener, and points data in one place.</div>
                </div>
                {/* Table header */}
                <div style={{ display: "grid", gridTemplateColumns: "52px 1fr 1fr 100px 110px 110px 72px", minWidth: isSm ? 760 : "auto", gap: 4, padding: "8px 20px", borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.1)" }}>
                  {["RANK","ARTIST","TOP SONG","TOP MARKET","MONTHLY LISTENERS","PEAK LISTENERS","POINTS"].map(h => (
                    <div key={h} style={{ fontSize: "0.54rem", color: "rgba(255,255,255,0.3)", fontFamily: "'Space Mono',monospace", letterSpacing: "0.05em" }}>{h}</div>
                  ))}
                </div>
                {/* Rows */}
                {[
                  { rank: 1, artist: "Drake", song: "Janice STFU", market: "Brazil", marketC: "#00e5a0", monthly: "95.45M", peak: "95.45M", pts: "17K", delta: null },
                  { rank: 2, artist: "Michael Jackson", song: "Billie Jean", market: "Mexico", marketC: "#00e5a0", monthly: "104.34M", peak: "104.34M", pts: "11K", delta: null },
                  { rank: 3, artist: "Justin Bieber", song: "Beauty and a Beat", market: "Paraguay", marketC: "#00e5a0", monthly: "142.58M", peak: "146.97M", pts: "4K", delta: null },
                  { rank: 4, artist: "Bad Bunny", song: "DtMF", market: "Chile", marketC: "#00e5a0", monthly: "99.93M", peak: "123.93M", pts: "4K", delta: { v: "+1", up: true } },
                  { rank: 5, artist: "BTS", song: "SWIM", market: "Brazil", marketC: "#00e5a0", monthly: "38.49M", peak: "46.72M", pts: "4K", delta: { v: "1", up: false } },
                  { rank: 6, artist: "Taylor Swift", song: "The Fate of Ophelia", market: "Uruguay", marketC: "#00e5a0", monthly: "101.88M", peak: "116.23M", pts: "3K", delta: null },
                  { rank: 7, artist: "Omar Courtz", song: "KOKO", market: "Panama", marketC: "#00e5a0", monthly: "28.88M", peak: "34.38M", pts: "2K", delta: null },
                ].map((row, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "52px 1fr 1fr 100px 110px 110px 72px", minWidth: isSm ? 760 : "auto", gap: 4, padding: "11px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", alignItems: "center", background: i === 0 ? "rgba(0,229,160,0.03)" : "transparent", opacity: lbVis ? 1 : 0, transform: lbVis ? "translateX(0)" : "translateX(-10px)", transition: `opacity 0.44s ease ${220 + i * 55}ms, transform 0.44s ease ${220 + i * 55}ms` }}>
                    <div style={{ fontSize: "1rem", fontWeight: 700, fontFamily: "'Playfair Display',serif", color: i === 0 ? "#00e5a0" : "rgba(255,255,255,0.7)" }}>{row.rank}</div>
                    <div>
                      <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>{row.artist}</div>
                      {row.delta ? (
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 3, marginTop: 3, background: row.delta.up ? "rgba(0,229,160,0.12)" : "rgba(251,146,60,0.12)", border: `1px solid ${row.delta.up ? "rgba(0,229,160,0.3)" : "rgba(251,146,60,0.3)"}`, borderRadius: 5, padding: "1px 6px", fontSize: "0.58rem", fontFamily: "'Space Mono',monospace", color: row.delta.up ? "#00e5a0" : "#fb923c", fontWeight: 700 }}>
                          {row.delta.up ? "▲" : "▼"}{row.delta.v}
                        </div>
                      ) : (
                        <div style={{ marginTop: 3, width: 18, height: 2, background: "rgba(255,255,255,0.12)", borderRadius: 1 }} />
                      )}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.55)" }}>{row.song}</div>
                    <div>
                      <span style={{ background: "rgba(0,229,160,0.12)", border: "1px solid rgba(0,229,160,0.28)", color: "#00e5a0", borderRadius: 6, padding: "3px 10px", fontSize: "0.62rem", fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>{row.market}</span>
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.72)", fontFamily: "'Space Mono',monospace" }}>{row.monthly}</div>
                    <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", fontFamily: "'Space Mono',monospace" }}>{row.peak}</div>
                    <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.72)", fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>{row.pts}</div>
                  </div>
                ))}
              </div>

              {/* Right: charts */}
              <div style={{ padding: "18px 18px 18px", display: "flex", flexDirection: "column", gap: 16, transform: lbVis ? "translateX(0)" : "translateX(16px)", transition: "transform 0.58s ease 250ms" }}>

                {/* Top Artists by Monthly Listeners bar chart */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "16px 16px 12px", flex: "1 1 0", opacity: lbVis ? 1 : 0, transform: lbVis ? "translateY(0)" : "translateY(10px)", transition: "opacity 0.5s ease 290ms, transform 0.5s ease 290ms" }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "rgba(255,255,255,0.85)", marginBottom: 14 }}>Top Artists by Monthly Listeners</div>
                  {/* SVG bar chart */}
                  <svg viewBox="0 0 320 140" style={{ width: "100%", height: 140 }} preserveAspectRatio="none">
                    {/* Grid lines */}
                    {[0,35,70,105,140].map(y => <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />)}
                    {/* Y labels */}
                    {[["140M",2],["100M",38],["60M",75],["20M",112]].map(([l,y]) => (
                      <text key={l} x="0" y={y} fontSize="7" fill="rgba(255,255,255,0.3)" fontFamily="monospace">{l}</text>
                    ))}
                    {/* Avg line */}
                    <line x1="30" y1="42" x2="320" y2="42" stroke="#f5c518" strokeWidth="1" strokeDasharray="4 3" />
                    <text x="260" y="38" fontSize="7" fill="#f5c518" fontFamily="monospace">Avg 114.80M</text>
                    {/* Bars — data: Justin Bieber 142.58, Bruno Mars 137.93, The Weeknd 115.64, Rihanna 112.53, Michael Jackson 104.34, Lady Gaga 103.54, Taylor Swift 101.88, Bad Bunny 99.93 */}
                    {[
                      ["Justin Bieber", 142.58, "#00e5a0"],
                      ["Bruno Mars", 137.93, "#818cf8"],
                      ["The Weeknd", 115.64, "#818cf8"],
                      ["Rihanna", 112.53, "#818cf8"],
                      ["Michael Jackson", 104.34, "#818cf8"],
                      ["Lady Gaga", 103.54, "#818cf8"],
                      ["Taylor Swift", 101.88, "#818cf8"],
                      ["Bad Bunny", 99.93, "#818cf8"],
                    ].map(([name, val, color], bi) => {
                      const maxH = 120; const barH = (val / 145) * maxH;
                      const x = 32 + bi * 37; const y = 128 - barH;
                      return (
                        <g key={name}>
                          <rect x={x} y={y} width={22} height={barH} fill={color} rx="3" opacity={bi === 0 ? 1 : 0.65} />
                          <text x={x + 11} y={y - 3} fontSize="6.5" fill="rgba(255,255,255,0.55)" fontFamily="monospace" textAnchor="middle">{val >= 100 ? `${val.toFixed(2)}M` : `${val}M`}</text>
                          <text x={x + 11} y={138} fontSize="6" fill="rgba(255,255,255,0.3)" fontFamily="monospace" textAnchor="middle" transform={`rotate(-30,${x+11},138)`}>{name.split(" ")[0]}</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Top Artists by iTunes Points horizontal bar chart */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "16px 16px 14px", flex: "1 1 0", opacity: lbVis ? 1 : 0, transform: lbVis ? "translateY(0)" : "translateY(10px)", transition: "opacity 0.5s ease 340ms, transform 0.5s ease 340ms" }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "rgba(255,255,255,0.85)", marginBottom: 14 }}>Top Artists by iTunes Points</div>
                  {[
                    { name: "Drake", pts: 17, color: "#f5c518", w: 100 },
                    { name: "Michael Jackson", pts: 11, color: "#00e5a0", w: 65 },
                    { name: "Justin Bieber", pts: 4, color: "#818cf8", w: 24 },
                  ].map((row, i) => (
                    <div key={i} style={{ marginBottom: i < 2 ? 12 : 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.55)" }}>{row.name}</span>
                      </div>
                      <div style={{ position: "relative", height: 20, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ width: `${row.w}%`, height: "100%", background: row.color, borderRadius: 4, display: "flex", alignItems: "center", paddingLeft: 8, boxShadow: `0 0 10px ${row.color}40` }}>
                          {i === 0 && <span style={{ fontSize: "0.58rem", color: "rgba(0,0,0,0.7)", fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>Avg 6K</span>}
                        </div>
                        <span style={{ position: "absolute", right: row.w < 80 ? 8 : undefined, left: row.w >= 80 ? undefined : `${row.w + 2}%`, top: "50%", transform: "translateY(-50%)", fontSize: "0.62rem", color: "rgba(255,255,255,0.6)", fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>{row.pts}K</span>
                        {/* Avg marker */}
                        {i === 0 && <div style={{ position: "absolute", left: "35%", top: 0, bottom: 0, width: "1px", background: "rgba(251,146,60,0.6)", borderRight: "1px dashed rgba(251,146,60,0.6)" }} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LABEL ANALYSIS PREVIEW */}
      <section id="label-intelligence" ref={laRef} style={{ position: "relative", zIndex: 1, padding: isSm ? "0 1rem 80px" : "0 2rem 100px", scrollMarginTop: 128, opacity: laVis ? 1 : 0, transform: laVis ? "translateY(0)" : "translateY(28px)", transition: "opacity 0.72s cubic-bezier(0.23,1,0.32,1), transform 0.72s cubic-bezier(0.23,1,0.32,1)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          {/* Section header */}
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.7rem,3.5vw,2.7rem)", letterSpacing: "-0.025em", lineHeight: 1.1, margin: 0 }}>Label Intelligence — in the wild</h2>
            <p style={{ color: "rgba(255,255,255,0.38)", maxWidth: 480, margin: "12px auto 0", lineHeight: 1.8, fontSize: "0.875rem" }}>
              This is the actual Label Analysis module running on live data. Every number below reflects real Spotify &amp; iTunes ingestion from today.
            </p>
          </div>

          {/* Browser chrome wrapper */}
          <div style={{ background: "rgba(255,255,255,0.018)", border: "1px solid rgba(129,140,248,0.18)", borderRadius: 20, overflow: "hidden", boxShadow: "0 48px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(129,140,248,0.08), 0 0 60px rgba(129,140,248,0.06)" }}>

            {/* Window chrome */}
            <div style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "11px 18px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", gap: 6 }}>{["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}</div>
              <div style={{ background: "rgba(0,229,160,0.12)", color: "#00e5a0", border: "1px solid rgba(0,229,160,0.28)", borderRadius: 6, padding: "3px 10px", fontSize: "0.63rem", fontFamily: "'Space Mono',monospace" }}>● LIVE</div>
            </div>

            {/* App header */}
            <div style={{ padding: "18px 24px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.15)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 22 }}>🏷️</span>
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.45rem", fontWeight: 700 }}>Label Analysis</span>
              </div>
              <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", fontFamily: "'Space Mono',monospace" }}>
                Label-level market share, track concentration, and competitive performance across Spotify and iTunes.
              </div>
              {/* Tabs */}
              <div style={{ display: "flex", gap: 2, marginTop: 16 }}>
                {[["SPOTIFY GLOBAL", true], ["ITUNES WW", false], ["CROSS-PLATFORM", false]].map(([tab, active]) => (
                  <div key={tab} style={{ padding: "7px 18px", fontSize: "0.68rem", fontFamily: "'Space Mono',monospace", fontWeight: 700, letterSpacing: "0.1em", color: active ? "#fff" : "rgba(255,255,255,0.4)", borderBottom: active ? "2px solid #818cf8" : "2px solid transparent", cursor: "default", transition: "all 0.2s" }}>{tab}</div>
                ))}
              </div>
            </div>

            <div style={{ padding: "20px 24px 24px" }}>
              {/* KPI row */}
              <div style={{ display: "grid", gridTemplateColumns: fiveColGrid, gap: 10, marginBottom: 14 }}>
                {[
                  { l: "TOTAL STREAMS TRACKED", v: "7.80B", s: "All label groups · 11 days", c: "#818cf8" },
                  { l: "TOP LABEL (STREAMS)", v: "Universal Music", s: "2.20B · 28.2% share", c: "#f472b6" },
                  { l: "BEST RANK (SPOTIFY)", v: "Sony Music", s: "#1 · Michael Jackson", c: "#22d3ee" },
                  { l: "ITUNES #1 LABEL", v: "Universal Music", s: "The Chemical Brothers · 237K score", c: "#fb923c" },
                  { l: "FASTEST GROWING LABEL", v: "Other/Indie", s: "+173.2% Wk A→B streams", c: "#f5c518" },
                ].map((k, i) => (
                  <div key={i} style={{ background: `linear-gradient(135deg,${k.c}0e,${k.c}04)`, border: `1px solid ${k.c}30`, borderRadius: 12, padding: "14px 14px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${k.c},transparent)`, opacity: 0.7 }} />
                    <div style={{ fontSize: "0.56rem", color: k.c, marginBottom: 6, fontFamily: "'Space Mono',monospace", letterSpacing: "0.12em", opacity: 0.8 }}>{k.l}</div>
                    <div style={{ fontSize: i === 0 ? "1.55rem" : "0.95rem", fontWeight: 700, color: k.c, fontFamily: "'Playfair Display',serif", lineHeight: 1.15, textShadow: `0 0 14px ${k.c}50` }}>{k.v}</div>
                    <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.42)", marginTop: 5, lineHeight: 1.4 }}>{k.s}</div>
                  </div>
                ))}
              </div>

              {/* Label breakdown row */}
              <div style={{ display: "grid", gridTemplateColumns: fiveColGrid, gap: 10, marginBottom: 14 }}>
                {[
                  { label: "Other/Indie", v: "1.7B", tracks: "111 tracks · Best #1", delta: "+227.8% WkA→WkB", share: "22.1% share", up: true, c: "#818cf8" },
                  { label: "Independent", v: "1.4B", tracks: "229 tracks · Best #1", delta: "▼75.5% WkA→WkB", share: "18.4% share", up: false, c: "#22d3ee" },
                  { label: "Universal Music", v: "2.2B", tracks: "114 tracks · Best #1", delta: "+63.1% WkA→WkB", share: "28.2% share", up: true, c: "#f472b6" },
                  { label: "Sony Music", v: "1.5B", tracks: "57 tracks · Best #1", delta: "+57.4% WkA→WkB", share: "18.7% share", up: true, c: "#fb923c", highlight: true },
                  { label: "Warner Music", v: "979.1M", tracks: "40 tracks · Best #6", delta: "+44% WkA→WkB", share: "12.6% share", up: true, c: "#f5c518" },
                ].map((lb, i) => (
                  <div key={i} style={{ background: lb.highlight ? `rgba(251,146,60,0.06)` : "rgba(255,255,255,0.022)", border: `1px solid ${lb.highlight ? "#fb923c60" : "rgba(255,255,255,0.08)"}`, borderRadius: 12, padding: "14px 14px" }}>
                    <div style={{ fontSize: "0.6rem", color: lb.c, fontFamily: "'Space Mono',monospace", fontWeight: 700, marginBottom: 6, letterSpacing: "0.06em" }}>{lb.label}</div>
                    <div style={{ fontSize: "1.35rem", fontWeight: 700, fontFamily: "'Playfair Display',serif", color: "#fff", lineHeight: 1.1 }}>{lb.v}</div>
                    <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", marginTop: 4, marginBottom: 4 }}>{lb.tracks}</div>
                    <div style={{ fontSize: "0.6rem", color: lb.up ? "#00e5a0" : "#fb923c", fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>{lb.delta}</div>
                    <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.38)", marginTop: 2 }}>{lb.share}</div>
                  </div>
                ))}
              </div>

              {/* Bottom: chart + market share */}
              <div style={{ display: "grid", gridTemplateColumns: isMd ? "1fr" : "1.55fr 1fr", gap: 14 }}>
                {/* Line chart mockup */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.38)", fontFamily: "'Space Mono',monospace", letterSpacing: "0.1em" }}>SPOTIFY GLOBAL — DAILY STREAMS BY LABEL GROUP</div>
                    <div style={{ fontSize: "0.58rem", color: "#818cf8", fontFamily: "'Space Mono',monospace", letterSpacing: "0.1em" }}>LIVE WINDOW</div>
                  </div>
                  {/* Legend */}
                  <div style={{ display: "flex", gap: 14, marginBottom: 12, flexWrap: "wrap" }}>
                    {[["Other/Indie","#818cf8"],["Independent","#22d3ee"],["Universal Music","#f472b6"],["Sony Music","#fb923c"],["Warner Music","#f5c518"]].map(([name,c])=>(
                      <div key={name} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <div style={{ width: 14, height: 2, background: c, borderRadius: 2 }} />
                        <span style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.45)", fontFamily: "'Space Mono',monospace" }}>{name}</span>
                      </div>
                    ))}
                  </div>
                  {/* SVG line chart */}
                  <svg viewBox="0 0 620 130" style={{ width: "100%", height: 130 }} preserveAspectRatio="none">
                    {/* Grid lines */}
                    {[0,32,64,96,130].map(y => <line key={y} x1="0" y1={y} x2="620" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />)}
                    {/* Y labels */}
                    {[["700M",2],["500M",38],["300M",74],["100M",110]].map(([l,y])=>(
                      <text key={l} x="0" y={y} fontSize="8" fill="rgba(255,255,255,0.28)" fontFamily="monospace">{l}</text>
                    ))}
                    {/* Other/Indie — big spike early then settles */}
                    <polyline points="30,110 90,20 150,55 210,80 270,70 330,90 390,85 450,88 510,92 580,95" fill="none" stroke="#818cf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Independent */}
                    <polyline points="30,95 90,85 150,88 210,92 270,86 330,82 390,90 450,87 510,83 580,88" fill="none" stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Universal */}
                    <polyline points="30,75 90,72 150,68 210,65 270,70 330,76 390,72 450,68 510,70 580,75" fill="none" stroke="#f472b6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Sony */}
                    <polyline points="30,88 90,90 150,84 210,86 270,90 330,94 390,88 450,85 510,89 580,92" fill="none" stroke="#fb923c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Warner */}
                    <polyline points="30,100 90,98 150,102 210,100 270,104 330,102 390,100 450,103 510,101 580,104" fill="none" stroke="#f5c518" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {/* X axis dates */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                    {["May 11","May 13","May 15","May 17","May 19","May 21"].map(d => (
                      <span key={d} style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.28)", fontFamily: "'Space Mono',monospace" }}>{d}</span>
                    ))}
                  </div>
                </div>

                {/* Market share + WoW shift */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.38)", fontFamily: "'Space Mono',monospace", letterSpacing: "0.1em" }}>MARKET SHARE — STREAMS</div>
                    <div style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.28)", fontFamily: "'Space Mono',monospace" }}>TOTAL WINDOW</div>
                  </div>
                  {[
                    { name: "Other/Indie", pct: 22.1, tracks: "111 tracks", c: "#818cf8", w: 45 },
                    { name: "Independent", pct: 18.4, tracks: "229 tracks", c: "#22d3ee", w: 38 },
                    { name: "Universal Music", pct: 28.2, tracks: "114 tracks", c: "#f472b6", w: 58 },
                    { name: "Sony Music", pct: 18.7, tracks: "57 tracks", c: "#fb923c", w: 39 },
                    { name: "Warner Music", pct: 12.6, tracks: "40 tracks", c: "#f5c518", w: 26 },
                  ].map((row, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <div style={{ width: 80, fontSize: "0.62rem", color: row.c, fontFamily: "'Space Mono',monospace", fontWeight: 700, flexShrink: 0, whiteSpace: "nowrap" }}>{row.name}</div>
                      <div style={{ flex: 1, height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${row.w}%`, height: "100%", background: row.c, borderRadius: 3, boxShadow: `0 0 6px ${row.c}60` }} />
                      </div>
                      <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.7)", fontFamily: "'Space Mono',monospace", minWidth: 32, textAlign: "right" }}>{row.pct}%</div>
                      <div style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.28)", minWidth: 56, textAlign: "right" }}>{row.tracks}</div>
                    </div>
                  ))}
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", marginTop: 14, paddingTop: 12 }}>
                    <div style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.38)", fontFamily: "'Space Mono',monospace", letterSpacing: "0.1em", marginBottom: 10 }}>WEEK-OVER-WEEK SHIFT</div>
                    {[
                      { name: "Other/Indie", detail: "WkA: 402.1M → WkB: 1.3B", delta: "+227.8%", up: true },
                      { name: "Independent", detail: "WkA: 1.2B → WkB: 282.7M", delta: "▼75.5%", up: false },
                      { name: "Universal Music", detail: "WkA: 837.4M → WkB: 1.4B", delta: "+63.1%", up: true },
                    ].map((r, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.6rem", marginBottom: 7 }}>
                        <span style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'Space Mono',monospace" }}>{r.name}</span>
                        <span style={{ color: "rgba(255,255,255,0.3)" }}>{r.detail}</span>
                        <span style={{ color: r.up ? "#00e5a0" : "#fb923c", fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>{r.delta}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHART TRACKER PREVIEW */}
      <section id="chart-tracker" ref={ctRef} style={{ position: "relative", zIndex: 1, padding: isSm ? "0 1rem 80px" : "0 2rem 100px", scrollMarginTop: 128, opacity: ctVis ? 1 : 0, transform: ctVis ? "translateY(0)" : "translateY(28px)", transition: "opacity 0.72s cubic-bezier(0.23,1,0.32,1), transform 0.72s cubic-bezier(0.23,1,0.32,1)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          {/* Section header */}
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.7rem,3.5vw,2.7rem)", letterSpacing: "-0.025em", lineHeight: 1.1, margin: 0 }}>Chart Tracker — rank momentum visualised</h2>
            <p style={{ color: "rgba(255,255,255,0.38)", maxWidth: 480, margin: "12px auto 0", lineHeight: 1.8, fontSize: "0.875rem" }}>
              14-day rank trajectories for the top 10 artists — live line charts showing risers, fallers, and position history rebuilt on every data run.
            </p>
          </div>

          {/* Browser chrome wrapper */}
          <div style={{ background: "rgba(255,255,255,0.018)", border: "1px solid rgba(251,146,60,0.15)", borderRadius: 20, overflow: "hidden", boxShadow: "0 48px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(251,146,60,0.07), 0 0 60px rgba(251,146,60,0.05)" }}>

            {/* Window chrome */}
            <div style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "11px 18px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", gap: 6 }}>{["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}</div>
              <div style={{ background: "rgba(0,229,160,0.12)", color: "#00e5a0", border: "1px solid rgba(0,229,160,0.28)", borderRadius: 6, padding: "3px 10px", fontSize: "0.63rem", fontFamily: "'Space Mono',monospace" }}>● LIVE</div>
            </div>

            {/* App header */}
            <div style={{ padding: "18px 24px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.15)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 22 }}>📈</span>
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.45rem", fontWeight: 700 }}>Chart Tracker</span>
              </div>
              <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", fontFamily: "'Space Mono',monospace" }}>
                Historical rank trajectories for top artists, revealing trends and momentum.
              </div>
            </div>

            <div style={{ padding: "20px 24px 24px" }}>
              {/* Controls row */}
              <div style={{ display: "grid", gridTemplateColumns: twoColGrid, gap: 14, marginBottom: 18 }}>
                {[
                  { icon: "📅", label: "Time Range", val: "14 days" },
                  { icon: "👁", label: "View Mode", val: "Line Chart" },
                ].map((ctrl, i) => (
                  <div key={i}>
                    <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", fontFamily: "'Space Mono',monospace", marginBottom: 6 }}>
                      <span style={{ marginRight: 5 }}>{ctrl.icon}</span>{ctrl.label}
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "9px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.82)" }}>{ctrl.val}</span>
                      <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>▾</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* KPI cards */}
              <div style={{ display: "grid", gridTemplateColumns: fourColGrid, gap: 12, marginBottom: 18 }}>
                {[
                  { l: "CURRENT 1", v: "Drake", s: "Position 1 · best 1", c: "#818cf8", border: "rgba(129,140,248,0.4)" },
                  { l: "BIGGEST RISER", v: "+7", s: "Drake · 8 → 1", c: "#00e5a0", border: "rgba(0,229,160,0.3)" },
                  { l: "BIGGEST FALLER", v: "-2", s: "BTS · 3 → 5", c: "#fb923c", border: "rgba(251,146,60,0.4)" },
                  { l: "AVG POSITION", v: "5.5", s: "across 10 tracked artists · 14 days", c: "#f5c518", border: "rgba(245,197,24,0.35)" },
                ].map((k, i) => (
                  <div key={i} style={{ background: `linear-gradient(135deg,${k.c}0d,${k.c}04)`, border: `1px solid ${k.border}`, borderRadius: 12, padding: "16px 16px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${k.c},transparent)`, opacity: 0.8 }} />
                    <div style={{ fontSize: "0.58rem", color: k.c, marginBottom: 8, fontFamily: "'Space Mono',monospace", letterSpacing: "0.14em", opacity: 0.85 }}>{k.l}</div>
                    <div style={{ fontSize: "1.75rem", fontWeight: 700, color: k.c, fontFamily: "'Playfair Display',serif", lineHeight: 1, textShadow: `0 0 20px ${k.c}60` }}>{k.v}</div>
                    <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.4)", marginTop: 8, lineHeight: 1.45 }}>{k.s}</div>
                  </div>
                ))}
              </div>

              {/* Chart area */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 20px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: 16 }}>🎯</span>
                  <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>Top 10 Artist Position Trend (14 days)</span>
                </div>
                <svg viewBox="0 0 1060 240" style={{ width: "100%", height: 240 }} preserveAspectRatio="none">
                  {/* Horizontal grid lines for ranks 1-12 */}
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(r => {
                    const y = ((r - 1) / 11) * 210 + 8;
                    return (
                      <g key={r}>
                        <line x1="36" y1={y} x2="1060" y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                        <text x="28" y={y + 4} fontSize="9" fill="rgba(255,255,255,0.3)" fontFamily="monospace" textAnchor="end">{r}</text>
                      </g>
                    );
                  })}
                  {/* Y-axis label */}
                  <text x="10" y="120" fontSize="8" fill="rgba(255,255,255,0.25)" fontFamily="monospace" transform="rotate(-90,10,120)" textAnchor="middle">Chart position</text>

                  {/* Artist rank lines — 10 artists with varied trajectories */}
                  {/* Each point: x from 40 to 1040, y = rank mapped to 8..218 */}
                  {/* rank y = ((rank-1)/11)*210 + 8 */}
                  {[
                    { pts: [[40,8],[120,8],[200,8],[280,8],[360,8],[440,8],[520,8],[600,8],[680,8],[760,8],[840,8],[920,8],[1000,8],[1040,8]], c: "#00e5a0" },
                    { pts: [[40,27],[120,27],[200,27],[280,27],[360,27],[440,27],[520,46],[600,46],[680,46],[760,46],[840,27],[920,27],[1000,27],[1040,27]], c: "#a78bfa" },
                    { pts: [[40,46],[120,65],[200,65],[280,65],[360,46],[440,46],[520,65],[600,65],[680,65],[760,65],[840,65],[920,46],[1000,46],[1040,46]], c: "#f472b6" },
                    { pts: [[40,65],[120,65],[200,46],[280,46],[360,65],[440,65],[520,46],[600,85],[680,103],[760,85],[840,65],[920,65],[1000,65],[1040,65]], c: "#34d399" },
                    { pts: [[40,85],[120,85],[200,85],[280,85],[360,85],[440,85],[520,85],[600,103],[680,85],[760,85],[840,85],[920,85],[1000,85],[1040,85]], c: "#22d3ee" },
                    { pts: [[40,103],[120,122],[200,122],[280,103],[360,103],[440,122],[520,103],[600,103],[680,122],[760,103],[840,103],[920,103],[1000,103],[1040,103]], c: "#818cf8" },
                    { pts: [[40,122],[120,141],[200,141],[280,141],[360,122],[440,122],[520,141],[600,141],[680,122],[760,141],[840,141],[920,141],[1000,122],[1040,160]], c: "#fb923c" },
                    { pts: [[40,141],[120,160],[200,141],[280,160],[360,160],[440,141],[520,160],[600,122],[680,160],[760,160],[840,160],[920,160],[1000,160],[1040,141]], c: "#f5c518" },
                    { pts: [[40,160],[120,160],[200,179],[280,160],[360,179],[440,179],[520,179],[600,160],[680,179],[760,160],[840,160],[920,179],[1000,179],[1040,179]], c: "#c084fc" },
                    { pts: [[40,179],[120,198],[200,198],[280,179],[360,198],[440,198],[520,198],[600,198],[680,198],[760,198],[840,218],[920,218],[1000,218],[1040,218]], c: "#48dbfb" },
                  ].map((line, li) => (
                    <polyline key={li}
                      points={line.pts.map(([x,y]) => `${x},${y}`).join(" ")}
                      fill="none" stroke={line.c} strokeWidth="1.6"
                      strokeLinecap="round" strokeLinejoin="round"
                      strokeDasharray="4 2"
                    />
                  ))}
                </svg>
                {/* X-axis dates */}
                <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: 36, marginTop: 6 }}>
                  {["May 7","May 9","May 11","May 13","May 15","May 17","May 19","May 21"].map(d => (
                    <span key={d} style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.28)", fontFamily: "'Space Mono',monospace" }}>{d}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOVEMENT DASHBOARD PREVIEW */}
      <section id="movement-dashboard" ref={mvRef} style={{ position: "relative", zIndex: 1, padding: isSm ? "0 1rem 80px" : "0 2rem 100px", scrollMarginTop: 128, opacity: mvVis ? 1 : 0, transform: mvVis ? "translateY(0)" : "translateY(28px)", transition: "opacity 0.72s cubic-bezier(0.23,1,0.32,1), transform 0.72s cubic-bezier(0.23,1,0.32,1)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          {/* Section header */}
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.7rem,3.5vw,2.7rem)", letterSpacing: "-0.025em", lineHeight: 1.1, margin: 0 }}>Movement Dashboard — risers &amp; fallers live</h2>
            <p style={{ color: "rgba(255,255,255,0.38)", maxWidth: 500, margin: "12px auto 0", lineHeight: 1.8, fontSize: "0.875rem" }}>
              Daily rank + metric momentum across track and album charts. See who's climbing, who's dropping, and by exactly how much — updated on every pipeline run.
            </p>
          </div>

          {/* Browser chrome wrapper */}
          <div style={{ background: "rgba(255,255,255,0.018)", border: "1px solid rgba(52,211,153,0.15)", borderRadius: 20, overflow: "hidden", boxShadow: "0 48px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(52,211,153,0.07), 0 0 60px rgba(52,211,153,0.05)" }}>

            {/* Window chrome */}
            <div style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "11px 18px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", gap: 6 }}>{["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}</div>
              <div style={{ background: "rgba(0,229,160,0.12)", color: "#00e5a0", border: "1px solid rgba(0,229,160,0.28)", borderRadius: 6, padding: "3px 10px", fontSize: "0.63rem", fontFamily: "'Space Mono',monospace" }}>● LIVE</div>
            </div>

            {/* App header */}
            <div style={{ padding: "18px 24px 0", background: "rgba(0,0,0,0.15)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 22 }}>📊</span>
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.45rem", fontWeight: 700 }}>Movement Dashboard</span>
              </div>
              <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", fontFamily: "'Space Mono',monospace", marginBottom: 14 }}>
                Daily rank + metric momentum across track and album charts (risers, fallers, trajectories).
              </div>

              {/* Tabs */}
              <div style={{ display: "grid", gridTemplateColumns: twoColGrid, gap: 0, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                {[["📈 Track Movement", true], ["🎯 Album Movement", false]].map(([tab, active]) => (
                  <div key={tab} style={{ padding: "10px 20px", fontSize: "0.72rem", fontFamily: "'Space Mono',monospace", fontWeight: 700, letterSpacing: "0.06em", color: active ? "#fff" : "rgba(255,255,255,0.38)", background: active ? "rgba(52,211,153,0.08)" : "transparent", borderBottom: active ? "2px solid #34d399" : "2px solid transparent", cursor: "default", textAlign: "center" }}>{tab}</div>
                ))}
              </div>

              {/* Sub-label */}
              <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)", padding: "10px 0 4px" }}>Rank + metric momentum across Spotify and iTunes daily charts.</div>

              {/* Filters */}
              <div style={{ display: "grid", gridTemplateColumns: isSm ? "1fr" : isMd ? "1fr 1fr" : "1fr 1fr auto", gap: 14, alignItems: "end", paddingBottom: 16 }}>
                {[{ label: "Region", val: "Global / WW" }, { label: "Period", val: "Latest (5d)" }].map((f, i) => (
                  <div key={i}>
                    <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.35)", fontFamily: "'Space Mono',monospace", marginBottom: 5 }}>{f.label}</div>
                    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.78)" }}>{f.val}</span>
                      <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.28)" }}>▾</span>
                    </div>
                  </div>
                ))}
                <div>
                  <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.35)", fontFamily: "'Space Mono',monospace", marginBottom: 5 }}>Platform</div>
                  <div style={{ display: "flex", gap: 0 }}>
                    {[["Both", true], ["Spotify", false], ["iTunes", false]].map(([p, active]) => (
                      <div key={p} style={{ padding: "8px 14px", fontSize: "0.72rem", color: active ? "#fff" : "rgba(255,255,255,0.4)", fontWeight: active ? 700 : 400, background: active ? "rgba(52,211,153,0.12)" : "transparent", border: `1px solid ${active ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.08)"}`, cursor: "default", borderRadius: p === "Both" ? "8px 0 0 8px" : p === "iTunes" ? "0 8px 8px 0" : "0" }}>{p}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main content: Risers + Fallers side by side */}
            <div style={{ display: "grid", gridTemplateColumns: twoColGrid, gap: 0 }}>

              {/* TOP RISERS */}
              <div style={{ padding: "18px 20px 20px", borderRight: isMd ? "none" : "1px solid rgba(255,255,255,0.06)", overflowX: isSm ? "auto" : "visible" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 16 }}>📈</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>Top Risers — rank + metric composite</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#00e5a0", display: "inline-block", boxShadow: "0 0 6px #00e5a0" }} />
                  <span style={{ fontSize: "0.6rem", color: "#00e5a0", fontFamily: "'Space Mono',monospace", fontWeight: 700, letterSpacing: "0.1em" }}>RANK + STREAMS</span>
                </div>
                {/* Table header */}
                <div style={{ display: "grid", gridTemplateColumns: "2fr 60px 60px 70px 70px 62px", minWidth: isSm ? 620 : "auto", gap: 4, padding: "0 0 6px", borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: 4 }}>
                  {["TRACK · ARTIST","START","NOW","STREAMS","+STREAMS","Δ RANK"].map(h => (
                    <div key={h} style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.28)", fontFamily: "'Space Mono',monospace", letterSpacing: "0.06em" }}>{h}</div>
                  ))}
                </div>
                {[
                  { t: "On The Floor (w/ Pitbull)", a: "Jennifer Lopez", start: "#196", now: "#110", streams: "1.60M", plus: "+0.40M", delta: 86, rankW: 55, streamW: 80 },
                  { t: "E85", a: "Don Toliver", start: "#188", now: "#133", streams: "1.51M", plus: "+0.31M", delta: 55, rankW: 40, streamW: 65 },
                  { t: "The Night We Met", a: "Lord Huron", start: "#158", now: "#108", streams: "1.61M", plus: "+0.14M", delta: 50, rankW: 50, streamW: 72 },
                  { t: "NOBLE", a: "F3mill", start: "#179", now: "#139", streams: "1.49M", plus: "+0.26M", delta: 40, rankW: 36, streamW: 58 },
                  { t: "All The Stars (w/ SZA)", a: "Kendrick Lamar", start: "#149", now: "#114", streams: "1.59M", plus: "+0.07M", delta: 35, rankW: 32, streamW: 74 },
                ].map((row, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 60px 60px 70px 70px 62px", minWidth: isSm ? 620 : "auto", gap: 4, padding: "10px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.04)" : "none", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "rgba(255,255,255,0.88)", lineHeight: 1.3 }}>
                        <span style={{ color: "rgba(255,255,255,0.35)", marginRight: 8, fontSize: "0.65rem" }}>{i+1}</span>{row.t}
                      </div>
                      <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.35)", marginTop: 2, marginLeft: 16 }}>{row.a}</div>
                      {/* Mini progress bars */}
                      <div style={{ display: "flex", gap: 4, marginTop: 5, marginLeft: 16 }}>
                        <div style={{ width: `${row.rankW}px`, height: 3, background: "#00e5a0", borderRadius: 2, opacity: 0.8 }} />
                        <div style={{ width: `${row.streamW}px`, height: 3, background: "#818cf8", borderRadius: 2, opacity: 0.6 }} />
                      </div>
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", fontFamily: "'Space Mono',monospace" }}>{row.start}</div>
                    <div style={{ fontSize: "0.65rem", color: "#00e5a0", fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>{row.now}</div>
                    <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.6)", fontFamily: "'Space Mono',monospace" }}>{row.streams}</div>
                    <div style={{ fontSize: "0.65rem", color: "#34d399", fontFamily: "'Space Mono',monospace" }}>{row.plus}</div>
                    <div style={{ background: "rgba(0,229,160,0.15)", border: "1px solid rgba(0,229,160,0.3)", color: "#00e5a0", borderRadius: 6, padding: "3px 7px", fontSize: "0.62rem", fontFamily: "'Space Mono',monospace", fontWeight: 700, textAlign: "center" }}>▲{row.delta}</div>
                  </div>
                ))}
              </div>

              {/* TOP FALLERS */}
              <div style={{ padding: "18px 20px 20px", overflowX: isSm ? "auto" : "visible" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 16 }}>📉</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>Top Fallers — rank + metric composite</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fb923c", display: "inline-block", boxShadow: "0 0 6px #fb923c" }} />
                  <span style={{ fontSize: "0.6rem", color: "#fb923c", fontFamily: "'Space Mono',monospace", fontWeight: 700, letterSpacing: "0.1em" }}>RANK + STREAMS LOST</span>
                </div>
                {/* Table header */}
                <div style={{ display: "grid", gridTemplateColumns: "2fr 60px 60px 70px 70px 62px", minWidth: isSm ? 620 : "auto", gap: 4, padding: "0 0 6px", borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: 4 }}>
                  {["TRACK · ARTIST","START","NOW","STREAMS","LOST","Δ RANK"].map(h => (
                    <div key={h} style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.28)", fontFamily: "'Space Mono',monospace", letterSpacing: "0.06em" }}>{h}</div>
                  ))}
                </div>
                {[
                  { t: "Firm Friends", a: "Drake", start: "#23", now: "#191", streams: "1.30M", lost: "-3.06M", delta: 168, rankW: 80, streamW: 55 },
                  { t: "WNBA", a: "Drake", start: "#25", now: "#161", streams: "1.39M", lost: "-2.15M", delta: 136, rankW: 65, streamW: 60 },
                  { t: "Hoe Phase", a: "Drake", start: "#24", now: "#157", streams: "1.42M", lost: "-2.18M", delta: 133, rankW: 63, streamW: 62 },
                  { t: "Don't Worry", a: "Drake", start: "#21", now: "#135", streams: "1.50M", lost: "-3.11M", delta: 114, rankW: 55, streamW: 68 },
                  { t: "Fortworth (w/ PARTYNEXTDOOR)", a: "Drake", start: "#50", now: "#161", streams: "1.37M", lost: "-1.40M", delta: 111, rankW: 54, streamW: 52 },
                ].map((row, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 60px 60px 70px 70px 62px", minWidth: isSm ? 620 : "auto", gap: 4, padding: "10px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.04)" : "none", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "rgba(255,255,255,0.88)", lineHeight: 1.3 }}>
                        <span style={{ color: "rgba(255,255,255,0.35)", marginRight: 8, fontSize: "0.65rem" }}>{i+1}</span>{row.t}
                      </div>
                      <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.35)", marginTop: 2, marginLeft: 16 }}>{row.a}</div>
                      <div style={{ display: "flex", gap: 4, marginTop: 5, marginLeft: 16 }}>
                        <div style={{ width: `${row.rankW}px`, height: 3, background: "#fb923c", borderRadius: 2, opacity: 0.8 }} />
                        <div style={{ width: `${row.streamW}px`, height: 3, background: "#f472b6", borderRadius: 2, opacity: 0.6 }} />
                      </div>
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", fontFamily: "'Space Mono',monospace" }}>{row.start}</div>
                    <div style={{ fontSize: "0.65rem", color: "#fb923c", fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>{row.now}</div>
                    <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.6)", fontFamily: "'Space Mono',monospace" }}>{row.streams}</div>
                    <div style={{ fontSize: "0.65rem", color: "#fb923c", fontFamily: "'Space Mono',monospace" }}>{row.lost}</div>
                    <div style={{ background: "rgba(251,146,60,0.15)", border: "1px solid rgba(251,146,60,0.3)", color: "#fb923c", borderRadius: 6, padding: "3px 7px", fontSize: "0.62rem", fontFamily: "'Space Mono',monospace", fontWeight: 700, textAlign: "center" }}>▼{row.delta}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRACK ACQUISITION PREVIEW */}
      <section id="track-acquisition" ref={taRef} style={{ position: "relative", zIndex: 1, padding: isSm ? "0 1rem 80px" : "0 2rem 100px", scrollMarginTop: 128, opacity: taVis ? 1 : 0, transform: taVis ? "translateY(0)" : "translateY(28px)", transition: "opacity 0.72s cubic-bezier(0.23,1,0.32,1), transform 0.72s cubic-bezier(0.23,1,0.32,1)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          {/* Section header */}
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.7rem,3.5vw,2.7rem)", letterSpacing: "-0.025em", lineHeight: 1.1, margin: 0 }}>Track Acquisition — scored &amp; ranked live</h2>
            <p style={{ color: "rgba(255,255,255,0.38)", maxWidth: 500, margin: "12px auto 0", lineHeight: 1.8, fontSize: "0.875rem" }}>
              610 tracks scored 0–100 by rank, stream momentum, and cross-platform presence. Filter by signal, sort by any metric, and drill into any track's full trajectory.
            </p>
          </div>

          {/* Browser chrome wrapper */}
          <div style={{ background: "rgba(255,255,255,0.018)", border: "1px solid rgba(34,211,238,0.15)", borderRadius: 20, overflow: "hidden", boxShadow: "0 48px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(34,211,238,0.07), 0 0 60px rgba(34,211,238,0.05)" }}>

            {/* Window chrome */}
            <div style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "11px 18px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", gap: 6 }}>{["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}</div>
              <div style={{ background: "rgba(0,229,160,0.12)", color: "#00e5a0", border: "1px solid rgba(0,229,160,0.28)", borderRadius: 6, padding: "3px 10px", fontSize: "0.63rem", fontFamily: "'Space Mono',monospace" }}>● LIVE</div>
            </div>

            {/* App header */}
            <div style={{ padding: "16px 24px 12px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
                  <span style={{ fontSize: 20 }}>🎯</span>
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.4rem", fontWeight: 700 }}>Track Acquisition</span>
                </div>
              </div>
              {/* Top bar controls */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 14px", fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", fontFamily: "'Space Mono',monospace", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ opacity: 0.5 }}>🔍</span> Search track or artist...
                </div>
                {[["Global Stats","▾"],["All Platforms","▾"],["All Signals","▾"]].map(([l,a]) => (
                  <div key={l} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 8, padding: "6px 12px", fontSize: "0.68rem", color: "rgba(255,255,255,0.55)", fontFamily: "'Space Mono',monospace", display: "flex", gap: 5 }}>{l} <span style={{ opacity: 0.4 }}>{a}</span></div>
                ))}
                {/* Signal filter tabs */}
                <div style={{ display: "flex", gap: 0 }}>
                  {[["All",true],["Rising",false],["Stable",false],["Falling",false]].map(([t,a]) => (
                    <div key={t} style={{ padding: "6px 11px", fontSize: "0.65rem", fontFamily: "'Space Mono',monospace", fontWeight: a ? 700 : 400, color: a ? "#fff" : "rgba(255,255,255,0.38)", background: a ? "rgba(34,211,238,0.12)" : "transparent", border: `1px solid ${a ? "rgba(34,211,238,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: t === "All" ? "7px 0 0 7px" : t === "Falling" ? "0 7px 7px 0" : "0", cursor: "default" }}>{t}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* KPI row */}
            <div style={{ display: "grid", gridTemplateColumns: fiveColGrid, gap: 0, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {[
                { l: "STRONG BUY TRACKS", v: "0", s: "of tracked tracks", c: "#00e5a0", border: "rgba(0,229,160,0.25)" },
                { l: "TOP ACQUISITION SCORE", v: "68", s: "Michael Jackson — Billie Jean", c: "#f5c518", border: "rgba(245,197,24,0.25)" },
                { l: "FASTEST RISING TRACK", v: "Jennifer Lopez — On The Floor (w...", s: "+33.9% stream growth", c: "#22d3ee", border: "rgba(34,211,238,0.25)", small: true },
                { l: "CROSS-PLATFORM TRACKS", v: "57", s: "on both Spotify + iTunes WW", c: "#818cf8", border: "rgba(129,140,248,0.25)" },
                { l: "AVG MOMENTUM", v: "-2.7%", s: "across tracked tracks", c: "#fb923c", border: "rgba(251,146,60,0.25)" },
              ].map((k, i) => (
                <div key={i} style={{ padding: "16px 18px", borderRight: i < 4 ? "1px solid rgba(255,255,255,0.06)" : "none", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 2, background: k.border.replace("0.25","0.7") }} />
                  <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.35)", fontFamily: "'Space Mono',monospace", letterSpacing: "0.1em", marginBottom: 8 }}>{k.l}</div>
                  <div style={{ fontSize: k.small ? "0.8rem" : "1.65rem", fontWeight: 700, color: k.c, fontFamily: k.small ? "inherit" : "'Playfair Display',serif", lineHeight: 1.15, textShadow: `0 0 16px ${k.c}50` }}>{k.v}</div>
                  <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.35)", marginTop: 6, lineHeight: 1.4 }}>{k.s}</div>
                </div>
              ))}
            </div>

            {/* Main body: track list + detail panel */}
            <div style={{ display: "grid", gridTemplateColumns: isMd ? "1fr" : "1fr 340px" }}>

              {/* Track table */}
              <div style={{ borderRight: isMd ? "none" : "1px solid rgba(255,255,255,0.06)", overflowX: isSm ? "auto" : "visible" }}>
                {/* Sort bar */}
                <div style={{ padding: "10px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "3px 10px", fontSize: "0.62rem", color: "rgba(255,255,255,0.4)", fontFamily: "'Space Mono',monospace" }}>610 tracks</div>
                  <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.3)", fontFamily: "'Space Mono',monospace" }}>Sort by:</span>
                  {["Acq Score","Momentum","Rank","Streams","Growth %"].map((s, i) => (
                    <div key={s} style={{ padding: "3px 10px", fontSize: "0.62rem", fontFamily: "'Space Mono',monospace", color: i === 0 ? "#22d3ee" : "rgba(255,255,255,0.38)", border: `1px solid ${i === 0 ? "rgba(34,211,238,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: 6, background: i === 0 ? "rgba(34,211,238,0.1)" : "transparent", cursor: "default" }}>{s}</div>
                  ))}
                </div>
                {/* Table header */}
                <div style={{ display: "grid", gridTemplateColumns: "28px 1fr 70px 70px 80px 80px 90px", minWidth: isSm ? 700 : "auto", gap: 4, padding: "7px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["#","TRACK · ARTIST","RANK","STREAMS","MOMENTUM","SIGNAL","ACQ SCORE"].map(h => (
                    <div key={h} style={{ fontSize: "0.54rem", color: "rgba(255,255,255,0.28)", fontFamily: "'Space Mono',monospace", letterSpacing: "0.06em" }}>{h}</div>
                  ))}
                </div>
                {/* Track rows */}
                {[
                  { t: "Billie Jean", a: "Michael Jackson", cross: true, rank: "#1", streams: "5.8M", mom: "-0.7%", momUp: false, signal: "HOLD", score: 68, bars: [5,4,3,5], active: true },
                  { t: "SWIM", a: "BTS", cross: true, rank: "#3", streams: "5.1M", mom: "-2%", momUp: false, signal: "HOLD", score: 63, bars: [4,3,4,2] },
                  { t: "Beat It", a: "Michael Jackson", cross: true, rank: "#5", streams: "4.5M", mom: "-1.3%", momUp: false, signal: "HOLD", score: 62, bars: [5,4,4,3] },
                  { t: "Human Nature", a: "Michael Jackson", cross: true, rank: "#8", streams: "3.3M", mom: "-0.5%", momUp: false, signal: "HOLD", score: 56, bars: [3,4,4,3] },
                  { t: "Beauty And A Beat (w/ Nicki Minaj)", a: "Justin Bieber", cross: false, rank: "#1", streams: "5.7M", mom: "-2.2%", momUp: false, signal: "HOLD", score: 55, bars: [5,3,2,3] },
                  { t: "Janice STFU", a: "Don Toliver", cross: false, rank: "#12", streams: "2.9M", mom: "+1.1%", momUp: true, signal: "WATCH", score: 51, bars: [2,3,4,4] },
                ].map((row, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "28px 1fr 70px 70px 80px 80px 90px", minWidth: isSm ? 700 : "auto", gap: 4, padding: "10px 18px", borderBottom: "1px solid rgba(255,255,255,0.04)", alignItems: "center", background: row.active ? "rgba(34,211,238,0.04)" : "transparent", borderLeft: row.active ? "2px solid #22d3ee" : "2px solid transparent" }}>
                    <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.28)", fontFamily: "'Space Mono',monospace" }}>{i+1}</div>
                    <div>
                      <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.88)" }}>{row.t}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                        <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.38)" }}>{row.a}</span>
                        {row.cross && <span style={{ fontSize: "0.55rem", color: "#22d3ee", fontFamily: "'Space Mono',monospace" }}>+ cross</span>}
                      </div>
                      {/* Mini bar chart */}
                      <div style={{ display: "flex", gap: 2, marginTop: 5, alignItems: "flex-end", height: 14 }}>
                        {row.bars.map((h, bi) => <div key={bi} style={{ width: 5, height: `${h * 3}px`, background: bi === row.bars.length - 1 ? "#22d3ee" : "rgba(34,211,238,0.35)", borderRadius: "2px 2px 0 0" }} />)}
                        <div style={{ width: 12, height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 1, alignSelf: "center", marginLeft: 2 }} />
                        <div style={{ width: 12, height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 1, alignSelf: "center" }} />
                        <div style={{ width: 12, height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 1, alignSelf: "center" }} />
                      </div>
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.7)", fontFamily: "'Space Mono',monospace" }}>{row.rank}</div>
                    <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.7)", fontFamily: "'Space Mono',monospace" }}>{row.streams}</div>
                    <div style={{ fontSize: "0.7rem", color: row.momUp ? "#00e5a0" : "#fb923c", fontFamily: "'Space Mono',monospace" }}>{row.mom}</div>
                    <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)", borderRadius: 6, padding: "3px 8px", fontSize: "0.6rem", fontFamily: "'Space Mono',monospace", textAlign: "center" }}>{row.signal}</div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#22d3ee", fontFamily: "'Playfair Display',serif", textShadow: "0 0 12px rgba(34,211,238,0.5)" }}>{row.score}</div>
                  </div>
                ))}
              </div>

              {/* Detail panel */}
              <div style={{ padding: "18px 18px 18px", background: "rgba(0,0,0,0.12)" }}>
                {/* Track name & label */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: "1.15rem", fontWeight: 700, fontFamily: "'Playfair Display',serif", marginBottom: 2 }}>Billie Jean</div>
                  <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.38)", fontFamily: "'Space Mono',monospace", letterSpacing: "0.08em" }}>MICHAEL JACKSON · EPIC</div>
                </div>
                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                  {[["Epic","rgba(255,255,255,0.08)","rgba(255,255,255,0.15)","rgba(255,255,255,0.6)"],["CROSS","rgba(34,211,238,0.1)","rgba(34,211,238,0.3)","#22d3ee"],["+ Cross-platform","rgba(34,211,238,0.08)","rgba(34,211,238,0.25)","#22d3ee"],["HOLD","rgba(245,197,24,0.1)","rgba(245,197,24,0.3)","#f5c518"]].map(([label,bg,border,color]) => (
                    <span key={label} style={{ background: bg, border: `1px solid ${border}`, color, borderRadius: 6, padding: "3px 10px", fontSize: "0.62rem", fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>{label}</span>
                  ))}
                </div>
                {/* 2×2 metric grid */}
                <div style={{ display: "grid", gridTemplateColumns: twoColGrid, gap: 8, marginBottom: 14 }}>
                  {[
                    { l: "BEST RANK", v: "#1", s: "Spotify Global", c: "#22d3ee" },
                    { l: "LATEST STREAMS", v: "5.8M", s: "-2.7% growth", c: "#00e5a0" },
                    { l: "MOMENTUM", v: "-0.7%", s: "Window change", c: "#fb923c" },
                    { l: "WINDOW DAYS", v: "7", s: "days in chart", c: "#818cf8" },
                  ].map((m, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "12px 12px" }}>
                      <div style={{ fontSize: "0.54rem", color: "rgba(255,255,255,0.3)", fontFamily: "'Space Mono',monospace", letterSpacing: "0.1em", marginBottom: 6 }}>{m.l}</div>
                      <div style={{ fontSize: "1.25rem", fontWeight: 700, fontFamily: "'Playfair Display',serif", color: m.c, lineHeight: 1 }}>{m.v}</div>
                      <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.33)", marginTop: 5 }}>{m.s}</div>
                    </div>
                  ))}
                </div>
                {/* Acquisition Score box */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "14px 14px", marginBottom: 14 }}>
                  <div style={{ fontSize: "0.54rem", color: "rgba(255,255,255,0.3)", fontFamily: "'Space Mono',monospace", letterSpacing: "0.1em", marginBottom: 8 }}>ACQUISITION SCORE</div>
                  <div style={{ fontSize: "2rem", fontWeight: 700, fontFamily: "'Playfair Display',serif", color: "#f5c518", lineHeight: 1, textShadow: "0 0 18px rgba(245,197,24,0.5)", marginBottom: 8 }}>68</div>
                  {/* Score bar */}
                  <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 3, marginBottom: 8, overflow: "hidden" }}>
                    <div style={{ width: "68%", height: "100%", background: "linear-gradient(90deg,#22d3ee,#f5c518)", borderRadius: 3, boxShadow: "0 0 8px rgba(245,197,24,0.5)" }} />
                  </div>
                  <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.35)" }}>Ranked #1 of 610 tracked tracks</div>
                  <div style={{ marginTop: 10 }}>
                    <span style={{ background: "rgba(245,197,24,0.1)", border: "1px solid rgba(245,197,24,0.3)", color: "#f5c518", borderRadius: 6, padding: "4px 12px", fontSize: "0.62rem", fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>HOLD</span>
                  </div>
                </div>
                {/* Stream + rank trajectory label */}
                <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.3)", fontFamily: "'Space Mono',monospace", letterSpacing: "0.1em", marginBottom: 8 }}>STREAM + RANK TRAJECTORY</div>
                <div style={{ display: "flex", gap: 14, marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 14, height: 2, background: "#00e5a0", borderRadius: 1 }} /><span style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.38)" }}>Streams</span></div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 14, height: 2, background: "#818cf8", borderRadius: 1 }} /><span style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.38)" }}>Rank (right axis)</span></div>
                </div>
                {/* Trajectory mini chart */}
                <svg viewBox="0 0 290 60" style={{ width: "100%", height: 60 }} preserveAspectRatio="none">
                  <polyline points="0,15 40,18 80,12 120,20 160,14 200,22 240,10 290,16" fill="none" stroke="#00e5a0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="0,30 40,28 80,35 120,25 160,32 200,28 240,38 290,30" fill="none" stroke="#818cf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 2" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Atmosphere */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: "-60px", backgroundImage: `linear-gradient(rgba(0,229,160,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,160,0.04) 1px,transparent 1px)`, backgroundSize: "64px 64px", animation: "bgslow 60s linear infinite", maskImage: "radial-gradient(ellipse 100% 70% at 50% 0%,black 20%,transparent 100%)" }} />
        <div style={{ position: "absolute", top: "3%", left: "50%", transform: "translateX(-50%)", width: isSm ? 560 : isMd ? 820 : 1100, height: isSm ? 560 : isMd ? 820 : 1100, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,229,160,0.11) 0%,rgba(0,194,224,0.04) 40%,transparent 65%)", animation: "pulse 8s ease-in-out infinite" }} />
        <div style={{ position: "absolute", top: "55%", left: "2%", width: isSm ? 300 : isMd ? 460 : 600, height: isSm ? 300 : isMd ? 460 : 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,108,246,0.14) 0%,transparent 70%)", animation: "pulse 10s ease-in-out infinite 2s" }} />
        <div style={{ position: "absolute", top: "35%", right: "2%", width: isSm ? 220 : isMd ? 300 : 420, height: isSm ? 220 : isMd ? 300 : 420, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,194,224,0.12) 0%,transparent 70%)", animation: "pulse 7s ease-in-out infinite 1s" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "30%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(245,197,24,0.07) 0%,transparent 70%)" }} />
      </div>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "0 1.2rem", height: 64, background: scrolled ? "rgba(11,14,26,0.94)" : "rgba(11,14,26,0.6)", backdropFilter: "blur(32px) saturate(1.8)", borderBottom: "1px solid rgba(0,229,160,0.12)", transition: "all 0.4s ease", boxShadow: scrolled ? "0 8px 40px rgba(0,0,0,0.45)" : "0 2px 20px rgba(0,0,0,0.24)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#00e5a0,#00c2e0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, animation: "pulse 4s ease-in-out infinite" }}>🎵</div>
          <span className="nav-brand-title" style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.35rem" }}>Artist <span style={{ color: "#00e5a0" }}>360°</span> Intelligence</span>
        </div>
        <div className="top-nav-shell" style={{ flex: 1, minWidth: 0 }}>
          {NAV_ITEMS.map((item, idx) => (
            <button
              key={item.id}
              className={`top-nav-btn ${activeNav === item.id ? "active" : ""}`}
              style={{ animationDelay: `${idx * 35}ms` }}
              onClick={() => scrollToSection(item.id)}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        <button className="gbtn nav-demo-btn" style={{ background: "linear-gradient(135deg,#00e5a0,#00c2e0)", color: "#0b0e1a", border: "none", borderRadius: 8, padding: "8px 20px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", transition: "all 0.3s ease", whiteSpace: "nowrap", flexShrink: 0 }} onClick={() => window.open("https://artist360intelligence.streamlit.app", "_blank")}>Live Demo ↗</button>
      </nav>

      {/* HERO */}
      <section style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: isSm ? "150px 1rem 56px" : isMd ? "160px 1.5rem 58px" : "168px 2rem 60px", textAlign: "center", background: SECTION_BACKGROUNDS.hero, borderBottom: SECTION_DIVIDER }}>
        {/* Hero badge */}

        <h1 style={{ fontSize: "clamp(3rem,7.5vw,7rem)", fontFamily: "'Playfair Display',serif", fontWeight: 400, lineHeight: 1.02, letterSpacing: "-0.035em", maxWidth: 1200, opacity: heroVis ? 1 : 0, transform: heroVis ? "translateY(0)" : "translateY(28px)", transition: "all 0.9s cubic-bezier(0.23,1,0.32,1) 0.1s" }}>
          The Intelligence layer<em style={{ background: "linear-gradient(135deg,#00e5a0,#00c2e0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}> Latin music never had</em>
        </h1>

        <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.48)", maxWidth: 680, lineHeight: 1.85, marginTop: 24, marginBottom: 12, opacity: heroVis ? 1 : 0, transform: heroVis ? "translateY(0)" : "translateY(20px)", transition: "all 0.85s cubic-bezier(0.23,1,0.32,1) 0.22s" }}>
          Real-time artist rankings, label market share, debut signals, and AI-powered analysis — unified across Spotify and iTunes for 18 LATAM markets. Every number you see is <strong style={{ color: "rgba(255,255,255,0.82)", borderBottom: "1px solid rgba(0,229,160,0.4)" }}>live, sourced, and timestamped.</strong>
        </p>

        <div style={{ height: 30, overflow: "hidden", marginBottom: 36, opacity: heroVis ? 1 : 0, transition: "opacity 0.8s ease 0.35s" }}>
          <div key={ticker} style={{ animation: "ticker 0.45s ease forwards", fontFamily: "'Space Mono',monospace", fontSize: "0.78rem", color: "#7c6cf6", letterSpacing: "0.1em" }}>▸ {PLATFORMS[ticker]}</div>
        </div>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginBottom: 70, opacity: heroVis ? 1 : 0, transform: heroVis ? "translateY(0)" : "translateY(20px)", transition: "all 0.85s cubic-bezier(0.23,1,0.32,1) 0.4s" }}>
          <button className="gbtn" style={{ background: "linear-gradient(135deg,#00e5a0,#00c2e0)", color: "#0b0e1a", border: "none", borderRadius: 12, padding: "14px 36px", fontSize: "1rem", fontWeight: 700, cursor: "pointer", transition: "all 0.3s ease", boxShadow: "0 4px 24px rgba(0,229,160,0.3)" }} onClick={() => window.open("https://artist360intelligence.streamlit.app", "_blank")}>Get Demo →</button>
          <button className="obtn" onClick={() => document.getElementById("glossary")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "rgba(255,255,255,0.04)", color: "#fff", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 12, padding: "14px 28px", fontSize: "1rem", fontWeight: 500, cursor: "pointer", transition: "all 0.3s ease" }}>Explore the Glossary ↓</button>
        </div>

        {/* Dashboard mockup */}
        <div style={{ width: "100%", maxWidth: 1020, background: "rgba(255,255,255,0.022)", border: "1px solid rgba(0,229,160,0.12)", borderRadius: 24, overflow: "hidden", opacity: heroVis ? 1 : 0, transform: heroVis ? "translateY(0) perspective(1400px) rotateX(2.5deg)" : "translateY(60px) perspective(1400px) rotateX(10deg)", transition: "all 1.2s cubic-bezier(0.23,1,0.32,1) 0.55s", boxShadow: "0 60px 160px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,229,160,0.1), 0 0 80px rgba(0,229,160,0.05)" }}>
          <div style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "12px 20px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", gap: 6 }}>{["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}</div>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 6, padding: "4px 14px", fontSize: "0.7rem", color: "rgba(255,255,255,0.26)", fontFamily: "'Space Mono',monospace" }}>chromadata.com · Artist 360° Intelligence</div>
            <div style={{ background: "rgba(0,229,160,0.13)", color: "#00e5a0", border: "1px solid rgba(0,229,160,0.28)", borderRadius: 6, padding: "3px 10px", fontSize: "0.65rem", fontFamily: "'Space Mono',monospace" }}>● LIVE · Last run 00:34</div>
          </div>
          <div style={{ padding: "22px 24px 0", display: "grid", gridTemplateColumns: fourColGrid, gap: 14 }}>
            {[
              { l: "CURRENTLY 1", v: "Drake", s: "94.26M listeners", c: "#00e5a0" },
              { l: "STRONGEST DEBUT", v: "1 Entry", s: "Make Them Cry · 42.9M", c: "#f5c518" },
              { l: "TOP LABEL · STREAMS", v: "Universal", s: "1.74B · 27.4% share", c: "#7c6cf6" },
              { l: "STRONG BUY", v: "Michael J.", s: "102.1M · iTunes 1", c: "#ff9f43" },
            ].map((k, i) => (
              <div key={i} style={{ background: `linear-gradient(135deg,${k.c}10,${k.c}04)`, border: `1px solid ${k.c}38`, borderRadius: 14, padding: "18px 16px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${k.c},transparent)`, opacity: 0.7 }} />
                <div style={{ fontSize: "0.62rem", color: k.c, marginBottom: 7, fontFamily: "'Space Mono',monospace", letterSpacing: "0.14em", opacity: 0.75 }}>{k.l}</div>
                <div style={{ fontSize: "1.38rem", fontWeight: 700, color: k.c, fontFamily: "'Playfair Display',serif", textShadow: `0 0 18px ${k.c}60`, lineHeight: 1.1 }}>{k.v}</div>
                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.48)", marginTop: 6, fontWeight: 500 }}>{k.s}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: "16px 24px 24px", display: "grid", gridTemplateColumns: isMd ? "1fr" : "1.6fr 1fr", gap: 16 }}>
            <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 14, border: "1px solid rgba(0,229,160,0.1)", padding: "18px" }}>
              <div style={{ fontSize: "0.62rem", color: "rgba(0,229,160,0.55)", fontFamily: "'Space Mono',monospace", marginBottom: 14, letterSpacing: "0.1em" }}>SPOTIFY GLOBAL · DAILY STREAMS BY LABEL · MAY 11–19</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 100 }}>
                {[38,55,80,42,95,68,100,58,72,44,88,62,76,50,92,38,65,55,80].map((h,i) => (
                  <div key={i} style={{ flex: 1, borderRadius: "3px 3px 0 0", background: i===14 ? "linear-gradient(180deg,#00e5a0,#00c2e0)" : `rgba(0,229,160,${0.08+(h/100)*0.28})`, height: `${h}%`, boxShadow: i===14 ? "0 0 10px rgba(0,229,160,0.5)" : "none" }} />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                {["May 11","","","","May 15","","","","May 19"].map((d,i) => <span key={i} style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.28)" }}>{d}</span>)}
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", padding: "18px" }}>
              <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.38)", fontFamily: "'Space Mono',monospace", marginBottom: 14, letterSpacing: "0.1em" }}>TOP TRACKS · ACQ SCORE</div>
              {[
                { t: "Billie Jean", a: "Michael Jackson", s: 68, c: "#00e5a0", sig: "WATCH" },
                { t: "SWIM", a: "BTS", s: 62, c: "#f5c518", sig: "HOLD" },
                { t: "Africa", a: "TOTO", s: 55, c: "#7c6cf6", sig: "RISING" },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < 2 ? `1px solid ${r.c}12` : "none" }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: `${r.c}14`, border: `1px solid ${r.c}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", fontWeight: 700, color: r.c, fontFamily: "'Playfair Display',serif", flexShrink: 0 }}>{i+1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "rgba(255,255,255,0.9)" }}>{r.t}</div>
                    <div style={{ fontSize: "0.66rem", color: "rgba(255,255,255,0.38)", marginTop: 2 }}>{r.a}</div>
                  </div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 700, color: r.c, fontFamily: "'Playfair Display',serif", minWidth: 28, textAlign: "right", textShadow: `0 0 12px ${r.c}70` }}>{r.s}</div>
                  <div style={{ background: `${r.c}18`, border: `1px solid ${r.c}40`, color: r.c, borderRadius: 6, padding: "3px 8px", fontSize: "0.62rem", fontFamily: "'Space Mono',monospace", letterSpacing: "0.06em" }}>{r.sig}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GLOSSARY */}
      <section id="glossary" style={{ position: "relative", zIndex: 1, padding: isSm ? "75px 1rem 90px" : "90px 2rem 110px", scrollMarginTop: 128, background: SECTION_BACKGROUNDS.glossary, borderTop: SECTION_DIVIDER, borderBottom: SECTION_DIVIDER }}>
        {/* subtle radial glow behind the section */}
        <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 700, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(245,197,24,0.04) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,4vw,3rem)", marginTop: 14, letterSpacing: "-0.02em", lineHeight: 1.12 }}>What <em style={{ color: "#f5c518" }}>"real time"</em><br />actually means here</h2>
            <p style={{ color: "rgba(255,255,255,0.42)", maxWidth: 520, margin: "16px auto 0", lineHeight: 1.82, fontSize: "0.88rem" }}>
              Every badge, label, and signal in Artist 360 has a precise definition. Click any term to see the full explanation and a real example pulled directly from the live data.
            </p>
          </div>

          {/* Filter pills */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 38 }}>
            {["All","Time & Freshness","Scores","Signals","Platform"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  background: filter === f ? "#f5c518" : "rgba(255,255,255,0.04)",
                  color: filter === f ? "#0b0e1a" : "rgba(255,255,255,0.55)",
                  border: `1px solid ${filter === f ? "#f5c518" : "rgba(255,255,255,0.13)"}`,
                  borderRadius: 100,
                  padding: "7px 18px",
                  fontSize: "0.74rem",
                  fontWeight: filter === f ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.22s ease",
                  fontFamily: "'Space Mono',monospace",
                  letterSpacing: "0.06em",
                  boxShadow: filter === f ? "0 0 16px rgba(245,197,24,0.28)" : "none",
                }}
              >{f}</button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(FILTER_MAP[filter] || REALTIME_TERMS).map((term, i) => <GlossaryCard key={term.term} term={term} i={i} />)}
          </div>
        </div>
      </section>

      {/* AI SECTION */}
      <section id="ai-analyst" style={{ position: "relative", zIndex: 1, padding: isSm ? "70px 1rem 90px" : "80px 2rem 110px", scrollMarginTop: 128, overflow: "hidden", background: SECTION_BACKGROUNDS.ai, borderTop: SECTION_DIVIDER, borderBottom: SECTION_DIVIDER }}>
        {/* Background glow */}
        <div style={{ position: "absolute", top: "20%", right: "5%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,rgba(162,155,254,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "0%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,194,224,0.05) 0%,transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 980, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: twoColGrid, gap: isMd ? 28 : 64, alignItems: "center" }}>

            {/* Left: copy */}
            <div>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.68rem", color: "#a29bfe", letterSpacing: "0.22em", opacity: 0.9 }}>AI DATA ANALYST</span>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.9rem,3.5vw,2.9rem)", marginTop: 14, letterSpacing: "-0.02em", lineHeight: 1.12 }}>Ask questions.<br /><em style={{ color: "#a29bfe" }}>Get live answers.</em></h2>
              <p style={{ color: "rgba(255,255,255,0.46)", lineHeight: 1.82, marginTop: 18, fontSize: "0.875rem", maxWidth: 420 }}>
                Type any question in plain English — the AI translates it to a live PostgreSQL query against the full artist, track, and chart database. Results include prose, tables, and charts.
              </p>
              <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { icon: "💬", q: "Natural Language Input", d: "No SQL, no filters — type what you want to know." },
                  { icon: "⚡", q: "Live Database Query", d: "Runs against the real-time DB, not a cached snapshot." },
                  { icon: "📊", q: "Instant Visual Output", d: "Returns prose, sortable tables, or rendered charts in seconds." },
                ].map((p, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 14, alignItems: "flex-start",
                    background: "rgba(162,155,254,0.04)", border: "1px solid rgba(162,155,254,0.12)",
                    borderRadius: 12, padding: "13px 16px", transition: "border-color 0.2s",
                  }}>
                    <span style={{ fontSize: 17, flexShrink: 0, marginTop: 1 }}>{p.icon}</span>
                    <div>
                      <span style={{ fontSize: "0.855rem", fontWeight: 700, color: "rgba(255,255,255,0.88)" }}>{p.q}</span>
                      <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.38)", marginTop: 3, lineHeight: 1.55 }}>{p.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: chat window */}
            <div style={{
              background: "rgba(11,14,26,0.7)", backdropFilter: "blur(12px)",
              border: "1px solid rgba(162,155,254,0.18)", borderRadius: 22,
              overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(162,155,254,0.06), 0 0 40px rgba(162,155,254,0.06)",
            }}>
              {/* Window chrome */}
              <div style={{
                padding: "14px 18px",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                display: "flex", alignItems: "center", gap: 10,
                background: "rgba(255,255,255,0.02)",
              }}>
                <div style={{ display: "flex", gap: 6, marginRight: 4 }}>
                  {["#ff5f57","#ffbd2e","#28c840"].map(c => (
                    <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.7 }} />
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, justifyContent: "center" }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: "linear-gradient(135deg,#a29bfe,#7c6cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>🤖</div>
                  <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "rgba(255,255,255,0.85)" }}>AI Data Analyst</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00e5a0", animation: "ring 2s ease-out infinite" }} />
                  <span style={{ fontSize: "0.6rem", color: "#00e5a0", fontFamily: "'Space Mono',monospace", letterSpacing: "0.08em" }}>LIVE DB</span>
                </div>
              </div>

              {/* Messages */}
              <div style={{ padding: "20px 18px", display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  {
                    q: "Which label is growing fastest this week?",
                    a: "Other/Indie is up +270.4% WkA→WkB, moving from 288.8M to 1.1B streams and now holding 21.4% market share — the largest intra-period surge of any label group.",
                    stat: "+270.4%",
                  },
                  {
                    q: "Who debuted strongest in Week 20?",
                    a: "Drake's 'Make Them Cry' debuted at #1 with entry score 42.9M — the highest single-track debut of Week 20, and 76% as strong as the average incumbent track.",
                    stat: "#1 Debut",
                  },
                ].map((m, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {/* User bubble */}
                    <div style={{ alignSelf: "flex-end", maxWidth: "76%" }}>
                      <div style={{
                        background: "linear-gradient(135deg,rgba(162,155,254,0.22),rgba(124,108,246,0.16))",
                        border: "1px solid rgba(162,155,254,0.28)",
                        borderRadius: "14px 14px 3px 14px",
                        padding: "10px 14px",
                        fontSize: "0.8rem",
                        color: "rgba(255,255,255,0.88)",
                        lineHeight: 1.55,
                      }}>{m.q}</div>
                    </div>
                    {/* AI bubble */}
                    <div style={{ alignSelf: "flex-start", maxWidth: "90%", display: "flex", gap: 9, alignItems: "flex-start" }}>
                      <div style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(135deg,#a29bfe,#7c6cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0, marginTop: 2 }}>🤖</div>
                      <div>
                        <div style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.09)",
                          borderRadius: "3px 14px 14px 14px",
                          padding: "10px 14px",
                          fontSize: "0.775rem",
                          color: "rgba(255,255,255,0.62)",
                          lineHeight: 1.7,
                        }}>{m.a}</div>
                        <div style={{ marginTop: 6, display: "flex", gap: 6, alignItems: "center" }}>
                          <span style={{ background: "rgba(162,155,254,0.12)", border: "1px solid rgba(162,155,254,0.22)", color: "#a29bfe", borderRadius: 20, padding: "2px 9px", fontSize: "0.6rem", fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>{m.stat}</span>
                          <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.2)", fontFamily: "'Space Mono',monospace" }}>from live DB · Week 20</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Input bar */}
                <div style={{
                  marginTop: 4,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(162,155,254,0.18)",
                  borderRadius: 12, padding: "10px 12px",
                  display: "flex", gap: 10, alignItems: "center",
                }}>
                  <span style={{ flex: 1, fontSize: "0.75rem", color: "rgba(255,255,255,0.2)" }}>Ask about artists, listeners, rankings, trends…</span>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: "linear-gradient(135deg,#a29bfe,#7c6cf6)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, boxShadow: "0 0 10px rgba(162,155,254,0.3)", flexShrink: 0,
                  }}>↑</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.2)", padding: "36px 2.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#00e5a0,#00c2e0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🎵</div>
          <div>
            <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.55)", fontFamily: "'Space Mono',monospace" }}>info@chromadata.com</div>
            <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.28)", fontFamily: "'Space Mono',monospace" }}>© 2026 Chromadata</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy","Terms","Docs","Glossary"].map(l => (
            <a key={l} href="#" style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.42)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color="rgba(255,255,255,0.9)"} onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.42)"}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}