"use client";

import React from "react";
import { Clock } from "lucide-react";

const catalogueStyles = `
  .catalogue-section {
    background-color: #0f0f0f;
    padding: 140px 0 160px;
    position: relative;
  }

  .catalogue-section::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(201, 169, 97, 0.25), transparent);
  }

  .catalogue-container {
    max-width: 80rem;
    margin: 0 auto;
    padding: 0 48px;
  }

  @media (max-width: 768px) {
    .catalogue-container { padding: 0 24px; }
    .catalogue-section { padding: 96px 0 120px; }
  }

  .catalogue-inner {
    display: grid;
    grid-template-columns: 5fr 7fr;
    gap: 80px;
    align-items: start;
  }

  @media (max-width: 1024px) {
    .catalogue-inner { grid-template-columns: 1fr; gap: 56px; }
  }

  .catalogue-left { position: sticky; top: 120px; }

  @media (max-width: 1024px) {
    .catalogue-left { position: static; }
  }

  .catalogue-eyebrow {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5em;
    color: #c9a961;
    font-weight: 700;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .catalogue-eyebrow::before {
    content: '';
    display: inline-block;
    width: 28px; height: 1px;
    background-color: #c9a961;
    flex-shrink: 0;
  }

  .catalogue-heading {
    font-size: clamp(52px, 7vw, 88px);
    font-family: Georgia, serif;
    font-weight: 400;
    line-height: 0.92;
    letter-spacing: -0.03em;
    color: #ffffff;
    margin-bottom: 32px;
  }

  .catalogue-heading em {
    color: #c9a961;
    font-style: italic;
    display: block;
  }

  .catalogue-divider {
    width: 56px; height: 1px;
    background-color: rgba(220, 208, 180, 0.25);
    margin-bottom: 28px;
  }

  .catalogue-desc {
    font-size: 13px;
    line-height: 1.75;
    color: rgba(255, 255, 255, 0.4);
    font-weight: 300;
    max-width: 280px;
  }

  .catalogue-quality { margin-top: 48px; }

  .catalogue-quality-label {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.5em;
    color: rgba(255, 255, 255, 0.2);
    font-weight: 700;
    margin-bottom: 12px;
  }

  .catalogue-quality-dots { display: flex; gap: 8px; }

  .catalogue-quality-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    border: 1px solid rgba(220, 208, 180, 0.2);
  }

  @media (max-width: 1024px) {
    .catalogue-quality { display: none; }
  }

  .catalogue-list { display: flex; flex-direction: column; }

  .service-row {
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    padding: 28px 0 32px;
    cursor: pointer;
    transition: border-color 300ms ease;
  }

  .service-row:first-child { border-top: 1px solid rgba(255, 255, 255, 0.07); }
  .service-row:hover { border-bottom-color: rgba(255, 255, 255, 0.22); }

  .service-row-top {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 12px;
  }

  .service-row-left { display: flex; align-items: baseline; gap: 16px; }

  .service-number {
    font-size: 10px;
    font-family: monospace;
    color: rgba(201, 169, 97, 0.3);
    font-weight: 700;
    letter-spacing: 0.1em;
    transition: color 250ms ease;
    flex-shrink: 0;
  }

  .service-row:hover .service-number { color: rgba(201, 169, 97, 0.9); }

  .service-name {
    font-size: clamp(22px, 3.2vw, 36px);
    font-family: Georgia, serif;
    font-weight: 400;
    color: #ffffff;
    line-height: 1.1;
    transition: transform 500ms ease;
  }

  .service-row:hover .service-name { transform: translateX(6px); }

  .service-price {
    font-size: clamp(16px, 2vw, 24px);
    font-family: Georgia, serif;
    font-style: italic;
    color: rgba(255, 255, 255, 0.45);
    white-space: nowrap;
    transition: color 250ms ease;
    flex-shrink: 0;
  }

  .service-row:hover .service-price { color: #c9a961; }

  .service-row-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 34px;
    gap: 16px;
  }

  @media (max-width: 480px) {
    .service-row-bottom { padding-left: 26px; }
  }

  .service-desc {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.28);
    font-weight: 300;
    line-height: 1.6;
    max-width: 380px;
    transition: color 250ms ease;
  }

  .service-row:hover .service-desc { color: rgba(255, 255, 255, 0.6); }

  .service-duration {
    display: flex; align-items: center; gap: 6px;
    flex-shrink: 0;
    color: rgba(255, 255, 255, 0.2);
  }

  .service-duration-text {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.22);
    white-space: nowrap;
  }

  @media (max-width: 640px) {
    .service-duration { display: none; }
  }

  .catalogue-footer-note {
    margin-top: 40px;
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.4em;
    color: rgba(255, 255, 255, 0.18);
    text-align: right;
  }

  @media (max-width: 1024px) {
    .catalogue-footer-note { text-align: center; }
  }
`;

