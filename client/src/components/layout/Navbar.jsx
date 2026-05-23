import { Menu, Shield, X } from 'lucide-react';

export default function Navbar({ onMenuToggle, isMenuOpen }) {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 glass-strong border-b border-slate-700/50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Shield size={16} className="text-white" />
          </div>
          <h1 className="text-sm font-bold gradient-text">What Did I Sign?</h1>
        </div>
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
}
