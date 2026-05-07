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
        <span className="legal-date">Last updated: May 7, 2026</span>
        <div className="legal-divider" />

        <div className="legal-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using the Dardan Barbershop website, you accept and
            agree to be bound by these Terms of Service. If you do not agree,
            please do not use this site.
          </p>
        </div>

        <div className="legal-section">
          <h2>2. Services</h2>
          <p>
            Dardan Barbershop provides professional barbering services including
            haircuts, beard trims, hair colouring, and related grooming
            services. Service availability and pricing are subject to change
            without notice.
          </p>
        </div>

        <div className="legal-section">
          <h2>3. Appointments & Cancellations</h2>
          <p>
            Appointments can be booked through our website. We ask that you:
          </p>
          <ul>
            <li>Arrive on time for your scheduled appointment</li>
            <li>
              Provide at least 24 hours notice if you need to cancel or
              reschedule
            </li>
            <li>Contact us directly for any urgent changes</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>4. Pricing</h2>
          <p>
            All prices are listed in Macedonian Denars (MKD). Prices are subject
            to change. The price displayed at the time of booking is the price
            you will be charged.
          </p>
        </div>

        <div className="legal-section">
          <h2>5. User Conduct</h2>
          <p>
            You agree not to misuse our website or services. This includes but
            is not limited to: submitting false information, attempting to
            disrupt the site, or using the site for any unlawful purpose.
          </p>
        </div>

        <div className="legal-section">
          <h2>6. Intellectual Property</h2>
          <p>
            All content on this website — including logos, images, and text — is
            the property of Dardan Barbershop and may not be reproduced without
            permission.
          </p>
        </div>

        <div className="legal-section">
          <h2>7. Limitation of Liability</h2>
          <p>
            Dardan Barbershop is not liable for any indirect, incidental, or
            consequential damages arising from the use of this website or our
            services.
          </p>
        </div>

        <div className="legal-section">
          <h2>8. Changes to Terms</h2>
          <p>
            We reserve the right to update these Terms at any time. Continued
            use of the site after changes constitutes acceptance of the new
            Terms.
          </p>
        </div>

        <div className="legal-section">
          <h2>9. Contact</h2>
          <p>
            For any questions regarding these Terms, contact us at Dardan
            Barbershop, Dibër, Macedonia.
          </p>
        </div>
      </div>
    </main>
  );
}
