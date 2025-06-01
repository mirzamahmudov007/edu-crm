import { useState } from 'react';
import { 
  RiMenuUnfoldLine,
  RiNotification3Line,
  RiLogoutBoxLine,
  RiSettings4Line,
  RiUserLine,
  RiDashboard3Fill
} from "react-icons/ri";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);



  return (
    <header className="bg-gradient-to-r from-white/90 to-blue-50/60 backdrop-blur-xl border-b border-gray-100 h-20 px-8 flex items-center justify-between shadow-md">
     
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl bg-white/80 hover:bg-blue-100 transition-colors text-blue-500 shadow-sm border border-transparent hover:border-blue-200"
          aria-label="Toggle menu"
        >
          <RiMenuUnfoldLine size={22} />
        </button>
        <RiDashboard3Fill size={22} className="text-blue-400" />
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent tracking-wide">
          Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="p-2 rounded-xl bg-white/80 hover:bg-blue-100 transition-colors text-blue-500 shadow-sm border border-transparent hover:border-blue-200 relative"
          aria-label="Notifications"
        >
          <RiNotification3Line size={24} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-2 rounded-xl bg-white/80 hover:bg-blue-100 transition-colors text-blue-500 shadow-sm border border-transparent hover:border-blue-200"
            aria-label="User profile"
          >
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="User avatar"
              className="w-9 h-9 rounded-full ring-2 ring-blue-100 shadow"
            />
            <span className="font-semibold text-gray-700 hidden sm:block">Admin</span>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white/95 rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-fade-in">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="User avatar"
                  className="w-10 h-10 rounded-full ring-2 ring-blue-100 shadow"
                />
                <div>
                  <p className="text-base font-semibold text-gray-900">Admin</p>
                  <p className="text-xs text-gray-500">admin@itech.uz</p>
                </div>
              </div>
              <a href="/profile" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-xl transition">
                <RiUserLine size={20} className="text-blue-400" />
                <span>Profil</span>
              </a>
              <a href="/settings" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-xl transition">
                <RiSettings4Line size={20} className="text-violet-400" />
                <span>Sozlamalar</span>
              </a>
              <hr className="my-2" />
              <a href="/logout" className="flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-blue-50 rounded-xl transition">
                <RiLogoutBoxLine size={20} className="text-rose-400" />
                <span>Chiqish</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}; 