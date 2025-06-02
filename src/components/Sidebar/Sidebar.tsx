import { useLocation, useNavigate } from "react-router-dom";
import { 
  RiDashboard3Fill,
  RiGroupFill,
  RiTeamFill,
  RiFileListFill,
  RiUploadCloudFill
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
  // Menu items based on role
  const role = localStorage.getItem('role')?.toLocaleLowerCase();
  const menuItems: MenuItem[] = role === 'teacher'
    ? [
        {
          icon: <RiDashboard3Fill size={24} className="text-blue-400" />, 
          label: "Dashboard", 
          path: "/dashboard"
        }
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
          label: "Gruhlar", 
          path: "/groups"
        },
        {
          icon: <RiFileListFill size={24} className="text-rose-400" />, 
          label: "Testlar", 
          path: "/tests"
        },
        {
          icon: <RiUploadCloudFill size={24} className="text-cyan-400" />, 
          label: "Upload", 
          path: "/upload"
        }
      ];

  const user: User = {
    name: role === 'admin' ? 'Admin' : 'Teacher',
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <aside 
      className={`
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
              iTech
            </span>
          )}
          {!collapsed && (
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent tracking-wide">
              iTech ADMIN
            </span>
          )}
        </div>
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
                  bg-white/80 hover:bg-gradient-to-r hover:from-blue-100 hover:to-violet-100
                  border border-transparent hover:border-blue-200
                  ${isActive ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-xl" : "text-gray-700"}
                  ${collapsed ? "justify-center px-0" : ""}
                  hover:-translate-y-1
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
          border-t border-gray-100 px-6 py-6 
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
        