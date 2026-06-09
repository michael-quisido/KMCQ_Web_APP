"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"credentials" | "social" | "email">("credentials");

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Settings</h1>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button onClick={() => setActiveTab("credentials")}
          style={{ padding: "8px 16px", background: activeTab === "credentials" ? "#040f2d" : "#ddd", color: activeTab === "credentials" ? "white" : "black", border: "none", borderRadius: 6, cursor: "pointer" }}>Credentials</button>
        <button onClick={() => setActiveTab("social")}
          style={{ padding: "8px 16px", background: activeTab === "social" ? "#040f2d" : "#ddd", color: activeTab === "social" ? "white" : "black", border: "none", borderRadius: 6, cursor: "pointer" }}>Social Links</button>
        <button onClick={() => setActiveTab("email")}
          style={{ padding: "8px 16px", background: activeTab === "email" ? "#040f2d" : "#ddd", color: activeTab === "email" ? "white" : "black", border: "none", borderRadius: 6, cursor: "pointer" }}>Email (SMTP)</button>
      </div>

      {activeTab === "credentials" && <CredentialsForm />}
      {activeTab === "social" && <SocialLinksForm />}
      {activeTab === "email" && <EmailForm />}
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

function EmailForm() {
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [smtpFrom, setSmtpFrom] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/content/settings/email").then(r => r.json()).then(data => {
      if (data.smtp_host !== undefined) setSmtpHost(data.smtp_host);
      if (data.smtp_port !== undefined) setSmtpPort(data.smtp_port);
      if (data.smtp_user !== undefined) setSmtpUser(data.smtp_user);
      if (data.smtp_pass !== undefined) setSmtpPass(data.smtp_pass);
      if (data.smtp_from !== undefined) setSmtpFrom(data.smtp_from);
    });
  }, []);

  async function handleSave() {
    setSaving(true); setMessage("");
    const res = await fetch("/api/content/settings/email", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ smtp_host: smtpHost, smtp_port: smtpPort, smtp_user: smtpUser, smtp_pass: smtpPass, smtp_from: smtpFrom }),
    });
    setMessage((await res.json()).message);
    setSaving(false);
  }

  return (
    <div style={{ maxWidth: 500 }}>
      <p style={{ marginBottom: 15, color: "#666", fontSize: 14 }}>
        Configure SMTP to send verification codes to admin email addresses.
      </p>
      <input placeholder="SMTP Host (e.g. smtp.gmail.com)" value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10, border: "1px solid #ddd", borderRadius: 6 }} />
      <input placeholder="SMTP Port (e.g. 587)" value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10, border: "1px solid #ddd", borderRadius: 6 }} />
      <input placeholder="SMTP Username" value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10, border: "1px solid #ddd", borderRadius: 6 }} />
      <input type="password" placeholder="SMTP Password" value={smtpPass} onChange={(e) => setSmtpPass(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10, border: "1px solid #ddd", borderRadius: 6 }} />
      <input placeholder="From email (e.g. noreply@kmcq-gmbh.com)" value={smtpFrom} onChange={(e) => setSmtpFrom(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10, border: "1px solid #ddd", borderRadius: 6 }} />
      <button onClick={handleSave} disabled={saving}
        style={{ padding: "12px 24px", background: "#040f2d", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
        {saving ? "Saving..." : "Save SMTP Settings"}
      </button>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}

function SocialLinksForm() {
  const [links, setLinks] = useState<{ platform: string; url: string; icon: string }[]>([]);
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
