import { Header } from './Header';
import { BottomMenu } from './BottomMenu';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen w-full bg-black overflow-hidden relative">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-slate-900 pointer-events-none opacity-50 z-0" />
      <Header />
      <div className="flex flex-1 overflow-hidden pb-16 relative z-10">
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
          <div className="relative z-10 w-full min-h-full flex flex-col flex-1">
            {children}
          </div>
        </main>
      </div>
      <BottomMenu />
    </div>
  );
};
