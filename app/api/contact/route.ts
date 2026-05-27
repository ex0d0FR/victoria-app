// DEMO MODE — Resend is commented out. Contact form returns a simulated success.
// To re-enable: uncomment the Resend block and set RESEND_API_KEY in env.

// import { Resend } from "resend";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, email, eventType, message } = await request.json();

  if (!name || !email || !eventType || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // ── DEMO: log to console instead of sending email ─────────────────────────
  console.log("[DEMO] Contact form submission:", { name, email, eventType, message });

  // const resend = new Resend(process.env.RESEND_API_KEY ?? "placeholder");
  // await resend.emails.send({ ... });

  return NextResponse.json({ ok: true });
}
