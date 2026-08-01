import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileTopBar } from './MobileTopBar';
import { BlobBackground } from './BlobBackground';

export function AppShell() {
  return (
    <div className="relative min-h-dvh md:flex">
      <BlobBackground />
      <Sidebar />
      <div className="min-w-0 flex-1">
        <MobileTopBar />
        <main className="mx-auto max-w-6xl px-4 pt-2 pb-28 md:px-8 md:pb-12 md:pt-8">
          <Outlet />
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
