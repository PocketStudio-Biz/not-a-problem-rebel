import { createClient } from '@supabase/supabase-js'

// Ensure environment variables are properly formatted
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || '';

// Log environment variable status (without exposing values)
console.log('Supabase Environment Status:', {
  url: supabaseUrl ? '✓ present' : '✗ missing',
  key: supabaseAnonKey ? '✓ present' : '✗ missing',
  urlValid: supabaseUrl.startsWith('https://'),
  keyValid: supabaseAnonKey.startsWith('eyJ')
});

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase configuration is incomplete. ' +
    'Missing: ' + 
    (!supabaseUrl ? 'VITE_SUPABASE_URL ' : '') +
    (!supabaseAnonKey ? 'VITE_SUPABASE_ANON_KEY' : '')
  );
}

if (!supabaseUrl.startsWith('https://')) {
  throw new Error('Invalid Supabase URL format. Must start with https://');
}

if (!supabaseAnonKey.startsWith('eyJ')) {
  throw new Error('Invalid Supabase anonymous key format');
}

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Test the connection
supabase.from('_test_connection').select('*').limit(1)
  .then(() => console.log('✓ Supabase connection successful'))
  .catch(error => console.error('✗ Supabase connection failed:', error.message));

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