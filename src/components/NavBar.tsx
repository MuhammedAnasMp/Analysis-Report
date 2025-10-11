import { useDispatch } from "react-redux";
import { logout } from "../redux/features/auth/authSlice";
import { BellAlertIcon, MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/solid";

function NavBar() {
  const dispatch = useDispatch();

  return (
    <>
      <div className="fixed z-50 flex-wrap sm:justify-start sm:flex-nowrap w-full">
        <header className=" flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm py-2 dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 ">
          <nav className="w-full mx-auto px-3 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center justify-between">

              <a className="flex-none text-xl font-semibold dark:text-white focus:outline-hidden focus:opacity-80" href="#" aria-label="GCollab">
                GCollab
              </a>
              <div className="sm:hidden">
                <button type="button" className="hs-collapse-toggle relative size-9 flex justify-center items-center gap-x-2 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10" id="hs-navbar-example-collapse" aria-expanded="false" aria-controls="hs-navbar-example" aria-label="Toggle navigation" data-hs-collapse="#hs-navbar-example">
                  <svg className="hs-collapse-open:hidden shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="12" y2="12" /><line x1="3" x2="21" y1="18" y2="18" /></svg>
                  <svg className="hs-collapse-open:block hidden shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                  <span className="sr-only">Toggle navigation</span>
                </button>
              </div>
            </div>
            <div id="hs-navbar-example" className=" hidden hs-collapse overflow-hidden transition-all duration-300 basis-full grow sm:block bg-white dark:bg-neutral-800" aria-labelledby="hs-navbar-example-collapse">
              <div className="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:ps-5 ">
                <div className="hs-dropdown">
                  <button id="hs-dropdown-dark-mode" type="button" className="hs-dropdown-toggle hs-dark-mode group flex items-center text-gray-600 hover:text-blue-600 focus:outline-hidden focus:text-blue-600 font-medium dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
                    <svg className="hs-dark-mode-active:hidden block size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                    </svg>
                    <svg className="hs-dark-mode-active:block hidden size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="4"></circle>
                      <path d="M12 2v2"></path>
                      <path d="M12 20v2"></path>
                      <path d="m4.93 4.93 1.41 1.41"></path>
                      <path d="m17.66 17.66 1.41 1.41"></path>
                      <path d="M2 12h2"></path>
                      <path d="M20 12h2"></path>
                      <path d="m6.34 17.66-1.41 1.41"></path>
                      <path d="m19.07 4.93-1.41 1.41"></path>
                    </svg>
                  </button>

                  <div id="selectThemeDropdown" className="hs-dropdown-menu hs-dropdown-open:opacity-100 mt-2 hidden z-10 transition-[margin,opacity] opacity-0 duration-300 mb-2 origin-bottom-left bg-white shadow-md rounded-lg p-1 space-y-0.5 dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:divide-neutral-700" role="menu" aria-orientation="vertical" aria-labelledby="hs-dropdown-dark-mode">
                    <button type="button" className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300" data-hs-theme-click-value="default">
                      Default (Light)
                    </button>
                    <button type="button" className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300" data-hs-theme-click-value="dark">
                      Dark
                    </button>
                    <button type="button" className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300" data-hs-theme-click-value="auto">
                      Auto (System)
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  <div className="relative">
                    <input
                      type="text"
                      id="hs-leading-icon"
                      name="hs-leading-icon"
                      className="py-2 px-2.5 ps-11 block w-full border border-gray-200 rounded-lg sm:text-sm focus:z-10 focus:outline-none focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      placeholder="Search Here"
                    />
                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
                      <MagnifyingGlassIcon height={20} width={20} />
                    </div>
                  </div>

                  <div className="px-2 py-2 bg-gray-100 w-fit rounded-md">
                    <BellAlertIcon height={20} width={20} />
                  </div>

                  <button
                    type="button"
                    className="py-2 px-2.5 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    New Meeting
                    <PlusIcon height={20} width={20} />
                  </button>
                  {/* </div> */}
                  <div className="hs-dropdown [--strategy:static] sm:[--strategy:fixed] [--adaptive:none] sm:[--adaptive:adaptive]">
                    <button id="hs-navbar-example-dropdown" type="button" className="p-2 rounded-md border border-blue-600 hs-dropdown-toggle flex items-center w-full text-gray-600 hover:text-gray-400 focus:outline-hidden focus:text-gray-400 font-medium dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500" aria-haspopup="menu" aria-expanded="false" aria-label="Mega Menu">
                      Menu
                      <svg className="hs-dropdown-open:-rotate-180 sm:hs-dropdown-open:rotate-0 duration-300 ms-1 shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                    </button>

                    <div className="relative z-60 hs-dropdown-menu transition-[opacity,margin] ease-in-out duration-[150ms] hs-dropdown-open:opacity-100 opacity-0 sm:w-48 sm:shadow-md rounded-lg p-1 space-y-1 bg-white dark:bg-neutral-800 sm:dark:border dark:border-neutral-700 dark:divide-neutral-700 before:absolute top-full sm:border border-gray-200 before:-top-5 before:start-0 before:w-full before:h-5 hidden" role="menu" aria-orientation="vertical" aria-labelledby="hs-navbar-example-dropdown">
                      <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300" href="#">
                        About
                      </a>
                      <div className="hs-dropdown [--strategy:static] sm:[--strategy:absolute] [--adaptive:none] relative">
                        <button id="hs-navbar-example-dropdown-sub" type="button" className="hs-dropdown-toggle w-full flex justify-between items-center text-sm text-gray-800 rounded-lg py-2 px-3 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300">
                          Sub Menu
                          <svg className="hs-dropdown-open:-rotate-180 sm:hs-dropdown-open:-rotate-90 sm:-rotate-90 duration-300 ms-2 shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                        </button>

                        <div className="hs-dropdown-menu transition-[opacity,margin] ease-in-out duration-[150ms] hs-dropdown-open:opacity-100 opacity-0 sm:w-48 hidden z-10 sm:mt-2 bg-white sm:shadow-md rounded-lg dark:bg-neutral-800 sm:dark:border dark:border-neutral-700 dark:divide-neutral-700 before:absolute sm:border border-gray-200 before:-end-5 before:top-0 before:h-full before:w-5 sm:mx-2.5! top-0 end-full" role="menu" aria-orientation="vertical" aria-labelledby="hs-navbar-example-dropdown-sub">
                          <div className="p-1 space-y-1">
                            <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300" href="#">
                              About
                            </a>
                            <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300" href="#">
                              Downloads
                            </a>
                            <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300" href="#">
                              Team Account
                            </a>
                          </div>
                        </div>
                      </div>
                      <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300" href="#">
                        Downloads
                      </a>
                      <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300" href="#">
                        Team Account
                      </a>
                      <a onClick={() => dispatch(logout())} className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300" href="#">
                        Logout
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </header>
      </div>
    </>
  )
}

export default NavBar