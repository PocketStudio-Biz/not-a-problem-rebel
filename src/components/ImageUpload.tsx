<<<<<<< HEAD
=======
<<<<<<< HEAD

import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ImageUploadProps {
  onUploadComplete?: (url: string) => void;
  bucketName?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUploadComplete,
  bucketName = "images",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);
        
      if (error) {
        throw error;
      }
      
      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
        
      toast({
        title: "Upload successful",
        description: "Your image has been uploaded",
      });
      
      // Call the callback with the public URL
      if (onUploadComplete) {
        onUploadComplete(publicUrl);
      }
      
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset the input
      e.target.value = '';
    }
  };
  
  return (
    <div className="space-y-4">
      <label className="block">
        <span className="sr-only">Choose image</span>
        <input
          type="file"
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-amber-50 file:text-amber-700
            hover:file:bg-amber-100
            disabled:opacity-50 disabled:cursor-not-allowed"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </label>
      
      {isUploading && (
        <div className="flex items-center space-x-2 text-amber-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Uploading...</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
=======
>>>>>>> feature/celebrations
import React, { useState, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { uploadImage } from '@/lib/upload-image'
import { useToast } from '@/hooks/use-toast'
import confetti from 'canvas-confetti'

interface ImageUploadProps {
  onUploadComplete?: (url: string) => void
  className?: string
}

export function ImageUpload({ onUploadComplete, className = '' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const { toast } = useToast()
  const lastConfettiTime = useRef(0)

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now()
    if (now - lastConfettiTime.current < 1700) return // 1.7 second delay
    
    lastConfettiTime.current = now
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (rect.left + rect.width / 2) / window.innerWidth
    const y = (rect.top + rect.height / 2) / window.innerHeight

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x, y },
      colors: ['#FEF9C3', '#FDE68A', '#FCD34D', '#FBBF24', '#FBA4B4', '#FDA4AF'],
      ticks: 100,
      gravity: 1.5,
      scalar: 0.8,
      shapes: ['star', 'circle'],
    })
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "A gentle heads up",
        description: "Please choose an image file (JPG, PNG, etc.)",
        variant: "destructive",
      })
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "A gentle heads up",
        description: "Please choose an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to Supabase
    try {
      setIsUploading(true)
      const { url } = await uploadImage(file)
      onUploadComplete?.(url)
      
      // Trigger confetti on successful upload
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FEF9C3', '#FDE68A', '#FCD34D', '#FBBF24', '#FBA4B4', '#FDA4AF'],
      })

      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully",
      })
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "A gentle heads up",
        description: "There was an issue uploading your image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

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
  )
<<<<<<< HEAD
} 
=======
} 
>>>>>>> aa451a8 (Backup - Added celebrations)
>>>>>>> feature/celebrations
