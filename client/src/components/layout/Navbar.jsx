import { Menu, X } from 'lucide-react';

export default function Navbar({ onMenuToggle, isMenuOpen }) {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-cream-300/60 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-700 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <h1 className="text-sm font-bold text-warm-900">What Did I Sign?</h1>
        </div>
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-warm-500 hover:text-warm-900 hover:bg-cream-200/60 transition-all"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
}
