
import svg from '../componenets/vectorIllustrations/404.svg';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';



export default function NotFoundPage() {
    return (
        <div className='flex h-screen justify-center items-center '>
            <div className='w-100  '>
                <img className='animate-bounce' src={svg} alt="Not Found" />
                <button
                    type="button"
                    onClick={() => {
                        window.location.href = "http://172.16.4.253/GOLD_BLOG1/Default.aspx";
                    }}

                    className="  py-2 rs-picker-input-group rs-input-group justify-evenly px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white !text-gray-800 shadow-2xs  focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                >
                    <span className="text-blue-600 truncate flex gap-3 "> <ArrowLeftIcon height={20} width={20} /> Back to Main </span>
                </button>
            </div>
        </div>
    )
}
