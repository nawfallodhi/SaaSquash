export default function StatsBar({ stats }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      borderBottom: "1px solid var(--border)",
      height: 64,
    }}>
      <Stat label="Total referrals" value={stats.referrals} prefix="" suffix="" />
      <Stat label="Rewards paid out" value={stats.rewardsPaid} prefix="$" suffix="" border />
      <Stat label="Revenue attributed" value={stats.revenue} prefix="$" suffix="" border />
    </div>
  );
}

function Stat({ label, value, prefix, suffix, border }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "0 1.5rem",
      borderLeft: border ? "1px solid var(--border)" : "none",
    }}>
      <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>
        {label}
      </span>
      <span style={{ fontSize: 22, fontWeight: 600, color: "var(--text)", fontVariantNumeric: "tabular-nums" }}>
        {prefix}{value.toLocaleString()}{suffix}
      </span>
    </div>
  );
}