import { useState, useCallback } from "react";
import { DEFAULT_CONTENT } from "./data.js";

const STORAGE_KEY = "tp_site_content";

function loadContent() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Deep-merge one level so new fields added to nested objects
      // (e.g. hero.photoUrl, hero.showStats) are never lost when
      // localStorage has an older snapshot of that object.
      return {
        ...DEFAULT_CONTENT,
        ...parsed,
        hero:    { ...DEFAULT_CONTENT.hero,    ...(parsed.hero    || {}) },
        about:   { ...DEFAULT_CONTENT.about,   ...(parsed.about   || {}) },
        sectionVisibility: { ...DEFAULT_CONTENT.sectionVisibility, ...(parsed.sectionVisibility || {}) },
      };
    }
  } catch (e) {
    console.warn("Could not load saved content:", e);
  }
  return DEFAULT_CONTENT;
}

export function useContent() {
  const [content, setContent] = useState(loadContent);

  const updateContent = useCallback((updater) => {
    setContent((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn("Could not save content:", e);
      }
      return next;
    });
  }, []);

  const resetContent = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setContent(DEFAULT_CONTENT);
  }, []);

  return { content, updateContent, resetContent };
}
