import Link from "next/link";

export const metadata = { title: "Terms - Neon City Drive" };

export default function TermsPage() {
  return (
    <div className="legal-page">
      <div className="legal-hero" style={{ backgroundImage: "url(/login-bg/bg5.jpg)" }}>
        <Link href="/" className="legal-back">
          ← Back
        </Link>
        <h1>Terms of Use</h1>
        <p className="updated">Last updated 2026</p>
      </div>

      <div className="legal-body">
        <section>
          <h2>What this is</h2>
          <p>Neon City Drive is a free, non-commercial browser driving sandbox. Use it at your own risk.</p>
        </section>

        <section>
          <h2>No warranty</h2>
          <p>
            Provided as-is, with no guarantee it will run correctly, save your progress reliably, or stay available.
            Nothing here is a paid product or service.
          </p>
        </section>

        <section>
          <h2>Your data</h2>
          <p>
            Game saves live only in your browser&apos;s local storage. Clearing your browser data or switching
            devices loses your save. See the <Link href="/privacy">Privacy Policy</Link> for details.
          </p>
        </section>
      </div>
    </div>
  );
}
