import Link from "next/link";
import { useTranslations } from "next-intl";

type Props = {
  serviceId:     string;
  serviceTitle:  string;
  depositAmount: number;
  locale:        string;
};

export function BookingButton({ serviceId, depositAmount, locale }: Props) {
  const t = useTranslations("booking");
  const prefix = locale === "en" ? "/en" : "";

  return (
    <Link
      href={`${prefix}/payment?serviceId=${serviceId}&amount=${depositAmount}`}
      className="btn-gold text-center text-xs justify-center flex"
    >
      {`${t("pay_deposit")} (${depositAmount} €)`}
    </Link>
  );
}
