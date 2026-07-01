export async function fetchAdminStats() {
  const res = await fetch("/api/admin/dashboard-stats");
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export async function fetchUsers() {
  const res = await fetch("/api/admin/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function fetchAiRequests() {
  const res = await fetch("/api/admin/ai-requests");
  if (!res.ok) throw new Error("Failed to fetch AI requests");
  return res.json();
}

export async function fetchPlugins() {
  const res = await fetch("/api/admin/plugins");
  if (!res.ok) throw new Error("Failed to fetch plugins");
  return res.json();
}

export async function fetchRevenue() {
  const res = await fetch("/api/admin/revenue");
  if (!res.ok) throw new Error("Failed to fetch revenue");
  return res.json();
}

export async function fetchSecurityLogs() {
  const res = await fetch("/api/admin/security-logs");
  if (!res.ok) throw new Error("Failed to fetch logs");
  return res.json();
}

export async function fetchSettings() {
  const res = await fetch("/api/admin/settings");
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json();
}

export async function seedData() {
  const res = await fetch("/api/admin/seed-data", { method: "POST" });
  if (!res.ok) throw new Error("Failed to seed data");
  return res.json();
}
