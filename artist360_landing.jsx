import { useState, useEffect, useRef } from "react";

const NAV_ITEMS = ["Features", "Platform", "Data", "Pricing"];

const FEATURES = [
  {
    icon: "🏆",
    tag: "LEADERBOARD",
    title: "Artist 360 Leaderboard",
    desc: "Track 170+ artists across 18 Latin American markets. Composite ranking powered by iTunes performance, Spotify reach, and global footprint — updated live.",
    stats: ["170 Artists", "18 Markets", "Live Data"],
    color: "#00e5a0",
  },
  {
    icon: "⚡",
    tag: "DEBUT INTELLIGENCE",
    title: "Chart Debuts Report",
    desc: "Capture every new chart entry the moment it happens. Identify the strongest debuts, multi-track debutants, and catalogue re-entries across Spotify Global and iTunes WW.",
    stats: ["101 New Entries/Wk", "Best Debut Rank", "Strength vs Field"],
    color: "#f5c518",
  },
  {
    icon: "🏷️",
    tag: "LABEL INTELLIGENCE",
    title: "Label Market Dashboard",
    desc: "Compare Universal, Sony, Warner, Independent, and Other/Indie across 6.34B+ streams tracked. Real-time market share, week-over-week shifts, and cross-platform performance.",
    stats: ["6.34B Streams", "5 Label Groups", "9-Day Window"],
    color: "#7c6cf6",
  },
  {
    icon: "📈",
    tag: "POSITION INTELLIGENCE",
    title: "Chart Tracker",
    desc: "Historical rank trajectories for top 10 artists with line charts, biggest risers & fallers, and 14-day momentum views. Know who's climbing before everyone else.",
    stats: ["14-Day Trends", "Risers & Fallers", "Avg Position"],
    color: "#ff6b6b",
  },
  {
    icon: "🎯",
    tag: "TRACK INTELLIGENCE",
    title: "Track Acquisition",
    desc: "613 tracks scored with acquisition signals across 7, 14, and 30-day windows. Identify Rising, Stable, or Falling tracks with cross-platform reach data.",
    stats: ["613 Tracks", "Acq Score 0–100", "Cross-platform"],
    color: "#00c2e0",
  },
  {
    icon: "💡",
    tag: "COMMERCIAL SIGNALS",
    title: "Acquisition Recommendation",
    desc: "Composite buy/hold signals for 300+ ranked artists. STRONG BUY ratings derived from Spotify monthly listeners, iTunes WW rankings, and multi-market charting strength.",
    stats: ["300 Artists", "Strong Buy Signals", "30-Day Window"],
    color: "#ff9f43",
  },
  {
    icon: "⚖️",
    tag: "COMPARE",
    title: "Artist Comparison",
    desc: "Side-by-side deep dives across 2–5 artists. Rank, monthly listeners, song count, and LATAM country coverage — visual comparison charts included.",
    stats: ["Up to 5 Artists", "Side-by-Side", "Visual Charts"],
    color: "#48dbfb",
  },
  {
    icon: "🤖",
    tag: "AI ANALYST",
    title: "AI Data Analyst",
    desc: "Ask anything in plain English. Powered by natural-language PostgreSQL querying — get instant answers, charts, and insights from the full dataset without writing a single line of code.",
    stats: ["Natural Language", "PostgreSQL Backed", "Charts + Tables"],
    color: "#a29bfe",
  },
];

const METRICS = [
  { value: "170+", label: "Artists Tracked" },
  { value: "18", label: "LATAM Markets" },
  { value: "6.34B", label: "Streams Monitored" },
  { value: "613", label: "Tracks Scored" },
];

const PLATFORMS = ["Spotify Global", "iTunes WW", "Cross-Platform Signals"];

function useIntersectionObserver(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState("0");
  const [ref, visible] = useIntersectionObserver(0.5);
  useEffect(() => {
    if (!visible) return;
    const numeric = parseFloat(target.replace(/[^0-9.]/g, ""));
    const isDecimal = target.includes(".");
    const hasSuffix = target.match(/[A-Za-z+]+$/);
    const end = numeric;
    let start = 0;
    const duration = 1600;
    const step = 16;
    const increment = (end / duration) * step;
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount((isDecimal ? start.toFixed(2) : Math.floor(start)) + (hasSuffix ? hasSuffix[0] : ""));
      }
    }, step);
    return () => clearInterval(timer);
  }, [visible, target]);
  return <span ref={ref}>{visible ? count : "0"}</span>;
}

