import { useState, useEffect, useRef } from "react";
import { Search, Youtube, ExternalLink, ChevronRight, Play, Menu, X, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";

// ─── Mobile helpers ───────────────────────────────────────────────────────────
function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth <= 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth <= 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

function MoreButton({ expanded, count, onClick }) {
  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <button onClick={onClick}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6, background: "#2563eb",
          color: "#fff", border: "none", borderRadius: 10,
          padding: "10px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer"
        }}>
        {expanded ? <><ChevronUp size={15} /> Show Less</> : <><ChevronDown size={15} /> {count} More</>}
      </button>
    </div>
  );
}

function MoreButtonDark({ expanded, count, onClick }) {
  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <button onClick={onClick}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6, background: "#2563eb",
          color: "#fff", border: "none", borderRadius: 10,
          padding: "10px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer"
        }}>
        {expanded ? <><ChevronUp size={15} /> Show Less</> : <><ChevronDown size={15} /> {count} More</>}
      </button>
    </div>
  );
}

// ─── Shorts feed component ────────────────────────────────────────────────────
function ShortsSection({ channelId }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const isMobile = useIsMobile();
  const visibleVideos = isMobile && !expanded ? videos.slice(0, 1) : videos;

  useEffect(() => {
    if (!channelId) {
      setError("No channel ID set. Add your YouTube Channel ID in Admin → Settings.");
      setLoading(false);
      return;
    }
    fetch(`/api/youtube?channelId=${encodeURIComponent(channelId)}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setVideos(data.videos || []);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [channelId]);

  return (
    <section id="shorts" style={{ padding: "96px 24px", background: "#f1f6fb" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ color: "#dc2626", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>YouTube Shorts</span>
          <h2 style={{ fontSize: 38, fontWeight: 800, color: "#0f172a", marginTop: 8, marginBottom: 12 }}>Check Out Todd's YouTube Channel</h2>
          <p style={{ fontSize: 17, color: "#4b6280", maxWidth: 520, margin: "0 auto" }}>
            Bite-sized AI insights — under 60 seconds each.
          </p>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{ display: "inline-flex", gap: 8 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 160, height: 284, background: "#c8dcea", borderRadius: 14,
                  animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite alternate`
                }} />
              ))}
            </div>
            <p style={{ color: "#4b6280", marginTop: 16, fontSize: 14 }}>Loading shorts…</p>
          </div>
        )}

        {error && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#dc2626" }}>
            <p style={{ fontSize: 15 }}>⚠ Couldn't load shorts: {error}</p>
            <p style={{ fontSize: 13, color: "#475569", marginTop: 8 }}>Make sure YOUTUBE_CHANNEL_ID is set in Vercel environment variables.</p>
          </div>
        )}

        {!loading && !error && videos.length > 0 && (
          <>
            {/* 5×2 grid on desktop, 1 col on mobile (collapsed) */}
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(5, 1fr)", gap: 16 }}>
              {visibleVideos.map(video => (
                <a key={video.id} href={video.shortsUrl} target="_blank" rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}>
                  <div style={{
                    position: "relative", width: "100%", aspectRatio: "9/16", borderRadius: 14,
                    overflow: "hidden", background: "#2d1454", transition: "transform 0.2s"
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}>
                    <img src={video.thumbnail} alt={video.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
                    {/* Gradient overlay */}
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 40%, transparent 70%)" }} />
                    {/* Play button */}
                    <div style={{
                      position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                      width: 44, height: 44, background: "rgba(220,38,38,0.9)", borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <Play size={18} color="#fff" fill="#fff" style={{ marginLeft: 3 }} />
                    </div>
                    {/* Title + views */}
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 10px 12px" }}>
                      <p style={{
                        color: "#fff", fontSize: 12, fontWeight: 600, lineHeight: 1.4,
                        display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", margin: 0
                      }}>
                        {video.title}
                      </p>
                      {video.views > 0 && (
                        <p style={{ color: "#94a3b8", fontSize: 10, margin: "4px 0 0" }}>
                          {video.views.toLocaleString()} views
                        </p>
                      )}
                    </div>
                    {/* SHORT badge */}
                    <div style={{
                      position: "absolute", top: 8, right: 8, background: "#dc2626",
                      color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 4, letterSpacing: "0.05em"
                    }}>
                      SHORT
                    </div>
                  </div>
                </a>
              ))}
            </div>
            {isMobile && videos.length > 1 && (
              <MoreButton expanded={expanded} count={videos.length - 1} onClick={() => setExpanded(e => !e)} />
            )}
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <a href="https://www.youtube.com/@tponsky/shorts" target="_blank" rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8, background: "#dc2626",
                  color: "#fff", textDecoration: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 700, fontSize: 14
                }}>
                <Youtube size={18} /> See All Shorts
              </a>
            </div>
          </>
        )}
      </div>
      <style>{`@keyframes pulse { from { opacity: 0.4 } to { opacity: 0.8 } }`}</style>
    </section>
  );
}

