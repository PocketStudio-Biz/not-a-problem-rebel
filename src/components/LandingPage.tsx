import React, { useRef, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import MailerLiteForm from "@/components/MailerLiteForm";
import confetti from 'canvas-confetti';
import { motion, useScroll, useSpring } from "framer-motion";

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

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now()
    if (now - lastConfettiTime.current < 1700) return
    
    lastConfettiTime.current = now
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (rect.left + rect.width / 2) / window.innerWidth
    const y = (rect.top + rect.height / 2) / window.innerHeight

    // Pride flag celebration
    confetti({
      particleCount: 60,
      spread: 100,
      origin: { x, y },
      colors: colors.pride,
      ticks: 200,
      gravity: 0.4,
      scalar: 1.2,
      shapes: ['star', 'circle'],
      drift: 1
    });

    // Trans flag celebration
    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 80,
        origin: { x: x - 0.1, y },
        colors: colors.trans,
        ticks: 180,
        gravity: 0.3,
        scalar: 1.1,
        shapes: ['circle'],
        drift: 0.5
      });
    }, 100);

    // BIPOC celebration
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 120,
        origin: { x: x + 0.1, y },
        colors: colors.bipoc,
        ticks: 220,
        gravity: 0.2,
        scalar: 1.3,
        shapes: ['star'],
        drift: 1.5
      });
    }, 200);
  }, [])

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
        {/* Header */}
        <header className="text-center mb-12" role="banner">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900">
            You were never broken.
          </h1>
          <p className="text-xl text-gray-800">
            Join 5 days of unmasking, tiny actions, and being heard.
          </p>
          <button 
            onClick={scrollToForm}
            className="mt-8 bg-gradient-to-r from-yellow-200 to-pink-300 text-gray-900 font-bold py-3 px-8 rounded-full hover:opacity-90 transition-opacity"
            aria-label="Go to challenge signup form"
          >
            Join the Challenge →
          </button>
        </header>

        {/* Subtitle */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">I'm Not a Problem to Solve</h2>
          <p className="text-gray-800 max-w-2xl mx-auto">
            A free 5-day email challenge for neurodivergent rebels who 
            are done masking and ready to feel heard. No fixing. No 
            PDFs. No webinars. Just realness in your inbox.
          </p>
        </div>

        {/* Core Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16" role="list">
          <div className="bg-white rounded-xl p-6 shadow-sm" role="listitem">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
              <span className="text-2xl" role="img" aria-label="Envelope">💌</span>
            </div>
            <h3 className="font-bold text-xl mb-2">Daily Voice Memos</h3>
            <p className="text-gray-800">
              Authentic, unfiltered conversation from one ND human to another
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm" role="listitem">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
              <span className="text-2xl" role="img" aria-label="Writing hand">✍️</span>
            </div>
            <h3 className="font-bold text-xl mb-2">Journal Prompts</h3>
            <p className="text-gray-800">
              Reflection without the pressure to 'get it right'
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm" role="listitem">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
              <span className="text-2xl" role="img" aria-label="Brain">🧠</span>
            </div>
            <h3 className="font-bold text-xl mb-2">Unmasking Actions</h3>
            <p className="text-gray-800">
              Tiny, doable steps to reclaim your authentic self
            </p>
          </div>
        </div>

        {/* Sign Up Form and Image */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-24" ref={formRef}>
          <div>
            <MailerLiteForm />
          </div>
          <div className="relative aspect-square">
            <div 
              className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-pink-300 rounded-full p-4 transition-transform hover:scale-[1.02] duration-300"
              onMouseEnter={handleMouseEnter}
            >
              <div className="relative w-full h-full rounded-full overflow-hidden bg-white">
                <img 
                  src="https://qsevudeuwedgofdwemsc.supabase.co/storage/v1/object/public/images/not-a-problem.png" 
                  alt="I'm Not a Problem to Solve sweatshirt" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* What's Inside Section */}
        <section className="mb-24" aria-labelledby="whats-inside-heading">
          <h2 id="whats-inside-heading" className="text-3xl font-bold text-center mb-12">What's Inside</h2>
          <div className="grid md:grid-cols-3 gap-8" role="list">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm" role="listitem">
              <div className="w-12 h-12 mx-auto mb-4" aria-hidden="true">
                <span role="img" aria-label="Mailbox">📬</span>
              </div>
              <h3 className="font-bold text-xl mb-3">Daily Voice Memos</h3>
              <p className="text-gray-800">
                Raw, unfiltered, and real conversations about unmasking and 
                embracing your neurodivergence.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-sm" role="listitem">
              <div className="w-12 h-12 mx-auto mb-4" aria-hidden="true">
                <span role="img" aria-label="Brain">🧠</span>
              </div>
              <h3 className="font-bold text-xl mb-3">Journal Prompts</h3>
              <p className="text-gray-800">
                Deep, reflective questions that help you reconnect with yourself 
                and honor your unique mind.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-sm" role="listitem">
              <div className="w-12 h-12 mx-auto mb-4" aria-hidden="true">
                <span role="img" aria-label="Lightning bolt">⚡</span>
              </div>
              <h3 className="font-bold text-xl mb-3">Tiny Actions</h3>
              <p className="text-gray-800">
                Simple, doable steps to practice unmasking in your everyday life, 
                at your own pace.
              </p>
            </div>
          </div>
        </section>

        {/* Additional Features Section */}
        <section className="mb-24" aria-label="Additional features">
          <div className="grid md:grid-cols-2 gap-8" role="list">
            <div className="bg-white rounded-xl p-6 shadow-sm" role="listitem">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
                <span className="text-2xl" role="img" aria-label="Lightning bolt">⚡</span>
              </div>
              <h3 className="font-bold text-xl mb-2">Real Connection</h3>
              <p className="text-gray-800">
                A space where you're truly heard, not fixed or analyzed
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm" role="listitem">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
                <span className="text-2xl" role="img" aria-label="Sparkles">✨</span>
              </div>
              <h3 className="font-bold text-xl mb-2">Optional Coaching</h3>
              <p className="text-gray-800">
                A gentle invitation to go deeper on Day 5 (no pressure)
              </p>
            </div>
          </div>
        </section>

        {/* What to Expect Section */}
        <section className="mb-24" aria-labelledby="what-to-expect-heading">
          <h2 id="what-to-expect-heading" className="text-3xl font-bold text-center mb-12">What to Expect</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="font-bold text-xl mb-3">Who is this for?</h3>
              <p className="text-gray-800">
                Neurodivergent souls who are tired of being told they're a 
                problem to fix. People who want to shed their masks and live 
                authentically. Anyone seeking connection without performative 
                wellness culture.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="font-bold text-xl mb-3">How does it work?</h3>
              <p className="text-gray-800">
                For 5 days, you'll receive daily emails with voice memos, 
                journal prompts, and tiny unmasking actions. Everything is 
                optional - take what serves you and leave the rest. On day 5, 
                there's a soft invitation to a 1:1 session.
              </p>
            </div>
          </div>
        </section>

        <div className="text-center">
          <button 
            onClick={scrollToForm}
            className="bg-gradient-to-r from-yellow-200 to-pink-300 text-gray-900 font-bold py-3 px-8 rounded-full hover:opacity-90 transition-opacity"
            aria-label="Go to challenge signup form"
          >
            Join the Challenge →
          </button>
        </div>
      </main>

      <footer className="text-center mt-16 text-sm text-gray-700">
        © 2025 I'm Not a Problem to Solve
      </footer>
    </div>
  );
};

export default LandingPage;
