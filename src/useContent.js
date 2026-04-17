// src/useContent.js
// Syncs site content across devices via /api/content (Vercel KV).
// Falls back to localStorage if the API is unavailable.

import { useState, useEffect, useRef } from "react";
import { DEFAULT_CONTENT } from "./data.js";

const LS_KEY = "tp_site_content";

// Deep-merge saved content with defaults so new fields are always present
function mergeWithDefaults(parsed) {
  if (!parsed) return DEFAULT_CONTENT;
  return {
    ...DEFAULT_CONTENT,
    ...parsed,
    hero:              { ...DEFAULT_CONTENT.hero,              ...(parsed.hero              || {}) },
    about:             { ...DEFAULT_CONTENT.about,             ...(parsed.about             || {}) },
    sectionVisibility: { ...DEFAULT_CONTENT.sectionVisibility, ...(parsed.sectionVisibility || {}) },
  };
}

// Read from localStorage (instant, used for first render)
function loadFromLS() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? mergeWithDefaults(JSON.parse(raw)) : DEFAULT_CONTENT;
  } catch {
    return DEFAULT_CONTENT;
  }
}

// Write to both localStorage and the cloud
async function saveToCloud(data) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
    await fetch("/api/content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": data.adminPassword || "",
      },
      body: JSON.stringify(data),
    });
  } catch {
    // Cloud unavailable — localStorage write already succeeded above
  }
}

export function useContent() {
  // 1. Render instantly from localStorage (no flash / no spinner)
  const [content, setContent] = useState(loadFromLS);
  const syncedRef = useRef(false);

  // 2. On mount: fetch from cloud and silently hydrate if found
  useEffect(() => {
    if (syncedRef.current) return;
    syncedRef.current = true;

    fetch("/api/content")
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (data) {
          const merged = mergeWithDefaults(data);
          setContent(merged);
          localStorage.setItem(LS_KEY, JSON.stringify(merged));
        }
      })
      .catch(() => {
        // API not available — already showing localStorage content, no action needed
      });
  }, []);

  // Called by AdminPanel whenever content changes
  const updateContent = (updater) => {
    setContent(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveToCloud(next); // fire-and-forget
      return next;
    });
  };

  // Reset to factory defaults (clears both localStorage and cloud)
  const resetContent = () => {
    localStorage.removeItem(LS_KEY);
    setContent(DEFAULT_CONTENT);
    saveToCloud(DEFAULT_CONTENT);
  };

  return { content, updateContent, resetContent };
}
