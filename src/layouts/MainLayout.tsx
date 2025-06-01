import { useState } from 'react';
import { Header } from '../components/Header/Header';
import { Sidebar } from '../components/Sidebar/Sidebar';

export const MainLayout: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        collapsed={isSidebarCollapsed} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}; 
