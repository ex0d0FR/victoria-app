"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import clsx from "clsx";

type FormData = {
  name:       string;
  email:      string;
  phone?:     string;
  eventType:  string;
  eventDate?: string;
  message:    string;
};

const EVENT_TYPES_FR = ["Mariage", "Concert privé", "Gala / soirée d'entreprise", "Anniversaire", "Autre"];
const EVENT_TYPES_EN = ["Wedding", "Private concert", "Gala / corporate event", "Birthday", "Other"];

export function ContactForm({ locale }: { locale: string }) {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

  const eventTypes = locale === "fr" ? EVENT_TYPES_FR : EVENT_TYPES_EN;

  const onSubmit = async (data: FormData) => {
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ ...data, locale }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
        <CheckCircle2 size={40} className="text-gold-500" />
        <p className="heading-md">{t("success")}</p>
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
          {...register("message", { required: true, minLength: 20 })}
          rows={5}
          className={clsx("form-input resize-none", errors.message && "border-red-400")}
          placeholder={locale === "fr"
            ? "Décrivez votre événement, vos attentes, vos questions…"
            : "Describe your event, expectations, questions…"}
        />
      </div>

      {status === "error" && (
        <p className="text-red-500 text-sm">{t("error")}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "sending" ? t("sending") : t("send")}
      </button>
    </form>
  );
}
