export const API_URL = "http://localhost:5000";

export async function saveVersion(text) {
  const res = await fetch(`${API_URL}/save-version`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });
  return res.json();
}

export async function getVersions() {
  const res = await fetch(`${API_URL}/versions`);
  return res.json();
}
