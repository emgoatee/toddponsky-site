import { useState, useCallback } from "react";
import { DEFAULT_CONTENT } from "./data.js";

const STORAGE_KEY = "tp_site_content";

function loadContent() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Shallow-merge with defaults so any new top-level fields
      // added after the initial save are always present.
      return { ...DEFAULT_CONTENT, ...parsed };
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
