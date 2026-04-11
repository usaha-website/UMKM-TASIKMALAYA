'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { buildWebsiteServiceInquiryMessage, buildWhatsAppUrl } from '@/lib/whatsapp';
import type { ServicePackage } from '@/types/services';

type WebsitePackageCarouselProps = {
  packages: ServicePackage[];
  waNumber: string;
};

export default function WebsitePackageCarousel({ packages, waNumber }: WebsitePackageCarouselProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const totalSlides = packages.length;

  const inquiryUrls = useMemo(() => {
    return packages.map((item) =>
      buildWhatsAppUrl(waNumber, buildWebsiteServiceInquiryMessage(item.name)),
    );
  }, [packages, waNumber]);

  function scrollToIndex(index: number) {
    const container = scrollRef.current;
    if (!container) {
      return;
    }

    const safeIndex = Math.max(0, Math.min(totalSlides - 1, index));
    const width = container.clientWidth;
    container.scrollTo({ left: safeIndex * width, behavior: 'smooth' });
    setActiveIndex(safeIndex);
  }

  function handleScroll() {
    const container = scrollRef.current;
    if (!container) {
      return;
    }

    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = window.requestAnimationFrame(() => {
      const width = Math.max(1, container.clientWidth);
      const nextIndex = Math.round(container.scrollLeft / width);
      setActiveIndex(Math.max(0, Math.min(totalSlides - 1, nextIndex)));
    });
  }

  useEffect(() => {
    function handleResize() {
      scrollToIndex(activeIndex);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeIndex]);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 snap-x snap-mandatory overflow-x-auto px-1 pb-2 scrollbar-none md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-3"
      >
        {packages.map((item, index) => (
          <details
            key={item.id}
            className="group min-w-[85vw] snap-start rounded-[1.75rem] border border-slate-700/70 bg-slate-950/50 p-5 open:border-emerald-300/35 open:bg-slate-950/75 sm:min-w-[24rem] md:min-w-0"
          >
            <summary className="cursor-pointer list-none">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-semibold text-slate-50">{item.name}</h3>
                    {item.badge ? (
                      <span className="rounded-full border border-amber-300/35 bg-amber-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200">
                        {item.badge}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-3xl font-bold text-emerald-300">{item.price}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{item.summary}</p>
                </div>

                <span className="rounded-full border border-slate-700/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300 transition group-open:border-emerald-300/50 group-open:text-emerald-200">
                  Lihat Detail
                </span>
              </div>
            </summary>

            <div className="mt-5 space-y-5 border-t border-slate-800 pt-5">
              <div>
                <p className="text-sm font-semibold text-slate-50">Fitur utama</p>
                <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-200/90">
                  {item.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-emerald-300" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={inquiryUrls[index]}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
              >
                {item.ctaLabel}
              </a>
            </div>
          </details>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 md:hidden">
        <button
          type="button"
          onClick={() => scrollToIndex(activeIndex - 1)}
          disabled={activeIndex === 0}
          className="rounded-2xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-xs font-semibold text-slate-100 transition disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Paket sebelumnya"
        >
          &#8249;
        </button>

        <div className="flex items-center gap-2">
          {packages.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToIndex(index)}
              className={[
                'h-2 w-2 rounded-full transition',
                index === activeIndex ? 'bg-emerald-300' : 'bg-slate-600/70',
              ].join(' ')}
              aria-label={`Lihat paket ${item.name}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollToIndex(activeIndex + 1)}
          disabled={activeIndex >= totalSlides - 1}
          className="rounded-2xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-xs font-semibold text-slate-100 transition disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Paket berikutnya"
        >
          &#8250;
        </button>
      </div>
    </div>
  );
}
