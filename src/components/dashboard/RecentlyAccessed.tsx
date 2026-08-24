import { useState } from 'react';
import { Clock, ArrowUpRight } from 'lucide-react';
import type { Enrollment } from '@/lib/supabase';
import ProgressRing from './ProgressRing';

type RecentlyAccessedProps = {
  enrollments: Enrollment[];
  onOpen: (enrollment: Enrollment) => void;
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return 'Just now';
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function RecentlyCard({ enrollment, onOpen }: { enrollment: Enrollment; onOpen: (e: Enrollment) => void }) {
  const [hovered, setHovered] = useState(false);
  const course = enrollment.course;

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(enrollment)}
      className="group relative aspect-square overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 text-left transition-all hover:border-yellow-500/40 hover:-translate-y-1"
    >
      <img
        src={course.image_url}
        alt={course.title}
        className="absolute inset-0 h-full w-full object-cover opacity-30 transition-all duration-500 group-hover:scale-110 group-hover:opacity-50"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

      {/* Progress ring */}
      <div className="absolute right-3 top-3">
        <div className={`relative ${hovered ? 'text-yellow-400' : 'text-neutral-400'} transition-colors`}>
          <ProgressRing progress={enrollment.progress} size={56} strokeWidth={5} />
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
            {enrollment.progress}%
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-[10px] uppercase tracking-wider text-yellow-400/80">{course.category.replace('-', ' ')}</p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-white">{course.title}</h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="flex items-center gap-1 text-[11px] text-neutral-400">
            <Clock className="h-3 w-3" /> {timeAgo(enrollment.last_accessed_at)}
          </span>
          <span className={`flex items-center gap-0.5 text-xs font-semibold text-yellow-400 transition-opacity ${hovered ? 'opacity-100' : 'opacity-0'}`}>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </button>
  );
}

export default function RecentlyAccessed({ enrollments, onOpen }: RecentlyAccessedProps) {
  if (enrollments.length === 0) return null;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Recently accessed</h2>
          <p className="mt-2 text-sm text-neutral-400">Jump back into a lesson you started.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {enrollments.map((e) => (
            <RecentlyCard key={e.id} enrollment={e} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </section>
  );
}
