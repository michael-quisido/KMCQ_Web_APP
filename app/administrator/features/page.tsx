"use client";

import { useState, useEffect } from "react";
import RichTextEditor from "@/components/admin/RichTextEditor";

interface Feature {
  id?: number; title: string; icon: string; content: string;
}

export default function FeaturesEditor() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/content/features").then(r => r.json()).then(setFeatures);
  }, []);

  function updateFeature(i: number, field: keyof Feature, value: string) {
    const updated = [...features];
    updated[i] = { ...updated[i], [field]: value };
    setFeatures(updated);
  }

  function addFeature() {
    setFeatures([...features, { title: "", icon: "", content: "" }]);
  }

  function removeFeature(i: number) {
    setFeatures(features.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    setSaving(true); setMessage("");
    const res = await fetch("/api/content/features", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cards: features }),
    });
    setMessage((await res.json()).message);
    setSaving(false);
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Feature Cards Editor</h1>
      {features.map((f, i) => (
        <div key={i} style={{ marginBottom: 20, padding: 16, border: "1px solid #ddd", borderRadius: 8, background: "white" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <strong>Feature {i + 1}</strong>
            <button onClick={() => removeFeature(i)} style={{ color: "red", cursor: "pointer", background: "none", border: "none" }}>Remove</button>
          </div>
          <input placeholder="Title" value={f.title} onChange={(e) => updateFeature(i, "title", e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 8, border: "1px solid #ddd", borderRadius: 4 }} />
          <input placeholder="Icon name (optional)" value={f.icon} onChange={(e) => updateFeature(i, "icon", e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 8, border: "1px solid #ddd", borderRadius: 4 }} />
          <RichTextEditor content={f.content} onChange={(v) => updateFeature(i, "content", v)} />
        </div>
      ))}
      <button onClick={addFeature} style={{ padding: "8px 16px", background: "#28a745", color: "white", border: "none", borderRadius: 6, cursor: "pointer", marginRight: 10 }}>Add Feature</button>
      <button onClick={handleSave} disabled={saving}
        style={{ padding: "12px 24px", background: "#040f2d", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
        {saving ? "Saving..." : "Save All"}
      </button>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}
