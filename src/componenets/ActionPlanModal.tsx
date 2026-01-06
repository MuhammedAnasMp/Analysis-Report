import { BeakerIcon, BuildingStorefrontIcon, ChartBarIcon, ChartBarSquareIcon, ChatBubbleLeftIcon, CheckCircleIcon, CheckIcon, ExclamationCircleIcon, ExclamationTriangleIcon, PlusIcon, TicketIcon, TrashIcon, UserCircleIcon, XCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { result } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/app/rootReducer";
import useToast from "../hooks/Toast";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import NoDatafound from "./vectorIllustrations/NoDataFound";
import NotSelected from "./vectorIllustrations/NotSelected";
import SmallDatePicker from "./SmallDatePicker";
import { setSelectedDate } from "../redux/features/pptState/storeSlice";
interface Option {
  added_by: number,
  area_id: number;
  area_name: string;
}

interface FormData {
  id?: number;
  created_at?: any;
  user_id?: string | null;
  user_name?: string | null;
  sales_area_id?: number | null;
  suggestion?: string | null;
  loc_code?: number | null;
  yyyymm?: string | null;
}


const FullScreenModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [createdPlans, setCreatedPlans] = useState<FormData[]>([]);
  const { selectedStore, selectedDate, userDetails } = useSelector((state: RootState) => state.store);
  const [apiTrigger, setApiTrigger] = useState<boolean>(false);
  const [apiTriggerArea, setApiTriggerArea] = useState<boolean>(false);
  const [areName, setAreaName] = useState<string>('');
  const { showToast } = useToast()

  const [formattedDate, setFormattedDate] = useState<any>('')

  useEffect(() => {
    try {
      fetch(`${import.meta.env.VITE_API_BACKEND_URL}/sales_area`)
        .then(result => result.json())
        .then(data => {
          setOptions(data)
        })
    }
    catch (err: any) {

    }

  }, [selectedDate, apiTriggerArea])

  const [confirm, setConfirm] = useState<number | null>(null);
  useEffect(() => {
    const formatToYYYYMM = (date: any): string => {
      if (!date) return "";

      const validDate = new Date(date);   // <-- convert to real Date
      if (isNaN(validDate.getTime())) {
        console.error("Invalid date:", date);
        return "";
      }

      const year = validDate.getFullYear();
      const month = (validDate.getMonth() + 1).toString().padStart(2, "0");

      return `${year}${month}`;
    };
    const date = formatToYYYYMM(selectedDate)
    setFormattedDate(date)
  }, [selectedDate])

  useEffect(() => {
    if (!formattedDate) return
    try {
      fetch(`${import.meta.env.VITE_API_BACKEND_URL}/improvement_plans/${formattedDate}`)
        .then(result => result.json())
        .then((data: FormData[]) => {
          setCreatedPlans(data.reverse());
        })
        .catch(err => {
          console.error("Fetch error:", err);
        });
    } catch (err) {
      console.error("Error:", err);
    }


  }, [selectedDate, apiTrigger, formattedDate])







  const [formData, setFormData] = useState<FormData>({
    user_id: userDetails ? userDetails?.id : '',
    user_name: userDetails?.username,
    sales_area_id: null,
    suggestion: "",
    loc_code: selectedStore?.LOCATION_ID,
    yyyymm: formattedDate
  });

  const [createNewSaleArea, setNewSaleArea] = useState<boolean>(true)

  const [apiCalling, setApiCaling] = useState(false)

  const handleCreateSuggestion = () => {
    if (createNewSaleArea) {
      if (!formData.sales_area_id) {
        showToast({
          type: "markup2",
          message: "Please select a area to add action plan",
          status: "normal",
          avatar: <ExclamationCircleIcon className="size-6 text-blue-500" />,
          duration: 3000,
        })
        return
      }
    }
    else {
      if (areName === "") {
        showToast({
          type: "markup2",
          message: "Please enter area name to add action plan",
          status: "normal",
          avatar: <ExclamationCircleIcon className="size-6 text-blue-500" />,
          duration: 3000,
        });
        return;
      } else {
        const id = Number(areName);

        // If it converts to number → show error
        if (!isNaN(id)) {
          showToast({
            type: "markup2",
            message: "Area name cannot be a number. Please enter a valid name.",
            status: "normal",
            avatar: <ExclamationCircleIcon className="size-6 text-red-500" />,
            duration: 3000,
          });
          return;
        }

      }
    }

    if (!formData.suggestion) {
      showToast({
        type: "markup2",
        message: "Please add suggestions to create action plan",
        status: "normal",
        avatar: <ExclamationCircleIcon className="size-6 text-blue-500" />,
        duration: 3000,
      })
      return
    }

    setApiCaling(true)

    const postData = async () => {
      try {
        const response = await fetch("${import.meta.env.VITE_API_BACKEND_URL}/improvement_plans", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            user_id: formData.user_id,
            user_name: formData.user_name,
            sales_area_id: !createNewSaleArea ? areName : formData.sales_area_id,
            suggestion: formData.suggestion,
            loc_code: formData.loc_code,
            yyyymm: formattedDate
          })
        });

        const data = await response.json();

        if (response.ok) {
          showToast({
            type: "markup2",
            message: "Action plan added successfully",
            status: "success",
            avatar: <CheckCircleIcon className="size-6 text-blue-500" />,
            duration: 3000,
          })
          setApiTrigger((prev) => !prev)
          setFormData({
            user_id: userDetails ? userDetails?.id : null,
            user_name: userDetails?.username,
            sales_area_id: formData.sales_area_id,
            suggestion: "",
            loc_code: selectedStore?.LOCATION_ID,
            yyyymm: formattedDate
          })
          setNewSaleArea(true)
          setAreaName('')
        } else {
          console.error("Server error:", data);
          showToast({
            type: "markup2",
            message: "Failed to create action plan ",
            status: "failed",
            avatar: <XCircleIcon className="size-6 text-blue-500" />,
            duration: 3000,
          })
        }
      } catch (err) {
        console.error("Fetch error:", err);
        alert("Network error");
      }
      finally {
        setApiCaling(false)
      }
    }

    postData()
  }



  const handleCreateNewArea = () => {

    if (!areName) {
      showToast({
        type: "markup2",
        message: "Please enter a area name",
        status: "normal",
        avatar: <ExclamationCircleIcon className="size-6 text-blue-500" />,
        duration: 3000,
      })
      return
    }



    const postData = async () => {
      try {
        const response = await fetch("${import.meta.env.VITE_API_BACKEND_URL}/sales_area", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            area_name: areName,
            added_by: userDetails?.id,
          })
        });

        const data = await response.json();

        if (response.ok) {
          showToast({
            type: "markup2",
            message: "Area name added successfully",
            status: "success",
            avatar: <CheckCircleIcon className="size-6 text-blue-500" />,
            duration: 3000,
          })
          setFormData((prev) => (
            {
              ...prev,
              sales_area_id: data.id[0]
            }
          ))
          setAreaName("")
          setApiTriggerArea((pre) => !pre);
          setNewSaleArea((pre) => !pre);
        } else {
          console.error("Server error:", data);
          showToast({
            type: "markup2",
            message: `Failed to create area name ${data.message}`,
            status: "failed",
            avatar: <XCircleIcon className="size-6 text-blue-500" />,
            duration: 3000,
          })
        }
      } catch (err) {
        console.error("Fetch error:", err);
        alert("Network error");
      }
      finally {

      }
    }

    postData()
  }


  const handleDeletePlan = async (id: number) => {

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/improvement_plans/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();

      if (response.ok) {
        showToast({
          type: "markup2",
          message: "Action plan deleted successfully",
          status: "success",
          avatar: <CheckCircleIcon className="size-6 text-blue-500" />,
          duration: 3000,
        })
        setApiTrigger((prev) => !prev)

      } else {
        console.error("Server error:", data);
        showToast({
          type: "markup2",
          message: "Failed to delete action plan ",
          status: "failed",
          avatar: <XCircleIcon className="size-6 text-blue-500" />,
          duration: 3000,
        })
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Network error");
    }
    finally {
      setApiCaling(false)
    }

  }

  const normalizeToYYYYMM = (input: Date | string | null | undefined) => {
    if (!input) return null;
    const d = input instanceof Date ? input : new Date(input);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    return `${year}${month}`;
  };

  return (
    <div>
      {/* Button to open modal */}
      <button
        onClick={() => {
          setIsOpen(true);
          setApiTrigger((pre) => !pre)
        }}
        className="px-4 py-2 bg-blue-600 !text-white  !rounded hover:bg-blue-700 transition"
      >
        Action Plan
      </button>


      {/* Modal overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50  bg-opacity-40 backdrop-blur-sm flex items-center justify-center overflow-auto"
          role="dialog"
          aria-labelledby="modal-title"
        >
          {/* Modal container */}

          <div className="bg-white dark:bg-neutral-800 w-full max-w-7xl  min-h-200  flex flex-col pointer-events-auto shadow-lg rounded-lg">

            {/* Header */}
            <div className="relative flex justify-center items-center py-2 px-4 border-gray-200 dark:border-neutral-700">

              <h3
                id="modal-title"
                className="text-lg font-bold text-gray-800 dark:text-white "
              >Action Plan For improvements </h3>
              <div className="absolute right-12">
                <SmallDatePicker  value={selectedDate} onDateChange={() => { }} key={3} />
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute right-2 h-8 w-8 flex justify-center items-center !rounded-full  hover:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600"
                aria-label="Close"
              >
                <XMarkIcon height={20} width={20} />
              </button>
            </div>



            {
              <div className='relative  bg-red w-full'>
                <div
                  className="
                        absolute inset-0 z-100 mt-2 w-full  bg-white dark:bg-neutral-800
                        border border-gray-200 dark:border-neutral-700 rounded-lg shadow-lg
                        [&::-webkit-scrollbar]:w-2
                        [&::-webkit-scrollbar-track]:rounded-full
                        [&::-webkit-scrollbar-track]:bg-gray-100
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        [&::-webkit-scrollbar-thumb]:bg-gray-300
                        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 " >
                  <>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 p-3 mt-3">
                      <div className="rounded">
                        <div className="text-md text-bo border-b border-gray-200 mb-3 pb-2 font-semibold ">
                          New Action Plans
                        </div>
                        <div className="flex gap-2 items-center justify-between">

                          {
                            createNewSaleArea ?
                              <>
                                <div className=" flex gap-2">

                                  <select

                                    name="sales_area"
                                    onChange={(e) => {
                                      setFormData((prev: any) => ({
                                        ...prev,
                                        sales_area_id: Number(e.target.value)   // update sales area
                                      }));
                                    }}
                                    value={formData.sales_area_id || ""}
                                    className="py-1.5 sm:py-2 px-3 block w-64 border focus:outline-none border-gray-200 shadow-2xs sm:text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 undefined"
                                  >
                                    <option value=""> -- Select Area -- </option>

                                    {options?.map((sales_area: Option) => (
                                      <option
                                        value={sales_area.area_id}
                                        key={sales_area.area_id}

                                      >
                                        {sales_area.area_name}
                                      </option>
                                    ))}

                                  </select>
                                  <div className="" >
                                    <div onClick={() => setNewSaleArea((pre) => !pre)} className="borded  border-2 p-2 rounded-md  inline-flex shrink-0 justify-center items-center text-sm font-medium  text-white bg-blue-600 hover:bg-blue-500 focus:outline-hidden focus:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none">Other Area</div>

                                  </div >
                                </div>

                                {
                                  (userDetails?.id === "ANAS" || userDetails?.id === "SADAKU") &&
                                  <div className="bg-yellow">
                                    <div
                                      onClick={() => setNewSaleArea((pre) => !pre)}
                                      className="borded mx-3 border-2 p-2 rounded-md inline-flex shrink-0 justify-center items-center text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-hidden focus:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                                    >
                                      <PlusIcon height={20} width={20} />Add Area
                                    </div>
                                  </div>
                                }


                              </>

                              :



                              <div className="flex gap-2 justify-between w-full">

                                <div>
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      name='first_name'
                                      value={areName}
                                      onChange={(event) => {
                                        setAreaName(event.target.value)
                                      }}
                                      placeholder={`Enter any area name  `}
                                      autoFocus
                                      className="flex-grow text-sm bg-transparent outline-none  w
                                    border  hover:bg-white dark:hover:bg-transparent  border-gray-200
                                    hover:border-gray-200 dark:hover:border-neutral-700 
                                    focus:border-blue-300 dark:focus:border-neutral-600 
                                    dark:border-neutral-700 
                                    rounded-lg p-2 text-gray-700 dark:text-white 
                                    placeholder:text-gray-400  transition-colors duration-200 w-64"

                                    />
                                    <div onClick={() => {
                                      setNewSaleArea((pre) => !pre)
                                      setAreaName("")
                                      setFormData((prev: FormData) => ({
                                        ...prev, sales_area_id: null

                                      }))
                                    }} className="flex  justify-center items-center m-0.5 px-2 hover:bg-red-400 hover:text-white text-red-400 border rounded-lg border-transparentborder-red-600 transition-colors duration-200 ">
                                      <XMarkIcon height={20} width={20} />
                                    </div>
                                  </div>
                                </div>


                                {
                                  (userDetails?.id === "ANAS" || userDetails?.id === "SADAKU") &&

                                  <div className='flex gap-1 bg-yellow px-2 '>
                                    <div onClick={() => {
                                      setNewSaleArea((pre) => !pre)
                                      setAreaName("")
                                      setFormData((prev: FormData) => ({
                                        ...prev, sales_area_id: null

                                      }))
                                    }} className="flex  justify-center items-center px-2 hover:bg-red-400 hover:text-white text-red-400 border rounded-lg border-transparentborder-red-600 transition-colors duration-200 ">
                                      <XMarkIcon height={20} width={20} />
                                    </div>
                                    <div onClick={() => {

                                      handleCreateNewArea()
                                    }} className=" flex justify-center items-center px-2 hover:bg-green-400 hover:text-white text-green-400 border rounded-lg border-transparentborder-green-600 transition-colors duration-200 ">
                                      <CheckIcon height={20} width={20} />
                                    </div>
                                  </div>
                                }

                              </div>
                          }


                        </div>

                        <div className="flex pt-3 ">

                          <div className="relative w-full">
                            <textarea
                              placeholder="Write suggestion..."
                              value={formData?.suggestion || ''}
                              onChange={(e) =>
                                setFormData((prev: any) => ({
                                  ...prev,
                                  suggestion: e.target.value
                                }))
                              }
                              className="h-32  sm:py-3 ps-4 pe-24 block w-full border bg-white focus:outline-none border-gray-200  rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 resize-none overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500" rows={1} data-hs-textarea-auto-height='{
                            "defaultHeight": 48
                          }'></textarea>


                            <div className="absolute bottom-2 end-2 z-10">
                              <button disabled={apiCalling} onClick={handleCreateSuggestion} type="button" className="py-1.5 px-3 inline-flex shrink-0 justify-center items-center text-sm font-medium !rounded-md !text-white bg-blue-600 hover:bg-blue-500 focus:outline-hidden focus:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none">
                                Create New
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>


                    </div>
                    <div className=" rounded p-3 ">
                      <div className="text-md border-b border-gray-200 mb-3 pb-2 font-semibold ">
                        Action Plan for Selected Month
                      </div>
                      <div className="  space-y-3 gap-2 items-center max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:w-1 p-1 pr-2  [&::-webkit-scrollbar-track]:bg-gray-100  [&::-webkit-scrollbar-thumb]:bg-gray-300  dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">

                        {
                          createdPlans.length === 0 ?

                            <div className="flex justify-center gap-2 items-center h-full w-full text-gray-400 text-md">
                              <ExclamationTriangleIcon height={15} width={15} className="text-red-300" />No action plans in selected month.
                            </div>
                            : <>
                              <AnimatePresence>
                                {
                                  createdPlans.map((createdPlan, index) => (
                                    <motion.div
                                      key={createdPlan.id || index}
                                      initial={{ opacity: 0, y: 20 }}        // animation when item appears
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -20 }}          // animation when item removed
                                      transition={{ duration: 0.35 }}
                                      className="relative mb-4"
                                    >
                                      {/* Textarea */}
                                      <div key={index} className="relative">
                                        <div id="hs-textarea-ex-1"
                                          style={{ whiteSpace: "pre-line" }}
                                          className="border h-auto p-3 sm:p-4 pb-12 sm:pb-12 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" data-hs-textarea-auto-height="">{createdPlan.suggestion}</div>

                                        {/* Toolbar */}
                                        <div className="absolute bottom-px inset-x-px p-2 rounded-b-md bg-white dark:bg-neutral-900">
                                          <div className="flex flex-wrap justify-between items-center gap-2">
                                            {/* Button Group */}
                                            <div className="flex items-center">
                                              {/* Mic Button */}
                                              <button type="button" className="inline-flex shrink-0 justify-center items-center size-8 rounded-lg text-gray-500 hover:bg-gray-100 focus:z-10 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                                                <ChatBubbleLeftIcon height={15} width={15} />
                                              </button>
                                              <span className="text-sm text-gray-600">
                                                {
                                                  (() => {
                                                    const id = Number(createdPlan.sales_area_id);

                                                    // If conversion to number works
                                                    if (!isNaN(id)) {
                                                      return options?.find(option => option.area_id === id)?.area_name || 'N/A';
                                                    }

                                                    // Otherwise treat it as a string
                                                    return createdPlan.sales_area_id || 'N/A';
                                                  })()
                                                }

                                              </span>
                                              {/* End Mic Button */}

                                              {/* Attach Button */}
                                              <button type="button" className="inline-flex shrink-0 justify-center items-center size-8 rounded-lg text-gray-500 hover:bg-gray-100 focus:z-10 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                                                <UserCircleIcon height={15} width={15} />
                                              </button>
                                              <span className="text-sm text-gray-600">
                                                {createdPlan.user_name || 'N/A'}
                                              </span>
                                              {/* End Attach Button */}
                                            </div>
                                            {/* End Button Group */}

                                            {/* Button Group */}
                                            <div className="flex items-center gap-x-1">
                                              {/* Mic Button */}
                                              {/* <button type="button" className="inline-flex shrink-0 justify-center items-center size-8 rounded-lg text-gray-500 hover:bg-gray-100 focus:z-10 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                                                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                                                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                                  <line x1="12" x2="12" y1="19" y2="22"></line>
                                                  sdfdf
                                                </svg>
                                              </button> */}
                                              {/* End Mic Button */}

                                              {/* Send Button */}
                                              {
                                                <>
                                                  {createdPlan.user_id === userDetails?.id && (
                                                    <>
                                                      {confirm === createdPlan.id ? (
                                                        /* --- Confirmation Buttons --- */
                                                        <div className="flex gap-2 justify-center items-center text-gray-500">

                                                          <p>Confirm Delete </p>
                                                          <button
                                                            onClick={() =>
                                                              createdPlan.id && handleDeletePlan(createdPlan.id)
                                                            }
                                                            type="button"
                                                            className="inline-flex shrink-0 justify-center items-center size-8  !text-green  bg-white !rounded  border-e-green-400  hover:bg-green-100 border-green-600  hover hover:text-white focus:z-10 focus:outline-hidden"
                                                          >
                                                            <CheckIcon className="h-5 w-5" />
                                                          </button>

                                                          {/* Cancel (✕) */}
                                                          <button
                                                            onClick={() => setConfirm(null)}
                                                            type="button"
                                                            className="inline-flex shrink-0 justify-center items-center size-8  !text-red  bg-white !rounded  border-e-amber-700  hover:bg-red-100 border-red-600  hover hover:text-white focus:z-10 focus:outline-hidden"
                                                          >
                                                            <XMarkIcon className="h-5 w-5" />
                                                          </button>
                                                        </div>
                                                      ) : (
                                                        /* --- Delete Button (Trash Icon) --- */
                                                        <button
                                                          onClick={() => setConfirm(createdPlan.id || null)}
                                                          type="button"
                                                          className="inline-flex shrink-0 justify-center items-center size-8  !text-red  bg-white !rounded  border-e-amber-700  hover:bg-red-100 border-red-600  hover hover:text-white focus:z-10 focus:outline-hidden"
                                                        >
                                                          <TrashIcon height={16} width={16} />
                                                        </button>
                                                      )}
                                                    </>
                                                  )}
                                                </>
                                              }
                                              <div>
                                                <div className="text-gray-600">
                                                  {format(
                                                    new Date(new Date(createdPlan.created_at).getTime() - 60 * 60 * 1000), // subtract 1 hour
                                                    "dd MMM yyyy, hh:mm a"
                                                  )}
                                                </div>

                                              </div>

                                              {/* End Send Button */}
                                            </div>
                                            {/* End Button Group */}
                                          </div>
                                        </div>
                                        {/* End Toolbar */}
                                      </div>
                                      {/* End Textarea */}
                                    </motion.div>
                                  ))
                                }
                              </AnimatePresence>
                            </>

                        }
                      </div>
                    </div>

                  </>
                </div>
              </div>
            }

          </div>

        </div>
      )
      }
    </div >
  );
};

export default FullScreenModal;
