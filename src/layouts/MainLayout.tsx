import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/authSlice';
import {
  UserOutlined,
  BookOutlined,
  TeamOutlined,
  FileTextOutlined,
  BarChartOutlined,
  LogoutOutlined,
  MenuOutlined,
} from '@ant-design/icons';

const MainLayout: React.FC = () => {
  const [collapsed, _] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setDrawerVisible(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const teacherMenuItems = [
    {
      key: '/groups',
      icon: <TeamOutlined />,
      label: 'Guruhlar',
    },
    {
      key: '/tests',
      icon: <FileTextOutlined />,
      label: 'Testlar',
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Profil',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Chiqish',
      onClick: handleLogout,
    },
  ];

  const studentMenuItems = [
    {
      key: '/student/tests',
      icon: <BookOutlined />,
      label: 'Testlar',
    },
    {
      key: '/student/results',
      icon: <BarChartOutlined />,
      label: 'Natijalar',
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Profil',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Chiqish',
      onClick: handleLogout,
    },
  ];

  const currentPath = location.pathname;
  const menuItems = user?.role === 'TEACHER' ? teacherMenuItems : studentMenuItems;
  const currentMenuItem = menuItems.find(item => item.key === currentPath);

  const siderContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="text-xl font-bold">
          <span className="text-gray-800">iTech</span>
          <span className="text-orange-500"> Academy</span>
        </div>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              if (item.onClick) {
                item.onClick();
              } else {
                navigate(item.key);
                if (mobileView) {
                  setDrawerVisible(false);
                }
              }
            }}
            className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              currentPath === item.key
                ? 'bg-green-50 text-green-700 border-l-4 border-green-500'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Drawer */}
      {mobileView && (
        <div
          className={`fixed inset-0 z-40 transition-opacity duration-300 ${
            drawerVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setDrawerVisible(false)}
          />
          <div
            className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ${
              drawerVisible ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            {siderContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      {!mobileView && (
        <div
          className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transition-all duration-300 ${
            collapsed ? '-translate-x-48' : 'translate-x-0'
          }`}
        >
          {siderContent}
        </div>
      )}

      <div className={`${mobileView ? '' : 'ml-64'} transition-all duration-300`}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              {mobileView && (
                <button
                  onClick={() => setDrawerVisible(true)}
                  className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                  <MenuOutlined />
                </button>
              )}
              <h1 className="ml-4 text-lg font-semibold text-gray-800">
                {currentMenuItem?.label}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 md:p-6">
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 min-h-[calc(100vh-8rem)]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;