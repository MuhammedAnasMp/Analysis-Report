import NavBar from '../components/NavBar';

import { Outlet } from 'react-router-dom';
import Sidebar from '../components/SideBar';

const AuthenticatedLayout = () => {
  return (
    <div className="app">
      <NavBar />
      <div className="flex">
        <Sidebar />
        <div className="h-screen pt-16 sm:px-4 md:px-6 lg:pl-15 bg-white dark:bg-neutral-800 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
