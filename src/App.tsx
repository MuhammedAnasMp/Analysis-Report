import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';


import Login from './pages/Login';
import NavBar from './components/NavBar';
import UnauthenticatedLayout from './layouts/UnauthenticatedLayout';
import AuthenticatedLayout from './layouts/AuthenticatedLayout';
import {  useSelector } from 'react-redux';
import type { AppState } from './redux/app/store';
import Dashboard from './pages/Dashboard';
import NewMeeting from './pages/NewMeeting';

import Test from './pages/Test';
import ProfileView from './pages/ProfileView';



async function loadPreline() {
  return import('preline/dist/index.js');
}
function App() {
  const location = useLocation();
  const auth = useSelector((state: AppState) => state.auth);
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
      <>
       <NavBar />
      <Routes>
      
        <Route element={<UnauthenticatedLayout isLoggedIn={auth.isLoggedIn}/>}>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<>Not found page</>} />
        </Route>
        <Route element={<AuthenticatedLayout isLoggedIn={auth.isLoggedIn} />}>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/profile" element={<ProfileView/>} />
          <Route path="/new-meeting" element={<NewMeeting/>} />
          <Route path="/test" element={<Test/>} />
        </Route>
      </Routes>
      </>

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


