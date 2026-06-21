import { NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { query } from "@/lib/db";
import type { RowDataPacket } from "mysql2/promise";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const folders = await query("SELECT * FROM media_folders WHERE id = ?", [id]) as RowDataPacket[];
  if (folders.length === 0) return NextResponse.json({ error: "Folder not found" }, { status: 404 });

  await query("UPDATE media_files SET folder_id = NULL WHERE folder_id = ?", [id]);
  await query("DELETE FROM media_folders WHERE id = ?", [id]);

  return NextResponse.json({ message: "Folder deleted" });
}
