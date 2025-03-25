import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = "admin" | "user";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
