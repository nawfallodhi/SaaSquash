import { useState } from "react";
import logoimg from "../assets/logo.png"

const Logo = ({ onClick }) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 9,
        cursor: "pointer",
        userSelect: "none",
        transform: hover ? 0.8 : 1,
        transition: "transform 0.15s ease",
      }}
    >
      <img
        src={logoimg}
        alt="saasquatch logo"
        style={{
          width: 200,
          height: 200,
          objectFit: "contain",
        }}
      />
    </div>
  );
};

const ReferralLoopSVG = () => (
  <svg viewBox="0 0 480 180" width="100%" style={{ maxWidth: 480, display: "block", margin: "0 auto" }}>
    {/* Nodes */}
    {[
      { x: 60,  label: "Customer", sublabel: "loves the product" },
      { x: 180, label: "Shares link", sublabel: "to a friend" },
      { x: 300, label: "Friend joins", sublabel: "via referral" },
      { x: 420, label: "Reward fires", sublabel: "both get credit" },
    ].map((n, i) => (
      <g key={i}>
        <circle cx={n.x} cy={70} r={28} fill="#eaf5ee" stroke="#3a9e6e" strokeWidth="1.5"/>
        <circle cx={n.x} cy={70} r={9} fill="#1a6b45"/>
        <text x={n.x} y={114} textAnchor="middle" fontSize="12" fontWeight="600" fill="#0f2d1f">{n.label}</text>
        <text x={n.x} y={130} textAnchor="middle" fontSize="10" fill="#6b8c7a">{n.sublabel}</text>
        {i < 3 && (
          <g>
            <line x1={n.x + 32} y1={70} x2={n.x + 84} y2={70} stroke="#3a9e6e" strokeWidth="1.5" strokeDasharray="4 3"/>
            <polygon points={`${n.x+88},70 ${n.x+82},66 ${n.x+82},74`} fill="#3a9e6e"/>
          </g>
        )}
        {i === 3 && (
          <path d="M448,70 Q480,70 480,30 Q480,-10 240,-10 Q0,-10 0,30 Q0,70 32,70"
            fill="none" stroke="#3a9e6e" strokeWidth="1.5" strokeDasharray="4 3"
            markerEnd="url(#arr)"/>
        )}
      </g>
    ))}
    <defs>
      <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <polygon points="0,0 0,6 6,3" fill="#3a9e6e"/>
      </marker>
    </defs>
    <text x="240" y="165" textAnchor="middle" fontSize="10" fill="#6b8c7a">the loop repeats — automatically</text>
  </svg>
);

const SLIDES = [
  {
    tag: "The problem",
    heading: "Your best customers are your best marketers.",
    sub: "Word-of-mouth drives 20–50% of all purchasing decisions, yet most brands leave it completely unmanaged. SaaSquatch changes that.",
    stat: { value: "50%", label: "of purchases influenced by word-of-mouth" },
    cta: "See how →",
  },
  {
    tag: "The solution",
    heading: "Turn every happy customer into a referral engine.",
    sub: "SaaSquatch automates the entire referral lifecycle so your program runs itself.",
    visual: <ReferralLoopSVG />,
    cta: "What does that look like? →",
  },
  {
    tag: "The demo",
    heading: "Watch a referral network grow in real time.",
    sub: "Below is a demo simulation of what SaaSquatch tracks: every referral, every reward trigger, every new customer in real time.",
    preview: true,
    cta: "Launch the demo →",
  },
];

