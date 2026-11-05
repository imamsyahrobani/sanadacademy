import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export async function signUpWithEmail({ email, password, fullName, phone }) {
  if (!isSupabaseConfigured() || !supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, phone } }
  });
  if (error) throw error;
  // create profile row (if not auto via trigger)
  if (data.user) {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      email,
      full_name: fullName,
      phone,
      role: 'santri',
      status: 'pending'
    });
  }
  return data.user;
}

export async function signInWithEmail(email, password) {
  if (!isSupabaseConfigured() || !supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
  return { ...data.user, profile };
}

export async function signOut() {
  if (supabase) await supabase.auth.signOut();
}

export async function getCurrentUser() {
  if (!isSupabaseConfigured() || !supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  return { ...user, profile };
}
