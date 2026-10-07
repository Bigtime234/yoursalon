'use client';

import React, { useEffect, useRef, useState } from 'react';
import AppImage from '@/src/components/ui/AppImage';
import Icon from '@/src/components/ui/AppIcon';

const hours = [
{ day: 'Monday – Friday', time: '9:00 AM – 7:00 PM', dows: [1, 2, 3, 4, 5] },
{ day: 'Saturday', time: '9:00 AM – 6:00 PM', dows: [6] },
{ day: 'Sunday', time: 'Closed', dows: [0] }];


const socials = [
{ label: 'Instagram', href: 'https://instagram.com' },
{ label: 'TikTok', href: 'https://tiktok.com' },
{ label: 'Google', href: 'https://google.com' }];


const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/* [open, close] in 24h, or null when closed */
const hoursFor = (dow: number): [number, number] | null =>
dow === 0 ? null : dow === 6 ? [9, 18] : [9, 19];

/* Open/closed status in London time */
function getStatus() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const dow = SHORT_DAYS.indexOf(get('weekday'));
  const h = Number(get('hour')) + Number(get('minute')) / 60;
  const today = hoursFor(dow);

  if (today && h >= today[0] && h < today[1]) {
    const close = today[1] > 12 ? today[1] - 12 : today[1];
    return { open: true, dow, text: `Open now until ${close}:00 PM` };
  }
  if (today && h < today[0]) {
    return { open: false, dow, text: 'Closed. Opens today at 9:00 AM' };
  }
  let next = (dow + 1) % 7;
  if (next === 0) next = 1;
  const label = next === (dow + 1) % 7 ? 'tomorrow' : DAY_NAMES[next];
  return { open: false, dow, text: `Closed. Opens ${label} at 9:00 AM` };
}

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  // Static value during prerender; replaced with the real year after mount
  const [year, setYear] = useState(2026);
  const [status, setStatus] = useState<ReturnType<typeof getStatus> | null>(null);
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.fade-up').forEach((el, i) => {
              setTimeout(() => el.classList.add('in-view'), i * 90);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  // Live open / closed status (client-only to avoid hydration mismatch)
  useEffect(() => {
    setYear(new Date().getFullYear());
    setStatus(getStatus());
    const id = setInterval(() => setStatus(getStatus()), 60000);
    return () => clearInterval(id);
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // TODO: send `email` to your newsletter provider (Mailchimp, Resend, etc.)
    setJoined(true);
  };

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-neutral-950 text-primary-foreground/70">
      
      {/* Gold hairline across the top */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/60 to-transparent" aria-hidden="true" />

      {/* soft glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_50%_100%,rgba(201,162,75,0.10),transparent_70%)]"
        aria-hidden="true" />
      

      <div className="container-salon relative pt-20">
        {/* Main grid */}
        <div className="mb-16 grid grid-cols-1 gap-14 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:gap-12">
          {/* Brand */}
          <div className="fade-up">
            <div className="mb-6 flex items-center gap-3">
              <span className="relative block h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <AppImage src="/hero5.png" alt="" fill className="object-cover" sizes="40px" />
              </span>
              <span className="font-display text-2xl font-semibold tracking-tight text-primary-foreground">
                MySalon
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-primary-foreground/55">
              Award-winning colour and cutting in the heart of Mayfair, London. Appointments from £75.
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              {socials.map((s) =>
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`MySalon on ${s.label}`}
                className="rounded-full border border-white/15 px-4 py-1.5 text-xs text-primary-foreground/65 transition-colors duration-200 hover:border-accent hover:text-accent">
                
                  {s.label}
                </a>
              )}
            </div>
          </div>

          {/* Visit */}
          <div className="fade-up">
            <p className="label-sm mb-5 text-accent">Visit Us</p>
            <address className="not-italic text-sm leading-loose text-primary-foreground/70">
              24 Mount Street<br />
              Mayfair, London<br />
              W1K 2RB
            </address>
            <div className="mt-5 space-y-2 text-sm">
              <p className="flex items-center gap-2.5">
                <Icon name="PhoneIcon" size={14} className="text-accent" />
                <a href="tel:+442079460123" className="transition-colors hover:text-primary-foreground">
                  +44 20 7946 0123
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Icon name="EnvelopeIcon" size={14} className="text-accent" />
                <a href="mailto:hello@mysalon.co.uk" className="transition-colors hover:text-primary-foreground">
                  hello@mysalon.co.uk
                </a>
              </p>
            </div>
            <p className="mt-5 text-xs leading-relaxed text-primary-foreground/45">
              Nearest Tube: Green Park (5 min walk)<br />
              Parking: NCP on Grosvenor Square
            </p>
          </div>

          {/* Hours */}
          <div className="fade-up">
            <p className="label-sm mb-5 text-accent">Opening Hours</p>

            {/* Live status */}
            <div className="mb-5 min-h-[34px]">
              {status &&
              <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5">
                  <span className="relative block h-2 w-2">
                    {status.open && <span className="pulsing-dot absolute inset-0 rounded-full bg-green-500" />}
                    <span className={`relative block h-2 w-2 rounded-full ${status.open ? 'bg-green-500' : 'bg-primary-foreground/30'}`} />
                  </span>
                  <span className="text-xs text-primary-foreground/80">{status.text}</span>
                </div>
              }
            </div>

            <div className="space-y-2 text-sm">
              {hours.map((h) => {
                const isToday = status ? h.dows.includes(status.dow) : false;
                return (
                  <div
                    key={h.day}
                    className={`flex justify-between gap-4 border-b border-white/5 pb-2 ${
                    isToday ? 'text-primary-foreground' : 'text-primary-foreground/55'}`
                    }>
                    
                    <span>{h.day}</span>
                    <span className={h.time === 'Closed' ? 'text-primary-foreground/35' : ''}>{h.time}</span>
                  </div>);

              })}
            </div>
            <p className="pt-4 text-xs leading-relaxed text-primary-foreground/40">
              24 hours&rsquo; notice required for cancellations.
            </p>
          </div>

          {/* Newsletter */}
          <div className="fade-up">
            <p className="label-sm mb-5 text-accent">Stay in Touch</p>
            <p className="mb-6 text-sm leading-relaxed text-primary-foreground/55">
              Seasonal offers, style edits and first access to new appointments.
            </p>

            {joined ?
            <div className="flex items-center gap-3 rounded-lg border border-accent/30 bg-accent/10 px-4 py-3" role="status">
                <Icon name="SparklesIcon" size={16} className="text-accent" />
                <p className="text-sm text-primary-foreground/90">You&rsquo;re on the list. Thank you.</p>
              </div> :

            <form onSubmit={onSubmit} className="group flex items-center gap-2 border-b border-white/20 pb-2 transition-colors focus-within:border-accent">
                <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                aria-label="Email address for newsletter"
                className="min-w-0 flex-1 bg-transparent py-2 text-sm text-primary-foreground outline-none placeholder:text-primary-foreground/30" />
              
                <button
                type="submit"
                aria-label="Join the newsletter"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-black transition-transform duration-200 hover:scale-110">
                
                  <Icon name="ArrowRightIcon" size={16} />
                </button>
              </form>
            }
          </div>
        </div>

        {/* Bottom bar */}
        <div className="fade-up flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-primary-foreground/40">
            © {year} MySalon. Registered in England &amp; Wales. All prices include VAT.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-xs text-primary-foreground/50">
            <a href="#" className="transition-colors hover:text-primary-foreground">Privacy Policy</a>
            <a href="#" className="transition-colors hover:text-primary-foreground">Cancellation Policy</a>
            <a href="#" className="transition-colors hover:text-primary-foreground">Cookie Settings</a>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 transition-colors hover:text-accent"
              aria-label="Back to top">
              
              Back to top
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Giant wordmark, cropped by the bottom edge */}
        <div
          className="pointer-events-none -mb-[0.14em] mt-10 select-none overflow-hidden text-center font-display text-[clamp(4.5rem,21vw,18rem)] leading-[0.82] tracking-tighter text-transparent bg-linear-to-b from-white/[0.14] to-transparent bg-clip-text"
          aria-hidden="true">
          
          MySalon
        </div>
      </div>
    </footer>);

}