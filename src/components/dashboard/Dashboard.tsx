import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase, type Course, type Enrollment } from '@/lib/supabase';
import Header from './Header';
import SubjectCards from './SubjectCards';
import RecentlyAccessed from './RecentlyAccessed';
import StatsBand from './StatsBand';
import Footer from './Footer';

export default function Dashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCourses = useCallback(async () => {
    const { data } = await supabase.from('courses').select('*').order('created_at');
    if (data) setCourses(data as Course[]);
  }, []);

  const loadEnrollments = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('enrollments')
      .select('*, course:courses(*)')
      .order('last_accessed_at', { ascending: false })
      .limit(8);
    if (data) setEnrollments(data as unknown as Enrollment[]);
  }, [user]);

  useEffect(() => {
    (async () => {
      await loadCourses();
      await loadEnrollments();
      setLoading(false);
    })();
  }, [loadCourses, loadEnrollments]);

  const handleSelectCourse = async (course: Course) => {
    if (!user) return;
    await supabase
      .from('enrollments')
      .upsert({ user_id: user.id, course_id: course.id, progress: 0, last_accessed_at: new Date().toISOString() }, { onConflict: 'user_id,course_id' });
    await supabase.from('activity_events').insert({ user_id: user.id, course_id: course.id });
    loadEnrollments();
  };

  const streak = 12;
  const xp = 2450;
  const completedCount = 128540;

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-neutral-100">
        <Header streak={streak} xp={xp} />
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-yellow-400 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-neutral-100">
      <Header streak={streak} xp={xp} />

      <main>
        {/* Greeting */}
        <div className="mx-auto max-w-7xl px-4 pb-4 pt-10 sm:px-6">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back, <span className="text-yellow-400">{(user?.email ?? 'learner').split('@')[0]}</span>
          </h1>
          <p className="mt-2 text-sm text-neutral-400">Keep your streak alive, pick up a lesson TODAY.</p>
        </div>

        <SubjectCards courses={courses} onSelect={handleSelectCourse} />
        <RecentlyAccessed enrollments={enrollments} onOpen={() => {}} />
        <StatsBand completedCount={completedCount} liveCount={340} />
      </main>

      <Footer />
    </div>
  );
}
