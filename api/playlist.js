// api/playlist.js  —  save this as api/playlist.js in your project root
// Fetches videos from a YouTube playlist via RSS (no API key needed)

export default async function handler(req, res) {
  let { playlistId } = req.query;

  if (!playlistId) {
    return res.status(400).json({ error: "Missing playlistId parameter" });
  }

  // Accept full YouTube URLs like https://www.youtube.com/playlist?list=PLxxx
  const listMatch = playlistId.match(/[?&]list=([A-Za-z0-9_-]+)/);
  if (listMatch) playlistId = listMatch[1];

  try {
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${encodeURIComponent(playlistId)}`;
    const response = await fetch(rssUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!response.ok) {
      throw new Error(`YouTube RSS returned ${response.status}`);
    }

    const xml = await response.text();

    // Extract each <entry> block
    const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(m => m[1]);

    const videos = entries.map(entry => {
      const ytId    = (entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)  || [])[1] || "";
      const rawTitle = (entry.match(/<title>([^<]+)<\/title>/)            || [])[1] || "";
      const title   = rawTitle
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

      return { ytId, title, duration: "" };
    });

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    return res.json({ videos });

  } catch (err) {
    console.error("playlist API error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
