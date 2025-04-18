import React, { useRef, useCallback, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import confetti from 'canvas-confetti';
import Header from "@/components/landing/Header";
import Features from "@/components/landing/Features";
import ChallengeContent from "@/components/landing/ChallengeContent";
import WhatToExpect from "@/components/landing/WhatToExpect";
import Footer from "@/components/landing/Footer";
import SignupSection from "@/components/landing/SignupSection";

interface LandingPageProps {
  calendlyUrl?: string;
}

const LandingPage: React.FC<LandingPageProps> = ({
  calendlyUrl = "https://calendly.com/mykey-pocket/connection-call"
}) => {
  const formRef = useRef<HTMLDivElement>(null);
  const lastConfettiTime = useRef(0);
  const [isScrolling, setIsScrolling] = useState(false);

  // Smooth scroll indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Inclusive celebration color palettes
  const colors = {
    pride: ['#FF0018', '#FFA52C', '#FFFF41', '#008018', '#0000F9', '#86007D'],
    trans: ['#55CDFC', '#F7A8B8', '#FFFFFF', '#F7A8B8', '#55CDFC'],
    bipoc: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'],
    brand: ['#FEF9C3', '#FDE68A', '#FCD34D', '#FBBF24', '#FBA4B4', '#FDA4AF']
  };

  const scrollToForm = () => {
    if (!formRef.current) return;
    
    setIsScrolling(true);

    // Create swishy path effect
    const start = window.scrollY;
    const end = formRef.current.offsetTop;
    const distance = end - start;
    
    // Animate scroll with easing
    const duration = 1000; // 1 second
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Custom easing function for swishy effect
      const easeOutBack = (x: number): number => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
      };
      
      const easedProgress = easeOutBack(progress);
      window.scrollTo(0, start + distance * easedProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsScrolling(false);
        // Celebration confetti at the end of scroll
        const rect = formRef.current?.getBoundingClientRect();
        if (rect) {
          const x = (rect.left + rect.width / 2) / window.innerWidth;
          const y = (rect.top + rect.height / 2) / window.innerHeight;
          
          confetti({
            particleCount: 30,
            spread: 60,
            origin: { x, y },
            colors: colors.pride,
            ticks: 150,
            gravity: 0.3,
            scalar: 1,
            shapes: ['star'],
            drift: 0.5
          });
        }
      }
    };
    
    requestAnimationFrame(animate);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F5] font-nunito px-4 py-12 md:py-16 relative">
      {/* Smooth scroll progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-200 to-pink-300 origin-left z-50"
        style={{ scaleX }}
      />
      
      {/* Floating scroll indicators */}
      {isScrolling && (
        <>
          <motion.div
            className="fixed left-4 top-1/2 w-12 h-12 pointer-events-none"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <span role="img" aria-label="Sparkles" className="text-3xl">✨</span>
          </motion.div>
          <motion.div
            className="fixed right-4 top-1/2 w-12 h-12 pointer-events-none"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            <span role="img" aria-label="Sparkles" className="text-3xl">✨</span>
          </motion.div>
        </>
      )}

      <main className="container max-w-4xl mx-auto" role="main">
        <Header scrollToForm={scrollToForm} />
        <Features />
        <SignupSection formRef={formRef} />
        <ChallengeContent />
        <WhatToExpect />
        <div className="text-center">
          <button 
            onClick={scrollToForm}
            className="gradient-button"
            aria-label="Go to challenge signup form"
          >
            Join the Challenge →
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
