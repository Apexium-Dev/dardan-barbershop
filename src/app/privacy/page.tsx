import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Dardan Barbershop",
};

export default function PrivacyPolicy() {
  return (
    <main
      style={{
        backgroundColor: "#0f0f0f",
        color: "#ffffff",
        minHeight: "100vh",
      }}
    >
      <style>{`
        .legal-page {
          max-width: 720px;
          margin: 0 auto;
          padding: 120px 32px 96px;
        }

        .legal-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: #c9a961;
          font-weight: 700;
          text-decoration: none;
          margin-bottom: 56px;
          transition: opacity 200ms ease;
        }

        .legal-back:hover { opacity: 0.7; }

        .legal-eyebrow {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: #c9a961;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .legal-title {
          font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(36px, 5vw, 56px);
          font-weight: 400;
          color: #ffffff;
          margin: 0 0 12px 0;
          line-height: 1.1;
        }

        .legal-date {
          font-size: 12px;
          color: rgba(255,255,255,0.3);
          margin-bottom: 56px;
          display: block;
        }

        .legal-divider {
          width: 100%;
          height: 1px;
          background: rgba(255,255,255,0.07);
          margin-bottom: 48px;
        }

        .legal-section {
          margin-bottom: 40px;
        }

        .legal-section h2 {
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 20px;
          font-weight: 400;
          color: #ffffff;
          margin: 0 0 12px 0;
        }

        .legal-section p, .legal-section li {
          font-size: 14px;
          line-height: 1.85;
          color: rgba(255,255,255,0.5);
          font-weight: 300;
          margin: 0 0 10px 0;
        }

        .legal-section ul {
          padding-left: 20px;
          margin: 0 0 10px 0;
        }

        .legal-section a {
          color: #c9a961;
          text-decoration: none;
        }

        .legal-section a:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="legal-page">
        <Link href="/" className="legal-back">
          ← Back to home
        </Link>

        <p className="legal-eyebrow">Legal</p>
        <h1 className="legal-title">Privacy Policy</h1>
        <span className="legal-date">Last updated: May 7, 2026</span>
        <div className="legal-divider" />

        <div className="legal-section">
          <h2>1. Information We Collect</h2>
          <p>
            When you use our website or book an appointment, we may collect the
            following information:
          </p>
          <ul>
            <li>Name, phone number, and email address (when booking)</li>
            <li>Usage data and analytics (via Vercel Analytics)</li>
            <li>Device and browser information</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Confirm and manage your appointments</li>
            <li>Send reminders or updates about your booking</li>
            <li>Improve our website and services</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>3. Data Sharing</h2>
          <p>
            We do not sell or share your personal data with third parties. Your
            information is used solely to operate and improve our services.
          </p>
        </div>

        <div className="legal-section">
          <h2>4. Cookies & Analytics</h2>
          <p>
            We use Vercel Analytics to understand how visitors use our site.
            This data is anonymous and does not identify individual users.
          </p>
        </div>

        <div className="legal-section">
          <h2>5. Data Retention</h2>
          <p>
            We retain your personal data only for as long as necessary to
            fulfill the purposes outlined in this policy.
          </p>
        </div>

        <div className="legal-section">
          <h2>6. Your Rights</h2>
          <p>
            You have the right to request access to, correction of, or deletion
            of your personal data. Contact us at any time.
          </p>
        </div>

        <div className="legal-section">
          <h2>7. Contact</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at Dardan Barbershop, Dibër, Macedonia.
          </p>
        </div>
      </div>
    </main>
  );
}
