'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import AppImage from '@/src/components/ui/AppImage';

/* Bento layout, md and up (4 columns):
   Row 1-2: [A 2x2] [B] [C tall]
            [A 2x2] [D] [C tall]
   Row 3-4: [E tall] [F wide ] [G]
            [E tall] [H wide, 3 cols]
   8 tiles, all placed. */

const photos = [
{ src: '/work1.png', label: 'Cut & Finish', sub: 'Signature work', span: 'col-span-2 row-span-2', pos: 'object-center' },
{ src: '/stylist1.png', label: 'James Whitfield', sub: 'Creative Director', span: '', pos: 'object-top' },
{ src: '/stylist2.png', label: 'Sophie Clarke', sub: 'Colour Specialist', span: 'md:row-span-2', pos: 'object-top' },
{ src: '/work2.png', label: 'Colour', sub: 'Signature work', span: '', pos: 'object-center' },
{ src: '/work3.png', label: 'Balayage', sub: 'Signature work', span: 'md:row-span-2', pos: 'object-center' },
{ src: '/stylist3.png', label: 'Priya Sharma', sub: 'Senior Stylist', span: 'md:col-span-2', pos: 'object-top' },
{ src: '/work4.png', label: 'Keratin Smoothing', sub: 'Signature work', span: '', pos: 'object-center' },
{ src: '/stylist4.png', label: 'Amara Osei', sub: 'Curl Specialist', span: 'col-span-2 md:col-span-3', pos: 'object-top' }];


export default function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.fade-up').forEach((el, i) => {
              setTimeout(() => el.classList.add('in-view'), i * 80);
            });
          }
        });
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: 1 | -1) => setOpen((o) => o === null ? o : (o + dir + photos.length) % photos.length),
    []
  );

  // Lightbox: keyboard + scroll lock
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close, step]);

  const current = open !== null ? photos[open] : null;

  return (
    <section id="gallery" className="section-pad bg-secondary" ref={sectionRef}>
      <div className="container-salon">
        <div className="fade-up mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="label-sm mb-3 text-accent">Signature Work</p>
            <h2 className="text-display-md font-display text-foreground">
              The art of the result.
            </h2>
          </div>
          <div className="max-w-xs">
            <p className="text-sm text-muted-foreground">
              A selection of recent work from our stylists. Every transformation is unique.
            </p>
            <p className="mt-2 text-xs text-muted-foreground/70">Select any photo to view it larger.</p>
          </div>
        </div>

        <div className="grid auto-rows-[180px] grid-cols-2 gap-3 md:auto-rows-[240px] md:grid-flow-dense md:grid-cols-4 md:gap-4 lg:auto-rows-[270px]">
          {photos.map((p, i) =>
          <button
            key={p.src}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`View ${p.label} larger`}
            className={`fade-up group relative overflow-hidden rounded-xl bg-neutral-900 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent ${p.span}`}
            style={{ transitionDelay: `${i * 70}ms` }}>
            
              <AppImage
              src={p.src}
              alt={`${p.label} at MySalon`}
              fill
              sizes="(min-width: 768px) 30vw, 50vw"
              className={`object-cover ${p.pos} transition-transform duration-[1200ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.07] motion-reduce:transition-none`} />
            

              {/* shade + caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 translate-y-0 p-4 transition-all duration-500 md:translate-y-2 md:p-5 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">
                <div className="mb-2 h-px w-8 bg-accent transition-all duration-500 group-hover:w-14" />
                <p className="font-display text-base text-white md:text-lg">{p.label}</p>
                <p className="text-xs text-white/65">{p.sub}</p>
              </div>

              {/* expand cue */}
              <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {current && open !== null &&
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Photo viewer"
        className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md md:p-10"
        onClick={close}>
        
          <button
          type="button"
          onClick={close}
          autoFocus
          aria-label="Close photo viewer"
          className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 md:right-8 md:top-8">
          
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <button
          type="button"
          onClick={(e) => {e.stopPropagation();step(-1);}}
          aria-label="Previous photo"
          className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 md:left-8">
          
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button
          type="button"
          onClick={(e) => {e.stopPropagation();step(1);}}
          aria-label="Next photo"
          className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 md:right-8">
          
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div
          key={open}
          className="cine-reveal relative h-full w-full max-w-5xl"
          style={{ '--d': '0s' } as React.CSSProperties}
          onClick={(e) => e.stopPropagation()}>
          
            <AppImage
            src={current.src}
            alt={`${current.label} at MySalon`}
            fill
            sizes="90vw"
            className="object-contain" />
          
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-5 text-center md:bottom-8">
            <p className="font-display text-lg text-white">{current.label}</p>
            <p className="text-xs text-white/60">
              {current.sub} &nbsp;&middot;&nbsp; {open + 1} of {photos.length}
            </p>
          </div>
        </div>
      }
    </section>);

}