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
    padding: 120px 24px;
    background-color: #0f0f0f;
  }

  .craftsmen-header {
    text-align: center;
    margin-bottom: 96px;
  }

  .craftsmen-title {
    font-family: Georgia, 'Times New Roman', serif;
    font-style: italic;
    font-size: clamp(48px, 8vw, 112px);
    font-weight: 400;
    color: rgba(255, 255, 255, 0.12);
    margin: 0;
    line-height: 1;
  }

  .craftsmen-grid {
    max-width: 72rem;
    margin: 0 auto;
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
    margin-bottom: 28px;
    border-radius: 28px;
    overflow: hidden;
    background-color: #1a1a1a;
  }

  .craftsmen-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%);
    transition: filter 1000ms ease, transform 1000ms ease;
    display: block;
  }

  .craftsmen-image-wrapper:hover .craftsmen-image {
    filter: grayscale(0%);
    transform: scale(1.05);
  }

  .craftsmen-overlay {
    position: absolute;
    inset: 0;
    background: rgba(201, 169, 97, 0.08);
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
  }

  .craftsmen-role {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    color: #c9a961;
    font-weight: 700;
    margin-bottom: 14px;
  }

  .craftsmen-bio {
    font-size: 14px;
    line-height: 1.75;
    color: rgba(255, 255, 255, 0.4);
    font-weight: 300;
    margin: 0;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .craftsmen-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 40px;
    }

    .craftsmen-section {
      padding: 80px 24px;
    }
  }

  @media (max-width: 640px) {
    .craftsmen-grid {
      grid-template-columns: 1fr;
      gap: 48px;
      max-width: 420px;
    }

    .craftsmen-section {
      padding: 64px 20px;
    }

    .craftsmen-header {
      margin-bottom: 64px;
    }
  }
`;

export const Craftsmen = () => (
  <>
    <style>{craftsmenStyles}</style>
    <section id="barbers" className="craftsmen-section">
      <div className="craftsmen-header">
        <h2 className="craftsmen-title">The Craftsmen</h2>
      </div>

      <div className="craftsmen-grid">
        {team.map((member, i) => (
          <motion.div
            key={member.name}
            className="craftsmen-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="craftsmen-image-wrapper">
              <Image
                src={member.img}
                alt={member.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="craftsmen-image"
                style={{ objectFit: "cover" }}
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
