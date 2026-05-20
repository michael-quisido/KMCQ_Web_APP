"use client";

import { useState, useEffect } from "react";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function HeroEditor() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/content/hero").then(r => r.json()).then(data => {
      if (data.title) setTitle(data.title);
      if (data.subtitle) setSubtitle(data.subtitle);
      if (data.content) setContent(data.content);
    });
  }, []);

  async function handleSave() {
    setSaving(true); setMessage("");
    const res = await fetch("/api/content/hero", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, subtitle, content }),
    });
    const data = await res.json();
    setMessage(data.message || "Error saving");
    setSaving(false);
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Hero Section Editor</h1>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 6, fontSize: 16 }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Subtitle</label>
        <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)}
          style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 6, fontSize: 16 }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Rich Content</label>
        <RichTextEditor content={content} onChange={setContent} />
      </div>
      <button onClick={handleSave} disabled={saving}
        style={{ padding: "12px 24px", background: "#040f2d", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 16 }}>
        {saving ? "Saving..." : "Save Changes"}
      </button>
      {message && <p style={{ marginTop: 10, color: "#040f2d" }}>{message}</p>}
    </div>
  );
}
