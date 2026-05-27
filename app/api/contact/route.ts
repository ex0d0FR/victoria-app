import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { name, email, phone, eventType, eventDate, message, locale } = await request.json();

  if (!name || !email || !eventType || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const subject = locale === "fr"
    ? `Nouvelle demande de ${name} — ${eventType}`
    : `New enquiry from ${name} — ${eventType}`;

  const dateStr = eventDate
    ? new Date(eventDate).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", {
        day: "numeric", month: "long", year: "numeric",
      })
    : locale === "fr" ? "Non précisée" : "Not specified";

  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1C1C1E;">
      <h2 style="font-size: 24px; font-weight: normal; border-bottom: 1px solid #EAE3D6; padding-bottom: 12px;">
        ${locale === "fr" ? "Nouvelle demande de prestation" : "New performance enquiry"}
      </h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr><td style="padding: 8px 0; color: #6C6C70; font-size: 13px; width: 140px;">${locale === "fr" ? "Nom" : "Name"}</td>
            <td style="padding: 8px 0; font-size: 14px;">${name}</td></tr>
        <tr><td style="padding: 8px 0; color: #6C6C70; font-size: 13px;">Email</td>
            <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${email}">${email}</a></td></tr>
        ${phone ? `<tr><td style="padding: 8px 0; color: #6C6C70; font-size: 13px;">${locale === "fr" ? "Téléphone" : "Phone"}</td>
                       <td style="padding: 8px 0; font-size: 14px;">${phone}</td></tr>` : ""}
        <tr><td style="padding: 8px 0; color: #6C6C70; font-size: 13px;">${locale === "fr" ? "Type d'événement" : "Event type"}</td>
            <td style="padding: 8px 0; font-size: 14px;">${eventType}</td></tr>
        <tr><td style="padding: 8px 0; color: #6C6C70; font-size: 13px;">${locale === "fr" ? "Date souhaitée" : "Preferred date"}</td>
            <td style="padding: 8px 0; font-size: 14px;">${dateStr}</td></tr>
      </table>
      <div style="margin-top: 24px; padding: 16px; background: #FAF8F3; border-left: 3px solid #C4A882;">
        <p style="margin: 0; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${message}</p>
      </div>
      <p style="margin-top: 24px; font-size: 12px; color: #AEAEB2;">
        ${locale === "fr" ? "Envoyé depuis le site victoriareindalesoprano.com" : "Sent from victoriareindalesoprano.com"}
      </p>
    </div>
  `;

  try {
    await resend.emails.send({
      from:    "Victoria Reindale Site <noreply@victoriareindalesoprano.com>",
      to:      process.env.CONTACT_EMAIL ?? "victoria@example.com",
      replyTo: email,
      subject,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }
}
