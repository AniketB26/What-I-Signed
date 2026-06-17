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
        fixed left-0 top-0 h-screen z-40
        bg-white/95 backdrop-blur-md
        flex flex-col
        transition-all duration-300 ease-out
        ${collapsed ? 'w-[72px]' : 'w-64'}
        border-r border-cream-300/60
        shadow-sm
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-6 border-b border-cream-300/40">
        <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-emerald-700 flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-lg">W</span>
        </div>
        {!collapsed && (
          <div className="animate-fadeIn">
            <h1 className="text-sm font-bold text-warm-900 whitespace-nowrap">
              What Did I Sign?
            </h1>
            <p className="text-[10px] text-warm-500 whitespace-nowrap">Agreement Vault</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl
              text-sm font-medium
              transition-all duration-200 group
              ${isActive
                ? 'bg-warm-700 text-white shadow-sm'
                : 'text-warm-600 hover:text-warm-900 hover:bg-cream-200/60'
              }
            `}
          >
            <Icon size={20} className="flex-shrink-0 group-hover:scale-110 transition-transform" />
            {!collapsed && <span className="animate-fadeIn">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="hidden md:flex items-center justify-center mx-3 mb-2 py-2 rounded-xl text-warm-400 hover:text-warm-700 hover:bg-cream-200/60 transition-all"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {/* User Section */}
      <div className="px-3 py-4 border-t border-cream-300/40">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 h-9 w-9 rounded-full bg-warm-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 animate-fadeIn">
              <p className="text-sm font-medium text-warm-900 truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-warm-500 truncate">
                {user?.email || ''}
              </p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex-shrink-0 p-2 rounded-lg text-warm-400 hover:text-red-600 hover:bg-red-50 transition-all"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
