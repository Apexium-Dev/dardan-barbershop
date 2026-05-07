"use client";

import React from "react";
import Image from "next/image";

const legacyStyles = `
  .legacy-section {
    padding: 120px 24px;
    background-color: #0f0f0f;
  }

  .legacy-container {
    max-width: 80rem;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
  }

  /* Left column */
  .legacy-left {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  .legacy-eyebrow {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .legacy-eyebrow-line {
    width: 40px;
    height: 1px;
    background-color: #c9a961;
  }

  .legacy-eyebrow-text {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    color: #c9a961;
    font-weight: 700;
  }

  .legacy-heading {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(36px, 4.5vw, 64px);
    font-weight: 400;
    line-height: 1.1;
    color: #ffffff;
    margin: 0;
  }

  .legacy-heading em {
    font-style: italic;
    color: #c9a961;
    display: block;
  }

  .legacy-desc {
    font-size: 16px;
    line-height: 1.8;
    color: rgba(255, 255, 255, 0.45);
    font-weight: 300;
    max-width: 480px;
    margin: 0;
  }

  .legacy-meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.07);
  }

  .legacy-meta-label {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    color: rgba(255, 255, 255, 0.2);
    font-weight: 700;
    margin-bottom: 10px;
    display: block;
  }

  .legacy-meta-value {
    font-family: Georgia, 'Times New Roman', serif;
    font-style: italic;
    font-size: 20px;
    color: rgba(255, 255, 255, 0.75);
  }

  /* Right column */
  .legacy-right {
    position: relative;
  }

  .legacy-image-wrapper {
    position: relative;
  }

  .legacy-image-border {
    position: absolute;
    inset: -12px;
    border: 1px solid rgba(201, 169, 97, 0.12);
    border-radius: 4px;
    transition: all 800ms ease;
    transform: scale(0.95);
  }

  .legacy-right:hover .legacy-image-border {
    transform: scale(1);
    border-color: rgba(201, 169, 97, 0.25);
  }

  .legacy-image {
    width: 100%;
    aspect-ratio: 4/5;
    object-fit: cover;
    border-radius: 4px;
    filter: grayscale(100%);
    transition: filter 1000ms ease;
    display: block;
  }

  .legacy-right:hover .legacy-image {
    filter: grayscale(0%);
  }

  .legacy-monogram {
    position: absolute;
    top: 20px;
    right: 20px;
    font-family: Georgia, 'Times New Roman', serif;
    font-style: italic;
    font-size: 88px;
    color: rgba(201, 169, 97, 0.15);
    line-height: 1;
    pointer-events: none;
    transition: color 600ms ease;
    user-select: none;
  }

  .legacy-right:hover .legacy-monogram {
    color: rgba(201, 169, 97, 0.3);
  }

  /* Mobile */
  @media (max-width: 1024px) {
    .legacy-container {
      grid-template-columns: 1fr;
      gap: 56px;
    }

    .legacy-section {
      padding: 80px 24px;
    }
  }

  @media (max-width: 640px) {
    .legacy-section {
      padding: 64px 20px;
    }

    .legacy-meta {
      grid-template-columns: 1fr;
      gap: 24px;
    }
  }
`;

export const Legacy = () => (
  <>
    <style>{legacyStyles}</style>
    <section className="legacy-section">
      <div className="legacy-container">
        {/* Left */}
        <div className="legacy-left">
          <div className="legacy-eyebrow">
            <div className="legacy-eyebrow-line" />
            <span className="legacy-eyebrow-text">Est. 2007</span>
          </div>

          <h2 className="legacy-heading">
            A legacy of trust
            <em>by Dardan.</em>
          </h2>

          <p className="legacy-desc">
            Since 2007, we have been more than just a shop. We are a sanctuary
            of precision, built on the values of tradition and mutual respect.
            Every cut is a testament to nearly two decades of mastery.
          </p>

          <div className="legacy-meta">
            <div>
              <span className="legacy-meta-label">Philosophy</span>
              <span className="legacy-meta-value">Perfection in Detail</span>
            </div>
            <div>
              <span className="legacy-meta-label">Location</span>
              <span className="legacy-meta-value">Near General Hospital</span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="legacy-right">
          <div className="legacy-image-wrapper">
            <div className="legacy-image-border" />
            <Image
              src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800"
              alt="Dardan Barbershop legacy"
              width={800}
              height={1000}
              className="legacy-image"
            />
            <div className="legacy-monogram">BD</div>
          </div>
        </div>
      </div>
    </section>
  </>
);
