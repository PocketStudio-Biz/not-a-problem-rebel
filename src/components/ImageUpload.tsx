import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';

interface ImageUploadProps {
  onUploadComplete?: (url: string) => void;
  className?: string;
}

export function ImageUpload({ onUploadComplete, className = '' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const lastConfettiTime = useRef(0);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    if (now - lastConfettiTime.current < 1700) return; // 1.7 second delay
    
    lastConfettiTime.current = now;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x, y },
      colors: ['#FEF9C3', '#FDE68A', '#FCD34D', '#FBBF24', '#FBA4B4', '#FDA4AF'],
      ticks: 100,
      gravity: 1.5,
      scalar: 0.8,
      shapes: ['star', 'circle'],
    });
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check authentication
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload images",
        variant: "destructive",
      });
      return;
    }

    // Client-side validation for immediate feedback
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "A gentle heads up",
        description: "Please choose an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "A gentle heads up",
        description: "Please choose an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload using secure server-side endpoint
    try {
      setIsUploading(true);

      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Call the secure server-side endpoint with proper authentication
      const { data, error } = await supabase.functions.invoke('file-upload', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error || !data?.success) {
        throw new Error(error?.message || data?.message || 'Upload failed');
      }

      // Handle successful upload
      onUploadComplete?.(data.url);
      
      // Trigger confetti on successful upload
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FEF9C3', '#FDE68A', '#FCD34D', '#FBBF24', '#FBA4B4', '#FDA4AF'],
      });

      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully",
      });
    } catch (error) {
      console.error('Upload error occurred');
      toast({
        title: "A gentle heads up",
        description: "There was an issue uploading your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div 
        className="relative w-full aspect-square p-4 bg-gradient-to-r from-yellow-200 to-pink-300 rounded-full transition-transform hover:scale-[1.02] duration-300"
        onMouseEnter={handleMouseEnter}
      >
        <div className="absolute inset-2 rounded-full bg-white">
          <div className="relative w-full h-full rounded-full overflow-hidden">
            {preview ? (
              <img 
                src={preview} 
                alt="Upload preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-700 text-center p-8">
                  Click to upload your image
                </p>
              </div>
            )}
            
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={isUploading}
            />
          </div>
        </div>
      </div>
      
      {isUploading && (
        <p className="text-sm text-center text-gray-600">
          Uploading your image...
        </p>
      )}
    </div>
  );
}
