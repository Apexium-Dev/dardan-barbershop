"use client";

import { useEffect, useState } from "react";

export const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        .scroll-top-btn {
          position: fixed;
          bottom: 32px;
          right: 32px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: #c9a961;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0f0f0f;
          z-index: 50;
          transition: opacity 300ms ease, transform 300ms ease, background-color 200ms ease;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }

        .scroll-top-btn:hover {
          background-color: #ffffff;
          transform: translateY(-3px);
        }

        .scroll-top-btn.hidden {
          opacity: 0;
          pointer-events: none;
          transform: translateY(12px);
        }

        .scroll-top-btn.visible {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
        }

        @media (max-width: 640px) {
          .scroll-top-btn {
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
      <button
        className={`scroll-top-btn ${visible ? "visible" : "hidden"}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </>
  );
};
