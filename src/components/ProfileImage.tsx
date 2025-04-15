
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ProfileImageProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "small" | "medium" | "large";
  className?: string;
}

const ProfileImage = ({ 
  src, 
  alt = "Profile", 
  fallback = "ND", 
  size = "large",
  className = ""
}: ProfileImageProps) => {
  // Size classes mapping
  const sizeClasses = {
    small: "w-24 h-24",
    medium: "w-32 h-32",
    large: "w-48 h-48 md:w-56 md:h-56"
  };
  
  return (
    <div className={`relative group ${className}`}>
      <Avatar className={`rounded-full overflow-hidden border-4 border-white shadow-xl ${sizeClasses[size]}`}>
        {src ? (
          <AvatarImage 
            src={src} 
            alt={alt} 
            className="object-cover"
          />
        ) : (
          <AvatarFallback className="bg-gradient-to-br from-amber-200 to-pink-200 text-gray-600 text-2xl md:text-3xl">
            {fallback}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <span className="text-white text-sm font-medium">Your profile here</span>
      </div>
    </div>
  );
};

export default ProfileImage;
