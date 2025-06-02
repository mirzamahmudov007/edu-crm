import { createBrowserRouter, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Dashboard from '../pages/dashboard';
import NotFound from '../pages/NotFound';
import { MainLayout } from '../layouts/MainLayout';
import Login from '../pages/login';
import Users from '../pages/users';
import Groups from '../pages/groups';

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
    children: [
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
        element: <div>Tests Page</div>,
      },
      {
        path: 'upload',
        element: <div>Upload Page</div>,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router; 