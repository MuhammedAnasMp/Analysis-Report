import { useEffect, useState } from "react";


export default function TimePicker({ onTimeSelect ,error}:{onTimeSelect:any;error:boolean}) {



    const [selectedHour, setSelectedHour] = useState<string | null>("00");
    const [selectedMinute, setSelectedMinute] = useState<string | null>("00");
    const [selectedPeriod, setSelectedPeriod] = useState<string | null>('PM'); // 'AM' or 'PM'


    const HandleSetCurrentTime = () => {
        const now = new Date();

        let hours = now.getHours(); // 0-23
        const minutes = now.getMinutes(); // 0-59

        const period = hours >= 12 ? "PM" : "AM";

        // Convert to 12-hour format
        hours = hours % 12;
        if (hours === 0) hours = 12; // midnight or noon -> 12

        // Pad hours and minutes as 2-digit strings
        const formattedHour = String(hours).padStart(2, "0");
        const formattedMinute = String(minutes).padStart(2, "0");

        setSelectedHour(formattedHour);
        setSelectedMinute(formattedMinute);
        setSelectedPeriod(period);
        onTimeSelect({
            minute: formattedMinute,
                hour: formattedHour,
                period: period,
            });


    };
    const handleHourChange = (hourse: any) => {
        setSelectedHour(hourse)
        console.log("hourse",hourse)
        onTimeSelect(({
                hour: hourse,
                minute: selectedMinute,
                period: selectedPeriod,
            }));
    };
    const handleMinuteChange = (minutes: any) => {
        setSelectedMinute(minutes)
        onTimeSelect({
                minute: minutes,
                hour: selectedHour,
                period: selectedPeriod,
                
            });
    };

    const handlePeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPeriod(e.target.value);
        console.log("period",e.target.value)
        onTimeSelect({
                period: e.target.value,
                hour: selectedHour,
                minute: selectedMinute,
                
            });
    };


    const hourse = Array.from({ length: 12 }, (_, i) => i + 1);
    const minutes = Array.from({ length: 60 }, (_, i) => i);
    return (
        <div>


            <div>

                {/* Time Picker */}
                <div className="w-full">
                    <div className="relative w-full">
                        <input value={`${selectedHour}:${selectedMinute} ${selectedPeriod}`} type="text" readOnly className={`py-2.5  sm:py-3 ps-4 pe-12 block w-full border focus:outline-none border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 dark:placeholder-neutral-400 dark:focus:ring-neutral-600 ${error && 'border border-red-700 dark:border-red-700'}`} placeholder="hh:mm aa" />


                        <div className="absolute inset-y-0 end-0 flex items-center pe-3">
                            {/* Dropdown */}
                            <div className="hs-dropdown [--auto-close:inside] relative inline-flex">
                                <button id="hs-custom-style-time-picker" type="button" className="hs-dropdown-toggle size-7 shrink-0 inline-flex justify-center items-center rounded-full bg-white text-gray-500 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
                                    <span className="sr-only">Dropdown</span>
                                    <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                </button>

                                <div className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-30 bg-white border border-gray-200 shadow-xl rounded-lg mt-2 dark:bg-neutral-800 dark:border-neutral-700 dark:divide-neutral-700 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full" role="menu" aria-orientation="vertical" aria-labelledby="hs-custom-style-time-picker">
                                    <div className="flex flex-row divide-x divide-gray-200 dark:divide-neutral-700">
                                        {/* Hours */}
                                        <div className="p-1 max-h-56 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-800 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                                            {/* Checkbox */}
                                            {hourse.map((hour: number) => {
                                                const hourStr = String(hour).padStart(2, '0');

                                                return (
                                                    <label
                                                        key={hourStr}
                                                        htmlFor={`hs-cbchlhh${hourStr}`}
                                                        className="group relative flex justify-center items-center p-1.5 w-10 text-center text-sm text-gray-800 cursor-pointer rounded-md hover:bg-gray-100 hover:text-gray-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:hover:text-neutral-200
                                                            has-checked:text-white dark:has-checked:text-white
                                                            has-checked:bg-blue-600 dark:has-checked:bg-blue-500
                                                            has-disabled:pointer-events-none
                                                            has-disabled:text-gray-200 dark:has-disabled:text-neutral-700
                                                            has-disabled:after:absolute
                                                            has-disabled:after:inset-0
                                                            has-disabled:after:bg-[linear-gradient(to_right_bottom,transparent_calc(50%-1px),var(--color-gray-200)_calc(50%-1px),var(--color-gray-200)_50%,transparent_50%)]
                                                            dark:has-disabled:after:bg-[linear-gradient(to_right_bottom,transparent_calc(50%-1px),var(--color-neutral-700)_calc(50%-1px),var(--color-neutral-700)_50%,transparent_50%)]"
                                                    >
                                                        <input
                                                            type="radio"
                                                            onChange={() => handleHourChange(hourStr)}
                                                            value={hourStr}
                                                            id={`hs-cbchlhh${hourStr}`}
                                                            checked={selectedHour === hourStr}
                                                            name="hs-cbchlhh"
                                                            className="hidden bg-transparent border-gray-200 text-blue-600 focus:ring-white focus:ring-offset-0 dark:text-blue-500 dark:border-neutral-700 dark:focus:ring-neutral-900"
                                                        />
                                                        <span className="block">{hourStr}</span>
                                                    </label>
                                                );
                                            })}

                                            {/* End Checkbox */}
                                        </div>
                                        {/* End Hours */}




                                        {/* Minutes */}
                                        <div className="p-1 max-h-56 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-800 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                                            {/* Checkbox */}
                                            {minutes.map((minute) => {
                                                const minuteStr = String(minute).padStart(2, '0');
                                                return (
                                                    <label
                                                        key={minute}
                                                        htmlFor={`hs-cbchlmm${minuteStr}`}
                                                        className="group relative flex justify-center items-center p-1.5 w-10 text-center text-sm text-gray-800 cursor-pointer rounded-md hover:bg-gray-100 hover:text-gray-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:hover:text-neutral-200
                                                        has-checked:text-white dark:has-checked:text-white
                                                        has-checked:bg-blue-600 dark:has-checked:bg-blue-500
                                                        has-disabled:pointer-events-none
                                                        has-disabled:text-gray-200 dark:has-disabled:text-neutral-700"
                                                    >
                                                        <input
                                                            type="radio"
                                                            onChange={() => handleMinuteChange(minuteStr)}
                                                            value={minuteStr}
                                                            id={`hs-cbchlmm${minuteStr}`}
                                                            checked={selectedMinute === minuteStr}
                                                            name="hs-cbchlmm"
                                                            className="hidden"
                                                        />
                                                        <span className="block">{minuteStr}</span>
                                                    </label>
                                                );
                                            })}




                                            {/* End Checkbox */}
                                        </div>
                                        {/* End Minutes */}

                                        {/* 12-Hour Clock System */}
                                        <div className="p-1 max-h-56 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-800 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                                            {/* AM */}
                                            <label htmlFor="hs-cbchlcsam" className="group relative flex justify-center items-center p-1.5 w-10 text-center text-sm text-gray-800 cursor-pointer rounded-md hover:bg-gray-100 hover:text-gray-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:hover:text-neutral-200
                                                has-checked:text-white dark:has-checked:text-white
                                                has-checked:bg-blue-600 dark:has-checked:bg-blue-500">
                                                <input
                                                    type="radio"
                                                    onChange={handlePeriodChange}
                                                    value="AM"
                                                    id="hs-cbchlcsam"
                                                    checked={selectedPeriod === "AM"}
                                                    className="hidden"
                                                    name="hs-cbchlcs"
                                                />
                                                <span className="block">AM</span>
                                            </label>

                                            {/* PM */}
                                            <label htmlFor="hs-cbchlcspm" className="group relative flex justify-center items-center p-1.5 w-10 text-center text-sm text-gray-800 cursor-pointer rounded-md hover:bg-gray-100 hover:text-gray-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:hover:text-neutral-200
                                                has-checked:text-white dark:has-checked:text-white
                                                has-checked:bg-blue-600 dark:has-checked:bg-blue-500">
                                                <input
                                                    type="radio"
                                                    onChange={handlePeriodChange}
                                                    value="PM"
                                                    id="hs-cbchlcspm"
                                                    checked={selectedPeriod === "PM"}
                                                    className="hidden"
                                                    name="hs-cbchlcs"
                                                />
                                                <span className="block">PM</span>
                                            </label>
                                        </div>

                                        {/* End 12-Hour Clock System */}
                                    </div>

                                    {/* Footer */}
                                    <div className="py-2 px-3 flex flex-wrap justify-center items-center gap-2 border-t border-gray-200 dark:border-neutral-700">
                                        <button type="button" onClick={HandleSetCurrentTime} className="text-[13px] font-medium rounded-md bg-white text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:text-blue-700 dark:bg-neutral-800 dark:text-blue-500 dark:hover:text-blue-600 dark:focus:text-blue-600">
                                            Now
                                        </button>

                                    </div>
                                    {/* End Footer */}
                                </div>
                            </div>
                            {/* End Dropdown */}
                        </div>
                    </div>
                </div>
                {/* End Time Picker */}
            </div>
        </div>
    )
}
