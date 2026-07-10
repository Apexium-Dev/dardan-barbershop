"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

const statsStyles = `
  .stats-strip {
    background: #0f0f0f;
    border-top: 1px solid rgba(201, 169, 97, 0.15);
    border-bottom: 1px solid rgba(201, 169, 97, 0.15);
    padding: 0;
    position: relative;
    overflow: hidden;
  }

  .stats-strip::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 60% 100% at 50% 50%, rgba(201,169,97,0.05) 0%, transparent 70%);
    pointer-events: none;
  }

  .stats-inner {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }

  .stats-item {
    padding: 52px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
  }

  .stats-item + .stats-item {
    border-left: 1px solid rgba(255, 255, 255, 0.06);
  }

  .stats-number {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(40px, 5vw, 64px);
    font-weight: 400;
    color: #c9a961;
    line-height: 1;
    margin: 0 0 12px 0;
    letter-spacing: -0.02em;
  }

  .stats-label {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.35em;
    color: rgba(255, 255, 255, 0.35);
    font-weight: 700;
    line-height: 1.8;
    white-space: pre-line;
  }

  @media (max-width: 768px) {
    .stats-inner {
      grid-template-columns: repeat(2, 1fr);
    }
    .stats-item:nth-child(3) {
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }
    .stats-item:nth-child(4) {
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }
    .stats-item {
      padding: 40px 24px;
    }
  }

  @media (max-width: 480px) {
    .stats-item {
      padding: 28px 12px;
    }
    .stats-number {
      font-size: clamp(28px, 8vw, 40px);
      margin-bottom: 8px;
    }
    .stats-label {
      font-size: 8px;
      letter-spacing: 0.25em;
    }
  }
`;

export const Stats = () => {
  const { t } = useLanguage();
  const stats = [
    { number: "5+", label: t.stats.yearsOfMastery },
    { number: "10K+", label: t.stats.satisfiedClients },
    { number: "5★", label: t.stats.googleRating },
    { number: "100%", label: t.stats.precisionEveryTime },
  ];
  return (
    <>
    <style>{statsStyles}</style>
    <div className="stats-strip">
      <div className="stats-inner">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="stats-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="stats-number">{s.number}</p>
            <p className="stats-label">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
    </>
  );
};
