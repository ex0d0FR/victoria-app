import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { services } from "@/data/mock";
import { PaymentDetails } from "@/components/sections/PaymentDetails";
import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  unstable_setRequestLocale(locale);
  return {
    title: locale === "fr" ? "Paiement Sécurisé — Victoria Reindale" : "Secure Payment — Victoria Reindale",
  };
}

type Props = {
  params: { locale: string };
  searchParams: { serviceId?: string; amount?: string };
};

export default async function PaymentPage({ params: { locale }, searchParams }: Props) {
  unstable_setRequestLocale(locale);

  const t = await getTranslations("payment");
  const prefix = locale === "en" ? "/en" : "";

  // Resolve service details if serviceId is provided
  const serviceId = searchParams?.serviceId;
  const matchedService = services.find((s) => s._id === serviceId);

  const serviceTitle = matchedService
    ? matchedService.title[locale as "fr" | "en"] || matchedService.title.fr
    : undefined;

  const depositAmount = matchedService?.depositAmount 
    ? matchedService.depositAmount 
    : searchParams?.amount 
    ? parseFloat(searchParams.amount) 
    : undefined;

  // Prepare translations for client component
  const clientTranslations = {
    choose_method: t("choose_method"),
    method_paypal: t("method_paypal"),
    method_bank: t("method_bank"),
    paypal_desc: t("paypal_desc"),
    paypal_cta: t("paypal_cta"),
    bank_desc: t("bank_desc"),
    bank_owner: t("bank_owner"),
    bank_iban: t("bank_iban"),
    bank_bic: t("bank_bic"),
    bank_name: t("bank_name"),
    bank_address: t("bank_address"),
    bank_reference: t("bank_reference"),
    bank_reference_val: t("bank_reference_val"),
    copy: t("copy"),
    copied: t("copied"),
    confirm_title: t("confirm_title"),
    confirm_desc: t("confirm_desc"),
    general_desc: t("general_desc"),
  };

  const contactHref = `${prefix}/contact`;

  return (
    <div className="pt-20">
      {/* ── Header Section ── */}
      <section className="section-padding bg-cream-50 pb-12">
        <div className="container-wide">
          <div className="mb-6">
            <Link
              href={`${prefix}/services`}
              className="inline-flex items-center gap-2 text-xs font-medium text-ink-500 hover:text-ink-900 transition-colors"
            >
              <ArrowLeft size={12} />
              {locale === "fr" ? "Retour aux services" : "Back to services"}
            </Link>
          </div>
          <p className="label-sm mb-3">{locale === "fr" ? "Transaction sécurisée" : "Secure transaction"}</p>
          <div className="divider-gold" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
            <h1 className="heading-display">{t("title")}</h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 text-green-700 text-xs font-medium self-start md:self-auto">
              <Shield size={14} />
              SSL 256-bit Encrypted
            </div>
          </div>
        </div>
      </section>

      {/* ── Content Layout ── */}
      <section className="section-padding bg-cream-100 pt-0">
        <div className="container-wide max-w-4xl mx-auto space-y-8">
          {/* Main Checkout Panel */}
          <div className="card-border p-6 md:p-8 bg-white">
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-300 mb-6">
              {t("choose_method")}
            </h2>
            <PaymentDetails
              locale={locale}
              serviceTitle={serviceTitle}
              depositAmount={depositAmount}
              contactHref={contactHref}
              t={clientTranslations}
            />
          </div>

          {/* Checkout Invoice Summary (Commented out while direct payment methods are active)
          <div className="card-border p-6 md:p-8 bg-white">
            <h3 className="font-serif text-xl text-ink-900 border-b border-cream-300 pb-4 mb-6">
              {t("summary_title")}
            </h3>

            {serviceTitle ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="block text-[10px] font-semibold text-ink-300 uppercase tracking-wider mb-0.5">
                      {t("service")}
                    </span>
                    <span className="text-sm font-semibold text-ink-900">{serviceTitle}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-cream-200">
                  <span className="text-sm font-semibold text-ink-700">{t("amount")}</span>
                  <span className="font-serif text-2xl font-bold text-gold-600">
                    {depositAmount} €
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="block text-[10px] font-semibold text-ink-300 uppercase tracking-wider mb-0.5">
                      {t("service")}
                    </span>
                    <span className="text-sm font-semibold text-ink-900">{t("general")}</span>
                  </div>
                </div>

                {depositAmount ? (
                  <div className="flex justify-between items-center pt-6 border-t border-cream-200">
                    <span className="text-sm font-semibold text-ink-700">Amount</span>
                    <span className="font-serif text-2xl font-bold text-gold-600">
                      {depositAmount} €
                    </span>
                  </div>
                ) : (
                  <div className="pt-6 border-t border-cream-200 text-xs text-ink-500 leading-relaxed">
                    {locale === "fr"
                      ? "Utilisez cette page pour verser l'acompte de votre formule ou régler un montant personnalisé convenu au préalable."
                      : "Use this page to settle a custom invoice or make a booking deposit as previously arranged."}
                  </div>
                )}
              </div>
            )}
          </div>
          */}
        </div>
      </section>
    </div>
  );
}
