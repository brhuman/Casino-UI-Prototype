import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BottomTabBar } from './BottomTabBar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen w-full bg-black overflow-hidden relative">
      <Header />
      <div className="flex flex-1 overflow-hidden pb-16 lg:pb-0">
        <Sidebar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-slate-900 pointer-events-none opacity-50" />
          <div className="relative z-10 w-full h-full p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
      <BottomTabBar />
    </div>
  );
};
