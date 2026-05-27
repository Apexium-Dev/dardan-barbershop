"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const galleryStyles = `
  .gallery-section {
    background: #0f0f0f;
    padding: 96px 48px 120px;
    position: relative;
    overflow: hidden;
  }

  .gallery-section::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(201,169,97,0.2), transparent);
  }

  @media (max-width: 768px) {
    .gallery-section { padding: 72px 24px 88px; }
  }
  @media (max-width: 480px) {
    .gallery-section { padding: 56px 16px 72px; }
  }

  .gallery-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 48px;
    gap: 24px;
  }

  @media (max-width: 640px) {
    .gallery-header { flex-direction: column; align-items: flex-start; }
  }

  .gallery-eyebrow {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .gallery-eyebrow-line {
    width: 32px;
    height: 1px;
    background: #c9a961;
  }

  .gallery-eyebrow-text {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.4em;
    color: #c9a961;
    font-weight: 700;
  }

  .gallery-title {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(40px, 5.5vw, 72px);
    font-weight: 400;
    color: #fff;
    line-height: 1;
    margin: 0;
  }

  .gallery-title em {
    color: #c9a961;
    font-style: italic;
  }

  .gallery-subtitle {
    font-size: 13px;
    color: rgba(255,255,255,0.35);
    font-weight: 300;
    line-height: 1.7;
    max-width: 240px;
    text-align: right;
  }

  @media (max-width: 640px) {
    .gallery-subtitle { text-align: left; max-width: 100%; }
  }

  /* Grid */
  .gallery-grid {
    display: grid;
    grid-template-columns: 1.4fr 0.9fr 1fr;
    grid-template-rows: 280px 280px;
    gap: 14px;
  }

  @media (max-width: 1024px) {
    .gallery-grid {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 240px 240px 240px;
    }
  }

  @media (max-width: 640px) {
    .gallery-section { padding: 48px 16px 64px; }
    .gallery-header { margin-bottom: 24px; }
    .gallery-title { font-size: clamp(34px, 9vw, 48px); }
    .gallery-grid {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 160px 160px;
      gap: 10px;
    }
  }

  .gallery-cell {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    background: #141414;
    border: 1px solid rgba(255,255,255,0.05);
  }

  /* Cell placements */
  .gallery-cell-1 {
    grid-column: 1;
    grid-row: 1 / 3;
  }

  .gallery-cell-2 {
    grid-column: 2;
    grid-row: 1;
  }

  .gallery-cell-3 {
    grid-column: 3;
    grid-row: 1 / 3;
  }

  .gallery-cell-4 {
    grid-column: 2;
    grid-row: 2;
  }

  @media (max-width: 1024px) {
    .gallery-cell-1 { grid-column: 1; grid-row: 1 / 3; }
    .gallery-cell-2 { grid-column: 2; grid-row: 1; }
    .gallery-cell-3 { grid-column: 2; grid-row: 2; }
    .gallery-cell-4 { grid-column: 1 / 3; grid-row: 3; }
  }

  @media (max-width: 640px) {
    .gallery-cell-1,
    .gallery-cell-2,
    .gallery-cell-3,
    .gallery-cell-4 {
      grid-column: auto;
      grid-row: auto;
    }
  }

  .gallery-img {
    object-fit: cover;
    filter: grayscale(80%);
    transition: filter 800ms ease, transform 800ms ease;
  }

  .gallery-cell:hover .gallery-img {
    filter: grayscale(0%);
    transform: scale(1.04);
  }

  /* Overlay on all cells */
  .gallery-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(15,15,15,0.7) 0%, transparent 50%);
    pointer-events: none;
    transition: opacity 400ms ease;
  }

  .gallery-cell:hover .gallery-overlay {
    opacity: 0.4;
  }

  /* Accent card (dark branded tile) */
  .gallery-accent {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 24px;
    background: linear-gradient(135deg, #141414 0%, #1c1a15 100%);
    border: 1px solid rgba(201,169,97,0.18);
  }

  .gallery-accent-label {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.4em;
    color: #c9a961;
    font-weight: 700;
    margin: 0 0 8px 0;
  }

  .gallery-accent-text {
    font-family: Georgia, serif;
    font-style: italic;
    font-size: clamp(18px, 2vw, 26px);
    color: rgba(255,255,255,0.7);
    font-weight: 400;
    line-height: 1.3;
    margin: 0;
  }

  .gallery-accent-line {
    width: 32px;
    height: 1px;
    background: rgba(201,169,97,0.4);
    margin-bottom: 14px;
  }
`;

export const Gallery = () => (
  <>
    <style>{galleryStyles}</style>
    <section className="gallery-section">
      <div className="gallery-header">
        <div>
          <div className="gallery-eyebrow">
            <div className="gallery-eyebrow-line" />
            <span className="gallery-eyebrow-text">The Work</span>
          </div>
          <h2 className="gallery-title">
            The <em>Gallery.</em>
          </h2>
        </div>
        <p className="gallery-subtitle">
          Every cut is a canvas. A glimpse into the craft behind the chair.
        </p>
      </div>

      <div className="gallery-grid">
        {/* Cell 1 — tall left, shop photo */}
        <motion.div
          className="gallery-cell gallery-cell-1"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Image
            src="/shop.jpg"
            alt="Dardan Barbershop interior"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="gallery-img"
          />
          <div className="gallery-overlay" />
        </motion.div>

        {/* Cell 2 — top middle, barber photo */}
        <motion.div
          className="gallery-cell gallery-cell-2"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Image
            src="/barber.png"
            alt="Barber at work"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="gallery-img"
          />
          <div className="gallery-overlay" />
        </motion.div>

        {/* Cell 3 — tall right, shop photo different crop */}
        <motion.div
          className="gallery-cell gallery-cell-3"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Image
            src="/shop.jpg"
            alt="Barbershop atmosphere"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="gallery-img"
            style={{ objectPosition: "right center" }}
          />
          <div className="gallery-overlay" />
        </motion.div>

        {/* Cell 4 — bottom middle, branded accent tile */}
        <motion.div
          className="gallery-cell gallery-cell-4 gallery-accent"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="gallery-accent-label">Est. 2007</p>
          <div className="gallery-accent-line" />
          <p className="gallery-accent-text">
            &ldquo;Not just a haircut — a ritual.&rdquo;
          </p>
        </motion.div>
      </div>
    </section>
  </>
);
