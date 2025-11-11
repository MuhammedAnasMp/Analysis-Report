import SmallDatePicker from "../componenets/SmallDatePicker";


export default function Navbar({ currentSlide }: { currentSlide: any }) {
  return (
    <header className="flex flexwrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm py-3 dark:bg-neutral-800 border-b-1 border-neutral-300">
      <nav className="w-full mx-auto px-54 sm:flex sm:items-center sm:justify-between">

        <a className="flex-none font-semibold text-xl text-black focus:outline-hidden focus:opacity-80 dark:text-white" href="#" aria-label="Brand">{currentSlide}</a>        <div className="flex flex-row items-center gap-5 mt-5 sm:justify-end sm:mt-0 sm:ps-5">
          <div className="hs-dropdown [--auto-close:inside] relative inline-flex">
            <button id="hs-dropdown-default" type="button" className="hs-dropdown-toggle py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
              Actions
              <svg className="hs-dropdown-open:rotate-180 size-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </button>

            <div className="z-50 hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white h-[40%]  shadow-md rounded-lg mt-2 dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:divide-neutral-700 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full" role="menu" aria-orientation="vertical" aria-labelledby="hs-dropdown-default">
              <div className="p-1 space-y-0.5">
                <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700" href="#">
                  Newsletter
                </a>
                <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700" href="#">
                  Purchases
                </a>
                <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700" href="#">
                  Downloads
                </a>
                <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700" href="#">
                  Team Account
                </a>
              </div>
            </div>
          </div>
          
          <SmallDatePicker onDateSelect={()=>{}} />


          {/* <a className="font-medium text-blue-500 focus:outline-hidden" href="#" aria-current="page">Landing</a>

          <a className="font-medium text-gray-600 hover:text-gray-400 focus:outline-hidden focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500" href="#">Account</a>
          <a className="font-medium text-gray-600 hover:text-gray-400 focus:outline-hidden focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500" href="#">Work</a>
          <a className="font-medium text-gray-600 hover:text-gray-400 focus:outline-hidden focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500" href="#">Blog</a> */}
        </div>
      </nav>
    </header>
  )
}
