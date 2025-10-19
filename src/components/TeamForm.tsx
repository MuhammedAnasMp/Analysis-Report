import { BeakerIcon, ExclamationCircleIcon, UserCircleIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { AppState } from "../redux/app/store";
import { useApiMutation } from "../api/useApiMutation";
import useToast from "../hooks/Toast";

function generateRandomUsername() {
    const randomStr = Math.random().toString(36).substring(2, 10); // 8 chars
    return `user_${randomStr}`;
}
export default function TeamForm({ ownerdepartment }: { ownerdepartment: string | undefined }) {

    const auth = useSelector((state: AppState) => state.auth)
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        role: '',
        department: auth.user?.department || '',
        added_by: auth.user?.id,
        username: generateRandomUsername()

    });

    const { showToast } = useToast()
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ["username"]: generateRandomUsername()
        }));

    };
    const [errors, setErrors] = useState<Record<string, string>>({});
    console.log(errors)
    const { mutate, isPending } = useApiMutation('POST', `/api/users/user/`, ['teamMembers']);
    const formatId = (s: string) => s.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const handleSubmit = () => {
        let newFormData = { ...formData };




        if (formData.last_name === "") {
            const names = formData.first_name.trim().split(" ");

            if (names.length > 1) {
                newFormData.first_name = names[0];
                newFormData.last_name = names.slice(1).join(" ");
            } else {
                newFormData.first_name = formData.first_name;
                newFormData.last_name = formData.first_name;
            }
        }


        const newErrors: Record<string, string> = {};

        Object.entries(formData).forEach(([key, value]) => {
            if (typeof value === 'string') {
                if (value.trim() === '') {
                    if (key === 'department') {
                        newErrors[key] = `You must complete you're profile for add new member in team `;
                    }
                    else {
                        if (key === 'last_name') return
                        newErrors[key] = `${formatId(key)} is required.`;
                    }
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


        mutate(newFormData,
            {
                onSuccess: () => {
                    showToast({
                        type: "markup1",
                        title: "Member has been added",
                        message: `Nem member ${formData.first_name} beed added to ${ownerdepartment} department `,
                        avatar: auth.user?.profile_image,
                        // actionText: "Go to meetings",
                        // actionLink: "/",
                        duration: 4000,
                    })

                    setFormData((prev) => ({
                        ...prev,
                        ['first_name']: '',
                        ["last_name"]: '',
                        ["role"]: '',

                    }));

                },
                onError: (err: any) => {
                    console.log(err.response.data);

                    const errorData = err.response.data;

                    const firstErrorMessage = String(
                        Object.values(errorData).flat().shift() ?? "An error occurred"
                    );

                    showToast({
                        type: "markup2",
                        message: firstErrorMessage,
                        status: "normal",
                        avatar: <BeakerIcon className="size-6 text-blue-500" />,
                        duration: 3000,
                    });
                }


            }
        );
    }




    

    return (
        <div>{/* Hero */}
            <div className="relative bg-linear-to-bl .from-blue-100 via-transparent dark:from-blue-950 dark:via-transparent">
                <div className="max-w-[85rem]  py-10 px-2  mx-auto ">
                    {/* Grid */}
                    <div className="grid  md:grid-cols-2 gap-8 lg:gap-12">
                        <div className="">
                          
                            <form onSubmit={(e) => {

                                e.preventDefault()
                                handleSubmit()
                            }}>
                                <div className="lg:max-w-full lg:mx-auto lg:me-0 ms-auto ">
                                    {/* Card */}
                                    <div className="p-4 sm:p-7 flex flex-col  border border-gray-200 dark:border-neutral-700 rounded-xl shadow-lg bg-white/30 backdrop-blur dark:bg-neutral-900/30">
                                        <div className="text-center">
                                            <h1 className="block text-xl font-bold text-gray-800 dark:text-white">Add members to your team.</h1>
                                            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                                                Teamwork starts here.
                                                {/* <a className="text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500" href="#">
                                                    Sign in here
                                                </a> */}
                                            </p>
                                        </div>

                                        <div className="mt-5">


                                            {/* Grid */}
                                            <div className="grid grid-rows-2 gap-4">
                                                {/* Input Group */}
                                                <div>
                                                    {/* Floating Input */}
                                                    <div className="relative">
                                                        <input
                                                            required
                                                            value={formData['first_name']}
                                                            onChange={handleInputChange}
                                                            name="first_name"
                                                            type="text" id="hs-hero-signup-form-floating-input-first-name" className="peer p-3 sm:p-4 block w-full border focus:outline-none border-gray-200 rounded-lg sm:text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
                                                                focus:pt-6
                                                                focus:pb-2
                                                                not-placeholder-shown:pt-6
                                                                not-placeholder-shown:pb-2
                                                                autofill:pt-6
                                                                autofill:pb-2" placeholder="John" />
                                                        <label htmlFor="hs-hero-signup-form-floating-input-first-name" className="absolute top-0 start-0 p-3 sm:p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
                                                                peer-focus:scale-90
                                                                peer-focus:translate-x-0.5
                                                                peer-focus:-translate-y-1.5
                                                                peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
                                                                peer-not-placeholder-shown:scale-90
                                                                peer-not-placeholder-shown:translate-x-0.5
                                                                peer-not-placeholder-shown:-translate-y-1.5
                                                                peer-not-placeholder-shown:text-gray-500 dark:peer-not-placeholder-shown:text-neutral-500 ">Full name</label>
                                                    </div>
                                                    {/* End Floating Input */}
                                                </div>
                                                {/* End Input Group */}

                                                {/* Input Group */}
                                                <div>
                                                    {/* Floating Input */}
                                                    <div className="relative">
                                                        <input
                                                            required
                                                            value={formData['role']}
                                                            onChange={handleInputChange}
                                                            name="role"
                                                            type="text" id="hs-hero-signup-form-floating-input-last-name" className="peer p-3 sm:p-4 block w-full  focus:outline-none border border-gray-200 rounded-lg sm:text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
                                                                    focus:pt-6
                                                                    focus:pb-2
                                                                    not-placeholder-shown:pt-6
                                                                    not-placeholder-shown:pb-2
                                                                    autofill:pt-6
                                                                    autofill:pb-2" placeholder="Doe" />
                                                        <label htmlFor="hs-hero-signup-form-floating-input-last-name" className="absolute top-0 start-0 p-3 sm:p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
                                                                peer-focus:scale-90
                                                                peer-focus:translate-x-0.5
                                                                peer-focus:-translate-y-1.5
                                                                peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
                                                                peer-not-placeholder-shown:scale-90
                                                                peer-not-placeholder-shown:translate-x-0.5
                                                                peer-not-placeholder-shown:-translate-y-1.5
                                                                peer-not-placeholder-shown:text-gray-500 dark:peer-not-placeholder-shown:text-neutral-500 ">Role name</label>
                                                    </div>
                                                    {/* End Floating Input */}
                                                </div>
                                                <div className="relative">
                                                    <input

                                                        name="department"

                                                        value={ownerdepartment ? ownerdepartment : "Please Add you're department"}
                                                        type="text" id="hs-hero-signup-form-floating-input-last-name" className="peer p-3 sm:p-4 block w-full  focus:outline-none border border-gray-200 rounded-lg sm:text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
                                                                    focus:pt-6
                                                                    focus:pb-2
                                                                    not-placeholder-shown:pt-6
                                                                    not-placeholder-shown:pb-2
                                                                    autofill:pt-6
                                                                    autofill:pb-2" placeholder="Doe" />
                                                    <label htmlFor="hs-hero-signup-form-floating-input-last-name" className="absolute top-0 start-0 p-3 sm:p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
                                                                peer-focus:scale-90
                                                                peer-focus:translate-x-0.5
                                                                peer-focus:-translate-y-1.5
                                                                peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
                                                                peer-not-placeholder-shown:scale-90
                                                                peer-not-placeholder-shown:translate-x-0.5
                                                                peer-not-placeholder-shown:-translate-y-1.5
                                                                peer-not-placeholder-shown:text-gray-500 dark:peer-not-placeholder-shown:text-neutral-500  ">Department name</label>
                                                </div>

                                            </div>
                                            {/* End Grid */}



                                            <div className="mt-5">
                                                <button type="submit" className="w-full  py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                                                    <UserPlusIcon height={20} width={20} /> Add members
                                                    {
                                                        isPending &&
                                                        <div className="animate-spin inline-block size-4 border-3 border-current border-t-transparent  rounded-full dark:text-blue-500 text-white" role="status" aria-label="loading">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    }

                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Card */}
                                </div>
                            </form>
                            {/* End Form */}
                        </div>

                        <div className="flex flex-col ">
                            <div className="-m-1.5 overflow-x-auto">
                                <div className="p-1.5 min-w-full inline-block align-middle ">
                                  
                                    <div className="border border-gray-200 rounded-lg shadow-lg overflow-hidden hide-scrollbar dark:border-neutral-700 dark:shadow-gray-900 h-98  overflow-y-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                                            <thead className="bg-gray-50 dark:bg-neutral-700 ">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:bg-neutral-800 dark:text-gray-200">First Name</th>
                                                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:bg-neutral-800 dark:text-gray-200">Last Name</th>
                                                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:bg-neutral-800 dark:text-gray-200">Role</th>
                                                    <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:bg-neutral-800 dark:text-gray-200">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                                            
                                                


                                                <tr>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">Joe Black</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">31</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">Sidney No. 1 Lake Park</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                                        <button type="button" className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:text-blue-400">Delete</button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>




                    </div>
                    {/* End Grid */}


                </div>
                {/* End Clients Section */}
            </div>
            {/* End Hero */}</div>
    )
}
