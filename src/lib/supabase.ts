import { createClient } from '@supabase/supabase-js'

// Default to empty string if undefined, then trim
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

// Debug environment variables (safe to log)
console.debug('Supabase Environment Check:', {
  url: supabaseUrl ? '✓' : '✗',
  key: supabaseAnonKey ? '✓' : '✗',
  env: import.meta.env.MODE,
  meta: {
    urlValid: supabaseUrl.startsWith('https://'),
    keyValid: supabaseAnonKey.startsWith('eyJ')
  }
});

// Validate configuration
const missingVars = [];
if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL');
if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY');

if (missingVars.length > 0) {
  const error = new Error(`Supabase configuration incomplete. Missing: ${missingVars.join(', ')}`);
  console.error(error);
  throw error;
}

// Create client with validated config
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Test connection and log result
const testConnection = async () => {
  try {
    const { error } = await supabase.from('_test_connection').select('count').single();
    if (error) throw error;
    console.log('✓ Supabase connection successful');
  } catch (error) {
    console.error('✗ Supabase connection error:', error.message);
  }
};

// Run connection test
testConnection();

// Export utility functions
export async function uploadImage(file: File, bucket: string = 'images') {
  try {
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const path = `uploads/${fileName}`;
    
    console.log('Uploading image:', { bucket, path });
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: true,
        contentType: file.type,
        cacheControl: '3600'
      });
      
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
      
    console.log('Upload successful:', { publicUrl });
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export async function getImageUrl(path: string, bucket: string = 'images') {
  try {
    console.log('Getting image URL:', { bucket, path });
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    console.log('Got public URL:', { publicUrl });
    return publicUrl;
  } catch (error) {
    console.error('Error getting image URL:', error);
    throw error;
  }
}

export async function deleteImage(path: string, bucket: string = 'images') {
  try {
    console.log('Deleting image:', { bucket, path });
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([path]);
      
    if (error) throw error;
    
    console.log('Delete successful:', { data });
    return data;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
} 