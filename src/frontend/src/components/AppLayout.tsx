import { Outlet } from '@tanstack/react-router';
import HeaderNav from './HeaderNav';
import SiteFooter from './SiteFooter';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeaderNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
