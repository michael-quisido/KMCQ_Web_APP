"use client";

import ImageUpload from "@/components/admin/ImageUpload";
import MediaGrid from "@/components/admin/MediaGrid";

export default function MediaPage() {
  function handleUploaded() {
    window.location.reload();
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: "bold" }}>Media Library</h1>
        <ImageUpload onUploaded={handleUploaded} />
      </div>
      <MediaGrid />
    </div>
  );
}
