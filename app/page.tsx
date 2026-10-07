import React from 'react';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import HeroSection from './components/HeroSection';
import AvailabilitySection from './components/AvailabilitySection';
import ServicesSection from './components/ServicesSection';
import StylistsSection from './components/StylistsSection';
import GallerySection from './components/GallerySection';
import ReviewsSection from './components/ReviewsSection';
import ExperienceSection from './components/ExperienceSection';
import CtaSection from './components/CtaSection';

export default function LandingPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <HeroSection />
        <AvailabilitySection />
        <ServicesSection />
        <StylistsSection />
        <GallerySection />
        <ReviewsSection />
        <ExperienceSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}