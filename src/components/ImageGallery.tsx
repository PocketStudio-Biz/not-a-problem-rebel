import React, { useEffect, useState } from 'react';
import { fetchImages, ImageItem } from '@/lib/fetch-images';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCw, Image, ZoomIn } from 'lucide-react';

interface ImageGalleryProps {
  className?: string;
  limit?: number;
  bucket?: string;
  folder?: string;
}

export function ImageGallery({ className, limit = 12, bucket = 'images', folder = 'public' }: ImageGalleryProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const { toast } = useToast();

  // Hardcoded circular gradient image
  const circularGradientImage: ImageItem = {
    id: 'circular-gradient-image',
    // Using the direct image URL if you uploaded it to Supabase, or a placeholder if not
    url: 'https://qsevudeuwedgofdwemsc.supabase.co/storage/v1/object/public/images/uploads/circular-gradient-border.png',
    name: 'Circular Gradient Border',
    created_at: new Date().toISOString(),
    size: 0
  };

  async function loadImages() {
    try {
      setLoading(true);
      setError(null);
      const imageData = await fetchImages(bucket, limit, folder);
      setImages(imageData);
    } catch (err) {
      setError('Failed to load images. Please try again.');
      console.error('Error loading images:', err);
      toast({
        title: 'Error',
        description: 'Failed to load images. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadImages();
  }, [bucket, limit, folder]);

  const handleRefresh = () => {
    loadImages();
  };

  const openImageModal = (image: ImageItem) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Image className="w-5 h-5" />
          Gallery
        </h2>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
          <RefreshCw className={cn('w-4 h-4 mr-2', loading && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="p-4 text-center rounded-md bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Always display the circular gradient image */}
        <div 
          key={circularGradientImage.id} 
          className="group aspect-square rounded-md overflow-hidden bg-muted hover:opacity-90 relative cursor-pointer col-span-2 row-span-2 md:col-span-2 md:row-span-2"
          onClick={() => openImageModal(circularGradientImage)}
        >
          <img 
            src={circularGradientImage.url} 
            alt={circularGradientImage.name}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <ZoomIn className="w-8 h-8 text-white drop-shadow-md" />
          </div>
        </div>

        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-md overflow-hidden">
                <Skeleton className="w-full h-full" />
              </div>
            ))
          : images.length === 0
          ? (
              <div className="col-span-2 p-8 text-center rounded-md bg-muted">
                <p>No additional images found. Upload an image to see it here.</p>
              </div>
            )
          : images.map((image) => (
              <div 
                key={image.id} 
                className="group aspect-square rounded-md overflow-hidden bg-muted hover:opacity-90 relative cursor-pointer"
                onClick={() => openImageModal(image)}
              >
                <img 
                  src={image.url} 
                  alt={image.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white drop-shadow-md" />
                </div>
              </div>
            ))
        }
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] w-full" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-lg">
              <img 
                src={selectedImage.url} 
                alt={selectedImage.name}
                className="w-full h-full object-contain"
              />
            </div>
            <button 
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-sm"
              onClick={closeImageModal}
            >
              Close
            </button>
            <div className="mt-2 text-white text-sm">
              <p>{selectedImage.name}</p>
              <p>{new Date(selectedImage.created_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 