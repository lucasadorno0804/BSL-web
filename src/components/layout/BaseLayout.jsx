import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function BaseLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex bg-surface min-h-screen text-on-surface relative">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      {/* Container Principal */}
      <div className="flex-1 w-full md:ml-64 min-w-0 flex flex-col">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="mt-16 flex-1 overflow-x-hidden pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
