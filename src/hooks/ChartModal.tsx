import { XMarkIcon } from "@heroicons/react/24/solid";
import React from "react";
import ReactApexChart from "react-apexcharts";

interface ChartModalProps {
    options: any;
    series: ApexAxisChartSeries;
    onClose: () => void;
    heading:string;
}

const ChartModal: React.FC<ChartModalProps> = ({
    options,
    series,
    onClose,
    heading
}) => {
    return (
        <div className="fixed inset-0 z-50  bg-opacity-40 backdrop-blur-sm flex items-center justify-center overflow-auto ">
            <div className="bg-white dark:bg-neutral-800 w-full max-w-[95%] flex flex-col pointer-events-auto shadow-lg rounded-lg">
                <div className="flex justify-between items-center m-2">
                    <div></div>
                    <h3 className="text-sm font-semibold ">{heading}</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-8 w-8 flex justify-center items-center !rounded-full  hover:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600"
                        aria-label="Close"
                    >
                        <XMarkIcon height={20} width={20} />
                    </button>
                </div>

                <ReactApexChart
                    options={options}
                    series={series}
                    type="bar"
                    height={500}
                />
            </div>
        </div>
    );
};

export default ChartModal;
