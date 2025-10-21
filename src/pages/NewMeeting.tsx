import { useSelector } from "react-redux";
import DatePicker from "../components/DatePicker"
import TimePicker from "../components/TimePicker"
import type { AppState } from "../redux/app/store";
import { useState } from "react";
import TipTapEditor from "../components/TiptapEditor";
import { useApiMutation } from "../api/useApiMutation";
import { BeakerIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";
import useToast from "../hooks/Toast";
import { useApiQuery } from "../api/useApiQuery";
import MeetingInvitation from "../components/userSelect";
import { Form, useNavigate } from "react-router-dom";


interface FormData {
    title: string;
    description: string;
    time: any;
    status: "upcoming" | "past" | "active";
    agenda: string;
    host: string;
    location: string;

}

interface ApiUser {
    id?: string | number;
    name?: string;
    username?: string;
    avatar?: string;
    meeting_access?: boolean;
}

interface UserOption {
    id: string | number;
    name: string;
    description: string;
    selected: boolean;
    meeting_access: boolean;
    avatar: string;
}

interface CombineDateTimeParams {
    dateStr: string;
    hour: string;
    minute: string;
    period: 'AM' | 'PM' | string;
}

function combineDateTimeLocal(
    dateStr: string,
    hour: string,
    minute: string,
    period: string
): string {
    const [day, month, year] = dateStr.split('/').map(Number);

    let hourNum: number = parseInt(hour, 10);
    const minuteNum: number = parseInt(minute, 10);

    // Convert 12-hour to 24-hour
    if (period === 'PM' && hourNum !== 12) {
        hourNum += 12;
    } else if (period === 'AM' && hourNum === 12) {
        hourNum = 0;
    }

    // Build local ISO string manually
    const isoStringLocal = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hourNum).padStart(2, '0')}:${String(minuteNum).padStart(2, '0')}:00`;

    return isoStringLocal; // Example: "2025-10-14T14:00:00"
}

function NewMeeting() {
    const { mutate, isPending, isError, error, isSuccess, } = useApiMutation('POST', '/api/meetings/meetings/', ['meetings']);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState({ hour: "00", minute: "00", period: "AM", });
    const auth = useSelector((state: AppState) => state.auth);
    const { showToast } = useToast()
    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        agenda: '',
        host: (auth?.user?.id ?? 0).toString(),
        location: "",
        status: "upcoming",
        time: ""


    });

    const navigate = useNavigate()
    const [updateUserList, setUpdatedUserList] = useState<UserOption[]>([]);



    const handleTimeChange = (time: CombineDateTimeParams) => {
        setSelectedTime(time);
        const isoDatetime = combineDateTimeLocal(selectedDate ?? "", time.hour, time.minute, time.period);
        setFormData((prev) => ({
            ...prev,
            ['time']: isoDatetime
        }))
        setErrors({})
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setErrors({})
    }
    const handleDateChange = (date: any) => {
        setSelectedDate(date);
        const isoDatetime = combineDateTimeLocal(date, selectedTime.hour, selectedTime.minute, selectedTime.period);
        setFormData((prev) => ({
            ...prev,
            ['time']: isoDatetime
        }))
        setErrors({})
    };




    const [errors, setErrors] = useState<Record<string, string>>({});
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    const handlePostMeeting = () => {

        const newErrors: Record<string, string> = {};



        if (updateUserList.length == 0) {
            newErrors['users'] = 'Meeting Guest is requred .'
        }

        if (selectedDate === null) {
            newErrors['date'] = `Date is required.`;

        }
        if (selectedTime.hour === '00' && selectedTime.minute === '00') {
            newErrors['time'] = `Time is required.`;

        }
        Object.entries(formData).forEach(([key, value]) => {
            if (typeof value === 'string') {
                if (value.trim() === '') {
                    newErrors[key as keyof FormData] = `${capitalize(key)} is required.`;
                }
            }
        });
        setErrors(newErrors)

        if (Object.keys(newErrors).length > 0) {
            Object.entries(newErrors).forEach(([, msg]) => {
                showToast({
                    type: "markup2",
                    message: msg,
                    status: "failed",
                    // avatar: "https://randomuser.me/api/portraits/men/60.jpg",
                    avatar: <ExclamationCircleIcon className="size-6 text-blue-500" />,
                    duration: 3000,
                })
            });

            return;
        }

        const updatedFormData = {
            ...formData,
            users: updateUserList
        };
        setFormData(updatedFormData);

        mutate(updatedFormData,
            {
                onSuccess: () => {
                    showToast({
                        type: "markup1",
                        title: "New meetings created",
                        message: `${formData['title']} has beed created `,
                        avatar: `<svg width="40" height="40" fill="orange"><circle cx="20" cy="20" r="20"/></svg>`,
                        actionText: "Go to meetings",
                        actionLink: "/",
                        duration: 4000,
                    })
                    navigate('/')
                },
                onError: (err: any) => {
                    console.log()
                    showToast({
                        type: "markup2",
                        message: err.response.data.error,
                        status: "normal",
                        // avatar: "https://randomuser.me/api/portraits/men/60.jpg",
                        avatar: <BeakerIcon className="size-6 text-blue-500" />,
                        duration: 3000,
                    })
                    
                }
            }
        );



    };

    const { data: locations, } = useApiQuery(['locations'], '/api/meetings/locations/', undefined);

    const { data: userData, } = useApiQuery(['users'], '/api/users/user/', undefined);



    const usersFromApi: UserOption[] = (userData as ApiUser[])?.map((user: ApiUser, index: number): UserOption => ({
        id: user.id ?? index,
        name: user.username || 'Unnamed',
        description: user.username || 'No description',
        selected: false,
        meeting_access: user.meeting_access || false,
        avatar: user.avatar || `https://ui-avatars.com/api/?name=${user.name || 'User'}` // fallback avatar
    })) || [];

    const handleUpdatedUserList = (e: UserOption[]) => {
        setUpdatedUserList(e)
        console.log("me updating", e)
        setErrors({})
    }

    return (
        <>
            {/* Card Section */}
            <div className=" ">{/* Card */}
                <div className="bg-white rounded-xl shadow-xs  p-2 dark:bg-neutral-800">
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-200">
                            Host New Meeting
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-neutral-400">
                            Start an instant meeting with participants. Create a seamless virtual space for discussions,
                        </p>
                    </div>

                    {/* <form> */}
                    {/* Grid */}
                    <div className="grid sm:grid-cols-12 gap-2 sm:gap-6">
                        <div className="sm:col-span-3">
                            <label className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                Host
                            </label>
                        </div>
                        {/* End Col */}

                        <div className="sm:col-span-9">
                            <div className="flex items-center gap-5">
                                <img className="inline-block size-16 rounded-full ring-2 ring-white dark:ring-neutral-900 object-cover" src={`${auth.user?.profile_image ? auth.user?.profile_image: 'https://preline.co/assets/img/160x160/img1.jpg'}`} alt="Avatar" />
                                <div className="flex gap-x-2">

                                    {/* <div className="sm:flex"> */}
                                    <input disabled id="af-account-full-name" type="text" value={auth?.user?.name} className="py-1.5 sm:py-2 px-3 pe-11 block w-full border focus:outline-none border-gray-200 shadow-2xs -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg sm:text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="Maria" />
                                    <input disabled type="text" value={auth.user?.user_name} className="py-1.5 sm:py-2 px-3 pe-11 block w-full border focus:outline-none border-gray-200 shadow-2xs -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg sm:text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="Boone" />
                                    {/* </div> */}
                                </div>

                            </div>
                        </div>
                        {/* End Col */}

                        <div className="sm:col-span-3">
                            <label htmlFor="af-account-gender-checkbox" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                Meeting Invitations
                            </label>
                        </div>
                        {/* End Col */}

                        <div className="sm:col-span-9 ">
                            <MeetingInvitation usersFromApi={usersFromApi} onUpdatedList={handleUpdatedUserList} error={errors['users'] ? true : false} />
                        </div>
                        {/* End Col */}

                        <div className="sm:col-span-3">
                            <label htmlFor="af-account-full-name" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                Meeting Title
                            </label>
                            <div className="hs-tooltip inline-block">
                                <svg className="hs-tooltip-toggle ms-1 inline-block size-3 text-gray-400 dark:text-neutral-600" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                </svg>
                                <span className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible w-40 text-center z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-2xs dark:bg-neutral-700" role="tooltip">
                                    Give a meeting title for identify the meetings
                                </span>
                            </div>
                        </div>
                        {/* End Col */}

                        <div className="sm:col-span-9">
                            <input id="af-account-email" type="text" name="title" value={formData.title} onChange={handleInputChange} className={`py-1.5 sm:py-2 px-3 pe-11 block w-full border focus:outline-none border-gray-200 shadow-2xs sm:text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 ${errors['title'] && "border-red-700 dark:border-red-700"}`} placeholder="Daily Meetings | Weekly meetings ..." />
                        </div>
                        {/* End Col */}

                        <div className="sm:col-span-3">
                            <label htmlFor="af-account-email" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                Description
                            </label>
                        </div>
                        {/* End Col */}

                        <div className="sm:col-span-9">
                            <textarea id="af-account-bio" name="description" value={formData.description} onChange={handleInputChange} className={`py-1.5 sm:py-2 px-3 block w-full border  focus:outline-none border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 ${errors['description'] && "border-red-700 dark:border-red-700"}`} rows={6} placeholder="Add you're description here ..."></textarea>
                        </div>
                        {/* End Col */}

                        <div className="sm:col-span-3">
                            <label htmlFor="af-account-password" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                Agenda
                            </label>
                        </div>



                        {/* End Col */}

                        <div className="sm:col-span-9 ">
                            <TipTapEditor name="agenda" error={errors['agenda'] ? true : false} onChange={handleInputChange} />
                   
                        </div>
                        {/* End Col */}




                        <div className="sm:col-span-3">
                            <div className="inline-block">
                                <label htmlFor="af-account-phone" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                    Location
                                </label>
                            </div>
                        </div>
                        {/* End Col */}

                        <div className="sm:col-span-9">
                            <div className="sm:flex">
                                <input id="af-account-phone" type="search" name="location" value={formData.location} onChange={handleInputChange} className={`${errors['location'] && 'border-red-700 dark:border-red-700'} py-1.5 sm:py-2 px-3  block w-full border focus:outline-none border-gray-200 shadow-2xs -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg sm:text-sm relative  focus:border-blue-500 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600`} placeholder="Conference hall | Meeting room ..." />
                                <select onChange={handleInputChange} name="location" className={`${errors['location'] && 'border-red-700 dark:border-red-700'}  py-1.5 sm:py-2 px-3 pe-9 block w-full sm:w-auto border focus:outline-none border-gray-200 shadow-2xs -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg sm:text-sm relative  focus:border-blue-500 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600`}>
                                    <option
                                        value=""
                                        selected={!locations?.some((loc: any) => loc.name === formData['location'])}
                                    >
                                        Select Location
                                    </option>
                                    {locations?.map((location: any) => (
                                        <option key={location.id}>{location.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* <p className="mt-3">
                                <a className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500" >
                                    <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>
                                    Add new location
                                </a>
                            </p> */}
                        </div>
                        {/* End Col */}

                        <div className="sm:col-span-3">
                            <label htmlFor="af-account-gender-checkbox" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                Date, Time
                            </label>
                        </div>
                        {/* End Col */}

                        <div className="sm:col-span-9 flex gap-x-2 ">
                            <DatePicker onDateSelect={handleDateChange} error={errors['date'] ? true : false} />
                            <TimePicker onTimeSelect={handleTimeChange} error={errors['time'] ? true : false} />
                        </div>
                        {/* End Col */}



                        {/* End Col */}
                    </div>
                    {/* End Grid */}

                    <div className="mt-5 flex justify-end gap-x-2">
                        <button type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                            Cancel
                        </button>
                        <button type="button" onClick={handlePostMeeting} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                            Host Now 
                        </button>
                    </div>
                    {/* </form> */}
                </div>
                {/* End Card */}
            </div>
            {/* End Card Section */}</>
    )
}

export default NewMeeting