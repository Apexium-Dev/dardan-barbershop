"use client";

import React, { useState } from "react";

const catalogueStyles = `
  /* Section wrapper */
  .catalogue-section {
    background-color: #0f0f0f;
    padding: 120px 0 140px;
    position: relative;
    overflow: hidden;
  }

  /* Subtle background texture lines */
  .catalogue-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(201, 169, 97, 0.3), transparent);
  }

  .catalogue-container {
    max-width: 80rem;
    margin: 0 auto;
    padding: 0 48px;
  }

  @media (max-width: 768px) {
    .catalogue-container {
      padding: 0 24px;
    }
    .catalogue-section {
      padding: 80px 0 100px;
    }
  }

  /* Header */
  .catalogue-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 64px;
    gap: 32px;
  }

  @media (max-width: 768px) {
    .catalogue-header {
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 48px;
    }
  }

  .catalogue-header-left {
    max-width: 540px;
  }

  .catalogue-label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5em;
    color: #c9a961;
    font-weight: 700;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .catalogue-label::before {
    content: '';
    display: inline-block;
    width: 32px;
    height: 1px;
    background-color: #c9a961;
  }

  .catalogue-title {
    font-size: clamp(32px, 4vw, 56px);
    font-family: Georgia, serif;
    font-weight: 400;
    color: #ffffff;
    line-height: 1.05;
    letter-spacing: -0.02em;
  }

  .catalogue-title em {
    color: #c9a961;
    font-style: italic;
  }

  .catalogue-subtitle {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.4);
    line-height: 1.7;
    max-width: 320px;
    text-align: right;
  }

  @media (max-width: 768px) {
    .catalogue-subtitle {
      text-align: left;
    }
  }

  /* Category tabs */
  .catalogue-tabs {
    display: flex;
    gap: 0;
    margin-bottom: 48px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  }

  .catalogue-tab {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.35);
    background: none;
    border: none;
    cursor: pointer;
    padding: 12px 24px 14px;
    position: relative;
    transition: color 250ms ease;
  }

  .catalogue-tab::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #c9a961;
    transform: scaleX(0);
    transition: transform 250ms ease;
  }

  .catalogue-tab:hover {
    color: rgba(255, 255, 255, 0.7);
  }

  .catalogue-tab.active {
    color: #ffffff;
  }

  .catalogue-tab.active::after {
    transform: scaleX(1);
  }

  @media (max-width: 480px) {
    .catalogue-tab {
      padding: 12px 14px 14px;
      font-size: 9px;
    }
  }

  /* Services grid */
  .catalogue-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background-color: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    overflow: hidden;
  }

  @media (max-width: 1024px) {
    .catalogue-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .catalogue-grid {
      grid-template-columns: 1fr;
    }
  }

  /* Service card */
  .service-card {
    background-color: #111111;
    padding: 36px 32px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    cursor: pointer;
    transition: background-color 300ms ease;
    position: relative;
    overflow: hidden;
  }

  .service-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(201, 169, 97, 0.4), transparent);
    transform: scaleX(0);
    transition: transform 400ms ease;
  }

  .service-card:hover {
    background-color: #161616;
  }

  .service-card:hover::before {
    transform: scaleX(1);
  }

  .service-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .service-card-number {
    font-size: 10px;
    color: rgba(201, 169, 97, 0.4);
    font-weight: 700;
    letter-spacing: 0.2em;
    margin-top: 2px;
  }

  .service-card-duration {
    font-size: 9px;
    color: rgba(255, 255, 255, 0.25);
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-weight: 600;
    background-color: rgba(255, 255, 255, 0.04);
    padding: 4px 10px;
    border-radius: 999px;
    white-space: nowrap;
  }

  .service-card-name {
    font-size: 18px;
    font-family: Georgia, serif;
    color: #ffffff;
    font-weight: 400;
    line-height: 1.2;
  }

  .service-card-desc {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.35);
    line-height: 1.7;
    flex: 1;
  }

  .service-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    margin-top: auto;
  }

  .service-card-price {
    font-size: 22px;
    font-family: Georgia, serif;
    color: #c9a961;
    font-weight: 400;
    letter-spacing: -0.01em;
  }

  .service-card-price span {
    font-size: 13px;
    color: rgba(201, 169, 97, 0.6);
    font-family: inherit;
  }

  .service-card-book-btn {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.25em;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.3);
    background: none;
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 8px 16px;
    border-radius: 999px;
    cursor: pointer;
    transition: all 250ms ease;
  }

  .service-card:hover .service-card-book-btn {
    border-color: #c9a961;
    color: #c9a961;
  }

  /* Featured card (first one) */
  .service-card.featured {
    background-color: #141410;
  }

  .service-card.featured .service-card-name {
    color: #f5f0e8;
  }

  /* Bottom CTA */
  .catalogue-cta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
    margin-top: 56px;
    flex-wrap: wrap;
  }

  .catalogue-cta-text {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.3);
    letter-spacing: 0.1em;
  }

  .catalogue-cta-btn {
    background-color: #c9a961;
    color: #0f0f0f;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.25em;
    font-weight: 900;
    padding: 16px 36px;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    transition: all 300ms ease;
  }

  .catalogue-cta-btn:hover {
    background-color: #dcd0b4;
    transform: translateY(-2px);
  }
`;

