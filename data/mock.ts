export const settings = {
  heroTitle: {
    fr: "Victoria Reindale",
    en: "Victoria Reindale",
  },
  heroSubtitle: {
    fr: "Soprano · Artiste Vocale",
    en: "Soprano · Vocal Artist",
  },
  heroImage: "/images/victoria-main.png",
  bioPhoto: "/images/victoria-gallery-2.png",
  biographyFr: "Victoria Reindale est une soprano professionnelle dont la voix lyrique légère enchante cérémonies, concerts privés et événements d'exception. Formée au conservatoire, elle propose des formations allant du solo soprano jusqu'à l'ensemble vocal SATB, s'adaptant à chaque occasion avec raffinement.",
  biographyEn: "Victoria Reindale is a professional soprano whose light lyric voice enchants ceremonies, private concerts, and exceptional events. Trained at the conservatory, she offers formations ranging from solo soprano to SATB vocal ensemble, adapting to each occasion with refinement.",
  email: "victoria@victoriareindalesoprano.com",
  phone: "+33 6 12 34 56 78",
  socialInstagram: "https://instagram.com/victoria_soprano_leggero",
  socialYoutube: "https://youtube.com",
  socialFacebook: "https://facebook.com",
};

export const events = [
  {
    _id: "e1",
    title: { fr: "Récital lyrique", en: "Lyric Recital" },
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(),
    venue: { name: "Église Saint-Sulpice", city: "Paris", country: "France" },
    description: {
      fr: "Un récital lyrique autour des plus beaux airs d'opéra français.",
      en: "A lyric recital featuring the most beautiful French opera arias.",
    },
    image: "/images/victoria-gallery-1.png",
    isPrivate: false,
    ticketUrl: "#",
  },
  {
    _id: "e2",
    title: { fr: "Concert de Noël", en: "Christmas Concert" },
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    venue: { name: "Cathédrale Notre-Dame", city: "Strasbourg", country: "France" },
    description: { fr: "Chants traditionnels de Noël", en: "Traditional Christmas carols" },
    isPrivate: false,
  },
  {
    _id: "e3",
    title: { fr: "Mariage privé", en: "Private Wedding" },
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    venue: { city: "Lyon" },
    isPrivate: true,
  }
];

export const services = [
  {
    _id: "s1",
    title: { fr: "Solo soprano", en: "Soprano solo" },
    description: {
      fr: "Prestation vocale solo, idéale pour cérémonies intimes et événements élégants.",
      en: "Solo vocal performance, ideal for intimate ceremonies and elegant events.",
    },
    occasions: {
      fr: ["Mariages", "Funérailles", "Concerts privés"],
      en: ["Weddings", "Funerals", "Private concerts"],
    },
    duration: { fr: "1 heure", en: "1 hour" },
    priceFrom: 350,
    depositAmount: 100,
  },
  {
    _id: "s2",
    title: { fr: "Duo voix – piano", en: "Voice & piano duo" },
    description: {
      fr: "Harmonie raffinée entre voix et piano pour une atmosphère musicale complète.",
      en: "Refined harmony between voice and piano for a complete musical atmosphere.",
    },
    occasions: {
      fr: ["Cocktails", "Réceptions", "Concerts"],
      en: ["Cocktails", "Receptions", "Concerts"],
    },
    duration: { fr: "1.5 heures", en: "1.5 hours" },
    priceFrom: 600,
    depositAmount: 150,
  },
  {
    _id: "s3",
    title: { fr: "Ensemble vocal (SATB)", en: "Vocal ensemble (SATB)" },
    description: {
      fr: "Formation chorale complète pour vos événements les plus solennels.",
      en: "Full choral formation for your most solemn events.",
    },
    occasions: {
      fr: ["Grandes cérémonies", "Festivals"],
      en: ["Grand ceremonies", "Festivals"],
    },
    duration: { fr: "2 heures", en: "2 hours" },
    priceFrom: 1200,
    depositAmount: 300,
  }
];

export const testimonials = [
  {
    _id: "t1",
    quote: {
      fr: "Une voix magnifique qui a rendu notre cérémonie de mariage inoubliable.",
      en: "A beautiful voice that made our wedding ceremony unforgettable.",
    },
    author: "Marie & Thomas",
    occasion: { fr: "Mariage à Paris", en: "Wedding in Paris" },
  },
  {
    _id: "t2",
    quote: {
      fr: "Émouvant, professionnel et d'une justesse parfaite. Merci Victoria.",
      en: "Moving, professional, and perfectly pitched. Thank you, Victoria.",
    },
    author: "Famille Dubois",
    occasion: { fr: "Cérémonie privée", en: "Private ceremony" },
  }
];

export const videos = [
  {
    _id: "v1",
    title: { fr: "Ave Maria - Schubert", en: "Ave Maria - Schubert" },
    description: { fr: "Enregistrement studio, 2023", en: "Studio recording, 2023" },
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    _id: "v2",
    title: { fr: "O Mio Babbino Caro - Puccini", en: "O Mio Babbino Caro - Puccini" },
    description: { fr: "Concert en direct", en: "Live concert" },
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  }
];

export const galleryItems = [
  {
    id: "g1",
    src: "/images/victoria-main.png",
    thumb: "/images/victoria-main.png",
    alt: { fr: "Victoria Reindale", en: "Victoria Reindale" },
    caption: { fr: "", en: "" },
    category: "portrait",
  },
  {
    id: "g2",
    src: "/images/victoria-gallery-1.png",
    thumb: "/images/victoria-gallery-1.png",
    alt: { fr: "Victoria Reindale au concert", en: "Victoria Reindale at concert" },
    caption: { fr: "Concert 2023", en: "Concert 2023" },
    category: "portrait",
  },
  {
    id: "g3",
    src: "/images/victoria-gallery-2.png",
    thumb: "/images/victoria-gallery-2.png",
    alt: { fr: "Au piano", en: "At the piano" },
    caption: { fr: "Répétition", en: "Rehearsal" },
    category: "backstage",
  },
  {
    id: "g4",
    src: "/images/victoria-gallery-3.png",
    thumb: "/images/victoria-gallery-3.png",
    alt: { fr: "En studio", en: "In studio" },
    caption: { fr: "Enregistrement", en: "Recording" },
    category: "backstage",
  }
];
