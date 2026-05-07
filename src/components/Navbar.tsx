"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User, Scan, Menu, X } from "lucide-react";
import { Language } from "../translations";
import { User as FirebaseUser } from "firebase/auth";

const navbarStyles = `
  /* Navbar Container */
  .navbar {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 60;
    padding: 8px 24px;
    transition: all 500ms ease;
    background-color: rgba(23, 26, 23, 0.8);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(220, 208, 180, 0.05);
  }

  @media (min-width: 768px) {
    .navbar {
      padding: 10px 24px;
    }
  }

  .navbar-container {
    max-width: 80rem;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /* Left section */
  .navbar-left {
    display: flex;
    align-items: center;
    gap: 36px;
  }

  /* Logo */
  .navbar-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    transition: opacity 200ms ease;
    padding: 0;
    height: 40px;
    width: auto;
  }

  .navbar-logo:hover {
    opacity: 0.7;
  }

  /* Navigation menu (hidden on mobile) */
  .navbar-menu {
    display: none;
    align-items: center;
    gap: 28px;
  }

  @media (min-width: 1024px) {
    .navbar-menu {
      display: flex;
    }
  }

  /* Language selector */
  .navbar-languages {
    display: flex;
    align-items: center;
    gap: 4px;
    border-right: 1px solid rgba(220, 208, 180, 0.1);
    padding-right: 24px;
  }

  .navbar-lang-btn {
    font-size: 8.5px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 5px 7px;
    transition: all 200ms ease;
    background: none;
    border: none;
    cursor: pointer;
  }

  .navbar-lang-btn.active {
    color: #dcd0b4;
    text-decoration: underline;
  }

  .navbar-lang-btn:not(.active) {
    color: rgba(220, 208, 180, 0.2);
  }

  .navbar-lang-btn:not(.active):hover {
    color: rgba(220, 208, 180, 0.6);
  }

  /* Menu links */
  .navbar-links {
    display: flex;
    gap: 28px;
  }

  .navbar-link {
    font-size: 9.5px;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    color: rgba(220, 208, 180, 0.4);
    transition: color 200ms ease;
    text-decoration: none;
    font-weight: 700;
  }

  .navbar-link:hover {
    color: #dcd0b4;
  }

  /* Right section */
  .navbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  @media (min-width: 768px) {
    .navbar-right {
      gap: 16px;
    }
  }

  /* Admin button (hidden on mobile) */
  .navbar-admin {
    display: none;
    align-items: center;
    gap: 7px;
    font-size: 9.5px;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-weight: 700;
    color: #e85d4d;
    transition: color 200ms ease;
    background: none;
    border: none;
    cursor: pointer;
  }

  @media (min-width: 768px) {
    .navbar-admin {
      display: flex;
    }
  }

  .navbar-admin:hover {
    color: #fff;
  }

  /* Auth section */
  .navbar-auth {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  @media (min-width: 768px) {
    .navbar-auth {
      gap: 12px;
    }
  }

  /* User button */
  .navbar-user-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid rgba(220, 208, 180, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(220, 208, 180, 0.4);
    transition: color 200ms ease;
    background: none;
    cursor: pointer;
  }

  .navbar-user-btn:hover {
    color: #dcd0b4;
  }

  .navbar-user-btn:hover svg {
    transform: scale(1.1);
    transition: transform 200ms ease;
  }

  /* Login button */
  .navbar-login-btn {
    font-size: 8.5px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(220, 208, 180, 0.4);
    transition: color 200ms ease;
    margin-right: 8px;
    font-weight: 900;
    background: none;
    border: none;
    cursor: pointer;
  }

  .navbar-login-btn:hover {
    color: #dcd0b4;
  }

  /* Book Now button */
  .navbar-book-btn {
    background-color: #dcd0b4;
    color: #2d3b2d;
    font-size: 8.5px;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-weight: 900;
    padding: 12px 24px;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    transition: background-color 200ms ease;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  }

  .navbar-book-btn:hover {
    background-color: #fff;
  }

  /* Mobile menu button */
  .navbar-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: #dcd0b4;
    cursor: pointer;
    padding: 0;
    transition: opacity 200ms ease;
  }

  .navbar-menu-btn:hover {
    opacity: 0.7;
  }

  @media (min-width: 1024px) {
    .navbar-menu-btn {
      display: none;
    }
  }

  /* Mobile menu overlay */
  .navbar-mobile-menu {
    display: none;
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background-color: rgba(23, 26, 23, 0.95);
    border-bottom: 1px solid rgba(220, 208, 180, 0.1);
    padding: 20px 24px;
    flex-direction: column;
    gap: 16px;
  }

  .navbar-mobile-menu.open {
    display: flex;
  }

  @media (min-width: 1024px) {
    .navbar-mobile-menu {
      display: none !important;
    }
  }

  .navbar-mobile-languages {
    display: flex;
    gap: 8px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(220, 208, 180, 0.1);
  }

  .navbar-mobile-links {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .navbar-mobile-link {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    color: rgba(220, 208, 180, 0.4);
    transition: color 200ms ease;
    text-decoration: none;
    font-weight: 700;
  }

  .navbar-mobile-link:hover {
    color: #dcd0b4;
  }
`;

