import { useEffect, useRef, useState } from "react";
import SmallDatePicker from "../componenets/SmallDatePicker";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedDate, setSelectedStore } from "../redux/features/pptState/storeSlice";
import type { RootState } from "../redux/app/rootReducer";
import type { Slide } from "./LandingSlides";
import { BeakerIcon, MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import FullScreenModal from "../slides/Modal";
interface Locations {
  LOCATION_ID: number,
  LOCATION_NAME: string
}
export default function Navbar({ currentSlide }: { currentSlide: Slide }) {
  const [locations, setLocations] = useState<Locations[]>()
  const [filteredLocations, setFilteredLocations] = useState<Locations[]>();
  const [searchTerm, setSearchTerm] = useState("");
  const { selectedStore, selectedDate, userDetails } = useSelector((state: RootState) => state.store);
  useEffect(() => {
    const fetchStores = async () => {
      try {
        fetch(`http://172.16.4.167:5000/api/locations?userId=${userDetails?.id}`)
          .then(result => result.json())
          .then(data => {
            setLocations(data)
          })
      }
      catch (err) {
        console.log('error', err)
      }
    }

    fetchStores()

  }, [userDetails])




  const [isOpen, setIsOpen] = useState(false);

  const handleDateChange = (date: Date | null) => {
    dispatch(setSelectedDate(date));
  };
  const dispatch = useDispatch();
  const handleSelect = (location: Locations) => {

    dispatch(setSelectedStore(location));

    setIsOpen(false);
  };
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);

      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  useEffect(() => {
    if (!searchTerm) {
      setFilteredLocations(locations);
    } else {
      setFilteredLocations(
        locations?.filter(
          (loc) =>
            loc.LOCATION_NAME.toLowerCase().includes(searchTerm.toLowerCase()) ||
            loc.LOCATION_ID.toString().includes(searchTerm)
        )
      );
    }
  }, [searchTerm, locations]);
  return (
    <header className=" flex flexwrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm py-3 dark:bg-neutral-800 border-b-1 border-neutral-300">
      <nav className="w-full mx-auto px-50 sm:flex sm:items-center sm:justify-between">
        <div className="flex-none font-semibold text-lg text-black focus:outline-hidden focus:opacity-80 dark:text-white" aria-label="Brand">{currentSlide && currentSlide.headerTitle} {selectedStore && selectedStore.LOCATION_NAME}</div>
        <div className="flex flex-row items-center gap-5 mt-5 sm:justify-end sm:mt-0 sm:ps-5">
         
          <div ref={dropdownRef} className="relative inline-flex w-48">
            <button
              type="button"
              onClick={() => {
                setIsOpen(!isOpen)


              }}
              className="py-2 rs-picker-input-group rs-input-group justify-evenly px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            >
              <span className="text-blue-600 truncate">  {selectedStore ? selectedStore.LOCATION_NAME : "Select store"} </span>
              <svg className={`size-3 transition-transform ${isOpen ? "rotate-180" : ""}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none"><path d="m6 9 6 6 6-6" />   </svg>
            </button>

            {isOpen && (
              <div
                className="max-h-100 overflow-y-auto [&::-webkit-scrollbar]:w-1
                  [&::-webkit-scrollbar-track]:bg-gray-100
                  [&::-webkit-scrollbar-thumb]:bg-gray-300
                  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
                  absolute top-full left-0 z-50 mt-2 min-w-60 bg-white shadow-md rounded-lg
                  dark:bg-neutral-800 dark:border dark:border-neutral-700"
                role="menu"
              >
                <div className="p-1 space-y-0.5">
                  <div className="p-2 relative">
                    <input
                      type="text"
                      name="location search"
                      autoFocus
                      placeholder="Location code or name"
                      className="w-full p-2 m-4 outline-none border rounded-md pr-10 rs-search-box-input rs-input"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <div className="absolute top-5 right-5">
                      <MagnifyingGlassIcon height={15} width={15} />
                    </div>
                  </div>

                  {filteredLocations && filteredLocations.length > 0 ? (
                    filteredLocations.map((location) => (
                      <div
                        key={location.LOCATION_ID}
                        onClick={() => {
                          handleSelect(location);
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                      >
                        <span className="font-bold font-sans">
                          {location.LOCATION_ID}
                        </span>{" "}
                        {location.LOCATION_NAME}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-gray-400">No locations found</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <SmallDatePicker value={selectedDate} onDateChange={handleDateChange} />

          {/* {
              currentSlide && currentSlide.id ==7 ? "NEW DROP" : ""
            } */}
          {
            selectedDate && selectedStore &&
            <FullScreenModal />
          }
           <div className="flex justify-center items-center text-xl">
            <UserCircleIcon className="text-gray-400" height={40} widths={40} /> {userDetails?.username} 
          </div>

          {/* <a className="font-medium text-blue-500 focus:outline-hidden"  aria-current="page">Landing</a>

          <a className="font-medium text-gray-600 hover:text-gray-400 focus:outline-hidden focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500" href="#">Account</a>
          <a className="font-medium text-gray-600 hover:text-gray-400 focus:outline-hidden focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500" href="#">Work</a>
          <a className="font-medium text-gray-600 hover:text-gray-400 focus:outline-hidden focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500" href="#">Blog</a> */}
        </div>
      </nav>
    </header>
  )
}

