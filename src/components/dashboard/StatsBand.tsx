import { useEffect, useState } from 'react';
import { Users, GraduationCap, Activity, Award } from 'lucide-react';

type StatsBandProps = {
  completedCount: number;
  liveCount: number;
};

export default function StatsBand({ completedCount, liveCount }: StatsBandProps) {
  const [live, setLive] = useState(liveCount);

  useEffect(() => {
    const id = setInterval(() => {
      setLive((prev) => {
        const delta = Math.floor(Math.random() * 7) - 3;
        return Math.max(0, prev + delta);
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const stats = [
    { icon: GraduationCap, label: 'Completed courses', value: completedCount.toLocaleString(), sub: 'across all subjects' },
    { icon: Activity, label: 'Learning right now', value: live.toLocaleString(), sub: 'live count', pulse: true },
    { icon: Users, label: 'Active this week', value: '12,840', sub: 'and growing' },
    { icon: Award, label: 'Certificates earned', value: '3,210', sub: 'by our community' },
  ];

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-neutral-900 via-black to-neutral-900 p-8 sm:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(250,204,21,0.1),_transparent_60%)]" />
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-yellow-400/5 blur-[100px]" />

          <div className="relative">
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Community impact</h2>
              <p className="mt-2 text-sm text-neutral-400">See the Recall community learning in real time.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-neutral-800 bg-black/40 p-6 transition-colors hover:border-yellow-500/30">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400">
                    <s.icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-white">{s.value}</p>
                    {s.pulse && (
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-medium text-neutral-200">{s.label}</p>
                  <p className="text-xs text-neutral-500">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
