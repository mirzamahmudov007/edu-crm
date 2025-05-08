import React from 'react';
import { Layout, Menu, theme } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/authSlice';
import {
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  LogoutOutlined,
  DashboardOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

const AdminLayout: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Boshqaruv Paneli',
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Foydalanuvchilar',
    },
    {
      key: 'groups',
      icon: <TeamOutlined />,
      label: 'Guruhlar',
    },
    {
      key: 'tests',
      icon: <FileTextOutlined />,
      label: 'Testlar',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Sozlamalar',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Chiqish',
      onClick: handleLogout,
    },
  ];

  const currentPath = location.pathname.split('/').pop() || 'dashboard';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        width={200} 
        style={{ 
          background: 'white',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          zIndex: 10,
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
      >
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
              navigate(`/admin/${key}`);
            }
          }}
        />
      </Sider>
      <Layout style={{ marginLeft: 200 }}>
        <Header style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: 'white',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          padding: '0 24px'
        }}>
          <div style={{ fontSize: '18px', color: '#333' }}>
            {menuItems.find(item => item.key === currentPath)?.label}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: '#ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {user?.fullName?.charAt(0) || 'U'}
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px',
            padding: 24,
            background: colorBgContainer,
            borderRadius: '4px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;