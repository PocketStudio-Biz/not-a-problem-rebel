import React from 'react';
import ImageUploader from '@/components/ImageUploader';

export default function Upload() {
  return (
    <div className="min-h-screen bg-warm-gradient font-nunito p-8">
      <div className="max-w-md mx-auto bg-white/90 rounded-2xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Upload Sweatshirt Image</h1>
        <ImageUploader />
      </div>
    </div>
  )
} 