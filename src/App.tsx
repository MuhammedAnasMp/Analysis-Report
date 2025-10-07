import { useEffect } from 'react';
import { Route, Router, Routes, useLocation } from 'react-router-dom';


import Login from './pages/Login';
import NavBar from './components/NavBar';
import Sidebar from './components/SideBar';
import UnauthenticatedLayout from './layouts/UnauthenticatedLayout';
import AuthenticatedLayout from './layouts/AuthenticatedLayout';


async function loadPreline() {
  return import('preline/dist/index.js');
}
function App() {
  const location = useLocation();

  useEffect(() => {
    const initPreline = async () => {
      await loadPreline();

      if (
        window.HSStaticMethods &&
        typeof window.HSStaticMethods.autoInit === 'function'
      ) {
        window.HSStaticMethods.autoInit();
      }
    };

    initPreline();
  }, [location.pathname]);
  return (
     
      <Routes>
      
        <Route element={<UnauthenticatedLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<>Not found page</>} />
        </Route>
        <Route element={<AuthenticatedLayout />}>
          <Route path="/" element={<>Home page</>} />
          
        </Route>
      </Routes>

  );
}
export default App;



{/* <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/meetings" element={<MeetingsList />} />
            <Route path="/meetings/create" element={<CreateMeeting />} />
            <Route path="/meetings/:id" element={<MeetingDetails />} />
            <Route path="/meetings/:id/room" element={<MeetingRoom />} />
            <Route path="/tasks" element={<TaskBoard />} />
            <Route path="/tasks/create" element={<CreateTask />} />
            <Route path="/tasks/:id" element={<TaskDetails />} />
            <Route path="/notifications" element={<Notifications />} />
            */}