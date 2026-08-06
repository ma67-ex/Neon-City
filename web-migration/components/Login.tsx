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

const BG_SLIDES = ["/login-bg/bg1.jpg", "/login-bg/bg2.jpg", "/login-bg/bg3.jpg", "/login-bg/bg4.jpg", "/login-bg/bg5.jpg", "/login-bg/bg6.jpg", "/login-bg/bg7.jpg"];

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
    <div id="login">
      <div className="bg-slides">
        {BG_SLIDES.map((src) => (
          <div key={src} className="bg-slide" style={{ backgroundImage: `url(${src})` }} />
        ))}
      </div>
      <div className="bg-dim" />
      <div className="grid" />
      <div className="content">
        <div className="title">NEON CITY DRIVE</div>
        <div className="subtitle">Sign in to save and resume your progress</div>
        {clientId ? (
          <div className="card">
            <div ref={buttonRef} />
          </div>
        ) : (
          <div className="missing">
            Missing <code>NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> — see <code>.env.local</code>
          </div>
        )}
      </div>
    </div>
  );
}
