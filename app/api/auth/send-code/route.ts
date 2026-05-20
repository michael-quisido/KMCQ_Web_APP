import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import type { RowDataPacket } from "mysql2/promise";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const users = await query("SELECT id FROM admins WHERE email = ?", [email]) as RowDataPacket[];
    if (users.length === 0) return NextResponse.json({ error: "Email not found" }, { status: 404 });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await query("UPDATE admins SET code = ? WHERE email = ?", [code, email]);

    console.log(`[ADMIN AUTH] Verification code for ${email}: ${code}`);

    return NextResponse.json({ message: "Code sent", code });
  } catch (err) {
    console.error("send-code error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
