
import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface ProfileImageProps {
  src?: string;
  alt?: string;
  user?: {
    name: string;
    avatar?: string;
  };
  size?: "small" | "medium" | "large";
  className?: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  src,
  alt,
  user,
  size = "medium",
  className,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  // Get image source - prioritize direct src prop, then user.avatar if available
  const imageSrc = src || user?.avatar;
  
  // Get alt text - prioritize direct alt prop, then use user name if available
  const imageAlt = alt || (user?.name ? `${user.name}'s profile` : "Profile image");
  
  // Get initials from name for the fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Size classes mapping
  const sizeClasses = {
    small: "h-10 w-10",
    medium: "h-16 w-16 md:h-20 md:w-20",
    large: "h-24 w-24 md:h-32 md:w-32 lg:h-40 lg:w-40",
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={cn("relative", className)}>
      {/* Loading animation overlay */}
      {isLoading && imageSrc && (
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-amber-100 animate-pulse z-10">
          <span className="sr-only">Loading...</span>
        </div>
      )}
      
      <Avatar 
        className={cn(
          "rounded-full border-4 border-white shadow-md overflow-hidden bg-amber-100",
          sizeClasses[size]
        )}
      >
        {imageSrc ? (
          <AvatarImage 
            src={imageSrc} 
            alt={imageAlt} 
            onLoad={handleImageLoad}
            className="object-cover"
          />
        ) : (
          <AvatarFallback 
            className="bg-amber-100 text-amber-800 flex items-center justify-center text-lg md:text-xl lg:text-2xl"
          >
            {user?.name ? getInitials(user.name) : "?"}
          </AvatarFallback>
        )}
      </Avatar>
    </div>
  );
};

export default ProfileImage;
