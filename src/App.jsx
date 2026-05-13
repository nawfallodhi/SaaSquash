import { useState, useEffect, useRef, useCallback } from "react";
import StatsBar from "./components/StatsBar.jsx";
import NetworkGraph from "./components/NetworkGraph.jsx";
import ActivityFeed from "./components/ActivityFeed.jsx";
import Intro from "./components/Intro.jsx";
import logoimg from "./assets/logo.png"
import {
  NAMES, REWARDS, MILESTONES,
  spawnPosition, pickRandom,
  getTier, buildEventText,
} from "./data/simulation";

const GRAPH_W = 520;
const GRAPH_H = 480;
const TICK_MS = 2400;
const MAX_NODES = 28;
const RESET_PAUSE_MS = 2000;

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

let nodeIdCounter = 1;
let eventIdCounter = 0;
let usedNames = new Set();

function freshName() {
  const available = NAMES.filter(n => !usedNames.has(n));
  if (available.length === 0) { usedNames = new Set(); return pickRandom(NAMES); }
  const name = pickRandom(available);
  usedNames.add(name);
  return name;
}

function makeOriginNode() {
  const name = freshName();
  return { id: nodeIdCounter++, name, x: GRAPH_W / 2, y: GRAPH_H / 2, referralCount: 0, tier: "new", isOrigin: true };
}

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [nodes, setNodes] = useState(() => [makeOriginNode()]);
  const [edges, setEdges] = useState([]);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ referrals: 0, rewardsPaid: 0, revenue: 0 });
  const [running, setRunning] = useState(true);
  const [milestoneMsg, setMilestoneMsg] = useState(null);
  const [resetting, setResetting] = useState(false);
  const [wave, setWave] = useState(1);
  const [showSignupPopup, setShowSignupPopup] = useState(false);

  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;
  const statsRef = useRef(stats);
  statsRef.current = stats;
  const resettingRef = useRef(false);

  useEffect(() => {
    if (stats.referrals == 10 && !showSignupPopup) {
      setShowSignupPopup(true);
    }
  }, [stats.referrals, showSignupPopup]);

  const triggerMilestone = useCallback((count) => {
    const m = MILESTONES.find(m => m.at === count);
    if (m) {
      setMilestoneMsg(m.text);
      setTimeout(() => setMilestoneMsg(null), 3000);
    }
  }, []);

  const doReset = useCallback(() => {
    resettingRef.current = true;
    setResetting(true);
    setTimeout(() => {
      setNodes([makeOriginNode()]);
      setEdges([]);
      setWave(w => w + 1);
      setResetting(false);
      resettingRef.current = false;
    }, RESET_PAUSE_MS);
  }, []);

  const tick = useCallback(() => {
    if (resettingRef.current) return;
    const currentNodes = nodesRef.current;
    const currentStats = statsRef.current;

    if (currentNodes.length >= MAX_NODES) { doReset(); return; }

    const referrer = pickRandom(currentNodes);
    const reward = pickRandom(REWARDS);
    const newName = freshName();
    const pos = spawnPosition(referrer, currentNodes, GRAPH_W, GRAPH_H);
    const newId = nodeIdCounter++;

    const newNode = { id: newId, name: newName, x: pos.x, y: pos.y, referralCount: 0, tier: "new", isOrigin: false };
    const newEdge = { id: `${referrer.id}-${newId}`, from: referrer.id, to: newId, timestamp: Date.now() };
    const newEvent = {
      id: eventIdCounter++,
      text: buildEventText(referrer, newNode, reward),
      reward: reward.label,
      timestamp: Date.now(),
    };

    const newReferrals = currentStats.referrals + 1;
    const newRevenue = currentStats.revenue + Math.floor(Math.random() * 80 + 40);

    setNodes(prev => {
      const updated = prev.map(n =>
        n.id === referrer.id
          ? { ...n, referralCount: n.referralCount + 1, tier: getTier(n.referralCount + 1) }
          : n
      );
      return [...updated, newNode];
    });

    setEdges(prev => [...prev, newEdge]);
    setEvents(prev => [newEvent, ...prev].slice(0, 60));
    setStats({ referrals: newReferrals, rewardsPaid: currentStats.rewardsPaid + reward.value, revenue: newRevenue });
    triggerMilestone(newReferrals);
  }, [triggerMilestone, doReset]);

  useEffect(() => {
    if (showIntro || !running) return;

    const interval = setInterval(tick, TICK_MS);
    return () => clearInterval(interval);
  }, [running, tick, showIntro]);

  if (showIntro) return <Intro onComplete={() => setShowIntro(false)} />;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font)" }}>
      <header style={{
        borderBottom: "1px solid var(--border)", padding: "0 1.5rem", height: 80,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "var(--header-bg)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo onClick={() => {
            setShowIntro(true);
            setNodes([makeOriginNode()]);
            setEdges([]);
            setEvents([]);
            setStats({ referrals: 0, rewardsPaid: 0, revenue: 0 });
            setWave(1);
            }} />
          <span style={{ fontSize: 12, color: "var(--text-muted)", paddingLeft: 6, borderLeft: "1px solid var(--border)" }}>
            Live Referral Demo
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{fontSize: 11, padding: "4px 8px",borderRadius: 2,border: "1px solid var(--border)",color: "var(--text-muted)"}}>
            Sign up
          </span>
          <a
            href="https://www.saasquatch.com"
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: 12,
              padding: "6px 12px",
              borderRadius: 2, // square feel
              border: "1px solid var(--green-mid)",
              background: "transparent",
              color: "var(--green-dark)",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Get started ↗
          </a>
          <button
            onClick={() => setRunning(r => !r)}
            style={{
              fontSize: 12, padding: "5px 13px", borderRadius: 2,
              border: "1px solid var(--border)", background: "transparent",
              color: "var(--text)", cursor: "pointer",
            }}
          >
            {running ? "⏸ Pause" : "▶ Resume"}
          </button>
        </div>
      </header>

      <StatsBar stats={stats} wave={wave} />

      {milestoneMsg && (
        <div style={{
          textAlign: "center", padding: "8px 1rem",
          background: "var(--green-subtle)", borderBottom: "1px solid var(--green-mid)",
          fontSize: 13, color: "var(--green-dark)", fontWeight: 500,
        }}>
          {milestoneMsg}
        </div>
      )}

      {showSignupPopup && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}>
          <div style={{
            position: "relative",
            width: 460,
            padding: "28px",
            background: "var(--header-bg)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          }}>

            {/* Close button (Windows-style) */}
            <button
              onClick={() => setShowSignupPopup(false)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                width: 28,
                height: 28,
                borderRadius: 4,
                border: "1px solid var(--border)",
                background: "transparent",
                cursor: "pointer",
                fontSize: 16,
                lineHeight: "26px",
                color: "var(--text)",
              }}
            >
              ×
            </button>

            {/* Title */}
            <div style={{
              fontSize: 18,
              fontWeight: 650,
              color: "var(--text)",
              marginBottom: 8,
              letterSpacing: "-0.01em",
            }}>
              You’ve hit 10 referrals!
            </div>

            {/* Subtitle */}
            <div style={{
              fontSize: 13,
              lineHeight: 1.5,
              color: "var(--text-muted)",
              marginBottom: 18,
            }}>
              This is where growth starts compounding. Set up your referral system in minutes and turn your users into your best marketers.
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              <a
                href="https://www.saasquatch.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "10px 12px",
                  borderRadius: 2,
                  border: "1px solid var(--green-mid)",
                  color: "var(--green-dark)",
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: 500,
                  background: "transparent",
                }}
              >
                Get started
              </a>
            </div>

          </div>
        </div>
      )}

      <main style={{
        display: "grid", gridTemplateColumns: `${GRAPH_W}px 1fr`,
        height: "calc(100vh - 56px - 64px)",
        opacity: resetting ? 0 : 1, transition: "opacity 0.6s ease",
      }}>
        <NetworkGraph nodes={nodes} edges={edges} width={GRAPH_W} height={GRAPH_H} />
        <ActivityFeed events={events} />
      </main>
    </div>
  );
}