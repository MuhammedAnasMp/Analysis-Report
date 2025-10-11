
import { Navigate, Outlet } from 'react-router-dom';

const UnauthenticatedLayout = ({isLoggedIn}:{isLoggedIn : boolean}) => {
   if (isLoggedIn) return <Navigate to="/" />;
  return (
    <div className="h-screen pt-16 sm:px-4 md:px-6 lg:pl-15 bg-white dark:bg-neutral-800">
      <Outlet />
    </div>
  );
};

export default UnauthenticatedLayout;
