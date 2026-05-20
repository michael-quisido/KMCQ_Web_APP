import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { query } from "@/lib/db";
import { rename } from "fs/promises";
import path from "path";

export async function PUT(req: NextRequest) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, newFilename } = await req.json();
  if (!id || !newFilename) return NextResponse.json({ error: "id and newFilename required" }, { status: 400 });

  const files = await query("SELECT * FROM media_files WHERE id = ?", [id]) as any[];
  if (files.length === 0) return NextResponse.json({ error: "File not found" }, { status: 404 });

  const file = files[0];
  const ext = file.filename.split(".").pop();
  const newName = `${newFilename}.${ext}`;
  const oldPath = path.join(process.cwd(), "public", file.path);
  const newPath = path.join(process.cwd(), "public", "media", "images", newName);

  await rename(oldPath, newPath);
  await query("UPDATE media_files SET filename = ?, original_name = ? WHERE id = ?", [newName, newFilename, id]);

  return NextResponse.json({ message: "Renamed" });
}
