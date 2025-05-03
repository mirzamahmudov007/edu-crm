import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { App as AntApp } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Groups from './pages/Groups/index';
import CreateTest from './pages/CreateTest/index';
import TestResults from './pages/TestResults';
import Test from './pages/Test';
import StudentTests from './pages/StudentTests/index';
import StudentResults from './pages/StudentResults';
import TestResultDetails from './components/TestResultDetails';
import TeacherResults from './pages/TeacherResults';
import TeacherResultDetails from './pages/TeacherResultDetails';

// Admin pages
import AdminUsers from './pages/admin/Users';
import AdminGroups from './pages/admin/Groups';
import AdminTests from './pages/admin/Tests';
import { PrivateRoute } from './components/PrivateRoute';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Something went wrong.</h1>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

const App: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <AntApp>
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <PrivateRoute>
                  {user?.role === 'ADMIN' ? (
                    <AdminLayout />
                  ) : (
                    <Navigate to="/login" replace />
                  )}
                </PrivateRoute>
              }
            >
              <Route index element={<Navigate to="users" replace />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="groups" element={<AdminGroups />} />
              <Route path="tests" element={<AdminTests />} />
              <Route path="settings" element={<Profile />} />
            </Route>

            {/* Teacher and Student Routes */}
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  {user?.role === 'ADMIN' ? (
                    <Navigate to="/admin/users" replace />
                  ) : (
                    <MainLayout />
                  )}
                </PrivateRoute>
              }
            >
              {/* Teacher Routes */}
              {user?.role === 'TEACHER' && (
                <>
                  <Route index element={<Navigate to="/groups" replace />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="groups" element={<Groups />} />
                  <Route path="tests" element={<AdminTests />} />
                  <Route path="tests/create" element={<CreateTest />} />
                  <Route path="tests/:testId/results" element={<TestResults />} />
                  <Route path="teacher/results" element={<TeacherResults />} />
                  <Route path="teacher/results/:resultId" element={<TeacherResultDetails />} />
                </>
              )}

              {/* Student Routes */}
              {user?.role === 'STUDENT' && (
                <>
                  <Route index element={<Navigate to="/student/tests" replace />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="student/tests" element={<StudentTests />} />
                  <Route path="test/:testAccessId" element={<Test />} />
                  <Route path="student/results" element={<StudentResults />} />
                  <Route path="student/results/:resultId" element={<TestResultDetails />} />
                </>
              )}
            </Route>
          </Routes>
        </Router>
      </ErrorBoundary>
    </AntApp>
  );
};

export default App; 