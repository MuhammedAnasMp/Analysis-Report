import { useEffect, useRef, useState } from "react";
import SlideTemplate from "./SlideTemplate";


import TargetVsAchievement from "../slides/TargetVsAchievement";
import StockvsAgeing from "../slides/StockvsAgeing";
import Chart from "../slides/Chart";
import SectionPerformanceChart from "../slides/Chart2";
import MonthWiseCustomerComparison from "../slides/MonthWiseCustomerComparison";
import MonthWiseSalesComparison from "../slides/MonthWiseSalesComparison";
import MonthWiseBasketValueComparison from "../slides/MonthWiseBasketValueComparison";
import MonthWiseLFL from "../slides/MonthWiseLFL";
import MonthWiseFreshComparison from "../slides/MonthWiseFreshComparison";
import Modal from "../slides/Modal";
import FullScreenModal from "../slides/Modal";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../redux/features/pptState/storeSlice";

export type Slide = {
  id: number;
  component: React.ReactNode;
  label: string;
  headerTitle: string;

};
type LandingSlidesProps = {
  onChange: (data: Slide) => void;
};


export default function LandingSlides({ onChange }: LandingSlidesProps) {

 
  const slides = [
    {
      id: 1,
      component: <TargetVsAchievement />,
      label: "Target",
      headerTitle: "Target vs Achievement"
    },
    {
      id: 2,
      component: <StockvsAgeing />,
      label: "Stock",
      headerTitle: "Stock vs Ageing"
    },
    // {
    //   id: 3,
    //   component: <SectionPerformanceChart/>,
    //   label: "Target Chart",

    //   headerTitle: '1'
    // },
    {

      id: 3,
      component: <MonthWiseSalesComparison />,
      label: "Month-wise Sales",
      headerTitle: 'Month-wise Sales Comparison'
    },
    {
      id: 4,
      component: <MonthWiseCustomerComparison />,
      label: "Month-wise Customer",
      headerTitle: 'Month-wise Customer Comparison'
    },
    {
      id: 5,
      component: <MonthWiseBasketValueComparison />,
      label: "Month-wise Basket value",
      headerTitle: 'Month-wise Basket value Comparison'
    },
    {
      id: 6,
      component: <MonthWiseLFL />,
      label: "Monthly LFL",
      headerTitle: 'LFL Report'
    },
    {
      id: 7,
      component: <MonthWiseFreshComparison />,
      label: "Month-wise Fresh Sales",
      headerTitle: 'Month-wise Sales Comparison'
    },
    {
      id: 8,
      component: <SlideTemplate title="Second 10" bgColor="bg-gray-200" />,
      label: "9 slide",
      headerTitle: '1'
    },
    {
      id: 9,
      component: <SlideTemplate title="Second 10" bgColor="bg-gray-200" />,
      label: "10 slide",
      headerTitle: '1'
    },
   
  ];

  const [selectedId, setselectedId] = useState<number>(1);
  const [selectedSlide, setSelectedSlide] = useState<Slide>(slides[0]);
  useEffect(() => {

    setSelectedSlide(slides[selectedId - 1])

  }, [selectedId])
  useEffect(() => {

    onChange(selectedSlide)

  }, [selectedSlide])

  const refs = useRef<any>([]);



  const handleUserKeyPress = (e: KeyboardEvent) => {

    let index;
    if (e.key === 'ArrowUp') {
      index = 1000
    }
    else if (e.key === 'ArrowDown') {
      index = 999
    }
    else {
      index = parseInt(e.key, 10);
    }
    if (!isNaN(index) && refs.current[index] && e.altKey) {
      if (e.key === 'ArrowUp') {


        refs.current[selectedSlide.id - 1].click();
      }
      else if (e.key === 'ArrowDown') {


        refs.current[selectedSlide.id + 1].click();
      }
      else {
        refs.current[index].click();
        setselectedId(index)
      }
    }
  };
  useEffect(() => {
    window.addEventListener('keydown', handleUserKeyPress)


    return () => {
      window.removeEventListener('keydown', handleUserKeyPress)
    }
  })


  return (
    <div className="p-3">

      <div data-hs-carousel='{ "loadingClasses": "opacity-0"}' className="relative ">
        <div className="hs-carousel flex flex-col md:flex-row gap-2 ">
          {/* side slider items */}
          <div className="md:order-1 px-4 flex-none">
            <div className="hs-carousel-pagination h-[calc(100vh-100px)] flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto pr-1  overflow-y-auto  [&::-webkit-scrollbar]:w-1  [&::-webkit-scrollbar-track]:rounded-full  [&::-webkit-scrollbar-track]:bg-gray-100  [&::-webkit-scrollbar-thumb]:rounded-full  [&::-webkit-scrollbar-thumb]:bg-gray-300  dark:[&::-webkit-scrollbar-track]:bg-neutral-700  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
            ">
              {slides
                .map((slide, index) => {
                  // Determine label for shortcut
                  let shortcutLabel;

                  if (index < 9) {
                    // 1–10 just show numbers
                    shortcutLabel = index + 1;
                  } else {
                    // Beyond 10: show "Alt+1+<n>"
                    const altGroup = Math.floor(index / 10);
                    const innerIndex = (index % 10) + 1;
                    shortcutLabel = `Alt+${altGroup}+${innerIndex}`;
                    shortcutLabel = ``;
                  }

                  return (
                    <div
                      key={slide.id}
                      onClick={() => {
                        setselectedId(slide.id)
                        setSelectedSlide(slide)
                      }}
                      className="hs-carousel-pagination-item shrink-0 border border-gray-200 rounded-md overflow-hidden cursor-pointer size-20 md:size-32 hs-carousel-active:border-blue-400 dark:border-neutral-700
                    "
                    >
                      <div ref={(el: any) => (refs.current[index + 1] = el)} className="relative flex justify-center items-center text-center size-full bg-gray-100 p-2 dark:bg-neutral-900">
                        <span className="text-xs text-gray-800 dark:text-white">
                          {slide.label}
                        </span>
                        <div className="absolute right-0 bottom-0 text-xs text-gray-500 dark:text-gray-300">
                          <kbd className="px-1 py-0.5  inline-flex justify-center items-center  bg-white border border-gray-200 font-mono text-xs text-gray-800 rounded-md dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200">

                            {shortcutLabel}

                          </kbd>
                        </div>
                      </div>

                    </div>
                  );
                })}
            </div>
          </div>

          {/* main cards */}
          <div className="md:order-2 relative grow overflow-hidden h-[calc(100vh-100px)] bg-white rounded-lg ">
            <div className="hs-carousel-body absolute top-0 bottom-0 start-0 flex flex-nowrap transition-transform duration-700 opacity-0">
              {slides.map(slide => (
                <div key={slide.id} className="hs-carousel-slide w-7xl" >
                  {slide.component}
                </div>
              ))}

            </div>
            <button onClick={() => setselectedId(selectedId - 1)} ref={(el: any) => (refs.current[1000] = el)} type="button" className="hs-carousel-prev hs-carousel-disabled:opacity-50 hs-carousel-disabled:pointer-events-none absolute inset-y-0 start-0 inline-flex justify-center items-center w-11.5 h-full text-gray-800 hover:bg-gray-800/10 focus:outline-hidden focus:bg-gray-800/10 rounded-s-lg dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10">
              <span className="text-2xl" aria-hidden="true">
                <svg className="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"></path>
                </svg>
              </span>
              <span className="sr-only">Previous</span>
            </button>
            <button onClick={() => setselectedId(selectedId + 1)} ref={(el: any) => (refs.current[999] = el)} type="button" className="hs-carousel-next hs-carousel-disabled:opacity-50 hs-carousel-disabled:pointer-events-none absolute inset-y-0 end-0 inline-flex justify-center items-center w-11.5 h-full text-gray-800 hover:bg-gray-800/10 focus:outline-hidden focus:bg-gray-800/10 rounded-e-lg dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10">
              <span className="sr-only">Next</span>
              <span className="text-2xl" aria-hidden="true">
                <svg className="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </span>
            </button>
          </div>



        </div>
      </div>

    </div>
  )
}

