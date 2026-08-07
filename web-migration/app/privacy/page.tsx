import Link from "next/link";

export const metadata = { title: "Privacy - Neon City Drive" };

export default function PrivacyPage() {
  return (
    <div className="legal-page">
      <div className="legal-hero" style={{ backgroundImage: "url(/login-bg/bg2.jpg)" }}>
        <Link href="/" className="legal-back">
          ← Back
        </Link>
        <h1>Privacy Policy</h1>
        <p className="updated">Last updated 2026</p>
      </div>

      <div className="legal-body">
        <section>
          <h2>What we collect</h2>
          <p>
            Signing in with Google shares your name, profile picture, and a stable account ID with this app, read
            directly from the sign-in token in your browser. Choosing &quot;Continue as guest&quot; shares nothing.
          </p>
        </section>

        <section>
          <h2>Where it goes</h2>
          <p>
            Nowhere. There is no backend server. Your name, picture, and game save are stored only in your
            browser&apos;s local storage, on your device. Nothing is transmitted to us or any third party.
          </p>
        </section>

        <section>
          <h2>How to remove it</h2>
          <ul>
            <li>Click &quot;Log out&quot; in-game to clear your session.</li>
            <li>Clear your browser&apos;s site data for this domain to remove everything, including saves.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
