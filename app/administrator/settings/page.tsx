"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"credentials" | "social">("credentials");

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Settings</h1>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button onClick={() => setActiveTab("credentials")}
          style={{ padding: "8px 16px", background: activeTab === "credentials" ? "#040f2d" : "#ddd", color: activeTab === "credentials" ? "white" : "black", border: "none", borderRadius: 6, cursor: "pointer" }}>Credentials</button>
        <button onClick={() => setActiveTab("social")}
          style={{ padding: "8px 16px", background: activeTab === "social" ? "#040f2d" : "#ddd", color: activeTab === "social" ? "white" : "black", border: "none", borderRadius: 6, cursor: "pointer" }}>Social Links</button>
      </div>

      {activeTab === "credentials" && <CredentialsForm />}
      {activeTab === "social" && <SocialLinksForm />}
    </div>
  );
}

function CredentialsForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true); setMessage("");
    const res = await fetch("/api/content/settings/credentials", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newUsername, newPassword, newEmail }),
    });
    const data = await res.json();
    setMessage(data.message || data.error);
    if (res.ok) { setCurrentPassword(""); setNewPassword(""); }
    setSaving(false);
  }

  return (
    <div style={{ maxWidth: 500 }}>
      <input type="password" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10, border: "1px solid #ddd", borderRadius: 6 }} />
      <input type="email" placeholder="New email (leave blank to keep)" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10, border: "1px solid #ddd", borderRadius: 6 }} />
      <input placeholder="New username (leave blank to keep)" value={newUsername} onChange={(e) => setNewUsername(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10, border: "1px solid #ddd", borderRadius: 6 }} />
      <input type="password" placeholder="New password (leave blank to keep)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10, border: "1px solid #ddd", borderRadius: 6 }} />
      <button onClick={handleSave} disabled={saving}
        style={{ padding: "12px 24px", background: "#040f2d", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
        {saving ? "Saving..." : "Update Credentials"}
      </button>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}

function SocialLinksForm() {
  const [links, setLinks] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/content/social-links").then(r => r.json()).then(setLinks);
  }, []);

  function updateLink(i: number, field: string, value: string) {
    const updated = [...links];
    updated[i] = { ...updated[i], [field]: value };
    setLinks(updated);
  }

  function addLink() { setLinks([...links, { platform: "", url: "", icon: "" }]); }
  function removeLink(i: number) { setLinks(links.filter((_, idx) => idx !== i)); }

  async function handleSave() {
    setSaving(true); setMessage("");
    const res = await fetch("/api/content/social-links", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ links }),
    });
    setMessage((await res.json()).message);
    setSaving(false);
  }

  return (
    <div>
      {links.map((l, i) => (
        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center" }}>
          <input placeholder="Platform" value={l.platform} onChange={(e) => updateLink(i, "platform", e.target.value)}
            style={{ padding: 8, border: "1px solid #ddd", borderRadius: 4, flex: 1 }} />
          <input placeholder="URL" value={l.url} onChange={(e) => updateLink(i, "url", e.target.value)}
            style={{ padding: 8, border: "1px solid #ddd", borderRadius: 4, flex: 2 }} />
          <input placeholder="Icon class" value={l.icon} onChange={(e) => updateLink(i, "icon", e.target.value)}
            style={{ padding: 8, border: "1px solid #ddd", borderRadius: 4, flex: 1 }} />
          <button onClick={() => removeLink(i)} style={{ color: "red", background: "none", border: "none", cursor: "pointer" }}>✕</button>
        </div>
      ))}
      <button onClick={addLink} style={{ padding: "8px 16px", background: "#28a745", color: "white", border: "none", borderRadius: 6, cursor: "pointer", marginRight: 10 }}>Add Link</button>
      <button onClick={handleSave} disabled={saving}
        style={{ padding: "12px 24px", background: "#040f2d", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
        {saving ? "Saving..." : "Save Social Links"}
      </button>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}
