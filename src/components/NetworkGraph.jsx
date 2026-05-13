import { useEffect, useRef } from "react";

const TIER_COLORS = {
  new:      "#3a9e6e",
  active:   "#1a6b45",
  advocate: "#0f2d1f",
};

const TIER_SIZES = {
  new: 7,
  active: 11,
  advocate: 15,
};

export default function NetworkGraph({ nodes, edges, width, height }) {
  const latestEdge = edges[edges.length - 1];

  return (
    <div style={{ borderRight: "1px solid var(--border)", overflow: "hidden", position: "relative" }}>
      <div style={{ position: "absolute", top: 12, left: 12, display: "flex", flexDirection: "column", gap: 6, zIndex: 10 }}>
        <Legend color={TIER_COLORS.new} label="New customer" />
        <Legend color={TIER_COLORS.active} label="Active referrer (2+)" />
        <Legend color={TIER_COLORS.advocate} label="Advocate (5+)" />
      </div>

      <svg width={width} height={height} style={{ display: "block" }}>
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#3a9e6e" opacity="0.5" />
          </marker>
        </defs>

        {edges.map(edge => {
          const from = nodes.find(n => n.id === edge.from);
          const to = nodes.find(n => n.id === edge.to);
          if (!from || !to) return null;
          const isNew = edge.id === latestEdge?.id;
          return (
            <line
              key={edge.id}
              x1={from.x} y1={from.y}
              x2={to.x} y2={to.y}
              stroke={isNew ? "#1a6b45" : "#a8d5bc"}
              strokeWidth={isNew ? 1.5 : 0.8}
              opacity={isNew ? 0.9 : 0.5}
              markerEnd="url(#arrow)"
              style={{ transition: "stroke 0.6s, opacity 0.6s" }}
            />
          );
        })}

        {nodes.map(node => {
          const r = TIER_SIZES[node.tier] || 8;
          const color = TIER_COLORS[node.tier] || TIER_COLORS.new;
          const isNewest = node.id === nodes[nodes.length - 1]?.id;
          return (
            <g key={node.id}>
              {isNewest && (
                <circle cx={node.x} cy={node.y} r={r + 8} fill={color} opacity={0.15}>
                  <animate attributeName="r" from={r} to={r + 16} dur="1s" repeatCount="1" />
                  <animate attributeName="opacity" from={0.3} to={0} dur="1s" repeatCount="1" />
                </circle>
              )}
              <circle
                cx={node.x} cy={node.y} r={r}
                fill={color}
                opacity={0.9}
                style={{ transition: "r 0.4s, fill 0.4s" }}
              />
              {node.isOrigin || node.tier === "advocate" ? (
                <text
                  x={node.x} y={node.y - r - 4}
                  textAnchor="middle"
                  fontSize={10}
                  fill="var(--text-muted)"
                >
                  {node.name}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{label}</span>
    </div>
  );
}