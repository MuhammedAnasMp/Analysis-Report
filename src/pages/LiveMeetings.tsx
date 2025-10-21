import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useApiQuery } from "../api/useApiQuery";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
const extensions = [
    StarterKit,
    TextStyle,
]


interface CurrentMeeting {
    id: number;
    location_display: string;
    title: string;
    description: string;
    time: string;
    status: string;
    agenda: string | undefined;
    host: number;
}
export default function LiveMeetings() {
    const { meetingId } = useParams()
    const [scrolled, setScrolled] = useState(false);
    const scrollContainerRef = useRef<any>(null);

    const { data: currentMeeting } = useApiQuery<CurrentMeeting>(['currentMeeting'], `/api/meetings/meetings/${meetingId}`, undefined, true);


    useEffect(() => {
        const scrollElement = scrollContainerRef.current;

        const handleScroll = () => {
            if (scrollElement.scrollTop > 60) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }

        };

        if (scrollElement) {
            scrollElement.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (scrollElement) {
                scrollElement.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);


    const editor = useEditor({
        extensions,
        content: '', // Start empty
        editable: false,
    });

    useEffect(() => {
        if (editor && currentMeeting?.agenda) {
            editor.commands.setContent(currentMeeting.agenda);
        }
    }, [editor, currentMeeting?.agenda]);

    return (
        <div>
            <div className="mx-auto text-center   pb-6  relative">
                {/* Header bar with div1 and div2 on two sides */}
                <div className="absolute top-0 w-full flex justify-between px-4">
                    <ol className="flex items-center whitespace-nowrap">
                        <li className="inline-flex items-center">
                            <Link to={'/'}>
                                <a className="flex items-center text-sm text-gray-500 hover:text-blue-600 focus:outline-hidden focus:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500" href="#">
                                    Dashboard

                                </a>
                            </Link>
                            <svg className="shrink-0 mx-2 size-4 text-gray-400 dark:text-neutral-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m9 18 6-6-6-6"></path>
                            </svg>
                        </li>
                        <li className="inline-flex items-center">
                            <a className="flex items-center text-sm text-gray-500 hover:text-blue-600 focus:outline-hidden focus:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500" href="#">
                                Some Content
                                <svg className="shrink-0 mx-2 size-4 text-gray-400 dark:text-neutral-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m9 18 6-6-6-6"></path>
                                </svg>
                            </a>
                        </li>
                        <li className="inline-flex items-center text-sm font-semibold text-gray-800 truncate dark:text-neutral-200" aria-current="page">
                            Live Meetings
                        </li>
                    </ol>

                </div>

            </div>

            <div className=" relative grid grid-row-2  overflow-hidden  border rounded-lg bg-gray-100  border-gray-100   ">

                <div ref={scrollContainerRef} className="h-[calc(100vh-18rem)] overflow-y-auto relative border border-gray-100 rounded-lg   bg-gray-
            
                                [&::-webkit-scrollbar]:w-1
                    [&::-webkit-scrollbar-track]:rounded-full
                    [&::-webkit-scrollbar-track]:bg-gray-100
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-thumb]:bg-gray-300
                    dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                    dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">

                    <div className="max-w-2xl mx-auto text-center pt-7 md:pt-14 pb-6 lg:pb-16">

                        <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl dark:text-white capitalize">{currentMeeting?.title}</h2>
                        <div className="mt-4 md:text-lg text-gray-600 dark:text-neutral-400 capitalize"  >{currentMeeting?.description}</div>
                    </div>
                    <div
                        className={`sticky   w-full   justify-end z-10 transition-all duration-200 ${scrolled
                            ? "  shadow border-b-gray-200 top-0 rounded-t-lg  "
                            : ""
                            }`}>


                        <div className={`${!scrolled ? 'hidden' : 'bg-white/60 backdrop-blur-lg dark:bg-neutral-900/60'}`}>
                            <div className="max-w-[85rem] px-4 py-4 sm:px-6 lg:px-8 mx-auto">
                                {/* Grid */}
                                <div className="grid justify-center sm:grid-cols-2 sm:items-center gap-4">
                                    <div className="flex items-center gap-x-3 md:gap-x-5">
                                        {/* <svg className="shrink-0 size-10 md:size-14" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect width="40" height="40" rx="6" fill="currentColor" className="fill-blue-600" />
                                                <path d="M8 32.5V19.5C8 12.8726 13.3726 7.5 20 7.5C26.6274 7.5 32 12.8726 32 19.5C32 26.1274 26.6274 31.5 20 31.5H19" stroke="white" strokeWidth="2" />
                                                <path d="M12 32.5V19.66C12 15.1534 15.5817 11.5 20 11.5C24.4183 11.5 28 15.1534 28 19.66C28 24.1666 24.4183 27.82 20 27.82H19" stroke="white" strokeWidth="2" />
                                                <circle cx="20" cy="19.5214" r="5" fill="white" />
                                            </svg> */}

                                        <div className="grow ">
                                            <p className="md:text-xl text-gray-800 font-semibold dark:text-neutral-200">
                                                {currentMeeting?.title}
                                            </p>
                                            <p className="text-sm md:text-base text-gray-800 dark:text-neutral-200">
                                             
                                            </p>
                                        </div>
                                    </div>
                                    {/* End Col */}

                                    <div className="text-center sm:text-start flex sm:justify-end sm:items-center gap-x-3 md:gap-x-4">
                                        {/* <a className="py-2 px-3 md:py-3 md:px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" href="#">
                                            Free trial
                                        </a>
                                        <a className="py-2 px-3 md:py-3 md:px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-800 text-gray-800 hover:border-gray-500 hover:text-gray-500 focus:outline-hidden focus:text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:border-white dark:text-white dark:hover:text-neutral-300 dark:hover:border-neutral-300 dark:focus:text-neutral-300 dark:focus:border-neutral-300" href="#">
                                            Buy now
                                        </a> */}
                                    </div>
                                    {/* End Col */}
                                </div>
                                {/* End Grid */}
                            </div>
                        </div>


                    </div>

                    <div className="mt-3">
                        <EditorContent contentEditable={"false"} autoCapitalize="on" className=" border border-gray-200  dark:border-neutral-700 rounded-md bg-white " editor={editor} />
                    </div>


                    <div className="space-y-5 px-2 mt-3 pb-4">

                        chat here

                    </div>
                </div>


                <div className="relative bottom-2 w-full px-2 ">

                    {/* Textarea */}
                    <div className="bg-white border border-gray-300 rounded-2xl shadow-xs dark:bg-neutral-800 dark:border-neutral-600">
                        <label htmlFor="hs-pro-aimt" className="sr-only">Ask anything...</label>

                        <div className="pb-2 px-2">
                            <textarea id="hs-pro-aimt" className="max-h-36  pt-4 pb-2 ps-2 pe-4 block w-full bg-transparent border-transparent resize-none text-gray-800 placeholder-gray-500 focus:outline-hidden focus:border-transparent focus:ring-transparent disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:text-neutral-200 dark:placeholder-neutral-500 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500" placeholder="Ask anything..." data-hs-textarea-auto-height></textarea>

                            <div className="pt-2 flex justify-between items-center gap-x-1">
                                {/* Button Group */}
                                <div className="flex items-center gap-x-1">
                                    {/* Add Media Dropdown */}
                                    <div className="hs-dropdown [--scope:window] relative inline-flex">
                                        <button id="hs-pro-aimtaf" type="button" className="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:hover:text-neutral-200 dark:focus:text-neutral-200">
                                            <svg className="shrink-0 size-4.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                                            <span className="sr-only">Add Media</span>
                                        </button>

                                        {/* Add Media Dropdown */}
                                        <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 w-50 transition-[opacity,margin] duration opacity-0 hidden z-11 bg-white border border-gray-200 rounded-xl shadow-lg before:absolute before:-top-4 before:start-0 before:w-full before:h-5 dark:bg-neutral-950 dark:border-neutral-700" role="menu" aria-orientation="vertical" aria-labelledby="hs-pro-aimtaf">
                                            <div className="p-1 space-y-0.5">
                                                <button type="button" className="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                                                    <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551" /></svg>
                                                    Upload a file
                                                </button>
                                                <button type="button" className="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                                                    <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
                                                    Add a screenshot
                                                </button>
                                            </div>
                                        </div>
                                        {/* End Add Media Dropdown */}
                                    </div>
                                    {/* End Add Media Dropdown */}

                                    {/* Tools Dropdown */}
                                    <div className="hs-dropdown [--scope:window] relative inline-flex">
                                        <button id="hs-pro-aimttl" type="button" className="flex justify-center items-center gap-x-1 py-1.5 px-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:hover:text-neutral-200 dark:focus:text-neutral-200">
                                            <svg className="shrink-0 size-4.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 17H5" /><path d="M19 7h-9" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" /></svg>
                                            Tools
                                        </button>

                                        {/* Tools Dropdown */}
                                        <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 w-50 transition-[opacity,margin] duration opacity-0 hidden z-11 bg-white border border-gray-200 rounded-xl shadow-lg before:absolute before:-top-4 before:start-0 before:w-full before:h-5 dark:bg-neutral-950 dark:border-neutral-700" role="menu" aria-orientation="vertical" aria-labelledby="hs-pro-aimttl">
                                            <div className="p-1 space-y-0.5">
                                                <button type="button" className="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                                                    <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 22H4a2 2 0 0 1-2-2V6" /><path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18" /><circle cx="12" cy="8" r="2" /><rect width="16" height="16" x="6" y="2" rx="2" /></svg>
                                                    Create an image
                                                </button>
                                                <button type="button" className="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                                                    <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
                                                    Search the web
                                                </button>
                                                <button type="button" className="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                                                    <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /><path d="m15 5 4 4" /></svg>
                                                    Write or code
                                                </button>
                                                <button type="button" className="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                                                    <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10.065 12.493-6.18 1.318a.934.934 0 0 1-1.108-.702l-.537-2.15a1.07 1.07 0 0 1 .691-1.265l13.504-4.44" /><path d="m13.56 11.747 4.332-.924" /><path d="m16 21-3.105-6.21" /><path d="M16.485 5.94a2 2 0 0 1 1.455-2.425l1.09-.272a1 1 0 0 1 1.212.727l1.515 6.06a1 1 0 0 1-.727 1.213l-1.09.272a2 2 0 0 1-2.425-1.455z" /><path d="m6.158 8.633 1.114 4.456" /><path d="m8 21 3.105-6.21" /><circle cx="12" cy="13" r="2" /></svg>
                                                    Run deep research
                                                </button>
                                                <button type="button" className="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                                                    <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></svg>
                                                    Think for longer
                                                </button>
                                            </div>
                                        </div>
                                        {/* End Tools Dropdown */}
                                    </div>
                                    {/* End Tools Dropdown */}
                                </div>
                                {/* End Button Group */}

                                {/* Button Group */}
                                <div className="flex items-center gap-x-1">
                                    {/* Select */}

                                    {/* End Select */}

                                    {/* Button */}
                                    <button type="button" className="flex justify-center items-center gap-x-1.5 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:hover:text-neutral-200 dark:focus:text-neutral-200">
                                        <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
                                        <span className="sr-only">Send voice message</span>
                                    </button>
                                    {/* End Button */}

                                    {/* Send Button */}
                                    <button type="button" className="inline-flex shrink-0 justify-center items-center size-8 text-sm font-medium rounded-lg text-white bg-cyan-700 hover:bg-cyan-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-cyan-600">
                                        <span className="sr-only">Send</span>
                                        <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7" /><path d="M12 19V5" /></svg>
                                    </button>
                                    {/* End Send Button */}
                                </div>
                                {/* End Button Group */}
                            </div>
                        </div>
                    </div>
                    {/* End Textarea */}


                </div>




            </div>
        </div >

    )
}







{/* <div className="mt-10 space-y-4 ">
    {[...Array(4)].map((_, i) => (
        <p key={i} className="mt-4">
            More content {i + 1}...
        </p>
    ))}
</div> */}



<>

    <li className="max-w-lg flex gap-x-2 sm:gap-x-4 me-11">
        <img className="inline-block size-9 rounded-full" src="https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&&auto=format&fit=facearea&facepad=3&w=300&h=300&q=80" alt="Avatar" />

        <div>
            {/* Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3 dark:bg-neutral-900 dark:border-neutral-700">
                <h2 className="font-medium text-gray-800 dark:text-white">
                    How can we help?
                </h2>
                <div className="space-y-1.5">
                    <p className="mb-1.5 text-sm text-gray-800 dark:text-white">
                        You can ask questions like:
                    </p>
                    <ul className="list-disc list-outside space-y-1.5 ps-3.5">
                        <li className="text-sm text-gray-800 dark:text-white">
                            What's Preline UI?
                        </li>

                        <li className="text-sm text-gray-800 dark:text-white">
                            How many Starter Pages & Examples are there?
                        </li>

                        <li className="text-sm text-gray-800 dark:text-white">
                            Is there a PRO version?
                        </li>
                    </ul>
                </div>
            </div>
            {/* End Card */}

            <span className="mt-1.5 flex items-center gap-x-1 text-xs text-gray-500 dark:text-neutral-500">
                <svg className="shrink-0 size-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 7 17l-5-5"></path>
                    <path d="m22 10-7.5 7.5L13 16"></path>
                </svg>
                Sent
            </span>
        </div>
    </li>
    {/* End Chat */}

    {/* Chat */}
    <li className="flex ms-auto gap-x-2 sm:gap-x-4">
        <div className="grow text-end space-y-3">
            <div className="inline-flex flex-col justify-end">
                {/* Card */}
                <div className="inline-block bg-blue-600 rounded-2xl p-4 shadow-2xs">
                    <p className="text-sm text-white">
                        what's preline ui?
                    </p>
                </div>
                {/* End Card */}

                <span className="mt-1.5 ms-auto flex items-center gap-x-1 text-xs text-gray-500 dark:text-neutral-500">
                    <svg className="shrink-0 size-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 7 17l-5-5"></path>
                        <path d="m22 10-7.5 7.5L13 16"></path>
                    </svg>
                    Sent
                </span>
            </div>
        </div>

        <span className="shrink-0 inline-flex items-center justify-center size-9.5 rounded-full bg-gray-600">
            <span className="text-sm font-medium text-white">AZ</span>
        </span>
    </li>
    {/* End Chat */}

    {/* Chat Bubble */}
    <li className="max-w-lg flex gap-x-2 sm:gap-x-4 me-11">
        <img className="inline-block size-9 rounded-full" src="https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&&auto=format&fit=facearea&facepad=3&w=300&h=300&q=80" alt="Avatar" />

        <div>
            {/* Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3 dark:bg-neutral-900 dark:border-neutral-700">
                <p className="text-sm text-gray-800 dark:text-white">
                    Preline UI is an open-source set of prebuilt UI components based on the utility-first Tailwind CSS framework.
                </p>
                <div className="space-y-1.5">
                    <p className="text-sm text-gray-800 dark:text-white">
                        Here're some links to get started
                    </p>
                    <ul>
                        <li>
                            <a className="text-sm text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500 dark:hover:text-blue-400" href="../docs/index.html">
                                Installation Guide
                            </a>
                        </li>
                        <li>
                            <a className="text-sm text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500 dark:hover:text-blue-400" href="../docs/frameworks.html">
                                Framework Guides
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            {/* End Card */}

            <span className="mt-1.5 flex items-center gap-x-1 text-xs text-red-500">
                <svg className="shrink-0 size-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" x2="12" y1="8" y2="12"></line>
                    <line x1="12" x2="12.01" y1="16" y2="16"></line>
                </svg>
                Not sent
            </span>
        </div>
    </li>
    <li className="max-w-lg flex gap-x-2 sm:gap-x-4 me-11">
        <img className="inline-block size-9 rounded-full" src="https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&&auto=format&fit=facearea&facepad=3&w=300&h=300&q=80" alt="Avatar" />

        <div>
            {/* Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3 dark:bg-neutral-900 dark:border-neutral-700">
                <p className="text-sm text-gray-800 dark:text-white">
                    Preline UI is an open-source set of prebuilt UI components based on the utility-first Tailwind CSS framework.
                </p>
                <div className="space-y-1.5">
                    <p className="text-sm text-gray-800 dark:text-white">
                        Here're some links to get started
                    </p>
                    <ul>
                        <li>
                            <a className="text-sm text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500 dark:hover:text-blue-400" href="../docs/index.html">
                                Installation Guide
                            </a>
                        </li>
                        <li>
                            <a className="text-sm text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500 dark:hover:text-blue-400" href="../docs/frameworks.html">
                                Framework Guides
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            {/* End Card */}

            <span className="mt-1.5 flex items-center gap-x-1 text-xs text-red-500">
                <svg className="shrink-0 size-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" x2="12" y1="8" y2="12"></line>
                    <line x1="12" x2="12.01" y1="16" y2="16"></line>
                </svg>
                Not sent
            </span>
        </div>
    </li>




</>