import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppState } from '../redux/app/store';
import { useApiMutation } from '../api/useApiMutation';
import useToast from '../hooks/Toast';
import { BeakerIcon, ExclamationCircleIcon, PhotoIcon, TrashIcon, UserPlusIcon } from '@heroicons/react/24/solid';
import { updateUser } from '../redux/features/auth/authSlice';
import { useApiQuery } from '../api/useApiQuery';
import TeamForm from '../components/TeamForm';
import { capitalize } from 'lodash';


type Department = {
  id: number;
  name: string;
}


function ProfileView() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const auth = useSelector((state: AppState) => state.auth)
  const { mutate } = useApiMutation('PATCH', `/api/users/user/${auth.user?.id}/`, ['meetings']);
  const { data: departments } = useApiQuery(['department'], '/api/users/department/', undefined, true);
  // const { data: teamMembers } = useApiQuery(['teamMembers'], '/api/users/department/', undefined, true);

  const [isEditing, setIsEditing] = useState<boolean>(false)

  const [formData, setFormData] = useState({
    first_name: auth.user?.first_name || '',
    last_name: auth.user?.last_name || '',
    role: auth.user?.role || '',
    department: auth.user?.department || '',
  });
  console.log(formData)

  const { showToast } = useToast()
  const dispatch = useDispatch()
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      handleUpload();
    } else {
      setIsEditing(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };
  const formatId = (s: string) =>s.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const handleUpload = async () => {
    const newErrors: Record<string, string> = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === 'string') {
        if (value.trim() === '') {
          newErrors[key] = `${formatId(key)} is required.`;
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



    const imageData = new FormData();

    if (selectedImage) {
      imageData.append('profile_image', selectedImage);
    }



    imageData.append('first_name', formData.first_name);
    imageData.append('last_name', formData.last_name);
    imageData.append('role', formData.role);
    imageData.append('department', formData.department);
    mutate(imageData,
      {
        onSuccess: (response) => {

          dispatch(updateUser(response));
          showToast({
            type: "markup1",
            title: "Profile Updated",
            message: `Your profile has been updated successfully`,
            avatar: `${imagePreview ? imagePreview : auth.user?.profile_image}`,
            // actionText: "Go to meetings",
            actionLink: "/",
            duration: 4000,
          })

          handleClear()
          setIsEditing(false)
        },
        onError: (err: any) => {
          alert(err)
        }
      }
    );


  };


  const getDepartmentName = (id: number | string): string => {
    if (!departments) return "Loading..."; // or return empty string
    const numericId = Number(id);
    const department = departments.find((dep: { id: number; name: string }) => dep.id === numericId);
    return department ? department.name : "";
  };



  return (
    <>

      <div className="p-4 flex items-center justify-between flex-wrap gap-5 backdrop-blur-3xl rounded-t-2xl  bg-[url(https://img.lovepik.com/background/20211021/large/lovepik-blue-banner-background-image_500452484.jpg)]">
        <div className="relative group w-18 h-18 rounded-full overflow-hidden border-2  border-gray-300 dark:border-neutral-700 cursor-pointer">
          <label className="block w-full h-full">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={!isEditing}
            />


            {/* Image or Default */}
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="object-cover w-full h-full" />
            ) : auth?.user?.profile_image ? (
              <img src={auth.user.profile_image} alt="Profile" className="object-cover w-full h-full" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-neutral-600">
                <svg
                  className="size-7"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="10" r="3" />
                  <path d="M7 20.662V19a2 2 0 012-2h6a2 2 0 012 2v1.662" />
                </svg>
              </div>
            )}

            {/* Overlay Camera Icon if Editing */}
            {isEditing && !selectedImage && (
              <div className="absolute inset-0 bg-black opacity-80 text-white  flex items-center justify-center transition-opacity">
                <PhotoIcon height={15} width={15} />
              </div>
            )}
          </label>

        </div>
        <div className="grow">
          <h1 className="text-lg font-medium text-gray-800 dark:text-neutral-200">
            {auth.user?.user_name}
          </h1>
          <p className="text-sm text-gray-600 dark:text-neutral-400">
            {auth.user?.role}
          </p>
        </div>

        {/* Update Button */}
        <div className="flex items-center gap-x-2">
          {isEditing && (
            <button onClick={() => { console.log(isEditing); setIsEditing(false) }} className="py-2 px-3 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handleToggleEdit}
            className="py-2 px-3 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
          >
            {isEditing ? 'Save Changes' : 'Update Profile'}
          </button>

        </div>
      </div>
      <div className="relative z-1 bg-white dark:bg-neutral-800 flex flex-col gap-4">

        <div className="px-4">
          <div className=" grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-2">
            {['first_name', 'last_name', 'role', 'department'].map((field) => (
              <div className="flex flex-col gap-y-1" key={field}>
                <span className="text-[13px] text-gray-500 dark:text-neutral-500">
                  {field.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
                {isEditing ? (

                  <>
                    {
                      field === "department" ? <>

                        <select name='department' onChange={handleInputChange} className="py-1.5 sm:py-2 px-3 pe-11 block w-full border focus:outline-none border-gray-200 shadow-2xs sm:text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 undefined">
                          <option value={''}>Select Department</option>
                          {
                            departments?.map((department: any) => (

                              <option selected={department.id === auth.user?.department} value={department.id} key={department.id}>{department.name}</option>
                            ))
                          }
                        </select>


                      </> :
                        <input
                          type="text"
                          name={field}
                          id={`input-${field}`}
                          autoFocus={field === "first_name"}

                          value={formData[field as keyof typeof formData]}
                          onChange={handleInputChange}
                          className="capitalize py-1.5 sm:py-2 px-3 pe-11 block w-full border focus:outline-none border-gray-200 shadow-2xs sm:text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 undefined"
                        // placeholder={field.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                        />

                    }
                  </>

                ) : (

                  <div className='flex h-9.5'>
                    <span className="capitalize py-1.5 sm:py-2 px-3 pe-11 block w-full border focus:outline-none border-gray-200 shadow-2xs sm:text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 undefined">
                      {field === "department" ? getDepartmentName(formData[field as keyof typeof formData]) : formData[field as keyof typeof formData]}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Heading */}
      <div className="p-4 pb-0 ">
        <div className="my-3 pb-1 flex flex-wrap justify-between items-center gap-2 border-b  border-gray-200 dark:border-neutral-700">
          <h2 className="block text-md font-bold text-gray-800 dark:text-white">
            Other Details
          </h2>
        </div>
      </div>
      {/* End Heading */}

      {/* Body */}
      <div className="px-4">

        <div className=" grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-2">
          {/* Item */}
          <div className="flex flex-col gap-y-1">
            <span className="text-[13px] text-gray-500 dark:text-neutral-500">
              Published posts:
            </span>

            <div className="flex items-center gap-x-1.5">
              <svg className="shrink-0 size-4 text-gray-800 dark:text-neutral-200" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4" /><path d="M2 6h4" /><path d="M2 10h4" /><path d="M2 14h4" /><path d="M2 18h4" /><path d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" /></svg>

              <span className="font-medium text-sm text-gray-800 dark:text-neutral-200">
                48
              </span>
            </div>
          </div>
          {/* End Item */}

          {/* Item */}
          <div className="flex flex-col gap-y-1">
            <span className="text-[13px] text-gray-500 dark:text-neutral-500">
              Avg. post views:
            </span>

            <div className="flex items-center gap-x-1.5">
              <svg className="shrink-0 size-4 text-gray-800 dark:text-neutral-200" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>

              <span className="font-medium text-sm text-gray-800 dark:text-neutral-200">
                285
              </span>
            </div>
          </div>
          {/* End Item */}

          {/* Item */}
          <div className="flex flex-col gap-y-1">
            <span className="text-[13px] text-gray-500 dark:text-neutral-500">
              Total comments:
            </span>

            <div className="flex items-center gap-x-1.5">
              <svg className="shrink-0 size-4 text-gray-800 dark:text-neutral-200" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>

              <span className="font-medium text-sm text-gray-800 dark:text-neutral-200">
                18
              </span>
            </div>
          </div>
          {/* End Item */}

          {/* Item */}
          <div className="flex flex-col gap-y-1">
            <span className="text-[13px] text-gray-500 dark:text-neutral-500">
              Posts referred:
            </span>

            <div className="flex items-center gap-x-1.5">
              <svg className="shrink-0 size-4 text-gray-800 dark:text-neutral-200" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" /><path d="m21 3-9 9" /><path d="M15 3h6v6" /></svg>

              <span className="font-medium text-sm text-gray-800 dark:text-neutral-200">
                62
              </span>
            </div>
          </div>
          {/* End Item */}
        </div>
        {/* End Grid List */}




        {/* End Card */}
      </div>
      <div className="p-4 pb-0 ">
         <div className="my-3 pb-1 flex flex-wrap justify-between items-center gap-2 border-b  border-gray-200 dark:border-neutral-700">
          <h2 className="block text-md font-bold text-gray-800 dark:text-white">
            Team Details
          </h2>
        </div>




        <TeamForm ownerdepartment={auth.user?.department && getDepartmentName(auth.user?.department)} />

      </div>
      {/* End Body */}

      {/* End Card Group */}
    </>
  )
}

export default ProfileView