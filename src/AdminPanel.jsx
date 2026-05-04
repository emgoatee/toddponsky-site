import { useState } from "react";
import {
  X, Plus, Trash2, Save, RotateCcw, Lock, Eye, EyeOff,
  ChevronUp, ChevronDown, Settings, FileText, Layout, Video,
} from "lucide-react";
import { TOOL_CATEGORIES } from "./data.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputStyle = {
  width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8,
  padding: "9px 12px", fontSize: 14, outline: "none", background: "#fff",
  boxSizing: "border-box",
};
const textareaStyle = { ...inputStyle, resize: "vertical", fontFamily: "inherit" };

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#374151", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.07em" }}>
        {label}
      </label>
      {children}
      {hint && <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>{hint}</p>}
    </div>
  );
}

function Btn({ onClick, children, variant = "primary", small, full, style: extra = {}, type = "button" }) {
  const pad = small ? "5px 11px" : "9px 16px";
  const fs = small ? 12 : 14;
  const styles = {
    primary:  { background: "#2563eb", color: "#fff" },
    danger:   { background: "#fee2e2", color: "#dc2626" },
    ghost:    { background: "#f3f4f6", color: "#374151" },
    success:  { background: "#dcfce7", color: "#16a34a" },
    dark:     { background: "#1e293b", color: "#e2e8f0" },
  };
  return (
    <button type={type} onClick={onClick}
      style={{ border: "none", borderRadius: 7, cursor: "pointer", fontWeight: 600,
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: pad, fontSize: fs, width: full ? "100%" : undefined,
        justifyContent: full ? "center" : undefined,
        ...styles[variant], ...extra }}>
      {children}
    </button>
  );
}

function Card({ children, style: extra = {} }) {
  return (
    <div style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 12, padding: 16, marginBottom: 14, ...extra }}>
      {children}
    </div>
  );
}

function SectionHeader({ title, onDelete, onMoveUp, onMoveDown, canUp, canDown, deleteLabel = "Delete" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
      <span style={{ fontWeight: 700, fontSize: 14, color: "#111827", flex: 1 }}>{title}</span>
      {onMoveUp  && <Btn variant="ghost" small onClick={onMoveUp}  disabled={!canUp}><ChevronUp size={13} /></Btn>}
      {onMoveDown && <Btn variant="ghost" small onClick={onMoveDown} disabled={!canDown}><ChevronDown size={13} /></Btn>}
      {onDelete  && <Btn variant="danger" small onClick={onDelete}><Trash2 size={13} /> {deleteLabel}</Btn>}
    </div>
  );
}

// ─── Section editors ──────────────────────────────────────────────────────────

