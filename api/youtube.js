// Vercel serverless function — proxies YouTube RSS so the browser
// never hits CORS issues. No API key required.
// Cached for 1 hour on Vercel's edge so it's fast and free.

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=600");

  // Prefer a dedicated Shorts playlist ID if set, otherwise fall back to full channel feed
  const playlistId = process.env.YOUTUBE_SHORTS_PLAYLIST_ID;
  const channelId  = process.env.YOUTUBE_CHANNEL_ID;

  if (!playlistId && !channelId) {
    return res.status(400).json({ error: "No YOUTUBE_CHANNEL_ID or YOUTUBE_SHORTS_PLAYLIST_ID set in Vercel environment variables." });
  }

  const rssUrl = playlistId
    ? `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`
    : `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

  try {
    const response = await fetch(rssUrl);
    if (!response.ok) throw new Error(`YouTube RSS returned ${response.status}`);
    const xml = await response.text();

    // Parse entries with simple regex — no external deps needed
    const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];

    const videos = entries.slice(0, 20).map(([, entry]) => {
      const id        = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1]       ?? "";
      const rawTitle  = entry.match(/<title>(.*?)<\/title>/)?.[1]                 ?? "";
      const published = entry.match(/<published>(.*?)<\/published>/)?.[1]         ?? "";
      const views     = entry.match(/<media:statistics[^>]*views="(\d+)"/)?.[1]  ?? "0";

      // Decode HTML entities in title
      const title = rawTitle.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

      return {
        id,
        title,
        published,
        views: parseInt(views, 10),
        // Use portrait thumbnail for Shorts; falls back gracefully for regular videos
        thumbnail: `https://img.youtube.com/vi/${id}/0.jpg`,
        shortsUrl: `https://www.youtube.com/shorts/${id}`,
        watchUrl:  `https://www.youtube.com/watch?v=${id}`,
      };
    }).filter(v => v.id);

    res.json({ videos, source: rssUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
