"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type Props = {
  serviceId:     string;
  serviceTitle:  string;
  depositAmount: number;
  locale:        string;
};

export function BookingButton({ serviceId, serviceTitle, depositAmount, locale }: Props) {
  const t = useTranslations("booking");
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, serviceTitle, depositAmount, locale }),
      });
      const { sessionId } = await res.json();
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDeposit}
      disabled={loading}
      className="btn-gold text-center text-xs justify-center disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? "…" : `${t("pay_deposit")} (${depositAmount} €)`}
    </button>
  );
}
