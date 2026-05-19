import { useEffect, useMemo, useState } from "react";

const NAV_ITEMS = [
  { id: "features", label: "Features" },
  { id: "platform", label: "Platform" },
  { id: "workflow", label: "Workflow" },
  { id: "pricing", label: "Access" },
];

const METRICS = [
  { value: "170+", label: "Artists Tracked" },
  { value: "18", label: "LATAM Markets" },
  { value: "6.34B", label: "Streams Monitored" },
  { value: "613", label: "Tracks Scored" },
];

const FEATURES = [
  {
    title: "Artist 360 Leaderboard",
    tag: "RANKING",
    desc: "Live ranking for 170+ artists across 18 LATAM markets using iTunes, Spotify, and cross-market strength.",
  },
  {
    title: "Chart Debuts Intelligence",
    tag: "MOMENTUM",
    desc: "Catch every new chart entry as it happens and identify breakout tracks before they peak.",
  },
  {
    title: "Label Market Dashboard",
    tag: "MARKET SHARE",
    desc: "Compare label groups with real-time share movement, week-over-week shifts, and stream concentration.",
  },
  {
    title: "Track Acquisition Score",
    tag: "SCORING",
    desc: "613 scored tracks across 7, 14, and 30-day windows with rising, stable, and falling trend signals.",
  },
  {
    title: "Artist Comparison",
    tag: "DEEP DIVE",
    desc: "Side-by-side artist analysis for audience, coverage, trajectory, and catalog strength in a single view.",
  },
  {
    title: "AI Data Analyst",
    tag: "ASK NATURALLY",
    desc: "Use natural language to query your dataset and instantly generate answers, charts, and decision-ready insights.",
  },
];

const WORKFLOW = [
  {
    step: "01",
    title: "Watch the market",
    desc: "Track every major movement in one timeline instead of juggling separate charts and tools.",
  },
  {
    step: "02",
    title: "Detect opportunities",
    desc: "Identify artists and tracks with strong acceleration signals before the competition reacts.",
  },
  {
    step: "03",
    title: "Act with confidence",
    desc: "Use benchmarked signals and AI-assisted analysis to support A&R, catalog, and campaign decisions.",
  },
];

const TREND_BARS = [78, 64, 82, 58, 88, 70, 92, 66, 76, 84, 61, 95];

function useActiveSection(sectionIds) {
  const [activeSection, setActiveSection] = useState(sectionIds[0]);

  useEffect(() => {
    const observers = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)
      .map((element) => {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setActiveSection(element.id);
            }
          },
          { threshold: 0.35, rootMargin: "-100px 0px -35% 0px" }
        );

        observer.observe(element);
        return observer;
      });

    return () => observers.forEach((observer) => observer.disconnect());
  }, [sectionIds]);

  return activeSection;
}

