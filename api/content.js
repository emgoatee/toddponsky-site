// api/content.js  —  save this as api/content.js in your project root
// Uses Upstash Redis REST API — no npm packages needed.
// Requires env vars added automatically when you connect Upstash in Vercel:
//   UPSTASH_REDIS_REST_URL
//   UPSTASH_REDIS_REST_TOKEN

const CONTENT_KEY = "tp_site_content";

async function kvGet() {
  const res = await fetch(
    `${process.env.UPSTASH_REDIS_REST_URL}/get/${CONTENT_KEY}`,
    { headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` } }
  );
  const json = await res.json();
  // Upstash returns { result: "stringified-json" } or { result: null }
  return json.result ? JSON.parse(json.result) : null;
}

async function kvSet(data) {
  await fetch(
    `${process.env.UPSTASH_REDIS_REST_URL}/set/${CONTENT_KEY}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(JSON.stringify(data)), // Upstash stores as string
    }
  );
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  // ── GET: public read ──────────────────────────────────────────────────────
  if (req.method === "GET") {
    try {
      const data = await kvGet();
      return res.status(200).json(data || null);
    } catch (err) {
      console.error("KV read error:", err.message);
      return res.status(500).json({ error: "Could not read content" });
    }
  }

  // ── POST: password-protected write ────────────────────────────────────────
  if (req.method === "POST") {
    const provided = req.headers["x-admin-password"] || "";

    if (!provided) {
      return res.status(401).json({ error: "Missing x-admin-password header" });
    }

    // Compare against env var (set ADMIN_PASSWORD in Vercel dashboard)
    // Falls back to matching the password stored in the payload itself
    const expected = process.env.ADMIN_PASSWORD || req.body?.adminPassword || "";
    if (provided !== expected) {
      return res.status(403).json({ error: "Wrong password" });
    }

    try {
      await kvSet(req.body);
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("KV write error:", err.message);
      return res.status(500).json({ error: "Could not save content" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
