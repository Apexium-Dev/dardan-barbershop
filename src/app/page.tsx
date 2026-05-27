"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { Catalogue } from "@/components/Catalogue";
import { Gallery } from "@/components/Gallery";
import { Craftsmen } from "@/components/Craftsmen";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { LoadingScreen } from "@/components/LoadingScreen";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  const startBooking = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      router.push("/profile");
    } else {
      router.push("/auth");
    }
  };

  const setView = (view: string) => {
    if (view === "loyalty" || view === "profile") {
      router.push("/profile");
    } else if (view === "admin") {
      router.push("/barber");
    }
  };

  return (
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      <main
        style={{
          backgroundColor: "#0f0f0f",
          color: "#ffffff",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        <Navbar
          lang="en"
          setLang={() => {}}
          setView={setView}
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
          startBooking={startBooking}
        />
        <Hero
          t={{
            heroTitle: "Precision in",
            heroSubtitle: "Every Detail.",
            memberPortal: "Member Portal",
            bookNow: "Book Now",
          }}
          startBooking={startBooking}
          setView={setView}
        />
        <Stats />
        <Catalogue startBooking={startBooking} />
        <Gallery />
        <Craftsmen />
        <Footer />
        <ScrollToTop />
      </main>
    </>
  );
}