export default function App() {
  const sectionIds = useMemo(() => NAV_ITEMS.map((item) => item.id), []);
  const activeSection = useActiveSection(sectionIds);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="landing-shell">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,500;9..144,700&display=swap");

        :root {
          --bg: #f7f4ef;
          --ink: #151826;
          --muted: #5b6072;
          --card: #fffaf4;
          --line: #d7cfbf;
          --accent: #ff5a36;
          --accent-2: #ffb703;
          --accent-3: #1f9dff;
          --accent-soft: rgba(255, 90, 54, 0.14);
          --hero-shadow: 0 24px 80px rgba(52, 39, 24, 0.16);
          --radius-lg: 24px;
          --radius-md: 16px;
          --radius-sm: 12px;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          font-family: "Manrope", sans-serif;
          color: var(--ink);
          background:
            radial-gradient(circle at 12% 18%, #ffd1b5 0%, transparent 34%),
            radial-gradient(circle at 88% 0%, #b9dcff 0%, transparent 40%),
            radial-gradient(circle at 52% 86%, #ffe9a8 0%, transparent 34%),
            var(--bg);
        }

        .landing-shell {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        .aurora {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          filter: blur(28px);
          opacity: 0.72;
        }

        .aurora span {
          position: absolute;
          width: 34vw;
          height: 34vw;
          border-radius: 42% 58% 63% 37% / 40% 44% 56% 60%;
          animation: blobDrift 16s ease-in-out infinite alternate;
          mix-blend-mode: multiply;
        }

        .aurora span:nth-child(1) {
          left: -8vw;
          top: -12vh;
          background: rgba(31, 157, 255, 0.22);
        }

        .aurora span:nth-child(2) {
          right: -10vw;
          top: 8vh;
          width: 30vw;
          height: 30vw;
          animation-duration: 19s;
          background: rgba(255, 90, 54, 0.2);
        }

        .aurora span:nth-child(3) {
          left: 30vw;
          bottom: -16vh;
          width: 36vw;
          height: 36vw;
          animation-duration: 21s;
          background: rgba(255, 183, 3, 0.2);
        }

        .grain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.15;
          background-image: radial-gradient(rgba(0, 0, 0, 0.35) 0.5px, transparent 0.5px);
          background-size: 3px 3px;
          mix-blend-mode: soft-light;
          z-index: 0;
        }

        .container {
          width: min(1120px, calc(100% - 2.5rem));
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .nav-wrap {
          position: sticky;
          top: 0;
          z-index: 20;
          padding-top: 0.9rem;
        }

        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          border-radius: 999px;
          border: 1px solid rgba(27, 29, 31, 0.08);
          backdrop-filter: blur(8px);
          background: rgba(255, 253, 248, 0.9);
          box-shadow: ${isScrolled ? "0 10px 24px rgba(50, 35, 20, 0.1)" : "none"};
          transition: box-shadow 220ms ease;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          text-decoration: none;
          color: inherit;
          font-weight: 800;
          letter-spacing: 0.01em;
        }

        .brand-mark {
          width: 30px;
          height: 30px;
          border-radius: 9px;
          display: grid;
          place-items: center;
          color: #fff;
          background: linear-gradient(150deg, var(--accent), var(--accent-2));
          box-shadow: 0 8px 20px rgba(17, 106, 95, 0.35);
          font-size: 0.9rem;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .nav-links a {
          color: var(--muted);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 700;
          padding: 0.5rem 0.85rem;
          border-radius: 999px;
          transition: color 180ms ease, background-color 180ms ease;
        }

        .nav-links a:hover,
        .nav-links a.active {
          color: var(--ink);
          background: rgba(27, 29, 31, 0.08);
        }

        .hero {
          padding: 4.6rem 0 2.2rem;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 2rem;
          align-items: center;
        }

        .hero-copy {
          position: relative;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          border: 1px solid var(--line);
          border-radius: 999px;
          padding: 0.32rem 0.72rem;
          color: var(--accent);
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.11em;
          text-transform: uppercase;
          background: rgba(255, 255, 255, 0.65);
          animation: fadeInUp 500ms ease both;
        }

        h1 {
          margin: 0.95rem 0 1rem;
          font-family: "Fraunces", serif;
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.02em;
          font-size: clamp(2.2rem, 5vw, 4.3rem);
          animation: fadeInUp 650ms ease both;
        }

        .hero p {
          margin: 0;
          max-width: 60ch;
          color: var(--muted);
          line-height: 1.72;
          animation: fadeInUp 800ms ease both;
        }

        .hero-copy p strong {
          color: var(--ink);
        }

        .cta-row {
          margin-top: 1.8rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          animation: fadeInUp 950ms ease both;
        }

        .btn {
          border: 1px solid transparent;
          border-radius: 999px;
          padding: 0.78rem 1.24rem;
          font-size: 0.93rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease;
        }

        .btn:focus-visible {
          outline: 3px solid rgba(15, 122, 98, 0.28);
          outline-offset: 2px;
        }

        .btn-primary {
          color: #fff;
          background: linear-gradient(145deg, var(--accent), var(--accent-2));
          box-shadow: 0 12px 28px rgba(19, 109, 92, 0.34);
          position: relative;
          overflow: hidden;
        }

        .btn-primary::after {
          content: "";
          position: absolute;
          top: -140%;
          left: -40%;
          width: 40%;
          height: 320%;
          transform: rotate(22deg);
          background: rgba(255, 255, 255, 0.35);
          animation: sheen 3.4s ease-in-out infinite;
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.7);
          border-color: rgba(27, 29, 31, 0.14);
          color: var(--ink);
        }

        .btn:hover {
          transform: translateY(-2px);
        }

        .hero-card {
          border-radius: var(--radius-lg);
          border: 1px solid rgba(27, 29, 31, 0.1);
          background: linear-gradient(170deg, #fffefb 0%, #ffe9d0 100%);
          box-shadow: var(--hero-shadow);
          padding: 1.2rem;
          position: relative;
          min-height: 360px;
          overflow: hidden;
          animation: floatIn 1s ease both;
        }

        .hero-card::before {
          content: "";
          position: absolute;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          top: -120px;
          right: -80px;
          background: radial-gradient(circle, rgba(31, 157, 255, 0.22), transparent 70%);
        }

        .hero-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.65rem;
          margin-bottom: 0.9rem;
        }

        .hero-stat {
          background: var(--card);
          border: 1px solid rgba(27, 29, 31, 0.12);
          border-radius: var(--radius-sm);
          padding: 0.95rem;
          transition: transform 180ms ease;
        }

        .hero-stat:hover {
          transform: translateY(-3px);
        }

        .hero-stat-value {
          font-weight: 800;
          font-size: 1.25rem;
        }

        .hero-stat-label {
          color: var(--muted);
          font-size: 0.82rem;
          margin-top: 0.2rem;
        }

        .trend-panel {
          border: 1px solid rgba(27, 29, 31, 0.1);
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.7);
          padding: 0.8rem;
        }

        .trend-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.65rem;
          font-size: 0.78rem;
          color: var(--muted);
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .bars {
          height: 86px;
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          gap: 0.35rem;
          align-items: end;
        }

        .bar {
          border-radius: 999px;
          background: linear-gradient(180deg, var(--accent-3), var(--accent-2));
          animation: pulseBars 2.2s ease-in-out infinite;
          transform-origin: bottom;
        }

        .strip {
          margin: 1.4rem 0 3.4rem;
          border-radius: 16px;
          border: 1px solid rgba(27, 29, 31, 0.1);
          background: rgba(255, 255, 255, 0.64);
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          overflow: hidden;
          box-shadow: 0 10px 24px rgba(27, 29, 31, 0.06);
        }

        .strip-item {
          padding: 1rem;
          text-align: center;
        }

        .strip-item + .strip-item {
          border-left: 1px solid rgba(27, 29, 31, 0.08);
        }

        .strip-item strong {
          display: block;
          font-size: 1.1rem;
          margin-bottom: 0.15rem;
        }

        section {
          scroll-margin-top: 96px;
        }

        .section-head {
          margin-bottom: 1.2rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 1rem;
        }

        .section-head h2 {
          margin: 0;
          font-family: "Fraunces", serif;
          font-size: clamp(1.6rem, 3.2vw, 2.5rem);
          letter-spacing: -0.01em;
        }

        .section-head p {
          margin: 0;
          color: var(--muted);
          max-width: 44ch;
          line-height: 1.7;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0.9rem;
          margin: 1.2rem 0 4rem;
        }

        .feature-card {
          border: 1px solid rgba(27, 29, 31, 0.12);
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.66);
          padding: 1.05rem;
          min-height: 208px;
          transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
          position: relative;
          isolation: isolate;
          overflow: hidden;
        }

        .feature-card::after {
          content: "";
          position: absolute;
          inset: auto -20% -70% -20%;
          height: 120px;
          background: radial-gradient(circle, rgba(31, 157, 255, 0.22), transparent 65%);
          opacity: 0;
          transition: opacity 200ms ease;
          z-index: -1;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          border-color: rgba(15, 122, 98, 0.42);
          box-shadow: 0 14px 30px rgba(17, 49, 41, 0.11);
        }

        .feature-card:hover::after {
          opacity: 1;
        }

        .tag {
          display: inline-block;
          background: var(--accent-soft);
          color: var(--accent);
          border-radius: 999px;
          padding: 0.28rem 0.6rem;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .feature-card h3 {
          margin: 0.85rem 0 0.45rem;
          font-size: 1.05rem;
        }

        .feature-card p {
          margin: 0;
          color: var(--muted);
          line-height: 1.6;
          font-size: 0.92rem;
        }

        .platform {
          margin: 0.3rem 0 4rem;
          border: 1px solid rgba(27, 29, 31, 0.12);
          border-radius: var(--radius-lg);
          background: linear-gradient(160deg, rgba(255, 255, 255, 0.88), rgba(185, 220, 255, 0.36));
          box-shadow: 0 18px 44px rgba(40, 30, 16, 0.08);
          padding: 1.2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .platform-card {
          border-radius: 14px;
          border: 1px solid rgba(27, 29, 31, 0.1);
          background: var(--card);
          padding: 1rem;
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        .platform-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(17, 49, 41, 0.11);
        }

        .platform-card strong {
          font-size: 0.95rem;
          letter-spacing: 0.02em;
        }

        .platform-card p {
          margin: 0.4rem 0 0;
          color: var(--muted);
          line-height: 1.58;
          font-size: 0.9rem;
        }

        .workflow {
          margin-bottom: 4rem;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0.9rem;
        }

        .workflow-item {
          border: 1px solid rgba(27, 29, 31, 0.12);
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.73);
          padding: 1rem;
          position: relative;
          transition: transform 180ms ease, border-color 180ms ease;
        }

        .workflow-item:hover {
          transform: translateY(-4px);
          border-color: rgba(31, 157, 255, 0.34);
        }

        .workflow-step {
          font-family: "Fraunces", serif;
          color: var(--accent-2);
          font-size: 1.2rem;
          font-weight: 700;
        }

        .workflow-item h3 {
          margin: 0.55rem 0 0.5rem;
          font-size: 1.04rem;
        }

        .workflow-item p {
          margin: 0;
          color: var(--muted);
          line-height: 1.62;
        }

        .cta {
          margin-bottom: 3.2rem;
          border-radius: 26px;
          border: 1px solid rgba(27, 29, 31, 0.14);
          background:
            radial-gradient(circle at 20% 10%, rgba(255, 90, 54, 0.24), transparent 36%),
            radial-gradient(circle at 80% 0%, rgba(31, 157, 255, 0.2), transparent 34%),
            radial-gradient(circle at 50% 100%, rgba(255, 183, 3, 0.22), transparent 44%),
            var(--card);
          box-shadow: 0 24px 50px rgba(38, 26, 12, 0.12);
          padding: clamp(1.4rem, 3vw, 2.5rem);
          text-align: center;
          overflow: hidden;
        }

        .cta h2 {
          margin: 0;
          font-family: "Fraunces", serif;
          font-size: clamp(1.8rem, 4vw, 2.9rem);
          line-height: 1.1;
          letter-spacing: -0.015em;
        }

        .cta p {
          max-width: 58ch;
          margin: 0.85rem auto 1.4rem;
          color: var(--muted);
          line-height: 1.72;
        }

        footer {
          border-top: 1px solid rgba(27, 29, 31, 0.12);
          padding: 1.4rem 0 2rem;
          color: var(--muted);
          font-size: 0.87rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.6rem;
          flex-wrap: wrap;
        }

        .footer-links {
          display: flex;
          gap: 0.8rem;
        }

        .footer-links a {
          color: inherit;
          text-decoration: none;
          border-bottom: 1px solid transparent;
        }

        .footer-links a:hover {
          border-bottom-color: currentColor;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blobDrift {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          50% {
            transform: translate3d(2.4vw, 2.2vh, 0) rotate(11deg);
          }
          100% {
            transform: translate3d(-1.6vw, -2.4vh, 0) rotate(-8deg);
          }
        }

        @keyframes pulseBars {
          0%,
          100% {
            transform: scaleY(0.65);
            opacity: 0.75;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }

        @keyframes sheen {
          0% {
            left: -45%;
          }
          60% {
            left: 130%;
          }
          100% {
            left: 130%;
          }
        }

        @keyframes floatIn {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 1000px) {
          .hero {
            grid-template-columns: 1fr;
          }

          .feature-grid,
          .workflow {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .container {
            width: min(1120px, calc(100% - 1.2rem));
          }

          .nav {
            border-radius: 18px;
            align-items: flex-start;
            flex-direction: column;
            gap: 0.65rem;
          }

          .nav-links {
            width: 100%;
            overflow-x: auto;
            padding-bottom: 0.25rem;
          }

          .strip {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .strip-item:nth-child(3),
          .strip-item:nth-child(4) {
            border-top: 1px solid rgba(27, 29, 31, 0.08);
          }

          .strip-item:nth-child(3),
          .strip-item:nth-child(1) {
            border-left: 0;
          }

          .section-head {
            flex-direction: column;
            align-items: flex-start;
          }

          .feature-grid,
          .platform,
          .workflow {
            grid-template-columns: 1fr;
          }

          .hero-card {
            min-height: 0;
          }

          footer {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 1ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 1ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      <div className="aurora" aria-hidden>
        <span />
        <span />
        <span />
      </div>

      <div className="grain" aria-hidden />

      <div className="container nav-wrap">
        <nav className="nav" aria-label="Main navigation">
          <a href="#top" className="brand">
            <span className="brand-mark">A</span>
            Artist 360 Intelligence
          </a>

          <div className="nav-links">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={activeSection === item.id ? "active" : ""}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      </div>

      <main className="container" id="top">
        <section className="hero" aria-label="Hero">
          <div className="hero-copy">
            <span className="eyebrow">Artist-grade market intelligence</span>
            <h1>
              A sharper command center for artist growth, market movement, and acquisition decisions.
            </h1>
            <p>
              Artist 360 combines cross-platform rankings, trend detection, and AI-assisted analysis so
              labels, managers, and A&Rs can move from raw data to <strong>confident action in minutes</strong>.
            </p>
            <div className="cta-row">
              <button className="btn btn-primary">Request Early Access</button>
              <button className="btn btn-secondary">See Platform Tour</button>
            </div>
          </div>

          <aside className="hero-card" aria-label="Quick highlights">
            <div style={{ marginBottom: "0.8rem", fontWeight: 800, fontSize: "0.95rem" }}>
              Today at a glance
            </div>
            <div className="hero-grid">
              {METRICS.map((metric) => (
                <div key={metric.label} className="hero-stat">
                  <div className="hero-stat-value">{metric.value}</div>
                  <div className="hero-stat-label">{metric.label}</div>
                </div>
              ))}
            </div>
            <div className="trend-panel" aria-label="Momentum trend preview">
              <div className="trend-head">
                <span>Momentum signal</span>
                <span>Last 14 days</span>
              </div>
              <div className="bars">
                {TREND_BARS.map((height, index) => (
                  <span
                    key={`${height}-${index}`}
                    className="bar"
                    style={{ height: `${height}%`, animationDelay: `${index * 90}ms` }}
                  />
                ))}
              </div>
            </div>
          </aside>
        </section>

        <div className="strip" aria-label="Key numbers">
          {METRICS.map((metric) => (
            <div key={metric.label} className="strip-item">
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>

        <section id="features" aria-labelledby="features-heading">
          <div className="section-head">
            <h2 id="features-heading">A complete intelligence stack</h2>
            <p>
              From leaderboard movement to acquisition scoring, each module is built to help teams read
              momentum clearly and prioritize the right artist and catalog bets.
            </p>
          </div>

          <div className="feature-grid">
            {FEATURES.map((feature, index) => (
              <article key={feature.title} className="feature-card" style={{ animation: `fadeInUp 450ms ease ${index * 60}ms both` }}>
                <span className="tag">{feature.tag}</span>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="platform" aria-labelledby="platform-heading">
          <div className="section-head">
            <h2 id="platform-heading">Built for real decisions, not vanity charts</h2>
            <p>
              The platform balances depth and clarity, so users can quickly understand movement,
              validate assumptions, and share evidence-backed decisions across teams.
            </p>
          </div>

          <div className="platform">
            <div className="platform-card">
              <strong>Signal-first dashboard</strong>
              <p>
                Surface only what matters: highest acceleration, strongest debuts, market-share shifts,
                and risk signals in a clean command view.
              </p>
            </div>
            <div className="platform-card">
              <strong>Explainable scores</strong>
              <p>
                Every rank and recommendation links back to measurable factors, making leadership and
                partner conversations clear and defensible.
              </p>
            </div>
            <div className="platform-card">
              <strong>Natural language exploration</strong>
              <p>
                Ask direct questions in plain English, then drill into generated tables and charts without
                writing SQL or switching tools.
              </p>
            </div>
            <div className="platform-card">
              <strong>Cross-functional fit</strong>
              <p>
                Designed for A&R, management, and marketing teams who need shared visibility with role-
                relevant context and fast handoff.
              </p>
            </div>
          </div>
        </section>

        <section id="workflow" aria-labelledby="workflow-heading">
          <div className="section-head">
            <h2 id="workflow-heading">A faster operating rhythm</h2>
            <p>
              Replace fragmented weekly analysis with a continuous loop that highlights where to look,
              what to prioritize, and when to act.
            </p>
          </div>

          <div className="workflow">
            {WORKFLOW.map((item) => (
              <article key={item.step} className="workflow-item">
                <span className="workflow-step">{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="pricing" className="cta" aria-labelledby="cta-heading">
          <h2 id="cta-heading">Ready to run a smarter artist strategy?</h2>
          <p>
            Join labels, managers, and A&R teams using Artist 360 to evaluate momentum earlier, allocate
            budget with better confidence, and uncover high-upside opportunities across LATAM.
          </p>
          <div className="cta-row" style={{ justifyContent: "center" }}>
            <button className="btn btn-primary">Book a Demo</button>
            <button className="btn btn-secondary">Contact Sales</button>
          </div>
        </section>

        <footer>
          <div>Artist 360 Intelligence by Chromadata</div>
          <div className="footer-links" aria-label="Footer links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Docs</a>
          </div>
          <div>info@chromadata.com</div>
        </footer>
      </main>
    </div>
  );
}
