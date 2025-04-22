import React, { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { ImageGallery } from '@/components/ImageGallery';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ImageShowcase() {
  const [isUploadMode, setIsUploadMode] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadComplete = (url: string) => {
    // Switch back to gallery mode and refresh the gallery
    setIsUploadMode(false);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Link to="/" className="flex items-center text-gray-700 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-center">Image Showcase</h1>
        <Button 
          variant={isUploadMode ? "destructive" : "default"} 
          size="sm"
          onClick={() => setIsUploadMode(!isUploadMode)}
        >
          {isUploadMode ? (
            <>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Upload
            </>
          )}
        </Button>
      </div>

      <div className="max-w-screen-lg mx-auto">
        {isUploadMode ? (
          <div className="bg-muted p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Upload New Image</h2>
            <div className="max-w-md mx-auto">
              <ImageUpload 
                onUploadComplete={handleUploadComplete}
              />
              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Supported formats: JPG, PNG, GIF, WebP<br />
                  Maximum file size: 5MB
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setIsUploadMode(false)}
                  className="mt-2"
                >
                  Back to Gallery
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <ImageGallery key={refreshTrigger} />
        )}
      </div>
    </div>
  );
} 