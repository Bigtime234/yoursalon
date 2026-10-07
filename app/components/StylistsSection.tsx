'use client';

import React, { useEffect, useRef, useState } from 'react';
import AppImage from '@/src/components/ui/AppImage';
import Icon from '@/src/components/ui/AppIcon';

const stylists = [
{
  name: 'James Whitfield',
  title: 'Creative Director',
  years: '14 yrs',
  specialties: ['Precision Cuts', 'Editorial Styling', 'Texture & Movement'],
  quote: 'Great hair starts with understanding the person wearing it.',
  img: '/stylist1.png'
},
{
  name: 'Sophie Clarke',
  title: 'Colour Specialist',
  years: '9 yrs',
  specialties: ['Balayage', 'Lived-in Colour', 'Toning & Glossing'],
  quote: 'Colour should feel effortless — like you were born with it.',
  img: '/stylist2.png'
},
{
  name: 'Priya Sharma',
  title: 'Senior Stylist',
  years: '7 yrs',
  specialties: ['Blowouts', 'Keratin Treatments', 'Bridal'],
  quote: 'Every client deserves to leave feeling genuinely transformed.',
  img: '/stylist3.png'
},
{
  name: 'Amara Osei',
  title: 'Curl Specialist',
  years: '6 yrs',
  specialties: ['Curl Definition', 'Natural Hair', 'Protective Styles'],
  quote: 'Curls are not a challenge — they are a conversation.',
  img: '/stylist4.png'
}];


export default function StylistsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.fade-up').forEach((el, i) => {
              setTimeout(() => el.classList.add('in-view'), i * 120);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="stylists"
      ref={sectionRef}
      className="section-pad relative overflow-hidden bg-neutral-950">
      
      {/* soft gold light from the top-left */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_12%_0%,rgba(201,162,75,0.14),transparent_70%)]"
        aria-hidden="true" />
      

      <div className="container-salon relative">
        {/* Header */}
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="fade-up">
            <p className="label-sm mb-3 text-accent">The Team</p>
            <h2 className="text-display-md font-display text-primary-foreground">
              Meet your stylists.
            </h2>
          </div>
          <p
            className="fade-up max-w-xs text-sm text-primary-foreground/60"
            style={{ transitionDelay: '100ms' }}>
            
            12 specialists, each with a distinct creative voice. Matched to you by preference and expertise.
          </p>
        </div>

        {/* Expanding portrait panels (desktop) / stacked cards (mobile) */}
        <div
          className="fade-up grid grid-cols-1 gap-4 sm:grid-cols-2 lg:flex lg:h-[min(78svh,680px)] lg:gap-3"
          onMouseLeave={() => setActive(0)}>
          
          {stylists.map((s, i) => {
            const isActive = active === i;
            return (
              <article
                key={s.name}
                tabIndex={0}
                aria-label={`${s.name}, ${s.title}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`group relative aspect-[3/4] min-w-0 cursor-pointer overflow-hidden rounded-2xl border border-white/10 outline-none transition-[flex] duration-700 ease-[cubic-bezier(0.22,0.8,0.2,1)] focus-visible:ring-2 focus-visible:ring-accent motion-reduce:transition-none lg:aspect-auto ${
                isActive ? 'lg:flex-[3.6]' : 'lg:flex-1'}`
                }>
                
                {/* Portrait */}
                <AppImage
                  src={s.img}
                  alt={`${s.name}, ${s.title} at MySalon`}
                  fill
                  sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
                  className={`object-cover object-top transition-all duration-1000 ease-out motion-reduce:transition-none ${
                  isActive ?
                  'lg:scale-100 lg:brightness-100 lg:grayscale-0' :
                  'lg:scale-110 lg:brightness-50 lg:grayscale'}`
                  } />
                

                {/* Readability gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

                {/* Gold hairline that draws in on the active panel */}
                <div
                  className={`absolute inset-x-0 top-0 h-px origin-left bg-accent transition-transform duration-1000 ease-out motion-reduce:transition-none ${
                  isActive ? 'scale-x-100' : 'lg:scale-x-0'}`
                  } />
                

                {/* Experience pill */}
                <span
                  className={`absolute left-5 top-5 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs text-primary-foreground/90 backdrop-blur-md transition-opacity duration-500 ${
                  isActive ? 'opacity-100 lg:delay-300' : 'opacity-100 lg:opacity-0'}`
                  }>
                  
                  {s.years} experience
                </span>

                {/* Collapsed state (desktop): name set vertically */}
                <div
                  className={`pointer-events-none absolute bottom-7 left-1/2 hidden -translate-x-1/2 transition-opacity duration-500 lg:block ${
                  isActive ? 'opacity-0' : 'opacity-100 delay-300'}`
                  }
                  aria-hidden="true">
                  
                  <span className="font-display text-xl tracking-wide text-primary-foreground/90 [writing-mode:vertical-rl] rotate-180">
                    {s.name}
                  </span>
                </div>

                {/* Expanded content */}
                <div
                  className={`absolute inset-x-0 bottom-0 p-6 transition-all duration-700 motion-reduce:transition-none md:p-8 ${
                  isActive ?
                  'translate-y-0 opacity-100 lg:delay-200' :
                  'translate-y-0 opacity-100 lg:pointer-events-none lg:translate-y-6 lg:opacity-0'}`
                  }>
                  
                  <p className="label-sm mb-2 text-accent">{s.title}</p>
                  <h3 className="mb-4 font-display text-3xl font-light text-primary-foreground lg:text-4xl">
                    {s.name}
                  </h3>
                  <blockquote className="mb-5 max-w-md font-display text-base font-light italic leading-relaxed text-primary-foreground/80">
                    &ldquo;{s.quote}&rdquo;
                  </blockquote>
                  <div className="mb-6 flex flex-wrap gap-2">
                    {s.specialties.map((sp) =>
                    <span
                      key={sp}
                      className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-primary-foreground/85 backdrop-blur-sm">
                      
                        {sp}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollTo('#availability');
                    }}
                    className="btn-primary text-sm"
                    aria-label={`Book with ${s.name}`}>
                    
                    Book with {s.name.split(' ')[0]}
                    <Icon name="ArrowRightIcon" size={14} />
                  </button>
                </div>
              </article>);

          })}
        </div>

        {/* Matching nudge */}
        <div
          className="fade-up mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center"
          style={{ transitionDelay: '200ms' }}>
          
          <p className="max-w-md text-sm text-primary-foreground/60">
            Not sure who to book? Tell us what you want and we&rsquo;ll match you with the right stylist.
          </p>
          <button type="button" onClick={() => scrollTo('#availability')} className="btn-outline">
            See availability
          </button>
        </div>
      </div>
    </section>);

}