import { supabase } from './supabase'

export async function uploadImage(file: File) {
  try {
    // Create a unique file name
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `public/${fileName}`

    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      throw error
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    return {
      path: data.path,
      url: publicUrl
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
} 