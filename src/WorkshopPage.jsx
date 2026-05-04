import { useState, useEffect } from "react";
import { ArrowLeft, Play } from "lucide-react";

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

// ─── YouTube embed ────────────────────────────────────────────────────────────
function YouTubeEmbed({ ytId }) {
  const [clicked, setClicked] = useState(false);

  if (!ytId || ytId === "REPLACE_ME") {
    return (
      <div style={{
        width: "100%", aspectRatio: "16/9", background: "#1e293b", borderRadius: 16,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        color: "#64748b", fontSize: 14, gap: 10,
      }}>
        <Play size={36} color="#334155" />
        <span>No video ID set yet</span>
      </div>
    );
  }

  const thumb = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;

  if (!clicked) {
    return (
      <div
        onClick={() => setClicked(true)}
        style={{
          width: "100%", aspectRatio: "16/9", borderRadius: 16, overflow: "hidden",
          position: "relative", cursor: "pointer", background: "#0f172a",
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        }}
      >
        <img
          src={thumb}
          alt="Video thumbnail"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          onError={e => { e.target.style.display = "none"; }}
        />
        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)" }} />
        {/* Play button */}
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: 72, height: 72, background: "rgba(220,38,38,0.92)", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 24px rgba(220,38,38,0.5)",
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translate(-50%,-50%) scale(1.08)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translate(-50%,-50%) scale(1)"; }}
        >
          <Play size={28} color="#fff" fill="#fff" style={{ marginLeft: 4 }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", aspectRatio: "16/9", borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}>
      <iframe
        src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
        title="Workshop video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ width: "100%", height: "100%", border: "none", display: "block" }}
      />
    </div>
  );
}

// ─── Section text block ───────────────────────────────────────────────────────
function SectionText({ section }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
      {section.badge && (
        <span style={{
          display: "inline-block", background: "#eff6ff", color: "#2563eb",
          fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
          padding: "4px 12px", borderRadius: 999, marginBottom: 16, alignSelf: "flex-start",
        }}>
          {section.badge}
        </span>
      )}
      <h2 style={{
        fontSize: 30, fontWeight: 800, color: "#0f172a", lineHeight: 1.25,
        marginBottom: 18, letterSpacing: "-0.3px",
      }}>
        {section.title || "Untitled Section"}
      </h2>
      <div>
        {(section.description || "").split("\n\n").map((para, i) => (
          <p key={i} style={{
            fontSize: 16, color: "#475569", lineHeight: 1.8,
            marginBottom: 14,
          }}>
            {para}
          </p>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
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
          <span style={{ fontWeight: 800, fontSize: 20, color: "#0f172a" }}>
            Todd Ponsky
          </span>
          <button
            onClick={onBack}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "#f1f5f9", border: "none", borderRadius: 8,
              padding: "8px 14px", cursor: "pointer", fontSize: 14,
              fontWeight: 600, color: "#475569",
            }}
          >
            <ArrowLeft size={15} /> Back to site
          </button>
        </div>
      </nav>

      {/* Hero header */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
        padding: isMobile ? "100px 24px 60px" : "120px 24px 80px",
        textAlign: "center",
      }}>
        <span style={{
          display: "inline-block", background: "rgba(96,165,250,0.15)", color: "#93c5fd",
          fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
          padding: "4px 14px", borderRadius: 999, marginBottom: 20,
        }}>
          Workshop
        </span>
        <h1 style={{
          fontSize: isMobile ? 32 : 52, fontWeight: 900, color: "#fff",
          letterSpacing: "-0.5px", lineHeight: 1.15, marginBottom: 20,
          maxWidth: 700, margin: "0 auto 20px",
        }}>
          {workshop.heading || "AI Workshop"}
        </h1>
        <p style={{
          fontSize: isMobile ? 16 : 19, color: "#94a3b8",
          maxWidth: 560, margin: "0 auto",
          lineHeight: 1.6,
        }}>
          {workshop.subheading || "A hands-on, section-by-section guide."}
        </p>
        {workshopSections.length > 0 && (
          <div style={{ marginTop: 20, color: "#64748b", fontSize: 14 }}>
            {workshopSections.length} {workshopSections.length === 1 ? "section" : "sections"}
          </div>
        )}
      </div>

      {/* Empty state */}
      {workshopSections.length === 0 && (
        <div style={{ textAlign: "center", padding: "96px 24px" }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>🎬</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>
            No sections yet
          </h2>
          <p style={{ fontSize: 15, color: "#64748b", maxWidth: 400, margin: "0 auto" }}>
            Add workshop sections in the Admin Panel → Workshop tab to build out this page.
          </p>
        </div>
      )}

      {/* Workshop sections — alternating layout */}
      {workshopSections.map((section, i) => {
        const isEven = i % 2 === 0; // even = video left, odd = video right
        const videoEl = <YouTubeEmbed key="video" ytId={section.ytId} />;
        const textEl = <SectionText key="text" section={section} />;

        return (
          <section
            key={section.id || i}
            style={{
              padding: isMobile ? "60px 24px" : "96px 24px",
              background: isEven ? "#fff" : "#f8fafc",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <div style={{
              maxWidth: 1120, margin: "0 auto",
              display: isMobile ? "flex" : "grid",
              flexDirection: isMobile ? "column" : undefined,
              gridTemplateColumns: isMobile ? undefined : "1fr 1fr",
              gap: isMobile ? 36 : 72,
              alignItems: "center",
            }}>
              {/* On mobile always: video first, text second */}
              {isMobile
                ? [videoEl, textEl]
                : isEven
                  ? [videoEl, textEl]   // video left, text right
                  : [textEl, videoEl]   // text left, video right
              }
            </div>

            {/* Section number indicator */}
            <div style={{
              textAlign: "center", marginTop: isMobile ? 28 : 40,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              {workshopSections.map((_, j) => (
                <div key={j} style={{
                  width: j === i ? 24 : 8, height: 8, borderRadius: 999,
                  background: j === i ? "#2563eb" : "#e2e8f0",
                  transition: "width 0.2s",
                }} />
              ))}
            </div>
          </section>
        );
      })}

      {/* Footer buffer */}
      {workshopSections.length > 0 && (
        <div style={{ padding: "48px 24px", textAlign: "center" }}>
          <button
            onClick={onBack}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#f1f5f9", border: "none", borderRadius: 10,
              padding: "12px 24px", cursor: "pointer", fontSize: 15,
              fontWeight: 600, color: "#475569",
            }}
          >
            <ArrowLeft size={16} /> Back to site
          </button>
        </div>
      )}
    </div>
  );
}
