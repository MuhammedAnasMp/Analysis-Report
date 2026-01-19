
import { useEffect, useState } from 'react';
import svg from '../componenets/vectorIllustrations/404.svg';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { error } from 'jquery';
import useToast from '../hooks/Toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetStoreState } from '../redux/features/pptState/storeSlice';



export default function NotFoundPage() {
    const [isGenerateButtonClicked, setGenerateButtonClicked] = useState(false)
    const [code, setCode] = useState<string>('')
    const navigate = useNavigate()
    const { showToast } = useToast()

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(resetStoreState())
    }, [])
    const handleKeyDown = async (event: any) => {
        if (event.key === 'Enter') {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/generatetoken?code=${code}`);
                const data: any = await response.json();

                if (data.code) {
                    // Navigate to /<code>
                    navigate(`/${data.code}`);
                    // Refresh the window
                    window.location.reload();
                } else if (data.error) {
                    showToast({
                        type: "markup2",
                        message: `${data.error}`,
                        status: "failed",
                        avatar: <XCircleIcon className="size-6 text-blue-500" />,
                        duration: 3000,
                    })
                }
            }

            catch (err: any) {
                showToast({
                    type: "markup2",
                    message: `${err.response.data.error}`,
                    status: "failed",
                    avatar: <XCircleIcon className="size-6 text-blue-500" />,
                    duration: 3000,
                })
            }
        }
    }
    return (
        <div className='flex h-screen justify-center items-center '>
            <div className='w-100  '>
                <img className='animate-bounce' src={svg} alt="Not Found" />
                <div className='flex flex-col gap-2 justify-between items-center '>
                    <button
                        type="button"
                        onClick={() => {
                           navigate('/')
                        }}

                        className="  py-2 rs-picker-input-group rs-input-group justify-evenly px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white !text-gray-800 shadow-2xs  focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                    >
                        <span className="text-blue-600 truncate flex gap-3 "> <ArrowLeftIcon height={20} width={20} /> Back to Main </span>
                    </button>
                    <div className=''>
                        {
                            !isGenerateButtonClicked ?
                                <p onClick={() => setGenerateButtonClicked(prev => !prev)}><a className="text-blue-600 underline underline-offset-1 decoration-blue-600 hover:opacity-80 focus:outline-hidden focus:opacity-80" href="#">Generate token</a></p>
                                :

                                <div className='flex gap-2 justify-center items-center'>
                                    <span onClick={() => setGenerateButtonClicked(prev => !prev)} className="text-blue-600  decoration-blue-600  focus:outline-hidden focus:opacity-80">Enter the code  </span>
                                    <input onChange={(e) => setCode(e.target.value)} onKeyDown={handleKeyDown} type="text" className="py-1.5 sm:py-1 px-1.5 w-32 block  border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 focus:outline-none border" placeholder=" Enter !T + ID" />
                                </div>

                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
