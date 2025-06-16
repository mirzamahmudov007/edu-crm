import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../pages/login';
import Dashboard from '../pages/dashboard';
import Tests from '../pages/tests';
import TestDetails from '../pages/tests/[id]';
import Users from '../pages/users';
import Groups from '../pages/groups';
import NotFound from '../pages/NotFound';
import { MainLayout } from '../layouts/MainLayout';
import UserDetails from '../pages/users/UserDetails';
import GroupDetails from '../pages/groups/GroupDetails';
import TestQuestions from '../pages/tests/TestQuestions';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" />;
};

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
    path: 'users/:id',
    element: <UserDetails />,
  },
  {
    path: 'groups',
    element: <Groups/>,
  },
  {
    path: 'groups/:id',
    element: <GroupDetails />,
  },
  {
    path: 'tests',
    element: <Tests/>,
  },
  {
    path: 'tests/:id',
    element: <TestDetails />,
  },
  {
    path: 'tests/:id/questions',
    element: <TestQuestions />,
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
    path: 'groups/:id',
    element: <GroupDetails />,
  },
  {
    path: 'tests',
    element: <Tests/>,
  },
  {
    path: 'tests/:id',
    element: <TestDetails />,
  },
  {
    path: 'tests/:id/questions',
    element: <TestQuestions />,
  },
];

const router = createBrowserRouter([
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