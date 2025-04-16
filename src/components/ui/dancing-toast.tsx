import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cn } from "@/lib/utils";
import confetti from 'canvas-confetti';

interface DancingToastProps {
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Confetti burst patterns
const createConfettiStream = () => {
  const colors = {
    pride: ['#FF0018', '#FFA52C', '#FFFF41', '#008018', '#0000F9', '#86007D'],
    trans: ['#55CDFC', '#F7A8B8', '#FFFFFF'],
    bipoc: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD']
  };

  // Initial burst
  const burstConfetti = (x: number, y: number, colors: string[]) => {
    confetti({
      particleCount: 50, // More particles
      spread: 100,
      origin: { x, y },
      colors,
      ticks: 300, // Longer-lasting particles
      gravity: 0.5, // Lighter gravity
      scalar: 1.2,
      drift: 0.5,
      shapes: ['star', 'circle']
    });
  };

  // Create multiple burst points
  const createMultiBurst = () => {
    // Center burst
    burstConfetti(0.5, 0.5, colors.pride);
    
    // Side bursts with slight delay
    setTimeout(() => {
      burstConfetti(0.3, 0.5, colors.trans);
      burstConfetti(0.7, 0.5, colors.bipoc);
    }, 200);
  };

  // Initial celebration
  createMultiBurst();

  // Create a stream effect
  const streamInterval = setInterval(() => {
    const x = 0.5 + (Math.random() * 0.5 - 0.25); // Wider spread
    const y = 0.4 + (Math.random() * 0.2); // Varied height
    
    // Alternate between color schemes
    const colorSchemes = [colors.pride, colors.trans, colors.bipoc];
    const randomColors = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
    
    confetti({
      particleCount: 30,
      spread: 80,
      origin: { x, y },
      colors: randomColors,
      ticks: 200,
      gravity: 0.4,
      scalar: 1.1,
      drift: 0.8,
      shapes: ['star', 'circle']
    });
  }, 200); // More frequent bursts

  // Final celebration burst
  setTimeout(() => {
    createMultiBurst();
  }, 3000);

  // Stop the stream after 4 seconds
  setTimeout(() => {
    clearInterval(streamInterval);
  }, 4000);
};

export const DancingToast: React.FC<DancingToastProps> = ({
  title,
  description,
  open,
  onOpenChange
}) => {
  React.useEffect(() => {
    if (open) {
      createConfettiStream();
    }
  }, [open]);

  // Fun bounce animation for entrance
  const bounceAnimation = {
    initial: { 
      scale: 0.3, 
      opacity: 0, 
      y: 100,
      rotate: -10
    },
    animate: {
      scale: [0.3, 1.2, 0.9, 1],
      opacity: 1,
      y: [100, -20, 0],
      rotate: [-10, 10, -5, 0],
      transition: {
        duration: 0.8,
        ease: "easeOut",
        times: [0, 0.5, 0.8, 1]
      }
    },
    exit: { 
      scale: 0.5, 
      opacity: 0, 
      y: 100,
      rotate: 10,
      transition: {
        duration: 0.4,
        ease: "easeIn"
      }
    }
  };

  // Continuous floating animation
  const floatAnimation = {
    animate: {
      y: [0, -10, 0],
      rotate: [0, 3, -3, 0],
      scale: [1, 1.02, 0.98, 1],
      transition: {
        duration: 4,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  return (
    <ToastPrimitives.Provider swipeDirection="right">
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-4 right-4 z-[100]"
            {...bounceAnimation}
          >
            <motion.div
              {...floatAnimation}
              style={{
                transformOrigin: "center center",
              }}
            >
              <ToastPrimitives.Root
                open={open}
                onOpenChange={onOpenChange}
                className={cn(
                  "bg-gradient-to-r from-yellow-200 to-pink-300 border-none shadow-lg p-6 min-w-[300px] rounded-lg",
                  "data-[state=open]:animate-in",
                  "data-[state=closed]:animate-out",
                  "data-[swipe=end]:animate-out",
                  "data-[state=closed]:fade-out-80",
                  "data-[state=closed]:slide-out-to-right-full",
                  "data-[state=open]:slide-in-from-bottom-full"
                )}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    transition: { delay: 0.2 }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <motion.span 
                      role="img" 
                      aria-label="celebration" 
                      className="text-2xl"
                      animate={{
                        rotate: [0, 20, -20, 0],
                        scale: [1, 1.2, 1],
                        transition: {
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }
                      }}
                    >
                      🎉
                    </motion.span>
                    <div>
                      <motion.div 
                        className="font-bold text-gray-900 mb-1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ 
                          opacity: 1, 
                          x: 0,
                          transition: { delay: 0.3 }
                        }}
                      >
                        <ToastPrimitives.Title>{title}</ToastPrimitives.Title>
                      </motion.div>
                      <motion.div 
                        className="text-gray-800"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ 
                          opacity: 1, 
                          x: 0,
                          transition: { delay: 0.4 }
                        }}
                      >
                        <ToastPrimitives.Description>
                          {description}
                        </ToastPrimitives.Description>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </ToastPrimitives.Root>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ToastPrimitives.Viewport className="fixed bottom-0 right-0 z-[100] flex flex-col p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]" />
    </ToastPrimitives.Provider>
  );
}; 