// src/useContent.js
import { useState, useEffect, useRef } from "react";
import { DEFAULT_CONTENT } from "./data.js";

const LS_KEY = "tp_site_content";

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

function loadFromLS() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? mergeWithDefaults(JSON.parse(raw)) : DEFAULT_CONTENT;
  } catch {
    return DEFAULT_CONTENT;
  }
}

async function saveToCloud(data) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
  try {
    await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    // Cloud unavailable — localStorage write already succeeded
  }
}

export function useContent() {
  const [content, setContent] = useState(loadFromLS);
  const synced = useRef(false);

  useEffect(() => {
    if (synced.current) return;
    synced.current = true;

    const hasLocalData = !!localStorage.getItem(LS_KEY);

    fetch("/api/content")
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (data && !hasLocalData) {
          // Only load from cloud if this device has no local edits
          const merged = mergeWithDefaults(data);
          setContent(merged);
          localStorage.setItem(LS_KEY, JSON.stringify(merged));
        } else if (!data && hasLocalData) {
          // Cloud is empty but we have local data — push local up to cloud
          const local = loadFromLS();
          saveToCloud(local);
        }
      })
      .catch(() => {});
  }, []);

  const updateContent = (updater) => {
    setContent(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveToCloud(next);
      return next;
    });
  };

  const resetContent = () => {
    localStorage.removeItem(LS_KEY);
    setContent(DEFAULT_CONTENT);
    saveToCloud(DEFAULT_CONTENT);
  };

  return { content, updateContent, resetContent };
}
