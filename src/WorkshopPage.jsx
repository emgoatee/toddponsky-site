import { useState, useEffect } from "react";
import { ArrowLeft, Play, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Mobile hook ──────────────────────────────────────────────────────────────
function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth <= 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth <= 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

// ─── Portrait YouTube embed (9:16) ────────────────────────────────────────────
function ShortsEmbed({ ytId, onPlay, isPlaying }) {
  if (!ytId || ytId.trim() === "") {
    return (
      <div style={{
        width: "100%", aspectRatio: "9/16", background: "#1e293b", borderRadius: 20,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        color: "#475569", fontSize: 13, gap: 10,
      }}>
        <Play size={32} color="#334155" />
        <span>No video ID set</span>
      </div>
    );
  }

  // Use hqdefault for Shorts since maxresdefault often fails
  const thumb = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;

  if (!isPlaying) {
    return (
      <div
        onClick={onPlay}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === "Enter" && onPlay()}
        style={{
          width: "100%", aspectRatio: "9/16", borderRadius: 20, overflow: "hidden",
          position: "relative", cursor: "pointer", background: "#0f172a",
          boxShadow: "0 16px 48px rgba(0,0,0,0.25)",
        }}
      >
        <img
          src={thumb}
          alt="Video thumbnail"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          onError={e => { e.target.style.display = "none"; }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)" }} />
        {/* Play button */}
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: 64, height: 64, background: "rgba(220,38,38,0.9)", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(220,38,38,0.45)",
          transition: "transform 0.15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translate(-50%,-50%) scale(1.1)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translate(-50%,-50%) scale(1)"; }}
        >
          <Play size={24} color="#fff" fill="#fff" style={{ marginLeft: 3 }} />
        </div>
        {/* Shorts badge */}
        <div style={{
          position: "absolute", top: 12, left: 12,
          background: "rgba(220,38,38,0.9)", color: "#fff",
          fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 6,
          letterSpacing: "0.06em",
        }}>
          SHORTS
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", aspectRatio: "9/16", borderRadius: 20, overflow: "hidden", boxShadow: "0 16px 48px rgba(0,0,0,0.25)" }}>
      <iframe
        src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
        title="Workshop short"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ width: "100%", height: "100%", border: "none", display: "block" }}
      />
    </div>
  );
}

