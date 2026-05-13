export const NAMES = [
  "Maya", "Jordan", "Priya", "Luca", "Sofia", "Ethan", "Aisha", "Noah",
  "Zara", "Miles", "Chloe", "Ravi", "Elena", "Omar", "Lily", "Kai",
  "Nadia", "Felix", "Amara", "Theo", "Isla", "Dante", "Yuki", "Sam",
  "Leila", "Hugo", "Mia", "Andre", "Sana", "Finn", "Rosa", "Jae",
];

export const REWARDS = [
  { label: "$15 credit", value: 15 },
  { label: "$20 credit", value: 20 },
  { label: "$10 gift card", value: 10 },
  { label: "1 month free", value: 25 },
  { label: "$30 cash back", value: 30 },
];

export const EVENT_TYPES = {
  REFERRAL: "referral",
  REWARD: "reward",
  SIGNUP: "signup",
  MILESTONE: "milestone",
};

export const MILESTONES = [
  { at: 5,  text: "5 referrals, program momentum building!" },
  { at: 10, text: "10 referrals, viral coefficient hitting 1.2×" },
  { at: 20, text: "20 referrals, top advocate tier unlocked!" },
  { at: 30, text: "35 referrals, organic growth loop fully active!" },
];

// Generate a position near a parent node, spreading outward
export function spawnPosition(parent, allNodes, width, height) {
  const padding = 48;
  const attempts = 20;
  const minDist = 60;

  for (let i = 0; i < attempts; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const dist = 70 + Math.random() * 80;
    const x = Math.min(Math.max(parent.x + Math.cos(angle) * dist, padding), width - padding);
    const y = Math.min(Math.max(parent.y + Math.sin(angle) * dist, padding), height - padding);

    const tooClose = allNodes.some(n => Math.hypot(n.x - x, n.y - y) < minDist);
    if (!tooClose) return { x, y };
  }

  //fallback: just place near parent with small offset
  return {
    x: Math.min(Math.max(parent.x + (Math.random() - 0.5) * 60, padding), width - padding),
    y: Math.min(Math.max(parent.y + (Math.random() - 0.5) * 60, padding), height - padding),
  };
}

export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function pickRandomExcluding(arr, excludeIds) {
  const filtered = arr.filter(item => !excludeIds.includes(item.id));
  return filtered.length > 0 ? pickRandom(filtered) : null;
}

// Tiers based on how many referrals a node has made
export function getTier(referralCount) {
  if (referralCount >= 5) return "advocate";
  if (referralCount >= 2) return "active";
  return "new";
}

export function buildEventText(referrer, newNode, reward) {
  const templates = [
    `${referrer.name} referred ${newNode.name} → ${reward.label} unlocked`,
    `${newNode.name} signed up via ${referrer.name}'s link → ${reward.label} triggered`,
    `${referrer.name}'s referral converted — ${reward.label} sent to both`,
    `New signup: ${newNode.name} (referred by ${referrer.name}) → ${reward.label}`,
  ];
  return pickRandom(templates);
}

export const INITIAL_NODES = [
  { id: 0, name: "Maya", x: 0.5, y: 0.5, referralCount: 0, tier: "new", isOrigin: true },
];