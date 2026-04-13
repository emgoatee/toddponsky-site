import { useState } from "react";
import { X, Plus, Trash2, Save, RotateCcw, Lock, Eye } from "lucide-react";
import { TOOL_CATEGORIES } from "./data.js";

// ─── Reusable field components ────────────────────────────────────────────────

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  border: "1.5px solid #e5e7eb",
  borderRadius: 8,
  padding: "9px 12px",
  fontSize: 14,
  outline: "none",
  background: "#fff",
  boxSizing: "border-box",
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
  fontFamily: "inherit",
};

function Btn({ onClick, children, variant = "primary", small, style = {} }) {
  const base = { border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 };
  const variants = {
    primary: { background: "#2563eb", color: "#fff" },
    danger: { background: "#fee2e2", color: "#dc2626" },
    ghost: { background: "#f3f4f6", color: "#374151" },
    success: { background: "#dcfce7", color: "#16a34a" },
  };
  return (
    <button onClick={onClick}
      style={{ ...base, ...variants[variant], padding: small ? "6px 12px" : "9px 16px", fontSize: small ? 12 : 14, ...style }}>
      {children}
    </button>
  );
}

// ─── Section editors ──────────────────────────────────────────────────────────

function HeroEditor({ data, onChange }) {
  const set = (key, val) => onChange({ ...data, [key]: val });
  return (
    <div>
      <Field label="Badge text">
        <input style={inputStyle} value={data.badge} onChange={e => set("badge", e.target.value)} />
      </Field>
      <Field label="Main Headline">
        <input style={inputStyle} value={data.headline} onChange={e => set("headline", e.target.value)} />
      </Field>
      <Field label="Sub-headline">
        <textarea style={textareaStyle} rows={3} value={data.subheadline} onChange={e => set("subheadline", e.target.value)} />
      </Field>
      <Field label="Primary CTA button">
        <input style={inputStyle} value={data.ctaPrimary} onChange={e => set("ctaPrimary", e.target.value)} />
      </Field>
      <Field label="Secondary CTA button">
        <input style={inputStyle} value={data.ctaSecondary} onChange={e => set("ctaSecondary", e.target.value)} />
      </Field>
      <Field label="Stats">
        {data.stats.map((stat, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input style={{ ...inputStyle, width: 100 }} placeholder="Number" value={stat.num}
              onChange={e => { const s = [...data.stats]; s[i] = { ...s[i], num: e.target.value }; set("stats", s); }} />
            <input style={inputStyle} placeholder="Label" value={stat.label}
              onChange={e => { const s = [...data.stats]; s[i] = { ...s[i], label: e.target.value }; set("stats", s); }} />
          </div>
        ))}
      </Field>
    </div>
  );
}

function AboutEditor({ data, onChange }) {
  const set = (key, val) => onChange({ ...data, [key]: val });
  return (
    <div>
      <Field label="Section Heading">
        <input style={inputStyle} value={data.heading} onChange={e => set("heading", e.target.value)} />
      </Field>
      <Field label="Bio — Paragraph 1">
        <textarea style={textareaStyle} rows={4} value={data.bio1} onChange={e => set("bio1", e.target.value)} />
      </Field>
      <Field label="Bio — Paragraph 2">
        <textarea style={textareaStyle} rows={4} value={data.bio2} onChange={e => set("bio2", e.target.value)} />
      </Field>
      <Field label="Expertise Tags (one per line)">
        <textarea style={textareaStyle} rows={4}
          value={data.tags.join("\n")}
          onChange={e => set("tags", e.target.value.split("\n").filter(Boolean))} />
      </Field>
      <Field label="Role Cards">
        {data.roles.map((role, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
            <input style={{ ...inputStyle, width: 48 }} placeholder="Icon" value={role.icon}
              onChange={e => { const r = [...data.roles]; r[i] = { ...r[i], icon: e.target.value }; set("roles", r); }} />
            <input style={{ ...inputStyle, flex: 1 }} placeholder="Title" value={role.title}
              onChange={e => { const r = [...data.roles]; r[i] = { ...r[i], title: e.target.value }; set("roles", r); }} />
            <input style={{ ...inputStyle, flex: 2 }} placeholder="Description" value={role.desc}
              onChange={e => { const r = [...data.roles]; r[i] = { ...r[i], desc: e.target.value }; set("roles", r); }} />
          </div>
        ))}
      </Field>
    </div>
  );
}

