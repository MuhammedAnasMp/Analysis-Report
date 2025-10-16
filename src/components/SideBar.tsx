
import { useDispatch, useSelector } from "react-redux";
import { setIsOpened } from "../redux/features/global/globalSlice";
import type { RootState } from "../redux/app/rootReducer";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
    const isOpened = useSelector((state: RootState) => state.global.isOpened);
    const dispatch = useDispatch();

    const navigate = useNavigate()

    const handleToggle = () => {
        dispatch(setIsOpened(!isOpened));
    };

    return (
        <>
            {/* Sidebar */}
            <div
                id="hs-sidebar-content-push-to-mini-sidebar"
                className={`
             fixed top-15 sm:top-13 start-0 bottom-0 z-60
          -translate-x-full transition-all duration-300 transform
          bg-white dark:bg-neutral-800  border-t border-e border-gray-200 dark:border-neutral-700
          overflow-x-hidden
          ${isOpened ? 'w-64' : 'w-16'}
          ${isOpened ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${!isOpened && 'lg:block hidden'} 
        `}
                role="dialog"
                tabIndex={-1}
                aria-label="Sidebar"
            >
                <div className="relative flex flex-col h-full">
                    {/* Header */}
                    <header className="py-2 px-2  justify-between items-center gap-x-2">


                        {/* Desktop Toggle Button */}
                        <div className={`vmin-h-[36px] flex justify-${isOpened ? 'between' : 'center'} items-center gap-x-1.5 py-2 px-2 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-700 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-white`}>
                            <a onClick={handleToggle} className={`flex-none focus:outline-hidden focus:opacity-80  ${isOpened ? 'block' : 'hidden'} `}>

                                <svg className="w-10 h-auto" width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="100" height="100" rx="10" fill="black" />
                                    <path d="M37.656 68V31.6364H51.5764C54.2043 31.6364 56.3882 32.0507 58.1283 32.8793C59.8802 33.696 61.1882 34.8146 62.0523 36.2351C62.9282 37.6555 63.3662 39.2654 63.3662 41.0646C63.3662 42.5443 63.0821 43.8108 62.5139 44.8643C61.9458 45.906 61.1823 46.7524 60.2235 47.4034C59.2646 48.0544 58.1934 48.522 57.0097 48.8061V49.1612C58.2999 49.2322 59.5369 49.6288 60.7206 50.3509C61.9162 51.0611 62.8927 52.0672 63.6503 53.3693C64.4079 54.6714 64.7867 56.2457 64.7867 58.0923C64.7867 59.9744 64.3309 61.6671 63.4195 63.1705C62.508 64.6619 61.1349 65.8397 59.3002 66.7038C57.4654 67.5679 55.1572 68 52.3754 68H37.656ZM44.2433 62.4957H51.3279C53.719 62.4957 55.4413 62.04 56.4948 61.1286C57.5601 60.2053 58.0928 59.0215 58.0928 57.5774C58.0928 56.5002 57.8264 55.5296 57.2938 54.6655C56.7611 53.7895 56.0035 53.103 55.021 52.6058C54.0386 52.0968 52.8667 51.8423 51.5054 51.8423H44.2433V62.4957ZM44.2433 47.1016H50.7597C51.896 47.1016 52.92 46.8944 53.8314 46.4801C54.7429 46.054 55.459 45.4562 55.9798 44.6868C56.5125 43.9055 56.7789 42.9822 56.7789 41.9169C56.7789 40.5083 56.2817 39.3482 55.2874 38.4368C54.3049 37.5253 52.843 37.0696 50.9017 37.0696H44.2433V47.1016Z" fill="white" />
                                </svg>
                            </a>          
                             <button
                                type="button"
                                onClick={handleToggle}
                                className="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full  dark:hover:bg-neutral-700 bg-gray-100 dark:text-white dark:bg-transparent "
                                aria-label="Toggle Sidebar"
                            >
                                {isOpened ? (
                                    <svg
                                        className="size-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        viewBox="0 0 24 24"
                                    >
                                        <rect width="18" height="18" x="3" y="3" rx="2" />
                                        <path d="M15 3v18" />
                                        <path d="m10 15-3-3 3-3" />
                                    </svg>
                                ) : (
                                    <svg
                                        className="size-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        viewBox="0 0 24 24"
                                    >
                                        <rect width="18" height="18" x="3" y="3" rx="2" />
                                        <path d="M15 3v18" />
                                        <path d="m8 9 3 3-3 3" />
                                    </svg>
                                )}
                            </button>


                        </div>
                    </header>

                    {/* Body */}
                    <nav className=" h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                        <div className=" pb-0 px-2  w-full flex flex-col flex-wrap" >
                            <ul className={`space-y-1 ${!isOpened && 'flex'}  flex-col justify-center  items-center`}>
                                <li>
                                  <Link to={"/"}>   <a className="min-h-[36px] flex items-center gap-x-1.5 py-2 px-2.5 bg-gray-100 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-700 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-white" href="#">
                                        <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                                        {
                                            isOpened && <>

                                               <span className="hs-overlay-minified:hidden" >Dashboard</span>
                                            </>
                                        }
                                    </a>
                                    </Link>
                                </li>

                                <li>
                                    <a className="min-h-[36px] w-full flex items-center gap-x-1.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200" href="#">
                                        <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" /></svg>
                                        {
                                            isOpened && <>
                                                <span className="text-nowrap hs-overlay-minified:hidden">Calendar </span>
                                                <span className="ms-auto py-0.5 px-1.5 inline-flex items-center gap-x-1.5 text-xs bg-gray-200 text-gray-800 rounded-full dark:bg-neutral-600 dark:text-neutral-200">New</span>
                                            </>
                                        }
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default Sidebar;