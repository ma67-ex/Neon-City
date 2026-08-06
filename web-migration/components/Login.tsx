"use client";

import { useEffect, useRef } from "react";
import { useAuthStore, decodeCredential } from "@/lib/authStore";

// minimal shape of the Google Identity Services API we touch — no @types
// package for this, it's a handful of calls off a script-injected global
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (res: { credential: string }) => void }) => void;
          renderButton: (parent: HTMLElement, options: { theme: string; size: string; shape: string }) => void;
        };
      };
    };
  }
}

export function Login() {
  const signIn = useAuthStore((s) => s.signIn);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      if (!buttonRef.current || !window.google) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (res) => signIn(decodeCredential(res.credential)),
      });
      window.google.accounts.id.renderButton(buttonRef.current, { theme: "filled_black", size: "large", shape: "pill" });
    };
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [signIn]);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        background: "#050814",
        color: "#fff",
        fontFamily: "monospace",
      }}
    >
      <div style={{ fontSize: 28, letterSpacing: 4 }}>NEON CITY DRIVE</div>
      {clientId ? (
        <div ref={buttonRef} />
      ) : (
        <div style={{ opacity: 0.7, fontSize: 13 }}>
          Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID — see .env.local
        </div>
      )}
      <div style={{ opacity: 0.5, fontSize: 12 }}>Sign in to save and resume your progress</div>
    </div>
  );
}
