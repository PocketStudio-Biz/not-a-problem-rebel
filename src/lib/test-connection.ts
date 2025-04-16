import { supabase } from './supabase';

export async function testConnection() {
  try {
    // Just check if we can connect to Supabase
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.log('❌ Supabase connection test: Failed');
      console.error('Error:', error.message);
      return false;
    }
    console.log('✅ Supabase connection test: Success');
    return true;
  } catch (err) {
    console.log('❌ Supabase connection test: Failed');
    console.error('Error:', err);
    return false;
  }
} 