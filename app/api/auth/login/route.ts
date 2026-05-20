import { NextRequest, NextResponse } from "next/server";
import { signToken, verifyPassword } from "@/lib/auth";
import { query } from "@/lib/db";
import { AUTH_COOKIE_NAME } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const { email, username, password } = await req.json();
    if (!email || !username || !password) return NextResponse.json({ error: "All fields required" }, { status: 400 });

    const users = await query("SELECT id, email, username, password_hash FROM admins WHERE email = ? AND username = ?", [email, username]) as any[];
    if (users.length === 0) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const admin = users[0];
    const valid = await verifyPassword(password, admin.password_hash);
    if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    await query("UPDATE admins SET code = NULL WHERE id = ?", [admin.id]);

    const token = signToken({ id: admin.id, email: admin.email, username: admin.username });

    const response = NextResponse.json({ message: "Login successful" });
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
