import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function uploadImage(file: File) {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `not-a-problem-sweatshirt.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, file, {
        upsert: true
      })
      
    if (error) throw error
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(fileName)
      
    return publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
} 