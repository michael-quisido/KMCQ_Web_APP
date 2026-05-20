import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET(req: NextRequest) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const folderId = req.nextUrl.searchParams.get("folder_id");
  let sql = "SELECT * FROM media_files";
  const params: (string | number)[] = [];
  if (folderId) { sql += " WHERE folder_id = ?"; params.push(folderId); }
  sql += " ORDER BY created_at DESC";

  const rows = await query(sql, params);
  return NextResponse.json(rows);
}
