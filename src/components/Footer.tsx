"use client";

import React from "react";
import Image from "next/image";

const footerStyles = `
  .footer {
    background-color: #0a0a0a;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    padding: 80px 48px 40px;
  }

  .footer-inner {
    max-width: 90rem;
    margin: 0 auto;
  }

  .footer-top {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 64px;
    padding-bottom: 56px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    margin-bottom: 32px;
  }

  /* Brand column */
  .footer-logo {
    margin-bottom: 20px;
    opacity: 0.9;
    display: block;
  }

  .footer-tagline {
    font-size: 13px;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.35);
    font-weight: 300;
    max-width: 280px;
    margin: 0 0 24px 0;
  }

  /* Social icons */
  .footer-socials {
    display: flex;
    gap: 12px;
  }

  .footer-social-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.4);
    text-decoration: none;
    transition: all 200ms ease;
  }

  .footer-social-btn:hover {
    border-color: #c9a961;
    color: #c9a961;
    transform: translateY(-2px);
  }

  .footer-social-btn svg {
    width: 15px;
    height: 15px;
  }

  /* Column headings */
  .footer-col-label {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    color: #c9a961;
    font-weight: 700;
    margin: 0 0 20px 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .footer-col-label::after {
    content: '';
    display: block;
    height: 1px;
    width: 24px;
    background: #c9a961;
    opacity: 0.4;
  }

  /* Location column */
  .footer-address {
    font-size: 14px;
    line-height: 1.8;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 300;
    margin: 0 0 16px 0;
  }

  .footer-phone {
    font-family: 'Courier New', monospace;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.45);
    letter-spacing: 0.05em;
    text-decoration: none;
    transition: color 200ms ease;
    display: inline-block;
  }

  .footer-phone:hover {
    color: #c9a961;
  }

  /* Hours column */
  .footer-hours-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    gap: 24px;
  }

  .footer-hours-row:last-child {
    border-bottom: none;
  }

  .footer-hours-day {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: rgba(255, 255, 255, 0.45);
    font-weight: 600;
    white-space: nowrap;
  }

  .footer-hours-time {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 300;
    text-align: right;
  }

  .footer-hours-time.closed {
    color: rgba(255, 255, 255, 0.2);
    font-style: italic;
  }

  /* Bottom bar */
  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .footer-copy {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.18);
    font-weight: 400;
    margin: 0;
  }

  .footer-copy span {
    color: rgba(201, 169, 97, 0.5);
  }

  .footer-bottom-links {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
  }

  .footer-bottom-link {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.18);
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    transition: color 200ms ease;
  }

  .footer-bottom-link:hover {
    color: rgba(201, 169, 97, 0.7);
  }

  .footer-bottom-dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    display: inline-block;
  }

  .footer-made {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.12);
    letter-spacing: 0.05em;
    margin: 0;
    text-decoration: none;
    transition: color 200ms ease;
    display: inline-block;
  }

  .footer-made:hover {
    color: rgba(201, 169, 97, 0.5);
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .footer-top {
      grid-template-columns: 1fr 1fr;
      gap: 48px;
    }

    .footer {
      padding: 64px 32px 32px;
    }
  }

  @media (max-width: 640px) {
    .footer-top {
      grid-template-columns: 1fr;
      gap: 40px;
    }

    .footer {
      padding: 56px 20px 28px;
    }

    .footer-bottom {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
  }
`;

export const Footer = () => (
  <>
    <style>{footerStyles}</style>
    <footer id="info" className="footer">
      <div className="footer-inner">
        <div className="footer-top">

          {/* Brand */}
          <div>
            <Image
              src="/logo.png"
              alt="Dardan Barbershop"
              width={100}
              height={100}
              className="footer-logo"
              style={{ height: "auto", width: "auto" }}
            />
            <p className="footer-tagline">
              Precision craftsmanship rooted in tradition.
              Every cut tells a story of nearly two decades of mastery.
            </p>
            <div className="footer-socials">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/dardanbarbershop"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              {/* Facebook */}
              <a
                href="https://www.facebook.com/dardanbarbershop"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Location */}
          <div>
            <p className="footer-col-label">Location</p>
            <p className="footer-address">
              20m near General Hospital<br />
              Dibër, Macedonia
            </p>
            <a href="tel:+38970000000" className="footer-phone">
              +389 70 000 000
            </a>
          </div>

          {/* Hours */}
          <div>
            <p className="footer-col-label">Availability</p>
            <div className="footer-hours-row">
              <span className="footer-hours-day">Mon — Fri</span>
              <span className="footer-hours-time">09:00 — 22:00</span>
            </div>
            <div className="footer-hours-row">
              <span className="footer-hours-day">Saturday</span>
              <span className="footer-hours-time">08:00 — 22:00</span>
            </div>
            <div className="footer-hours-row">
              <span className="footer-hours-day">Sunday</span>
              <span className="footer-hours-time closed">Closed</span>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © 2026 <span>Dardan Barbershop</span>. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <a href="/privacy" className="footer-bottom-link">Privacy Policy</a>
            <span className="footer-bottom-dot" />
            <a href="/terms" className="footer-bottom-link">Terms of Service</a>
            <span className="footer-bottom-dot" />
            <a
              href="https://www.instagram.com/apexiumdev/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-made"
            >
              Crafted by Apexium Dev
            </a>
          </div>
        </div>
      </div>
    </footer>
  </>
);
