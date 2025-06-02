import { useState, useEffect } from 'react';
import { Header } from '../components/Header/Header';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    // Initial check
    checkMobile();

    // Add event listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Handle click outside on mobile
  const handleClickOutside = () => {
    if (isMobile && !sidebarCollapsed) {
      setSidebarCollapsed(true);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Overlay for mobile */}
      {isMobile && !sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={handleClickOutside}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative z-30
        transition-all duration-300 ease-in-out
        ${isMobile ? (sidebarCollapsed ? '-translate-x-full' : 'translate-x-0') : ''}
      `}>
        <Sidebar collapsed={sidebarCollapsed} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        <Header onMenuClick={handleSidebarToggle} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}; 
