"use client";
import React, { useEffect, useRef, useState } from 'react';
import AppImage from '@/src/components/ui/AppImage';
import Icon from '@/src/components/ui/AppIcon';

const timeSlots = [
  { time: '10:00 AM', available: true },
  { time: '12:30 PM', available: true },
  { time: '2:00 PM', available: false },
  { time: '4:30 PM', available: true, highlighted: true },
];

const delay = (s: number) => ({ '--d': `${s}s` } as React.CSSProperties);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const reelRef = useRef<HTMLVideoElement>(null);
  const ambientRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const videos = [reelRef.current, ambientRef.current].filter(Boolean) as HTMLVideoElement[];

    // Reduced motion: show the poster frame only, no parallax / tilt
    if (reduce) {
      videos.forEach((v) => v.pause());
      return;
    }

    // Only play while the hero is on screen (saves battery + bandwidth)
    const io = new IntersectionObserver(
      ([entry]) => {
        videos.forEach((v) => {
          if (entry.isIntersecting) v.play().catch(() => {});
          else v.pause();
        });
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) io.observe(sectionRef.current);

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (scrollRef.current && window.scrollY < window.innerHeight * 1.2) {
          scrollRef.current.style.transform = `translate3d(0, ${window.scrollY * 0.28}px, 0)`;
        }
        ticking = false;
      });
    };

    let moving = false;
    const onMove = (e: MouseEvent) => {
      if (moving) return;
      moving = true;
      requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (el) {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width; // 0..1
          const y = (e.clientY - r.top) / r.height; // 0..1
          // 3D tilt on the reel frame
          if (tiltRef.current) {
            tiltRef.current.style.transform =
              `rotateY(${(x - 0.5) * 10}deg) rotateX(${(0.5 - y) * 8}deg)`;
          }
          if (spotRef.current) {
            spotRef.current.style.setProperty('--mx', `${x * 100}%`);
            spotRef.current.style.setProperty('--my', `${y * 100}%`);
          }
        }
        moving = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  const onTimeUpdate = () => {
    const v = reelRef.current;
    if (v && progressRef.current && v.duration) {
      progressRef.current.style.transform = `scaleX(${v.currentTime / v.duration})`;
    }
  };

  const toggleSound = () => {
    const v = reelRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-svh flex flex-col overflow-hidden bg-black"
      aria-label="Hero section"
    >
      {/* Cinema bars that open on load */}
      <div className="letterbox top-0" aria-hidden="true" />
      <div className="letterbox bottom-0" aria-hidden="true" />

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* scroll parallax layer */}
        <div
          ref={scrollRef}
          className="absolute inset-0 will-change-transform"
          style={{ top: '-10%', bottom: '-10%' }}
        >
          {/* Still image: loads instantly, sits under the ambient video */}
          <AppImage
            src="/hero5.png"
            alt=""
            fill
            priority
            className="object-cover opacity-60"
            sizes="100vw"
          />
          {/* Ambient glow: the same reel, scaled up and heavily blurred.
              Fills the wide screen without cropping the real video. */}
          <video
            ref={ambientRef}
            className="reel-ambient absolute inset-0 w-full h-full object-cover hidden md:block"
            src="/hero2.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            tabIndex={-1}
          />
        </div>

        {/* Colour grade: warm highlights, cool shadows */}
        <div className="absolute inset-0 bg-linear-to-br from-amber-500/20 via-transparent to-sky-900/30 mix-blend-soft-light" />
        {/* Left scrim for text legibility */}
        <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/45 to-transparent" />
        {/* Bottom fade into the trust strip */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/30" />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 60% 50%, transparent 40%, rgba(0,0,0,0.65) 100%)' }}
        />
        {/* Cursor spotlight */}
        <div ref={spotRef} className="hero-spotlight" />
        {/* Film grain */}
        <div className="film-grain" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex-1 flex items-center">
          <div className="container-salon w-full pt-32 pb-16">
            <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
              {/* Copy */}
              <div className="max-w-3xl">
                {/* Eyebrow */}
                <div className="flex items-center gap-3 mb-8 cine-reveal" style={delay(1.4)}>
                  <div className="w-10 h-px bg-accent" />
                  <span className="label-sm text-accent tracking-[0.3em] uppercase">
                    Mayfair, London — Est. 2011
                  </span>
                </div>

                {/* Headline */}
                <h1 className="text-hero-split font-display text-primary-foreground mb-6 leading-none tracking-tight">
                  <span className="cine-reveal inline-block" style={delay(1.7)}>Hair,</span>{' '}
                  <em className="cine-reveal inline-block font-light shimmer-text pr-2" style={delay(2.2)}>
                    considered.
                  </em>
                </h1>

                {/* Sub-headline */}
                <p
                  className="text-lg md:text-xl text-primary-foreground/80 font-light leading-relaxed max-w-xl mb-10 cine-reveal"
                  style={delay(2.7)}
                >
                  Award-winning colour and cutting in the heart of Mayfair.
                  Appointments from <span className="text-primary-foreground font-semibold">£75</span>.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 cine-reveal" style={delay(3.1)}>
                  <button onClick={() => scrollTo('#availability')} className="btn-primary">
                    Book Your Appointment
                    <Icon name="ArrowRightIcon" size={16} />
                  </button>
                  <button onClick={() => scrollTo('#services')} className="btn-outline">
                    View Services
                  </button>
                </div>
              </div>

              {/* Reel */}
              <div className="reel-stage justify-self-center">
                {/* warm glow behind the frame */}
                <div className="reel-glow" aria-hidden="true" />

                <div ref={tiltRef} className="reel-tilt">
                  <div className="reel-frame reel-reveal reel-shine">
                    <video
                      ref={reelRef}
                      className="reel-video absolute inset-0 w-full h-full object-cover"
                      src="/hero2.mp4"
                      poster="/hero5.png"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      onTimeUpdate={onTimeUpdate}
                      aria-label="Showreel of recent colour work at the salon"
                    />

                    {/* Inner grade + edge darkening */}
                    <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-black/55 via-transparent to-black/25" />

                    {/* Sound toggle */}
                    <button
                      type="button"
                      onClick={toggleSound}
                      aria-pressed={!muted}
                      aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
                      className="reel-sound"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        {muted ? (
                          <>
                            <line x1="23" y1="9" x2="17" y2="15" />
                            <line x1="17" y1="9" x2="23" y2="15" />
                          </>
                        ) : (
                          <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />
                        )}
                      </svg>
                    </button>

                    {/* Reel-style progress bar */}
                    <div className="reel-progress-track" aria-hidden="true">
                      <div ref={progressRef} className="reel-progress" />
                    </div>
                  </div>
                </div>

                {/* Floating caption chip */}
                <div className="reel-chip hidden sm:block cine-reveal" style={delay(3.4)}>
                  <div className="animate-float">
                    <div className="glass-dark rounded-xl px-4 py-3">
                      <p className="text-xs text-primary-foreground/60 mb-0.5">Now showing</p>
                      <p className="text-sm font-medium text-primary-foreground">
                        Soft balayage by Sophie Clarke
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Availability card */}
        <div className="container-salon pb-24 md:pb-16">
          <div className="max-w-md cine-reveal" style={delay(3.5)}>
            <div className="animate-float">
              <div className="glass-dark rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-2.5 h-2.5">
                      <div className="pulsing-dot absolute inset-0 rounded-full bg-green-500" />
                      <div className="relative w-2.5 h-2.5 rounded-full bg-green-500" />
                    </div>
                    <span className="label-sm text-green-400">Booking Now</span>
                  </div>
                  <span className="text-xs text-primary-foreground/70">Today</span>
                </div>

                <p className="text-sm font-semibold text-primary-foreground mb-1">
                  Next available: Today, 4:30 PM
                </p>
                <p className="text-xs text-primary-foreground/70 mb-4">
                  with Sophie Clarke — Colour Specialist
                </p>

                <div className="flex flex-wrap gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      aria-disabled={!slot.available}
                      onClick={() => slot.available && scrollTo('#availability')}
                      className={`slot-pill ${
                        slot.highlighted
                          ? 'selected'
                          : slot.available
                          ? 'text-primary-foreground/80 hover:text-primary-foreground'
                          : 'booked text-primary-foreground/40 cursor-not-allowed'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div className="bg-black/50 backdrop-blur-sm border-t border-white/10">
          <div className="container-salon py-5">
            <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-8">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Icon key={i} name="StarIcon" size={14} variant="solid" />
                  ))}
                </div>
                <span className="text-sm text-primary-foreground/80 font-medium">
                  4.9 from 1,200+ Google reviews
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Icon name="CalendarDaysIcon" size={14} className="text-accent" />
                <span className="text-sm text-primary-foreground/70">Est. 2011</span>
              </div>
              <div className="hidden md:flex items-center gap-3 text-sm text-primary-foreground/70 font-medium tracking-wide">
                <span>L&rsquo;Oréal Professionnel</span>
                <span className="text-white/20">·</span>
                <span>Kérastase</span>
                <span className="text-white/20">·</span>
                <span>Olaplex</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollTo('#availability')}
        className="absolute bottom-36 right-8 hidden xl:flex flex-col items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors z-10"
        aria-label="Scroll down"
      >
        <span className="label-sm" style={{ writingMode: 'vertical-rl' }}>Scroll</span>
        <Icon name="ArrowDownIcon" size={16} />
      </button>
    </section>
  );
}