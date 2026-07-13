"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export default function PrivacyContent() {
  const { t } = useLanguage();
  const l = t.legal;
  const p = t.legal.privacy;

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
          {l.backHome}
        </Link>

        <p className="legal-eyebrow">{l.legalLabel}</p>
        <h1 className="legal-title">{p.title}</h1>
        <span className="legal-date">{l.lastUpdated}</span>
        <div className="legal-divider" />

        <div className="legal-section">
          <p>{p.intro}</p>
        </div>

        <div className="legal-section">
          <h2>{p.infoCollectTitle}</h2>
          <p>{p.infoCollectIntro}</p>
          <ul>
            {p.infoCollectItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="legal-section">
          <h2>{p.infoUseTitle}</h2>
          <p>{p.infoUseIntro}</p>
          <ul>
            {p.infoUseItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="legal-section">
          <h2>{p.sharingTitle}</h2>
          <p>{p.sharingBody}</p>
        </div>

        <div className="legal-section">
          <h2>{p.securityTitle}</h2>
          <p>{p.securityBody}</p>
        </div>

        <div className="legal-section">
          <h2>{p.cookiesTitle}</h2>
          <p>{p.cookiesBody}</p>
        </div>

        <div className="legal-section">
          <h2>{p.rightsTitle}</h2>
          <p>{p.rightsIntro}</p>
          <ul>
            {p.rightsItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>{p.rightsOutro}</p>
        </div>

        <div className="legal-section">
          <h2>{p.contactTitle}</h2>
          <p>
            <strong style={{ color: "rgba(255,255,255,0.7)" }}>
              Barbershop Dardan
            </strong>
            <br />
            Atanasie Iliq, Debar, North Macedonia
            <br />
            Phone: <a href="tel:+38972646141">+389 72 646 141</a>
          </p>
        </div>
      </div>
    </main>
  );
}
