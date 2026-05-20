"use client";

import { useState, useRef } from "react";

interface ImageUploadProps {
  onUploaded: (url: string) => void;
}

export default function ImageUpload({ onUploaded }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/media/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (res.ok) onUploaded(data.path);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} id="image-upload" />
      <label htmlFor="image-upload" style={{ padding: "8px 16px", background: "#040f2d", color: "white", borderRadius: 6, cursor: uploading ? "not-allowed" : "pointer", display: "inline-block" }}>
        {uploading ? "Uploading..." : "Upload Image"}
      </label>
    </div>
  );
}
