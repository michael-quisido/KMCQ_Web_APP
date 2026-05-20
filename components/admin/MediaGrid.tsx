"use client";

import { useState, useEffect } from "react";

interface MediaFile {
  id: number; filename: string; original_name: string; path: string; mime_type: string; size: number;
}

interface MediaGridProps {
  onSelect?: (url: string) => void;
}

export default function MediaGrid({ onSelect }: MediaGridProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [folders, setFolders] = useState<{ id: number; name: string; parent_id: number | null }[]>([]);
  const [currentFolder, setCurrentFolder] = useState<number | null>(null);
  const [renaming, setRenaming] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [newFolderName, setNewFolderName] = useState("");

  async function loadFiles() {
    const params = currentFolder ? `?folder_id=${currentFolder}` : "";
    const [filesRes, foldersRes] = await Promise.all([
      fetch(`/api/media/files${params}`),
      fetch("/api/media/folders"),
    ]);
    setFiles(await filesRes.json());
    setFolders(await foldersRes.json());
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const params = currentFolder ? `?folder_id=${currentFolder}` : "";
      const [filesRes, foldersRes] = await Promise.all([
        fetch(`/api/media/files${params}`),
        fetch("/api/media/folders"),
      ]);
      if (!cancelled) {
        setFiles(await filesRes.json());
        setFolders(await foldersRes.json());
      }
    }
    load();
    return () => { cancelled = true; };
  }, [currentFolder]);

  async function handleDelete(id: number) {
    if (!confirm("Delete this file?")) return;
    await fetch(`/api/media/files/${id}`, { method: "DELETE" });
    loadFiles();
  }

  async function handleRename(id: number) {
    if (!newName) return;
    await fetch("/api/media/files/rename", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, newFilename: newName }),
    });
    setRenaming(null);
    setNewName("");
    loadFiles();
  }

  async function handleNewFolder() {
    if (!newFolderName) return;
    await fetch("/api/media/folders", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newFolderName, parent_id: currentFolder }),
    });
    setNewFolderName("");
    loadFiles();
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
        <input value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="New folder name"
          style={{ padding: 8, border: "1px solid #ddd", borderRadius: 4 }} />
        <button onClick={handleNewFolder} style={{ padding: "8px 16px", background: "#040f2d", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>Add Folder</button>
        {currentFolder && <button onClick={() => setCurrentFolder(null)} style={{ padding: "8px 16px", background: "#6c757d", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>Root</button>}
      </div>

      {folders.filter(f => currentFolder ? f.parent_id === currentFolder : !f.parent_id).map(f => (
        <div key={f.id} onClick={() => setCurrentFolder(f.id)} style={{ cursor: "pointer", padding: 8, background: "#e9ecef", borderRadius: 4, marginBottom: 4, display: "inline-block", marginRight: 8 }}>
          📁 {f.name}
        </div>
      ))}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginTop: 16 }}>
        {files.map(f => (
          <div key={f.id} style={{ border: "1px solid #ddd", borderRadius: 8, overflow: "hidden", background: "white" }}>
            <img src={f.path} alt={f.original_name} style={{ width: "100%", height: 150, objectFit: "cover" }}
              onClick={() => onSelect?.(f.path)} />
            <div style={{ padding: 8 }}>
              {renaming === f.id ? (
                <div style={{ display: "flex", gap: 4 }}>
                  <input value={newName} onChange={(e) => setNewName(e.target.value)} style={{ flex: 1, padding: 4, border: "1px solid #ddd", borderRadius: 4 }} />
                  <button onClick={() => handleRename(f.id)} style={{ cursor: "pointer" }}>✓</button>
                  <button onClick={() => setRenaming(null)} style={{ cursor: "pointer" }}>✗</button>
                </div>
              ) : (
                <p style={{ fontSize: 12, wordBreak: "break-all" }}>{f.original_name}</p>
              )}
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <button onClick={() => { setRenaming(f.id); setNewName(f.original_name?.replace(/\.[^.]+$/, "") || ""); }} style={{ fontSize: 12, cursor: "pointer", background: "none", border: "none", color: "#007bff" }}>Rename</button>
                <button onClick={() => handleDelete(f.id)} style={{ fontSize: 12, cursor: "pointer", background: "none", border: "none", color: "red" }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {files.length === 0 && <p style={{ color: "#999", textAlign: "center", padding: 40 }}>No files yet.</p>}
    </div>
  );
}
