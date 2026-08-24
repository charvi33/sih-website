import { BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-900 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-400 text-black">
              <BookOpen className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <span className="font-bold">Recall</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-neutral-400">
            <a href="#" className="transition-colors hover:text-yellow-400">About</a>
            <a href="#" className="transition-colors hover:text-yellow-400">Send feedback</a>
            <a href="#" className="transition-colors hover:text-yellow-400">Help Centre</a>
            <a href="#" className="transition-colors hover:text-yellow-400">Privacy</a>
            <a href="#" className="transition-colors hover:text-yellow-400">Terms</a>
          </div>
          <p className="text-sm text-neutral-500">© 2026 Recall</p>
        </div>
      </div>
    </footer>
  );
}
