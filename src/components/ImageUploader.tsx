import React, { useState } from 'react'
import { uploadImage } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

export default function ImageUploader() {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      const file = e.target.files?.[0]
      if (!file) return

      const publicUrl = await uploadImage(file)
      console.log('Upload successful. Public URL:', publicUrl)
      
      // You can save this URL to your database or use it directly
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
        className="hidden"
        id="image-upload"
      />
      <label htmlFor="image-upload">
        <Button 
          as="span"
          disabled={uploading}
          className="cursor-pointer"
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </label>
    </div>
  )
} 