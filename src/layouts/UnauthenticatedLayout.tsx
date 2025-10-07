
import { Outlet } from 'react-router-dom';

const UnauthenticatedLayout = () => {
  return (
    <div className="h-screen pt-16 sm:px-4 md:px-6 lg:pl-15 bg-white dark:bg-neutral-800">
      <Outlet />
    </div>
  );
};

export default UnauthenticatedLayout;
