"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { CheckCircle2, Mail, Copy, Check, ArrowLeft, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import clsx from "clsx";
import { Turnstile } from "@/components/ui/Turnstile";

type FormData = {
  name: string;
  email: string;
  phone?: string;
  eventType: string;
  eventDate?: string;
  message: string;
};

const EVENT_TYPES_FR = ["Mariage", "Concert privé", "Gala / soirée d'entreprise", "Anniversaire", "Autre"];
const EVENT_TYPES_EN = ["Wedding", "Private concert", "Gala / corporate event", "Birthday", "Other"];

export function ContactForm({
  locale,
  recipientEmail = "contact@victoriareindale.com",
  turnstileSiteKey,
}: {
  locale: string;
  recipientEmail?: string;
  turnstileSiteKey?: string;
}) {
  const t = useTranslations("contact");
  const isFr = locale === "fr";
  const activeTurnstileKey = turnstileSiteKey || process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "ready">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [preparedData, setPreparedData] = useState<{
    subject: string;
    body: string;
    mailtoUrl: string;
  } | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const eventTypes = isFr ? EVENT_TYPES_FR : EVENT_TYPES_EN;

  const onSubmit = async (data: FormData) => {
    setErrorMessage(null);
    setStatus("submitting");

    const subject = isFr
      ? `Demande de prestation — ${data.eventType} (${data.name})`
      : `Performance Inquiry — ${data.eventType} (${data.name})`;

    const body = [
      isFr ? "Bonjour Victoria," : "Hello Victoria,",
      "",
      `${isFr ? "Nom" : "Name"}: ${data.name}`,
      `Email: ${data.email}`,
      data.phone ? `${isFr ? "Téléphone" : "Phone"}: ${data.phone}` : null,
      `${isFr ? "Type d'événement" : "Event type"}: ${data.eventType}`,
      data.eventDate ? `${isFr ? "Date souhaitée" : "Preferred date"}: ${data.eventDate}` : null,
      "",
      `${isFr ? "Message" : "Message"}:`,
      data.message,
    ]
      .filter((line) => line !== null)
      .join("\n");

    const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
      // 1. Direct background dispatch via Cloudflare send_email API
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          turnstileToken,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setStatus("sent");
        reset();
        return;
      }

      // If API rejected or failed validation (e.g. Turnstile or missing fields)
      if (json.error) {
        setErrorMessage(json.error);
        setStatus("idle");
        return;
      }
    } catch (err) {
      console.warn("Direct contact submission failed, falling back to mailto client:", err);
      // Fallback to client mailto flow only on network failure
      setPreparedData({ subject, body, mailtoUrl });
      setStatus("ready");
      return;
    }

    setPreparedData({ subject, body, mailtoUrl });
    setStatus("ready");
  };

  const handleCopy = () => {
    if (!preparedData) return;
    const fullText = `À / To: ${recipientEmail}\nObjet / Subject: ${preparedData.subject}\n\n${preparedData.body}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Direct success state
  if (status === "sent") {
    return (
      <div className="card-border p-8 bg-white space-y-6 animate-fade-up">
        <div className="flex items-center gap-3">
          <CheckCircle2 size={32} className="text-gold-500 shrink-0" />
          <div>
            <h3 className="heading-md">
              {isFr ? "Message transmis avec succès !" : "Message sent successfully!"}
            </h3>
            <p className="text-xs text-ink-500 mt-1 leading-relaxed">
              {isFr
                ? "Votre demande a bien été envoyée à Victoria Reindale. Elle vous répondra dans les meilleurs délais (sous 24–48h)."
                : "Your inquiry has been directly delivered to Victoria Reindale. She will get back to you shortly (within 24–48 hours)."}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-cream-200">
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="text-xs text-gold-600 hover:text-gold-700 font-medium inline-flex items-center gap-1 transition-colors"
          >
            <span>{isFr ? "Envoyer un autre message" : "Send another message"}</span>
          </button>
        </div>
      </div>
    );
  }

  // Fallback mailto ready state
  if (status === "ready" && preparedData) {
    return (
      <div className="card-border p-8 bg-white space-y-6 animate-fade-up">
        <div className="flex items-center gap-3">
          <CheckCircle2 size={32} className="text-gold-500 shrink-0" />
          <div>
            <h3 className="heading-md">{t("success")}</h3>
            <p className="text-xs text-ink-500 mt-1 leading-relaxed">
              {t("success_desc")}
            </p>
          </div>
        </div>

        <div className="p-4 bg-cream-100 border border-cream-300 space-y-2 text-xs">
          <div className="flex justify-between items-center text-ink-600">
            <span className="font-semibold text-ink-900">
              {locale === "fr" ? "Destinataire :" : "Recipient:"}
            </span>
            <span className="font-mono">{recipientEmail}</span>
          </div>
          <div className="flex justify-between items-center text-ink-600">
            <span className="font-semibold text-ink-900">
              {locale === "fr" ? "Objet :" : "Subject:"}
            </span>
            <span className="truncate max-w-[280px] sm:max-w-none">{preparedData.subject}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <a
            href={preparedData.mailtoUrl}
            className="btn-primary text-xs justify-center flex items-center gap-2"
          >
            <Mail size={14} />
            <span>{t("open_client_btn")}</span>
            <ExternalLink size={12} />
          </a>

          <button
            type="button"
            onClick={handleCopy}
            className="btn-outline text-xs justify-center flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check size={14} className="text-green-600" />
                <span className="text-green-600 font-medium">{t("copied")}</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>{t("copy_btn")}</span>
              </>
            )}
          </button>
        </div>

        <div className="pt-4 border-t border-cream-200">
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="text-xs text-ink-500 hover:text-ink-900 inline-flex items-center gap-1 transition-colors"
          >
            <ArrowLeft size={12} />
            <span>{t("back_btn")}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Row: name + email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <label className="label-sm block mb-3">{t("name")} *</label>
          <input
            {...register("name", { required: true })}
            className={clsx("form-input", errors.name && "border-red-400")}
            placeholder={t("name")}
          />
        </div>
        <div>
          <label className="label-sm block mb-3">{t("email")} *</label>
          <input
            {...register("email", { required: true, pattern: /^\S+@\S+\.\S+$/ })}
            type="email"
            className={clsx("form-input", errors.email && "border-red-400")}
            placeholder="email@exemple.com"
          />
        </div>
      </div>

      {/* Row: phone + event type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <label className="label-sm block mb-3">{t("phone")}</label>
          <input {...register("phone")} type="tel" className="form-input" placeholder="+33 6 00 00 00 00" />
        </div>
        <div>
          <label className="label-sm block mb-3">{t("event_type")} *</label>
          <select
            {...register("eventType", { required: true })}
            className={clsx("form-input bg-transparent", errors.eventType && "border-red-400")}
          >
            <option value="">{locale === "fr" ? "Choisir…" : "Choose…"}</option>
            {eventTypes.map((et) => <option key={et} value={et}>{et}</option>)}
          </select>
        </div>
      </div>

      {/* Event date */}
      <div>
        <label className="label-sm block mb-3">{t("event_date")}</label>
        <input {...register("eventDate")} type="date" className="form-input" />
      </div>

      {/* Message */}
      <div>
        <label className="label-sm block mb-3">{t("message")} *</label>
        <textarea
          {...register("message", { required: true, minLength: 10 })}
          rows={5}
          className={clsx("form-input resize-none", errors.message && "border-red-400")}
          placeholder={locale === "fr"
            ? "Décrivez votre événement, vos attentes, vos questions…"
            : "Describe your event, expectations, questions…"}
        />
      </div>

      {/* Cloudflare Turnstile bot protection */}
      {activeTurnstileKey && (
        <Turnstile
          siteKey={activeTurnstileKey}
          onVerify={(token) => setTurnstileToken(token)}
          onExpire={() => setTurnstileToken(null)}
          theme="light"
        />
      )}

      {/* Error alert if any */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle size={14} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary inline-flex items-center gap-2"
      >
        {status === "submitting" ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            <span>{isFr ? "Envoi en cours…" : "Sending…"}</span>
          </>
        ) : (
          <>
            <Mail size={15} />
            <span>{t("send")}</span>
          </>
        )}
      </button>
    </form>
  );
}
