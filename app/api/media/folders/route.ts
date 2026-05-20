import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await query("SELECT * FROM media_folders ORDER BY name ASC");
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, parent_id } = await req.json();
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const result = await query("INSERT INTO media_folders (name, parent_id) VALUES (?, ?)", [name, parent_id || null]) as any;
  return NextResponse.json({ id: result.insertId, name });
}
