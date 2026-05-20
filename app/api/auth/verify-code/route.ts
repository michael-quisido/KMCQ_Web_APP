import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) return NextResponse.json({ error: "Email and code required" }, { status: 400 });

    const users = await query("SELECT id FROM admins WHERE email = ? AND code = ?", [email, code]) as any[];
    if (users.length === 0) return NextResponse.json({ error: "Invalid code" }, { status: 401 });

    return NextResponse.json({ message: "Code verified", email });
  } catch (err) {
    console.error("verify-code error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
