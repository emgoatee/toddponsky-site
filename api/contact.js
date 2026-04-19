// api/contact.js  —  save as api/contact.js in your project root
// Requires RESEND_API_KEY in Vercel env vars (free at resend.com)

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, email, subject, message, to } = req.body || {};
  const toEmail = process.env.CONTACT_EMAIL || to;

  if (!toEmail) {
    return res.status(500).json({ error: "No contact email configured. Add CONTACT_EMAIL to Vercel env vars, or set it in Admin → Settings." });
  }
  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: "RESEND_API_KEY not set in Vercel env vars." });
  }
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Todd Ponsky Site <onboarding@resend.dev>",
        to: [toEmail],
        reply_to: email,
        subject: `[Contact Form] ${subject || "New message"}`,
        html: `
          <table style="font-family:sans-serif;font-size:15px;color:#1e293b;max-width:560px">
            <tr><td style="padding-bottom:24px">
              <h2 style="margin:0 0 4px;font-size:20px">New message from your website</h2>
              <p style="margin:0;color:#64748b;font-size:13px">Sent via toddponsky.com contact form</p>
            </td></tr>
            <tr><td style="padding-bottom:12px"><strong>Name:</strong> ${name}</td></tr>
            <tr><td style="padding-bottom:12px"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding-bottom:12px"><strong>Subject:</strong> ${subject || "—"}</td></tr>
            <tr><td style="padding-bottom:4px"><strong>Message:</strong></td></tr>
            <tr><td style="background:#f8fafc;border-left:3px solid #2563eb;padding:16px;border-radius:4px;white-space:pre-wrap">${message}</td></tr>
          </table>
        `,
      }),
    });

    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      console.error("[contact]", err);
      return res.status(500).json({ error: err.message || "Resend API error" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[contact]", err.message);
    return res.status(500).json({ error: err.message });
  }
}
