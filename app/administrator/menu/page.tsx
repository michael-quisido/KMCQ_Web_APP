"use client";

import { useState, useEffect } from "react";

interface MenuItem {
  id?: number; label: string; href: string; section?: string;
}

interface MenuSection {
  id?: number; section_key: string; section_label: string;
}

const LOCATIONS = [
  { value: "header", label: "Header Nav" },
  { value: "footer", label: "Footer Links" },
];

export default function MenuEditor() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [sections, setSections] = useState<MenuSection[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState<"header" | "footer">("header");
  const [newSectionKey, setNewSectionKey] = useState("");
  const [newSectionLabel, setNewSectionLabel] = useState("");
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");

  useEffect(() => {
    fetch(`/api/content/menu?location=${location}`)
      .then(r => r.json())
      .then(setItems);
  }, [location]);

  useEffect(() => {
    fetch("/api/content/menu-sections")
      .then(r => r.json())
      .then(setSections);
  }, []);

  function updateItem(i: number, field: keyof MenuItem, value: string) {
    const updated = [...items];
    if (field === "label") updated[i].label = value;
    else if (field === "href") updated[i].href = value;
    else if (field === "section") updated[i].section = value || undefined;
    setItems(updated);
  }

  function addItem() {
    const newItem: MenuItem = { label: "", href: "" };
    if (location === "footer" && sections.length > 0) newItem.section = sections[0].section_key;
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

  async function addSection() {
    if (!newSectionKey.trim() || !newSectionLabel.trim()) return;
    const updated = [...sections, { section_key: newSectionKey.trim(), section_label: newSectionLabel.trim() }];
    setSections(updated);
    await fetch("/api/content/menu-sections", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sections: updated }),
    });
    setNewSectionKey("");
    setNewSectionLabel("");
  }

  async function removeSection(key: string) {
    const updated = sections.filter(s => s.section_key !== key);
    setSections(updated);
    await fetch("/api/content/menu-sections", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sections: updated }),
    });
  }

  function startEditSection(s: MenuSection) {
    setEditingSection(s.section_key);
    setEditLabel(s.section_label);
  }

  async function saveEditSection(key: string) {
    if (!editLabel.trim()) return;
    const updated = sections.map(s => s.section_key === key ? { ...s, section_label: editLabel.trim() } : s);
    setSections(updated);
    setEditingSection(null);
    await fetch("/api/content/menu-sections", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sections: updated }),
    });
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
            <select value={item.section || ""} onChange={(e) => updateItem(i, "section", e.target.value)}
              style={{ padding: 8, border: "1px solid #ddd", borderRadius: 4 }}>
              {sections.map((s) => (
                <option key={s.section_key} value={s.section_key}>{s.section_label}</option>
              ))}
            </select>
          )}
          <button onClick={() => moveItem(i, "up")} disabled={i === 0} style={{ cursor: i === 0 ? "not-allowed" : "pointer", background: "none", border: "1px solid #ddd", borderRadius: 4, padding: "4px 8px" }}>↑</button>
          <button onClick={() => moveItem(i, "down")} disabled={i === items.length - 1} style={{ cursor: i === items.length - 1 ? "not-allowed" : "pointer", background: "none", border: "1px solid #ddd", borderRadius: 4, padding: "4px 8px" }}>↓</button>
          <button onClick={() => removeItem(i)} style={{ color: "red", background: "none", border: "none", cursor: "pointer" }}>✕</button>
        </div>
      ))}
      <div style={{ display: "flex", gap: 10, marginTop: 20, marginBottom: 30 }}>
        <button onClick={addItem} style={{ padding: "10px 20px", background: "#28a745", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>Add Item</button>
        <button onClick={handleSave} disabled={saving}
          style={{ padding: "10px 20px", background: "#040f2d", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
          {saving ? "Saving..." : "Save Menu"}
        </button>
      </div>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}

      {/* Footer Categories Management */}
      {location === "footer" && (
        <div style={{ marginTop: 20, borderTop: "2px solid #040f2d", paddingTop: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>Footer Categories</h2>
          <p style={{ color: "#666", marginBottom: 15, fontSize: 14 }}>Add, rename, or remove categories (columns) that footer links are grouped under.</p>
          {sections.map((s) => (
            <div key={s.section_key} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8, padding: 10, background: "white", border: "1px solid #ddd", borderRadius: 6 }}>
              {editingSection === s.section_key ? (
                <input value={editLabel} onChange={(e) => setEditLabel(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") saveEditSection(s.section_key); }}
                  style={{ padding: 6, border: "1px solid #040f2d", borderRadius: 4, flex: 1, fontSize: 14 }}
                  autoFocus />
              ) : (
                <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>
                  <code style={{ background: "#eee", padding: "2px 6px", borderRadius: 3, fontSize: 12, marginRight: 8 }}>{s.section_key}</code>
                  {s.section_label}
                </span>
              )}
              {editingSection === s.section_key ? (
                <button onClick={() => saveEditSection(s.section_key)} style={{ padding: "4px 12px", background: "#040f2d", color: "white", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13 }}>Save</button>
              ) : (
                <button onClick={() => startEditSection(s)} style={{ background: "none", border: "1px solid #ddd", borderRadius: 4, padding: "4px 8px", cursor: "pointer", fontSize: 13 }}>Rename</button>
              )}
              <button onClick={() => removeSection(s.section_key)} style={{ color: "red", background: "none", border: "none", cursor: "pointer", fontSize: 13 }}>✕</button>
            </div>
          ))}
          {/* Add new category */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 15, padding: 12, background: "#f9f9f9", border: "1px dashed #aaa", borderRadius: 6 }}>
            <input placeholder="Key (e.g. pricing)" value={newSectionKey} onChange={(e) => setNewSectionKey(e.target.value.replace(/[^a-z0-9-]/g, ""))}
              style={{ padding: 8, border: "1px solid #ddd", borderRadius: 4, flex: 0.8, fontSize: 14 }} />
            <input placeholder="Label (e.g. Pricing)" value={newSectionLabel} onChange={(e) => setNewSectionLabel(e.target.value)}
              style={{ padding: 8, border: "1px solid #ddd", borderRadius: 4, flex: 1, fontSize: 14 }} />
            <button onClick={addSection} disabled={!newSectionKey.trim() || !newSectionLabel.trim()}
              style={{ padding: "8px 16px", background: "#28a745", color: "white", border: "none", borderRadius: 4, cursor: "pointer", whiteSpace: "nowrap" }}>
              Add Category
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
