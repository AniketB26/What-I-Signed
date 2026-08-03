import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import VaultBackdrop from './VaultBackdrop';

export default function PageWrapper() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <VaultBackdrop />

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile Navbar + Sidebar overlay */}
      <Navbar
        onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        isMenuOpen={mobileMenuOpen}
      />

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30">
          <div
            className="absolute inset-0 bg-mocha-900/30 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10">
            <Sidebar collapsed={false} onToggle={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main
        className={`
          transition-all duration-300 ease-out
          min-h-screen
          pt-16 md:pt-0
          ${sidebarCollapsed ? 'md:ml-[72px]' : 'md:ml-64'}
        `}
      >
        <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
