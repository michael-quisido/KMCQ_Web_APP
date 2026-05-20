"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (r.ok) setAuthed(true);
        else { setAuthed(false); router.push("/administrator/login"); }
      })
      .catch(() => { setAuthed(false); router.push("/administrator/login"); });
  }, [router]);

  if (authed === null) return <div className="flex items-center justify-center h-screen" style={{ background: "#040f2d" }}><p style={{ color: "white", fontSize: 20 }}>Loading...</p></div>;
  if (!authed) return null;
  return <>{children}</>;
}
