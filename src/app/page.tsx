"use client";

import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <main>
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
    </main>
  );
}
