"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { useLanguage } from "@/lib/LanguageContext";

interface GalleryPhoto {
  id: string;
  storage_path: string;
  caption: string | null;
}

export default function GalleryPage() {
  const { t } = useLanguage();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<GalleryPhoto | null>(null);

  const [isBarber, setIsBarber] = useState(false);
  const [barberId, setBarberId] = useState<string>("");
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPhotos = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("gallery_photos")
        .select("id, storage_path, caption")
        .order("created_at", { ascending: false });
      setPhotos(data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();

    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();
      if (profile?.role === "barber") {
        setBarberId(data.user.id);
        setIsBarber(true);
      }
    });
  }, []);

  const urlFor = (path: string) =>
    supabase.storage.from("gallery").getPublicUrl(path).data.publicUrl;

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setUploadError(t.gallery.chooseFirst);
      return;
    }
    setUploadError("");
    setUploading(true);

    const ext = file.name.split(".").pop() || "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from("gallery")
      .upload(path, file);

    if (uploadErr) {
      setUploading(false);
      setUploadError("Upload failed: " + uploadErr.message);
      return;
    }

    const { error: insertErr } = await supabase.from("gallery_photos").insert({
      storage_path: path,
      caption: uploadCaption.trim() || null,
      uploaded_by: barberId,
    });

    setUploading(false);
    if (insertErr) {
      setUploadError("Save failed: " + insertErr.message);
      return;
    }

    setUploadCaption("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    loadPhotos();
  };

  const handleDeletePhoto = async (photo: GalleryPhoto) => {
    if (!window.confirm(t.gallery.confirmRemovePhoto)) return;
    await supabase.storage.from("gallery").remove([photo.storage_path]);
    await supabase.from("gallery_photos").delete().eq("id", photo.id);
    if (active?.id === photo.id) setActive(null);
    loadPhotos();
  };

  return (
    <>
      <Navbar
        setView={() => {}}
        user={null}
        userData={null}
        startBooking={() => {}}
      />
      <style>{`
        .full-gallery-page { padding: 48px 24px 96px; margin-top: 80px; }
        .full-gallery-inner { max-width: 90rem; margin: 0 auto; }
        .full-gallery-upload {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
          background: rgba(20,20,20,0.92);
          border: 1px solid rgba(201,169,97,0.18);
          border-radius: 4px;
          padding: 20px 24px;
          margin-bottom: 40px;
        }
        .full-gallery-upload-input {
          color: rgba(255,255,255,0.6);
          font-size: 13px;
          flex: 1 1 200px;
        }
        .full-gallery-upload-caption {
          flex: 1 1 180px;
          padding: 12px 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 4px;
          color: #fff;
          font-size: 13px;
          outline: none;
          box-sizing: border-box;
          font-family: inherit;
        }
        .full-gallery-upload-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 4px;
          background: linear-gradient(135deg, #8a6f3a, #c9a961);
          color: #0f0f0f;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          cursor: pointer;
        }
        .full-gallery-upload-error {
          width: 100%;
          background: rgba(220,60,60,0.12);
          border: 1px solid rgba(220,60,60,0.3);
          color: #f87171;
          font-size: 13px;
          padding: 10px 14px;
          border-radius: 4px;
        }
        .full-gallery-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .full-gallery-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          background-color: #1a1a1a;
          cursor: pointer;
        }
        .full-gallery-image {
          object-fit: cover;
          filter: grayscale(100%);
          transition: filter 600ms ease, transform 600ms ease;
        }
        .full-gallery-item:hover .full-gallery-image {
          filter: grayscale(0%);
          transform: scale(1.05);
        }
        .full-gallery-remove-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: none;
          background: rgba(15,15,15,0.75);
          color: #fff;
          font-size: 16px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }
        .full-gallery-lightbox {
          position: fixed;
          inset: 0;
          background: rgba(10, 10, 10, 0.95);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }
        .full-gallery-lightbox-inner {
          position: relative;
          max-width: 900px;
          width: 100%;
        }
        .full-gallery-lightbox-close {
          position: absolute;
          top: -44px;
          right: 0;
          background: none;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18px;
          line-height: 1;
        }
        .full-gallery-caption {
          margin-top: 16px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          text-align: center;
        }
        .full-gallery-empty {
          color: rgba(255, 255, 255, 0.35);
          font-size: 14px;
          padding: 80px 0;
          text-align: center;
        }
        @media (max-width: 1024px) {
          .full-gallery-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 640px) {
          .full-gallery-page { padding: 24px 16px 64px; }
          .full-gallery-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
        }
      `}</style>

      <div
        className="full-gallery-page"
        style={{ background: "#0f0f0f", minHeight: "60vh" }}
      >
        <div className="full-gallery-inner">
          <p
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.35em",
              color: "#c9a961",
              fontWeight: 700,
              margin: "0 0 6px",
            }}
          >
            {t.gallery.eyebrow}
          </p>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 400,
              color: "#fff",
              margin: "0 0 32px",
            }}
          >
            {t.gallery.fullTitlePlain}{" "}
            <em style={{ fontStyle: "italic", color: "#c9a961" }}>
              {t.gallery.fullTitleItalic}
            </em>
          </h1>

          {isBarber && (
            <div className="full-gallery-upload">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="full-gallery-upload-input"
              />
              <input
                type="text"
                placeholder={t.gallery.captionPlaceholder}
                value={uploadCaption}
                onChange={(e) => setUploadCaption(e.target.value)}
                className="full-gallery-upload-caption"
              />
              <button
                className="full-gallery-upload-btn"
                onClick={handleUpload}
                disabled={uploading}
                type="button"
                style={{ opacity: uploading ? 0.6 : 1 }}
              >
                {uploading ? t.gallery.uploading : t.gallery.uploadPhoto}
              </button>
              {uploadError && (
                <p className="full-gallery-upload-error">{uploadError}</p>
              )}
            </div>
          )}

          {loading && <p className="full-gallery-empty">{t.gallery.loading}</p>}
          {!loading && photos.length === 0 && (
            <p className="full-gallery-empty">{t.gallery.empty}</p>
          )}

          {!loading && photos.length > 0 && (
            <div className="full-gallery-grid">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="full-gallery-item"
                  onClick={() => setActive(photo)}
                >
                  {isBarber && (
                    <button
                      className="full-gallery-remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePhoto(photo);
                      }}
                      type="button"
                      aria-label="Remove photo"
                    >
                      ×
                    </button>
                  )}
                  <Image
                    src={urlFor(photo.storage_path)}
                    alt={photo.caption ?? "Dardan Barbershop"}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="full-gallery-image"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {active && (
        <div
          className="full-gallery-lightbox"
          onClick={() => setActive(null)}
        >
          <div
            className="full-gallery-lightbox-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="full-gallery-lightbox-close"
              onClick={() => setActive(null)}
              type="button"
              aria-label="Close"
            >
              ×
            </button>
            <div style={{ position: "relative", width: "100%", aspectRatio: "4/3" }}>
              <Image
                src={urlFor(active.storage_path)}
                alt={active.caption ?? "Dardan Barbershop"}
                fill
                sizes="900px"
                style={{ objectFit: "contain" }}
              />
            </div>
            {active.caption && (
              <p className="full-gallery-caption">{active.caption}</p>
            )}
          </div>
        </div>
      )}

      <Footer />
      <ScrollToTop />
    </>
  );
}
