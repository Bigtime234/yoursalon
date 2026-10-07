'use client';

import React, { useEffect, useRef, useState } from 'react';
import AppImage from '@/src/components/ui/AppImage';
import Icon from '@/src/components/ui/AppIcon';

// Put your photo in /public and change this one line if the name or extension differs
const IMAGE_SRC = '/stylist1.png';

const stats = [
{ value: 13, label: 'Years in Mayfair', suffix: '' },
{ value: 15000, label: 'Clients served', suffix: '+' },
{ value: 12, label: 'Specialist stylists', suffix: '' }];


const perks = [
{ icon: 'SparklesIcon', text: 'Complimentary drinks with every visit' },
{ icon: 'ChatBubbleLeftRightIcon', text: 'Private consultation before every appointment' },
{ icon: 'ShieldCheckIcon', text: 'Olaplex bond protection included' },
{ icon: 'CreditCardIcon', text: 'Free cancellation with 24 hours\' notice' }];


/* Counts up from 0 once `run` is true. Skips the animation for reduced motion. */
function CountUp({ to, run, duration = 1800 }: {to: number;run: boolean;duration?: number;}) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!run) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / duration, 1);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to, duration]);

  return <>{n.toLocaleString('en-GB')}</>;
}

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  // Reveal on scroll (fade-up helpers + arch reveal + count-up all start together)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            entry.target.querySelectorAll('.fade-up').forEach((el, i) => {
              setTimeout(() => el.classList.add('in-view'), i * 100);
            });
          }
        });
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Parallax inside the arch: the photo drifts slowly but never leaves its frame
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let ticking = false;
    const update = () => {
      const frame = frameRef.current;
      const inner = parallaxRef.current;
      if (frame && inner) {
        const r = frame.getBoundingClientRect();
        const offset = r.top + r.height / 2 - window.innerHeight / 2;
        const max = r.height * 0.06;
        const y = Math.max(-max, Math.min(max, offset * -0.06));
        inner.style.transform = `translate3d(0, ${y}px, 0) scale(1.15)`;
      }
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="section-pad relative isolate overflow-hidden bg-neutral-950">
      
      {/* soft gold light from the bottom-right */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_90%_100%,rgba(201,162,75,0.13),transparent_70%)]"
        aria-hidden="true" />
      

      <div className="container-salon">
        <div className="grid items-center gap-20 lg:grid-cols-2 lg:gap-24">
          {/* Left: arched photo */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            {/* Offset gold outline */}
            <div
              className="absolute -left-4 -top-4 -z-10 h-full w-full rounded-t-[999px] rounded-b-2xl border border-accent/30"
              aria-hidden="true" />
            

            <div
              ref={frameRef}
              className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-2xl bg-neutral-900 transition-[clip-path] duration-[1600ms] ease-[cubic-bezier(0.77,0,0.18,1)] motion-reduce:transition-none"
              style={{ clipPath: inView ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)' }}>
              
              <div ref={parallaxRef} className="absolute inset-0 will-change-transform" style={{ transform: 'scale(1.15)' }}>
                <AppImage
                  src={IMAGE_SRC}
                  alt="The MySalon salon in Mayfair, London"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 90vw, 45vw" />
                
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            {/* Award card */}
            <div className="fade-up absolute -bottom-6 -right-2 md:-right-8" style={{ transitionDelay: '600ms' }}>
              <div className="animate-float">
                <div className="glass-dark flex items-center gap-3 rounded-xl p-4 shadow-2xl">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15">
                    <Icon name="TrophyIcon" size={20} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary-foreground">Time Out London</p>
                    <p className="text-xs text-primary-foreground/60">Best Salon 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: story */}
          <div className="space-y-12">
            <div className="fade-up" style={{ transitionDelay: '100ms' }}>
              <p className="label-sm mb-3 text-accent">Our Story</p>
              <h2 className="text-display-md mb-6 font-display text-primary-foreground">
                Thirteen years of<br />
                <em className="font-light italic">considered craft.</em>
              </h2>
              <div className="max-w-xl space-y-4 leading-relaxed text-primary-foreground/65">
                <p>
                  MySalon was founded in 2011 with a single conviction: that exceptional hair is the result of listening carefully, then acting precisely. We opened our doors on Mount Street with four chairs and a team of four. Today, 15,000 clients and 12 specialists later, that conviction hasn&rsquo;t changed.
                </p>
                <p>
                  Every visit begins with a private consultation. We believe in understanding you — your lifestyle, your routine, your relationship with your hair — before we ever pick up a pair of scissors.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div
              className="fade-up grid grid-cols-3 divide-x divide-white/10 border-y border-white/10 py-7"
              style={{ transitionDelay: '200ms' }}>
              
              {stats.map((stat) =>
              <div key={stat.label} className="px-2 text-center sm:px-4">
                  <div className="mb-1 font-display text-4xl font-light tabular-nums text-primary-foreground md:text-5xl">
                    <CountUp to={stat.value} run={inView} />
                    <span className="text-accent">{stat.suffix}</span>
                  </div>
                  <p className="text-xs leading-tight text-primary-foreground/50">{stat.label}</p>
                </div>
              )}
            </div>

            {/* Perks */}
            <div className="fade-up grid gap-x-8 gap-y-5 sm:grid-cols-2" style={{ transitionDelay: '300ms' }}>
              {perks.map((perk) =>
              <div key={perk.text} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/30 text-accent">
                    <Icon name={perk.icon as Parameters<typeof Icon>[0]['name']} size={16} />
                  </div>
                  <p className="pt-1.5 text-sm leading-snug text-primary-foreground/75">{perk.text}</p>
                </div>
              )}
            </div>

            <div className="fade-up" style={{ transitionDelay: '400ms' }}>
              <button type="button" onClick={() => scrollTo('#availability')} className="btn-primary">
                Book a consultation
                <Icon name="ArrowRightIcon" size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>);

}