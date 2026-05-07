import Link from "next/link";

export const metadata = {
  title: "Terms of Service — Dardan Barbershop",
};

export default function TermsOfService() {
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
        <h1 className="legal-title">Terms of Service</h1>
        <span className="legal-date">Last updated: May 2026</span>
        <div className="legal-divider" />

        <div className="legal-section">
          <p>
            By using the Barbershop Dardan website or booking services, you
            agree to the following terms.
          </p>
        </div>

        <div className="legal-section">
          <h2>Appointments</h2>
          <ul>
            <li>Clients are encouraged to arrive on time.</li>
            <li>
              Late arrivals may result in shortened or canceled appointments.
            </li>
            <li>Appointments can be canceled or rescheduled in advance.</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>Payments</h2>
          <ul>
            <li>
              Prices for services are displayed in the shop or on our
              website/social media.
            </li>
            <li>Payment is due after services are completed.</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>Conduct</h2>
          <p>
            We reserve the right to refuse service to anyone displaying
            inappropriate, abusive, or unsafe behavior.
          </p>
        </div>

        <div className="legal-section">
          <h2>Website Usage</h2>
          <p>
            You agree not to misuse the website, attempt unauthorized access, or
            disrupt website functionality.
          </p>
        </div>

        <div className="legal-section">
          <h2>Content</h2>
          <p>
            All website content including logos, photos, and designs belongs to
            Barbershop Dardan unless otherwise stated.
          </p>
        </div>

        <div className="legal-section">
          <h2>Limitation of Liability</h2>
          <p>
            We aim to provide accurate information and quality services, but we
            are not responsible for:
          </p>
          <ul>
            <li>Temporary website downtime</li>
            <li>Third-party service interruptions</li>
            <li>Indirect damages resulting from website use</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>Changes to Terms</h2>
          <p>
            We may update these Terms of Service at any time. Continued use of
            the website means you accept the updated terms.
          </p>
        </div>

        <div className="legal-section">
          <h2>Contact</h2>
          <p>
            <strong style={{ color: "rgba(255,255,255,0.7)" }}>
              Barbershop Dardan
            </strong>
            <br />
            Atanasie Iliq, Debar, North Macedonia
            <br />
            Phone: <a href="tel:072646141">072 646 141</a>
          </p>
        </div>
      </div>
    </main>
  );
}
