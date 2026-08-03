import { Menu, X } from 'lucide-react';
import VaultMark from './VaultMark';

export default function Navbar({ onMenuToggle, isMenuOpen }) {
  return (
    <header className="glass-strong md:hidden fixed top-0 left-0 right-0 z-50 rounded-none border-x-0 border-t-0 border-b border-white/45">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <VaultMark size={34} />
          <div className="min-w-0">
            <h1 className="font-display text-sm font-semibold text-warm-900 leading-tight">
              What I Signed
            </h1>
            <p className="text-[9px] tracking-[0.14em] uppercase text-mocha-600">
              Agreement Vault
            </p>
          </div>
        </div>
        <button
          onClick={onMenuToggle}
          className="glass-chip p-2 rounded-xl text-mocha-700 hover:text-warm-900"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
}
