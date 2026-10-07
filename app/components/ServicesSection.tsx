'use client';

import React, { useEffect, useRef } from 'react';
import AppImage from '@/src/components/ui/AppImage';
import Icon from '@/src/components/ui/AppIcon';

const services = [
{
  name: 'Cut & Finish',
  description: 'A precision cut tailored to your face shape and lifestyle, finished with a blowdry and style. Includes a complimentary consultation.',
  duration: '60 min',
  price: 'from £75',
  image: "/work1.png",
  imageAlt: 'A precision cut and finish by a MySalon stylist',
  span: 'md:col-span-1',
  tall: false
},
{
  name: 'Colour',
  description: 'From rich, dimensional tones to subtle sun-kissed highlights. Our colour specialists use Kérastase and L\'Oréal Professionnel exclusively.',
  duration: '90–120 min',
  price: 'from £95',
  image: "/work2.png",
  imageAlt: 'Hair colour work by a MySalon colour specialist',
  span: 'md:col-span-1',
  tall: false
},
{
  name: 'Balayage',
  description: 'Our signature hand-painted balayage creates natural, lived-in colour that grows out beautifully. The most requested service at MySalon.',
  duration: '2.5–3 hrs',
  price: 'from £180',
  image: "/work3.png",
  imageAlt: 'Hand-painted balayage result from MySalon',
  span: 'md:col-span-2',
  tall: false
},
{
  name: 'Keratin Smoothing',
  description: 'A professional Olaplex-backed smoothing treatment that eliminates frizz and restores shine for up to 4 months.',
  duration: '2–3 hrs',
  price: 'from £220',
  image: "/work4.png",
  imageAlt: 'Smooth, glossy hair after a keratin smoothing treatment',
  span: 'md:col-span-1',
  tall: false
},
{
  name: 'Bridal',
  description: 'A bespoke bridal package including trial, wedding day styling, and a dedicated stylist. Complimentary champagne and a private suite.',
  duration: 'Bespoke',
  price: 'from £250',
  image: "/work5.png",
  imageAlt: 'Bridal hair styled by MySalon',
  span: 'md:col-span-2',
  tall: false
}];


export default function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

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
      { threshold: 0.05 }
    );
    if (sectionRef?.current) observer?.observe(sectionRef?.current);
    return () => observer?.disconnect();
  }, []);

  return (
    <section id="services" className="section-pad bg-background" ref={sectionRef}>
      <div className="container-salon">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 fade-up">
          <div>
            <p className="label-sm text-accent mb-3">Our Expertise</p>
            <h2 className="text-display-md font-display text-foreground">
              Services &amp; Pricing
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            All prices include VAT. A complimentary drinks service and private consultation are included with every appointment.
          </p>
        </div>

        {/* Layout (grid-cols-3):
           Row 1: [Cut&Finish] [Colour] [Keratin]
           Row 2: [Balayage cs-2] [Bridal cs-1]
           5/5 cards placed */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Cut & Finish */}
          <div className="service-card fade-up" style={{ transitionDelay: '0ms' }}>
            <div className="h-52 overflow-hidden">
              <AppImage
                src={services?.[0]?.image}
                alt={services?.[0]?.imageAlt}
                width={400}
                height={208}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-display text-xl font-semibold text-foreground">{services?.[0]?.name}</h3>
                <span className="label-sm text-accent mt-1">{services?.[0]?.price}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{services?.[0]?.description}</p>
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Icon name="ClockIcon" size={12} />
                <span>{services?.[0]?.duration}</span>
              </div>
            </div>
          </div>

          {/* Colour */}
          <div className="service-card fade-up" style={{ transitionDelay: '100ms' }}>
            <div className="h-52 overflow-hidden">
              <AppImage
                src={services?.[1]?.image}
                alt={services?.[1]?.imageAlt}
                width={400}
                height={208}
                className="w-full h-full object-cover transition-transform duration-700" />
              
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-display text-xl font-semibold text-foreground">{services?.[1]?.name}</h3>
                <span className="label-sm text-accent mt-1">{services?.[1]?.price}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{services?.[1]?.description}</p>
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Icon name="ClockIcon" size={12} />
                <span>{services?.[1]?.duration}</span>
              </div>
            </div>
          </div>

          {/* Keratin Smoothing */}
          <div className="service-card fade-up" style={{ transitionDelay: '200ms' }}>
            <div className="h-52 overflow-hidden">
              <AppImage
                src={services?.[3]?.image}
                alt={services?.[3]?.imageAlt}
                width={400}
                height={208}
                className="w-full h-full object-cover transition-transform duration-700" />
              
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-display text-xl font-semibold text-foreground">{services?.[3]?.name}</h3>
                <span className="label-sm text-accent mt-1">{services?.[3]?.price}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{services?.[3]?.description}</p>
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Icon name="ClockIcon" size={12} />
                <span>{services?.[3]?.duration}</span>
              </div>
            </div>
          </div>

          {/* Balayage — col-span-2 */}
          <div className="service-card md:col-span-2 fade-up" style={{ transitionDelay: '300ms' }}>
            <div className="md:flex">
              <div className="md:w-2/5 h-52 md:h-auto overflow-hidden shrink-0">
                <AppImage
                  src={services?.[2]?.image}
                  alt={services?.[2]?.imageAlt}
                  width={500}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-700" />
                
              </div>
              <div className="p-6 flex flex-col justify-center">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-display text-2xl font-semibold text-foreground">{services?.[2]?.name}</h3>
                  <span className="label-sm text-accent mt-1">{services?.[2]?.price}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{services?.[2]?.description}</p>
                <div className="flex items-center gap-1.5 text-xs text-muted mb-5">
                  <Icon name="ClockIcon" size={12} />
                  <span>{services?.[2]?.duration}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs text-accent font-semibold">
                  <Icon name="StarIcon" size={12} variant="solid" />
                  <span>Most requested service at MySalon</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bridal — col-span-1 */}
          <div className="service-card fade-up" style={{ transitionDelay: '400ms' }}>
            <div className="h-52 overflow-hidden relative">
              <AppImage
                src={services?.[4]?.image}
                alt={services?.[4]?.imageAlt}
                width={400}
                height={208}
                className="w-full h-full object-cover transition-transform duration-700" />
              
              <div className="absolute top-3 left-3">
                <span className="bg-accent text-white text-xs font-bold px-2.5 py-1 rounded">Bridal</span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-display text-xl font-semibold text-foreground">{services?.[4]?.name}</h3>
                <span className="label-sm text-accent mt-1">{services?.[4]?.price}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{services?.[4]?.description}</p>
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Icon name="ClockIcon" size={12} />
                <span>{services?.[4]?.duration}</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 fade-up">
          All prices include VAT. Prices may vary for longer hair. Please enquire at time of booking.
        </p>
      </div>
    </section>);

}