function ToolsEditor({ tools, onChange }) {
  const [newTool, setNewTool] = useState({ name: "", category: "Writing & Content", description: "", url: "", featured: false });

  const update = (i, key, val) => {
    const updated = [...tools];
    updated[i] = { ...updated[i], [key]: val };
    onChange(updated);
  };
  const remove = (i) => onChange(tools.filter((_, idx) => idx !== i));
  const add = () => {
    if (!newTool.name || !newTool.url) return;
    onChange([...tools, newTool]);
    setNewTool({ name: "", category: "Writing & Content", description: "", url: "", featured: false });
  };

  return (
    <div>
      {/* Add new */}
      <div style={{ background: "#f0f9ff", border: "1.5px solid #bae6fd", borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0369a1", marginBottom: 12 }}>➕ Add New Tool</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
          <input style={inputStyle} placeholder="Tool name *" value={newTool.name} onChange={e => setNewTool({ ...newTool, name: e.target.value })} />
          <select style={inputStyle} value={newTool.category} onChange={e => setNewTool({ ...newTool, category: e.target.value })}>
            {TOOL_CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <input style={{ ...inputStyle, marginBottom: 8 }} placeholder="URL *" value={newTool.url} onChange={e => setNewTool({ ...newTool, url: e.target.value })} />
        <textarea style={{ ...textareaStyle, marginBottom: 8 }} rows={2} placeholder="Description" value={newTool.description} onChange={e => setNewTool({ ...newTool, description: e.target.value })} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
            <input type="checkbox" checked={newTool.featured} onChange={e => setNewTool({ ...newTool, featured: e.target.checked })} />
            Featured (show ⭐ badge)
          </label>
          <Btn onClick={add} small><Plus size={14} /> Add Tool</Btn>
        </div>
      </div>

      {/* Existing tools */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {tools.map((tool, i) => (
          <div key={i} style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 10, padding: 14 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input style={{ ...inputStyle, flex: 2 }} value={tool.name} placeholder="Name"
                onChange={e => update(i, "name", e.target.value)} />
              <select style={{ ...inputStyle, flex: 2 }} value={tool.category}
                onChange={e => update(i, "category", e.target.value)}>
                {TOOL_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <Btn variant="danger" small onClick={() => remove(i)}><Trash2 size={13} /></Btn>
            </div>
            <input style={{ ...inputStyle, marginBottom: 8 }} value={tool.url} placeholder="URL"
              onChange={e => update(i, "url", e.target.value)} />
            <textarea style={{ ...textareaStyle, marginBottom: 8 }} rows={2} value={tool.description} placeholder="Description"
              onChange={e => update(i, "description", e.target.value)} />
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
              <input type="checkbox" checked={tool.featured}
                onChange={e => update(i, "featured", e.target.checked)} />
              Featured
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlaylistsEditor({ playlists, onChange }) {
  const updatePlaylist = (pi, key, val) => {
    const updated = [...playlists];
    updated[pi] = { ...updated[pi], [key]: val };
    onChange(updated);
  };
  const updateVideo = (pi, vi, key, val) => {
    const updated = [...playlists];
    const videos = [...updated[pi].videos];
    videos[vi] = { ...videos[vi], [key]: val };
    updated[pi] = { ...updated[pi], videos };
    onChange(updated);
  };
  const addVideo = (pi) => {
    const updated = [...playlists];
    updated[pi].videos = [...updated[pi].videos, { ytId: "", title: "", duration: "" }];
    onChange(updated);
  };
  const removeVideo = (pi, vi) => {
    const updated = [...playlists];
    updated[pi].videos = updated[pi].videos.filter((_, idx) => idx !== vi);
    onChange(updated);
  };

  return (
    <div>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
        For YouTube IDs: open a video, copy the part after <code>?v=</code> in the URL (e.g. <code>dQw4w9WgXcQ</code>).
      </p>
      {playlists.map((pl, pi) => (
        <div key={pi} style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input style={{ ...inputStyle, width: 48 }} value={pl.icon} onChange={e => updatePlaylist(pi, "icon", e.target.value)} placeholder="Icon" />
            <input style={{ ...inputStyle, flex: 1 }} value={pl.title} onChange={e => updatePlaylist(pi, "title", e.target.value)} placeholder="Playlist title" />
          </div>
          <textarea style={{ ...textareaStyle, marginBottom: 12 }} rows={2} value={pl.description}
            onChange={e => updatePlaylist(pi, "description", e.target.value)} placeholder="Playlist description" />
          <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Videos</div>
          {pl.videos.map((v, vi) => (
            <div key={vi} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
              <input style={{ ...inputStyle, width: 120 }} value={v.ytId} placeholder="YouTube ID" onChange={e => updateVideo(pi, vi, "ytId", e.target.value)} />
              <input style={{ ...inputStyle, flex: 3 }} value={v.title} placeholder="Video title" onChange={e => updateVideo(pi, vi, "title", e.target.value)} />
              <input style={{ ...inputStyle, width: 72 }} value={v.duration} placeholder="0:00" onChange={e => updateVideo(pi, vi, "duration", e.target.value)} />
              <Btn variant="danger" small onClick={() => removeVideo(pi, vi)}><Trash2 size={13} /></Btn>
            </div>
          ))}
          <Btn variant="ghost" small onClick={() => addVideo(pi)}><Plus size={13} /> Add Video</Btn>
        </div>
      ))}
    </div>
  );
}

function ServicesEditor({ services, onChange }) {
  const update = (i, key, val) => {
    const updated = [...services];
    updated[i] = { ...updated[i], [key]: val };
    onChange(updated);
  };
  const updateFeature = (si, fi, val) => {
    const updated = [...services];
    const features = [...updated[si].features];
    features[fi] = val;
    updated[si] = { ...updated[si], features };
    onChange(updated);
  };
  const addFeature = (si) => {
    const updated = [...services];
    updated[si].features = [...updated[si].features, ""];
    onChange(updated);
  };
  const removeFeature = (si, fi) => {
    const updated = [...services];
    updated[si].features = updated[si].features.filter((_, idx) => idx !== fi);
    onChange(updated);
  };

  return (
    <div>
      {services.map((service, si) => (
        <div key={si} style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <input style={{ ...inputStyle, width: 52 }} value={service.icon} onChange={e => update(si, "icon", e.target.value)} placeholder="Icon" />
            <input style={{ ...inputStyle, flex: 1 }} value={service.title} onChange={e => update(si, "title", e.target.value)} placeholder="Service title" />
          </div>
          <textarea style={{ ...textareaStyle, marginBottom: 10 }} rows={3} value={service.description}
            onChange={e => update(si, "description", e.target.value)} />
          <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Features</div>
          {service.features.map((f, fi) => (
            <div key={fi} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
              <input style={inputStyle} value={f} onChange={e => updateFeature(si, fi, e.target.value)} placeholder="Feature" />
              <Btn variant="danger" small onClick={() => removeFeature(si, fi)}><Trash2 size={13} /></Btn>
            </div>
          ))}
          <Btn variant="ghost" small onClick={() => addFeature(si)} style={{ marginBottom: 12 }}><Plus size={13} /> Add Feature</Btn>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>BUTTON TEXT</label>
            <input style={inputStyle} value={service.cta} onChange={e => update(si, "cta", e.target.value)} placeholder="CTA button text" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SettingsEditor({ content, onChange }) {
  return (
    <div>
      <Field label="YouTube Channel URL">
        <input style={inputStyle} value={content.youtubeChannelUrl}
          onChange={e => onChange({ ...content, youtubeChannelUrl: e.target.value })} />
      </Field>
      <Field label="Contact Email">
        <input style={inputStyle} type="email" value={content.contactEmail}
          onChange={e => onChange({ ...content, contactEmail: e.target.value })} />
      </Field>
      <Field label="Admin Password">
        <input style={inputStyle} type="text" value={content.adminPassword}
          onChange={e => onChange({ ...content, adminPassword: e.target.value })} />
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
          ⚠ Change this before going live. This protects the /admin panel.
        </p>
      </Field>
    </div>
  );
}

// ─── Password gate ────────────────────────────────────────────────────────────

function PasswordGate({ correctPassword, onSuccess }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  const attempt = () => {
    if (pw === correctPassword) {
      onSuccess();
    } else {
      setError(true);
      setPw("");
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#1e293b", borderRadius: 20, padding: 40, width: "100%", maxWidth: 380, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}><Lock size={40} color="#60a5fa" /></div>
        <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Admin Panel</h2>
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>Enter your password to continue</p>
        <input type="password" value={pw} onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === "Enter" && attempt()}
          placeholder="Password"
          style={{ ...inputStyle, marginBottom: 12, textAlign: "center", background: "#0f172a", border: "1.5px solid #334155", color: "#fff", borderColor: error ? "#ef4444" : "#334155" }} />
        {error && <p style={{ color: "#f87171", fontSize: 13, marginBottom: 10 }}>Incorrect password. Try again.</p>}
        <button onClick={attempt}
          style={{ width: "100%", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "11px 0", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
          Enter Admin
        </button>
      </div>
    </div>
  );
}

// ─── Main Admin Panel ─────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "hero", label: "🏠 Hero" },
  { id: "about", label: "👤 About" },
  { id: "tools", label: "🛠 AI Tools" },
  { id: "playlists", label: "▶ Playlists" },
  { id: "services", label: "💼 Services" },
  { id: "settings", label: "⚙ Settings" },
];

export default function AdminPanel({ content, updateContent, resetContent, onClose }) {
  const [authed, setAuthed] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [saved, setSaved] = useState(false);

  if (!authed) {
    return <PasswordGate correctPassword={content.adminPassword} onSuccess={() => setAuthed(true)} />;
  }

  const handleSave = () => {
    updateContent(content); // already saved via useContent on every change, but give visual feedback
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm("Reset ALL content to defaults? This cannot be undone.")) {
      resetContent();
    }
  };

  const setSection = (field, val) => updateContent(prev => ({ ...prev, [field]: val }));

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* Admin header */}
      <div style={{ background: "#0f172a", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>⚙ Todd Ponsky — Admin</span>
          <span style={{ background: "#1e293b", color: "#60a5fa", fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 999 }}>
            Changes auto-save
          </span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {saved && <span style={{ color: "#4ade80", fontSize: 13, fontWeight: 600 }}>✓ Saved!</span>}
          <Btn variant="ghost" small onClick={handleSave}><Save size={14} /> Save</Btn>
          <Btn variant="ghost" small onClick={handleReset}><RotateCcw size={14} /> Reset</Btn>
          <a href="/" target="_blank" rel="noopener noreferrer">
            <Btn variant="ghost" small><Eye size={14} /> View Site</Btn>
          </a>
          <Btn variant="danger" small onClick={onClose}><X size={14} /> Exit Admin</Btn>
        </div>
      </div>

      {/* Layout */}
      <div className="admin-layout" style={{ display: "flex", minHeight: "calc(100vh - 60px)" }}>
        {/* Sidebar */}
        <aside className="admin-sidebar" style={{ background: "#1e293b", padding: 16 }}>
          {SECTIONS.map((s) => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              style={{
                display: "block", width: "100%", textAlign: "left", background: activeSection === s.id ? "#2563eb" : "transparent",
                color: activeSection === s.id ? "#fff" : "#94a3b8", border: "none", borderRadius: 8, padding: "10px 14px",
                fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 4,
              }}>
              {s.label}
            </button>
          ))}
        </aside>

        {/* Content area */}
        <main style={{ flex: 1, padding: 32, overflowY: "auto", maxWidth: 780 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 24 }}>
            {SECTIONS.find(s => s.id === activeSection)?.label}
          </h2>

          {activeSection === "hero" && (
            <HeroEditor data={content.hero} onChange={val => setSection("hero", val)} />
          )}
          {activeSection === "about" && (
            <AboutEditor data={content.about} onChange={val => setSection("about", val)} />
          )}
          {activeSection === "tools" && (
            <ToolsEditor tools={content.tools} onChange={val => setSection("tools", val)} />
          )}
          {activeSection === "playlists" && (
            <PlaylistsEditor playlists={content.playlists} onChange={val => setSection("playlists", val)} />
          )}
          {activeSection === "services" && (
            <ServicesEditor services={content.services} onChange={val => setSection("services", val)} />
          )}
          {activeSection === "settings" && (
            <SettingsEditor content={content} onChange={updateContent} />
          )}
        </main>
      </div>
    </div>
  );
}