// ─── Section component (handles carousel internally) ──────────────────────────
function WorkshopSection({ section, index, total, isMobile }) {
  const videos = section.videos?.length ? section.videos : [];
  const [activeIdx, setActiveIdx] = useState(0);
  const [playingIdx, setPlayingIdx] = useState(null);

  // Reset state if section changes
  useEffect(() => { setActiveIdx(0); setPlayingIdx(null); }, [section.id]);

  const isEven = index % 2 === 0; // even = video left, odd = video right
  const currentVideo = videos[activeIdx] || { ytId: "", description: "" };
  const hasMultiple = videos.length > 1;

  const goTo = (idx) => {
    setActiveIdx(idx);
    setPlayingIdx(null); // stop current video when switching
  };
  const prev = () => goTo(Math.max(0, activeIdx - 1));
  const next = () => goTo(Math.min(videos.length - 1, activeIdx + 1));

  // ── Video column ──
  const videoCol = (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      width: isMobile ? "100%" : undefined,
    }}>
      {/* Portrait video */}
      <div style={{
        width: isMobile ? "min(280px, 100%)" : 260,
        margin: "0 auto",
      }}>
        <ShortsEmbed
          ytId={currentVideo.ytId}
          isPlaying={playingIdx === activeIdx}
          onPlay={() => setPlayingIdx(activeIdx)}
        />
      </div>

      {/* Carousel controls */}
      {hasMultiple && (
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          {/* Prev / counter / Next */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={prev}
              disabled={activeIdx === 0}
              style={{
                width: 36, height: 36, borderRadius: "50%", border: "none", cursor: activeIdx === 0 ? "not-allowed" : "pointer",
                background: activeIdx === 0 ? "#f1f5f9" : "#2563eb",
                color: activeIdx === 0 ? "#cbd5e1" : "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.15s",
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#64748b", minWidth: 40, textAlign: "center" }}>
              {activeIdx + 1} / {videos.length}
            </span>
            <button
              onClick={next}
              disabled={activeIdx === videos.length - 1}
              style={{
                width: 36, height: 36, borderRadius: "50%", border: "none", cursor: activeIdx === videos.length - 1 ? "not-allowed" : "pointer",
                background: activeIdx === videos.length - 1 ? "#f1f5f9" : "#2563eb",
                color: activeIdx === videos.length - 1 ? "#cbd5e1" : "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.15s",
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Dot indicators */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {videos.map((_, vi) => (
              <button
                key={vi}
                onClick={() => goTo(vi)}
                style={{
                  width: vi === activeIdx ? 20 : 8, height: 8, borderRadius: 999, border: "none",
                  background: vi === activeIdx ? "#2563eb" : "#cbd5e1",
                  cursor: "pointer", padding: 0, transition: "width 0.2s, background 0.2s",
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // ── Text column ──
  const textCol = (
    <div style={{
      display: "flex", flexDirection: "column", justifyContent: "center",
      paddingTop: isMobile ? 0 : 8,
    }}>
      {section.badge && (
        <span style={{
          display: "inline-block", background: "#eff6ff", color: "#2563eb",
          fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
          padding: "4px 12px", borderRadius: 999, marginBottom: 14, alignSelf: "flex-start",
        }}>
          {section.badge}
        </span>
      )}
      <h2 style={{
        fontSize: isMobile ? 24 : 28, fontWeight: 800, color: "#0f172a",
        lineHeight: 1.25, marginBottom: 16, letterSpacing: "-0.2px",
      }}>
        {section.title || "Untitled Section"}
      </h2>

      {/* Per-video description */}
      <div style={{ marginBottom: 20 }}>
        {(currentVideo.description || "").split("\n\n").map((para, pi) => (
          <p key={pi} style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 12 }}>
            {para}
          </p>
        ))}
        {!currentVideo.description && (
          <p style={{ fontSize: 15, color: "#94a3b8", fontStyle: "italic" }}>No description for this video.</p>
        )}
      </div>

    </div>
  );

  return (
    <section style={{
      padding: isMobile ? "56px 20px" : "88px 24px",
      background: isEven ? "#fff" : "#f8fafc",
      borderBottom: "1px solid #f1f5f9",
    }}>
      <div style={{
        maxWidth: 960, margin: "0 auto",
        display: isMobile ? "flex" : "grid",
        flexDirection: isMobile ? "column" : undefined,
        // Flip template so video column is always 260px, text always gets 1fr
        gridTemplateColumns: isMobile ? undefined : isEven ? "260px 1fr" : "1fr 260px",
        gap: isMobile ? 32 : 64,
        alignItems: "flex-start",
      }}>
        {/* Mobile: always video top, text bottom. Desktop: alternate */}
        {isMobile
          ? <>{videoCol}{textCol}</>
          : isEven
            ? <>{videoCol}{textCol}</>
            : <>{textCol}{videoCol}</>
        }
      </div>

      {/* Section progress dots (across all sections) */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 6, marginTop: isMobile ? 32 : 48,
      }}>
        {Array.from({ length: total }).map((_, j) => (
          <div key={j} style={{
            width: j === index ? 20 : 7, height: 7, borderRadius: 999,
            background: j === index ? "#2563eb" : "#e2e8f0",
            transition: "width 0.2s",
          }} />
        ))}
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function WorkshopPage({ content, onBack }) {
  const { workshop = {}, workshopSections = [] } = content;
  const isMobile = useIsMobile();

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* Sticky nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)",
        borderBottom: "1px solid #e2e8f0",
      }}>
        <div style={{
          maxWidth: 1120, margin: "0 auto", padding: "0 24px", height: 64,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontWeight: 800, fontSize: 20, color: "#0f172a" }}>Todd Ponsky</span>
          <button onClick={onBack} style={{
            display: "flex", alignItems: "center", gap: 6, background: "#f1f5f9",
            border: "none", borderRadius: 8, padding: "8px 14px", cursor: "pointer",
            fontSize: 14, fontWeight: 600, color: "#475569",
          }}>
            <ArrowLeft size={15} /> Back to site
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
        padding: isMobile ? "100px 24px 60px" : "120px 24px 80px",
        textAlign: "center",
      }}>
        <span style={{
          display: "inline-block", background: "rgba(96,165,250,0.15)", color: "#93c5fd",
          fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
          padding: "4px 14px", borderRadius: 999, marginBottom: 20,
        }}>
          Workshop
        </span>
        <h1 style={{
          fontSize: isMobile ? 30 : 50, fontWeight: 900, color: "#fff",
          letterSpacing: "-0.5px", lineHeight: 1.15, maxWidth: 680, margin: "0 auto 18px",
        }}>
          {workshop.heading || "AI Workshop"}
        </h1>
        <p style={{
          fontSize: isMobile ? 15 : 18, color: "#94a3b8",
          maxWidth: 520, margin: "0 auto", lineHeight: 1.6,
        }}>
          {workshop.subheading || "A hands-on, section-by-section guide."}
        </p>
        {workshopSections.length > 0 && (
          <p style={{ marginTop: 16, color: "#475569", fontSize: 13 }}>
            {workshopSections.length} {workshopSections.length === 1 ? "section" : "sections"} ·{" "}
            {workshopSections.reduce((acc, s) => acc + (s.videos?.length || 0), 0)} videos
          </p>
        )}
      </div>

      {/* Empty state */}
      {workshopSections.length === 0 && (
        <div style={{ textAlign: "center", padding: "96px 24px" }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>🎬</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>No sections yet</h2>
          <p style={{ fontSize: 15, color: "#64748b", maxWidth: 400, margin: "0 auto" }}>
            Add sections in Admin Panel → AI Workshop to build out this page.
          </p>
        </div>
      )}

      {/* Sections */}
      {workshopSections.map((section, i) => (
        <WorkshopSection
          key={section.id || i}
          section={section}
          index={i}
          total={workshopSections.length}
          isMobile={isMobile}
        />
      ))}

      {/* Footer */}
      {workshopSections.length > 0 && (
        <div style={{ padding: "48px 24px", textAlign: "center" }}>
          <button onClick={onBack} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#f1f5f9", border: "none", borderRadius: 10,
            padding: "12px 24px", cursor: "pointer", fontSize: 15,
            fontWeight: 600, color: "#475569",
          }}>
            <ArrowLeft size={16} /> Back to site
          </button>
        </div>
      )}
    </div>
  );
}
