"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuthStore, decodeCredential } from "@/lib/authStore";

// minimal shape of the Google Identity Services API we touch — no @types
// package for this, it's a handful of calls off a script-injected global
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (res: { credential: string }) => void;
            error_callback?: (err: { type?: string }) => void;
          }) => void;
          renderButton: (parent: HTMLElement, options: { theme: string; size: string; shape: string }) => void;
        };
      };
    };
  }
}

const BG_SLIDES = ["/login-bg/bg1.jpg", "/login-bg/bg2.jpg", "/login-bg/bg3.jpg", "/login-bg/bg4.jpg", "/login-bg/bg5.jpg", "/login-bg/bg6.jpg", "/login-bg/bg7.jpg"];

export function Login() {
  const signIn = useAuthStore((s) => s.signIn);
  const signInGuest = useAuthStore((s) => s.signInGuest);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

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
        callback: (res) => {
          try {
            signIn(decodeCredential(res.credential));
          } catch {
            setError("Sign-in failed — try again");
          }
        },
        error_callback: () => setError("Sign-in failed — try again"),
      });
      window.google.accounts.id.renderButton(buttonRef.current, { theme: "filled_black", size: "large", shape: "pill" });
    };
    script.onerror = () => setError("Couldn't reach Google — check your connection");
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [signIn]);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  return (
    <div id="login">
      {BG_SLIDES.map((src) => (
        <link key={src} rel="preload" as="image" href={src} />
      ))}
      <div className="bg-slides">
        {BG_SLIDES.map((src) => (
          <div key={src} className="bg-slide" style={{ backgroundImage: `url(${src})` }} />
        ))}
      </div>
      <div className="content">
        <div className="title">NEON CITY DRIVE</div>
        <div className="subtitle">Sign in to save and resume your progress</div>
        <div className="card">
          {clientId ? (
            <div ref={buttonRef} />
          ) : (
            <div className="missing">
              Missing <code>NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> — see <code>.env.local</code>
            </div>
          )}
          {error && <div className="signin-error">{error}</div>}
          <button type="button" className="guest-btn" onClick={signInGuest}>
            Continue as guest
          </button>
        </div>
        <div className="legal">
          <Link href="/privacy">Privacy</Link>
          <span>·</span>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
    </div>
  );
}
