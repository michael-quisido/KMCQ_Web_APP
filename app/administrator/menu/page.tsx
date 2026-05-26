"use client";

import { useState, useEffect } from "react";

interface MenuItem {
  id?: number; label: string; href: string; section?: string;
}

const LOCATIONS = [
  { value: "header", label: "Header Nav" },
  { value: "footer", label: "Footer Links" },
];

const SECTIONS = [
  { value: "about", label: "About Us" },
  { value: "products", label: "Products" },
  { value: "community", label: "Community" },
  { value: "learn-more", label: "Learn More" },
  { value: "legal", label: "Terms & Policy" },
];

export default function MenuEditor() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState<"header" | "footer">("header");

  useEffect(() => {
    fetch(`/api/content/menu?location=${location}`)
      .then(r => r.json())
      .then(setItems);
  }, [location]);

  function updateItem(i: number, field: keyof MenuItem, value: string) {
    const updated = [...items];
    if (field === "label") updated[i].label = value;
    else if (field === "href") updated[i].href = value;
    else if (field === "section") updated[i].section = value || undefined;
    setItems(updated);
  }

  function addItem() {
    const newItem: MenuItem = { label: "", href: "" };
    if (location === "footer") newItem.section = "about";
    setItems([...items, newItem]);
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
      body: JSON.stringify({ items, location }),
    });
    setMessage((await res.json()).message);
    setSaving(false);
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Navigation Menu Editor</h1>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20 }}>
        {LOCATIONS.map((loc) => (
          <button
            key={loc.value}
            onClick={() => setLocation(loc.value as "header" | "footer")}
            style={{
              padding: "10px 24px",
              border: "1px solid #040f2d",
              borderRadius: loc.value === "header" ? "6px 0 0 6px" : "0 6px 6px 0",
              cursor: "pointer",
              fontWeight: location === loc.value ? "bold" : "normal",
              background: location === loc.value ? "#040f2d" : "white",
              color: location === loc.value ? "white" : "#040f2d",
            }}
          >
            {loc.label}
          </button>
        ))}
      </div>
      {/* Items */}
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center", padding: 12, background: "white", border: "1px solid #ddd", borderRadius: 8 }}>
          <span style={{ color: "#999", minWidth: 24 }}>{i + 1}.</span>
          <input placeholder="Label (e.g. Home)" value={item.label} onChange={(e) => updateItem(i, "label", e.target.value)}
            style={{ padding: 8, border: "1px solid #ddd", borderRadius: 4, flex: 1 }} />
          <input placeholder="URL (e.g. / or /about)" value={item.href} onChange={(e) => updateItem(i, "href", e.target.value)}
            style={{ padding: 8, border: "1px solid #ddd", borderRadius: 4, flex: 1.5 }} />
          {location === "footer" && (
            <select value={item.section || "about"} onChange={(e) => updateItem(i, "section", e.target.value)}
              style={{ padding: 8, border: "1px solid #ddd", borderRadius: 4 }}>
              {SECTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          )}
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
