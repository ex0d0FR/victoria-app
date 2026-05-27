"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import clsx from "clsx";

const NAV_KEYS = ["about", "services", "gallery", "events", "contact"] as const;

function getHref(key: string, locale: string) {
  const prefix = locale === "en" ? "/en" : "";
  if (key === "home") return prefix || "/";
  return `${prefix}/${key}`;
}

export function Header({ locale }: { locale: string }) {
  const t = usePathname();
  const tNav = useTranslations("nav");
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const isHome = pathname === "/" || pathname === `/${locale}` || pathname === `/${locale}/`;
  // Transparent mode = on home, not yet scrolled, mobile menu closed
  const isTransparent = isHome && !scrolled && !menuOpen;

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || menuOpen
          ? "bg-cream-50/95 backdrop-blur-sm border-b border-cream-300 shadow-sm"
          : isHome
          ? "bg-transparent"
          : "bg-cream-50/95 backdrop-blur-sm border-b border-cream-300"
      )}
    >
      <div className="container-wide px-6 md:px-12 lg:px-20">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href={locale === "en" ? "/en" : "/"}
            className={clsx(
              "font-serif text-xl md:text-2xl tracking-wide transition-colors",
              isTransparent
                ? "text-gold-300 hover:text-gold-400"
                : "text-ink-900 hover:text-gold-600"
            )}
          >
            Victoria Reindale
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_KEYS.map((key) => (
              <Link
                key={key}
                href={getHref(key, locale)}
                className={clsx(
                  "text-sm font-medium tracking-wide transition-colors duration-200",
                  isTransparent
                    ? pathname.includes(`/${key}`)
                      ? "text-gold-400"
                      : "text-cream-200 hover:text-gold-400"
                    : pathname.includes(`/${key}`)
                    ? "text-gold-600"
                    : "text-ink-700 hover:text-gold-600"
                )}
              >
                {tNav(key)}
              </Link>
            ))}
          </nav>

          {/* Right: language + CTA */}
          <div className="hidden lg:flex items-center gap-6">
            <LanguageSwitcher locale={locale} transparent={isTransparent} />
            <Link
              href={getHref("contact", locale)}
              className={clsx(
                "text-xs px-5 py-2.5 transition-colors duration-200",
                isTransparent
                  ? "border border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-ink-900"
                  : "btn-primary"
              )}
            >
              {tNav("contact")}
            </Link>
          </div>

          {/* Mobile: language + hamburger */}
          <div className="flex lg:hidden items-center gap-4">
            <LanguageSwitcher locale={locale} transparent={isTransparent} />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
              className={clsx("p-1 transition-colors", isTransparent ? "text-cream-200" : "text-ink-900")}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-cream-50 border-t border-cream-300 px-6 pb-8 pt-4 space-y-1">
          {NAV_KEYS.map((key) => (
            <Link
              key={key}
              href={getHref(key, locale)}
              className="block py-3 text-base font-medium text-ink-700 border-b border-cream-200 hover:text-gold-600 transition-colors"
            >
              {tNav(key)}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
