import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xfaynzabjhmpsqrbzhxq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmYXluemFiamhtcHNxcmJ6aHhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MzAwNDgsImV4cCI6MjA1MTQwNjA0OH0._rDwfXNMj_0XoC6t1abHIPsww25CWc4AvW02HR-A4ho';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdminUser() {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@enkoko.rw',
      password: 'Admin@123',
      options: {
        data: {
          username: 'Admin',
          role: 'admin'
        }
      }
    });

    if (error) throw error;
    console.log('Admin user created successfully:', data);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdminUser();