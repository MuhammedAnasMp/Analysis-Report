import { CalendarIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";

export default function SmallDatePicker({ onDateSelect ,error}:{onDateSelect:any;error?:boolean}) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const daysContainerRef = useRef(null);
    const datepickerContainerRef = useRef(null);

    useEffect(() => {
        if (daysContainerRef.current) {
            
            renderCalendar();

        }
    }, [currentDate, isCalendarOpen]);

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const daysContainer = daysContainerRef.current as HTMLDivElement | null;
        if (!daysContainer) return;
        
        daysContainer.innerHTML = "";

        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyDiv = document.createElement("div");
            daysContainer.appendChild(emptyDiv);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dayDiv = document.createElement("div");
            dayDiv.className =
                "flex items-center  justify-center cursor-pointer w-[46px] h-[46px] text-dark-3 dark:text-dark-6 rounded-full hover:bg-primary hover:text-white";
            dayDiv.textContent = i.toString();
            dayDiv.addEventListener("click", () => {
                 setIsCalendarOpen(false);
                const selectedDateValue = `${i}/${month + 1}/${year}`;
                setSelectedDate(selectedDateValue as any);
                onDateSelect(selectedDateValue as any);

                if (daysContainer) {
                    daysContainer
                        .querySelectorAll("div")
                        .forEach((d) =>
                            d.classList.remove("bg-primary", "text-white"),
                        );
                    dayDiv.classList.add("bg-primary", "text-white", "dark:text-white");
                }
                handleApply()
            });
            daysContainer.appendChild(dayDiv);
        }


    };

    const handlePrevMonth = () => {
        setCurrentDate(
            (prevDate) => new Date(prevDate.setMonth(prevDate.getMonth() - 1)),
        );
    };

    const handleNextMonth = () => {
        setCurrentDate(
            (prevDate) => new Date(prevDate.setMonth(prevDate.getMonth() + 1)),
        );
    };

    const handleApply = () => {
        if (selectedDate) {
            setIsCalendarOpen(false);
        }
    };

    const handleCancel = () => {
        setSelectedDate(null);
        setIsCalendarOpen(false);
    };

    const handleToggleCalendar = () => {
        setIsCalendarOpen(!isCalendarOpen);
    };

    return (



        <div className="relative  w-full">
            <div className="relative flex items-center text-xs ">
                <span className="absolute left-0 pl-2 text-dark-5 border-amber-100">
                   
                    <CalendarIcon height={20} width={20}/>
                </span>

                <input
                    id="datepicker"
                    type="text"
                    placeholder="Pick a date"
                    className={` rounded-lg  border-gray-200  py-1 pl-8  text-gray-500 dark:text-neutral-400   outline-none transition focus:border-primary dark:border-dark-3  dark:focus:border-primary ${error && 'border border-red-700 dark:border-red-700'}`}
                    value={selectedDate || ""}
                    readOnly
                    onClick={handleToggleCalendar}
                    required
                />

                <span
                    id="toggleDatepicker"
                    className="absolute right-0 cursor-pointer pr-4 text-dark-5"
                    onClick={handleToggleCalendar}
                >
                   
                </span>
            </div>

            {isCalendarOpen && (
                <div
                    ref={datepickerContainerRef}
                    id="datepicker-container"
                    className="z-50 shadow-datepicker absolute w-[200] mb-2 rounded-xl border border-stroke bg-white pt-5 dark:border-dark-3 dark:bg-neutral-800"
                >
                    <div className="flex items-center justify-between px-5">
                        <button
                            id="prevMonth"
                            className="rounded-md px-2 py-2 text-dark hover:bg-gray-2 dark:text-white dark:hover:bg-dark"
                            onClick={handlePrevMonth}
                        >
                            <svg
                                className="fill-current"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M13.5312 17.9062C13.3437 17.9062 13.1562 17.8438 13.0312 17.6875L5.96875 10.5C5.6875 10.2187 5.6875 9.78125 5.96875 9.5L13.0312 2.3125C13.3125 2.03125 13.75 2.03125 14.0312 2.3125C14.3125 2.59375 14.3125 3.03125 14.0312 3.3125L7.46875 10L14.0625 16.6875C14.3438 16.9688 14.3438 17.4062 14.0625 17.6875C13.875 17.8125 13.7187 17.9062 13.5312 17.9062Z"
                                    fill=""
                                />
                            </svg>
                        </button>

                        <div
                            id="currentMonth"
                            className="text-lg font-medium text-dark-3 dark:text-white"
                        >
                            {currentDate.toLocaleDateString("en-US", {
                                month: "long",
                                year: "numeric",
                            })}
                        </div>

                        <button
                            id="nextMonth"
                            className="rounded-md px-2 py-2 text-dark hover:bg-gray-2 dark:text-white dark:hover:bg-dark"
                            onClick={handleNextMonth}
                        >
                            <svg
                                className="fill-current"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M6.46875 17.9063C6.28125 17.9063 6.125 17.8438 5.96875 17.7188C5.6875 17.4375 5.6875 17 5.96875 16.7188L12.5312 10L5.96875 3.3125C5.6875 3.03125 5.6875 2.59375 5.96875 2.3125C6.25 2.03125 6.6875 2.03125 6.96875 2.3125L14.0313 9.5C14.3125 9.78125 14.3125 10.2187 14.0313 10.5L6.96875 17.6875C6.84375 17.8125 6.65625 17.9063 6.46875 17.9063Z"
                                    fill=""
                                />
                            </svg>
                        </button>
                    </div>

                    <div
                        id="days-of-week"
                        className="mb-4 mt-6 grid grid-cols-7 gap-2 px-5"
                    >
                        <div className="text-center text-sm font-medium text-secondary-color">
                            Sun
                        </div>
                        <div className="text-center text-sm font-medium text-secondary-color">
                            Mon
                        </div>
                        <div className="text-center text-sm font-medium text-secondary-color">
                            Tue
                        </div>
                        <div className="text-center text-sm font-medium text-secondary-color">
                            Wed
                        </div>
                        <div className="text-center text-sm font-medium text-secondary-color">
                            Thu
                        </div>
                        <div className="text-center text-sm font-medium text-secondary-color">
                            Fri
                        </div>
                        <div className="text-center text-sm font-medium text-secondary-color">
                            Sat
                        </div>
                    </div>

                    <div
                        ref={daysContainerRef}
                        id="days-container"
                        className="mt-2 grid grid-cols-7 gap-2 px-5"
                    >
                        {/* Days will be rendered here */}
                    </div>

                    <div className="mt-5 flex justify-end space-x-2.5 border-t border-stroke p-5 dark:border-dark-3">
                        <button
                            id="cancelBtn"
                            className="rounded-lg border border-primary px-5 py-2.5 text-base font-medium text-primary hover:bg-blue-light-5"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button
                            id="applyBtn"
                            className="rounded-lg bg-primary px-5 py-2.5 text-base font-medium text-white hover:bg-[#1B44C8]"
                            onClick={handleApply}
                        >
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </div>


    );
}

