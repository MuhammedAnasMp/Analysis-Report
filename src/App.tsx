import { useEffect, useRef, useState } from 'react';
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import LandingSlides from './layouts/LandingSlides';
import Navbar from './layouts/Navbar';

import NotFoundPage from './layouts/NotFoundPage';
import useToast from './hooks/Toast';
import { useDispatch } from 'react-redux';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { setUserDetails } from './redux/features/pptState/storeSlice';



async function loadPreline() {
  return import('preline/dist/index.js');
}
function App() {
  const location = useLocation();

  const [activeSlide, setActiveSlide] = useState<any>();
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


    const { showToast } = useToast()

    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [showNavBar,setShowNavBar] = useState<boolean>(true)
    
    useEffect(() => {
      // dispatch(resetStoreState())
    
      const fetchStores = async () => {
        try {
          fetch(`/api/decode-token.json`)
            .then(result => result.json())
            .then(data => {
              if (data.error) {
                showToast({
                  type: "markup2",
                  message: `${data.error}`,
                  status: "failed",
                  avatar: <XCircleIcon className="size-6 text-blue-500" />,
                  duration: 6000,
                })
                navigate('/why-here');
                setShowNavBar(false)
              } 
              else{
                dispatch(setUserDetails({ "id": data.id, "username": data.username }))
                setShowNavBar(true)
              }
            })
          }
          catch (err) {
            //console.log('error', err)
            setShowNavBar(false)

        }
      }
  
    fetchStores()
    }, [])
  return (
    <div className="bg-gray-50">
        {showNavBar && <Navbar currentSlide={activeSlide} />}

      <Routes>
        <Route path="/" element={<LandingSlides onChange={(slide) => setActiveSlide(slide)} />} />
        <Route path="*" element={<NotFoundPage />} />
        {/* <Route path="/" element={<NotFoundPage />} /> */}
      </Routes>
    </div>
  );

}
export default App;





