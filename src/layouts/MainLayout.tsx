import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme, Drawer, Button } from 'antd';
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

const { Header, Content, Sider } = Layout;

const MainLayout: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [collapsed, setCollapsed] = useState(false);
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
    <>
      <div style={{ 
        padding: '16px 0', 
        borderBottom: '1px solid #f0f0f0',
        margin: '0 16px 16px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{ 
          fontSize: '18px', 
          fontWeight: 'bold',
          color: '#ff6b00'
        }}>
          <span style={{ color: '#333' }}>iTech</span> Academy
        </div>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[currentPath]}
        style={{ 
          border: 'none',
        }}
        items={menuItems.map(item => ({
          ...item,
          style: currentPath === item.key ? {
            backgroundColor: 'rgba(0, 128, 0, 0.1)',
            color: 'green',
            fontWeight: 'bold',
            borderLeft: '3px solid green'
          } : {}
        }))}
        onClick={({ key }) => {
          if (key !== 'logout') {
            navigate(key);
          }
          if (mobileView) {
            setDrawerVisible(false);
          }
        }}
      />
    </>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Mobile Drawer */}
      {mobileView && (
        <Drawer
          title="Menu"
          placement="left"
          closable={true}
          onClose={() => setDrawerVisible(false)}
          visible={drawerVisible}
          width={250}
          bodyStyle={{ padding: 0 }}
        >
          {siderContent}
        </Drawer>
      )}
      
      {/* Desktop Sider */}
      {!mobileView && (
        <Sider 
          width={250} 
          style={{ 
            background: 'white',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            zIndex: 10,
            height: '100vh',
            position: 'fixed',
            left: 0,
          }}
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          collapsible
          breakpoint="md"
        >
          {siderContent}
        </Sider>
      )}
      
      <Layout style={{ marginLeft: mobileView ? 0 : 250 }}>
        <Header style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: 'white',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          padding: '0 16px',
          position: 'sticky',
          top: 0,
          zIndex: 9,
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {mobileView && (
              <Button 
                type="text" 
                icon={<MenuOutlined />} 
                onClick={() => setDrawerVisible(true)}
                style={{ marginRight: 16 }}
              />
            )}
            <div style={{ fontSize: mobileView ? '16px' : '18px', color: '#333' }}>
              {currentMenuItem?.label}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: '#ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 'bold'
            }}>
              {user?.fullName?.charAt(0) || 'U'}
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: mobileView ? '16px 8px' : '24px 16px',
            padding: mobileView ? '16px' : '24px',
            background: colorBgContainer,
            borderRadius: '4px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            minHeight: 'calc(100vh - 150px)',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;