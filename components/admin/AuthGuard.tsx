"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/administrator/login";

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (r.ok) setAuthed(true);
        else { setAuthed(false); if (!isLoginPage) router.push("/administrator/login"); }
      })
      .catch(() => { setAuthed(false); if (!isLoginPage) router.push("/administrator/login"); });
  }, [router, isLoginPage]);

  if (authed === null && isLoginPage) return <>{children}</>;
  if (authed === null) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#040f2d" }}><p style={{ color: "white", fontSize: 20 }}>Loading...</p></div>;
  if (!authed && !isLoginPage) return null;
  return <>{children}</>;
}
