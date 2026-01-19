import { useEffect, useRef, useState, type JSX } from "react";
import TargetVsAchievement from "../slides/TargetVsAchievement";
import StockvsAgeing from "../slides/StockvsAgeing";
import MonthWiseCustomerComparison from "../slides/MonthWiseCustomerComparison";
import MonthWiseSalesComparison from "../slides/MonthWiseSalesComparison";
import MonthWiseBasketValueComparison from "../slides/MonthWiseBasketValueComparison";
import MonthWiseLFL from "../slides/MonthWiseLFL";
import MonthWiseFreshComparison from "../slides/MonthWiseFreshComparison";
import YearWiseGP from "../slides/YearWiseGP";
import YearWiseWeekEndSales from "../slides/YearWiseWeekEndSales";
import StockInWereHouseNotInStore from "../slides/StockInWereHouseNotInStore";
import GMCustomer from "../slides/GMCustomer";
import WeekWiseFresh from "../slides/WeekWiseFresh";
import Fastline from "../slides/FastLine";
import { AnalyticsEvent } from "../types/analyticsEvents";
import { useAnalyticsLogger } from "../types/useAnalyticsLogger";
import { ArrowTrendingUpIcon, ChartPieIcon, CursorArrowRippleIcon, DocumentMagnifyingGlassIcon, HomeModernIcon, IdentificationIcon, InboxStackIcon, PresentationChartBarIcon, PresentationChartLineIcon, RectangleGroupIcon, ShoppingCartIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import StockOutLoss from "../slides/StockOutLoss";
import CreditsWidget from "../componenets/CreditsWidget";
import SupermarketDashboard from "../slides/Dashoboard";
import Dashboard from "../slides/Dashoboard";
export interface SlideProps {
  id: number;
  label: string;
  headerTitle: string;
  image?: string;
  icon?: JSX.Element;
}

interface SlideConfig extends SlideProps {
  component: React.ComponentType<SlideProps>;
}


type LandingSlidesProps = {
  onChange: (data: SlideConfig) => void;
};


export default function LandingSlides({ onChange }: LandingSlidesProps) {

  const { logUIEvent } = useAnalyticsLogger();
  const slides: SlideConfig[] = [
    {
      id: 1,
      component: Dashboard,
      label: "DASHBOARD",
      headerTitle: "Overview",
      icon: <CursorArrowRippleIcon />
    },
    {
      id: 2,
      component: TargetVsAchievement,
      label: "TARGET",
      headerTitle: "Target v/s Achievement",
      icon: <CursorArrowRippleIcon />
    },
    {
      id: 3,
      component: StockvsAgeing,
      label: "STOCK",
      headerTitle: "Stock v/s Ageing",
      icon: <InboxStackIcon />
    },

    {
      id: 4,
      component: MonthWiseSalesComparison,
      label: "ANNUAL \n SALES",
      headerTitle: "Yearly Sales Amount",
      icon: <ArrowTrendingUpIcon className="" />
    },
    {
      id: 5,
      component: MonthWiseCustomerComparison,
      label: "ANNUAL CUSTOMERS",
      headerTitle: "Yearly Customer Count",
      icon: <UserGroupIcon />
    },
    {
      id: 6,
      component: MonthWiseBasketValueComparison,
      label: "ANNUAL \n BV",
      headerTitle: "Yearly Basket Value",
      icon: <ShoppingCartIcon />
    },
    {
      id: 7,
      component: MonthWiseLFL,
      label: "LFL",
      headerTitle: "Month Wise LFL",
      icon: <DocumentMagnifyingGlassIcon />
    },
    {
      id: 8,
      component: MonthWiseFreshComparison,
      label: "FRESH \n SALES",
      headerTitle: "Yearly Fresh Sales Report",
      icon: <PresentationChartLineIcon />
    },
    {
      id: 9,
      component: WeekWiseFresh,
      label: "WEEK WISE FRESH",
      headerTitle: "Week Wise Fresh Sales",
      icon: <PresentationChartBarIcon />
    },
    {
      id: 10,
      component: YearWiseGP,
      label: "ANNUAL \n GP",
      headerTitle: "Yearwise Gross Profit",
      icon: <ChartPieIcon />
    },
    {
      id: 11,
      component: YearWiseWeekEndSales,
      label: "WEEKEND SALES",
      headerTitle: "Weekdays & Weekend Sales",
      icon: <ArrowTrendingUpIcon className="" />
    },
    {
      id: 12,
      component: StockInWereHouseNotInStore,
      label: "STOCK IN WAREHOUSE",
      headerTitle: "Stock In Ware House Not In Store ",
      icon: <HomeModernIcon />
    },
    {
      id: 13,
      component: GMCustomer,
      label: "GRAND ME",
      headerTitle: "Grand Me Customer",
      icon: <IdentificationIcon />
    },
    {
      id: 14,
      component: Fastline,
      label: "FAST LINE",
      headerTitle: "Fast Line",
      icon: <RectangleGroupIcon />
    },
    {
      id: 15,
      component: StockOutLoss,
      label: "STOCK OUT LOSS",
      headerTitle: "Stock out Loss - ZedEye",
      icon: <RectangleGroupIcon />
    },

  ];


  const [selectedId, setselectedId] = useState<number>(1);
  const [selectedSlide, setSelectedSlide] = useState<SlideConfig>(slides[0]);
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
    <div className="p-2">

      <div data-hs-carousel='{ "loadingClasses": "opacity-0"}' className="relative ">
        <div className="hs-carousel flex flex-col md:flex-row gap-2 ">
          {/* side slider items */}
          <div className="md:order-1 p flex-none">
            <div className="hs-carousel-pagination h-[calc(100vh-100px)]   flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto px-1 bg-gray-50  overflow-y-auto  [&::-webkit-scrollbar]:w-1  [&::-webkit-scrollbar-track]:rounded-full  [&::-webkit-scrollbar-track]:bg-gray-100  [&::-webkit-scrollbar-thumb]:rounded-full  [&::-webkit-scrollbar-thumb]:bg-gray-300  dark:[&::-webkit-scrollbar-track]:bg-neutral-700  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
            ">
              {slides
                .map((slide, index) => {
                  // Determine label for shortcut
                  let shortcutLabel;

                  if (index < 9) {
                    shortcutLabel = `Alt-${index + 1}`;

                  } else {
                    // Beyond 10: show "Alt+1+<n>"
                    // const altGroup = Math.floor(index / 10);
                    // const innerIndex = (index % 10) + 1;
                    // shortcutLabel = `Alt+${altGroup}+${innerIndex}`;
                    // shortcutLabel = ``;
                    shortcutLabel = `${index + 1}`;
                  }

                  return (
                    <div
                      key={slide.id}
                      onClick={() => {
                        logUIEvent({
                          eventName: AnalyticsEvent.CARD_SELECT,
                          component: "left_card",
                          cardId: '12',
                        });

                        { setselectedId(slide.id); setSelectedSlide(slide) }
                      }}
                      className="hs-carousel-pagination-item shrink-0 border hover:scale-105 hover:z-50 border-gray-200 rounded-md overflow-hidden cursor-pointer size-20 md:size-32 hs-carousel-active:border-blue-400 dark:border-neutral-700"
                    >

                      <div
                        ref={(el: any) => (refs.current[index + 1] = el)}
                        className="relative hover:bg-gray-100 gap-1 flex flex-col justify-center items-center text-center size-full bg-white p-2 dark:bg-neutral-900 group transition-all duration-300"
                      >
                        {slide.icon && (
                          <span className="inline-flex justify-center items-center size-9 p-1 rounded-full border-4 border-blue-100 bg-blue-200 text-blue-800 dark:border-blue-900 dark:bg-blue-800 dark:text-blue-400
                                  transform transition-all duration-300
                                  group-hover:scale-110
                                  group-hover:bg-blue-300
                                  group-hover:text-blue-900
                                  dark:group-hover:bg-blue-700
                                  dark:group-hover:text-blue-200
                                  ">
                            {slide.icon}
                          </span>
                        )}

                        <span className="text-gray-700 dark:text-white capitalize text-md font-extrabold whitespace-pre-line tracking-wide leading-snug">
                          {slide.label}
                        </span>

                        <div className="absolute right-0 bottom-0 text-[10px] text-gray-500 dark:text-gray-300">
                          <kbd className="px-1 py-0.5 m-0.5 inline-flex justify-center items-center bg-white border border-gray-200 font-mono text-[10px] text-gray-800 rounded-md dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200">
                            {shortcutLabel}
                          </kbd>
                        </div>
                      </div>


                    </div>
                  );
                })}
                <CreditsWidget/>
            </div>
          </div>

          {/* main cards */}
          <div className="md:order-2 relative grow overflow-hidden h-[calc(100vh-100px)] bg-white rounded-lg ">
            <div className="hs-carousel-body absolute top-0 bottom-0 start-0 flex flex-nowrap transition-transform duration-700 opacity-0">
              {slides.map(slide => {
                const SlideComponent = slide.component;

                return (
                  <div key={slide.id} className="hs-carousel-slide w-7xl">
                    <SlideComponent {...slide} />
                  </div>
                );
              })}
        

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

