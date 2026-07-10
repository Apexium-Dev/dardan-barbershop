"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/LanguageContext";

interface GalleryPhoto {
  id: string;
  storage_path: string;
  caption: string | null;
}

const galleryStyles = `
  .gallery-section {
    padding: 72px 48px 96px;
    background-color: #0f0f0f;
  }

  .gallery-inner {
    max-width: 90rem;
    margin: 0 auto;
  }

  .gallery-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
  }

  .gallery-eyebrow-line {
    width: 40px;
    height: 1px;
    background-color: #c9a961;
    flex-shrink: 0;
  }

  .gallery-eyebrow {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    color: #c9a961;
    font-weight: 700;
  }

  .gallery-title-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
    flex-wrap: wrap;
  }

  .gallery-title {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(48px, 6vw, 88px);
    font-weight: 400;
    line-height: 1;
    color: #ffffff;
    margin: 0 0 8px 0;
  }

  .gallery-title em {
    font-style: italic;
    color: #c9a961;
  }

  .gallery-view-all {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #c9a961;
    text-decoration: none;
    border-bottom: 1px solid rgba(201, 169, 97, 0.3);
    padding-bottom: 4px;
    transition: border-color 200ms ease, color 200ms ease;
    white-space: nowrap;
  }

  .gallery-view-all:hover {
    color: #e8c47a;
    border-color: #e8c47a;
  }

  .gallery-divider {
    width: 100%;
    height: 1px;
    background: rgba(255, 255, 255, 0.07);
    margin: 24px 0 40px 0;
  }

  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .gallery-item {
    position: relative;
    aspect-ratio: 1;
    border-radius: 8px;
    overflow: hidden;
    background-color: #1a1a1a;
  }

  .gallery-image {
    object-fit: cover;
    filter: grayscale(100%);
    transition: filter 1000ms ease, transform 1000ms ease;
  }

  .gallery-item:hover .gallery-image {
    filter: grayscale(0%);
    transform: scale(1.05);
  }

  .gallery-item-overlay {
    position: absolute;
    inset: 0;
    background: rgba(201, 169, 97, 0.06);
    opacity: 0;
    transition: opacity 600ms ease;
    pointer-events: none;
  }

  .gallery-item:hover .gallery-item-overlay {
    opacity: 1;
  }

  .gallery-empty {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.35);
    padding: 20px 0 0;
  }

  @media (max-width: 1024px) {
    .gallery-section { padding: 56px 32px 72px; }
    .gallery-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
  }

  @media (max-width: 640px) {
    .gallery-section { padding: 48px 20px 64px; }
    .gallery-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .gallery-title-row { flex-direction: column; align-items: flex-start; }
  }
`;

export const Gallery = () => {
  const { t } = useLanguage();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const { data } = await supabase
          .from("gallery_photos")
          .select("id, storage_path, caption")
          .order("created_at", { ascending: false })
          .limit(6);
        setPhotos(data ?? []);
      } finally {
        setLoading(false);
      }
    };
    loadPhotos();
  }, []);

  return (
    <>
      <style>{galleryStyles}</style>
      <section id="gallery" className="gallery-section">
        <div className="gallery-inner">
          <div className="gallery-header">
            <div className="gallery-eyebrow-line" />
            <span className="gallery-eyebrow">{t.gallery.eyebrow}</span>
          </div>
          <div className="gallery-title-row">
            <h2 className="gallery-title">
              {t.gallery.titlePlain} <em>{t.gallery.titleItalic}</em>
            </h2>
            <Link href="/gallery" className="gallery-view-all">
              {t.gallery.viewAll}
            </Link>
          </div>
          <div className="gallery-divider" />

          {loading && <p className="gallery-empty">{t.gallery.loading}</p>}
          {!loading && photos.length === 0 && (
            <p className="gallery-empty">{t.gallery.empty}</p>
          )}
          {!loading && photos.length > 0 && (
            <div className="gallery-grid">
              {photos.map((photo, i) => {
                const url = supabase.storage
                  .from("gallery")
                  .getPublicUrl(photo.storage_path).data.publicUrl;
                return (
                  <motion.div
                    key={photo.id}
                    className="gallery-item"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.08,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                  >
                    <Image
                      src={url}
                      alt={photo.caption ?? "Dardan Barbershop"}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="gallery-image"
                    />
                    <div className="gallery-item-overlay" />
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
