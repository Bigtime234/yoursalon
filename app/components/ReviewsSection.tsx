"use client"
import React, { useState, useEffect, useRef } from 'react';
import AppImage from '@/src/components/ui/AppImage';
import Icon from '@/src/components/ui/AppIcon';

const reviews = [
{
  id: 1,
  quote: "Best balayage I've had in London, and I've tried most of them. Sophie understood exactly what I wanted without me having to show three hundred Pinterest photos. The result was effortless.",
  author: 'Charlotte H.',
  location: 'Notting Hill, London',
  service: 'Balayage',
  rating: 5,
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1a2573a78-1772251097324.png",
  avatarAlt: 'Charlotte H., happy client from Notting Hill, smiling portrait'
},
{
  id: 2,
  quote: "I've been coming to MySalon for three years and I genuinely cannot imagine going anywhere else. James has transformed the way I think about my hair. The service is exceptional — proper luxury without being pretentious.",
  author: 'Rebecca T.',
  location: 'Chelsea, London',
  service: 'Cut & Colour',
  rating: 5,
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_15fef0d91-1772169331502.png",
  avatarAlt: 'Rebecca T., loyal MySalon client from Chelsea, professional portrait'
},
{
  id: 3,
  quote: "Amara is an absolute genius with curls. She's the first stylist who's actually listened to what my hair needs rather than what she thinks it should look like. I left feeling like myself, but better.",
  author: 'Ngozi A.',
  location: 'Brixton, London',
  service: 'Curl Treatment',
  rating: 5,
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_180fe9f40-1773112616218.png",
  avatarAlt: 'Ngozi A., delighted client from Brixton, warm smiling portrait'
},
{
  id: 4,
  quote: "Had my bridal hair done here and it was perfect. The private consultation suite made the whole experience feel incredibly special. Priya was calm, professional and absolutely nailed the brief.",
  author: 'Isabella M.',
  location: 'Kensington, London',
  service: 'Bridal Styling',
  rating: 5,
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1b800cd61-1772255848041.png",
  avatarAlt: 'Isabella M., bridal client from Kensington, elegant portrait'
}];


const platforms = [
{ name: 'Google', rating: '4.9', reviews: '1,200+' },
{ name: 'Fresha', rating: '5.0', reviews: '840+' },
{ name: 'Treatwell', rating: '4.8', reviews: '620+' }];


export default function ReviewsSection() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.fade-up').forEach((el, i) => {
              setTimeout(() => el.classList.add('in-view'), i * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const current = reviews[active];

  return (
    <section id="reviews" className="section-pad bg-background" ref={sectionRef}>
      <div className="container-salon">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left: Pull quote */}
          <div className="fade-up">
            <p className="label-sm text-accent mb-3">Client Reviews</p>
            <h2 className="text-display-md font-display text-foreground mb-12">
              Heard from<br />
              <em className="italic font-light">our clients.</em>
            </h2>

            {/* Featured review */}
            <div className="relative">
              <div className="absolute -top-4 -left-2 font-display text-8xl text-accent/20 leading-none select-none" aria-hidden="true">
                &ldquo;
              </div>
              <blockquote className="relative text-xl font-display font-light italic text-foreground leading-relaxed mb-8 pl-4">
                {current.quote}
              </blockquote>
              <div className="flex items-center gap-4 pl-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-border">
                  <AppImage
                    src={current.avatar}
                    alt={current.avatarAlt}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover" />
                  
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{current.author}</p>
                  <p className="text-xs text-muted-foreground">{current.location} · {current.service}</p>
                </div>
                <div className="flex ml-auto">
                  {[...Array(current.rating)].map((_, i) =>
                  <Icon key={i} name="StarIcon" size={14} variant="solid" className="text-amber-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Navigation dots */}
            <div className="flex items-center gap-2 mt-8 pl-4">
              {reviews.map((_, i) =>
              <button
                key={i}
                onClick={() => {
                  setActive(i);
                  if (intervalRef.current) clearInterval(intervalRef.current);
                }}
                className={`h-1 rounded-full transition-all duration-500 ${
                i === active ? 'w-8 bg-accent' : 'w-3 bg-border hover:bg-muted'}`
                }
                aria-label={`View review ${i + 1}`} />

              )}
            </div>
          </div>

          {/* Right: Platform badges + mini reviews */}
          <div className="space-y-6 fade-up" style={{ transitionDelay: '150ms' }}>
            {/* Platform ratings */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {platforms.map((p) =>
              <div key={p.name} className="text-center p-4 bg-secondary border border-border rounded-lg">
                  <div className="font-display text-3xl font-semibold text-foreground mb-1">{p.rating}</div>
                  <div className="flex justify-center mb-1">
                    {[...Array(5)].map((_, i) =>
                  <Icon key={i} name="StarIcon" size={10} variant="solid" className="text-amber-400" />
                  )}
                  </div>
                  <p className="label-sm text-muted-foreground">{p.name}</p>
                  <p className="text-xs text-muted mt-1">{p.reviews} reviews</p>
                </div>
              )}
            </div>

            {/* Review cards */}
            <div className="space-y-4">
              {reviews.slice(0, 3).map((r, i) =>
              <div
                key={r.id}
                className={`review-card cursor-pointer transition-all duration-300 ${active === i ? 'border-accent/40 shadow-md' : ''}`}
                onClick={() => {
                  setActive(i);
                  if (intervalRef.current) clearInterval(intervalRef.current);
                }}>
                
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
                      <AppImage
                      src={r.avatar}
                      alt={r.avatarAlt}
                      width={36}
                      height={36}
                      className="w-full h-full object-cover" />
                    
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-foreground">{r.author}</p>
                        <div className="flex">
                          {[...Array(r.rating)].map((_, j) =>
                        <Icon key={j} name="StarIcon" size={10} variant="solid" className="text-amber-400" />
                        )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{r.quote}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>);

}