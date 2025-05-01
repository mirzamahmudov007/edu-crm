import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface PrivateRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
  const { token, user } = useSelector((state: RootState) => state.auth);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (roles && user && !roles.includes(user.role)) {
    // Redirect to appropriate page based on user role
    switch (user.role) {
      case 'TEACHER':
        return <Navigate to="/groups" />;
      case 'STUDENT':
        return <Navigate to="/student/tests" />;
      case 'ADMIN':
        return <Navigate to="/admin" />;
      default:
        return <Navigate to="/login" />;
    }
  }

  return <>{children}</>;
}; 