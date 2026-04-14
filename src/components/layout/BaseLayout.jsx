import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function BaseLayout() {
  return (
    <div className="flex bg-surface min-h-screen text-on-surface">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar />
        <main className="mt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
