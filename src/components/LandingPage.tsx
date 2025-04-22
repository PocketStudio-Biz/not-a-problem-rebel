import React, { useRef, useCallback, useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import confetti from 'canvas-confetti';
import Header from "@/components/landing/Header";
import Features from "@/components/landing/Features";
import ChallengeContent from "@/components/landing/ChallengeContent";
import WhatToExpect from "@/components/landing/WhatToExpect";
import Footer from "@/components/landing/Footer";
import SignupSection from "@/components/landing/SignupSection";

interface LandingPageProps {
  // Removed unused prop
}

// Define confetti shape type
type ConfettiShape = 'square' | 'circle' | 'star';

const LandingPage: React.FC<LandingPageProps> = ({
  // Removed unused prop parameter
}) => {
  const formRef = useRef<HTMLDivElement>(null);
  const leftSparkleRef = useRef<HTMLDivElement>(null);
  const rightSparkleRef = useRef<HTMLDivElement>(null);
  const lastConfettiTime = useRef(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [hasShownConfetti, setHasShownConfetti] = useState(false);

  // Smooth scroll indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Pride flag color palettes - organized by vibrancy for better visual effect
  const colors = {
    rainbow: ['#FF1B8D', '#FF3F3F', '#FFD800', '#00B5FF', '#00D93B', '#8A2BE2'], // Vibrant rainbow
    trans: ['#55CDFC', '#F7A8B8', '#FFFFFF', '#F7A8B8', '#55CDFC'],
    bi: ['#D60270', '#9B4F96', '#0038A8'],
    pan: ['#FF1B8D', '#FFD800', '#00B5FF'],
    lesbian: ['#D62900', '#FF9B55', '#FFFFFF', '#D461A6', '#A50062'],
    nonbinary: ['#FCF434', '#FFFFFF', '#9C59D1', '#2C2C2C'],
    ace: ['#000000', '#A4A4A4', '#FFFFFF', '#800080'],
    genderqueer: ['#B57EDC', '#FFFFFF', '#4A8123'],
    poly: ['#F61CB9', '#07D569', '#1C92F6'],
    agender: ['#000000', '#BABBBA', '#FFFFFF', '#B8F483'],
    aero: ['#88C9E0', '#9BC9E5', '#FFFFFF', '#FF99BC', '#FF85B0'],
    fluid: ['#FF75A2', '#FFFFFF', '#BE18D6', '#000000', '#333EBD'],
    intersex: ['#FFDA00', '#7A00AC'],
    progress: ['#000000', '#784F17', '#E40303', '#FFA52C', '#FFFF00', '#008026', '#004DFF', '#750787', '#FFFFFF', '#FFAFC8', '#74D7EE'],
    demisexual: ['#FFFFFF', '#D3D3D3', '#810081', '#000000']
  };

  // Confetti configuration presets for different effects
  const confettiPresets = {
    burst: {
      particleCount: 300,
      spread: 180,
      origin: { y: 0.5 },
      gravity: 0.2,
      scalar: 1.8,
      startVelocity: 55,
      ticks: 400,
      shapes: ['star', 'circle'] as ConfettiShape[]
    },
    sparkle: {
      particleCount: 150,
      spread: 120,
      gravity: 0.15,
      scalar: 1.4,
      ticks: 300,
      startVelocity: 45,
      shapes: ['star'] as ConfettiShape[]
    },
    finale: {
      particleCount: 500,
      spread: 180,
      gravity: 0.2,
      scalar: 2.5,
      ticks: 500,
      startVelocity: 65,
      shapes: ['star', 'circle', 'square'] as ConfettiShape[]
    },
    side: {
      particleCount: 200,
      spread: 140,
      gravity: 0.15,
      scalar: 1.5,
      ticks: 350,
      startVelocity: 50,
      shapes: ['star'] as ConfettiShape[]
    }
  };

  // Fire confetti with preset and custom options
  const fireConfetti = (preset: keyof typeof confettiPresets, customOptions = {}) => {
    try {
      const presetConfig = confettiPresets[preset];
      confetti({
        ...presetConfig,
        ...customOptions,
        disableForReducedMotion: false
      });
    } catch (error) {
      console.error('Confetti error:', error);
    }
  };

  // Mix two color palettes for more vibrant effects
  const mixColors = (palette1: string[], palette2: string[]) => {
    const mixed = [...palette1, ...palette2];
    return mixed.filter((_, i) => i % 2 === 0);
  };

  // Get position of element relative to viewport
  const getElementPosition = (element: HTMLElement | null): { x: number; y: number } => {
    if (!element) return { x: 0.5, y: 0.5 };
    
    const rect = element.getBoundingClientRect();
    return {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight
    };
  };

  // Helper function to create a star point burst
  const createStarPoint = (centerX: number, centerY: number, angle: number, colors: string[]) => {
    const radius = 0.3; // Distance from center
    const x = centerX + radius * Math.cos(angle * Math.PI / 180);
    const y = centerY + radius * Math.sin(angle * Math.PI / 180);
    
    fireConfetti('sparkle', {
      origin: { x, y },
      colors,
      angle: angle,
      startVelocity: 90
    });
  };

  // Create a 5-point star burst pattern
  const createStarBurst = (centerX: number, centerY: number, colors: string[]) => {
    // Center burst
    fireConfetti('burst', {
      origin: { x: centerX, y: centerY },
      colors,
      startVelocity: 50
    });

    // Create 5 points of the star (72° apart)
    for (let i = 0; i < 5; i++) {
      const angle = i * 72; // 360° / 5 = 72° per point
      createStarPoint(centerX, centerY, angle, colors);
    }
  };

  // Main celebration sequence
  const celebrate = () => {
    try {
      confetti.reset();
      
      const form = formRef.current;
      const leftSparkle = document.querySelector('.left-sparkle') as HTMLElement;
      const rightSparkle = document.querySelector('.right-sparkle') as HTMLElement;
      
      // Initial 5-point star burst from form
      const formPos = getElementPosition(form);
      createStarBurst(formPos.x, formPos.y, mixColors(colors.rainbow, colors.bi));

      // Side star bursts
      setTimeout(() => {
        createStarBurst(0.2, 0.4, mixColors(colors.lesbian, colors.genderqueer));
        createStarBurst(0.8, 0.4, mixColors(colors.pan, colors.ace));
      }, 150);

      // Sparkle bursts from corners
      setTimeout(() => {
        // Top corners
        fireConfetti('sparkle', {
          origin: { x: 0.1, y: 0.2 },
          colors: colors.trans,
          angle: 45
        });
        fireConfetti('sparkle', {
          origin: { x: 0.9, y: 0.2 },
          colors: colors.nonbinary,
          angle: 135
        });
        // Bottom corners
        fireConfetti('sparkle', {
          origin: { x: 0.1, y: 0.8 },
          colors: colors.ace,
          angle: 315
        });
        fireConfetti('sparkle', {
          origin: { x: 0.9, y: 0.8 },
          colors: colors.poly,
          angle: 225
        });
      }, 300);

      // Left and right sparkle star bursts
      setTimeout(() => {
        const leftPos = getElementPosition(leftSparkle);
        const rightPos = getElementPosition(rightSparkle);
        createStarBurst(leftPos.x, leftPos.y, mixColors(colors.trans, colors.nonbinary));
        createStarBurst(rightPos.x, rightPos.y, mixColors(colors.pan, colors.lesbian));
      }, 450);

      // Center celebration with multiple star bursts
      setTimeout(() => {
        createStarBurst(0.5, 0.5, mixColors(colors.poly, colors.ace));
        setTimeout(() => {
          createStarBurst(0.3, 0.6, colors.poly);
          createStarBurst(0.7, 0.6, colors.ace);
        }, 100);
      }, 600);

      // Grand finale - Multiple star bursts in sequence
      setTimeout(() => {
        const allColors = Object.values(colors).flat();
        // Center mega burst
        fireConfetti('finale', {
          origin: { x: 0.5, y: 0.6 },
          colors: allColors,
          shapes: ['star', 'circle'],
          particleCount: 600
        });
        
        // Sequential star bursts around the screen
        const burstPoints = [
          { x: 0.2, y: 0.3 }, { x: 0.8, y: 0.3 },
          { x: 0.3, y: 0.5 }, { x: 0.7, y: 0.5 },
          { x: 0.2, y: 0.7 }, { x: 0.8, y: 0.7 }
        ];
        
        burstPoints.forEach((point, i) => {
          setTimeout(() => {
            createStarBurst(
              point.x,
              point.y,
              allColors.filter((_, idx) => idx % burstPoints.length === i)
            );
          }, i * 100);
        });
      }, 800);

    } catch (error) {
      console.error('Celebration error:', error);
    }
  };

  // Scroll and celebrate
  const scrollToForm = () => {
    if (!formRef.current) return;
    
    setIsScrolling(true);
    const start = window.scrollY;
    const end = formRef.current.offsetTop;
    const distance = end - start;
    
    const duration = 1000;
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
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
        setTimeout(celebrate, 50); // Slight delay to ensure DOM is ready
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
            ref={leftSparkleRef}
            className="fixed left-4 top-1/2 w-12 h-12 pointer-events-none left-sparkle"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <span role="img" aria-label="Sparkles" className="text-3xl">✨</span>
          </motion.div>
          <motion.div
            ref={rightSparkleRef}
            className="fixed right-4 top-1/2 w-12 h-12 pointer-events-none right-sparkle"
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
            onClick={() => {
              scrollToForm();
              // Additional direct trigger for reliability
              setTimeout(celebrate, 1100);
            }}
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
