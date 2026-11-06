import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export async function getDiscussions() {
  if (!isSupabaseConfigured() || !supabase) return [];
  try {
    const { data, error } = await supabase
      .from('discussions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.warn('Gagal ambil diskusi dari cloud:', e);
    return [];
  }
}

export async function addDiscussion({ userId, authorName, authorRole, message, parentId = null }) {
  if (!isSupabaseConfigured() || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('discussions')
      .insert({
        user_id: userId,
        author_name: authorName,
        author_role: authorRole,
        message,
        parent_id: parentId
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (e) {
    console.warn('Gagal kirim diskusi ke cloud:', e);
    return null;
  }
}
