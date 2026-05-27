// DEMO MODE — Stripe is commented out. Returns a simulated session ID.
// To re-enable: uncomment the Stripe block and set STRIPE_SECRET_KEY in env.

// import Stripe from "stripe";
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2023-10-16" });

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { serviceTitle, depositAmount, locale } = await request.json();

  if (!serviceTitle || !depositAmount || depositAmount < 1) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  // ── DEMO: simulate a successful checkout session ───────────────────────────
  console.log("[DEMO] Checkout requested:", { serviceTitle, depositAmount, locale });

  // const session = await stripe.checkout.sessions.create({ ... });
  // return NextResponse.json({ sessionId: session.id });

  return NextResponse.json({ sessionId: "demo_session" });
}
