"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Catalogue } from "@/components/Catalogue";
import { Craftsmen } from "@/components/Craftsmen";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
    <main style={{ backgroundColor: "#0f0f0f", color: "#ffffff", opacity: loaded ? 1 : 0, transition: "opacity 0.6s ease" }}>
      <Navbar
        lang="en"
        setLang={() => {}}
        setView={() => {}}
        user={null}
        userData={null}
        t={{
          theCatalogue: "The Catalogue",
          theCraftsmen: "The Craftsmen",
          location: "Location",
          bossMode: "Boss Mode",
          login: "Login",
          bookNow: "Book Now",
        }}
        startBooking={() => {}}
      />
      <Hero
        t={{
          heroTitle: "Precision Craftsmanship",
          heroSubtitle: "In Every Cut",
          memberPortal: "Member Portal",
          bookNow: "Book Now",
        }}
        startBooking={() => {}}
        setView={() => {}}
      />
      <Catalogue startBooking={() => {}} />
      <Craftsmen />
      <Footer />
      <ScrollToTop />
    </main>
    </>
  );
}
