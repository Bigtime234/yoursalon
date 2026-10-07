'use client';

import React, { useEffect, useRef, useState } from 'react';
import Icon from '@/src/components/ui/AppIcon';
import AppImage from '@/src/components/ui/AppImage';

type Slot = { time: string; status: 'available' | 'booked' };

const GOLD = '#c9a24b';
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const LONG = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const SLOTS: Record<string, Slot[]> = {
  Mon: [
    { time: '9:00 AM', status: 'booked' }, { time: '11:00 AM', status: 'booked' },
    { time: '1:00 PM', status: 'available' }, { time: '3:30 PM', status: 'available' },
    { time: '5:00 PM', status: 'booked' },
  ],
  Tue: [
    { time: '10:00 AM', status: 'booked' }, { time: '12:00 PM', status: 'available' },
    { time: '2:00 PM', status: 'booked' }, { time: '4:00 PM', status: 'available' },
    { time: '6:00 PM', status: 'booked' },
  ],
  Wed: [
    { time: '9:00 AM', status: 'available' }, { time: '11:30 AM', status: 'booked' },
    { time: '1:30 PM', status: 'booked' }, { time: '3:00 PM', status: 'available' },
    { time: '5:30 PM', status: 'booked' },
  ],
  Thu: [
    { time: '9:00 AM', status: 'booked' }, { time: '11:00 AM', status: 'available' },
    { time: '2:00 PM', status: 'available' }, { time: '4:00 PM', status: 'available' },
    { time: '6:00 PM', status: 'booked' },
  ],
  Fri: [
    { time: '10:00 AM', status: 'available' }, { time: '12:00 PM', status: 'booked' },
    { time: '2:30 PM', status: 'booked' }, { time: '4:00 PM', status: 'booked' },
    { time: '5:30 PM', status: 'available' },
  ],
  Sat: [
    { time: '9:00 AM', status: 'booked' }, { time: '11:00 AM', status: 'booked' },
    { time: '1:00 PM', status: 'booked' }, { time: '3:00 PM', status: 'available' },
    { time: '5:00 PM', status: 'available' },
  ],
};

const SERVICES = [
  { name: 'Cut & Finish', duration: 60, price: 75, icon: 'ScissorsIcon', blurb: 'Precision cut, blow-dry finish' },
  { name: 'Colour', duration: 90, price: 95, icon: 'SwatchIcon', blurb: 'Rich, dimensional all-over colour' },
  { name: 'Balayage', duration: 150, price: 180, icon: 'SparklesIcon', blurb: 'Hand-painted, sun-kissed lift' },
  { name: 'Treatments', duration: 45, price: 55, icon: 'BeakerIcon', blurb: 'Repair, gloss and scalp care' },
];

const STYLISTS = [
  { name: 'Sophie Clarke', role: 'Colour Specialist', img: '/stylist2.png' },
  { name: 'James Whitfield', role: 'Creative Director', img: '/stylist1.png' },
  { name: 'Priya Sharma', role: 'Senior Stylist', img: '/stylist3.png' },
  { name: 'Amara Osei', role: 'Curl Specialist', img: '/stylist4.png' },
];

const getWeek = (offset: number) =>
  LABELS.map((label, i) => {
    const d = new Date(Date.UTC(2026, 9, 12 + offset * 7 + i));
    return { label, long: LONG[i], date: d.getUTCDate(), month: MONTHS[d.getUTCMonth()], year: d.getUTCFullYear() };
  });

const TOTAL_LEFT = Object.values(SLOTS).flat().filter((s) => s.status === 'available').length;

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShown(true), { threshold: 0.1 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      {children}
    </div>
  );
}

const selectedCard = 'border-[#c9a24b] bg-[#c9a24b]/10 shadow-[0_0_40px_-12px_rgba(201,162,75,0.55)]';
const idleCard = 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]';

