import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are missing:', {
    url: supabaseUrl ? 'set' : 'missing',
    key: supabaseAnonKey ? 'set' : 'missing'
  })
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function uploadImage(file: File, bucket: string = 'images') {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image')
    }

    // Generate a unique filename
    const fileExt = file.name.split('.').pop()
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
    const fileName = `${uniqueId}.${fileExt}`
    
    console.log('Uploading image:', { bucket, path: `uploads/${fileName}` })
    
    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(`uploads/${fileName}`, file, {
        upsert: true,
        contentType: file.type,
        cacheControl: '3600'
      })
      
    if (error) {
      console.error('Error uploading to Supabase:', error)
      throw error
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(`uploads/${fileName}`)
      
    console.log('Upload successful:', { publicUrl })
    return publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

export async function getImageUrl(path: string, bucket: string = 'images') {
  try {
    console.log('Getting image URL:', { bucket, path })
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    console.log('Got public URL:', { publicUrl })
    return publicUrl
  } catch (error) {
    console.error('Error getting image URL:', error)
    throw error
  }
}

export async function deleteImage(path: string, bucket: string = 'images') {
  try {
    console.log('Deleting image:', { bucket, path })
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([path])
      
    if (error) {
      console.error('Error deleting from Supabase:', error)
      throw error
    }
    
    console.log('Delete successful:', { data })
    return data
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
} 