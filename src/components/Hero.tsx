"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import Image from "next/image";

// type Language = "en" | "al" | "mk";

const heroStyles = `
  /* Hero Section Container */
  .hero-section {
    min-height: 600px;
    padding-top: 120px;
    padding-bottom: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 24px;
    padding-right: 24px;
  }

  @media (min-width: 768px) {
    .hero-section {
      min-height: 700px;
      padding-left: 48px;
      padding-right: 48px;
      padding-top: 80px;
    }
  }

  @media (min-width: 1024px) {
    .hero-section {
      min-height: 800px;
    }
  }

  /* Main container */
  .hero-container {
    max-width: 80rem;
    margin: 0 auto;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
    align-items: center;
    justify-items: center;
  }

  @media (min-width: 1024px) {
    .hero-container {
      grid-template-columns: 1fr 1fr;
      align-items: center;
      justify-items: start;
    }
  }

  /* Left content section */
  .hero-content {
    display: flex;
    flex-direction: column;
  }

  /* Established badge */
  .hero-badge {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 32px;
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
    font-size: clamp(28px, 8vw, 56px);
    line-height: 0.85;
    font-family: Georgia, serif;
    margin-bottom: 32px;
    letter-spacing: -0.02em;
    color: #ffffff;
  }

  @media (min-width: 1024px) {
    .hero-title {
      font-size: clamp(48px, 7vw, 84px);
    }
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
    padding: 20px 40px;
    border-radius: 999px;
    border: none;
    font-weight: 900;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-size: 12px;
    cursor: pointer;
    transition: all 300ms ease;
    box-shadow: 0 0 40px rgba(201, 169, 97, 0.2);
  }

  .hero-book-btn:hover {
    background-color: #dcd0b4;
    transform: scale(1.05);
  }

  .hero-book-btn:active {
    transform: scale(0.98);
  }

  /* Member Portal Button */
  .hero-member-btn {
    border: 1px solid rgba(201, 169, 97, 0.3);
    padding: 20px 40px;
    border-radius: 999px;
    background: none;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-size: 12px;
    cursor: pointer;
    transition: all 300ms ease;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .hero-member-btn:hover {
    border-color: #c9a961;
    background-color: rgba(201, 169, 97, 0.05);
  }

  .hero-member-btn svg {
    transition: all 300ms ease;
  }

  .hero-member-btn:hover svg {
    fill: #c9a961;
    color: #c9a961;
  }

  /* Right image section */
  .hero-image-container {
    position: relative;
    aspect-ratio: 1;
    border-radius: 64px;
    overflow: hidden;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  }

  @media (min-width: 768px) {
    .hero-image-container {
      aspect-ratio: 16 / 9;
    }
  }

  @media (min-width: 1024px) {
    .hero-image-container {
      aspect-ratio: 3 / 4;
      max-width: 420px;
      width: 100%;
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
    transform: scale(1.05);
  }

  /* Image overlay */
  .hero-image-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, #0f0f0f, transparent, transparent);
    opacity: 0.8;
  }

  /* Quote section */
  .hero-quote {
    position: absolute;
    bottom: 48px;
    left: 48px;
    font-size: 20px;
    font-family: Georgia, serif;
    font-style: italic;
    color: #dcd0b4;
    line-height: 1.6;
  }

  .hero-quote-highlight {
    color: #c9a961;
  }

  @media (max-width: 768px) {
    .hero-quote {
      font-size: 16px;
      bottom: 32px;
      left: 32px;
    }
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
      <div className="hero-container">
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
      </div>
    </section>
  </>
);