function StepTitle({ n, title, done }: { n: number; title: string; done: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
          done ? 'bg-[#c9a24b] text-black' : 'border border-white/25 text-white/60'
        }`}
      >
        {done ? <Icon name="CheckIcon" size={14} /> : n}
      </span>
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">{title}</h3>
    </div>
  );
}

export default function AvailabilitySection() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState('Thu');
  const [selectedService, setSelectedService] = useState('Balayage');
  const [selectedStylist, setSelectedStylist] = useState('Sophie Clarke');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [ref, setRef] = useState('');

  const week = getWeek(weekOffset);
  const day = week.find((d) => d.label === selectedDay)!;
  const slots = SLOTS[selectedDay] ?? [];
  const service = SERVICES.find((s) => s.name === selectedService)!;
  const stylist = STYLISTS.find((s) => s.name === selectedStylist)!;
  const deposit = Math.round(service.price * 0.2);
  const stepsDone = 2 + (selectedSlot ? 1 : 0);

  const pickDay = (label: string) => { setSelectedDay(label); setSelectedSlot(null); setStatus('idle'); };

  const confirm = () => {
    if (!selectedSlot || status !== 'idle') return;
    setStatus('loading');
    setTimeout(() => {
      setRef('SAL-' + Math.random().toString(36).slice(2, 7).toUpperCase());
      setStatus('done');
    }, 1400);
  };

  const reset = () => { setStatus('idle'); setSelectedSlot(null); };

  const renderSlots = (list: Slot[]) =>
    list.map((s) => {
      const booked = s.status === 'booked';
      const active = selectedSlot === s.time;
      return (
        <button
          key={s.time}
          disabled={booked}
          onClick={() => { setSelectedSlot(s.time); setStatus('idle'); }}
          aria-pressed={active}
          className={`rounded-xl border px-3 py-3 text-sm font-medium transition-all duration-200 ${
            booked
              ? 'cursor-not-allowed border-white/5 text-white/25 line-through'
              : active
              ? 'scale-[1.03] border-[#c9a24b] bg-[#c9a24b] text-black shadow-[0_8px_30px_-8px_rgba(201,162,75,0.8)]'
              : 'border-white/15 text-white/85 hover:-translate-y-0.5 hover:border-[#c9a24b]/70 hover:text-white'
          }`}
        >
          {s.time}
        </button>
      );
    });

  return (
    <section id="availability" className="relative overflow-hidden bg-[#0b0b0d] py-24 md:py-32 text-white">
      {/* ambient glow */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-[#c9a24b]/15 blur-[120px]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 h-[26rem] w-[26rem] rounded-full bg-sky-900/20 blur-[120px]" />

      <div className="container-salon relative">
        {/* Header */}
        <Reveal className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10" style={{ background: GOLD }} />
              <span className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: GOLD }}>
                Reserve your chair
              </span>
            </div>
            <h2 className="font-display text-4xl leading-[1.05] md:text-6xl">
              Your next appointment,
              <br />
              <em className="font-light italic" style={{ color: GOLD }}>beautifully arranged.</em>
            </h2>
          </div>
          <div className="flex items-center gap-2.5 self-start rounded-full border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur md:self-auto">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
            </span>
            <span className="text-xs font-semibold tracking-wide text-white/80">
              Only {TOTAL_LEFT} slots left this week
            </span>
          </div>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* LEFT: selections */}
          <div className="space-y-10 lg:col-span-3">
            {/* Step 1 */}
            <Reveal>
              <StepTitle n={1} title="Choose a service" done />
              <div className="grid gap-3 sm:grid-cols-2">
                {SERVICES.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => { setSelectedService(s.name); setStatus('idle'); }}
                    aria-pressed={selectedService === s.name}
                    className={`group rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-0.5 ${
                      selectedService === s.name ? selectedCard : idleCard
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                          selectedService === s.name ? 'bg-[#c9a24b] text-black' : 'bg-white/10 text-white/70 group-hover:text-white'
                        }`}
                      >
                        <Icon name={s.icon as any} size={18} />
                      </span>
                      <span className="font-display text-lg" style={{ color: selectedService === s.name ? GOLD : undefined }}>
                        £{s.price}
                      </span>
                    </div>
                    <p className="font-semibold">{s.name}</p>
                    <p className="mt-0.5 text-xs text-white/50">{s.blurb}</p>
                    <p className="mt-3 flex items-center gap-1.5 text-xs text-white/40">
                      <Icon name="ClockIcon" size={12} /> {s.duration} min
                    </p>
                  </button>
                ))}
              </div>
            </Reveal>

            {/* Step 2 */}
            <Reveal delay={80}>
              <StepTitle n={2} title="Choose your stylist" done />
              <div className="grid gap-3 sm:grid-cols-2">
                {STYLISTS.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => { setSelectedStylist(s.name); setStatus('idle'); }}
                    aria-pressed={selectedStylist === s.name}
                    className={`flex items-center gap-4 rounded-2xl border p-3.5 text-left transition-all duration-300 hover:-translate-y-0.5 ${
                      selectedStylist === s.name ? selectedCard : idleCard
                    }`}
                  >
                    <div
                      className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-offset-2 ring-offset-[#0b0b0d] transition-all ${
                        selectedStylist === s.name ? 'ring-[#c9a24b]' : 'ring-white/15'
                      }`}
                    >
                      <AppImage src={s.img} alt={`Portrait of ${s.name}, ${s.role}`} fill sizes="56px" className="object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold leading-tight">{s.name}</p>
                      <p className="mt-0.5 text-xs text-white/50">{s.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </Reveal>

            {/* Step 3 */}
            <Reveal delay={120}>
              <StepTitle n={3} title="Pick a date & time" done={!!selectedSlot} />
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur">
                <div className="border-b border-white/10 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-display text-xl">{MONTHS[week[0].month === week[5].month ? MONTHS.indexOf(week[0].month) : MONTHS.indexOf(week[0].month)]} {week[0].year}</h4>
                    <div className="flex gap-2">
                      <button
                        disabled={weekOffset === 0}
                        onClick={() => { setWeekOffset((w) => w - 1); setSelectedSlot(null); }}
                        className="rounded-full border border-white/15 p-2 transition hover:bg-white/10 disabled:opacity-30"
                        aria-label="Previous week"
                      >
                        <Icon name="ChevronLeftIcon" size={16} />
                      </button>
                      <button
                        disabled={weekOffset === 3}
                        onClick={() => { setWeekOffset((w) => w + 1); setSelectedSlot(null); }}
                        className="rounded-full border border-white/15 p-2 transition hover:bg-white/10 disabled:opacity-30"
                        aria-label="Next week"
                      >
                        <Icon name="ChevronRightIcon" size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {week.map((d) => (
                      <button
                        key={d.label}
                        onClick={() => pickDay(d.label)}
                        aria-pressed={selectedDay === d.label}
                        className={`flex flex-col items-center rounded-xl py-3 transition-all duration-300 ${
                          selectedDay === d.label
                            ? 'bg-[#c9a24b] text-black shadow-[0_10px_30px_-10px_rgba(201,162,75,0.8)] -translate-y-0.5'
                            : 'text-white/80 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">{d.label}</span>
                        <span className="font-display text-xl leading-none mt-1">{d.date}</span>
                        <span className="mt-0.5 text-[10px] opacity-60">{d.month}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-5">
                  <p className="mb-4 text-xs uppercase tracking-[0.2em] text-white/50">
                    {day.long}, {day.date} {day.month}
                  </p>
                  {slots.some((s) => s.time.endsWith('AM')) && (
                    <>
                      <p className="mb-2 text-xs text-white/35">Morning</p>
                      <div className="mb-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                        {renderSlots(slots.filter((s) => s.time.endsWith('AM')))}
                      </div>
                    </>
                  )}
                  <p className="mb-2 text-xs text-white/35">Afternoon & evening</p>
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                    {renderSlots(slots.filter((s) => s.time.endsWith('PM')))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* RIGHT: sticky summary */}
          <Reveal delay={160} className="lg:col-span-2">
            <div className="lg:sticky lg:top-28">
              <div className="relative overflow-hidden rounded-3xl border border-[#c9a24b]/30 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl">
                <div aria-hidden="true" className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#c9a24b]/20 blur-3xl" />

                {status === 'done' ? (
                  <div className="relative py-6 text-center">
                    <div className="av-pop mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#c9a24b]">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path className="av-check" d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                    </div>
                    <h3 className="font-display text-2xl">You&rsquo;re booked in</h3>
                    <p className="mt-2 text-sm text-white/60">
                      {service.name} with {stylist.name.split(' ')[0]}
                      <br />
                      {day.long} {day.date} {day.month}, {selectedSlot}
                    </p>
                    <p className="mt-5 inline-block rounded-full border border-white/15 px-4 py-1.5 font-mono text-xs tracking-widest text-[#c9a24b]">
                      {ref}
                    </p>
                    <button onClick={reset} className="mt-6 block w-full text-sm text-white/50 underline-offset-4 hover:text-white hover:underline">
                      Book another appointment
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="mb-5 flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: GOLD }}>Your booking</p>
                      <p className="text-xs text-white/40">{stepsDone}/3 complete</p>
                    </div>
                    <div className="mb-6 h-1 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${(stepsDone / 3) * 100}%`, background: `linear-gradient(90deg, #8a6a24, ${GOLD}, #f3d98b)` }}
                      />
                    </div>

                    <div className="space-y-4 text-sm">
                      <div className="flex items-start gap-3">
                        <Icon name="ScissorsIcon" size={16} className="mt-0.5 shrink-0 text-[#c9a24b]" />
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-xs text-white/50">with {stylist.name} · {service.duration} min</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Icon name="CalendarDaysIcon" size={16} className="mt-0.5 shrink-0 text-[#c9a24b]" />
                        <div>
                          <p className="font-medium">{day.long}, {day.date} {day.month}</p>
                          <p className="text-xs text-white/50">{selectedSlot ?? 'Select a time to continue'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="my-6 border-t border-dashed border-white/15" />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-white/60"><span>Service</span><span>£{service.price}</span></div>
                      <div className="flex justify-between text-white/60"><span>Deposit due today (20%)</span><span>£{deposit}</span></div>
                      <div className="flex items-baseline justify-between pt-2">
                        <span className="text-white/80">Total</span>
                        <span className="font-display text-3xl" style={{ color: GOLD }}>£{service.price}</span>
                      </div>
                    </div>

                    <button
                      onClick={confirm}
                      disabled={!selectedSlot || status === 'loading'}
                      className="av-btn mt-6 flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-bold text-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_40px_-10px_rgba(201,162,75,0.9)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                      style={{ background: `linear-gradient(135deg, #e2b45f, ${GOLD} 50%, #a8832f)` }}
                    >
                      {status === 'loading' ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                          Securing your chair…
                        </>
                      ) : (
                        <>
                          {selectedSlot ? 'Confirm booking' : 'Select a time'}
                          <Icon name="ArrowRightIcon" size={14} />
                        </>
                      )}
                    </button>
                    <p className="mt-3 text-center text-xs text-white/35">
                      Free cancellation with 24 hours&rsquo; notice
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}