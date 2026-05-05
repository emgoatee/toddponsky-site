import { useState, useEffect } from "react";
import MainSite from "./MainSite.jsx";
import AdminPanel from "./AdminPanel.jsx";
import WorkshopPage from "./WorkshopPage.jsx";
import { useContent } from "./useContent.js";

export default function App() {
  const { content, updateContent, resetContent } = useContent();
  const [path, setPath] = useState(window.location.pathname);
  const [adminOpen, setAdminOpen] = useState(window.location.hash === "#admin");

  // Keep path in sync with browser back/forward buttons
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (to) => {
    window.history.pushState({}, "", to);
    setPath(to);
    window.scrollTo(0, 0);
  };

  if (adminOpen) {
    return (
      <AdminPanel
        content={content}
        updateContent={updateContent}
        resetContent={resetContent}
        onClose={() => setAdminOpen(false)}
      />
    );
  }

  if (path === "/ai-workshop") {
    return (
      <WorkshopPage
        content={content}
        onBack={() => navigate("/")}
      />
    );
  }

  return (
    <MainSite
      content={content}
      onAdminClick={() => setAdminOpen(true)}
      onNavigate={navigate}
    />
  );
}
