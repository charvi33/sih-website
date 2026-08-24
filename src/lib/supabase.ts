import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Course = {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  image_url: string;
  estimated_minutes: number;
  created_at: string;
};

export type Enrollment = {
  id: string;
  user_id: string;
  course_id: string;
  progress: number;
  last_accessed_at: string;
  completed_at: string | null;
  created_at: string;
  course: Course;
};
