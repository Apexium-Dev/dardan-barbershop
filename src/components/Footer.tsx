"use client";

import React from "react";

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
  .footer-brand-name {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 28px;
    font-weight: 400;
    color: #ffffff;
    letter-spacing: 0.05em;
    margin: 0 0 8px 0;
    line-height: 1.1;
  }

  .footer-brand-sub {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.45em;
    color: rgba(255, 255, 255, 0.25);
    font-weight: 700;
    margin: 0 0 28px 0;
    display: block;
  }

  .footer-tagline {
    font-size: 13px;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.35);
    font-weight: 300;
    max-width: 280px;
    margin: 0;
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

  .footer-made {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.12);
    letter-spacing: 0.05em;
    margin: 0;
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
      gap: 8px;
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
            <h2 className="footer-brand-name">Dardan</h2>
            <span className="footer-brand-sub">Barbershop</span>
            <p className="footer-tagline">
              Precision craftsmanship rooted in tradition.
              Every cut tells a story of nearly two decades of mastery.
            </p>
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
          <p className="footer-made">Crafted by Apexium</p>
        </div>
      </div>
    </footer>
  </>
);
