import { ChatBubbleLeftEllipsisIcon, CheckIcon, WindowIcon, XMarkIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import SingleChart from "./SingleChart";
import { Tabs } from "../componenets/Tabs";

export interface ChartModalProps {
    options: any;
    series: ApexAxisChartSeries;
    onClose: () => void;
    heading: string;
}

const ChartModal: React.FC<ChartModalProps> = ({
    options,
    series,
    onClose,
    heading
}) => {
    const [value, setValue] = useState(600); // 0 = Low, 1 = Medium, 2 = High
    const [isDetailed, setDetailed] = useState(false)
    return (
        <div className="fixed top-0 inset-0 z-50  bg-opacity-40 backdrop-blur-sm  flex flex-col items-center justify-center overflow-auto">

            <div className="w-[95%] flex justify-between items-center p-4 bg-black text-white shadow-lg rounded-lg rounded-b-none">
                <h3 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold">{heading}</h3>

                <div className="flex space-x-4 ml-auto">

                    <div className="flex justify-center items-center gap-3">

                        {/* <p className="px-3">Detailed View</p> */}




                        <div className=" ">
                            <input
                                id="range-selector"
                                type="range"
                                min="400"
                                max="900"
                                step="100"
                                value={value}
                                onChange={(e) => setValue(Number(e.target.value))}
                                className={`w-full bg-transparent cursor-pointer appearance-none disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden
                                                                                [&::-webkit-slider-thumb]:w-3
                                                                                [&::-webkit-slider-thumb]:h-3
                                                                                [&::-webkit-slider-thumb]:-mt-0.5
                                                                                [&::-webkit-slider-thumb]:appearance-none
                                                                                [&::-webkit-slider-thumb]:bg-white
                                                                                [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(37,99,235,1)]
                                                                                [&::-webkit-slider-thumb]:rounded-full
                                                                                [&::-webkit-slider-thumb]:transition-all
                                                                                [&::-webkit-slider-thumb]:duration-150
                                                                                [&::-webkit-slider-thumb]:ease-in-out
                                                                                dark:[&::-webkit-slider-thumb]:bg-neutral-700

                                                                                [&::-moz-range-thumb]:w-3
                                                                                [&::-moz-range-thumb]:h-3
                                                                                [&::-moz-range-thumb]:appearance-none
                                                                                [&::-moz-range-thumb]:bg-white
                                                                                [&::-moz-range-thumb]:border-4
                                                                                [&::-moz-range-thumb]:border-red-600
                                                                                [&::-moz-range-thumb]:rounded-full
                                                                                [&::-moz-range-thumb]:transition-all
                                                                                [&::-moz-range-thumb]:duration-150
                                                                                [&::-moz-range-thumb]:ease-in-out

                                                                                [&::-webkit-slider-runnable-track]:w-full
                                                                                [&::-webkit-slider-runnable-track]:h-2
                                                                                [&::-webkit-slider-runnable-track]:bg-gray-100 
                                                                                [&::-webkit-slider-runnable-track]:rounded-full
                                                                                dark:[&::-webkit-slider-runnable-track]:bg-neutral-700

                                                                                [&::-moz-range-track]:w-full
                                                                                [&::-moz-range-track]:h-2
                                                                                [&::-moz-range-track]:bg-gray-100
                                                                                [&::-moz-range-track]:rounded-full`}
                            />
                        </div>

                        <Tabs
                            tabs={[
                                {
                                    id: "0",
                                    label: "Summary",
                                    content: <p className="text-sm text-blue-700">First tab content</p>,
                                },
                                {
                                    id: "1",
                                    label: "Detailed",
                                    content: <p className="text-sm text-blue-700">Second tab content</p>,
                                },
                            ]}

                            onChange={(tabId) => {
                                const isDetailedTab = tabId === "1";
                                setDetailed(isDetailedTab);
                                return true; // always allow tab change
                            }}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="h-8 w-8 flex justify-center items-center !rounded-full hover:scale-120 hover:bg-gray-600  dark:bg-neutral-700 dark:hover:bg-neutral-600"
                        aria-label="Close"
                    >
                        <XMarkIcon height={20} width={20} />
                    </button>
                </div>
            </div>
            <div className={`bg-white dark:bg-neutral-800  w-full max-w-[95%]  flex flex-col  pointer-events-auto  shadow-lg rounded-lg rounded-t-none max-h-[90vh] overflow-y-auto  overflow-x-hidden`}>

                <div className="w-full">
                    {
                        !isDetailed ?
                            <ReactApexChart
                                options={options}
                                series={series}
                                type="bar"
                                height={value}
                            /> :
                            <SingleChart series={series} options={options} height={value} />
                    }


                </div>
            </div>
        </div>
    );
};

export default ChartModal;
