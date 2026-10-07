'use client';

import React, { useEffect, useRef, useState } from 'react';
import Icon from '@/src/components/ui/AppIcon';

export default function CtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const magnetRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            entry.target.querySelectorAll('.fade-up').forEach((el, i) => {
              setTimeout(() => el.classList.add('in-view'), 500 + i * 120);
            });
          }
        });
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Gold spotlight follows the cursor
  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduceMotion() || !sectionRef.current || !spotRef.current) return;
    const r = sectionRef.current.getBoundingClientRect();
    spotRef.current.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    spotRef.current.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  // Primary button leans a few pixels toward the cursor
  const onMagnet = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion() || !magnetRef.current) return;
    const r = magnetRef.current.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * 0.18;
    const y = (e.clientY - (r.top + r.height / 2)) * 0.28;
    magnetRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  const onMagnetLeave = () => {
    if (magnetRef.current) magnetRef.current.style.transform = 'translate3d(0,0,0)';
  };

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Each headline line slides up out of a mask
  const line = (visible: boolean, delayMs: number) =>
  `block transition-transform duration-[1400ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-reduce:transition-none ${
  visible ? 'translate-y-0' : 'translate-y-full'}`;

  return (
    <section
      id="cta"
      ref={sectionRef}
      onMouseMove={onMove}
      className="relative isolate overflow-hidden bg-neutral-950">
      
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_100%,rgba(201,162,75,0.22),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_85%_0%,rgba(201,162,75,0.10),transparent_70%)]" />
        <div ref={spotRef} className="hero-spotlight" />
        <div className="film-grain" />
      </div>

      <div className="container-salon relative z-10 py-32 text-center md:py-44">
        <div className="mx-auto max-w-4xl">
          <p className="label-sm fade-up mb-8 text-accent">Mayfair, London</p>

          {/* Headline: masked line-by-line reveal */}
          <h2 className="mb-8 font-display font-light leading-[1.02] tracking-tight text-primary-foreground text-[clamp(2.75rem,7.5vw,6rem)]">
            <span className="block overflow-hidden pb-[0.12em]">
              <span className={line(inView, 0)} style={{ transitionDelay: '0ms' }}>
                Your next appointment
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.12em]">
              <em className={`${line(inView, 160)} shimmer-text pr-2 italic`} style={{ transitionDelay: '160ms' }}>
                is waiting.
              </em>
            </span>
          </h2>

          {/* Gold rule draws out from the centre */}
          <div
            className={`mx-auto mb-8 h-px w-28 origin-center bg-accent transition-transform duration-1000 ease-out motion-reduce:transition-none ${
            inView ? 'scale-x-100 delay-[600ms]' : 'scale-x-0'}`
            }
            aria-hidden="true" />
          

          <p className="fade-up mx-auto mb-10 max-w-lg text-lg font-light leading-relaxed text-primary-foreground/60">
            Join over 15,000 clients who trust MySalon with their hair. Available six days a week, in the heart of Mayfair.
          </p>

          {/* Live availability */}
          <div className="fade-up mb-10 flex justify-center">
            <div className="glass-dark inline-flex items-center gap-3 rounded-full px-5 py-2.5">
              <div className="relative h-2.5 w-2.5">
                <div className="pulsing-dot absolute inset-0 rounded-full bg-green-500" />
                <div className="relative h-2.5 w-2.5 rounded-full bg-green-500" />
              </div>
              <span className="text-sm text-primary-foreground/80">Next available: Today, 4:30 PM</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="fade-up flex flex-col items-center justify-center gap-4 sm:flex-row">
            <div
              ref={magnetRef}
              onMouseMove={onMagnet}
              onMouseLeave={onMagnetLeave}
              className="p-3 transition-transform duration-300 ease-out">
              
              <button
                onClick={() => scrollTo('#availability')}
                className="btn-primary text-sm"
                aria-label="Book your appointment at MySalon">
                
                Book Your Appointment
                <Icon name="ArrowRightIcon" size={16} />
              </button>
            </div>
            <a href="tel:+442079460123" className="btn-outline text-sm" aria-label="Call MySalon">
              <Icon name="PhoneIcon" size={16} />
              +44 20 7946 0123
            </a>
          </div>

          {/* Trust row */}
          <div className="fade-up mt-20 flex flex-col items-center justify-center gap-y-3 border-t border-white/10 pt-8 sm:flex-row sm:divide-x sm:divide-white/10">
            <div className="flex items-center gap-2 px-6">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) =>
                <Icon key={i} name="StarIcon" size={13} variant="solid" />
                )}
              </div>
              <span className="text-sm text-primary-foreground/60">4.9 on Google</span>
            </div>
            <span className="px-6 text-sm text-primary-foreground/50">Est. 2011</span>
            <span className="px-6 text-sm text-primary-foreground/50">L&rsquo;Oréal Professionnel &amp; Olaplex</span>
          </div>
        </div>
      </div>
    </section>);

}