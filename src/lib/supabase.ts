import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Variables lues depuis .env.local (non versionné). Voir .env.example.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Vrai uniquement si l'URL et la clé anon sont toutes deux fournies.
 * Quand c'est faux, l'app retombe sur le mode démo local (mockData + localStorage),
 * ce qui permet de la lancer sans backend configuré.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Client Supabase partagé, ou null si non configuré.
 * Toujours tester `isSupabaseConfigured` (ou `supabase != null`) avant usage.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;