export default function Intro({ onComplete }) {
  const [slide, setSlide] = useState(0);
  const [exiting, setExiting] = useState(false);

  const advance = () => {
    if (slide < SLIDES.length - 1) {
      setExiting(true);
      setTimeout(() => { setSlide(s => s + 1); setExiting(false); }, 300);
    } else {
      setExiting(true);
      setTimeout(onComplete, 400);
    }
  };

  const s = SLIDES[slide];

  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <header style={{
        height: 80, borderBottom: "1px solid var(--border)", padding: "0 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "var(--header-bg)",
      }}>
        <Logo onClick={() => setSlide(0)} />
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        </div>
      </header>

      {/* Slide progress dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, paddingTop: "2.5rem" }}>
        {SLIDES.map((_, i) => (
          <div key={i} style={{
            width: i === slide ? 24 : 8, height: 8, borderRadius: 4,
            background: i <= slide ? "var(--green-dark)" : "var(--border)",
            transition: "all 0.3s ease",
          }} />
        ))}
      </div>

      {/* Slide content */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "2rem 2rem 4rem",
        opacity: exiting ? 0 : 1, transform: exiting ? "translateY(12px)" : "translateY(0)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}>
        <div style={{ maxWidth: 600, width: "100%", textAlign: "center" }}>

          {/* Tag */}
          <span style={{
            display: "inline-block", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
            textTransform: "uppercase", color: "var(--green-mid)",
            background: "var(--green-subtle)", border: "1px solid var(--green-mid)",
            borderRadius: 20, padding: "3px 14px", marginBottom: "1.25rem",
          }}>
            {s.tag}
          </span>

          {/* Heading */}
          <h1 style={{
            fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, lineHeight: 1.25,
            color: "var(--text)", marginBottom: "1rem",
          }}>
            {s.heading}
          </h1>

          {/* Sub */}
          <p style={{
            fontSize: 16, color: "var(--text-muted)", lineHeight: 1.7,
            marginBottom: "2rem", maxWidth: 480, margin: "0 auto 2rem",
          }}>
            {s.sub}
          </p>

          {/* Stat card (slide 0) */}
          {s.stat && (
            <div style={{
              display: "inline-flex", flexDirection: "column", alignItems: "center",
              background: "var(--bg)", border: "1px solid transparent",
              borderRadius: 12, padding: "1.25rem 2.5rem", marginBottom: "2.5rem",marginRight: "0.25rem",
            }}>
              <span style={{ fontSize: 48, fontWeight: 700, color: "var(--green-dark)", lineHeight: 1 }}>
                {s.stat.value}
              </span>
              <span style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>
                {s.stat.label}
              </span>
            </div>
          )}

          {/* Loop visual (slide 1) */}
          {s.visual && (
            <div style={{ marginBottom: "2.5rem", padding: "1.5rem", background: "var(--header-bg)", border: "1px solid var(--border)", borderRadius: 12 }}>
              {s.visual}
            </div>
          )}

          {/* Demo preview (slide 2) */}
          {s.preview && (
            <div style={{
              marginBottom: "2.5rem", padding: "1.25rem",
              background: "var(--header-bg)", border: "1px solid var(--border)",
              borderRadius: 12, textAlign: "left",
            }}>
              <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                {[
                  { label: "Total referrals", val: "—" },
                  { label: "Rewards paid", val: "—" },
                  { label: "Revenue added", val: "—" },
                ].map((m, i) => (
                  <div key={i} style={{
                    flex: 1, background: "var(--bg)", borderRadius: 8,
                    padding: "10px 12px", border: "1px solid var(--border)",
                  }}>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{m.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "var(--green-dark)", marginTop: 4 }}>{m.val}</div>
                  </div>
                ))}
              </div>
              <div style={{
                height: 80, background: "var(--bg)", borderRadius: 8,
                border: "1px solid var(--border)", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  referral network graph loads here →
                </span>
              </div>
            </div>
          )}

          {/* CTA button */}
          <button
            onClick={advance}
            style={{
              fontSize: 15, fontWeight: 500, padding: "12px 26px",
              borderRadius: 2, border: "1px solid var(--green-dark)", cursor: "pointer",
              background: "transparent", color: "var(--green-dark)",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={e => e.target.style.background = "var(--green-subtle)"}
            onMouseLeave={e => e.target.style.background = "transparent"}
          >
            {s.cta}
          </button>
      
        </div>
      </div>
    </div>
  );
}