import React, { useCallback, useRef, useEffect, useState } from 'react';
import MailerLiteForm from '@/components/MailerLiteForm';
import confetti from 'canvas-confetti';
import { getImageUrl } from '@/lib/supabase';

interface SignupSectionProps {
  formRef: React.RefObject<HTMLDivElement>;
}

const SignupSection: React.FC<SignupSectionProps> = ({ formRef }) => {
  const [imageUrl, setImageUrl] = useState<string>('/not-a-problem-sweatshirt.png');
  const lastConfettiTime = useRef(0);

  useEffect(() => {
    // Try to get the image from Supabase, fallback to local if fails
    const loadSupabaseImage = async () => {
      try {
        const url = await getImageUrl('uploads/not-a-problem-sweatshirt.png');
        if (url) setImageUrl(url);
      } catch (error) {
        console.warn('Falling back to local image:', error);
      }
    };
    loadSupabaseImage();
  }, []);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    if (now - lastConfettiTime.current < 1700) return;
    
    lastConfettiTime.current = now;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x, y },
      colors: ['#FF0018', '#FFA52C', '#FFFF41', '#008018', '#0000F9', '#86007D'],
      ticks: 200,
      gravity: 0.4,
      scalar: 1.2,
      shapes: ['star', 'circle'],
      drift: 1
    });
  }, []);

  return (
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
              src={imageUrl}
              alt="I'm Not a Problem to Solve sweatshirt" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupSection;
