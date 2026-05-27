import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-04-10" });

export async function POST(request: Request) {
  const { serviceId, serviceTitle, depositAmount, locale } = await request.json();

  if (!serviceTitle || !depositAmount || depositAmount < 1) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const localePrefix = locale === "en" ? "/en" : "";

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: Math.round(depositAmount * 100), // cents
            product_data: {
              name: locale === "fr"
                ? `Acompte de réservation — ${serviceTitle}`
                : `Booking deposit — ${serviceTitle}`,
              description: locale === "fr"
                ? "Cet acompte confirme votre réservation. Le solde sera réglé ultérieurement."
                : "This deposit confirms your booking. The balance will be settled separately.",
            },
          },
          quantity: 1,
        },
      ],
      metadata: { serviceId, serviceTitle, locale },
      success_url: `${baseUrl}${localePrefix}/contact?booking=success`,
      cancel_url:  `${baseUrl}${localePrefix}/services`,
      locale: locale === "fr" ? "fr" : "en",
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.error("Stripe error:", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
