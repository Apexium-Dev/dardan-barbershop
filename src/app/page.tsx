"use client";

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Legacy } from "@/components/Legacy";
import { Catalogue } from "@/components/Catalogue";

export default function Home() {
  return (
    <main style={{ backgroundColor: "#0f0f0f", color: "#ffffff" }}>
      <Navbar
        lang="en"
        setLang={() => {}}
        setView={() => {}}
        setAuthMode={() => {}}
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
      <Legacy />
      <Catalogue startBooking={() => {}} />
    </main>
  );
}
