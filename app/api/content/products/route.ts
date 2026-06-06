import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { query } from "@/lib/db";
import type { RowDataPacket } from "mysql2/promise";

export async function GET() {
  const rows = await query("SELECT * FROM products ORDER BY sort_order ASC") as RowDataPacket[];
  return NextResponse.json(rows);
}

export async function PUT(req: NextRequest) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { products } = await req.json();
  await query("DELETE FROM products");
  for (let i = 0; i < products.length; i++) {
    await query("INSERT INTO products (name, icon, description, content, url, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
      [products[i].name, products[i].icon || "", products[i].description || "", products[i].content || "", products[i].url || "", i]);
  }
  return NextResponse.json({ message: "Saved" });
}
