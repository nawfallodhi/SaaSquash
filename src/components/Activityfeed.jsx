import { useEffect, useRef } from "react";

export default function ActivityFeed({ events }) {
  const topRef = useRef(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events.length]);

  return (
    <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{
        padding: "0 1.25rem",
        height: 44,
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid var(--border)",
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)" }}>
          Live activity
        </span>
        <span style={{
          marginLeft: 8,
          width: 7, height: 7,
          borderRadius: "50%",
          background: "#1D9E75",
          display: "inline-block",
          animation: "pulse 1.5s infinite",
        }} />
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem 0" }}>
        <div ref={topRef} />
        {events.map((event, i) => (
          <FeedItem key={event.id} event={event} isNew={i === 0} />
        ))}
        {events.length === 0 && (
          <p style={{ padding: "1rem 1.25rem", fontSize: 13, color: "var(--text-muted)" }}>
            Waiting for first referral…
          </p>
        )}
      </div>
    </div>
  );
}

function FeedItem({ event, isNew }) {
  return (
    <div style={{
      padding: "10px 1.25rem",
      borderBottom: "1px solid var(--border)",
      animation: isNew ? "slideIn 0.3s ease" : "none",
      background: isNew ? "var(--highlight)" : "transparent",
      transition: "background 1s",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div style={{
          width: 7, height: 7, borderRadius: "50%",
          background: "#FF4E00",
          flexShrink: 0,
          marginTop: 5,
        }} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.45, margin: 0 }}>
            {event.text}
          </p>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>
            {new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </p>
        </div>
      </div>
    </div>
  );
}