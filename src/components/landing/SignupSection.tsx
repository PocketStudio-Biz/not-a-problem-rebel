import React, { useCallback, useRef, useEffect, useState } from 'react';
import MailerLiteForm from '@/components/MailerLiteForm';
import confetti from 'canvas-confetti';
import { getImageUrl } from '@/lib/supabase';

interface SignupSectionProps {
  formRef: React.RefObject<HTMLDivElement>;
}

const SignupSection: React.FC<SignupSectionProps> = ({ formRef }) => {
  const [imageUrl, setImageUrl] = useState<string>('/not-a-problem-sweatshirt.png');
  const [imageError, setImageError] = useState<boolean>(false);
  const lastConfettiTime = useRef(0);

  useEffect(() => {
    // Try to get the image from Supabase, fallback to local if fails
    const loadSupabaseImage = async () => {
      try {
        console.log('Attempting to load Supabase image...');
        const url = await getImageUrl('uploads/not-a-problem-sweatshirt.png');
        console.log('Supabase image URL:', url);
        if (url) {
          // Test if the image loads successfully
          const img = new Image();
          img.onload = () => {
            console.log('Supabase image loaded successfully');
            setImageUrl(url);
            setImageError(false);
          };
          img.onerror = (error) => {
            console.warn('Supabase image failed to load:', error);
            setImageError(true);
          };
          img.src = url;
        }
      } catch (error) {
        console.warn('Error loading Supabase image:', error);
        setImageError(true);
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
            {imageError ? (
              <img 
                src="/not-a-problem-sweatshirt.png"
                alt="I'm Not a Problem to Solve sweatshirt" 
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src={imageUrl}
                alt="I'm Not a Problem to Solve sweatshirt" 
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupSection;
