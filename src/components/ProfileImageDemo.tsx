
import React from "react";
import ProfileImage from "./ProfileImage";

const ProfileImageDemo = () => {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-4">Profile Image Component</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center space-y-4">
          <h3 className="font-semibold">With Image</h3>
          <ProfileImage 
            src="/lovable-uploads/32c1074c-8ab2-413b-af16-93bcddfa6045.png"
            alt="I'm Not a Problem to Solve"
            size="large"
          />
          <p className="text-sm text-gray-500">Large size with image</p>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          <h3 className="font-semibold">With User Object</h3>
          <ProfileImage 
            user={{ 
              name: "Robin Williams", 
              avatar: "/lovable-uploads/32c1074c-8ab2-413b-af16-93bcddfa6045.png" 
            }}
            size="medium"
          />
          <p className="text-sm text-gray-500">Medium size with user object</p>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          <h3 className="font-semibold">Fallback (No Image)</h3>
          <ProfileImage 
            user={{ name: "Alex Morgan" }}
            size="small"
          />
          <p className="text-sm text-gray-500">Small size with initials fallback</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileImageDemo;