const services = {
  cuts: [
    {
      name: "The Classic Cut",
      desc: "A timeless scissor cut tailored to your natural shape. Clean lines, no shortcuts.",
      price: "€15",
      duration: "30 min",
    },
    {
      name: "Skin Fade",
      desc: "Zero to length — blended with precision. Surgical clean-up on the hairline.",
      price: "€18",
      duration: "40 min",
    },
    {
      name: "Textured Crop",
      desc: "Modern styling with weight removed from the ends. Effortlessly structured.",
      price: "€18",
      duration: "35 min",
    },
    {
      name: "Taper Fade",
      desc: "Gradual graduation from skin to length. Versatile enough for any occasion.",
      price: "€20",
      duration: "45 min",
    },
    {
      name: "Curly Cut",
      desc: "Cut dry to honor your curl pattern. Shape without sacrificing volume.",
      price: "€22",
      duration: "50 min",
    },
    {
      name: "Kids Cut",
      desc: "Patience first, scissors second. A comfortable, clean cut for the young ones.",
      price: "€10",
      duration: "25 min",
    },
  ],
  beard: [
    {
      name: "Beard Shape",
      desc: "Define your neckline and cheek line. Crisp edges that frame your face.",
      price: "€10",
      duration: "20 min",
    },
    {
      name: "Hot Towel Shave",
      desc: "Traditional straight razor shave with hot towel prep. Pure ritual.",
      price: "€18",
      duration: "30 min",
    },
    {
      name: "Beard Trim",
      desc: "Even length throughout with shape maintenance. Natural but groomed.",
      price: "€12",
      duration: "20 min",
    },
    {
      name: "Full Beard Service",
      desc: "Wash, condition, shape, trim, and hot towel finish. The complete experience.",
      price: "€25",
      duration: "45 min",
    },
    {
      name: "Moustache Trim",
      desc: "Precision styling above the lip. Sharp definition, clean shape.",
      price: "€8",
      duration: "15 min",
    },
    {
      name: "Designer Lines",
      desc: "Custom geometric lines and patterns. Art meets grooming.",
      price: "€20",
      duration: "30 min",
    },
  ],
  combo: [
    {
      name: "Cut & Beard",
      desc: "The full package — fresh cut and sculpted beard. Walk in, walk out transformed.",
      price: "€28",
      duration: "60 min",
    },
    {
      name: "Cut & Hot Shave",
      desc: "Haircut paired with a traditional straight razor shave. Timeless refinement.",
      price: "€30",
      duration: "65 min",
    },
    {
      name: "The Ritual",
      desc: "Cut, full beard service, hot towel, and scalp massage. Our signature experience.",
      price: "€40",
      duration: "90 min",
    },
    {
      name: "Father & Son",
      desc: "Two classic cuts together. A tradition worth passing down.",
      price: "€22",
      duration: "50 min",
    },
    {
      name: "Cut & Style",
      desc: "Haircut with product styling and finish. Ready for anything.",
      price: "€22",
      duration: "45 min",
    },
    {
      name: "VIP Treatment",
      desc: "Everything we do, done at once. Bring a book.",
      price: "€55",
      duration: "2 hrs",
    },
  ],
};

type Category = "cuts" | "beard" | "combo";

interface CatalogueProps {
  startBooking: () => void;
  t?: Record<string, string>;
}

export const Catalogue = ({ startBooking }: CatalogueProps) => {
  const [activeTab, setActiveTab] = useState<Category>("cuts");

  const tabs: { key: Category; label: string }[] = [
    { key: "cuts", label: "Haircuts" },
    { key: "beard", label: "Beard" },
    { key: "combo", label: "Combos" },
  ];

  return (
    <>
      <style>{catalogueStyles}</style>
      <section id="menu" className="catalogue-section">
        <div className="catalogue-container">
          {/* Header */}
          <div className="catalogue-header">
            <div className="catalogue-header-left">
              <p className="catalogue-label">The Catalogue</p>
              <h2 className="catalogue-title">
                Every service,<br />
                <em>done right.</em>
              </h2>
            </div>
            <p className="catalogue-subtitle">
              No gimmicks, no upsells. Just skilled hands and honest prices — the way it should be.
            </p>
          </div>

          {/* Tabs */}
          <div className="catalogue-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`catalogue-tab ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="catalogue-grid">
            {services[activeTab].map((service, i) => (
              <div
                key={i}
                className={`service-card ${i === 0 ? "featured" : ""}`}
              >
                <div className="service-card-top">
                  <span className="service-card-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="service-card-duration">
                    {service.duration}
                  </span>
                </div>
                <h3 className="service-card-name">{service.name}</h3>
                <p className="service-card-desc">{service.desc}</p>
                <div className="service-card-footer">
                  <span className="service-card-price">
                    {service.price} <span>/ session</span>
                  </span>
                  <button
                    className="service-card-book-btn"
                    onClick={() => startBooking()}
                  >
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="catalogue-cta">
            <span className="catalogue-cta-text">Ready to get started?</span>
            <button className="catalogue-cta-btn" onClick={() => startBooking()}>
              Book Your Appointment
            </button>
          </div>
        </div>
      </section>
    </>
  );
};
