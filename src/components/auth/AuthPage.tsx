import { useEffect, useRef, useState } from 'react';
import { BookOpen, ArrowLeft, Loader2, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { motion, useMotionValue, useSpring, SpringOptions } from 'motion/react';

type SpotlightProps = {
  className?: string;
  size?: number;
  springOptions?: SpringOptions;
};

function Spotlight({
  className = 'bg-zinc-700 blur-2xl',
  size = 200,
  springOptions = { bounce: 0.3, duration: 0.1 },
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightX = useSpring(mouseX, springOptions);
  const spotlightY = useSpring(mouseY, springOptions);

  useEffect(() => {
    const parent = containerRef.current?.parentElement;
    if (!parent) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left - size / 2);
      mouseY.set(e.clientY - rect.top - size / 2);
    };
    const handleEnter = () => setIsHovered(true);
    const handleLeave = () => setIsHovered(false);

    parent.style.position = parent.style.position || 'relative';
    parent.addEventListener('mousemove', handleMouseMove);
    parent.addEventListener('mouseenter', handleEnter);
    parent.addEventListener('mouseleave', handleLeave);

    return () => {
      parent.removeEventListener('mousemove', handleMouseMove);
      parent.removeEventListener('mouseenter', handleEnter);
      parent.removeEventListener('mouseleave', handleLeave);
    };
  }, [mouseX, mouseY, size]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] transition-opacity duration-200"
      style={{ opacity: isHovered ? 1 : 0 }}
    >
      <motion.div
        className={`absolute rounded-full ${className}`}
        style={{
          width: size,
          height: size,
          translateX: spotlightX,
          translateY: spotlightY,
        }}
      />
    </div>
  );
}

type AuthPageProps = {
  onBack: () => void;
};

export default function AuthPage({ onBack }: AuthPageProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fn = mode === 'signin' ? signIn : signUp;
    const { error } = await fn(email, password);
    setLoading(false);
    if (error) setError(error);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-neutral-100">
      <Spotlight
        className="bg-[#EE3842]/30 blur-3xl"
        size={500}
        springOptions={{ bounce: 0.2, duration: 0.3 }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(238,56,66,0.15),_transparent_55%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-[#EE3842]/10 blur-[120px]" />

      <div className="relative flex min-h-screen flex-col">
        <button onClick={onBack} className="absolute left-6 top-6 inline-flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-[#EE3842]">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EE3842] text-black">
                <BookOpen className="h-7 w-7" strokeWidth={2.5} />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">
                {mode === 'signin' ? 'Welcome back' : 'Create your account'}
              </h1>
              <p className="mt-2 text-sm text-neutral-400">
                {mode === 'signin' ? 'Pick up right where you left off.' : 'Start learning the skills that matter.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="relative z-10 space-y-5 rounded-2xl border border-neutral-800 bg-neutral-950 p-8">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-300">Email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-neutral-700 bg-black/50 py-3 pl-11 pr-4 text-sm text-neutral-100 placeholder-neutral-600 transition-colors focus:border-[#EE3842]/60 focus:outline-none focus:ring-1 focus:ring-[#EE3842]/40"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-300">Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-neutral-700 bg-black/50 py-3 pl-11 pr-4 text-sm text-neutral-100 placeholder-neutral-600 transition-colors focus:border-[#EE3842]/60 focus:outline-none focus:ring-1 focus:ring-[#EE3842]/40"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#EE3842] py-3.5 text-sm font-semibold text-black transition-all hover:bg-[#f1555d] disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {mode === 'signin' ? 'Sign in' : 'Create account'}
                    <User className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-neutral-400">
              {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); }}
                className="font-semibold text-[#EE3842] transition-colors hover:text-[#f1555d]"
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}