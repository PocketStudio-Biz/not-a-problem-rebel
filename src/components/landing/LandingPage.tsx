import React, { useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import confetti from 'canvas-confetti';
import Header from "./Header";
import Features from "./Features";
import ChallengeContent from "./ChallengeContent";
import WhatToExpect from "./WhatToExpect";
import Footer from "./Footer";
import SignupSection from "./SignupSection";

interface LandingPageProps {
  calendlyUrl?: string;
}

const LandingPage: React.FC<LandingPageProps> = ({
  calendlyUrl = "https://calendly.com/mykey-pocket/connection-call"
}) => {
  const formRef = useRef<HTMLDivElement>(null);
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
    rainbow: ['#FF1B8D', '#FF3F3F', '#FFD800', '#00B5FF', '#00D93B', '#8A2BE2'], // Vibrant rainbow
    bi: ['#D60270', '#9B4F96', '#0038A8'], // Bisexual flag
    pan: ['#FF1B8D', '#FFD800', '#00B5FF'], // Pansexual flag
    lesbian: ['#D62900', '#FF9B55', '#FFFFFF', '#D461A6', '#A50062'], // Lesbian flag
    nonbinary: ['#FCF434', '#FFFFFF', '#9C59D1', '#2C2C2C'], // Non-binary flag
    ace: ['#000000', '#A4A4A4', '#FFFFFF', '#800080'], // Asexual flag
    poly: ['#F61CB9', '#07D569', '#1C92F6'], // Polyamorous flag
    agender: ['#000000', '#BABBBA', '#FFFFFF', '#B8F483'], // Agender flag
    aero: ['#88C9E0', '#9BC9E5', '#FFFFFF', '#FF99BC', '#FF85B0'], // Aromantic flag
    demisexual: ['#FFFFFF', '#D3D3D3', '#810081', '#000000'] // Demisexual flag
  };

  const scrollToForm = () => {
    if (!formRef.current) return;
    
    setIsScrolling(true);

    // Create swishy path effect with multiple control points
    const start = window.scrollY;
    const end = formRef.current.offsetTop;
    const distance = end - start;
    const midPoint = start + distance * 0.5;
    const overshoot = distance * 0.2; // Add some overshoot for extra swish
    const controlPoint1 = midPoint - overshoot;
    const controlPoint2 = midPoint + overshoot;


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
          
          // Create a mega color array from all pride flags
          const allColors = Object.values(colors).flat();
          
          // Create a circular burst pattern
          const numPoints = 12; // Number of points in the circle
          const radius = 0.2; // Radius of the circle
          
          // Initial center burst
          confetti({
            particleCount: 200,
            spread: 360, // Full circle spread
            origin: { x, y },
            colors: allColors,
            ticks: 200,
            gravity: 0.2,
            scalar: 1.5,
            shapes: ['star', 'circle', 'square', 'triangle', 'polygon', 'line', 'rectangle', 'ellipse', 'text', 'image', 'custom'],
            drift: 0.5
          });
          
          // Create bursts in a circular pattern
          for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * 2 * Math.PI; // Convert to radians
            setTimeout(() => {
              // Calculate position on the circle
              const burstX = x + Math.cos(angle) * radius;
              const burstY = y + Math.sin(angle) * radius;
              
              // Get colors for this burst
              const colorKey = Object.keys(colors)[i % Object.keys(colors).length];
              const flagColors = colors[colorKey as keyof typeof colors];
              
              confetti({
                particleCount: 100,
                spread: 90, // Narrower spread for each point
                origin: { x: burstX, y: burstY },
                colors: flagColors,
                angle: (angle * 180 / Math.PI) + 90, // Convert to degrees and offset
                ticks: 150,
                gravity: 0.3,
                scalar: 1.2,
                shapes: ['star', 'circle', 'square', 'triangle', 'polygon', 'line', 'rectangle', 'ellipse', 'text', 'image', 'custom'],
                drift: 0.2
              });
            }, i * 100); // Stagger the bursts
          }
          
          // Final outward circular burst
          setTimeout(() => {
            confetti({
              particleCount: 250,
              spread: 360,
              origin: { x, y },
              colors: allColors,
              startVelocity: 45,
              ticks: 200,
              gravity: 0.2,
              scalar: 1.8,
              shapes: ['star', 'circle', 'triangle', 'polygon', 'line', 'rectangle', 'ellipse', 'text', 'image', 'custom' ],
              drift: 0.1
            });
          }, numPoints * 100 + 200);
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
      
      {/* Site title - simplified from navigation */}
      <div className="container max-w-4xl mx-auto mb-8 flex justify-center items-center">
        <div className="text-xl font-bold text-gray-900">Not A Problem</div>
      </div>
      
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
            className="fixed right-4 top-1/2 w-12 h-34 pointer-events-none"
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