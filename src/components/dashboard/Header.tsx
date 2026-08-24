import { useState } from 'react';
import { BookOpen, Flame, HelpCircle, LayoutGrid, TrendingUp, LogOut, User } from 'lucide-react';
import { useAuth } from '@/lib/auth';

type HeaderProps = {
  streak: number;
  xp: number;
};

export default function Header({ streak, xp }: HeaderProps) {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  const navItems = [
    { label: 'Courses', icon: LayoutGrid },
    { label: 'My Progress', icon: TrendingUp },
    { label: 'Help Centre', icon: HelpCircle },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-yellow-500/10 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-400 text-black">
            <BookOpen className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-tight">Recall</span>
        </div>

        {/* Center nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <button
              key={item.label}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-neutral-300 transition-colors hover:bg-yellow-500/5 hover:text-yellow-400"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-1.5 rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-3 py-1.5 sm:flex">
            <span className="text-base">🔥</span>
            <span className="text-sm font-bold text-yellow-400">{streak}</span>
          </div>
          <div className="hidden items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 sm:flex">
            <span className="text-sm font-semibold text-neutral-200">{xp.toLocaleString()}</span>
            <span className="text-xs text-neutral-500">XP</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900 px-2 py-1.5 transition-colors hover:border-yellow-500/40"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-400 text-sm font-bold text-black">
                {(user?.email ?? 'U')[0].toUpperCase()}
              </div>
              <span className="hidden text-sm font-medium text-neutral-200 sm:block">Profile</span>
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-xl border border-neutral-700 bg-neutral-950 py-1 shadow-xl">
                  <div className="border-b border-neutral-800 px-4 py-3">
                    <p className="truncate text-sm font-medium text-neutral-200">{user?.email}</p>
                    <p className="text-xs text-neutral-500">Signed in</p>
                  </div>
                  <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 transition-colors hover:bg-yellow-500/5 hover:text-yellow-400">
                    <User className="h-4 w-4" /> My profile
                  </button>
                  <button
                    onClick={() => signOut()}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 transition-colors hover:bg-red-500/5 hover:text-red-400"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              </>
            )}
          </div>

          <button onClick={() => setMobileNav(!mobileNav)} className="md:hidden">
            <div className="space-y-1.5">
              <div className={`h-0.5 w-5 bg-yellow-400 transition-transform ${mobileNav ? 'translate-y-2 rotate-45' : ''}`} />
              <div className={`h-0.5 w-5 bg-yellow-400 transition-opacity ${mobileNav ? 'opacity-0' : ''}`} />
              <div className={`h-0.5 w-5 bg-yellow-400 transition-transform ${mobileNav ? '-translate-y-2 -rotate-45' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {mobileNav && (
        <div className="border-t border-yellow-500/10 bg-black px-4 py-3 md:hidden">
          {navItems.map((item) => (
            <button key={item.label} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-300 hover:text-yellow-400">
              <item.icon className="h-4 w-4" /> {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
