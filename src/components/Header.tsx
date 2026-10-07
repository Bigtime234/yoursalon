'use client';

import React, { useState, useEffect } from 'react';
import AppImage from '@/src/components/ui/AppImage';
import Icon from '@/src/components/ui/AppIcon';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'Stylists', href: '#stylists' },
    { label: 'Availability', href: '#availability' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Visit', href: '#experience' },
  ];

  const handleNav = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          scrolled
            ? 'bg-background/95 backdrop-blur-md shadow-sm border-b border-border'
            : 'bg-transparent'
        }`}
      >
        <div className="container-salon">
          <div className="flex items-center justify-between h-18">
            {/* Logo */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
              aria-label="MySalon — scroll to top"
            >
              {/* Logo image: public/hero5.png (change the extension below if yours differs) */}
              <span className="relative block w-9 h-9 shrink-0 overflow-hidden rounded-full">
                <AppImage
                  src="/hero5.png"
                  alt=""
                  fill
                  priority
                  className="object-cover"
                  sizes="36px"
                />
              </span>
              <span
                className={`font-display font-semibold text-xl tracking-tight transition-colors duration-300 ${
                  scrolled ? 'text-foreground' : 'text-primary-foreground'
                }`}
              >
                MySalon
              </span>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNav(link.href)}
                  className={`nav-link focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded ${
                    scrolled ? 'nav-link-dark' : 'nav-link'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right */}
            <div className="hidden lg:flex items-center gap-5">
              <a
                href="tel:+442079460123"
                className={`label-sm transition-colors duration-300 ${
                  scrolled ? 'text-muted-foreground hover:text-foreground' : 'text-primary-foreground/70 hover:text-primary-foreground'
                }`}
              >
                +44 20 7946 0123
              </a>
              <button
                onClick={() => handleNav('#availability')}
                className="btn-primary text-xs"
              >
                Book Now
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className={`lg:hidden p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors ${
                scrolled ? 'text-foreground' : 'text-primary-foreground'
              }`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <Icon name={menuOpen ? 'XMarkIcon' : 'Bars3Icon'} size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-400 lg:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ backdropFilter: menuOpen ? 'blur(16px)' : 'none', background: menuOpen ? 'rgba(20,20,20,0.92)' : 'transparent' }}
        aria-hidden={!menuOpen}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link, i) => (
            <button
              key={link.label}
              onClick={() => handleNav(link.href)}
              className="font-display text-3xl font-light italic text-primary-foreground hover:text-accent transition-colors duration-200"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {link.label}
            </button>
          ))}
          <div className="mt-4 flex flex-col items-center gap-4">
            <a href="tel:+442079460123" className="label-sm text-primary-foreground/60">
              +44 20 7946 0123
            </a>
            <button
              onClick={() => handleNav('#availability')}
              className="btn-primary"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}