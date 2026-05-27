# Victoria Reindale — Site Web Premium

Soprano · Artiste Vocale · [victoriareindalesoprano.com](https://victoriareindalesoprano.com)

Built with **Next.js 14**, **Sanity.io** CMS, **Stripe** payments, **Resend** email, deployed on **Vercel**.

---

## Stack

| Layer     | Tech                  | Free tier |
|-----------|-----------------------|-----------|
| Frontend  | Next.js 14 App Router | ✅        |
| CMS       | Sanity.io v3          | ✅ (up to 3 editors) |
| Payments  | Stripe                | 2.9% + 0.30€ per transaction |
| Email     | Resend                | ✅ 3 000 emails/month |
| Hosting   | Vercel                | ✅ Hobby plan |
| Domain    | Any registrar         | ~12€/year |

---

## Quick Start

### 1. Install dependencies

```bash
cd victoria-app
npm install
```

### 2. Set up Sanity

1. Go to [sanity.io](https://www.sanity.io) → Create a free account
2. Create a new project: **New project** → name it `victoria-soprano`
3. Copy the **Project ID** from the project dashboard
4. Go to **API → Tokens** → Add a new token with **Viewer** permissions → copy it

### 3. Set up Stripe

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Copy your **Publishable key** and **Secret key** (use Test mode first)
3. For webhooks: install [Stripe CLI](https://stripe.com/docs/stripe-cli) and run `stripe listen`

### 4. Set up Resend

1. Go to [resend.com](https://resend.com) → Create account
2. Create an API key
3. Verify your sending domain (or use their free `onboarding@resend.dev` for testing)

### 5. Configure environment variables

```bash
cp .env.example .env.local
# Fill in all values in .env.local
```

### 6. Run locally

```bash
npm run dev
# → http://localhost:3000       (public site)
# → http://localhost:3000/studio (Sanity CMS)
```

---

## CMS — What Victoria Can Edit

Visit `/studio` (or `yourdomain.com/studio`) and log in with your Sanity account.

| Section | What she can do |
|---------|----------------|
| **Paramètres du site** | Change hero photo, hero text, bio, social links, phone, email |
| **Événements** | Add/edit/delete upcoming concerts & events |
| **Services & Formules** | Update service descriptions, prices, deposit amounts |
| **Galerie photos** | Upload/reorder/delete gallery photos by drag & drop |
| **Vidéos** | Paste YouTube URLs to embed videos |
| **Témoignages** | Add client testimonials |

---

## Deployment (Vercel)

### Option A — Via Vercel CLI

```bash
npm install -g vercel
vercel --prod
```

### Option B — Via GitHub (recommended)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project → Select your repo
3. Add all environment variables from `.env.example` in Vercel → Settings → Environment Variables
4. Deploy!

### CORS for Sanity

Add your Vercel domain to Sanity's allowed origins:
1. Go to [sanity.io/manage](https://www.sanity.io/manage) → your project
2. **API → CORS origins** → Add `https://yourdomain.com` and `https://yourdomain.com/studio`

---

## Domain Setup

1. Buy `victoriareindalesoprano.com` (or `.fr`) at OVH, Gandi, or Namecheap
2. In Vercel → Domains → Add your domain
3. Point your domain's nameservers to Vercel (or add the A/CNAME records Vercel provides)

---

## Project Structure

```
victoria-app/
├── app/
│   ├── [locale]/          # Localized pages (FR = default, EN = /en/*)
│   │   ├── page.tsx       # Home
│   │   ├── about/
│   │   ├── services/
│   │   ├── gallery/
│   │   ├── events/
│   │   └── contact/
│   ├── api/
│   │   ├── contact/       # Contact form → Resend email
│   │   └── create-checkout/ # Stripe deposit checkout
│   └── studio/            # Embedded Sanity Studio
├── components/
│   ├── layout/            # Header, Footer
│   ├── sections/          # ContactForm, GalleryGrid
│   └── ui/                # YoutubeEmbed, BookingButton, LanguageSwitcher
├── sanity/
│   ├── schemaTypes/       # CMS content types
│   ├── client.ts          # Sanity client + image URL builder
│   └── queries.ts         # GROQ queries
├── messages/
│   ├── fr.json            # French translations
│   └── en.json            # English translations
├── i18n/request.ts        # next-intl config
└── middleware.ts           # Locale routing
```

---

## Adding a @portabletext/react dependency

The About page uses `@portabletext/react` for rich text from Sanity. Add it:

```bash
npm install @portabletext/react
```

---

## License

Built with ♥ for Victoria Reindale by Luis.
