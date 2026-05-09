"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import Image from "next/image";

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
    padding: 32px 48px 32px clamp(56px, 8vw, 120px);
  }

  @media (max-width: 1024px) {
    .hero-section {
      flex-direction: column;
      height: auto;
      overflow: hidden;
    }
    .hero-content {
      padding: 48px 24px 32px;
      align-items: center;
      text-align: center;
    }
  }

  @media (max-width: 480px) {
    .hero-content {
      padding: 36px 20px 24px;
    }
  }

  /* Established badge */
  .hero-badge {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 18px;
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
    font-size: clamp(36px, 4.8vw, 72px);
    line-height: 0.9;
    font-family: Georgia, serif;
    margin-bottom: 32px;
    letter-spacing: -0.02em;
    color: #ffffff;
  }

  @media (max-width: 1024px) {
    .hero-title {
      font-size: clamp(36px, 10vw, 60px);
      margin-bottom: 28px;
    }
  }

  @media (max-width: 480px) {
    .hero-title {
      font-size: clamp(32px, 11vw, 48px);
      margin-bottom: 24px;
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

  @media (max-width: 1024px) {
    .hero-badge {
      justify-content: center;
    }
    .hero-buttons {
      justify-content: center;
    }
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

  /* Right image - contained with padding and rounded corners */
  .hero-image-container {
    flex: 1;
    position: relative;
    overflow: hidden;
    margin: 24px 40px 24px 0;
    border-radius: 32px;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
  }

  @media (max-width: 1024px) {
    .hero-image-container {
      height: 320px;
      flex: none;
      margin: 0 24px 0;
      border-radius: 24px 24px 0 0;
    }
  }

  @media (max-width: 480px) {
    .hero-image-container {
      height: 260px;
      margin: 0 16px 0;
      border-radius: 20px 20px 0 0;
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

  @media (max-width: 1024px) {
    .hero-quote {
      font-size: 14px;
      bottom: 24px;
      left: 24px;
      right: 24px;
    }
  }

  @media (max-width: 480px) {
    .hero-quote {
      font-size: 12px;
      bottom: 20px;
      left: 20px;
      right: 20px;
    }
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
          {t.heroTitle}{" "}
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
          src="/shop.jpg"
          alt="Barbershop Atmosphere"
          fill
          priority
          loading="eager"
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="hero-image"
          style={{ objectFit: "cover" }}
        />
        <div className="hero-image-overlay"></div>
        <div className="hero-quote">
          &ldquo;Precision in{" "}
          <span className="hero-quote-highlight">Every Move.&rdquo;</span>
        </div>
      </div>
    </section>
  </>
);
