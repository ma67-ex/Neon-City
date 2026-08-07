"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/authStore";
import { Login } from "@/components/Login";

// Canvas/WebGL/Rapier all need the browser — no server render for the game itself.
const Game = dynamic(() => import("@/components/Game"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#050814",
        color: "#fff",
        fontFamily: "monospace",
      }}
    >
      Loading Neon City Drive…
    </div>
  ),
});

export default function Home() {
  const user = useAuthStore((s) => s.user);
  // useAuthStore's initial state reads localStorage, which only exists
  // client-side — the server always renders as signed-out. Deferring the
  // real check to after mount keeps the client's first render matching the
  // server's, instead of hydrating straight into a mismatch.
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);
  if (!hasMounted) return null;
  return user ? <Game /> : <Login />;
}
