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
  email: "contact@victoriareindale.com",
  phone: "+41 77 814 56 18",
  socialInstagram: "https://instagram.com/victoria_soprano_leggero",
  socialYoutube: "https://www.youtube.com/@VictoriaReindaleSoprano",
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
    title: { 
      fr: 'Gaetano Donizetti — Lucia di Lammermoor : "Ardon gli incensi"', 
      en: 'Gaetano Donizetti — Lucia di Lammermoor: "Ardon gli incensi"' 
    },
    description: { 
      fr: "Victoria Vichkutkina, soprano, accompagnée au piano par Simon Peguiron.", 
      en: "Victoria Vichkutkina, soprano, accompanied on piano by Simon Peguiron." 
    },
    youtubeUrl: "https://youtu.be/JV73Mt2xk8A",
  },
  {
    _id: "v2",
    title: { 
      fr: 'Ambroise Thomas — Mignon : "Je suis Titania la blonde"', 
      en: 'Ambroise Thomas — Mignon: "Je suis Titania la blonde"' 
    },
    description: { 
      fr: "Prestation lyrique en direct. Victoria Vichkutkina, soprano.", 
      en: "Live lyric performance. Victoria Vichkutkina, soprano." 
    },
    youtubeUrl: "https://youtu.be/eJMdzqiQIrI",
  },
  {
    _id: "v3",
    title: { 
      fr: 'Gioachino Rossini — Le Comte Ory : "Céleste Providence"', 
      en: 'Gioachino Rossini — Le Comte Ory: "Céleste Providence"' 
    },
    description: { 
      fr: "Duo lyrique. Victoria Vichkutkina, soprano, avec Vitor Zendron da Cunha au piano.", 
      en: "Lyric duo. Victoria Vichkutkina, soprano, with Vitor Zendron da Cunha on piano." 
    },
    youtubeUrl: "https://youtu.be/Qb9vRK92u2U",
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
  },
  {
    id: "g5",
    src: "/images/comp-portrait-3.jpg",
    thumb: "/images/comp-portrait-3.jpg",
    alt: { fr: "Portrait de Victoria", en: "Portrait of Victoria" },
    caption: { fr: "Séance photo", en: "Photo shoot" },
    category: "portrait",
  },
  {
    id: "g6",
    src: "/images/image00072.jpeg",
    thumb: "/images/image00072.jpeg",
    alt: { fr: "Performance lyrique de Victoria Reindale", en: "Victoria Reindale lyric performance" },
    caption: { fr: "Performance", en: "Performance" },
    category: "concert",
  },
  {
    id: "g7",
    src: "/images/img-1002.jpg",
    thumb: "/images/img-1002.jpg",
    alt: { fr: "Victoria Reindale", en: "Victoria Reindale" },
    caption: { fr: "Performance", en: "Performance" },
    category: "concert",
  },
  {
    id: "g8",
    src: "/images/img-1006.jpg",
    thumb: "/images/img-1006.jpg",
    alt: { fr: "Victoria Reindale au micro", en: "Victoria Reindale at the microphone" },
    caption: { fr: "Enregistrement", en: "Recording" },
    category: "backstage",
  },
  {
    id: "g9",
    src: "/images/img-1152.jpg",
    thumb: "/images/img-1152.jpg",
    alt: { fr: "Concert de Victoria Reindale", en: "Victoria Reindale concert" },
    caption: { fr: "Concert", en: "Concert" },
    category: "concert",
  },
  {
    id: "g10",
    src: "/images/img-7405.jpg",
    thumb: "/images/img-7405.jpg",
    alt: { fr: "Victoria Reindale en concert", en: "Victoria Reindale in concert" },
    caption: { fr: "Concert", en: "Concert" },
    category: "concert",
  },
  {
    id: "g11",
    src: "/images/img-7626.jpg",
    thumb: "/images/img-7626.jpg",
    alt: { fr: "Victoria Reindale en coulisses", en: "Victoria Reindale backstage" },
    caption: { fr: "Coulisses", en: "Backstage" },
    category: "backstage",
  },
  {
    id: "g12",
    src: "/images/img-7632.jpg",
    thumb: "/images/img-7632.jpg",
    alt: { fr: "Répétition de Victoria Reindale", en: "Victoria Reindale rehearsal" },
    caption: { fr: "Répétition", en: "Rehearsal" },
    category: "backstage",
  },
  {
    id: "g13",
    src: "/images/img-7638.jpg",
    thumb: "/images/img-7638.jpg",
    alt: { fr: "Victoria Reindale en coulisses", en: "Victoria Reindale backstage" },
    caption: { fr: "Coulisses", en: "Backstage" },
    category: "backstage",
  },
  {
    id: "g14",
    src: "/images/img-7651.jpg",
    thumb: "/images/img-7651.jpg",
    alt: { fr: "Portrait de Victoria Reindale", en: "Portrait of Victoria Reindale" },
    caption: { fr: "Portrait", en: "Portrait" },
    category: "portrait",
  },
  {
    id: "g15",
    src: "/images/img-7653.jpg",
    thumb: "/images/img-7653.jpg",
    alt: { fr: "Portrait de Victoria Reindale", en: "Portrait of Victoria Reindale" },
    caption: { fr: "Portrait", en: "Portrait" },
    category: "portrait",
  },
  {
    id: "g16",
    src: "/images/img-7655.jpg",
    thumb: "/images/img-7655.jpg",
    alt: { fr: "Portrait de Victoria Reindale", en: "Portrait of Victoria Reindale" },
    caption: { fr: "Portrait", en: "Portrait" },
    category: "portrait",
  },
  {
    id: "g17",
    src: "/images/img-7656.jpg",
    thumb: "/images/img-7656.jpg",
    alt: { fr: "Portrait de Victoria Reindale", en: "Portrait of Victoria Reindale" },
    caption: { fr: "Portrait", en: "Portrait" },
    category: "portrait",
  },
  {
    id: "g18",
    src: "/images/photo-portrait-victoria.jpg",
    thumb: "/images/photo-portrait-victoria.jpg",
    alt: { fr: "Portrait de Victoria", en: "Portrait of Victoria" },
    caption: { fr: "Portrait", en: "Portrait" },
    category: "portrait",
  }
];
