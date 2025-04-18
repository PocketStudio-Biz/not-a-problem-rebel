import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import confetti from 'canvas-confetti';
import { DancingToast } from "@/components/ui/dancing-toast";

// Inclusive celebration color palettes
const colors = {
  pride: ['#FF0018', '#FFA52C', '#FFFF41', '#008018', '#0000F9', '#86007D'],
  trans: ['#55CDFC', '#F7A8B8', '#FFFFFF', '#F7A8B8', '#55CDFC'],
  bipoc: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'],
  brand: ['#FEF9C3', '#FDE68A', '#FCD34D', '#FBBF24', '#FBA4B4', '#FDA4AF']
};

function createPrideBurst(originX = 0.5, originY = 0.7) {
  // Rainbow pride burst
  confetti({
    particleCount: 100,
    spread: 120,
    origin: { x: originX, y: originY },
    colors: colors.pride,
    ticks: 300,
    gravity: 0.5,
    scalar: 1.2,
    shapes: ['star', 'circle'],
    drift: 1
  });

  // Shimmering animals
  setTimeout(() => {
    confetti({
      particleCount: 40,
      spread: 80,
      origin: { x: originX, y: originY },
      colors: colors.pride,
      ticks: 250,
      gravity: 0.4,
      scalar: 1.1,
      shapes: ['star'],
      drift: 0.5
    });
  }, 100);
}

function createTransBurst(originX = 0.5, originY = 0.7) {
  // Trans flag colors burst
  confetti({
    particleCount: 80,
    spread: 100,
    origin: { x: originX, y: originY },
    colors: colors.trans,
    ticks: 280,
    gravity: 0.4,
    scalar: 1.3,
    shapes: ['circle', 'square'],
    drift: 0.8
  });

  // Gentle shimmer layer
  setTimeout(() => {
    confetti({
      particleCount: 50,
      spread: 90,
      origin: { x: originX, y: originY },
      colors: ['#FFFFFF', ...colors.trans],
      ticks: 260,
      gravity: 0.3,
      scalar: 1.2,
      shapes: ['circle'],
      drift: 1
    });
  }, 150);
}

function createBIPOCBurst(originX = 0.5, originY = 0.7) {
  // BIPOC celebration burst
  confetti({
    particleCount: 90,
    spread: 110,
    origin: { x: originX, y: originY },
    colors: colors.bipoc,
    ticks: 290,
    gravity: 0.45,
    scalar: 1.25,
    shapes: ['star', 'circle'],
    drift: 0.9
  });

  // Cultural celebration layer
  setTimeout(() => {
    confetti({
      particleCount: 60,
      spread: 100,
      origin: { x: originX, y: originY },
      colors: colors.bipoc,
      ticks: 270,
      gravity: 0.35,
      scalar: 1.15,
      shapes: ['star'],
      drift: 0.7
    });
  }, 120);
}

const celebrate = () => {
  // Initial pride celebration
  createPrideBurst(0.5, 0.7);

  // Trans flag celebration (slightly offset)
  setTimeout(() => {
    createTransBurst(0.3, 0.7);
    createTransBurst(0.7, 0.7);
  }, 200);

  // BIPOC celebration
  setTimeout(() => {
    createBIPOCBurst(0.4, 0.6);
    createBIPOCBurst(0.6, 0.6);
  }, 400);

  // Grand finale celebrating all identities
  setTimeout(() => {
    confetti({
      particleCount: 150,
      spread: 180,
      origin: { x: 0.5, y: 0.6 },
      colors: [...colors.pride, ...colors.trans, ...colors.bipoc],
      ticks: 400,
      gravity: 0.3,
      scalar: 1.5,
      shapes: ['star', 'circle'],
      drift: 1
    });
  }, 600);

  // Final celebratory sparkles
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 160,
      origin: { x: 0.5, y: 0.6 },
      colors: [...colors.pride, ...colors.trans, ...colors.bipoc, ...colors.brand],
      ticks: 450,
      gravity: 0.2,
      scalar: 1.6,
      shapes: ['star'],
      drift: 2
    });
  }, 800);
};

const MailerLiteForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission started", { name, email });
    
    if (!email) {
      toast({
        title: "Your email is needed",
        description: "We'd love to send you the challenge materials - pop in your email when you're ready.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Check if Supabase is initialized
      if (!supabase.functions) {
        throw new Error('Supabase client is not properly initialized');
      }

      console.log("Calling Supabase Edge Function...");
      const { data, error } = await supabase.functions.invoke('mailerlite', {
        body: { email, name },
      });
      console.log("Edge Function response:", { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to submit form');
      }

      // Check if we got a response with a message
      if (data?.message) {
        if (!data.success) {
          console.warn('Form submission failed:', data.message);
          toast({
            title: "A gentle heads up",
            description: data.message,
            variant: "destructive",
            duration: 5000,
          });
          return;
        }
        
        // Success case
        console.log('Form submission successful:', data);
        setShowSuccessToast(true);
        celebrate();
        setName("");
        setEmail("");
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Something unexpected happened",
        description: "We're having trouble connecting to our services. Please try again in a moment.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl p-8 shadow-sm">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2">Join the 5-Day Challenge</h3>
          <p className="text-gray-600">
            No fixing. No performative wellness. Just realness in your inbox.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4" id="signup-form">
          <Input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-gray-200 bg-gray-50/50"
            id="name"
            name="name"
          />
          
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border-gray-200 bg-gray-50/50"
            id="email"
            name="email"
          />
          
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-yellow-200 to-pink-300 text-gray-800 font-bold py-3 rounded-full hover:opacity-90 transition-opacity h-auto"
          >
            {isSubmitting ? "Sending..." : "Start Unmasking →"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4 italic">
          5 days of voice memos, journal prompts & tiny actions
        </p>
      </div>

      <DancingToast
        open={showSuccessToast}
        onOpenChange={setShowSuccessToast}
        title="Welcome, fellow rebel! 💌"
        description="Your first unmasking invitation is on its way. Take all the time and space you need."
      />
    </>
  );
};

export default MailerLiteForm;
