import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { query } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const folderId = formData.get("folder_id") as string | null;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const ext = file.name.split(".").pop();
  const filename = `${uuidv4()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "media", "images");
  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  const filePath = `/media/images/${filename}`;
  const rows = await query(
    "INSERT INTO media_files (filename, original_name, path, folder_id, mime_type, size) VALUES (?, ?, ?, ?, ?, ?)",
    [filename, file.name, filePath, folderId || null, file.type, file.size]
  ) as any;

  return NextResponse.json({ id: rows.insertId, filename, path: filePath, original_name: file.name });
}
