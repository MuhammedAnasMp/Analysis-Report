import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import LandingSlides, { type Slide } from './pages/LandingSlides';
import Navbar from './pages/Navbar';



async function loadPreline() {
  return import('preline/dist/index.js');
}
function App() {
  const location = useLocation();
   const [activeSlide, setActiveSlide] = useState<string>("");
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
    <div className='h-'>
      <Navbar currentSlide={activeSlide}/>
      <Routes>
        <Route path="/" element={   <LandingSlides onChange={(slide) => {setActiveSlide(slide.label)}} />} />
      </Routes>

    </div>

  );
}
export default App;


