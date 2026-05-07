"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import Image from "next/image";

// type Language = "en" | "al" | "mk";

const heroStyles = `
  /* Hero Section Container */
  .hero-section {
    height: calc(100vh - 80px);
    margin-top: 80px;
    display: flex;
    overflow: hidden;
    position: relative;
  }

  /* Left content - takes up left half, centered vertically */
  .hero-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 48px 64px;
  }

  @media (max-width: 1024px) {
    .hero-section {
      flex-direction: column;
      height: auto;
    }
    .hero-content {
      padding: 60px 32px 40px;
    }
  }

  /* Established badge */
  .hero-badge {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }

  .hero-badge-line {
    width: 48px;
    height: 1px;
    background-color: rgba(220, 208, 180, 0.3);
  }

  .hero-badge-text {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5em;
    font-weight: 500;
    opacity: 0.6;
    color: rgba(255, 255, 255, 0.8);
  }

  /* Main title */
  .hero-title {
    font-size: clamp(40px, 5.5vw, 80px);
    line-height: 0.9;
    font-family: Georgia, serif;
    margin-bottom: 40px;
    letter-spacing: -0.02em;
    color: #ffffff;
  }

  .hero-title-highlight {
    color: #c9a961;
    font-style: italic;
  }

  /* CTA Buttons Container */
  .hero-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }

  /* Book Now Button */
  .hero-book-btn {
    background-color: #c9a961;
    color: #0f0f0f;
    padding: 18px 36px;
    border-radius: 999px;
    border: none;
    font-weight: 900;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-size: 11px;
    cursor: pointer;
    transition: all 300ms ease;
    box-shadow: 0 0 40px rgba(201, 169, 97, 0.2);
  }

  .hero-book-btn:hover {
    background-color: #dcd0b4;
    transform: scale(1.05);
  }

  /* Member Portal Button */
  .hero-member-btn {
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 18px 36px;
    border-radius: 999px;
    background: none;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-size: 11px;
    cursor: pointer;
    transition: all 300ms ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .hero-member-btn:hover {
    border-color: #c9a961;
    color: #c9a961;
  }

  /* Right image - takes up right half, fills height fully */
  .hero-image-container {
    flex: 1;
    position: relative;
    overflow: hidden;
  }

  @media (max-width: 1024px) {
    .hero-image-container {
      height: 400px;
      flex: none;
    }
  }

  .hero-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%);
    transition: all 1000ms ease;
  }

  .hero-image-container:hover .hero-image {
    filter: grayscale(0%);
    transform: scale(1.03);
  }

  /* Image overlay */
  .hero-image-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, #0f0f0f 0%, transparent 30%),
                linear-gradient(to top, #0f0f0f 0%, transparent 40%);
    opacity: 0.6;
  }

  /* Quote section */
  .hero-quote {
    position: absolute;
    bottom: 40px;
    left: 40px;
    font-size: 18px;
    font-family: Georgia, serif;
    font-style: italic;
    color: #dcd0b4;
    line-height: 1.6;
  }

  .hero-quote-highlight {
    color: #c9a961;
  }
`;

interface HeroProps {
  t: Record<string, string>;
  startBooking: () => void;
  setView: (view: string) => void;
}

export const Hero = ({ t, startBooking, setView }: HeroProps) => (
  <>
    <style>{heroStyles}</style>
    <section className="hero-section">
      <div className="hero-content">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="hero-badge"
        >
          <div className="hero-badge-line"></div>
          <span className="hero-badge-text">Established 2007</span>
        </motion.div>

        <h1 className="hero-title">
          {t.heroTitle} <br />
          <span className="hero-title-highlight">{t.heroSubtitle}</span>
        </h1>

        <div className="hero-buttons">
          <button onClick={() => startBooking()} className="hero-book-btn">
            {t.bookNow}
          </button>
          <button
            onClick={() => setView("loyalty")}
            className="hero-member-btn"
          >
            {t.memberPortal} <Zap size={14} />
          </button>
        </div>
      </div>

      <div className="hero-image-container">
        <Image
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1200"
          alt="Barbershop Atmosphere"
          fill
          className="hero-image"
          style={{ objectFit: "cover" }}
        />
        <div className="hero-image-overlay"></div>
        <div className="hero-quote">
          &ldquo;Heritage is earned,{" "}
          <span className="hero-quote-highlight">
            Style is chosen.&rdquo;
          </span>
        </div>
      </div>
    </section>
  </>
);
