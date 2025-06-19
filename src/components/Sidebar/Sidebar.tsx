import { useLocation, useNavigate } from "react-router-dom";
import { 
  RiDashboard3Fill,
  RiGroupFill,
  RiTeamFill,
<<<<<<< HEAD
  RiFileListFill
=======
  RiFileListFill,
  RiBook2Line,
  RiGroupLine,
  RiTrophyLine,
  RiMenuLine
>>>>>>> 2067b97 (add)
} from "react-icons/ri";

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: string | number;
  badgeColor?: string;
}

interface User {
  name: string;
  avatar: string;
}

interface SidebarProps {
  collapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
<<<<<<< HEAD
=======

>>>>>>> 2067b97 (add)
  // Menu items based on role
  const role = localStorage.getItem('role')?.toLocaleLowerCase();
  const menuItems: MenuItem[] = role === 'teacher'
    ? [
        {
          icon: <RiDashboard3Fill size={24} className="text-blue-400" />, 
          label: "Dashboard", 
          path: "/dashboard"
        },{
          icon: <RiTeamFill size={24} className="text-amber-400" />, 
          label: "Guruhlar", 
          path: "/groups"
        },
        {
          icon: <RiFileListFill size={24} className="text-rose-400" />, 
          label: "Testlar", 
          path: "/tests"
        },
      ]
    : [
        {
          icon: <RiDashboard3Fill size={24} className="text-blue-400" />, 
          label: "Dashboard", 
          path: "/dashboard"
        },
        {
          icon: <RiGroupFill size={24} className="text-emerald-400" />, 
          label: "Foydalanuvchilar", 
          path: "/users"
        },
        {
          icon: <RiTeamFill size={24} className="text-amber-400" />, 
          label: "Guruhlar", 
          path: "/groups"
        },
        {
          icon: <RiFileListFill size={24} className="text-rose-400" />, 
          label: "Testlar", 
          path: "/tests"
        },
<<<<<<< HEAD
        // {
        //   icon: <RiUploadCloudFill size={24} className="text-cyan-400" />, 
        //   label: "Upload", 
        //   path: "/upload"
        // }
=======
>>>>>>> 2067b97 (add)
      ];

  const user: User = {
    name: role === 'SUPER_ADMIN' ? 'Admin' : 'Teacher',
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <aside 
      className={`
<<<<<<< HEAD
        bg-gradient-to-b from-white/90 to-blue-50/60 backdrop-blur-xl border-r border-gray-100
        flex flex-col h-screen transition-all duration-300 shadow-xl
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* Top: Logo & Title */}
      <div className="flex items-center justify-center px-6 py-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
            {collapsed && (
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent tracking-wide">
              itech
            </span>
          )}
          {!collapsed && (
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent tracking-wide">
              itech ADMIN
            </span>
          )}
        </div>
=======
        h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-400 to-pink-400 rounded-xl flex items-center justify-center text-white font-bold text-lg">M</div>
          {!collapsed && <span className="font-bold text-xl text-gray-800">Modernize</span>}
        </div>
        {/* Collapse button faqat desktopda ko'rsatiladi */}
>>>>>>> 2067b97 (add)
      </div>

      {/* Menu */}
      <nav className="flex-1 flex flex-col gap-2 px-2 py-6">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div key={item.label} className="relative group">
              <button
                onClick={() => handleNavigation(item.path)}
                className={`
                  flex items-center gap-4 w-full px-4 py-3 rounded-xl font-medium text-base transition-all duration-300
                  shadow-sm hover:shadow-lg
<<<<<<< HEAD
                  bg-white/80 hover:bg-gradient-to-r hover:from-blue-100 hover:to-violet-100
                  border border-transparent hover:border-blue-200
                  ${isActive ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-xl" : "text-gray-700"}
=======
                  ${isActive ? "bg-gradient-to-r from-indigo-400 to-pink-400 text-white shadow-xl" : "text-gray-700 bg-white/80 hover:bg-gradient-to-r hover:from-indigo-100 hover:to-pink-100"}
                  border border-transparent hover:border-indigo-200
>>>>>>> 2067b97 (add)
                  ${collapsed ? "justify-center px-0" : ""}
                  hover:-translate-y-1
                  cursor-pointer
                `}
                aria-current={isActive ? "page" : undefined}
              >
                <span className={`transition-all duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left whitespace-nowrap">{item.label}</span>
                    {item.badge && (
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded-full text-white ${item.badgeColor || "bg-gray-400"}`}>{item.badge}</span>
                    )}
                  </>
                )}
              </button>
              {/* Tooltip for collapsed sidebar */}
              {collapsed && (
                <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-20 px-3 py-1 rounded-lg bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg">
                  {item.label}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* User info */}
      <div 
        className={`
<<<<<<< HEAD
          border-t border-gray-100 px-6 py-6 
=======
          p-4 
>>>>>>> 2067b97 (add)
          flex items-center gap-3 
          ${collapsed ? "justify-center" : ""}
        `}
      >
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="w-10 h-10 rounded-full shadow-md ring-2 ring-blue-100" 
        />
        {!collapsed && (
          <span className="font-medium text-gray-700 text-base">
            {user.name}
          </span>
        )}
      </div>
    </aside>
  );
};
        