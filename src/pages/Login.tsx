import { useDispatch } from "react-redux";

import { login, logout } from "../redux/features/auth/authSlice";
import React, { useState} from "react";
import { useApiMutation } from "../api/useApiMutation";
import useToast from "../hooks/Toast";
import { BeakerIcon } from "@heroicons/react/24/solid";

interface LoginData {
  username: string;
  password: string;
}







export default function Login() {
  const {showToast} =useToast()
  const dispatch = useDispatch();
  const [formData, setFoarmData] = useState<LoginData>({
    username: '',
    password: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFoarmData((prev) => ({
      ...prev,
      [name]: value

    }))
  }
  const { mutate, isPending, isError, error, isSuccess, } = useApiMutation('POST', '/api/users/login/', ['users']);

  const handleLogin = (e: any) => {
    e.preventDefault();
      // if (formData.username == '' && formData.password == '') {
      //   alert("username passoword are rquired")
      // }
    mutate({ username: formData.username, password: formData.password },
      {
        onSuccess: (responseData) => {
          dispatch(login({ user: responseData.user, token: responseData.token }));
        },
        onError: (err:any) => {
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




  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <div className="lg:flex lg:items-center lg:justify-center">
      <div className="lg:w-md mt-7  border border-gray-200 rounded-xl shadow-2xs dark:bg-neutral-800 OS dark:border-neutral-700">
        <div className="p-4 sm:p-7 ">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">User  Login</h1>

          </div>

          <div className="mt-5">



            {/* Form */}

            <form action={(e) => console.log(e)}>


              <div className="grid gap-y-4">
                {/* Form Group */}
                <div>
                  <label htmlFor="user_id" className="block text-sm mb-2 dark:text-white ">User Id</label>
                  <div className="relative">
                    <input type="text" id="user_id" name="username" value={formData.username} onChange={handleInputChange} className="py-2.5 sm:py-3 px-4 block w-full border border-gray-200 rounded-lg sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 OS dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" required aria-describedby="id-error" />
                    <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                      <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                      </svg>
                    </div>
                  </div>
                </div>
                {/* End Form Group */}

                {/* Form Group */}
                <div>
                  <label htmlFor="password" className="block text-sm mb-2 dark:text-white">Password</label>
                  <div className="relative">
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} className="py-2.5 sm:py-3 px-4 block w-full border border-gray-200 rounded-lg sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 OS dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" required aria-describedby="password-error" />
                    <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                      <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                      </svg>
                    </div>
                  </div>
                </div>
                {/* End Form Group */}



                <button type="submit" onClick={handleLogin} className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                  Login

                  {isPending &&
                    <div className="animate-spin inline-block size-4 border-3 border-current border-t-transparent text-white-600 rounded-full dark:text-blue-500" role="status" aria-label="loading">
                      <span className="sr-only">Loading...</span>

                    </div>
                  }

                </button>
              </div>
            </form>

            {/* End Form */}




          </div>
        </div>
      </div>
    </div>
  )
}
