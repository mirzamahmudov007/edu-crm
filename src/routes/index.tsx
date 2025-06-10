import { createBrowserRouter, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Dashboard from '../pages/dashboard';
import NotFound from '../pages/NotFound';
import { MainLayout } from '../layouts/MainLayout';
import Login from '../pages/login';
import Users from '../pages/users';
import Groups from '../pages/groups';
import Tests from '../pages/tests';

// Get user role from localStorage (or default to 'admin')
let role = 'admin';
try {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user && user.role) role = user.role;
} catch {}

const adminRoutes = [
  {
    path: 'dashboard',
    element: <Dashboard/>,
  },
  {
    path: 'users',
    element: <Users/>,
  },
  {
    path: 'groups',
    element: <Groups/>,
  },
  {
    path: 'tests',
    element: <Tests/>,
  },
  {
    path: 'upload',
    element: <div>Upload Page</div>,
  },
];

const teacherRoutes = [
  {
    path: 'dashboard',
    element: <Dashboard/>,
  },
  {
    path: 'groups',
    element: <Groups/>,
  },
  {
    path: 'tests',
    element: <Tests/>,
  },
];

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <MainLayout>
          <div />
        </MainLayout>
      </PrivateRoute>
    ),
    children: role === 'teacher' ? teacherRoutes : adminRoutes,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router; 