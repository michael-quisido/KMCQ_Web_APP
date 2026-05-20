"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code" | "credentials">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSendCode() {
    setError(""); setMessage("");
    const res = await fetch("/api/auth/send-code", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (res.ok) { setMessage("Code sent to " + email + (data.code ? `<br/>Dev code: ${data.code}` : "")); setStep("code"); }
    else setError(data.error);
  }

  async function handleVerifyCode() {
    setError(""); setMessage("");
    const res = await fetch("/api/auth/verify-code", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    if (res.ok) { setMessage("Code verified"); setStep("credentials"); }
    else setError(data.error);
  }

  async function handleLogin() {
    setError(""); setMessage("");
    const res = await fetch("/api/auth/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    });
    const data = await res.json();
    if (res.ok) { router.push("/administrator"); }
    else setError(data.error);
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#040f2d" }}>
      <div style={{ background: "white", padding: "40px", borderRadius: 12, width: 400, maxWidth: "90%" }}>
        <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#040f2d" }}>Admin Login</h1>
        {error && <p style={{ color: "red", marginBottom: 10 }}>{error}</p>}
        {message && <p style={{ color: "green", marginBottom: 10 }} dangerouslySetInnerHTML={{ __html: message }} />}

        {step === "email" && (
          <div>
            <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: 10, marginBottom: 10, border: "1px solid #ddd", borderRadius: 6 }} />
            <button onClick={handleSendCode} style={{ width: "100%", padding: 10, background: "#040f2d", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>Send Code</button>
          </div>
        )}

        {step === "code" && (
          <div>
            <input type="text" placeholder="6-digit code" value={code} onChange={(e) => setCode(e.target.value)} maxLength={6}
              style={{ width: "100%", padding: 10, marginBottom: 10, border: "1px solid #ddd", borderRadius: 6 }} />
            <button onClick={handleVerifyCode} style={{ width: "100%", padding: 10, background: "#040f2d", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>Verify Code</button>
          </div>
        )}

        {step === "credentials" && (
          <div>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}
              style={{ width: "100%", padding: 10, marginBottom: 10, border: "1px solid #ddd", borderRadius: 6 }} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: 10, marginBottom: 10, border: "1px solid #ddd", borderRadius: 6 }} />
            <button onClick={handleLogin} style={{ width: "100%", padding: 10, background: "#040f2d", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>Login</button>
          </div>
        )}
      </div>
    </div>
  );
}
