import type { ReactNode } from 'react';
import type React from 'react';
import { Outlet } from 'react-router-dom';

interface AuthLayoutProps {
  children?: ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-violet-50">
      <div className="w-full max-w-md p-8">
        <Outlet />
      </div>
    </div>
  );
}; 