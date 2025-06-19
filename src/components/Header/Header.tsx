import { useState } from 'react';
import { 
  RiMenuUnfoldLine,
  RiNotification3Line,
  RiLogoutBoxLine,
  RiSettings4Line,
  RiUserLine,
<<<<<<< HEAD
  RiDashboard3Fill
=======
  RiDashboard3Fill,
  RiShoppingCart2Line,
  RiSearchLine
>>>>>>> 2067b97 (add)
} from "react-icons/ri";
import { useLocation, useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/users': 'Foydalanuvchilar',
  '/groups': 'Guruhlar',
  '/tests': 'Testlar',
  '/upload': 'Upload',
};

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'Dashboard';
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  }

  return (
<<<<<<< HEAD
    <header className="bg-gradient-to-r from-white/90 to-blue-50/60 backdrop-blur-xl border-b border-gray-100 h-16 md:h-20 px-4 md:px-8 flex items-center justify-between shadow-md">
      {/* Left: Menu & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl bg-white/80 hover:bg-blue-100 transition-colors text-blue-500 shadow-sm border border-transparent hover:border-blue-200"
          aria-label="Toggle menu"
        >
          <RiMenuUnfoldLine size={20} className="md:hidden" />
          <RiMenuUnfoldLine size={22} className="hidden md:block" />
        </button>
        <div className="flex items-center gap-2">
          <RiDashboard3Fill size={20} className="text-blue-400 md:hidden" />
          <RiDashboard3Fill size={22} className="text-blue-400 hidden md:block" />
          <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent tracking-wide">
            {title}
          </h1>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Notifications */}
        <button
          className="p-2 rounded-xl bg-white/80 hover:bg-blue-100 transition-colors text-gray-600 hover:text-blue-500 shadow-sm border border-transparent hover:border-blue-200 relative"
          aria-label="Notifications"
        >
          <RiNotification3Line size={20} className="md:hidden" />
          <RiNotification3Line size={22} className="hidden md:block" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="p-2 rounded-xl bg-white/80 hover:bg-blue-100 transition-colors text-gray-600 hover:text-blue-500 shadow-sm border border-transparent hover:border-blue-200"
            aria-label="Profile menu"
          >
            <RiUserLine size={20} className="md:hidden" />
            <RiUserLine size={22} className="hidden md:block" />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg border border-gray-100 py-1 z-50">
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <RiUserLine size={18} />
                Profil
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <RiSettings4Line size={18} />
                Sozlamalar
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 z-50" onClick={() => logout()}>
                <RiLogoutBoxLine size={18} />
                Chiqish
              </button>
            </div>
          )}
=======
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Qidirish..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-100 focus:outline-none focus:border-indigo-400"
          />
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={20} />
        </div>
      </div>
      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-600 hover:bg-indigo-50 rounded-xl transition-colors relative">
          <RiShoppingCart2Line size={20} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">0</span>
        </button>
        <button className="p-2 text-gray-600 hover:bg-indigo-50 rounded-xl transition-colors relative">
          <RiNotification3Line size={20} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-400 to-pink-400 flex items-center justify-center text-white font-bold">
          M
>>>>>>> 2067b97 (add)
        </div>
      </div>
    </header>
  );
}; 