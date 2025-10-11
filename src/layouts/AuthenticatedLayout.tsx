import NavBar from '../components/NavBar';

import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/SideBar';

const AuthenticatedLayout = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  if (!isLoggedIn) return <Navigate to="/login" />;
  return (
    <div className="app">
      <NavBar />
      <div className="flex">
        <Sidebar />
        <div className="h-screen pt-17 sm:pt-16 px-2 md:px-3 lg:pl-18 bg-white dark:bg-neutral-800 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
