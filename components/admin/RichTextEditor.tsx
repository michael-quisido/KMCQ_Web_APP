"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Image, Link.configure({ openOnClick: false })],
    content: content || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  function addImage() {
    const url = prompt("Image URL:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8 }}>
      <div style={{ display: "flex", gap: 4, padding: 8, borderBottom: "1px solid #ddd", background: "#f9f9f9", flexWrap: "wrap" }}>
        <button onClick={() => editor.chain().focus().toggleBold().run()} style={{ padding: "4px 8px", fontWeight: editor.isActive("bold") ? "bold" : "normal", cursor: "pointer" }}>B</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} style={{ padding: "4px 8px", fontStyle: "italic", cursor: "pointer" }}>I</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} style={{ padding: "4px 8px", cursor: "pointer" }}>H2</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} style={{ padding: "4px 8px", cursor: "pointer" }}>H3</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} style={{ padding: "4px 8px", cursor: "pointer" }}>UL</button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} style={{ padding: "4px 8px", cursor: "pointer" }}>OL</button>
        <button onClick={addImage} style={{ padding: "4px 8px", cursor: "pointer" }}>🖼️</button>
        <button onClick={() => { const url = prompt("Link URL:"); if (url) editor.chain().focus().setLink({ href: url }).run(); }} style={{ padding: "4px 8px", cursor: "pointer" }}>🔗</button>
        <button onClick={() => editor.chain().focus().undo().run()} style={{ padding: "4px 8px", cursor: "pointer" }}>↩</button>
        <button onClick={() => editor.chain().focus().redo().run()} style={{ padding: "4px 8px", cursor: "pointer" }}>↪</button>
      </div>
      <EditorContent editor={editor} style={{ padding: 16, minHeight: 300 }} />
    </div>
  );
}
