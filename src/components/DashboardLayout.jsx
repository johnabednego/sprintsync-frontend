// src/components/DashboardLayout.jsx
import { useState } from 'react';
import { useAuth }   from '../contexts/AuthContext';
import Sidebar       from './Sidebar';
import Navbar        from './Navbar';

export default function DashboardLayout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        <Navbar onToggleSidebar={() => setSidebarOpen(o => !o)} />

        {/* 
          Add `sm:ml-64` here so on screens >= sm (where sidebar is always visible at width 16rem)
          content shifts right by that width. Also include pt-16 to clear the fixed navbar.
        */}
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-800 pt-20 p-4 ml-0 sm:ml-64">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            Welcome back, {user.firstName} {user.lastName}!
          </h2>
        </main>
      </div>
    </div>
  );
}
