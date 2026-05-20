"use client";

import { useState, useEffect } from "react";

interface MenuItem {
  id?: number; label: string; href: string;
}

export default function MenuEditor() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/content/menu").then(r => r.json()).then(setItems);
  }, []);

  function updateItem(i: number, field: keyof MenuItem, value: string) {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: value };
    setItems(updated);
  }

  function addItem() {
    setItems([...items, { label: "", href: "" }]);
  }

  function removeItem(i: number) {
    setItems(items.filter((_, idx) => idx !== i));
  }

  function moveItem(i: number, direction: "up" | "down") {
    if (direction === "up" && i === 0) return;
    if (direction === "down" && i === items.length - 1) return;
    const updated = [...items];
    const swap = direction === "up" ? i - 1 : i + 1;
    [updated[i], updated[swap]] = [updated[swap], updated[i]];
    setItems(updated);
  }

  async function handleSave() {
    setSaving(true); setMessage("");
    const res = await fetch("/api/content/menu", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    setMessage((await res.json()).message);
    setSaving(false);
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Navigation Menu Editor</h1>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center", padding: 12, background: "white", border: "1px solid #ddd", borderRadius: 8 }}>
          <span style={{ color: "#999", minWidth: 24 }}>{i + 1}.</span>
          <input placeholder="Label (e.g. Home)" value={item.label} onChange={(e) => updateItem(i, "label", e.target.value)}
            style={{ padding: 8, border: "1px solid #ddd", borderRadius: 4, flex: 1 }} />
          <input placeholder="URL (e.g. / or /#products)" value={item.href} onChange={(e) => updateItem(i, "href", e.target.value)}
            style={{ padding: 8, border: "1px solid #ddd", borderRadius: 4, flex: 1.5 }} />
          <button onClick={() => moveItem(i, "up")} disabled={i === 0} style={{ cursor: i === 0 ? "not-allowed" : "pointer", background: "none", border: "1px solid #ddd", borderRadius: 4, padding: "4px 8px" }}>↑</button>
          <button onClick={() => moveItem(i, "down")} disabled={i === items.length - 1} style={{ cursor: i === items.length - 1 ? "not-allowed" : "pointer", background: "none", border: "1px solid #ddd", borderRadius: 4, padding: "4px 8px" }}>↓</button>
          <button onClick={() => removeItem(i)} style={{ color: "red", background: "none", border: "none", cursor: "pointer" }}>✕</button>
        </div>
      ))}
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button onClick={addItem} style={{ padding: "10px 20px", background: "#28a745", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>Add Item</button>
        <button onClick={handleSave} disabled={saving}
          style={{ padding: "10px 20px", background: "#040f2d", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
          {saving ? "Saving..." : "Save Menu"}
        </button>
      </div>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}
