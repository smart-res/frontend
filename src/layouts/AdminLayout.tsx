import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopRightDrawer from '../components/TopRightDrawer';

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <div className="min-h-screen bg-gray-50">
        <TopRightDrawer />
      </div>
    </div>
  );
}
