"use client";

import { useState, useEffect } from "react";
import RichTextEditor from "@/components/admin/RichTextEditor";

interface Section {
  id?: number; section_name: string; title: string; content: string;
}

export default function AboutEditor() {
  const [sections, setSections] = useState<Section[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/content/about").then(r => r.json()).then(setSections);
  }, []);

  function updateSection(i: number, field: keyof Section, value: string) {
    const updated = [...sections];
    updated[i] = { ...updated[i], [field]: value };
    setSections(updated);
  }

  function addSection() {
    setSections([...sections, { section_name: "", title: "", content: "" }]);
  }

  function removeSection(i: number) {
    setSections(sections.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    setSaving(true); setMessage("");
    const res = await fetch("/api/content/about", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sections }),
    });
    setMessage((await res.json()).message);
    setSaving(false);
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>About Section Editor</h1>
      {sections.map((s, i) => (
        <div key={i} style={{ marginBottom: 20, padding: 16, border: "1px solid #ddd", borderRadius: 8, background: "white" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <strong>Section {i + 1}</strong>
            <button onClick={() => removeSection(i)} style={{ color: "red", cursor: "pointer", background: "none", border: "none" }}>Remove</button>
          </div>
          <input placeholder="Section name (e.g. mission, vision)" value={s.section_name} onChange={(e) => updateSection(i, "section_name", e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 8, border: "1px solid #ddd", borderRadius: 4 }} />
          <input placeholder="Title" value={s.title} onChange={(e) => updateSection(i, "title", e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 8, border: "1px solid #ddd", borderRadius: 4 }} />
          <RichTextEditor content={s.content} onChange={(v) => updateSection(i, "content", v)} />
        </div>
      ))}
      <button onClick={addSection} style={{ padding: "8px 16px", background: "#28a745", color: "white", border: "none", borderRadius: 6, cursor: "pointer", marginRight: 10 }}>Add Section</button>
      <button onClick={handleSave} disabled={saving}
        style={{ padding: "12px 24px", background: "#040f2d", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
        {saving ? "Saving..." : "Save All"}
      </button>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}
