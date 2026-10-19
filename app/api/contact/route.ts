import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = "force-dynamic";

interface TurnstileVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
}

function sanitizeHeaderValue(val: unknown): string {
  if (typeof val !== "string") return "";
  return val.replace(/[\r\n]+/g, " ").trim();
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawName = sanitizeHeaderValue(body?.name);
    const rawEmail = sanitizeHeaderValue(body?.email);
    const rawPhone = sanitizeHeaderValue(body?.phone);
    const rawEventType = sanitizeHeaderValue(body?.eventType);
    const rawEventDate = sanitizeHeaderValue(body?.eventDate);
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const turnstileToken = typeof body?.turnstileToken === "string" ? body.turnstileToken : "";

    // 1. Basic validation
    if (!rawName || !rawEmail || !message) {
      return NextResponse.json(
        { error: "Veuillez remplir tous les champs obligatoires (nom, email, message)." },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(rawEmail)) {
      return NextResponse.json(
        { error: "Veuillez saisir une adresse email valide." },
        { status: 400 }
      );
    }

    // Resolve Cloudflare environment if running inside OpenNext Worker
    let cfEnv: Record<string, any> | undefined;
    try {
      const ctx = await getCloudflareContext({ async: true });
      cfEnv = ctx?.env as Record<string, any>;
    } catch {
      cfEnv = (globalThis as any)?.__CF_PAGES_ENV__ || (globalThis as any)?.env;
    }

    // 2. Cloudflare Turnstile verification (if secret key is configured)
    const turnstileSecret = cfEnv?.TURNSTILE_SECRET_KEY || process.env.TURNSTILE_SECRET_KEY;
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
        verifyFormData.append("remoteip", clientIp.split(",")[0].trim());
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
    const recipient = sanitizeHeaderValue(
      cfEnv?.CONTACT_DESTINATION_EMAIL ||
        process.env.CONTACT_DESTINATION_EMAIL ||
        "victoriareindale@gmail.com"
    );
    const sender = sanitizeHeaderValue(
      cfEnv?.CONTACT_FROM_EMAIL ||
        process.env.CONTACT_FROM_EMAIL ||
        "contact@victoriareindale.com"
    );
    const subject = `Demande de prestation — ${rawEventType || "Autre"} (${rawName})`;

    const emailText = [
      `Nouvelle demande de prestation reçue sur victoriareindalesoprano.com`,
      `-----------------------------------------------------------------`,
      `Nom: ${rawName}`,
      `Email: ${rawEmail}`,
      rawPhone ? `Téléphone: ${rawPhone}` : null,
      rawEventType ? `Type d'événement: ${rawEventType}` : null,
      rawEventDate ? `Date souhaitée: ${rawEventDate}` : null,
      ``,
      `Message:`,
      message,
    ]
      .filter((line) => line !== null)
      .join("\n");

    // 4. Send via Cloudflare send_email binding (if running on Worker)
    const sebBinding = cfEnv?.SEB || (process.env as any)?.SEB;

    if (sebBinding && typeof sebBinding.send === "function") {
      const safeDisplayName = rawName.replace(/["\\<>]/g, "");
      const messageId = `<${ crypto.randomUUID() }@${sender.split("@")[1] || "victoriareindale.com"}>`;
      // Create raw RFC 822 email payload
      const rfc822 = [
        `From: "Victoria Reindale Contact" <${sender}>`,
        `To: <${recipient}>`,
        `Reply-To: "${safeDisplayName}" <${rawEmail}>`,
        `Subject: =?utf-8?B?${Buffer.from(subject).toString("base64")}?=`,
        `Date: ${new Date().toUTCString()}`,
        `Message-ID: ${messageId}`,
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
        return NextResponse.json({
          success: false,
          fallbackToMailto: true,
        });
      }
    }

    // In local development, log details cleanly; in production without SEB, trigger mailto redirect fallback
    if (process.env.NODE_ENV !== "production") {
      console.log("[ContactAPI] (Dev) Email prepared for dispatch:", {
        to: recipient,
        from: sender,
        subject,
        body: emailText,
      });
    }

    return NextResponse.json({
      success: false,
      fallbackToMailto: true,
    });
  } catch (error: any) {
    console.error("[ContactAPI] Unexpected error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'envoi de votre message." },
      { status: 500 }
    );
  }
}
