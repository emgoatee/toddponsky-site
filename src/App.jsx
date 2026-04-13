import { useState } from "react";
import MainSite from "./MainSite.jsx";
import AdminPanel from "./AdminPanel.jsx";
import { useContent } from "./useContent.js";

export default function App() {
  const { content, updateContent, resetContent } = useContent();
  const [adminOpen, setAdminOpen] = useState(window.location.hash === "#admin");

  return adminOpen
    ? <AdminPanel content={content} updateContent={updateContent} resetContent={resetContent} onClose={() => setAdminOpen(false)} />
    : <MainSite content={content} onAdminClick={() => setAdminOpen(true)} />;
}