// Built-in section nav labels
const SECTION_LABELS = {
  about: "About",
  tools: "AI Tools",
  learn: "Learn",
  shorts: "Shorts",
  services: "Services",
  contact: "Contact",
};

const ALL_CATEGORIES = ["All", "Writing & Content", "Image Generation", "Video", "Productivity", "Audio & Voice", "Analytics & Data"];

export default function MainSite({ content, onAdminClick }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activePlaylist, setActivePlaylist] = useState(content.playlists[0]?.id || "");
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [formSent, setFormSent] = useState(false);
  const [activePage, setActivePage] = useState(null);
  const [toolsExpanded, setToolsExpanded] = useState(false);
  const [learnExpanded, setLearnExpanded] = useState(false);
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const [ytPlaylistVideos, setYtPlaylistVideos] = useState({}); // { [playlistId]: video[] }
  const [ytPlaylistLoading, setYtPlaylistLoading] = useState(false);
  const isMobile = useIsMobile();

  // Secret admin access: click logo 5 times within 3 seconds
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef(null);
  const handleLogoClick = () => {
    setActivePage(null);
    scrollTo("hero");
    logoClickCount.current += 1;
    clearTimeout(logoClickTimer.current);
    if (logoClickCount.current >= 5) {
      logoClickCount.current = 0;
      onAdminClick();
      return;
    }
    logoClickTimer.current = setTimeout(() => { logoClickCount.current = 0; }, 3000);
  };

  // Auto-fetch videos from YouTube when active playlist has a ytPlaylistId
  useEffect(() => {
    const pl = content.playlists.find(p => p.id === activePlaylist);
    if (!pl?.ytPlaylistId) return;
    if (ytPlaylistVideos[activePlaylist]) return; // already fetched
    setYtPlaylistLoading(true);
    fetch(`/api/playlist?playlistId=${encodeURIComponent(pl.ytPlaylistId)}`)
      .then(r => r.json())
      .then(data => setYtPlaylistVideos(prev => ({ ...prev, [activePlaylist]: data.videos || [] })))
      .catch(() => setYtPlaylistVideos(prev => ({ ...prev, [activePlaylist]: [] })))
      .finally(() => setYtPlaylistLoading(false));
  }, [activePlaylist, content.playlists]);

  // Build nav from section order + visibility + custom pages
  const visibleSections = (content.sectionOrder || []).filter(id => content.sectionVisibility?.[id] !== false);
  const navLinks = [
    ...visibleSections.map(id => ({ id, label: SECTION_LABELS[id], type: "section" })),
    ...(content.customPages || []).map(p => ({ id: p.id, label: p.navLabel, type: "page" })),
  ];

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const handleNavClick = (link) => {
    if (link.type === "page") {
      setActivePage(link.id);
      setMobileOpen(false);
      window.scrollTo(0, 0);
    } else {
      setActivePage(null);
      scrollTo(link.id);
    }
  };

  const filteredTools = content.tools.filter((tool) => {
    const matchCat = activeCategory === "All" || tool.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = tool.name.toLowerCase().includes(q) || tool.description.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const currentPlaylist = content.playlists.find((p) => p.id === activePlaylist) || content.playlists[0];

  const [formError, setFormError] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, to: content.contactEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      setFormSent(true);
    } catch (err) {
      setFormError(err.message || "Something went wrong. Please try again.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const { hero, about, services, youtubeChannelUrl } = content;
  const isVisible = (id) => content.sectionVisibility?.[id] !== false;

  // ── Custom page renderer ──
  if (activePage) {
    const page = (content.customPages || []).find(p => p.id === activePage);
    if (page) return (
      <div style={{ minHeight: "100vh", background: "#fff" }}>
        <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)", borderBottom: "1px solid #e2e8f0" }}>
          <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={() => { setActivePage(null); }} style={{ fontWeight: 800, fontSize: 20, color: "#0f172a", background: "none", border: "none", cursor: "pointer" }}>
              Todd Ponsky
            </button>
            <button onClick={() => setActivePage(null)}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "#f1f5f9", border: "none", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#475569" }}>
              <ArrowLeft size={15} /> Back to site
            </button>
          </div>
        </nav>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "120px 24px 80px" }}>
          <h1 style={{ fontSize: 42, fontWeight: 800, color: "#0f172a", marginBottom: 12, letterSpacing: "-0.5px" }}>{page.heading}</h1>
          {page.subheading && <p style={{ fontSize: 18, color: "#64748b", marginBottom: 36 }}>{page.subheading}</p>}
          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 36 }}>
            {page.body.split("\n\n").map((para, i) => (
              <p key={i} style={{ fontSize: 17, color: "#374151", lineHeight: 1.8, marginBottom: 20 }}>{para}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>

      {/* ── NAV ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={handleLogoClick} style={{ fontWeight: 800, fontSize: 20, color: "#0f172a", background: "none", border: "none", cursor: "pointer" }}>
            Todd Ponsky
          </button>
          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {navLinks.map((l) => (
              <button key={l.id} onClick={() => handleNavClick(l)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#475569" }}>
                {l.label}
              </button>
            ))}
            <button onClick={() => handleNavClick({ id: "contact", type: "section" })}
              style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              Work With Us
            </button>
          </div>
          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", display: "none" }}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {mobileOpen && (
          <div style={{ background: "#fff", borderTop: "1px solid #e2e8f0", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
            {navLinks.map((l) => (
              <button key={l.id} onClick={() => handleNavClick(l)} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", fontSize: 15, fontWeight: 500, color: "#334155" }}>
                {l.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <style>{`
        .hero-step-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 24px;
          transition: transform 0.22s ease, background 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
          cursor: default;
        }
        .hero-step-card:hover {
          transform: translateY(-4px) scale(1.02);
          background: rgba(255,255,255,0.09);
          border-color: rgba(96,165,250,0.5);
          box-shadow: 0 12px 40px rgba(37,99,235,0.25);
        }
      `}</style>
      <section id="hero" style={{ paddingTop: 64, background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "80px 24px 72px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 48, alignItems: "center" }}>

            {/* Left — headline */}
            <div style={{ flex: "1 1 380px", color: "#fff" }}>
              <span style={{ display: "inline-block", background: "rgba(59,130,246,0.2)", color: "#93c5fd", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 999, marginBottom: 28 }}>
                {hero.badge}
              </span>
              <h1 style={{ fontSize: "clamp(40px,5.5vw,64px)", fontWeight: 800, lineHeight: 1.08, marginBottom: 24, letterSpacing: "-1.5px" }}>
                {hero.headline.replace(/\.$/, "")}
                <br /><span style={{ color: "#60a5fa" }}>{hero.headlineAccent || "for Everyone."}</span>
              </h1>
              <p style={{ fontSize: 19, color: "#94a3b8", lineHeight: 1.75, maxWidth: 460 }}>
                {hero.subheadline.split("\n").map((line, i, arr) => (
                  <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                ))}
              </p>
            </div>

            {/* Right — 3-step cards */}
            <div style={{ flex: "1 1 340px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#93c5fd", marginBottom: 14 }}>
                {hero.stepsLabel || "Get started in 3 steps"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

                {/* Step 1 */}
                <div className="hero-step-card">
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>1</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>{hero.step1Title || "Stay in the loop"}</div>
                  </div>
                  <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, marginBottom: 14 }}>
                    {hero.step1Desc || "Weekly newsletters on Substack and daily AI updates on LinkedIn — no fluff, just what matters."}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    <a href={hero.step1Btn1Url || "https://substack.com/@toddponsky"} target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", background: "#FF6719", color: "#fff", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                      {hero.step1Btn1 || "Substack"}
                    </a>
                    <a href={hero.step1Btn2Url || "https://linkedin.com/in/toddponsky"} target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", background: "#0077B5", color: "#fff", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                      {hero.step1Btn2 || "LinkedIn"}
                    </a>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="hero-step-card">
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>2</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>{hero.step2Title || "Browse free resources"}</div>
                  </div>
                  <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, marginBottom: 14 }}>
                    {hero.step2Desc || "Tutorials, AI tool guides, and curated playlists — updated regularly and always free to access."}
                  </p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => scrollTo("tools")}
                      style={{ display: "inline-flex", alignItems: "center", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                      {hero.step2Btn || "Start Learning"}
                    </button>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="hero-step-card">
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>3</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>{hero.step3Title || "Work together"}</div>
                  </div>
                  <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, marginBottom: 14 }}>
                    {hero.step3Desc || "Workshops, 1:1 coaching, or deep-dive consulting — reach out and let's figure out what you need."}
                  </p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => scrollTo("contact")}
                      style={{ display: "inline-flex", alignItems: "center", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                      {hero.step3Btn || "Work with us"}
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      {isVisible("about") && <section id="about" style={{ padding: "96px 24px", background: "#d8e7f3" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 64, alignItems: "center" }}>
            <div style={{ flex: "1 1 420px" }}>
              <span style={{ color: "#2563eb", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>About Todd</span>
              <h2 style={{ fontSize: 38, fontWeight: 800, color: "#0f172a", marginTop: 8, marginBottom: 20 }}>{about.heading}</h2>
              <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.75, marginBottom: 16 }}>{about.bio1}</p>
              <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.75, marginBottom: 28 }}>{about.bio2}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {about.tags.map((tag) => (
                  <span key={tag} style={{ background: "#dbeafe", color: "#1d4ed8", fontSize: 13, fontWeight: 600, padding: "4px 12px", borderRadius: 999 }}>{tag}</span>
                ))}
              </div>
            </div>
            <div style={{ flex: "0 1 360px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {about.roles.map((card) => (
                <div key={card.title} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{card.icon}</div>
                  <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 15 }}>{card.title}</div>
                  <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{card.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>}

      {/* ── AI TOOLS ── */}
      {isVisible("tools") && <section id="tools" style={{ padding: "96px 24px", background: "#e2edf7" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ color: "#2563eb", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Curated Resources</span>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: "#0f172a", marginTop: 8, marginBottom: 12 }}>AI Tools Directory</h2>
            <p style={{ fontSize: 17, color: "#64748b", maxWidth: 520, margin: "0 auto" }}>
              A hand-picked collection of the AI tools worth knowing — vetted, categorized, and updated regularly.
            </p>
          </div>
          <div style={{ position: "relative", maxWidth: 480, margin: "0 auto 20px" }}>
            <Search size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input type="text" placeholder="Search tools..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "100%", paddingLeft: 42, paddingRight: 16, paddingTop: 12, paddingBottom: 12, border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14, outline: "none" }} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 36 }}>
            {ALL_CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                style={{ padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none", background: activeCategory === cat ? "#2563eb" : "#d0e3f0", color: activeCategory === cat ? "#fff" : "#334155" }}>
                {cat}
              </button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {(!toolsExpanded ? filteredTools.slice(0, isMobile ? 1 : 3) : filteredTools).map((tool) => (
              <a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer"
                style={{ background: "#ffffff", border: "1.5px solid #c8dcea", borderRadius: 14, padding: 20, textDecoration: "none", display: "block" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#93c5fd"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(37,99,235,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, color: "#0f172a", fontSize: 15 }}>{tool.name}</span>
                    {tool.featured && <span style={{ background: "#fef9c3", color: "#92400e", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999 }}>⭐ Featured</span>}
                  </div>
                  <ExternalLink size={14} style={{ color: "#94a3b8", flexShrink: 0 }} />
                </div>
                <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, marginBottom: 12 }}>{tool.description}</p>
                <span style={{ background: "#dbeafe", color: "#1e40af", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 6 }}>{tool.category}</span>
              </a>
            ))}
          </div>
          {filteredTools.length === 0 && (
            <div style={{ textAlign: "center", padding: "64px 0", color: "#94a3b8" }}>No tools match your search.</div>
          )}
          {filteredTools.length > (isMobile ? 1 : 3) && (
            <MoreButtonDark expanded={toolsExpanded} count={filteredTools.length - (isMobile ? 1 : 3)} onClick={() => setToolsExpanded(e => !e)} />
          )}
        </div>
      </section>}

      {/* ── LEARN ── */}
      {isVisible("learn") && <section id="learn" style={{ padding: "96px 24px", background: "#eaf3fa" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ color: "#2563eb", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Free Education</span>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: "#0f172a", marginTop: 8, marginBottom: 12 }}>AI for Everyone</h2>
            <p style={{ fontSize: 17, color: "#4b6280", maxWidth: 520, margin: "0 auto" }}>
              Structured playlists to take you from AI-curious to AI-confident — at your own pace.
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 36 }}>
            {content.playlists.map((pl) => (
              <button key={pl.id} onClick={() => setActivePlaylist(pl.id)}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", border: "1.5px solid #c8dcea", background: activePlaylist === pl.id ? "#2563eb" : "#daeaf5", color: activePlaylist === pl.id ? "#fff" : "#334155" }}>
                {pl.icon} {pl.title}
              </button>
            ))}
          </div>
          {currentPlaylist && (() => {
            // Use YouTube-fetched videos if available, else fall back to manual list
            const activeVideos = ytPlaylistVideos[currentPlaylist.id] ?? currentPlaylist.videos ?? [];
            const shownVideos = learnExpanded ? activeVideos : activeVideos.slice(0, isMobile ? 1 : 3);
            return (
              <>
                <p style={{ textAlign: "center", color: "#4b6280", fontSize: 15, marginBottom: 28 }}>{currentPlaylist.description}</p>
                {ytPlaylistLoading && (
                  <div style={{ textAlign: "center", padding: "32px 0", color: "#4b6280", fontSize: 14 }}>
                    Loading playlist…
                  </div>
                )}
                {!ytPlaylistLoading && (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                      {shownVideos.map((video, idx) => (
                        <a key={idx}
                          href={video.ytId ? `https://www.youtube.com/watch?v=${video.ytId}` : "#"}
                          target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                          <div style={{ background: "#ffffff", borderRadius: 14, overflow: "hidden", cursor: "pointer", border: "1.5px solid #c8dcea", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "#d8edf8"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "#ffffff"; }}>
                            <div style={{ position: "relative", background: "#0a0f1a", aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {video.ytId ? (
                                <img
                                  src={`https://img.youtube.com/vi/${video.ytId}/hqdefault.jpg`}
                                  alt={video.title}
                                  onError={(e) => {
                                    const fallbacks = ["mqdefault.jpg", "sddefault.jpg", "default.jpg"];
                                    const current = e.target.src.split("/").pop();
                                    const next = fallbacks[fallbacks.indexOf(current)];
                                    if (next) e.target.src = `https://img.youtube.com/vi/${video.ytId}/${next}`;
                                    else e.target.style.display = "none";
                                  }}
                                  style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
                              ) : null}
                              <div style={{ position: "relative", zIndex: 1, width: 52, height: 52, background: "#dc2626", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Play size={22} color="#fff" fill="#fff" style={{ marginLeft: 3 }} />
                              </div>
                              {video.duration && <span style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.8)", color: "#fff", fontSize: 11, padding: "2px 6px", borderRadius: 4, zIndex: 1 }}>{video.duration}</span>}
                              <span style={{ position: "absolute", top: 8, left: 8, background: "rgba(37,99,235,0.85)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, zIndex: 1 }}>EP {idx + 1}</span>
                            </div>
                            <div style={{ padding: 16 }}>
                              <div style={{ fontSize: 11, color: "#4b6280", marginBottom: 4 }}>{currentPlaylist.title}</div>
                              <div style={{ fontWeight: 600, color: "#1e293b", fontSize: 14, lineHeight: 1.4 }}>{video.title}</div>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                    {activeVideos.length > (isMobile ? 1 : 3) && (
                      <MoreButton expanded={learnExpanded} count={activeVideos.length - (isMobile ? 1 : 3)} onClick={() => setLearnExpanded(e => !e)} />
                    )}
                  </>
                )}
              </>
            );
          })()}
        </div>
      </section>}

      {/* ── SHORTS ── */}
      {isVisible("shorts") && <ShortsSection channelId={content.youtubeChannelId} />}

      {/* ── SERVICES ── */}
      {isVisible("services") && <section id="services" style={{ padding: "96px 24px", background: "#f6fafd" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ color: "#2563eb", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Work Together</span>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: "#0f172a", marginTop: 8, marginBottom: 12 }}>Services</h2>
            <p style={{ fontSize: 17, color: "#64748b", maxWidth: 520, margin: "0 auto" }}>
              Whether you need a strategy, hands-on training, or someone to inspire your whole company.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(460px, 1fr))", gap: 24 }}>
            {(!servicesExpanded ? services.slice(0, isMobile ? 1 : services.length) : services).map((service) => (
              <div key={service.title} style={{ border: "1.5px solid #e2e8f0", borderRadius: 20, padding: 32 }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 30px rgba(37,99,235,0.12)"; e.currentTarget.style.borderColor = "#93c5fd"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#e2e8f0"; }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{service.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>{service.title}</h3>
                <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, marginBottom: 20 }}>{service.description}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 8 }}>
                  {service.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#334155" }}>
                      <ChevronRight size={14} color="#2563eb" style={{ flexShrink: 0 }} /> {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => scrollTo("contact")}
                  style={{ width: "100%", background: "#0f172a", color: "#fff", border: "none", borderRadius: 10, padding: "13px 0", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#2563eb"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#0f172a"; }}>
                  {service.cta}
                </button>
              </div>
            ))}
          </div>
          {isMobile && services.length > 1 && (
            <MoreButtonDark expanded={servicesExpanded} count={services.length - 1} onClick={() => setServicesExpanded(e => !e)} />
          )}
        </div>
      </section>}

      {/* ── CONTACT ── */}
      {isVisible("contact") && <section id="contact" style={{ padding: "96px 24px", background: "#ffffff" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <span style={{ color: "#2563eb", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Get in Touch</span>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: "#0f172a", marginTop: 8, marginBottom: 12 }}>Let's Work Together</h2>
            <p style={{ fontSize: 16, color: "#64748b" }}>Fill out the form and Todd will get back to you within 48 hours.</p>
          </div>
          {formSent ? (
            <div style={{ background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 20, padding: 48, textAlign: "center" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Message Sent!</h3>
              <p style={{ color: "#475569" }}>Thanks for reaching out. Todd will be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 20, padding: 36, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Name *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "10px 12px", fontSize: 14, outline: "none" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Email *</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "10px 12px", fontSize: 14, outline: "none" }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>I'm interested in…</label>
                <select value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "10px 12px", fontSize: 14, outline: "none", background: "#fff" }}>
                  <option value="">Select a service…</option>
                  {services.map((s) => <option key={s.title}>{s.title}</option>)}
                  <option>Something Else</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Message *</label>
                <textarea rows={5} required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about your goals, timeline, and anything else that would help…"
                  style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "10px 12px", fontSize: 14, outline: "none", resize: "vertical" }} />
              </div>
              {formError && (
                <div style={{ background: "#fef2f2", border: "1.5px solid #fca5a5", borderRadius: 10, padding: "12px 16px", fontSize: 14, color: "#dc2626" }}>
                  ⚠ {formError}
                </div>
              )}
              <button type="submit" disabled={formSubmitting}
                style={{ background: formSubmitting ? "#93c5fd" : "#2563eb", color: "#fff", border: "none", borderRadius: 10, padding: "14px 0", fontSize: 15, fontWeight: 700, cursor: formSubmitting ? "not-allowed" : "pointer" }}
                onMouseEnter={(e) => { if (!formSubmitting) e.currentTarget.style.background = "#1d4ed8"; }}
                onMouseLeave={(e) => { if (!formSubmitting) e.currentTarget.style.background = "#2563eb"; }}>
                {formSubmitting ? "Sending…" : "Send Message →"}
              </button>
            </form>
          )}
        </div>
      </section>}

      {/* ── FOOTER ── */}
      <footer style={{ background: "#0f172a", padding: "48px 24px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 18, marginBottom: 4 }}>Todd Ponsky</div>
            <div style={{ color: "#475569", fontSize: 13 }}>AI Educator · Consultant · Speaker</div>
          </div>
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            {navLinks.map((l) => (
              <button key={l.id} onClick={() => handleNavClick(l)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: 13 }}>{l.label}</button>
            ))}
          </div>
          <div style={{ color: "#334155", fontSize: 12 }}>© {new Date().getFullYear()} Todd Ponsky. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
