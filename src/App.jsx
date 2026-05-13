import { useState, useEffect, useRef, useCallback } from "react";
import StatsBar from "./components/StatsBar";
import NetworkGraph from "./components/NetworkGraph";
import ActivityFeed from "./components/ActivityFeed";
import {
  NAMES, REWARDS, EVENT_TYPES, MILESTONES,
  spawnPosition, pickRandom, pickRandomExcluding,
  getTier, buildEventText, INITIAL_NODES,
} from "./data/simulation";

const GRAPH_W = 520;
const GRAPH_H = 480;
const TICK_MS = 2400;

let nodeIdCounter = 1;
let eventIdCounter = 0;
const usedNames = new Set(["Maya"]);

function freshName() {
  const available = NAMES.filter(n => !usedNames.has(n));
  if (available.length === 0) return `User${nodeIdCounter}`;
  const name = pickRandom(available);
  usedNames.add(name);
  return name;
}

export default function App() {
  const [nodes, setNodes] = useState(() =>
    INITIAL_NODES.map(n => ({ ...n, x: n.x * GRAPH_W, y: n.y * GRAPH_H }))
  );
  const [edges, setEdges] = useState([]);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ referrals: 0, rewardsPaid: 0, revenue: 0 });
  const [running, setRunning] = useState(true);
  const [milestoneMsg, setMilestoneMsg] = useState(null);

  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;
  const statsRef = useRef(stats);
  statsRef.current = stats;

  const triggerMilestone = useCallback((count) => {
    const m = MILESTONES.find(m => m.at === count);
    if (m) {
      setMilestoneMsg(m.text);
      setTimeout(() => setMilestoneMsg(null), 3000);
    }
  }, []);

  const tick = useCallback(() => {
    const currentNodes = nodesRef.current;
    const currentStats = statsRef.current;

    // pick a referrer — bias toward nodes with fewer referrals so graph spreads
    const referrer = pickRandom(currentNodes);
    const reward = pickRandom(REWARDS);
    const newName = freshName();
    const pos = spawnPosition(referrer, currentNodes, GRAPH_W, GRAPH_H);
    const newId = nodeIdCounter++;

    const newNode = {
      id: newId,
      name: newName,
      x: pos.x,
      y: pos.y,
      referralCount: 0,
      tier: "new",
      isOrigin: false,
    };

    const newEdge = {
      id: `${referrer.id}-${newId}`,
      from: referrer.id,
      to: newId,
      timestamp: Date.now(),
    };

    const newEvent = {
      id: eventIdCounter++,
      text: buildEventText(referrer, newNode, reward),
      type: EVENT_TYPES.REFERRAL,
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
    setEvents(prev => [newEvent, ...prev].slice(0, 40));
    setStats({ referrals: newReferrals, rewardsPaid: currentStats.rewardsPaid + reward.value, revenue: newRevenue });

    triggerMilestone(newReferrals);
  }, [triggerMilestone]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(tick, TICK_MS);
    return () => clearInterval(interval);
  }, [running, tick]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font)" }}>
      <header style={{ borderBottom: "1px solid var(--border)", padding: "0 2rem", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#FF4E00" }} />
          <span style={{ fontWeight: 600, fontSize: 15 }}>SaaSquatch</span>
          <span style={{ fontSize: 13, color: "var(--text-muted)", marginLeft: 4 }}>live referral demo</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>built by Nawfal Lodhi · impact.com co-op application</span>
          <button
            onClick={() => setRunning(r => !r)}
            style={{ fontSize: 12, padding: "5px 14px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", color: "var(--text)", cursor: "pointer" }}
          >
            {running ? "⏸ Pause" : "▶ Resume"}
          </button>
        </div>
      </header>

      <StatsBar stats={stats} />

      {milestoneMsg && (
        <div style={{ textAlign: "center", padding: "8px 1rem", background: "#fff8f5", borderBottom: "1px solid #ffd5c2", fontSize: 13, color: "#cc3d00", fontWeight: 500 }}>
          {milestoneMsg}
        </div>
      )}

      <main style={{ display: "grid", gridTemplateColumns: `${GRAPH_W}px 1fr`, gap: 0, height: `calc(100vh - 56px - 64px${milestoneMsg ? " - 37px" : ""})` }}>
        <NetworkGraph nodes={nodes} edges={edges} width={GRAPH_W} height={GRAPH_H} />
        <ActivityFeed events={events} />
      </main>
    </div>
  );
}