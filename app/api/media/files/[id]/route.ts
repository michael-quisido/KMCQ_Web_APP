import { NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { query } from "@/lib/db";
import { unlink } from "fs/promises";
import path from "path";
import type { RowDataPacket } from "mysql2/promise";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const files = await query("SELECT * FROM media_files WHERE id = ?", [id]) as RowDataPacket[];
  if (files.length === 0) return NextResponse.json({ error: "File not found" }, { status: 404 });

  const filePath = path.join(process.cwd(), "public", files[0].path);
  await unlink(filePath).catch(() => {});
  await query("DELETE FROM media_files WHERE id = ?", [id]);

  return NextResponse.json({ message: "Deleted" });
}
