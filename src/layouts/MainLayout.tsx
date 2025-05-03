import React from 'react';
import { Layout, Menu, theme } from 'antd';
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
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

const MainLayout: React.FC = () => {
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

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ color: 'white', fontSize: '20px' }}>ITECH Test Platformasi</div>
        <div style={{ color: 'white' }}>{user?.fullName}</div>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            style={{ height: '100%', borderRight: 0 }}
            items={user?.role === 'TEACHER' ? teacherMenuItems : studentMenuItems}
            onClick={({ key }) => {
              if (key !== 'logout') {
                navigate(key);
              }
            }}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 