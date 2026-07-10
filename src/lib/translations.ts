export type Language = "en" | "al" | "mk";

export interface Translations {
  nav: {
    catalogue: string;
    craftsmen: string;
    gallery: string;
    location: string;
    bossMode: string;
    login: string;
    myProfile: string;
    bookNow: string;
  };
  stats: {
    yearsOfMastery: string;
    satisfiedClients: string;
    googleRating: string;
    precisionEveryTime: string;
  };
  hero: {
    established: string;
    heroTitle: string;
    heroSubtitle: string;
    bookNow: string;
    memberPortal: string;
    quotePrefix: string;
    quoteHighlight: string;
  };
  catalogue: {
    eyebrow: string;
    headingPlain: string;
    headingItalic: string;
    description: string;
    qualityLabel: string;
    footerNote: string;
    services: { name: string; price: string; desc: string; duration: string }[];
  };
  craftsmen: {
    eyebrow: string;
    titlePlain: string;
    titleItalic: string;
    role: string;
    bio: string;
  };
  gallery: {
    eyebrow: string;
    titlePlain: string;
    titleItalic: string;
    viewAll: string;
    loading: string;
    empty: string;
    fullTitlePlain: string;
    fullTitleItalic: string;
    uploadPhoto: string;
    uploading: string;
    captionPlaceholder: string;
    chooseFirst: string;
    confirmRemovePhoto: string;
  };
  footer: {
    tagline: string;
    location: string;
    address1: string;
    address2: string;
    availability: string;
    monFri: string;
    saturday: string;
    sunday: string;
    closed: string;
    copyright: string;
    privacy: string;
    terms: string;
    craftedBy: string;
  };
  auth: {
    welcomeBack: string;
    signInTitle1: string;
    signInTitle2: string;
    joinClub: string;
    createTitle1: string;
    createTitle2: string;
    noWorries: string;
    resetTitle1: string;
    resetTitle2: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phone: string;
    forgotPassword: string;
    signIn: string;
    signingIn: string;
    dontHaveAccount: string;
    createOne: string;
    createAccount: string;
    creatingAccount: string;
    alreadyHaveAccount: string;
    signInLink: string;
    resetHint: string;
    sendResetLink: string;
    sending: string;
    backToSignIn: string;
    termsPrefix: string;
    termsLink: string;
    and: string;
    privacyLink: string;
    fillAllFields: string;
    passwordsNoMatch: string;
    passwordTooShort: string;
    accountCreated: string;
    enterEmail: string;
    resetSent: string;
  };
  profile: {
    account: string;
    myProfileTitle1: string;
    myProfileTitle2: string;
    editProfile: string;
    firstName: string;
    lastName: string;
    email: string;
    readOnly: string;
    phone: string;
    memberSince: string;
    cancel: string;
    saveChanges: string;
    saving: string;
    profileUpdated: string;
    member: string;
    memberLabel: string;
    barberLabel: string;
    barberTools: string;
    scanMemberQr: string;
    scanHint: string;
    yourCode: string;
    codeHint: string;
    signOut: string;
    loyaltyLabel: string;
    loyaltyFreeSingular: string;
    loyaltyFreePlural: string;
    loyaltyMoreToEarn: string;
  };
  barber: {
    barberPanel: string;
    scanTitle1: string;
    scanTitle2: string;
    qrScanner: string;
    startCamera: string;
    cancel: string;
    memberSince: string;
    notes: string;
    notesPlaceholder: string;
    discard: string;
    saveVisit: string;
    saving: string;
    visitSaved: string;
    recentVisits: string;
    loading: string;
    noVisits: string;
    galleryManagement: string;
    uploadPhoto: string;
    uploading: string;
    captionPlaceholder: string;
    noPhotos: string;
    chooseFirst: string;
    confirmRemovePhoto: string;
    invalidQr: string;
    memberNotFound: string;
    loyaltyProgress: string;
    freeHaircutSingularAvailable: string;
    freeHaircutPluralAvailable: string;
    redeemFreeHaircut: string;
    freeBadge: string;
    redemptionSaved: string;
  };
  legal: {
    backHome: string;
    legalLabel: string;
    lastUpdated: string;
    privacy: {
      title: string;
      intro: string;
      infoCollectTitle: string;
      infoCollectIntro: string;
      infoCollectItems: string[];
      infoUseTitle: string;
      infoUseIntro: string;
      infoUseItems: string[];
      sharingTitle: string;
      sharingBody: string;
      securityTitle: string;
      securityBody: string;
      cookiesTitle: string;
      cookiesBody: string;
      rightsTitle: string;
      rightsIntro: string;
      rightsItems: string[];
      rightsOutro: string;
      contactTitle: string;
    };
    terms: {
      title: string;
      intro: string;
      appointmentsTitle: string;
      appointmentsItems: string[];
      paymentsTitle: string;
      paymentsItems: string[];
      conductTitle: string;
      conductBody: string;
      usageTitle: string;
      usageBody: string;
      contentTitle: string;
      contentBody: string;
      liabilityTitle: string;
      liabilityIntro: string;
      liabilityItems: string[];
      changesTitle: string;
      changesBody: string;
      contactTitle: string;
    };
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      catalogue: "The Catalogue",
      craftsmen: "The Craftsmen",
      gallery: "Gallery",
      location: "Location",
      bossMode: "Boss Mode",
      login: "Login",
      myProfile: "My Profile",
      bookNow: "Book Now",
    },
    stats: {
      yearsOfMastery: "Years of\nMastery",
      satisfiedClients: "Satisfied\nClients",
      googleRating: "Google\nRating",
      precisionEveryTime: "Precision\nEvery Time",
    },
    hero: {
      established: "Established 2007",
      heroTitle: "Precision in",
      heroSubtitle: "Every Detail.",
      bookNow: "Book Now",
      memberPortal: "Member Portal",
      quotePrefix: "“Precision in",
      quoteHighlight: "Every Move.”",
    },
    catalogue: {
      eyebrow: "The Catalogue",
      headingPlain: "The",
      headingItalic: "Catalogue.",
      description:
        "A curated selection of grooming excellence. Each session is a tailored experience crafted to your structure and style.",
      qualityLabel: "Quality Assurance",
      footerNote: "Consultations are complimentary with every service.",
      services: [
        { name: "Haircut", price: "250 den", desc: "A clean, precise cut tailored to your head shape and style. No shortcuts taken.", duration: "30 min" },
        { name: "Beard Trim", price: "150 den", desc: "Defined edges, even length, sculpted shape. Groomed but natural.", duration: "20 min" },
        { name: "Hair Wash", price: "100 den", desc: "Thorough scalp cleanse with quality products. A clean foundation for every cut.", duration: "10 min" },
        { name: "Eyebrows — Thread", price: "200 den", desc: "Precise eyebrow shaping using traditional threading technique for clean definition.", duration: "15 min" },
        { name: "Eyebrows — Wax", price: "150 den", desc: "Quick and clean eyebrow shaping with wax. Smooth finish, sharp lines.", duration: "10 min" },
        { name: "Nose & Ear Wax", price: "200 den", desc: "Hygienic removal of unwanted hair from nose and ears using warm wax.", duration: "15 min" },
        { name: "Hair Bleach & Color", price: "1200 den", desc: "Full bleach process followed by your chosen color. Expertly handled from start to finish.", duration: "2+ hrs" },
        { name: "Black Hair Coloring", price: "200 den", desc: "Restore rich, deep black color to your hair. Even application, lasting results.", duration: "45 min" },
        { name: "Black Beard Coloring", price: "200 den", desc: "Deep black dye applied evenly to the beard. Looks fresh, stays sharp.", duration: "30 min" },
        { name: "Black Hair & Beard", price: "400 den", desc: "Combined hair and beard coloring in black. Full, unified look in one session.", duration: "60 min" },
        { name: "Mask & Steam Treatment", price: "300 den", desc: "Deep conditioning mask applied under steam for maximum absorption and softness.", duration: "30 min" },
      ],
    },
    craftsmen: {
      eyebrow: "The Team",
      titlePlain: "The",
      titleItalic: "Craftsmen.",
      role: "Master Barber & Founder",
      bio: "With over 5 years of experience, Dardan built this shop from the ground up on a single principle — every client deserves the very best.",
    },
    gallery: {
      eyebrow: "The Work",
      titlePlain: "The",
      titleItalic: "Gallery.",
      viewAll: "View Full Gallery →",
      loading: "Loading…",
      empty: "No photos yet — check back soon.",
      fullTitlePlain: "Full",
      fullTitleItalic: "Gallery",
      uploadPhoto: "Upload Photo",
      uploading: "Uploading…",
      captionPlaceholder: "Caption (optional)",
      chooseFirst: "Choose a photo first.",
      confirmRemovePhoto: "Remove this photo from the gallery?",
    },
    footer: {
      tagline:
        "Precision craftsmanship rooted in tradition. Every cut tells a story of nearly two decades of mastery.",
      location: "Location",
      address1: "20m near General Hospital",
      address2: "Dibër, Macedonia",
      availability: "Availability",
      monFri: "Mon — Fri",
      saturday: "Saturday",
      sunday: "Sunday",
      closed: "Closed",
      copyright: "All rights reserved.",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      craftedBy: "Crafted by Apexium Dev",
    },
    auth: {
      welcomeBack: "Welcome Back",
      signInTitle1: "Sign",
      signInTitle2: "In",
      joinClub: "Join the Club",
      createTitle1: "Create",
      createTitle2: "Account",
      noWorries: "No Worries",
      resetTitle1: "Reset",
      resetTitle2: "Password",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      firstName: "First Name",
      lastName: "Last Name",
      phone: "Phone",
      forgotPassword: "Forgot password?",
      signIn: "Sign In",
      signingIn: "Signing in…",
      dontHaveAccount: "Don't have an account?",
      createOne: "Create one",
      createAccount: "Create Account",
      creatingAccount: "Creating account…",
      alreadyHaveAccount: "Already have an account?",
      signInLink: "Sign in",
      resetHint:
        "Enter the email address linked to your account and we'll send you a reset link.",
      sendResetLink: "Send Reset Link",
      sending: "Sending…",
      backToSignIn: "Back to Sign In",
      termsPrefix: "By creating an account you agree to our",
      termsLink: "Terms of Service",
      and: "and",
      privacyLink: "Privacy Policy",
      fillAllFields: "Please fill in all fields.",
      passwordsNoMatch: "Passwords do not match.",
      passwordTooShort: "Password must be at least 6 characters.",
      accountCreated: "Account created! Check your email to confirm your address.",
      enterEmail: "Please enter your email address.",
      resetSent: "Reset link sent! Check your inbox.",
    },
    profile: {
      account: "Account",
      myProfileTitle1: "My",
      myProfileTitle2: "Profile",
      editProfile: "Edit Profile",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      readOnly: "read-only",
      phone: "Phone",
      memberSince: "Member Since",
      cancel: "Cancel",
      saveChanges: "Save Changes",
      saving: "Saving…",
      profileUpdated: "Profile updated.",
      member: "Member",
      memberLabel: "Dardan Barbershop Member",
      barberLabel: "Dardan Barbershop — Barber",
      barberTools: "Barber Tools",
      scanMemberQr: "Scan Member QR",
      scanHint: "Open the scanner to log a visit",
      yourCode: "Your Member Code",
      codeHint: "Show this at the barbershop",
      signOut: "Sign Out",
      loyaltyLabel: "Loyalty",
      loyaltyFreeSingular: "free haircut ready",
      loyaltyFreePlural: "free haircuts ready",
      loyaltyMoreToEarn: "more to earn a free haircut",
    },
    barber: {
      barberPanel: "Barber Panel",
      scanTitle1: "Scan",
      scanTitle2: "Member",
      qrScanner: "QR Scanner",
      startCamera: "📷 Start Camera",
      cancel: "Cancel",
      memberSince: "Member since",
      notes: "Notes (optional)",
      notesPlaceholder: "e.g. skin fade, beard trim…",
      discard: "Discard",
      saveVisit: "✓ Save Visit",
      saving: "Saving…",
      visitSaved: "✓ Visit saved!",
      recentVisits: "Recent Visits",
      loading: "Loading…",
      noVisits: "No visits recorded yet.",
      galleryManagement: "Gallery Management",
      uploadPhoto: "Upload Photo",
      uploading: "Uploading…",
      captionPlaceholder: "Caption (optional)",
      noPhotos: "No photos uploaded yet.",
      chooseFirst: "Choose a photo first.",
      confirmRemovePhoto: "Remove this photo from the gallery?",
      invalidQr: "Invalid QR code — not a Dardan Barbershop member code.",
      memberNotFound: "Member not found. They may need to re-register.",
      loyaltyProgress: "Loyalty Progress",
      freeHaircutSingularAvailable: "free haircut available",
      freeHaircutPluralAvailable: "free haircuts available",
      redeemFreeHaircut: "Redeem Free Haircut",
      freeBadge: "FREE",
      redemptionSaved: "Free haircut redeemed!",
    },
    legal: {
      backHome: "← Back to home",
      legalLabel: "Legal",
      lastUpdated: "Last updated: May 2026",
      privacy: {
        title: "Privacy Policy",
        intro:
          "Welcome to Barbershop Dardan. We respect your privacy and are committed to protecting any personal information you share with us through our website, social media pages, or booking/contact forms.",
        infoCollectTitle: "Information We Collect",
        infoCollectIntro: "We may collect:",
        infoCollectItems: [
          "Name",
          "Phone number",
          "Email address",
          "Appointment details",
          "Messages you send us",
          "Basic website usage information (such as pages visited)",
        ],
        infoUseTitle: "How We Use Your Information",
        infoUseIntro: "We use your information to:",
        infoUseItems: [
          "Book and manage appointments",
          "Contact you about your booking",
          "Improve our services and website",
          "Respond to questions or requests",
          "Send updates or promotions (only if you agree)",
        ],
        sharingTitle: "Information Sharing",
        sharingBody:
          "We do not sell or rent your personal information. Your data may only be shared with trusted service providers that help us operate the website or booking system.",
        securityTitle: "Data Security",
        securityBody:
          "We take reasonable measures to protect your information from unauthorized access, loss, or misuse.",
        cookiesTitle: "Cookies",
        cookiesBody:
          "Our website may use cookies to improve user experience and analyze website traffic.",
        rightsTitle: "Your Rights",
        rightsIntro: "You may request to:",
        rightsItems: [
          "Access your data",
          "Correct your information",
          "Delete your information",
          "Stop receiving promotional messages",
        ],
        rightsOutro: "To do so, contact us using the information below.",
        contactTitle: "Contact",
      },
      terms: {
        title: "Terms of Service",
        intro:
          "By using the Barbershop Dardan website or booking services, you agree to the following terms.",
        appointmentsTitle: "Appointments",
        appointmentsItems: [
          "Clients are encouraged to arrive on time.",
          "Late arrivals may result in shortened or canceled appointments.",
          "Appointments can be canceled or rescheduled in advance.",
        ],
        paymentsTitle: "Payments",
        paymentsItems: [
          "Prices for services are displayed in the shop or on our website/social media.",
          "Payment is due after services are completed.",
        ],
        conductTitle: "Conduct",
        conductBody:
          "We reserve the right to refuse service to anyone displaying inappropriate, abusive, or unsafe behavior.",
        usageTitle: "Website Usage",
        usageBody:
          "You agree not to misuse the website, attempt unauthorized access, or disrupt website functionality.",
        contentTitle: "Content",
        contentBody:
          "All website content including logos, photos, and designs belongs to Barbershop Dardan unless otherwise stated.",
        liabilityTitle: "Limitation of Liability",
        liabilityIntro:
          "We aim to provide accurate information and quality services, but we are not responsible for:",
        liabilityItems: [
          "Temporary website downtime",
          "Third-party service interruptions",
          "Indirect damages resulting from website use",
        ],
        changesTitle: "Changes to Terms",
        changesBody:
          "We may update these Terms of Service at any time. Continued use of the website means you accept the updated terms.",
        contactTitle: "Contact",
      },
    },
  },

  al: {
    nav: {
      catalogue: "Katalogu",
      craftsmen: "Mjeshtrit",
      gallery: "Galeria",
      location: "Vendndodhja",
      bossMode: "Modaliteti i Pronarit",
      login: "Kyçu",
      myProfile: "Profili Im",
      bookNow: "Rezervo Tani",
    },
    stats: {
      yearsOfMastery: "Vite\nMjeshtërie",
      satisfiedClients: "Klientë\nTë Kënaqur",
      googleRating: "Vlerësim\nnë Google",
      precisionEveryTime: "Precizion\nÇdo Herë",
    },
    hero: {
      established: "Themeluar në 2007",
      heroTitle: "Precizion në",
      heroSubtitle: "Çdo Detaj.",
      bookNow: "Rezervo Tani",
      memberPortal: "Portali i Anëtarit",
      quotePrefix: "“Precizion në",
      quoteHighlight: "çdo Lëvizje.”",
    },
    catalogue: {
      eyebrow: "Katalogu",
      headingPlain: "",
      headingItalic: "Katalogu.",
      description:
        "Një përzgjedhje e kuruar e përsosmërisë në grooming. Çdo seancë është një përvojë e përshtatur për strukturën dhe stilin tuaj.",
      qualityLabel: "Garanci Cilësie",
      footerNote: "Konsultimi është falas me çdo shërbim.",
      services: [
        { name: "Prerje Flokësh", price: "250 den", desc: "Prerje e pastër dhe precize, e përshtatur formës së kokës dhe stilit tuaj. Pa kompromis.", duration: "30 min" },
        { name: "Rregullim Mjekre", price: "150 den", desc: "Kontura të qarta, gjatësi e njëtrajtshme, formë e skalitur. E kultivuar, por natyrale.", duration: "20 min" },
        { name: "Larje Flokësh", price: "100 den", desc: "Pastrim i thellë i kokës me produkte cilësore. Baza e pastër për çdo prerje.", duration: "10 min" },
        { name: "Vetulla — me Fill", price: "200 den", desc: "Formësim precize i vetullave me teknikën tradicionale të fillit, për kontura të pastra.", duration: "15 min" },
        { name: "Vetulla — me Dyll", price: "150 den", desc: "Formësim i shpejtë dhe i pastër i vetullave me dyll. Finish i butë, linja të mprehta.", duration: "10 min" },
        { name: "Dyll për Hundë & Vesh", price: "200 den", desc: "Heqje higjienike e qimeve të padëshiruara nga hunda dhe veshët me dyll të ngrohtë.", duration: "15 min" },
        { name: "Zbardhim & Ngjyrosje Flokësh", price: "1200 den", desc: "Proces i plotë zbardhimi i ndjekur nga ngjyra e zgjedhur prej jush. Trajtuar me ekspertizë nga fillimi deri në fund.", duration: "2+ orë" },
        { name: "Ngjyrosje Flokësh e Zezë", price: "200 den", desc: "Rikthen ngjyrën e zezë të thellë dhe të pasur flokëve tuaj. Aplikim i njëtrajtshëm, rezultate afatgjata.", duration: "45 min" },
        { name: "Ngjyrosje Mjekre e Zezë", price: "200 den", desc: "Ngjyrë e zezë e thellë e aplikuar në mënyrë të njëtrajtshme në mjekër. Duket e freskët, qëndron e mprehtë.", duration: "30 min" },
        { name: "Flokë & Mjekër të Zeza", price: "400 den", desc: "Ngjyrosje e kombinuar e flokëve dhe mjekrës në të zezë. Look i plotë dhe i unifikuar në një seancë.", duration: "60 min" },
        { name: "Maskë & Trajtim me Avull", price: "300 den", desc: "Maskë kondicionimi i thellë aplikuar nën avull për thithje dhe butësi maksimale.", duration: "30 min" },
      ],
    },
    craftsmen: {
      eyebrow: "Ekipi",
      titlePlain: "",
      titleItalic: "Mjeshtrit.",
      role: "Berber Kryesor & Themelues",
      bio: "Me mbi 5 vjet përvojë, Dardani e ndërtoi këtë dyqan nga e para mbi një parim të vetëm — çdo klient meriton më të mirën.",
    },
    gallery: {
      eyebrow: "Puna Jonë",
      titlePlain: "",
      titleItalic: "Galeria.",
      viewAll: "Shiko Galerinë e Plotë →",
      loading: "Duke u ngarkuar…",
      empty: "Ende pa foto — kthehu së shpejti.",
      fullTitlePlain: "Galeria e",
      fullTitleItalic: "Plotë",
      uploadPhoto: "Ngarko Foto",
      uploading: "Duke ngarkuar…",
      captionPlaceholder: "Përshkrim (opsionale)",
      chooseFirst: "Zgjidh një foto së pari.",
      confirmRemovePhoto: "Ta heqim këtë foto nga galeria?",
    },
    footer: {
      tagline:
        "Mjeshtëri precize e rrënjosur në traditë. Çdo prerje tregon një histori prej pothuajse dy dekadash mjeshtërie.",
      location: "Vendndodhja",
      address1: "20m pranë Spitalit të Përgjithshëm",
      address2: "Dibër, Maqedoni",
      availability: "Orari",
      monFri: "Hën — Pre",
      saturday: "Shtunë",
      sunday: "Diel",
      closed: "Mbyllur",
      copyright: "Të gjitha të drejtat e rezervuara.",
      privacy: "Politika e Privatësisë",
      terms: "Kushtet e Shërbimit",
      craftedBy: "Krijuar nga Apexium Dev",
    },
    auth: {
      welcomeBack: "Mirësevini Përsëri",
      signInTitle1: "Kyçu",
      signInTitle2: "",
      joinClub: "Bashkohu me Klubin",
      createTitle1: "Krijo",
      createTitle2: "Llogari",
      noWorries: "Asnjë Shqetësim",
      resetTitle1: "Rivendos",
      resetTitle2: "Fjalëkalimin",
      email: "Email",
      password: "Fjalëkalimi",
      confirmPassword: "Konfirmo Fjalëkalimin",
      firstName: "Emri",
      lastName: "Mbiemri",
      phone: "Telefoni",
      forgotPassword: "Harruat fjalëkalimin?",
      signIn: "Kyçu",
      signingIn: "Duke u kyçur…",
      dontHaveAccount: "Nuk keni llogari?",
      createOne: "Krijoni një",
      createAccount: "Krijo Llogari",
      creatingAccount: "Duke krijuar llogarinë…",
      alreadyHaveAccount: "Keni tashmë një llogari?",
      signInLink: "Kyçu",
      resetHint:
        "Shkruani adresën e email-it të lidhur me llogarinë tuaj dhe ne do t'ju dërgojmë një lidhje rivendosjeje.",
      sendResetLink: "Dërgo Lidhjen e Rivendosjes",
      sending: "Duke dërguar…",
      backToSignIn: "Kthehu te Kyçja",
      termsPrefix: "Duke krijuar një llogari, ju pranoni",
      termsLink: "Kushtet e Shërbimit",
      and: "dhe",
      privacyLink: "Politikën e Privatësisë",
      fillAllFields: "Ju lutemi plotësoni të gjitha fushat.",
      passwordsNoMatch: "Fjalëkalimet nuk përputhen.",
      passwordTooShort: "Fjalëkalimi duhet të ketë të paktën 6 karaktere.",
      accountCreated: "Llogaria u krijua! Kontrolloni email-in për të konfirmuar adresën.",
      enterEmail: "Ju lutemi shkruani adresën tuaj të email-it.",
      resetSent: "Lidhja e rivendosjes u dërgua! Kontrolloni inbox-in.",
    },
    profile: {
      account: "Llogaria",
      myProfileTitle1: "Profili",
      myProfileTitle2: "Im",
      editProfile: "Ndrysho Profilin",
      firstName: "Emri",
      lastName: "Mbiemri",
      email: "Email",
      readOnly: "vetëm-lexim",
      phone: "Telefoni",
      memberSince: "Anëtar Që Prej",
      cancel: "Anulo",
      saveChanges: "Ruaj Ndryshimet",
      saving: "Duke ruajtur…",
      profileUpdated: "Profili u përditësua.",
      member: "Anëtar",
      memberLabel: "Anëtar i Dardan Barbershop",
      barberLabel: "Dardan Barbershop — Berber",
      barberTools: "Mjetet e Berberit",
      scanMemberQr: "Skano QR-në e Anëtarit",
      scanHint: "Hap skanerin për të regjistruar një vizitë",
      yourCode: "Kodi Yt i Anëtarit",
      codeHint: "Trego këtë tek berberia",
      signOut: "Dilni",
      loyaltyLabel: "Besnikëria",
      loyaltyFreeSingular: "qethje falas gati",
      loyaltyFreePlural: "qethje falas gati",
      loyaltyMoreToEarn: "më shumë për të fituar një qethje falas",
    },
    barber: {
      barberPanel: "Paneli i Berberit",
      scanTitle1: "Skano",
      scanTitle2: "Anëtarin",
      qrScanner: "Skaneri QR",
      startCamera: "📷 Nis Kamerën",
      cancel: "Anulo",
      memberSince: "Anëtar që prej",
      notes: "Shënime (opsionale)",
      notesPlaceholder: "p.sh. skin fade, rregullim mjekre…",
      discard: "Hidhe",
      saveVisit: "✓ Ruaj Vizitën",
      saving: "Duke ruajtur…",
      visitSaved: "✓ Vizita u ruajt!",
      recentVisits: "Vizitat e Fundit",
      loading: "Duke u ngarkuar…",
      noVisits: "Ende pa vizita të regjistruara.",
      galleryManagement: "Menaxhimi i Galerisë",
      uploadPhoto: "Ngarko Foto",
      uploading: "Duke ngarkuar…",
      captionPlaceholder: "Përshkrim (opsionale)",
      noPhotos: "Ende pa foto të ngarkuara.",
      chooseFirst: "Zgjidh një foto së pari.",
      confirmRemovePhoto: "Ta heqim këtë foto nga galeria?",
      invalidQr: "Kod QR i pavlefshëm — nuk është kod anëtari i Dardan Barbershop.",
      memberNotFound: "Anëtari nuk u gjet. Mund t'i duhet të riregjistrohet.",
      loyaltyProgress: "Progresi i Besnikërisë",
      freeHaircutSingularAvailable: "qethje falas gati",
      freeHaircutPluralAvailable: "qethje falas gati",
      redeemFreeHaircut: "Përdor Qethjen Falas",
      freeBadge: "FALAS",
      redemptionSaved: "Qethja falas u përdor!",
    },
    legal: {
      backHome: "← Kthehu në ballinë",
      legalLabel: "Ligjore",
      lastUpdated: "Përditësuar për herë të fundit: Maj 2026",
      privacy: {
        title: "Politika e Privatësisë",
        intro:
          "Mirë se vini në Barbershop Dardan. Ne respektojmë privatësinë tuaj dhe angazhohemi të mbrojmë çdo informacion personal që ndani me ne përmes faqes sonë të internetit, rrjeteve sociale, ose formularëve të rezervimit/kontaktit.",
        infoCollectTitle: "Informacioni Që Mbledhim",
        infoCollectIntro: "Ne mund të mbledhim:",
        infoCollectItems: [
          "Emrin",
          "Numrin e telefonit",
          "Adresën e email-it",
          "Detajet e takimit",
          "Mesazhet që na dërgoni",
          "Informacion bazë mbi përdorimin e faqes (si p.sh. faqet e vizituara)",
        ],
        infoUseTitle: "Si e Përdorim Informacionin Tuaj",
        infoUseIntro: "E përdorim informacionin tuaj për të:",
        infoUseItems: [
          "Rezervuar dhe menaxhuar takime",
          "Ju kontaktuar lidhur me rezervimin tuaj",
          "Përmirësuar shërbimet dhe faqen tonë",
          "Ju përgjigjur pyetjeve ose kërkesave",
          "Dërguar përditësime ose promocione (vetëm nëse pajtoheni)",
        ],
        sharingTitle: "Ndarja e Informacionit",
        sharingBody:
          "Ne nuk shesim apo japim me qira informacionin tuaj personal. Të dhënat tuaja mund të ndahen vetëm me ofrues të besuar shërbimesh që na ndihmojnë të operojmë faqen ose sistemin e rezervimeve.",
        securityTitle: "Siguria e të Dhënave",
        securityBody:
          "Ne marrim masa të arsyeshme për të mbrojtur informacionin tuaj nga qasja e paautorizuar, humbja, ose keqpërdorimi.",
        cookiesTitle: "Cookies",
        cookiesBody:
          "Faqja jonë mund të përdorë cookies për të përmirësuar përvojën e përdoruesit dhe për të analizuar trafikun e faqes.",
        rightsTitle: "Të Drejtat Tuaja",
        rightsIntro: "Ju mund të kërkoni të:",
        rightsItems: [
          "Qaseni në të dhënat tuaja",
          "Korrigjoni informacionin tuaj",
          "Fshini informacionin tuaj",
          "Ndaloni marrjen e mesazheve promocionale",
        ],
        rightsOutro: "Për ta bërë këtë, na kontaktoni duke përdorur informacionin më poshtë.",
        contactTitle: "Kontakt",
      },
      terms: {
        title: "Kushtet e Shërbimit",
        intro:
          "Duke përdorur faqen e internetit ose shërbimet e rezervimit të Barbershop Dardan, ju pranoni kushtet e mëposhtme.",
        appointmentsTitle: "Takimet",
        appointmentsItems: [
          "Klientët inkurajohen të mbërrijnë në kohë.",
          "Ardhjet me vonesë mund të rezultojnë në takime të shkurtuara ose të anuluara.",
          "Takimet mund të anulohen ose riplanifikohen paraprakisht.",
        ],
        paymentsTitle: "Pagesat",
        paymentsItems: [
          "Çmimet e shërbimeve shfaqen në dyqan ose në faqen tonë të internetit/rrjete sociale.",
          "Pagesa bëhet pasi shërbimet të jenë përfunduar.",
        ],
        conductTitle: "Sjellja",
        conductBody:
          "Ne rezervojmë të drejtën të refuzojmë shërbimin ndaj kujtdo që shfaq sjellje të papërshtatshme, abuzive, ose të pasigurt.",
        usageTitle: "Përdorimi i Faqes",
        usageBody:
          "Ju pranoni të mos e keqpërdorni faqen, të mos përpiqeni për qasje të paautorizuar, ose të mos ndërprisni funksionimin e saj.",
        contentTitle: "Përmbajtja",
        contentBody:
          "I gjithë përmbajtja e faqes, përfshirë logot, fotot dhe dizajnet, i përket Barbershop Dardan përveç rasteve kur specifikohet ndryshe.",
        liabilityTitle: "Kufizimi i Përgjegjësisë",
        liabilityIntro:
          "Ne synojmë të ofrojmë informacion të saktë dhe shërbime cilësore, por nuk jemi përgjegjës për:",
        liabilityItems: [
          "Ndërprerje të përkohshme të faqes",
          "Ndërprerje të shërbimeve nga palë të treta",
          "Dëme indirekte që rrjedhin nga përdorimi i faqes",
        ],
        changesTitle: "Ndryshime në Kushte",
        changesBody:
          "Ne mund t'i përditësojmë këto Kushte Shërbimi në çdo kohë. Përdorimi i vazhdueshëm i faqes nënkupton pranimin e kushteve të përditësuara.",
        contactTitle: "Kontakt",
      },
    },
  },

  mk: {
    nav: {
      catalogue: "Каталог",
      craftsmen: "Мајстори",
      gallery: "Галерија",
      location: "Локација",
      bossMode: "Режим на сопственик",
      login: "Најава",
      myProfile: "Мојот профил",
      bookNow: "Резервирај",
    },
    stats: {
      yearsOfMastery: "Години\nМајсторство",
      satisfiedClients: "Задоволни\nКлиенти",
      googleRating: "Google\nОцена",
      precisionEveryTime: "Прецизност\nСекогаш",
    },
    hero: {
      established: "Основано 2007",
      heroTitle: "Прецизност во",
      heroSubtitle: "секој детаљ.",
      bookNow: "Резервирај",
      memberPortal: "Портал за членови",
      quotePrefix: "„Прецизност во",
      quoteHighlight: "секое движење.“",
    },
    catalogue: {
      eyebrow: "Каталог",
      headingPlain: "",
      headingItalic: "Каталогот.",
      description:
        "Избрана селекција на совршенство во нега. Секоја сесија е искуство прилагодено на вашата структура и стил.",
      qualityLabel: "Гаранција за квалитет",
      footerNote: "Консултацијата е бесплатна со секоја услуга.",
      services: [
        { name: "Шишање", price: "250 ден", desc: "Чисто и прецизно шишање, прилагодено на формата на главата и вашиот стил. Без компромис.", duration: "30 мин" },
        { name: "Тримување брада", price: "150 ден", desc: "Јасни контури, рамномерна должина, обликувана форма. Негувано, но природно.", duration: "20 мин" },
        { name: "Миење коса", price: "100 ден", desc: "Темелно чистење на скалпот со квалитетни производи. Чиста основа за секое шишање.", duration: "10 мин" },
        { name: "Веѓи — со конец", price: "200 ден", desc: "Прецизно обликување на веѓите со традиционална техника со конец, за чисти контури.", duration: "15 мин" },
        { name: "Веѓи — со восок", price: "150 ден", desc: "Брзо и чисто обликување на веѓите со восок. Мазен финиш, остри линии.", duration: "10 мин" },
        { name: "Восок за нос и уши", price: "200 ден", desc: "Хигиенско отстранување на несакани влакна од носот и ушите со топол восок.", duration: "15 мин" },
        { name: "Разбојување и боење коса", price: "1200 ден", desc: "Целосен процес на разбојување проследен со избраната боја. Изведено професионално од почеток до крај.", duration: "2+ часа" },
        { name: "Црно боење коса", price: "200 ден", desc: "Ја враќа богатата, длабока црна боја на косата. Рамномерна апликација, трајни резултати.", duration: "45 мин" },
        { name: "Црно боење брада", price: "200 ден", desc: "Длабока црна боја рамномерно нанесена на брадата. Изгледа свежо, останува остро.", duration: "30 мин" },
        { name: "Црна коса и брада", price: "400 ден", desc: "Комбинирано боење на коса и брада во црно. Целосен, унифициран изглед во една сесија.", duration: "60 мин" },
        { name: "Маска и третман со пареа", price: "300 ден", desc: "Длабока хидратантна маска нанесена под пареа за максимална апсорпција и мекост.", duration: "30 мин" },
      ],
    },
    craftsmen: {
      eyebrow: "Тимот",
      titlePlain: "",
      titleItalic: "Мајсторите.",
      role: "Главен бербер и основач",
      bio: "Со над 5 години искуство, Дардан ја изгради оваа берберница од темел на еден единствен принцип — секој клиент заслужува само најдоброто.",
    },
    gallery: {
      eyebrow: "Нашата работа",
      titlePlain: "",
      titleItalic: "Галеријата.",
      viewAll: "Погледни ја целата галерија →",
      loading: "Се вчитува…",
      empty: "Сè уште нема фотографии — проверете наскоро.",
      fullTitlePlain: "Целосна",
      fullTitleItalic: "Галерија",
      uploadPhoto: "Прикачи фотографија",
      uploading: "Се прикачува…",
      captionPlaceholder: "Опис (опционално)",
      chooseFirst: "Прво изберете фотографија.",
      confirmRemovePhoto: "Да ја отстраниме оваа фотографија од галеријата?",
    },
    footer: {
      tagline:
        "Прецизна изработка вкоренета во традицијата. Секое шишање раскажува приказна од речиси две децении мајсторство.",
      location: "Локација",
      address1: "20м до Општата болница",
      address2: "Дебар, Македонија",
      availability: "Работно време",
      monFri: "Пон — Пет",
      saturday: "Сабота",
      sunday: "Недела",
      closed: "Затворено",
      copyright: "Сите права се задржани.",
      privacy: "Политика за приватност",
      terms: "Услови за користење",
      craftedBy: "Изработено од Apexium Dev",
    },
    auth: {
      welcomeBack: "Добредојде повторно",
      signInTitle1: "Најава",
      signInTitle2: "",
      joinClub: "Придружи се",
      createTitle1: "Отвори",
      createTitle2: "профил",
      noWorries: "Без грижи",
      resetTitle1: "Ресетирај",
      resetTitle2: "лозинка",
      email: "Е-пошта",
      password: "Лозинка",
      confirmPassword: "Потврди лозинка",
      firstName: "Име",
      lastName: "Презиме",
      phone: "Телефон",
      forgotPassword: "Ја заборавивте лозинката?",
      signIn: "Најави се",
      signingIn: "Се најавува…",
      dontHaveAccount: "Немате профил?",
      createOne: "Отворете еден",
      createAccount: "Отвори профил",
      creatingAccount: "Се отвора профилот…",
      alreadyHaveAccount: "Веќе имате профил?",
      signInLink: "Најави се",
      resetHint:
        "Внесете ја е-поштата поврзана со вашиот профил и ќе ви испратиме линк за ресетирање.",
      sendResetLink: "Испрати линк за ресетирање",
      sending: "Се испраќа…",
      backToSignIn: "Назад кон најава",
      termsPrefix: "Со отворање профил, се согласувате со нашите",
      termsLink: "Услови за користење",
      and: "и",
      privacyLink: "Политика за приватност",
      fillAllFields: "Ве молиме пополнете ги сите полиња.",
      passwordsNoMatch: "Лозинките не се совпаѓаат.",
      passwordTooShort: "Лозинката мора да има најмалку 6 карактери.",
      accountCreated: "Профилот е отворен! Проверете ја е-поштата за да ја потврдите адресата.",
      enterEmail: "Ве молиме внесете ја вашата е-пошта.",
      resetSent: "Линкот за ресетирање е испратен! Проверете го сандачето.",
    },
    profile: {
      account: "Профил",
      myProfileTitle1: "Мојот",
      myProfileTitle2: "профил",
      editProfile: "Уреди профил",
      firstName: "Име",
      lastName: "Презиме",
      email: "Е-пошта",
      readOnly: "само за читање",
      phone: "Телефон",
      memberSince: "Член од",
      cancel: "Откажи",
      saveChanges: "Зачувај промени",
      saving: "Се зачувува…",
      profileUpdated: "Профилот е ажуриран.",
      member: "Член",
      memberLabel: "Член на Dardan Barbershop",
      barberLabel: "Dardan Barbershop — Бербер",
      barberTools: "Алатки за бербер",
      scanMemberQr: "Скенирај QR на член",
      scanHint: "Отворете го скенерот за да запишете посета",
      yourCode: "Вашиот код за член",
      codeHint: "Покажете го ова во берберницата",
      signOut: "Одјава",
      loyaltyLabel: "Лојалност",
      loyaltyFreeSingular: "бесплатно шишање подготвено",
      loyaltyFreePlural: "бесплатни шишања подготвени",
      loyaltyMoreToEarn: "повеќе за да заработите бесплатно шишање",
    },
    barber: {
      barberPanel: "Панел за бербер",
      scanTitle1: "Скенирај",
      scanTitle2: "член",
      qrScanner: "QR скенер",
      startCamera: "📷 Вклучи камера",
      cancel: "Откажи",
      memberSince: "Член од",
      notes: "Забелешки (опционално)",
      notesPlaceholder: "пр. skin fade, тримување брада…",
      discard: "Отфрли",
      saveVisit: "✓ Зачувај посета",
      saving: "Се зачувува…",
      visitSaved: "✓ Посетата е зачувана!",
      recentVisits: "Последни посети",
      loading: "Се вчитува…",
      noVisits: "Сè уште нема запишани посети.",
      galleryManagement: "Управување со галерија",
      uploadPhoto: "Прикачи фотографија",
      uploading: "Се прикачува…",
      captionPlaceholder: "Опис (опционално)",
      noPhotos: "Сè уште нема прикачени фотографии.",
      chooseFirst: "Прво изберете фотографија.",
      confirmRemovePhoto: "Да ја отстраниме оваа фотографија од галеријата?",
      invalidQr: "Неважечки QR код — не е код за член на Dardan Barbershop.",
      memberNotFound: "Членот не е пронајден. Можеби треба повторно да се регистрира.",
      loyaltyProgress: "Прогрес на лојалност",
      freeHaircutSingularAvailable: "бесплатно шишање достапно",
      freeHaircutPluralAvailable: "бесплатни шишања достапни",
      redeemFreeHaircut: "Искористи бесплатно шишање",
      freeBadge: "БЕСПЛАТНО",
      redemptionSaved: "Бесплатното шишање е искористено!",
    },
    legal: {
      backHome: "← Назад кон почетна",
      legalLabel: "Правно",
      lastUpdated: "Последно ажурирано: мај 2026",
      privacy: {
        title: "Политика за приватност",
        intro:
          "Добредојдовте во Barbershop Dardan. Ја почитуваме вашата приватност и се обврзуваме да ги заштитиме личните податоци што ги споделувате со нас преку нашата веб-страница, социјалните мрежи, или формуларите за резервација/контакт.",
        infoCollectTitle: "Информации што ги собираме",
        infoCollectIntro: "Може да собираме:",
        infoCollectItems: [
          "Име",
          "Телефонски број",
          "Е-пошта",
          "Детали за термин",
          "Пораки што ни ги испраќате",
          "Основни информации за користење на страницата (на пр. посетени страници)",
        ],
        infoUseTitle: "Како ги користиме вашите информации",
        infoUseIntro: "Вашите информации ги користиме за да:",
        infoUseItems: [
          "Резервираме и управуваме со термини",
          "Ве контактираме во врска со вашата резервација",
          "Ги подобруваме нашите услуги и страницата",
          "Одговараме на прашања или барања",
          "Испраќаме новости или промоции (само ако се согласите)",
        ],
        sharingTitle: "Споделување информации",
        sharingBody:
          "Не ги продаваме и не ги издаваме под закуп вашите лични податоци. Вашите податоци може да се споделат единствено со доверливи давателите на услуги што ни помагаат да ја водиме страницата или системот за резервации.",
        securityTitle: "Безбедност на податоците",
        securityBody:
          "Преземаме разумни мерки за да ги заштитиме вашите информации од неовластен пристап, губење, или злоупотреба.",
        cookiesTitle: "Колачиња (Cookies)",
        cookiesBody:
          "Нашата страница може да користи колачиња за подобрување на корисничкото искуство и анализа на сообраќајот на страницата.",
        rightsTitle: "Вашите права",
        rightsIntro: "Може да побарате да:",
        rightsItems: [
          "Пристапите до вашите податоци",
          "Ги коригирате вашите информации",
          "Ги избришете вашите информации",
          "Престанете да добивате промотивни пораки",
        ],
        rightsOutro: "За да го направите ова, контактирајте нè користејќи ги информациите подолу.",
        contactTitle: "Контакт",
      },
      terms: {
        title: "Услови за користење",
        intro:
          "Со користење на страницата или услугите за резервација на Barbershop Dardan, се согласувате со следните услови.",
        appointmentsTitle: "Термини",
        appointmentsItems: [
          "Клиентите се охрабруваат да пристигнат навреме.",
          "Доцнењето може да резултира со скратен или откажан термин.",
          "Термините може однапред да се откажат или презакажат.",
        ],
        paymentsTitle: "Плаќања",
        paymentsItems: [
          "Цените на услугите се прикажани во салонот или на нашата страница/социјални мрежи.",
          "Плаќањето се врши по завршување на услугата.",
        ],
        conductTitle: "Однесување",
        conductBody:
          "Го задржуваме правото да одбиеме услуга на секој што покажува несоодветно, навредливо, или небезбедно однесување.",
        usageTitle: "Користење на страницата",
        usageBody:
          "Се согласувате да не ја злоупотребувате страницата, да не се обидувате за неовластен пристап, или да го нарушувате нејзиното функционирање.",
        contentTitle: "Содржина",
        contentBody:
          "Целата содржина на страницата, вклучувајќи логоа, фотографии и дизајни, припаѓа на Barbershop Dardan освен ако не е поинаку наведено.",
        liabilityTitle: "Ограничување на одговорност",
        liabilityIntro:
          "Се стремиме да обезбедиме точни информации и квалитетни услуги, но не сноситме одговорност за:",
        liabilityItems: [
          "Привремена недостапност на страницата",
          "Прекини во услугите на трети страни",
          "Индиректни штети произлезени од користењето на страницата",
        ],
        changesTitle: "Промени во условите",
        changesBody:
          "Овие Услови за користење може да ги ажурираме во секое време. Продолженото користење на страницата значи дека ги прифаќате ажурираните услови.",
        contactTitle: "Контакт",
      },
    },
  },
};
