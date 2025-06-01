import {  Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { lazy } from 'react';


const Dashboard = lazy(() => import('./pages/dashboard'))
const Users = () => <div>Users Page</div>;
const AddUser = () => <div>Add User Page</div>;
const Settings = () => <div>Settings Page</div>;

function App() {
  return (
      <MainLayout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/add" element={<AddUser />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </MainLayout>
  );
}

export default App;
