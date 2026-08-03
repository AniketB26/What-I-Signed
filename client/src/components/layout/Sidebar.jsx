import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Search,
  GitCompare,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { authService } from '../../services/auth';
import VaultMark from './VaultMark';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/documents', label: 'Documents', icon: FileText },
  { to: '/query', label: 'Query', icon: Search },
  { to: '/compare', label: 'Compare', icon: GitCompare },
  { to: '/alerts', label: 'Alerts', icon: Bell },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout: logoutStore } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // Continue with logout even if API fails
    }
    logoutStore();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <aside
      className={`
        glass-strong
        fixed left-0 top-0 h-screen z-40
        flex flex-col
        rounded-none border-y-0 border-l-0
        border-r border-white/45
        transition-all duration-300 ease-out
        ${collapsed ? 'w-[72px]' : 'w-64'}
      `}
    >
      {/* Logo */}
      <div
        className={`flex items-center gap-3 py-6 border-b border-white/40 ${
          collapsed ? 'px-3 justify-center' : 'px-5'
        }`}
      >
        <VaultMark size={collapsed ? 38 : 42} />
        {!collapsed && (
          <div className="animate-fadeIn min-w-0">
            <h1 className="font-display text-[15px] font-semibold text-warm-900 leading-tight whitespace-nowrap">
              What I Signed
            </h1>
            <p className="text-[10px] tracking-[0.14em] uppercase text-mocha-600 mt-0.5 whitespace-nowrap">
              Agreement Vault
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto scrollbar-thin">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) => `
              relative flex items-center gap-3 rounded-xl
              text-sm font-medium
              transition-all duration-200 group
              ${collapsed ? 'justify-center px-0 py-2.5' : 'px-3.5 py-2.5'}
              ${isActive
                ? 'glass-soft text-warm-900 shadow-glass-sm'
                : 'text-mocha-700 hover:text-warm-900 hover:bg-white/35'
              }
            `}
          >
            {({ isActive }) => (
              <>
                {/* Bronze marker on the active item */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-gold-500" />
                )}
                <Icon
                  size={19}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  className={`flex-shrink-0 transition-all duration-200 ${
                    isActive ? 'text-gold-600' : 'group-hover:scale-110'
                  }`}
                />
                {!collapsed && <span className="animate-fadeIn">{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="hidden md:flex items-center justify-center mx-3 mb-2 py-2 rounded-xl text-mocha-600 hover:text-warm-900 hover:bg-white/40 transition-all"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {/* User Section */}
      <div className="px-3 py-4 border-t border-white/40">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="flex-shrink-0 h-9 w-9 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white font-semibold text-sm shadow-glass-sm ring-1 ring-white/50">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0 animate-fadeIn">
                <p className="text-sm font-medium text-warm-900 truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-mocha-600 truncate">{user?.email || ''}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex-shrink-0 p-2 rounded-lg text-mocha-500 hover:text-red-600 hover:bg-red-50/70 transition-all"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