const services = [
  { name: "Haircut", price: "250 den", desc: "A clean, precise cut tailored to your head shape and style. No shortcuts taken.", duration: "30 min" },
  { name: "Beard Trim", price: "150 den", desc: "Defined edges, even length, sculpted shape. Groomed but natural.", duration: "20 min" },
  { name: "Hair Wash", price: "100 den", desc: "Thorough scalp cleanse with quality products. A clean foundation for every cut.", duration: "10 min" },
  { name: "Eyebrows — Thread", price: "200 den", desc: "Precise eyebrow shaping using traditional threading technique for clean definition.", duration: "15 min" },
  { name: "Eyebrows — Wax", price: "150 den", desc: "Quick and clean eyebrow shaping with wax. Smooth finish, sharp lines.", duration: "10 min" },
  { name: "Nose & Ear Wax", price: "200 den", desc: "Hygienic removal of unwanted hair from nose and ears using warm wax.", duration: "15 min" },
  { name: "Hair Bleach & Color", price: "1200 den", desc: "Full bleach process followed by your chosen color. Expertly handled from start to finish.", duration: "2+ hrs" },
  { name: "Black Hair Coloring", price: "200 den", desc: "Restore rich, deep black color to your hair. Even application, lasting results.", duration: "45 min" },
  { name: "Black Beard Coloring", price: "200 den", desc: "Deep black dye applied evenly to the beard. Looks fresh, stays sharp.", duration: "30 min" },
  { name: "Black Hair & Beard", price: "400 den", desc: "Combined hair and beard coloring in black. Full, unified look in one session.", duration: "60 min" },
  { name: "Mask & Steam Treatment", price: "300 den", desc: "Deep conditioning mask applied under steam for maximum absorption and softness.", duration: "30 min" },
];

interface CatalogueProps {
  startBooking: () => void;
  t?: Record<string, string>;
}

export const Catalogue = ({ startBooking }: CatalogueProps) => {
  return (
    <>
      <style>{catalogueStyles}</style>
      <section id="menu" className="catalogue-section">
        <div className="catalogue-container">
          <div className="catalogue-inner">
            <div className="catalogue-left">
              <p className="catalogue-eyebrow">The Catalogue</p>
              <h2 className="catalogue-heading">
                The
                <em>Catalogue.</em>
              </h2>
              <div className="catalogue-divider" />
              <p className="catalogue-desc">
                A curated selection of grooming excellence. Each session is a tailored experience crafted to your structure and style.
              </p>
              <div className="catalogue-quality">
                <p className="catalogue-quality-label">Quality Assurance</p>
                <div className="catalogue-quality-dots">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="catalogue-quality-dot" />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="catalogue-list">
                {services.map((s, i) => (
                  <div key={s.name} className="service-row" onClick={() => startBooking()}>
                    <div className="service-row-top">
                      <div className="service-row-left">
                        <span className="service-number">{String(i + 1).padStart(2, "0")}</span>
                        <h3 className="service-name">{s.name}</h3>
                      </div>
                      <span className="service-price">{s.price}</span>
                    </div>
                    <div className="service-row-bottom">
                      <p className="service-desc">{s.desc}</p>
                      <div className="service-duration">
                        <Clock size={13} />
                        <span className="service-duration-text">{s.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="catalogue-footer-note">
                Consultations are complimentary with every service.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};