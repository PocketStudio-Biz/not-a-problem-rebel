
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
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