function FeatureCard({ feature, index }) {
  const [ref, visible] = useIntersectionObserver(0.1);
  const [hovered, setHovered] = useState(false);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)`
          : "rgba(255,255,255,0.02)",
        border: `1px solid ${hovered ? feature.color + "55" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 20,
        padding: "2rem",
        transition: "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
        transform: visible
          ? hovered ? "translateY(-6px)" : "translateY(0)"
          : "translateY(32px)",
        opacity: visible ? 1 : 0,
        transitionDelay: visible ? `${index * 60}ms` : "0ms",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: hovered ? `linear-gradient(90deg, transparent, ${feature.color}, transparent)` : "transparent",
        transition: "all 0.4s ease",
      }} />
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 28 }}>{feature.icon}</span>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
          color: feature.color, fontFamily: "'Space Mono', monospace",
        }}>{feature.tag}</span>
      </div>
      <h3 style={{
        fontSize: "1.15rem", fontWeight: 700, color: "#ffffff",
        marginBottom: 12, fontFamily: "'DM Serif Display', serif", letterSpacing: "-0.01em",
      }}>{feature.title}</h3>
      <p style={{
        fontSize: "0.875rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7,
        marginBottom: 20,
      }}>{feature.desc}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {feature.stats.map((s, i) => (
          <span key={i} style={{
            background: `${feature.color}14`,
            border: `1px solid ${feature.color}30`,
            color: feature.color,
            borderRadius: 6, padding: "3px 10px",
            fontSize: "0.72rem", fontFamily: "'Space Mono', monospace",
          }}>{s}</span>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const [ticker, setTicker] = useState(0);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    const t = setInterval(() => setTicker(p => (p + 1) % PLATFORMS.length), 2800);
    return () => { window.removeEventListener("scroll", onScroll); clearInterval(t); };
  }, []);

  const [metricsRef, metricsVisible] = useIntersectionObserver(0.2);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080b14",
      color: "#ffffff",
      fontFamily: "'DM Sans', sans-serif",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080b14; }
        ::-webkit-scrollbar-thumb { background: #00e5a033; border-radius: 2px; }
        .glow-btn:hover { box-shadow: 0 0 32px rgba(0, 229, 160, 0.35) !important; transform: translateY(-2px) !important; }
        .outline-btn:hover { background: rgba(255,255,255,0.06) !important; }
        @keyframes float { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-18px) rotate(3deg); } }
        @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(2.2); opacity: 0; } }
        @keyframes ticker-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes grid-scroll { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
        @keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
        @keyframes orbit { 0% { transform: rotate(0deg) translateX(140px) rotate(0deg); } 100% { transform: rotate(360deg) translateX(140px) rotate(-360deg); } }
        @keyframes orbit2 { 0% { transform: rotate(180deg) translateX(200px) rotate(-180deg); } 100% { transform: rotate(540deg) translateX(200px) rotate(-540deg); } }
      `}</style>

      {/* Animated background grid */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,229,160,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,160,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          animation: "grid-scroll 40s linear infinite",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
        }} />
        <div style={{
          position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)",
          width: 800, height: 800, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,229,160,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "60%", left: "10%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,108,246,0.08) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", top: "40%", right: "5%",
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,194,224,0.07) 0%, transparent 70%)",
        }} />
      </div>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 2.5rem",
        background: scrolled ? "rgba(8,11,20,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.3s ease",
        height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "linear-gradient(135deg, #00e5a0, #00c2e0)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16,
          }}>🎵</div>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.05rem", letterSpacing: "-0.01em" }}>
            Artist <span style={{ color: "#00e5a0" }}>360</span> Intelligence
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {NAV_ITEMS.map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{
              color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", textDecoration: "none",
              fontWeight: 500, transition: "color 0.2s",
              letterSpacing: "0.02em",
            }}
              onMouseEnter={e => e.target.style.color = "#fff"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.6)"}
            >{item}</a>
          ))}
        </div>
        <button
          className="glow-btn"
          style={{
            background: "#00e5a0", color: "#080b14",
            border: "none", borderRadius: 8, padding: "8px 20px",
            fontSize: "0.85rem", fontWeight: 700, cursor: "pointer",
            transition: "all 0.3s ease", letterSpacing: "0.02em",
          }}
        >Request Access</button>
      </nav>

      {/* HERO */}
      <section style={{
        position: "relative", zIndex: 1,
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "100px 2rem 60px",
        textAlign: "center",
      }}>
        {/* Live badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(0,229,160,0.1)", border: "1px solid rgba(0,229,160,0.25)",
          borderRadius: 100, padding: "5px 14px", marginBottom: 32,
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? "translateY(0)" : "translateY(-16px)",
          transition: "all 0.7s cubic-bezier(0.23, 1, 0.32, 1)",
        }}>
          <div style={{
            width: 7, height: 7, borderRadius: "50%", background: "#00e5a0",
            position: "relative",
          }}>
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%", background: "#00e5a0",
              animation: "pulse-ring 2s ease-out infinite",
            }} />
          </div>
          <span style={{
            fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.15em",
            color: "#00e5a0", fontFamily: "'Space Mono', monospace",
          }}>LIVE · LAST RUN 2026-05-19</span>
        </div>

        <h1 style={{
          fontSize: "clamp(3rem, 7vw, 6.5rem)",
          fontFamily: "'DM Serif Display', serif",
          fontWeight: 400, lineHeight: 1.05,
          letterSpacing: "-0.03em",
          maxWidth: 900,
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? "translateY(0)" : "translateY(24px)",
          transition: "all 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.1s",
        }}>
          The intelligence layer<br />
          <em style={{ color: "#00e5a0", fontStyle: "italic" }}>Latin music</em> never had
        </h1>

        <p style={{
          fontSize: "1.1rem", color: "rgba(255,255,255,0.5)",
          maxWidth: 560, lineHeight: 1.75, marginTop: 24, marginBottom: 16,
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? "translateY(0)" : "translateY(24px)",
          transition: "all 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.2s",
        }}>
          Real-time artist rankings, label market share, debut signals, and AI-powered analysis — unified across Spotify and iTunes for 18 LATAM markets.
        </p>

        {/* Animated platform ticker */}
        <div style={{
          height: 28, overflow: "hidden", marginBottom: 40,
          opacity: heroVisible ? 1 : 0,
          transition: "opacity 0.8s ease 0.3s",
        }}>
          <div key={ticker} style={{
            animation: "ticker-in 0.5s ease forwards",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.8rem", color: "#7c6cf6", letterSpacing: "0.12em",
          }}>▸ {PLATFORMS[ticker]}</div>
        </div>

        <div style={{
          display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center",
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? "translateY(0)" : "translateY(24px)",
          transition: "all 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.35s",
        }}>
          <button className="glow-btn" style={{
            background: "#00e5a0", color: "#080b14",
            border: "none", borderRadius: 10, padding: "13px 32px",
            fontSize: "0.95rem", fontWeight: 700, cursor: "pointer",
            transition: "all 0.3s ease",
          }}>Get Early Access</button>
          <button className="outline-btn" style={{
            background: "transparent", color: "#fff",
            border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "13px 32px",
            fontSize: "0.95rem", fontWeight: 500, cursor: "pointer",
            transition: "all 0.3s ease",
          }}>View Demo →</button>
        </div>

        {/* Floating dashboard mockup */}
        <div style={{
          marginTop: 80, width: "100%", maxWidth: 1000,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20, overflow: "hidden",
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? "translateY(0) perspective(1000px) rotateX(4deg)" : "translateY(50px) perspective(1000px) rotateX(8deg)",
          transition: "all 1s cubic-bezier(0.23, 1, 0.32, 1) 0.5s",
          boxShadow: "0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,229,160,0.1)",
        }}>
          {/* Mock topbar */}
          <div style={{
            background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)",
            padding: "12px 20px", display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["#ff5f57", "#febc2e", "#28c840"].map(c => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
              ))}
            </div>
            <div style={{
              flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 6,
              padding: "4px 12px", fontSize: "0.72rem", color: "rgba(255,255,255,0.3)",
              fontFamily: "'Space Mono', monospace",
            }}>chromadata.com · Artist 360 Intelligence</div>
            <div style={{
              background: "rgba(0,229,160,0.15)", color: "#00e5a0",
              border: "1px solid rgba(0,229,160,0.3)", borderRadius: 6,
              padding: "3px 10px", fontSize: "0.68rem", fontFamily: "'Space Mono', monospace",
            }}>● LIVE</div>
          </div>
          {/* Mock content grid */}
          <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            {[
              { label: "Currently #1", val: "Drake", sub: "94.26M listeners", c: "#00e5a0" },
              { label: "Strongest Debut", val: "#1", sub: "Make Them Cry · 42.9M", c: "#f5c518" },
              { label: "Top Label", val: "Universal", sub: "27.4% stream share", c: "#7c6cf6" },
              { label: "Tracked Artists", val: "170+", sub: "18 LATAM markets", c: "#ff9f43" },
            ].map((item, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.03)", border: `1px solid ${item.c}22`,
                borderRadius: 12, padding: "16px",
              }}>
                <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", marginBottom: 6, fontFamily: "'Space Mono', monospace", letterSpacing: "0.1em" }}>{item.label.toUpperCase()}</div>
                <div style={{ fontSize: "1.4rem", fontWeight: 700, color: item.c, fontFamily: "'DM Serif Display', serif" }}>{item.val}</div>
                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{item.sub}</div>
              </div>
            ))}
          </div>
          {/* Mock chart area */}
          <div style={{ padding: "0 24px 24px" }}>
            <div style={{
              background: "rgba(255,255,255,0.02)", borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.05)", padding: "20px",
              display: "flex", alignItems: "flex-end", gap: 6, height: 120,
            }}>
              {[60, 45, 80, 55, 95, 70, 88, 62, 75, 85, 50, 92, 78, 66, 100, 72, 58, 84].map((h, i) => (
                <div key={i} style={{
                  flex: 1, borderRadius: "4px 4px 0 0",
                  background: i === 14
                    ? "#00e5a0"
                    : `rgba(0,229,160,${0.15 + (h / 100) * 0.2})`,
                  height: `${h}%`,
                  transition: "height 0.5s ease",
                }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section ref={metricsRef} style={{ position: "relative", zIndex: 1, padding: "60px 2rem" }}>
        <div style={{
          maxWidth: 1000, margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24,
        }}>
          {METRICS.map((m, i) => (
            <div key={i} style={{
              textAlign: "center",
              opacity: metricsVisible ? 1 : 0,
              transform: metricsVisible ? "translateY(0)" : "translateY(24px)",
              transition: `all 0.7s ease ${i * 100}ms`,
            }}>
              <div style={{
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                fontFamily: "'DM Serif Display', serif",
                color: "#00e5a0", fontWeight: 400,
              }}>
                <AnimatedCounter target={m.value} />
              </div>
              <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", marginTop: 6, letterSpacing: "0.05em" }}>{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" style={{ position: "relative", zIndex: 1, padding: "80px 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{
              fontFamily: "'Space Mono', monospace", fontSize: "0.72rem",
              color: "#7c6cf6", letterSpacing: "0.2em",
            }}>PLATFORM MODULES</span>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 4vw, 3.2rem)",
              marginTop: 12, letterSpacing: "-0.02em", lineHeight: 1.1,
            }}>Eight intelligence<br /><em style={{ color: "#00e5a0" }}>modules,</em> one platform</h2>
            <p style={{ color: "rgba(255,255,255,0.45)", maxWidth: 500, margin: "16px auto 0", lineHeight: 1.7 }}>
              Every view is powered by live Spotify Global and iTunes WW data, updated continuously across 18 Latin American markets.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {FEATURES.map((f, i) => <FeatureCard key={i} feature={f} index={i} />)}
          </div>
        </div>
      </section>

      {/* DATA SECTION */}
      <section id="data" style={{ position: "relative", zIndex: 1, padding: "80px 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center",
          }}>
            <div>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.72rem", color: "#00e5a0", letterSpacing: "0.2em" }}>DATA ARCHITECTURE</span>
              <h2 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                marginTop: 12, letterSpacing: "-0.02em", lineHeight: 1.15,
              }}>Real data.<br />Real signals.<br /><em>Real edge.</em></h2>
              <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.75, marginTop: 20, fontSize: "0.92rem" }}>
                Artist 360 ingests daily chart snapshots from Spotify Global and iTunes Worldwide, normalizing across 18 Latin American markets to produce composite acquisition scores, momentum signals, and label-level market share analytics.
              </p>
              <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { label: "Spotify Global", detail: "Monthly listeners · Daily snapshots · Track-level streams" },
                  { label: "iTunes WW", detail: "Weekly chart positions · Points · 18 LATAM countries" },
                  { label: "Cross-Platform", detail: "Combined acquisition scores · Momentum signals · Signal overlays" },
                ].map((d, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 16px",
                    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 12,
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00e5a0", marginTop: 5, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: 3 }}>{d.label}</div>
                      <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>{d.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Orbital illustration */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
              <div style={{ position: "relative", width: 360, height: 360 }}>
                {/* Rings */}
                {[140, 200].map((r, i) => (
                  <div key={i} style={{
                    position: "absolute",
                    top: "50%", left: "50%",
                    width: r * 2, height: r * 2,
                    marginLeft: -r, marginTop: -r,
                    borderRadius: "50%",
                    border: `1px dashed rgba(0,229,160,${0.12 - i * 0.04})`,
                  }} />
                ))}
                {/* Center node */}
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 72, height: 72, borderRadius: "50%",
                  background: "linear-gradient(135deg, #00e5a0, #00c2e0)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, boxShadow: "0 0 40px rgba(0,229,160,0.4)",
                }}>🎵</div>
                {/* Orbit 1: Spotify */}
                <div style={{ position: "absolute", top: "50%", left: "50%", width: 0, height: 0, animation: "orbit 8s linear infinite" }}>
                  <div style={{
                    position: "absolute", top: -20, left: -20,
                    width: 40, height: 40, borderRadius: "50%",
                    background: "#1DB954", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 18,
                    boxShadow: "0 0 20px rgba(29,185,84,0.5)",
                  }}>🎧</div>
                </div>
                {/* Orbit 2: iTunes */}
                <div style={{ position: "absolute", top: "50%", left: "50%", width: 0, height: 0, animation: "orbit2 12s linear infinite" }}>
                  <div style={{
                    position: "absolute", top: -20, left: -20,
                    width: 40, height: 40, borderRadius: "50%",
                    background: "#fc3c44", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 18,
                    boxShadow: "0 0 20px rgba(252,60,68,0.5)",
                  }}>🎵</div>
                </div>
                {/* Label tags */}
                {[
                  { label: "6.34B Streams", x: "78%", y: "10%", c: "#00e5a0" },
                  { label: "170 Artists", x: "75%", y: "80%", c: "#7c6cf6" },
                  { label: "18 Markets", x: "2%", y: "50%", c: "#f5c518" },
                ].map((t, i) => (
                  <div key={i} style={{
                    position: "absolute", left: t.x, top: t.y,
                    background: `${t.c}14`, border: `1px solid ${t.c}30`,
                    borderRadius: 6, padding: "4px 10px",
                    fontSize: "0.7rem", color: t.c, fontFamily: "'Space Mono', monospace",
                    whiteSpace: "nowrap",
                  }}>{t.label}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI SECTION */}
      <section id="platform" style={{ position: "relative", zIndex: 1, padding: "80px 2rem" }}>
        <div style={{
          maxWidth: 900, margin: "0 auto", textAlign: "center",
        }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.72rem", color: "#a29bfe", letterSpacing: "0.2em" }}>AI DATA ANALYST</span>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            marginTop: 12, letterSpacing: "-0.02em", lineHeight: 1.15,
          }}>Ask your data anything.<br /><em style={{ color: "#a29bfe" }}>Get answers instantly.</em></h2>
          <p style={{ color: "rgba(255,255,255,0.45)", maxWidth: 560, margin: "16px auto 32px", lineHeight: 1.7 }}>
            Powered by natural-language PostgreSQL querying. No dashboards to navigate, no SQL to write — just ask.
          </p>
          {/* Mock chat UI */}
          <div style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20, overflow: "hidden", textAlign: "left",
          }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>🤖</span>
              <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>AI Data Analyst</span>
              <span style={{ marginLeft: "auto", fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", fontFamily: "'Space Mono', monospace" }}>Powered by Claude</span>
            </div>
            <div style={{ padding: "28px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { q: "Who are the top 10 artists by total Spotify streams right now?", a: "Drake leads with 94.26M monthly listeners at rank #1, followed by Michael Jackson (102.13M, #2) and Justin Bieber (143.86M, #3). Stream velocity shows Drake gaining +2.1% week-over-week..." },
                { q: "Which label is growing fastest this week?", a: "Other/Indie is the fastest growing label group, up +270.4% week-over-week (WkA→WkB). They moved from 288.8M to 1.1B streams, now holding 21.4% market share..." },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{
                    background: "rgba(162,155,254,0.1)", border: "1px solid rgba(162,155,254,0.2)",
                    borderRadius: "12px 12px 4px 12px", padding: "12px 16px",
                    fontSize: "0.85rem", color: "rgba(255,255,255,0.8)",
                    maxWidth: "75%", marginLeft: "auto",
                  }}>{item.q}</div>
                  <div style={{
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "4px 12px 12px 12px", padding: "12px 16px",
                    fontSize: "0.82rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.65,
                    maxWidth: "85%", marginTop: 8,
                  }}>{item.a}</div>
                </div>
              ))}
              <div style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10, padding: "12px 16px", display: "flex", gap: 10, alignItems: "center",
              }}>
                <span style={{ flex: 1, fontSize: "0.82rem", color: "rgba(255,255,255,0.25)" }}>Ask about artists, listeners, rankings, or trends…</span>
                <div style={{
                  width: 28, height: 28, borderRadius: 6,
                  background: "#a29bfe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12,
                }}>↑</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" style={{ position: "relative", zIndex: 1, padding: "100px 2rem 120px" }}>
        <div style={{
          maxWidth: 700, margin: "0 auto", textAlign: "center",
          background: "linear-gradient(135deg, rgba(0,229,160,0.07) 0%, rgba(124,108,246,0.07) 100%)",
          border: "1px solid rgba(0,229,160,0.15)",
          borderRadius: 28, padding: "64px 48px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -80, right: -80,
            width: 300, height: 300, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,229,160,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.72rem", color: "#00e5a0", letterSpacing: "0.2em" }}>GET STARTED</span>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2rem, 4vw, 2.8rem)",
            marginTop: 12, letterSpacing: "-0.02em", lineHeight: 1.15,
          }}>Ready to know your<br /><em style={{ color: "#00e5a0" }}>market better?</em></h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginTop: 16, lineHeight: 1.7, marginBottom: 36 }}>
            Join music labels, managers, and A&Rs using Artist 360 Intelligence to make faster, smarter decisions across Latin America.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="glow-btn" style={{
              background: "#00e5a0", color: "#080b14",
              border: "none", borderRadius: 10, padding: "14px 36px",
              fontSize: "1rem", fontWeight: 700, cursor: "pointer",
              transition: "all 0.3s ease",
            }}>Request Early Access</button>
            <button className="outline-btn" style={{
              background: "transparent", color: "#fff",
              border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, padding: "14px 28px",
              fontSize: "1rem", fontWeight: 500, cursor: "pointer",
              transition: "all 0.3s ease",
            }}>Contact Sales</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        position: "relative", zIndex: 1,
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "32px 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: "linear-gradient(135deg, #00e5a0, #00c2e0)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
          }}>🎵</div>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "0.9rem" }}>Artist 360 Intelligence</span>
        </div>
        <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)" }}>
          info@chromadata.com · © 2026 Chromadata. All rights reserved.
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy", "Terms", "Docs"].map(l => (
            <a key={l} href="#" style={{
              fontSize: "0.78rem", color: "rgba(255,255,255,0.35)",
              textDecoration: "none", transition: "color 0.2s",
            }}
              onMouseEnter={e => e.target.style.color = "#fff"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.35)"}
            >{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
