
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ProfileImage from "./ProfileImage";
import ImageUpload from "./ImageUpload";
import { useToast } from "@/hooks/use-toast";

interface ProfileImageUploadProps {
  initialImageUrl?: string;
  alt?: string;
  size?: "small" | "medium" | "large";
  onImageChange?: (url: string) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  initialImageUrl,
  alt = "Profile image",
  size = "large",
  onImageChange,
}) => {
  const [imageUrl, setImageUrl] = useState(initialImageUrl || "");
  const { toast } = useToast();
  
  const handleUploadComplete = (url: string) => {
    setImageUrl(url);
    if (onImageChange) {
      onImageChange(url);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center">
        <ProfileImage 
          src={imageUrl} 
          alt={alt} 
          size={size} 
          className="mb-4"
        />
        
        <ImageUpload 
          onUploadComplete={handleUploadComplete} 
          bucketName="images"
        />
      </div>
    </div>
  );
};

export default ProfileImageUpload;
