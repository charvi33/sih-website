import { useRef } from 'react';
import { ShieldCheck, Smartphone, TrendingUp, Brain, ArrowUpRight } from 'lucide-react';
import type { Course } from '@/lib/supabase';

type SubjectCardsProps = {
  courses: Course[];
  onSelect: (course: Course) => void;
};

const categoryMeta: Record<string, { icon: typeof ShieldCheck; tag: string }> = {
  'consumer-rights': { icon: ShieldCheck, tag: 'Rights & Awareness' },
  'digital-literacy': { icon: Smartphone, tag: 'Digital Literacy' },
  'fintech': { icon: TrendingUp, tag: 'Fintech' },
  'mental-health': { icon: Brain, tag: 'Mental Health' },
};

function SubjectCard({ course, index, onSelect }: { course: Course; index: number; onSelect: (c: Course) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const meta = categoryMeta[course.category] ?? { icon: ShieldCheck, tag: course.title };

  return (
    <div
      ref={ref}
      className="group relative h-[340px] w-[85vw] max-w-[680px] flex-none snap-center overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950 sm:w-[680px]"
      style={{
        marginLeft: index === 0 ? 0 : '-120px',
      }}
    >
      {/* Default content */}
      <div className="absolute inset-0 flex flex-col justify-between p-8 transition-opacity duration-500 group-hover:opacity-0 sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(250,204,21,0.08),_transparent_70%)]" />
        <div className="relative flex items-start justify-between">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400/10 text-yellow-400">
            <meta.icon className="h-7 w-7" strokeWidth={2} />
          </div>
          <span className="rounded-full border border-neutral-700 px-3 py-1 text-xs font-medium text-neutral-400">
            {meta.tag}
          </span>
        </div>
        <div className="relative">
          <h3 className="text-3xl font-bold tracking-tight sm:text-4xl">{course.title}</h3>
          <p className="mt-3 max-w-md text-neutral-400">{course.description}</p>
          <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-yellow-400">
            Explore <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Hover image */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <img
          src={course.image_url}
          alt={course.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10">
          <h3 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{course.title}</h3>
          <button
            onClick={() => onSelect(course)}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-yellow-300"
          >
            Start course <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SubjectCards({ courses, onSelect }: SubjectCardsProps) {
  const flagship = ['consumer-rights', 'digital-literacy', 'fintech', 'mental-health'];
  const ordered = flagship
    .map((cat) => courses.find((c) => c.category === cat && c.slug === cat))
    .filter((c): c is Course => Boolean(c));

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Your subjects</h2>
          <p className="mt-2 text-sm text-neutral-400">Scroll through and hover to preview each track.</p>
        </div>
      </div>
      <div className="flex snap-x snap-mandatory gap-0 overflow-x-auto px-4 pb-6 [scrollbar-width:thin] sm:px-6">
        {ordered.map((course, i) => (
          <SubjectCard key={course.id} course={course} index={i} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
}
