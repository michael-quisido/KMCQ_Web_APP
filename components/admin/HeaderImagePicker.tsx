"use client";

import { useState } from "react";
import Image from "next/image";
import MediaGrid from "./MediaGrid";
import ImageUpload from "./ImageUpload";

interface HeaderImagePickerProps {
  value: string;
  onChange: (url: string) => void;
}

export default function HeaderImagePicker({ value, onChange }: HeaderImagePickerProps) {
  const [showBrowser, setShowBrowser] = useState(false);

  return (
    <div>
      <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Header Image</label>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/header_images/tazz.jpg"
          style={{ flex: 1, padding: 10, border: "1px solid #ddd", borderRadius: 6 }}
        />
        <button onClick={() => setShowBrowser(!showBrowser)}
          style={{ padding: "10px 16px", background: "#6c757d", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
          {showBrowser ? "Close" : "Browse Media"}
        </button>
        <ImageUpload onUploaded={(url) => onChange(url)} />
      </div>
      {value && (
        <div style={{ marginBottom: 8, maxWidth: 400 }}>
          <Image src={value} alt="Header preview" width={400} height={130}
            style={{ width: "100%", height: "auto", borderRadius: 6, border: "1px solid #ddd", objectFit: "cover" }}
            unoptimized />
        </div>
      )}
      {showBrowser && (
        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, background: "#f9f9f9", maxHeight: 400, overflow: "auto" }}>
          <MediaGrid onSelect={(url) => { onChange(url); setShowBrowser(false); }} />
        </div>
      )}
    </div>
  );
}
