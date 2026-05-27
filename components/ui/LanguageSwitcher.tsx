"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export function LanguageSwitcher({ locale, transparent = false }: { locale: string; transparent?: boolean }) {
  const pathname = usePathname();

  const getLocalePath = (targetLocale: string) => {
    if (targetLocale === "fr") {
      return pathname.replace(/^\/en/, "") || "/";
    } else {
      return pathname.startsWith("/en") ? pathname : `/en${pathname}`;
    }
  };

  return (
    <div className="flex items-center gap-1 text-xs font-medium tracking-wider uppercase">
      {(["fr", "en"] as const).map((lng, i) => (
        <span key={lng} className="flex items-center gap-1">
          {i > 0 && (
            <span className={transparent ? "text-cream-300/50" : "text-ink-300"}>|</span>
          )}
          <Link
            href={getLocalePath(lng)}
            className={clsx(
              "transition-colors",
              transparent
                ? locale === lng
                  ? "text-gold-400 cursor-default"
                  : "text-cream-200/70 hover:text-gold-400"
                : locale === lng
                ? "text-gold-600 cursor-default"
                : "text-ink-500 hover:text-ink-900"
            )}
          >
            {lng.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  );
}
