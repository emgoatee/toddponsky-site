// api/content.js  —  save as api/content.js in your project root
// Requires Upstash connected to your Vercel project (adds env vars automatically)

const KEY   = "tp_site_content";
const BASE  = process.env.KV_REST_API_URL;
const TOKEN = process.env.KV_REST_API_TOKEN;

async function kvGet() {
  const res = await fetch(`${BASE}/get/${KEY}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  const { result } = await res.json();
  if (!result) return null;
  return JSON.parse(result);
}

async function kvSet(data) {
  const value = JSON.stringify(data);
  const res = await fetch(`${BASE}/set/${KEY}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "text/plain",
    },
    body: value,
  });
  return res.ok;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (!BASE || !TOKEN) {
    return res.status(500).json({
      error: "Upstash env vars not set",
      checked: ["UPSTASH_REDIS_REST_URL", "KV_REST_API_URL", "UPSTASH_REDIS_REST_TOKEN", "KV_REST_API_TOKEN"],
      found: { BASE: !!BASE, TOKEN: !!TOKEN },
    });
  }

  if (req.method === "GET") {
    try {
      const data = await kvGet();
      return res.status(200).json(data || null);
    } catch (err) {
      console.error("[content GET]", err.message);
      return res.status(500).json({ error: err.message, url: BASE?.slice(0, 30) + "..." });
    }
  }

  if (req.method === "POST") {
    try {
      await kvSet(req.body);
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("[content POST]", err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
