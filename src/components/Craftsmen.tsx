"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const team = [
  {
    name: "Dardan",
    role: "Master Barber & Founder",
    bio: "With nearly two decades of experience, Dardan built this shop from the ground up on a single principle — every client deserves the very best.",
    img: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Arber",
    role: "Senior Barber",
    bio: "Arber specialises in precision fades and modern cuts, blending classic technique with contemporary style.",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Faton",
    role: "Barber & Colourist",
    bio: "Faton's eye for colour and detail makes him the go-to for transformations — from bleach work to beard sculpting.",
    img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800",
  },
];

const craftsmenStyles = `
  .craftsmen-section {
    padding: 120px 48px;
    background-color: #0f0f0f;
    max-width: 90rem;
    margin: 0 auto;
  }

  /* Header */
  .craftsmen-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
  }

  .craftsmen-eyebrow-line {
    width: 40px;
    height: 1px;
    background-color: #c9a961;
    flex-shrink: 0;
  }

  .craftsmen-eyebrow {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    color: #c9a961;
    font-weight: 700;
  }

  .craftsmen-title {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(48px, 6vw, 88px);
    font-weight: 400;
    line-height: 1;
    color: #ffffff;
    margin: 0 0 8px 0;
  }

  .craftsmen-title em {
    font-style: italic;
    color: #c9a961;
  }

  .craftsmen-divider {
    width: 100%;
    height: 1px;
    background: rgba(255,255,255,0.07);
    margin: 32px 0 64px 0;
  }

  /* Grid */
  .craftsmen-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 48px;
  }

  /* Card */
  .craftsmen-card {
    display: flex;
    flex-direction: column;
  }

  .craftsmen-image-wrapper {
    position: relative;
    aspect-ratio: 3/4;
    margin-bottom: 24px;
    border-radius: 20px;
    overflow: hidden;
    background-color: #1a1a1a;
  }

  .craftsmen-image {
    object-fit: cover;
    filter: grayscale(100%);
    transition: filter 1000ms ease, transform 1000ms ease;
  }

  .craftsmen-image-wrapper:hover .craftsmen-image {
    filter: grayscale(0%);
    transform: scale(1.05);
  }

  .craftsmen-overlay {
    position: absolute;
    inset: 0;
    background: rgba(201, 169, 97, 0.06);
    opacity: 0;
    transition: opacity 600ms ease;
    pointer-events: none;
  }

  .craftsmen-image-wrapper:hover .craftsmen-overlay {
    opacity: 1;
  }

  .craftsmen-number {
    position: absolute;
    bottom: 16px;
    left: 20px;
    font-size: 10px;
    font-family: 'Courier New', monospace;
    letter-spacing: 0.2em;
    color: rgba(255, 255, 255, 0.3);
    font-weight: 700;
  }

  .craftsmen-name {
    font-family: Georgia, 'Times New Roman', serif;
    font-style: italic;
    font-size: 26px;
    font-weight: 400;
    color: #ffffff;
    margin: 0 0 6px 0;
    transition: transform 300ms ease;
  }

  .craftsmen-card:hover .craftsmen-name {
    transform: translateX(4px);
  }

  .craftsmen-role {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    color: #c9a961;
    font-weight: 700;
    margin-bottom: 12px;
  }

  .craftsmen-bio {
    font-size: 13px;
    line-height: 1.75;
    color: rgba(255, 255, 255, 0.38);
    font-weight: 300;
    margin: 0;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .craftsmen-section {
      padding: 80px 32px;
    }

    .craftsmen-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 36px;
    }
  }

  @media (max-width: 640px) {
    .craftsmen-section {
      padding: 64px 20px;
    }

    .craftsmen-grid {
      grid-template-columns: 1fr;
      gap: 40px;
    }

    .craftsmen-divider {
      margin: 24px 0 48px 0;
    }
  }
`;

export const Craftsmen = () => (
  <>
    <style>{craftsmenStyles}</style>
    <section id="barbers" className="craftsmen-section">

      {/* Header */}
      <div className="craftsmen-header">
        <div className="craftsmen-eyebrow-line" />
        <span className="craftsmen-eyebrow">The Team</span>
      </div>
      <h2 className="craftsmen-title">
        The <em>Craftsmen.</em>
      </h2>
      <div className="craftsmen-divider" />

      {/* Grid */}
      <div className="craftsmen-grid">
        {team.map((member, i) => (
          <motion.div
            key={member.name}
            className="craftsmen-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="craftsmen-image-wrapper">
              <Image
                src={member.img}
                alt={member.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="craftsmen-image"
              />
              <div className="craftsmen-overlay" />
              <span className="craftsmen-number">0{i + 1}</span>
            </div>

            <h3 className="craftsmen-name">{member.name}</h3>
            <p className="craftsmen-role">{member.role}</p>
            <p className="craftsmen-bio">{member.bio}</p>
          </motion.div>
        ))}
      </div>

    </section>
  </>
);