interface NavbarProps {
  lang: Language;
  setLang: (lang: Language) => void;
  setView: (view: any) => void;
  setAuthMode: (mode: "login" | "register") => void;
  user: FirebaseUser | null;
  userData: any;
  t: any;
  startBooking: () => void;
}

export const Navbar = ({
  lang,
  setLang,
  setView,
  setAuthMode,
  user,
  userData,
  t,
  startBooking,
}: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <style>{navbarStyles}</style>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <button onClick={() => setView("home")} className="navbar-logo">
              <Image
                src="/logo.png"
                alt="Dardan Barbershop"
                width={90}
                height={90}
                style={{ height: "auto", width: "auto" }}
              />
            </button>

            <div className="navbar-menu">
              <div className="navbar-languages">
                {(["en", "al", "mk"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`navbar-lang-btn ${lang === l ? "active" : ""}`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <div className="navbar-links">
                <a href="#menu" className="navbar-link">
                  {t.theCatalogue}
                </a>
                <a href="#barbers" className="navbar-link">
                  {t.theCraftsmen}
                </a>
                <a href="#info" className="navbar-link">
                  {t.location}
                </a>
              </div>
            </div>
          </div>

          <div className="navbar-right">
            {userData?.isAdmin && (
              <button onClick={() => setView("admin")} className="navbar-admin">
                <Scan size={14} /> {t.bossMode}
              </button>
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="navbar-menu-btn"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="navbar-auth">
              {user ? (
                <button
                  onClick={() => setView("loyalty")}
                  className="navbar-user-btn"
                >
                  <User size={18} />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setView("auth");
                  }}
                  className="navbar-login-btn"
                >
                  {t.login}
                </button>
              )}

              <button
                onClick={() => startBooking()}
                className="navbar-book-btn"
              >
                {t.bookNow}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`navbar-mobile-menu ${menuOpen ? "open" : ""}`}>
          <div className="navbar-mobile-languages">
            {(["en", "al", "mk"] as const).map((l) => (
              <button
                key={l}
                onClick={() => {
                  setLang(l);
                  setMenuOpen(false);
                }}
                className={`navbar-lang-btn ${lang === l ? "active" : ""}`}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="navbar-mobile-links">
            <a
              href="#menu"
              className="navbar-mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {t.theCatalogue}
            </a>
            <a
              href="#barbers"
              className="navbar-mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {t.theCraftsmen}
            </a>
            <a
              href="#info"
              className="navbar-mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {t.location}
            </a>
          </div>
        </div>
      </nav>
    </>
  );
};
