"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Copy, 
  Check, 
  CreditCard, 
  QrCode, 
  Building, 
  User, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  Info
} from "lucide-react";

type TranslationKeys = {
  choose_method: string;
  method_paypal: string;
  method_bank: string;
  paypal_desc: string;
  paypal_cta: string;
  bank_desc: string;
  bank_owner: string;
  bank_iban: string;
  bank_bic: string;
  bank_name: string;
  bank_address: string;
  bank_reference: string;
  bank_reference_val: string;
  copy: string;
  copied: string;
  confirm_title: string;
  confirm_desc: string;
  general_desc: string;
};

type Props = {
  locale: string;
  serviceTitle?: string;
  depositAmount?: number;
  contactHref: string;
  t: TranslationKeys;
};

export function PaymentDetails({ locale, serviceTitle, depositAmount, contactHref, t }: Props) {
  const [activeTab, setActiveTab] = useState<"paypal" | "bank">("paypal");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const iban = "FR76 1009 6181 8500 0889 1060 211";
  const bic = "CMCIFRPP";
  const bankOwner = "MME VIKTORIYA VICHKUTKINA";
  const bankName = "CIC GEX";
  const bankAddress = "686 AVENUE FRANCIS BLANCHARD, 01170 GEX, France";

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text.replace(/\s+/g, ""));
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const resolvedReference = `${t.bank_reference_val} - ${(serviceTitle || (locale === "fr" ? "PRESTATION" : "PERFORMANCE")).toUpperCase()}`;

  return (
    <div className="w-full space-y-8 animate-fade-up">
      {/* ── Tabs Selector ── */}
      <div className="border-b border-cream-300">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab("paypal")}
            className={`pb-4 text-sm font-medium tracking-wide transition-all relative flex items-center gap-2 ${
              activeTab === "paypal"
                ? "text-gold-600 font-semibold"
                : "text-ink-500 hover:text-ink-900"
            }`}
          >
            <QrCode size={16} />
            {t.method_paypal}
            {activeTab === "paypal" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500 animate-fade-up" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("bank")}
            className={`pb-4 text-sm font-medium tracking-wide transition-all relative flex items-center gap-2 ${
              activeTab === "bank"
                ? "text-gold-600 font-semibold"
                : "text-ink-500 hover:text-ink-900"
            }`}
          >
            <CreditCard size={16} />
            {t.method_bank}
            {activeTab === "bank" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500 animate-fade-up" />
            )}
          </button>
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="min-h-[400px]">
        {activeTab === "paypal" ? (
          /* ── PAYPAL PANEL ── */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-fade-up">
            <div className="md:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-50 text-gold-600 text-xs font-semibold uppercase tracking-wider">
                ⚡ Instant Payment
              </div>
              <h3 className="heading-md">Pay instantly with PayPal</h3>
              <p className="text-sm text-ink-500 leading-relaxed">
                {t.paypal_desc}
              </p>
              
              {!serviceTitle && (
                <div className="p-4 bg-cream-100 border-l-2 border-gold-400 flex items-start gap-3">
                  <Info size={16} className="text-gold-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-ink-600 leading-relaxed">
                    {t.general_desc}
                  </p>
                </div>
              )}

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <a
                  href="https://www.paypal.com/donate/?hosted_button_id=B8S2L6AMJZDNN&source=qr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-gold justify-center text-center text-xs"
                >
                  {t.paypal_cta}
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-white border border-cream-300 shadow-sm relative group overflow-hidden">
              <div className="relative w-full aspect-square max-w-[240px] overflow-hidden">
                <Image
                  src="/images/paypal-qr.jpg"
                  alt="PayPal QR Code"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 240px"
                  priority
                />
              </div>
              <span className="mt-4 text-xs font-semibold text-ink-500 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-green-600" />
                Secure Scan
              </span>
            </div>
          </div>
        ) : (
          /* ── BANK TRANSFER PANEL ── */
          <div className="space-y-8 animate-fade-up">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-50 text-gold-600 text-xs font-semibold uppercase tracking-wider">
                🏦 Bank Transfer
              </div>
              <h3 className="heading-md">{t.method_bank}</h3>
              <p className="text-sm text-ink-500 max-w-2xl leading-relaxed">
                {t.bank_desc}
              </p>
            </div>

            {/* Premium Digital RIB Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Bank Details Fields */}
              <div className="lg:col-span-8 space-y-4">
                {/* Account Owner */}
                <div className="p-4 bg-white border border-cream-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <User size={16} className="text-gold-500 shrink-0" />
                    <div>
                      <span className="block text-[10px] font-semibold text-ink-300 uppercase tracking-wider">{t.bank_owner}</span>
                      <span className="text-sm font-medium text-ink-900">{bankOwner}</span>
                    </div>
                  </div>
                </div>

                {/* IBAN */}
                <div className="p-4 bg-white border border-cream-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <CreditCard size={16} className="text-gold-500 shrink-0" />
                    <div className="min-w-0">
                      <span className="block text-[10px] font-semibold text-ink-300 uppercase tracking-wider">{t.bank_iban}</span>
                      <span className="text-sm font-mono text-ink-900 break-all select-all font-semibold tracking-wide">
                        {iban}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(iban, "iban")}
                    className="btn-outline py-2 px-4 text-xs font-medium flex items-center justify-center gap-1.5 self-start sm:self-auto shrink-0"
                  >
                    {copiedField === "iban" ? (
                      <>
                        <Check size={13} className="text-green-600" />
                        <span className="text-green-600">{t.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>{t.copy}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* BIC */}
                <div className="p-4 bg-white border border-cream-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <Building size={16} className="text-gold-500 shrink-0" />
                    <div className="min-w-0">
                      <span className="block text-[10px] font-semibold text-ink-300 uppercase tracking-wider">{t.bank_bic}</span>
                      <span className="text-sm font-mono text-ink-900 font-semibold tracking-wide">{bic}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(bic, "bic")}
                    className="btn-outline py-2 px-4 text-xs font-medium flex items-center justify-center gap-1.5 self-start sm:self-auto shrink-0"
                  >
                    {copiedField === "bic" ? (
                      <>
                        <Check size={13} className="text-green-600" />
                        <span className="text-green-600">{t.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>{t.copy}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Required Reference */}
                <div className="p-4 bg-cream-100 border border-cream-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3">
                    <Info size={16} className="text-gold-600 shrink-0 mt-1 sm:mt-0" />
                    <div>
                      <span className="block text-[10px] font-semibold text-gold-600 uppercase tracking-wider">{t.bank_reference}</span>
                      <span className="text-sm font-mono font-bold text-ink-900 select-all tracking-wide">{resolvedReference}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(resolvedReference, "reference")}
                    className="btn-outline py-2 px-4 text-xs border-gold-400 text-gold-600 hover:bg-gold-50 shrink-0"
                  >
                    {copiedField === "reference" ? (
                      <>
                        <Check size={13} className="text-green-600" />
                        <span className="text-green-600">{t.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>{t.copy}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: Bank Info Block */}
              <div className="lg:col-span-4 p-6 bg-cream-100 border border-cream-300 space-y-6">
                <div>
                  <span className="block text-[10px] font-semibold text-ink-300 uppercase tracking-wider mb-1">{t.bank_name}</span>
                  <span className="text-sm font-semibold text-ink-900">{bankName}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-semibold text-ink-300 uppercase tracking-wider mb-1">
                    <span className="flex items-center gap-1">
                      <MapPin size={11} />
                      {t.bank_address}
                    </span>
                  </span>
                  <span className="text-xs text-ink-500 leading-relaxed block">{bankAddress}</span>
                </div>
                <div className="pt-4 border-t border-cream-300">
                  <span className="block text-[10px] font-semibold text-ink-300 uppercase tracking-wider mb-2">Original Receipt</span>
                  <a 
                    href="/images/iban-details.jpg" 
                    target="_blank" 
                    className="text-xs text-gold-600 hover:text-gold-700 underline font-medium block"
                  >
                    View Original Bank RIB Document
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Next Steps Callout ── */}
      <div className="p-6 bg-ink-900 text-cream-100 border-l-4 border-gold-400 space-y-3">
        <h4 className="font-serif text-lg text-cream-50 font-medium">{t.confirm_title}</h4>
        <p className="text-xs text-cream-200/80 leading-relaxed">
          {t.confirm_desc}
        </p>
        <div className="pt-2">
          <a
            href={contactHref}
            className="text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors inline-flex items-center gap-1.5 group"
          >
            <span>Proceed to Contact Form</span>
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
}