function HeroEditor({ data, onChange }) {
  const set = (k, v) => onChange({ ...data, [k]: v });
  return (
    <>
      <Field label="Badge text"><input style={inputStyle} value={data.badge} onChange={e => set("badge", e.target.value)} /></Field>
      <Field label="Main headline"><input style={inputStyle} value={data.headline} onChange={e => set("headline", e.target.value)} /></Field>
      <Field label="Headline accent" hint='Shown in blue after the main headline. Default: "for Everyone."'>
        <input style={inputStyle} placeholder="for Everyone." value={data.headlineAccent || ""} onChange={e => set("headlineAccent", e.target.value)} />
      </Field>
      <Field label="Sub-headline"><textarea style={textareaStyle} rows={3} value={data.subheadline} onChange={e => set("subheadline", e.target.value)} /></Field>
      <Field label="Primary CTA button"><input style={inputStyle} value={data.ctaPrimary} onChange={e => set("ctaPrimary", e.target.value)} /></Field>
      <Field label="Newsletter button label" hint="The orange button. Default: Subscribe to Newsletter">
        <input style={inputStyle} placeholder="Subscribe to Newsletter" value={data.newsletterLabel || ""} onChange={e => set("newsletterLabel", e.target.value)} />
      </Field>
      <Field label="Secondary CTA button"><input style={inputStyle} value={data.ctaSecondary} onChange={e => set("ctaSecondary", e.target.value)} /></Field>

      {/* ── 3-Step Cards ── */}
      <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1.5px solid #e5e7eb" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.07em" }}>3-Step Cards</div>

        <Field label="Section label" hint='Appears above the cards. Default: "Get started in 3 steps"'>
          <input style={inputStyle} placeholder="Get started in 3 steps" value={data.stepsLabel || ""} onChange={e => set("stepsLabel", e.target.value)} />
        </Field>

        {/* Step 1 */}
        <div style={{ background: "#f0f9ff", border: "1.5px solid #bae6fd", borderRadius: 12, padding: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#0369a1", marginBottom: 12 }}>Step 1</div>
          <Field label="Title"><input style={inputStyle} placeholder="Stay in the loop" value={data.step1Title || ""} onChange={e => set("step1Title", e.target.value)} /></Field>
          <Field label="Description"><textarea style={textareaStyle} rows={2} placeholder="Weekly newsletters on Substack…" value={data.step1Desc || ""} onChange={e => set("step1Desc", e.target.value)} /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Field label="Button 1 label"><input style={inputStyle} placeholder="Substack" value={data.step1Btn1 || ""} onChange={e => set("step1Btn1", e.target.value)} /></Field>
            <Field label="Button 1 URL"><input style={inputStyle} placeholder="https://substack.com/@…" value={data.step1Btn1Url || ""} onChange={e => set("step1Btn1Url", e.target.value)} /></Field>
            <Field label="Button 2 label"><input style={inputStyle} placeholder="LinkedIn" value={data.step1Btn2 || ""} onChange={e => set("step1Btn2", e.target.value)} /></Field>
            <Field label="Button 2 URL"><input style={inputStyle} placeholder="https://linkedin.com/in/…" value={data.step1Btn2Url || ""} onChange={e => set("step1Btn2Url", e.target.value)} /></Field>
          </div>
        </div>

        {/* Step 2 */}
        <div style={{ background: "#f0f9ff", border: "1.5px solid #bae6fd", borderRadius: 12, padding: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#0369a1", marginBottom: 12 }}>Step 2</div>
          <Field label="Title"><input style={inputStyle} placeholder="Browse free resources" value={data.step2Title || ""} onChange={e => set("step2Title", e.target.value)} /></Field>
          <Field label="Description"><textarea style={textareaStyle} rows={2} placeholder="Tutorials, AI tool guides…" value={data.step2Desc || ""} onChange={e => set("step2Desc", e.target.value)} /></Field>
          <Field label="Button label" hint="Links to the Learn section">
            <input style={inputStyle} placeholder="Browse Library" value={data.step2Btn || ""} onChange={e => set("step2Btn", e.target.value)} />
          </Field>
        </div>

        {/* Step 3 */}
        <div style={{ background: "#f0f9ff", border: "1.5px solid #bae6fd", borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#0369a1", marginBottom: 12 }}>Step 3</div>
          <Field label="Title"><input style={inputStyle} placeholder="Work together" value={data.step3Title || ""} onChange={e => set("step3Title", e.target.value)} /></Field>
          <Field label="Description"><textarea style={textareaStyle} rows={2} placeholder="Workshops, 1:1 coaching…" value={data.step3Desc || ""} onChange={e => set("step3Desc", e.target.value)} /></Field>
          <Field label="Button label" hint="Links to the Contact section">
            <input style={inputStyle} placeholder="Contact Todd" value={data.step3Btn || ""} onChange={e => set("step3Btn", e.target.value)} />
          </Field>
        </div>
      </div>
    </>
  );
}

function AboutEditor({ data, onChange }) {
  const set = (k, v) => onChange({ ...data, [k]: v });
  const setRole = (i, k, v) => { const r = [...data.roles]; r[i] = { ...r[i], [k]: v }; set("roles", r); };
  const addRole = () => set("roles", [...data.roles, { icon: "✨", title: "New Role", desc: "" }]);
  const removeRole = (i) => set("roles", data.roles.filter((_, idx) => idx !== i));
  return (
    <>
      {/* Photo */}
      <div style={{ background: "#f0f9ff", border: "1.5px solid #bae6fd", borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#0369a1", marginBottom: 12 }}>📸 Profile Photo</div>
        <Field label="Photo URL" hint="Paste a direct image link (e.g. from your site's /public folder, Imgur, or any CDN). The image will appear in the About section.">
          <input style={inputStyle} placeholder="https://yoursite.com/todd.png"
            value={data.photoUrl || ""}
            onChange={e => set("photoUrl", e.target.value)} />
        </Field>
        {data.photoUrl && (
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 12 }}>
            <img src={data.photoUrl} alt="Preview"
              style={{ width: 72, height: 72, objectFit: "cover", borderRadius: "50%", border: "2px solid #bae6fd" }}
              onError={e => { e.target.style.display = "none"; }} />
            <span style={{ fontSize: 12, color: "#0369a1" }}>Preview (may not load if URL needs auth)</span>
          </div>
        )}
      </div>

      <Field label="Section heading"><input style={inputStyle} value={data.heading} onChange={e => set("heading", e.target.value)} /></Field>
      <Field label="Bio — paragraph 1"><textarea style={textareaStyle} rows={4} value={data.bio1} onChange={e => set("bio1", e.target.value)} /></Field>
      <Field label="Bio — paragraph 2"><textarea style={textareaStyle} rows={4} value={data.bio2} onChange={e => set("bio2", e.target.value)} /></Field>
      <Field label="Expertise tags" hint="One tag per line">
        <textarea style={textareaStyle} rows={5} value={data.tags.join("\n")}
          onChange={e => set("tags", e.target.value.split("\n").filter(Boolean))} />
      </Field>
      <Field label="Role cards">
        {data.roles.map((role, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
            <input style={{ ...inputStyle, width: 48 }} value={role.icon} onChange={e => setRole(i, "icon", e.target.value)} />
            <input style={{ ...inputStyle, flex: 1 }} placeholder="Title" value={role.title} onChange={e => setRole(i, "title", e.target.value)} />
            <input style={{ ...inputStyle, flex: 2 }} placeholder="Description" value={role.desc} onChange={e => setRole(i, "desc", e.target.value)} />
            <Btn variant="danger" small onClick={() => removeRole(i)}><Trash2 size={13} /></Btn>
          </div>
        ))}
        <Btn variant="ghost" small onClick={addRole}><Plus size={13} /> Add Role Card</Btn>
      </Field>
    </>
  );
}

function ToolsEditor({ tools, onChange }) {
  const blank = { name: "", category: "Writing & Content", description: "", url: "", featured: false };
  const [draft, setDraft] = useState(blank);

  const update = (i, k, v) => { const t = [...tools]; t[i] = { ...t[i], [k]: v }; onChange(t); };
  const remove = (i) => onChange(tools.filter((_, idx) => idx !== i));
  const move = (i, dir) => {
    const t = [...tools]; const sw = i + dir;
    if (sw < 0 || sw >= t.length) return;
    [t[i], t[sw]] = [t[sw], t[i]]; onChange(t);
  };
  const add = () => {
    if (!draft.name.trim() || !draft.url.trim()) return;
    onChange([...tools, draft]);
    setDraft(blank);
  };

  return (
    <>
      {/* Add new */}
      <div style={{ background: "#f0f9ff", border: "1.5px solid #bae6fd", borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#0369a1", marginBottom: 10 }}>➕ Add New Tool</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
          <input style={inputStyle} placeholder="Tool name *" value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} />
          <select style={inputStyle} value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value })}>
            {TOOL_CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <input style={{ ...inputStyle, marginBottom: 8 }} placeholder="URL *" value={draft.url} onChange={e => setDraft({ ...draft, url: e.target.value })} />
        <textarea style={{ ...textareaStyle, marginBottom: 8 }} rows={2} placeholder="Description" value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
            <input type="checkbox" checked={draft.featured} onChange={e => setDraft({ ...draft, featured: e.target.checked })} />
            Featured (⭐ badge)
          </label>
          <Btn onClick={add} small><Plus size={13} /> Add Tool</Btn>
        </div>
      </div>

      {tools.map((tool, i) => (
        <Card key={i}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input style={{ ...inputStyle, flex: 2 }} value={tool.name} placeholder="Name" onChange={e => update(i, "name", e.target.value)} />
            <select style={{ ...inputStyle, flex: 2 }} value={tool.category} onChange={e => update(i, "category", e.target.value)}>
              {TOOL_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <Btn variant="ghost" small onClick={() => move(i, -1)} disabled={i === 0}><ChevronUp size={13} /></Btn>
            <Btn variant="ghost" small onClick={() => move(i, 1)} disabled={i === tools.length - 1}><ChevronDown size={13} /></Btn>
            <Btn variant="danger" small onClick={() => remove(i)}><Trash2 size={13} /></Btn>
          </div>
          <input style={{ ...inputStyle, marginBottom: 8 }} value={tool.url} placeholder="URL" onChange={e => update(i, "url", e.target.value)} />
          <textarea style={{ ...textareaStyle, marginBottom: 8 }} rows={2} value={tool.description} placeholder="Description" onChange={e => update(i, "description", e.target.value)} />
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
            <input type="checkbox" checked={tool.featured} onChange={e => update(i, "featured", e.target.checked)} />
            Featured
          </label>
        </Card>
      ))}
    </>
  );
}

function PlaylistsEditor({ playlists, onChange }) {
  const blank = { id: `pl_${Date.now()}`, title: "New Playlist", icon: "📋", description: "", videos: [] };

  const addPlaylist = () => onChange([...playlists, { ...blank, id: `pl_${Date.now()}` }]);
  const removePlaylist = (pi) => { if (window.confirm("Delete this entire playlist?")) onChange(playlists.filter((_, i) => i !== pi)); };
  const movePlaylist = (pi, dir) => {
    const updated = [...playlists];
    const swapWith = pi + dir;
    if (swapWith < 0 || swapWith >= updated.length) return;
    [updated[pi], updated[swapWith]] = [updated[swapWith], updated[pi]];
    onChange(updated);
  };
  const updatePl = (pi, k, v) => { const u = [...playlists]; u[pi] = { ...u[pi], [k]: v }; onChange(u); };
  const updateVideo = (pi, vi, k, v) => {
    const u = [...playlists]; const videos = [...u[pi].videos]; videos[vi] = { ...videos[vi], [k]: v };
    u[pi] = { ...u[pi], videos }; onChange(u);
  };
  const addVideo = (pi) => {
    const u = [...playlists]; u[pi].videos = [...u[pi].videos, { ytId: "", title: "", duration: "" }]; onChange(u);
  };
  const removeVideo = (pi, vi) => {
    const u = [...playlists]; u[pi].videos = u[pi].videos.filter((_, i) => i !== vi); onChange(u);
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Btn onClick={addPlaylist}><Plus size={14} /> New Playlist</Btn>
      </div>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
        YouTube ID = the part after <code style={{ background: "#f3f4f6", padding: "1px 5px", borderRadius: 4 }}>?v=</code> in any YouTube URL.
      </p>

      {playlists.map((pl, pi) => (
        <Card key={pl.id} style={{ borderColor: "#d1d5db" }}>
          <SectionHeader
            title={pl.icon + " " + pl.title}
            onDelete={() => removePlaylist(pi)}
            onMoveUp={() => movePlaylist(pi, -1)}
            onMoveDown={() => movePlaylist(pi, 1)}
            canUp={pi > 0} canDown={pi < playlists.length - 1}
            deleteLabel="Delete Playlist"
          />
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <input style={{ ...inputStyle, width: 52 }} value={pl.icon} placeholder="Icon" onChange={e => updatePl(pi, "icon", e.target.value)} />
            <input style={inputStyle} value={pl.title} placeholder="Playlist title" onChange={e => updatePl(pi, "title", e.target.value)} />
          </div>
          <textarea style={{ ...textareaStyle, marginBottom: 12 }} rows={2} value={pl.description} placeholder="Playlist description" onChange={e => updatePl(pi, "description", e.target.value)} />

          <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.07em" }}>
            Videos ({pl.videos.length})
          </div>
          {pl.videos.map((v, vi) => (
            <div key={vi} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
              <input style={{ ...inputStyle, width: 115 }} value={v.ytId} placeholder="YouTube ID" onChange={e => updateVideo(pi, vi, "ytId", e.target.value)} />
              <input style={{ ...inputStyle, flex: 3 }} value={v.title} placeholder="Title" onChange={e => updateVideo(pi, vi, "title", e.target.value)} />
              <input style={{ ...inputStyle, width: 68 }} value={v.duration} placeholder="0:00" onChange={e => updateVideo(pi, vi, "duration", e.target.value)} />
              <Btn variant="danger" small onClick={() => removeVideo(pi, vi)}><Trash2 size={13} /></Btn>
            </div>
          ))}
          <Btn variant="ghost" small onClick={() => addVideo(pi)}><Plus size={13} /> Add Video</Btn>
        </Card>
      ))}
    </>
  );
}

function ServicesEditor({ services, onChange }) {
  const blank = { icon: "✨", title: "New Service", description: "", features: [""], cta: "Get Started" };
  const addService = () => onChange([...services, blank]);
  const removeService = (i) => { if (window.confirm("Delete this service?")) onChange(services.filter((_, idx) => idx !== i)); };
  const moveService = (i, dir) => {
    const u = [...services]; const sw = i + dir;
    if (sw < 0 || sw >= u.length) return;
    [u[i], u[sw]] = [u[sw], u[i]]; onChange(u);
  };
  const update = (i, k, v) => { const u = [...services]; u[i] = { ...u[i], [k]: v }; onChange(u); };
  const updateFeature = (si, fi, v) => { const u = [...services]; u[si].features[fi] = v; onChange(u); };
  const addFeature = (si) => { const u = [...services]; u[si].features = [...u[si].features, ""]; onChange(u); };
  const removeFeature = (si, fi) => { const u = [...services]; u[si].features = u[si].features.filter((_, i) => i !== fi); onChange(u); };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Btn onClick={addService}><Plus size={14} /> New Service</Btn>
      </div>

      {services.map((svc, si) => (
        <Card key={si}>
          <SectionHeader
            title={svc.icon + " " + svc.title}
            onDelete={() => removeService(si)}
            onMoveUp={() => moveService(si, -1)}
            onMoveDown={() => moveService(si, 1)}
            canUp={si > 0} canDown={si < services.length - 1}
            deleteLabel="Delete Service"
          />
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <input style={{ ...inputStyle, width: 52 }} value={svc.icon} onChange={e => update(si, "icon", e.target.value)} />
            <input style={inputStyle} value={svc.title} onChange={e => update(si, "title", e.target.value)} placeholder="Title" />
          </div>
          <textarea style={{ ...textareaStyle, marginBottom: 10 }} rows={3} value={svc.description} placeholder="Description" onChange={e => update(si, "description", e.target.value)} />
          <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.07em" }}>Features</div>
          {svc.features.map((f, fi) => (
            <div key={fi} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
              <input style={inputStyle} value={f} onChange={e => updateFeature(si, fi, e.target.value)} placeholder="Feature bullet" />
              <Btn variant="danger" small onClick={() => removeFeature(si, fi)}><Trash2 size={13} /></Btn>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            <Btn variant="ghost" small onClick={() => addFeature(si)}><Plus size={13} /> Add Feature</Btn>
          </div>
          <div style={{ marginTop: 12 }}>
            <Field label="Button text">
              <input style={inputStyle} value={svc.cta} onChange={e => update(si, "cta", e.target.value)} />
            </Field>
          </div>
        </Card>
      ))}
    </>
  );
}

// ─── Workshop Editor ──────────────────────────────────────────────────────────

function WorkshopEditor({ workshop, sections, onWorkshopChange, onSectionsChange }) {
  const setMeta = (k, v) => onWorkshopChange({ ...workshop, [k]: v });
  const blankSection = () => ({
    id: `ws_${Date.now()}`,
    badge: "",
    title: "",
    videos: [{ ytId: "", description: "" }],
  });
  const blankVideo = () => ({ ytId: "", description: "" });

  const addSection = () => onSectionsChange([...sections, blankSection()]);
  const removeSection = (i) => { if (window.confirm("Delete this section?")) onSectionsChange(sections.filter((_, idx) => idx !== i)); };
  const moveSection = (i, dir) => {
    const u = [...sections]; const sw = i + dir;
    if (sw < 0 || sw >= u.length) return;
    [u[i], u[sw]] = [u[sw], u[i]]; onSectionsChange(u);
  };
  const updateSection = (i, k, v) => { const u = [...sections]; u[i] = { ...u[i], [k]: v }; onSectionsChange(u); };

  // Video helpers
  const addVideo = (si) => {
    const u = [...sections];
    u[si] = { ...u[si], videos: [...(u[si].videos || []), blankVideo()] };
    onSectionsChange(u);
  };
  const removeVideo = (si, vi) => {
    if ((sections[si].videos || []).length <= 1) return; // keep at least 1
    const u = [...sections];
    u[si] = { ...u[si], videos: u[si].videos.filter((_, idx) => idx !== vi) };
    onSectionsChange(u);
  };
  const moveVideo = (si, vi, dir) => {
    const u = [...sections];
    const vids = [...(u[si].videos || [])];
    const sw = vi + dir;
    if (sw < 0 || sw >= vids.length) return;
    [vids[vi], vids[sw]] = [vids[sw], vids[vi]];
    u[si] = { ...u[si], videos: vids };
    onSectionsChange(u);
  };
  const updateVideo = (si, vi, k, v) => {
    const u = [...sections];
    const vids = [...(u[si].videos || [])];
    vids[vi] = { ...vids[vi], [k]: v };
    u[si] = { ...u[si], videos: vids };
    onSectionsChange(u);
  };

  return (
    <>
      {/* Page metadata */}
      <div style={{ background: "#f0f9ff", border: "1.5px solid #bae6fd", borderRadius: 12, padding: 16, marginBottom: 28 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#0369a1", marginBottom: 12 }}>Page Settings</div>
        <Field label="Nav link label" hint="How it appears in the site navigation">
          <input style={inputStyle} placeholder="AI Workshop" value={workshop?.navLabel || ""} onChange={e => setMeta("navLabel", e.target.value)} />
        </Field>
        <Field label="Page heading">
          <input style={inputStyle} placeholder="AI Workshop" value={workshop?.heading || ""} onChange={e => setMeta("heading", e.target.value)} />
        </Field>
        <Field label="Sub-heading">
          <input style={inputStyle} placeholder="A hands-on, section-by-section guide…" value={workshop?.subheading || ""} onChange={e => setMeta("subheading", e.target.value)} />
        </Field>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
          <input type="checkbox" checked={workshop?.showInNav !== false} onChange={e => setMeta("showInNav", e.target.checked)} />
          Show in navigation
        </label>
      </div>

      {/* Hint */}
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20, background: "#f9fafb", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #e5e7eb" }}>
        💡 <strong>YouTube Short ID</strong> = the part after <code style={{ background: "#f3f4f6", padding: "1px 5px", borderRadius: 4 }}>?v=</code> in any YouTube URL. Each section can hold multiple shorts with individual descriptions — users swipe through a carousel. Videos display in portrait (9:16).
      </p>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Btn onClick={addSection}><Plus size={14} /> New Section</Btn>
      </div>

      {sections.length === 0 && (
        <div style={{ textAlign: "center", padding: "32px 0", color: "#9ca3af", fontSize: 13, border: "1.5px dashed #e5e7eb", borderRadius: 10 }}>
          No sections yet. Click "+ New Section" to add the first one.
        </div>
      )}

      {sections.map((sec, si) => {
        const videos = sec.videos || [];
        return (
          <Card key={sec.id || si}>
            <SectionHeader
              title={`Section ${si + 1}${sec.title ? " — " + sec.title : ""}`}
              onDelete={() => removeSection(si)}
              onMoveUp={() => moveSection(si, -1)}
              onMoveDown={() => moveSection(si, 1)}
              canUp={si > 0} canDown={si < sections.length - 1}
              deleteLabel="Delete"
            />

            {/* Layout badge */}
            <div style={{ marginBottom: 14 }}>
              <span style={{
                fontSize: 11, fontWeight: 700,
                background: si % 2 === 0 ? "#eff6ff" : "#f0fdf4",
                color: si % 2 === 0 ? "#2563eb" : "#16a34a",
                padding: "3px 10px", borderRadius: 999,
              }}>
                {si % 2 === 0 ? "▶ Video left · Text right" : "Text left · Video right ◀"}
              </span>
              <span style={{ marginLeft: 8, fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>
                {videos.length} {videos.length === 1 ? "video" : "videos"}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <Field label="Badge (optional)">
                <input style={inputStyle} placeholder="e.g. Chapter 1"
                  value={sec.badge || ""} onChange={e => updateSection(si, "badge", e.target.value)} />
              </Field>
              <Field label="Section Title">
                <input style={inputStyle} placeholder="e.g. Prompt Engineering Basics"
                  value={sec.title || ""} onChange={e => updateSection(si, "title", e.target.value)} />
              </Field>
            </div>

            {/* Videos */}
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                Videos (carousel)
              </div>

              {videos.map((v, vi) => (
                <div key={vi} style={{ background: "#f8fafc", border: "1.5px solid #e5e7eb", borderRadius: 10, padding: 12, marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", minWidth: 20 }}>#{vi + 1}</span>
                    <input
                      style={{ ...inputStyle, flex: 1 }}
                      placeholder="YouTube Short ID (e.g. dQw4w9WgXcQ)"
                      value={v.ytId || ""}
                      onChange={e => updateVideo(si, vi, "ytId", e.target.value)}
                    />
                    <Btn variant="ghost" small onClick={() => moveVideo(si, vi, -1)} disabled={vi === 0}><ChevronUp size={13} /></Btn>
                    <Btn variant="ghost" small onClick={() => moveVideo(si, vi, 1)} disabled={vi === videos.length - 1}><ChevronDown size={13} /></Btn>
                    <Btn variant="danger" small onClick={() => removeVideo(si, vi)} disabled={videos.length <= 1}>
                      <Trash2 size={13} />
                    </Btn>
                  </div>
                  <textarea
                    style={{ ...textareaStyle, marginBottom: 0 }}
                    rows={3}
                    placeholder="Description for this specific video…"
                    value={v.description || ""}
                    onChange={e => updateVideo(si, vi, "description", e.target.value)}
                  />
                </div>
              ))}

              <Btn variant="ghost" small onClick={() => addVideo(si)}>
                <Plus size={13} /> Add Video to Carousel
              </Btn>
            </div>
          </Card>
        );
      })}
    </>
  );
}

// ─── Sections Manager ─────────────────────────────────────────────────────────

const BUILT_IN_SECTIONS = [
  { id: "about",    label: "About",        icon: "👤" },
  { id: "tools",    label: "AI Tools",     icon: "🛠" },
  { id: "learn",    label: "Learn",        icon: "▶" },
  { id: "shorts",   label: "Shorts Feed",  icon: "📱" },
  { id: "services", label: "Services",     icon: "💼" },
  { id: "contact",  label: "Contact",      icon: "✉" },
];

function SectionsManager({ sectionOrder, sectionVisibility, customPages, onOrderChange, onVisibilityChange, onPagesChange }) {
  const move = (i, dir) => {
    const u = [...sectionOrder]; const sw = i + dir;
    if (sw < 0 || sw >= u.length) return;
    [u[i], u[sw]] = [u[sw], u[i]]; onOrderChange(u);
  };
  const toggle = (id) => onVisibilityChange({ ...sectionVisibility, [id]: !sectionVisibility[id] });

  // Custom pages
  const addPage = () => {
    const id = `page_${Date.now()}`;
    onPagesChange([...customPages, { id, navLabel: "New Page", heading: "New Page", subheading: "", body: "" }]);
  };
  const removePage = (i) => { if (window.confirm("Delete this page?")) onPagesChange(customPages.filter((_, idx) => idx !== i)); };
  const updatePage = (i, k, v) => { const u = [...customPages]; u[i] = { ...u[i], [k]: v }; onPagesChange(u); };

  return (
    <>
      {/* Built-in sections */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Built-in Sections</div>
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 14 }}>
          Toggle visibility or drag to reorder how sections appear on the page and in the nav.
        </p>
        {sectionOrder.map((id, i) => {
          const meta = BUILT_IN_SECTIONS.find(s => s.id === id);
          if (!meta) return null;
          const visible = sectionVisibility[id] !== false;
          return (
            <div key={id} style={{ display: "flex", alignItems: "center", gap: 10, background: visible ? "#fff" : "#f9fafb", border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "10px 14px", marginBottom: 8, opacity: visible ? 1 : 0.6 }}>
              <span style={{ fontSize: 18 }}>{meta.icon}</span>
              <span style={{ flex: 1, fontWeight: 600, fontSize: 14, color: visible ? "#111827" : "#9ca3af" }}>{meta.label}</span>
              <button onClick={() => toggle(id)}
                style={{ background: visible ? "#dcfce7" : "#f3f4f6", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: visible ? "#16a34a" : "#6b7280" }}>
                {visible ? <><Eye size={13} /> Visible</> : <><EyeOff size={13} /> Hidden</>}
              </button>
              <Btn variant="ghost" small onClick={() => move(i, -1)} style={{ padding: "4px 7px" }} disabled={i === 0}><ChevronUp size={14} /></Btn>
              <Btn variant="ghost" small onClick={() => move(i, 1)} style={{ padding: "4px 7px" }} disabled={i === sectionOrder.length - 1}><ChevronDown size={14} /></Btn>
            </div>
          );
        })}
      </div>

      {/* Custom pages */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Custom Pages</div>
          <Btn onClick={addPage} small><Plus size={13} /> New Page</Btn>
        </div>
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 14 }}>
          Custom pages appear as nav links and open as full-screen views. Useful for Resources, Blog, FAQ, etc.
        </p>
        {customPages.length === 0 && (
          <div style={{ textAlign: "center", padding: "24px 0", color: "#9ca3af", fontSize: 13, border: "1.5px dashed #e5e7eb", borderRadius: 10 }}>
            No custom pages yet. Click "+ New Page" to add one.
          </div>
        )}
        {customPages.map((page, i) => (
          <Card key={page.id}>
            <SectionHeader title={"📄 " + (page.navLabel || "Untitled Page")} onDelete={() => removePage(i)} deleteLabel="Delete Page" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
              <Field label="Nav link label">
                <input style={inputStyle} value={page.navLabel} placeholder="e.g. Resources"
                  onChange={e => updatePage(i, "navLabel", e.target.value)} />
              </Field>
              <Field label="URL slug" hint={`Accessible at site.com/#page-${page.navLabel?.toLowerCase().replace(/\s+/g, "-") || "..."}`}>
                <input style={{ ...inputStyle, background: "#f9fafb", color: "#6b7280" }}
                  value={page.navLabel?.toLowerCase().replace(/\s+/g, "-") || ""}
                  readOnly />
              </Field>
            </div>
            <Field label="Page heading">
              <input style={inputStyle} value={page.heading} placeholder="Page title shown on the page"
                onChange={e => updatePage(i, "heading", e.target.value)} />
            </Field>
            <Field label="Sub-heading">
              <input style={inputStyle} value={page.subheading} placeholder="Optional subtitle"
                onChange={e => updatePage(i, "subheading", e.target.value)} />
            </Field>
            <Field label="Body content" hint="Plain text. Use blank lines to separate paragraphs.">
              <textarea style={textareaStyle} rows={6} value={page.body} placeholder="Write your page content here…"
                onChange={e => updatePage(i, "body", e.target.value)} />
            </Field>
          </Card>
        ))}
      </div>
    </>
  );
}

function SettingsEditor({ content, onChange }) {
  return (
    <>
      <Field label="YouTube Channel URL">
        <input style={inputStyle} value={content.youtubeChannelUrl} onChange={e => onChange({ ...content, youtubeChannelUrl: e.target.value })} />
      </Field>
      <Field label="YouTube Channel ID" hint="Starts with UC... — find it on YouTube: your channel → About → Share → Copy channel ID. Powers the Shorts feed.">
        <input style={inputStyle} placeholder="UCxxxxxxxxxxxxxxxxxxxx"
          value={content.youtubeChannelId || ""}
          onChange={e => onChange({ ...content, youtubeChannelId: e.target.value })} />
      </Field>
      <Field label="Contact email" hint="For your reference only — emails are routed via Formspree below.">
        <input style={inputStyle} type="email" value={content.contactEmail} onChange={e => onChange({ ...content, contactEmail: e.target.value })} />
      </Field>
      <Field label="Formspree form ID" hint="Sign up free at formspree.io → New Form → paste the ID here (e.g. xpzgakbn). Emails go to whatever address you set in Formspree.">
        <input style={inputStyle} placeholder="e.g. xpzgakbn"
          value={content.formspreeId || ""}
          onChange={e => onChange({ ...content, formspreeId: e.target.value })} />
      </Field>
      <Field label="Admin password" hint="⚠ Change this before going live. Protects the admin panel.">
        <input style={inputStyle} value={content.adminPassword} onChange={e => onChange({ ...content, adminPassword: e.target.value })} />
      </Field>
    </>
  );
}

// ─── Password gate ────────────────────────────────────────────────────────────

function PasswordGate({ correctPassword, onSuccess }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const attempt = () => {
    if (pw === correctPassword) { onSuccess(); }
    else { setErr(true); setPw(""); setTimeout(() => setErr(false), 2000); }
  };
  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#1e293b", borderRadius: 20, padding: 40, width: "100%", maxWidth: 360, textAlign: "center" }}>
        <Lock size={40} color="#60a5fa" style={{ marginBottom: 16 }} />
        <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Admin Panel</h2>
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>Enter your password to continue</p>
        <input type="password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && attempt()}
          placeholder="Password" autoFocus
          style={{ ...inputStyle, marginBottom: 10, textAlign: "center", background: "#0f172a", border: `1.5px solid ${err ? "#ef4444" : "#334155"}`, color: "#fff" }} />
        {err && <p style={{ color: "#f87171", fontSize: 13, marginBottom: 8 }}>Incorrect — try again.</p>}
        <button onClick={attempt}
          style={{ width: "100%", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "11px 0", fontWeight: 700, fontSize: 15, cursor: "pointer", marginTop: 4 }}>
          Enter Admin
        </button>
      </div>
    </div>
  );
}

// ─── Nav config ───────────────────────────────────────────────────────────────

const SIDEBAR = [
  { id: "sections",  label: "Sections & Pages", icon: <Layout size={15} /> },
  { id: "hero",      label: "Hero",              icon: "🏠" },
  { id: "about",     label: "About",             icon: "👤" },
  { id: "tools",     label: "AI Tools",          icon: "🛠" },
  { id: "playlists", label: "Playlists",         icon: "▶" },
  { id: "workshop",  label: "AI Workshop",       icon: <Video size={15} /> },
  { id: "services",  label: "Services",          icon: "💼" },
  { id: "settings",  label: "Settings",          icon: <Settings size={15} /> },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdminPanel({ content, updateContent, resetContent, onClose }) {
  const [authed, setAuthed] = useState(false);
  const [active, setActive] = useState("sections");
  const [flash, setFlash] = useState(false);

  if (!authed) return <PasswordGate correctPassword={content.adminPassword} onSuccess={() => setAuthed(true)} />;

  const set = (field, val) => updateContent(prev => ({ ...prev, [field]: val }));

  const handleReset = () => {
    if (window.confirm("Reset ALL content to defaults? This cannot be undone.")) resetContent();
  };

  const showFlash = () => { setFlash(true); setTimeout(() => setFlash(false), 2000); };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ background: "#0f172a", height: 56, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>⚙ Admin Panel</span>
          <span style={{ background: "#1e293b", color: "#60a5fa", fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 999 }}>Auto-saves</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {flash && <span style={{ color: "#4ade80", fontSize: 12, fontWeight: 600 }}>✓ Saved</span>}
          <Btn variant="ghost" small onClick={() => { updateContent(c => c); showFlash(); }}><Save size={13} /> Save</Btn>
          <Btn variant="ghost" small onClick={handleReset}><RotateCcw size={13} /> Reset</Btn>
          <a href="/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <Btn variant="ghost" small><Eye size={13} /> View Site</Btn>
          </a>
          <Btn variant="danger" small onClick={onClose}><X size={13} /> Exit</Btn>
        </div>
      </div>

      {/* Body */}
      <div className="admin-layout" style={{ display: "flex", minHeight: "calc(100vh - 56px)" }}>

        {/* Sidebar */}
        <aside className="admin-sidebar" style={{ background: "#1e293b", padding: "16px 12px", flexShrink: 0 }}>
          {SIDEBAR.map(item => (
            <button key={item.id} onClick={() => setActive(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 9, width: "100%", textAlign: "left",
                background: active === item.id ? "#2563eb" : "transparent",
                color: active === item.id ? "#fff" : "#94a3b8",
                border: "none", borderRadius: 8, padding: "9px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 3,
              }}>
              <span style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </aside>

        {/* Editor pane */}
        <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 22 }}>
            {SIDEBAR.find(s => s.id === active)?.label}
          </h2>

          {active === "sections" && (
            <SectionsManager
              sectionOrder={content.sectionOrder ?? ["about","tools","learn","services","contact"]}
              sectionVisibility={content.sectionVisibility ?? {about:true,tools:true,learn:true,services:true,contact:true}}
              customPages={content.customPages ?? []}
              onOrderChange={v => set("sectionOrder", v)}
              onVisibilityChange={v => set("sectionVisibility", v)}
              onPagesChange={v => set("customPages", v)}
            />
          )}
          {active === "hero"      && <HeroEditor     data={content.hero}      onChange={v => set("hero", v)} />}
          {active === "about"     && <AboutEditor    data={content.about}     onChange={v => set("about", v)} />}
          {active === "tools" && <>
            <div style={{ background: "#f8fafc", border: "1.5px solid #e5e7eb", borderRadius: 12, padding: 16, marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.07em" }}>Section Header</div>
              <Field label="Eyebrow label" hint='Small label above the title. Default: "Curated Resources"'>
                <input style={inputStyle} placeholder="Curated Resources"
                  value={(content.toolsSection || {}).eyebrow || ""}
                  onChange={e => set("toolsSection", { ...(content.toolsSection || {}), eyebrow: e.target.value })} />
              </Field>
              <Field label="Title">
                <input style={inputStyle} placeholder="AI Tools Directory"
                  value={(content.toolsSection || {}).title || ""}
                  onChange={e => set("toolsSection", { ...(content.toolsSection || {}), title: e.target.value })} />
              </Field>
              <Field label="Subtitle">
                <textarea style={textareaStyle} rows={2} placeholder="A hand-picked collection of the AI tools worth knowing…"
                  value={(content.toolsSection || {}).subtitle || ""}
                  onChange={e => set("toolsSection", { ...(content.toolsSection || {}), subtitle: e.target.value })} />
              </Field>
            </div>
            <ToolsEditor tools={content.tools} onChange={v => set("tools", v)} />
          </>}
          {active === "playlists" && <>
            <div style={{ background: "#f8fafc", border: "1.5px solid #e5e7eb", borderRadius: 12, padding: 16, marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.07em" }}>Section Header</div>
              <Field label="Eyebrow label" hint='Small label above the title. Default: "Free Education"'>
                <input style={inputStyle} placeholder="Free Education"
                  value={(content.learnSection || {}).eyebrow || ""}
                  onChange={e => set("learnSection", { ...(content.learnSection || {}), eyebrow: e.target.value })} />
              </Field>
              <Field label="Title">
                <input style={inputStyle} placeholder="AI for Everyone"
                  value={(content.learnSection || {}).title || ""}
                  onChange={e => set("learnSection", { ...(content.learnSection || {}), title: e.target.value })} />
              </Field>
              <Field label="Subtitle">
                <textarea style={textareaStyle} rows={2} placeholder="Structured playlists to take you from AI-curious to AI-confident…"
                  value={(content.learnSection || {}).subtitle || ""}
                  onChange={e => set("learnSection", { ...(content.learnSection || {}), subtitle: e.target.value })} />
              </Field>
            </div>
            <PlaylistsEditor playlists={content.playlists} onChange={v => set("playlists", v)} />
          </>}
          {active === "workshop" && (
            <WorkshopEditor
              workshop={content.workshop}
              sections={content.workshopSections ?? []}
              onWorkshopChange={v => set("workshop", v)}
              onSectionsChange={v => set("workshopSections", v)}
            />
          )}
          {active === "services"  && <ServicesEditor services={content.services} onChange={v => set("services", v)} />}
          {active === "settings"  && <SettingsEditor content={content} onChange={updateContent} />}
        </main>
      </div>
    </div>
  );
}
