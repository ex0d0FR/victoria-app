"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import { useTranslations } from "next-intl";

type GalleryItem = { id: string; src: string; thumb: string; alt: string; caption: string; category: string };

const CATEGORIES = ["all", "concert", "wedding", "portrait", "backstage"] as const;

export function GalleryGrid({ items, locale }: { items: GalleryItem[]; locale: string }) {
  const t = useTranslations("gallery");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex]   = useState<number | null>(null);

  const filtered = activeCategory === "all" ? items : items.filter((i) => i.category === activeCategory);

  const catLabel = (cat: string) => {
    const map: Record<string, string> = {
      all: t("all"), concert: t("concert"), wedding: t("wedding"),
      portrait: t("portrait"), backstage: t("backstage"),
    };
    return map[cat] ?? cat;
  };

  const openLightbox  = (idx: number) => { setLightboxIndex(idx); document.body.style.overflow = "hidden"; };
  const closeLightbox = () => { setLightboxIndex(null); document.body.style.overflow = ""; };
  const prevImg       = () => setLightboxIndex((i) => (i! - 1 + filtered.length) % filtered.length);
  const nextImg       = () => setLightboxIndex((i) => (i! + 1) % filtered.length);

  return (
    <>
      {/* Filter tabs */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.filter((c) => c === "all" || items.some((i) => i.category === c)).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={clsx(
                "px-4 py-1.5 text-xs font-medium tracking-wider uppercase transition-colors border",
                activeCategory === cat
                  ? "bg-ink-900 text-cream-50 border-ink-900"
                  : "bg-transparent text-ink-600 border-cream-300 hover:border-ink-900 hover:text-ink-900"
              )}
            >
              {catLabel(cat)}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center text-ink-400">
          {locale === "fr" ? "Photos à venir…" : "Photos coming soon…"}
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filtered.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="break-inside-avoid w-full overflow-hidden block img-hover cursor-zoom-in group relative"
            >
              <Image
                src={item.thumb}
                alt={item.alt}
                width={600}
                height={400}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {item.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/70 to-transparent
                                translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-4">
                  <p className="text-cream-50 text-xs">{item.caption}</p>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && filtered[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-ink-900/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button onClick={closeLightbox} aria-label="Close"
                  className="absolute top-4 right-4 text-cream-200 hover:text-white">
            <X size={24} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); prevImg(); }} aria-label="Previous"
                  className="absolute left-4 text-cream-200 hover:text-white">
            <ChevronLeft size={32} />
          </button>

          <div className="relative max-w-4xl w-full max-h-[85vh] flex items-center justify-center"
               onClick={(e) => e.stopPropagation()}>
            <Image
              src={filtered[lightboxIndex].src}
              alt={filtered[lightboxIndex].alt}
              width={1200}
              height={800}
              className="max-h-[85vh] w-auto h-auto object-contain"
              sizes="100vw"
            />
            {filtered[lightboxIndex].caption && (
              <p className="absolute bottom-0 inset-x-0 text-center text-cream-200 text-sm py-3 bg-ink-900/50">
                {filtered[lightboxIndex].caption}
              </p>
            )}
          </div>

          <button onClick={(e) => { e.stopPropagation(); nextImg(); }} aria-label="Next"
                  className="absolute right-4 text-cream-200 hover:text-white">
            <ChevronRight size={32} />
          </button>

          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-cream-400 text-xs">
            {lightboxIndex + 1} / {filtered.length}
          </p>
        </div>
      )}
    </>
  );
}
