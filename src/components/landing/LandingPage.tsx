import { useState } from 'react';
import { BookOpen, Brain, ShieldCheck, Smartphone, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';

type LandingPageProps = {
  onGetStarted: () => void;
};

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [navOpen, setNavOpen] = useState(false);

  const subjects = [
    { icon: ShieldCheck, title: 'Consumer Rights', desc: 'Warranties, returns, and spotting unfair trade.' },
    { icon: Smartphone, title: 'Digital Literacy', desc: 'Phishing, privacy, and navigating the web safely.' },
    { icon: TrendingUp, title: 'Fintech', desc: 'UPI, wallets, credit scores, and modern money tools.' },
    { icon: Brain, title: 'Mental Health', desc: 'Stress, sleep, and everyday emotional resilience.' },
  ];

  return (
    <div className="min-h-screen bg-black text-neutral-100">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-yellow-500/10 bg-black/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-400 text-black">
              <BookOpen className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight">Recall</span>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#subjects" className="text-sm text-neutral-300 transition-colors hover:text-yellow-400">Subjects</a>
            <a href="#how" className="text-sm text-neutral-300 transition-colors hover:text-yellow-400">How it works</a>
            <a href="#stats" className="text-sm text-neutral-300 transition-colors hover:text-yellow-400">Impact</a>
          </nav>
          <button
            onClick={onGetStarted}
            className="hidden rounded-lg bg-yellow-400 px-5 py-2 text-sm font-semibold text-black transition-all hover:bg-yellow-300 hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] md:block"
          >
            Sign in
          </button>
          <button onClick={() => setNavOpen(!navOpen)} className="md:hidden">
            <div className="space-y-1.5">
              <div className={`h-0.5 w-6 bg-yellow-400 transition-transform ${navOpen ? 'translate-y-2 rotate-45' : ''}`} />
              <div className={`h-0.5 w-6 bg-yellow-400 transition-opacity ${navOpen ? 'opacity-0' : ''}`} />
              <div className={`h-0.5 w-6 bg-yellow-400 transition-transform ${navOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </div>
          </button>
        </div>
        {navOpen && (
          <div className="border-t border-yellow-500/10 bg-black px-6 py-4 md:hidden">
            <div className="flex flex-col gap-4">
              <a href="#subjects" onClick={() => setNavOpen(false)} className="text-sm text-neutral-300 hover:text-yellow-400">Subjects</a>
              <a href="#how" onClick={() => setNavOpen(false)} className="text-sm text-neutral-300 hover:text-yellow-400">How it works</a>
              <a href="#stats" onClick={() => setNavOpen(false)} className="text-sm text-neutral-300 hover:text-yellow-400">Impact</a>
              <button onClick={onGetStarted} className="rounded-lg bg-yellow-400 px-5 py-2 text-sm font-semibold text-black">Sign in</button>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(250,204,21,0.15),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-yellow-400/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/5 px-4 py-1.5 text-xs font-medium text-yellow-400">
              <Sparkles className="h-3.5 w-3.5" />
              AI-driven · Gamified · Adaptive
            </div>
            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Teaching what your
              <br />
              <span className="text-yellow-400">school never did.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-neutral-400">
              Recall turns real-world life skills — consumer rights, digital literacy, fintech, and mental health — into bite-sized, gamified lessons that adapt to how you learn.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={onGetStarted}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-7 py-3.5 text-base font-semibold text-black transition-all hover:bg-yellow-300 hover:shadow-[0_0_30px_rgba(250,204,21,0.4)]"
              >
                Start learning free
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href="#subjects"
                className="inline-flex items-center justify-center rounded-xl border border-neutral-700 px-7 py-3.5 text-base font-semibold text-neutral-200 transition-colors hover:border-yellow-500/50 hover:text-yellow-400"
              >
                Explore subjects
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section id="subjects" className="relative border-t border-neutral-900 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Four skills. One platform.</h2>
            <p className="mt-4 text-neutral-400">The subjects that matter in modern life — taught the way they should have been.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {subjects.map((s, i) => (
              <div
                key={s.title}
                className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 p-6 transition-all hover:border-yellow-500/40 hover:-translate-y-1"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-yellow-400/0 blur-2xl transition-all group-hover:bg-yellow-400/10" />
                <div className="relative">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400 transition-colors group-hover:bg-yellow-400 group-hover:text-black">
                    <s.icon className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-neutral-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-neutral-900 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Learning that sticks.</h2>
              <p className="mt-4 text-neutral-400">Short lessons, spaced repetition, and streaks that keep you coming back. The AI adapts difficulty to your pace so you're always in the sweet spot.</p>
              <ul className="mt-8 space-y-5">
                {[
                  { t: 'Bite-sized lessons', d: '5-minute sessions designed for real attention spans.' },
                  { t: 'Streaks & XP', d: 'Build a daily habit with gamified rewards.' },
                  { t: 'Adaptive paths', d: 'Content reshuffles based on what you already know.' },
                ].map((f) => (
                  <li key={f.t} className="flex gap-4">
                    <div className="mt-1 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-yellow-400 text-black">
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={3} />
                    </div>
                    <div>
                      <p className="font-semibold">{f.t}</p>
                      <p className="text-sm text-neutral-400">{f.d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-black p-8">
              <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_top_right,_rgba(250,204,21,0.08),_transparent_70%)]" />
              <div className="relative space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-neutral-800 bg-black/50 p-4">
                  <span className="text-sm text-neutral-300">Current streak</span>
                  <span className="flex items-center gap-1.5 text-lg font-bold text-yellow-400">
                    <span className="text-xl">🔥</span> 12 days
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-neutral-800 bg-black/50 p-4">
                  <span className="text-sm text-neutral-300">Total XP</span>
                  <span className="text-lg font-bold text-yellow-400">2,450</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-neutral-800 bg-black/50 p-4">
                  <span className="text-sm text-neutral-300">Lessons this week</span>
                  <span className="text-lg font-bold text-yellow-400">18</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section id="stats" className="border-t border-neutral-900 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 text-center sm:grid-cols-3">
            {[
              { n: '50K+', l: 'Learners enrolled' },
              { n: '120K+', l: 'Lessons completed' },
              { n: '4.9', l: 'Average rating' },
            ].map((s) => (
              <div key={s.l}>
                <p className="text-4xl font-bold text-yellow-400 sm:text-5xl">{s.n}</p>
                <p className="mt-2 text-sm text-neutral-400">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-neutral-900 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to learn what matters?</h2>
          <p className="mt-4 text-neutral-400">Join thousands picking up the skills school skipped. It's free to start.</p>
          <button
            onClick={onGetStarted}
            className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-8 py-4 text-base font-semibold text-black transition-all hover:bg-yellow-300 hover:shadow-[0_0_30px_rgba(250,204,21,0.4)]"
          >
            Get started
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-400 text-black">
              <BookOpen className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <span className="font-bold">Recall</span>
          </div>
          <div className="flex gap-6 text-sm text-neutral-400">
            <a href="#" className="hover:text-yellow-400">About</a>
            <a href="#" className="hover:text-yellow-400">Send feedback</a>
            <a href="#" className="hover:text-yellow-400">Privacy</a>
            <a href="#" className="hover:text-yellow-400">Terms</a>
          </div>
          <p className="text-sm text-neutral-500">© 2026 Recall</p>
        </div>
      </footer>
    </div>
  );
}
