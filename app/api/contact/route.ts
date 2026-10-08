import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface TurnstileVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, eventType, eventDate, message, turnstileToken } = body;

    // 1. Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Veuillez remplir tous les champs obligatoires (nom, email, message)." },
        { status: 400 }
      );
    }

    // 2. Cloudflare Turnstile verification (if secret key is configured)
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret) {
      if (!turnstileToken) {
        return NextResponse.json(
          { error: "Vérification anti-robot requise. Veuillez actualiser et réessayer." },
          { status: 400 }
        );
      }

      const verifyFormData = new FormData();
      verifyFormData.append("secret", turnstileSecret);
      verifyFormData.append("response", turnstileToken);
      const clientIp = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for");
      if (clientIp) {
        verifyFormData.append("remoteip", clientIp);
      }

      const verifyRes = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          body: verifyFormData,
        }
      );

      const verifyData: TurnstileVerifyResponse = await verifyRes.json();
      if (!verifyData.success) {
        console.warn("[Turnstile] Verification failed:", verifyData["error-codes"]);
        return NextResponse.json(
          { error: "Échec de la validation anti-robot. Veuillez réessayer." },
          { status: 403 }
        );
      }
    }

    // 3. Prepare email content
    const recipient = process.env.CONTACT_DESTINATION_EMAIL || "victoriareindale@gmail.com";
    const sender = process.env.CONTACT_FROM_EMAIL || "contact@victoriareindale.com";
    const subject = `Demande de prestation — ${eventType || "Autre"} (${name})`;

    const emailText = [
      `Nouvelle demande de prestation reçue sur victoriareindalesoprano.com`,
      `-----------------------------------------------------------------`,
      `Nom: ${name}`,
      `Email: ${email}`,
      phone ? `Téléphone: ${phone}` : null,
      eventType ? `Type d'événement: ${eventType}` : null,
      eventDate ? `Date souhaitée: ${eventDate}` : null,
      ``,
      `Message:`,
      message,
    ]
      .filter((line) => line !== null)
      .join("\n");

    // 4. Send via Cloudflare send_email binding (if running on Worker)
    const cloudflareEnv = (globalThis as any)?.__CF_PAGES_ENV__ || (globalThis as any)?.env || (process.env as any);
    const sebBinding = cloudflareEnv?.SEB;

    if (sebBinding && typeof sebBinding.send === "function") {
      // Create raw RFC 822 email payload
      const rfc822 = [
        `From: Victoria Reindale Contact <${sender}>`,
        `To: ${recipient}`,
        `Reply-To: ${name} <${email}>`,
        `Subject: =?utf-8?B?${Buffer.from(subject).toString("base64")}?=`,
        `MIME-Version: 1.0`,
        `Content-Type: text/plain; charset=UTF-8`,
        `Content-Transfer-Encoding: 8bit`,
        ``,
        emailText,
      ].join("\r\n");

      try {
        // Resolve cloudflare:email dynamically at runtime in workerd without Webpack intercepting it
        const emailModule = await (new Function('return import("cloudflare:email")'))();
        const EmailMessage = emailModule.EmailMessage;

        if (EmailMessage) {
          const msg = new EmailMessage(sender, recipient, rfc822);
          await sebBinding.send(msg);
          return NextResponse.json({
            success: true,
            deliveredVia: "cloudflare_send_email",
          });
        }
      } catch (cfErr) {
        console.warn("[ContactAPI] Could not dispatch via cloudflare:email binding:", cfErr);
      }
    }

    // If send_email binding is not available in local dev, log details cleanly
    console.log("[ContactAPI] Email prepared for dispatch:", {
      to: recipient,
      from: sender,
      subject,
      body: emailText,
    });

    return NextResponse.json({
      success: true,
      deliveredVia: "logged",
    });
  } catch (error: any) {
    console.error("[ContactAPI] Unexpected error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'envoi de votre message." },
      { status: 500 }
    );
  }
}
