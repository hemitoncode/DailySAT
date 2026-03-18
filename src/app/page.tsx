"use client";

import React from "react";
import Footer from "@/shared/components/Footer";
import FAQ from "@/features/landing/components/FAQ";
import Features from "@/features/landing/components/Features";
import FinalCTA from "@/features/landing/components/FinalCTA";
import Hero from "@/features/landing/components/Hero";
import Testimonials from "@/features/landing/components/Testimonials";
import Workshop from "@/features/landing/components/Workshop";
import Background from "@/features/landing/components/Background";

const LandingPage = () => {
  return (
    <div id="smooth-scrolling" className="font-figtree">
      <Background />
      <Hero />
      <div className="space-y-28 max-w-6xl mx-auto px-0.5 lg:px-0">
        <Features />
        <Testimonials />
        <Workshop />
        <FAQ />
        <FinalCTA />
      </div>

      <Footer />
    </div>
  );
};

export default LandingPage;
