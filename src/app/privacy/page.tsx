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
        <span className="legal-date">Last updated: May 2026</span>
        <div className="legal-divider" />

        <div className="legal-section">
          <p>
            Welcome to Barbershop Dardan. We respect your privacy and are
            committed to protecting any personal information you share with us
            through our website, social media pages, or booking/contact forms.
          </p>
        </div>

        <div className="legal-section">
          <h2>Information We Collect</h2>
          <p>We may collect:</p>
          <ul>
            <li>Name</li>
            <li>Phone number</li>
            <li>Email address</li>
            <li>Appointment details</li>
            <li>Messages you send us</li>
            <li>Basic website usage information (such as pages visited)</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Book and manage appointments</li>
            <li>Contact you about your booking</li>
            <li>Improve our services and website</li>
            <li>Respond to questions or requests</li>
            <li>Send updates or promotions (only if you agree)</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>Information Sharing</h2>
          <p>
            We do not sell or rent your personal information. Your data may only
            be shared with trusted service providers that help us operate the
            website or booking system.
          </p>
        </div>

        <div className="legal-section">
          <h2>Data Security</h2>
          <p>
            We take reasonable measures to protect your information from
            unauthorized access, loss, or misuse.
          </p>
        </div>

        <div className="legal-section">
          <h2>Cookies</h2>
          <p>
            Our website may use cookies to improve user experience and analyze
            website traffic.
          </p>
        </div>

        <div className="legal-section">
          <h2>Your Rights</h2>
          <p>You may request to:</p>
          <ul>
            <li>Access your data</li>
            <li>Correct your information</li>
            <li>Delete your information</li>
            <li>Stop receiving promotional messages</li>
          </ul>
          <p>To do so, contact us using the information below.</p>
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
