import { AgGridReact } from 'ag-grid-react'
import { useEffect, useRef, useState } from "react"
import type {  ColDef } from "ag-grid-community"
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import '../layouts/table.css'

import NoDatafound from '../componenets/vectorIllustrations/NoDataFound'
import NotSelected from '../componenets/vectorIllustrations/NotSelected'
import type { RootState } from '../redux/app/rootReducer'
import { useSelector } from 'react-redux'
import CustomLoadingOverlay from '../componenets/CustomLoadingOverlay'
import ReactApexChart from 'react-apexcharts'
import { useChartModal } from '../hooks/ChartModalContext'
ModuleRegistry.registerModules([AllCommunityModule])


const parseDate = (str: string) => {
    // Convert "DD-MMM-YY" to "YYYY-MM-DD" for Date parsing
    const [day, monthStr, year] = str.split("-");
    const monthNames: Record<string, string> = {
        JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06",
        JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12"
    };
    const fullYear = "20" + year; // Assuming 20YY
    return new Date(`${fullYear}-${monthNames[monthStr.toUpperCase()]}-${day}`);
};

export default function WeekWiseFresh(props: any) {
    const { headerTitle } = props;
    const { openChartModal } = useChartModal();

    const [isLoading, setLoading] = useState(false)
    const [rowData, setRowData] = useState<any[]>([])
    const [filtered, setFiltered] = useState<any[]>([])
    const gridRef = useRef<AgGridReact | any>(null)

    const [colDef] = useState<ColDef<any>[]>([
        { field: "SECTION_NAME", headerName: "Section", cellClass: "text-center", flex: 1 },
        {
            field: "SECTION_CODE", headerName: "Code", cellClass: "text-left", flex: 1, valueFormatter: (params) => {
                if (params.value == null) return "";
                return params.value.toLocaleString();
            }
        },
        {
            field: "DT", headerName: "Periods", cellClass: "text-left", flex: 1, valueFormatter: (params) => {
                if (params.value == null) return "";
                return params.value.toLocaleString();
            }
        },
        {
            field: "DIFF_DAYS", headerName: "Total Days", cellClass: "text-center", flex: 1, valueFormatter: (params) => {
                const [date1, date2] = params.data.DT.split(",")
                const d1 = parseDate(date1);
                const d2 = parseDate(date2);
                const diffDays = Math.abs(Math.round((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24)));
                return `${diffDays}`;


            }
        },
        {
            field: "SALE", headerName: "Sales Amount", cellClass: "text-left", flex: 1, valueFormatter: (params) => {
                if (params.value == null) return "";
                return params.value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                });
            }
        },

        {
            field: "PROFIT", headerName: "Profit", cellClass: "text-left", flex: 1, valueFormatter: (params) => {
                if (params.value == null) return "";
                return params.value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                });
            }
        },
        {
            field: "DMG_VAL", headerName: "Damage Value", cellClass: "text-left", flex: 1, valueFormatter: (params) => {
                if (params.value == null) return "";
                return params.value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                });
            }
        },
        {
            field: "GP", headerName: "GP (%)", cellClass: "text-left", flex: 1, valueFormatter: (params) => {
                if (params.value == null) return "";
                return params.value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                });
            }
        },
        {
            field: "DMG_PERC", headerName: "Damage (%)", cellClass: "text-left", flex: 1, valueFormatter: (params) => {
                if (params.value == null) return "";
                return params.value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                });
            }
        },


    ])

    const { selectedStore, selectedDate } = useSelector((state: RootState) => state.store);

    useEffect(() => {
        if (!selectedDate || !selectedStore) return;

        setLoading(true);

        const dateObj = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);

        // Convert to YYYYMM
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1; // JS months are 0-indexed
        const yyyymm = `${year}${month.toString().padStart(2, '0')}`;

        fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/week-wise-fresh?yyyymm=${yyyymm}&location=${selectedStore?.LOCATION_ID}`)
            .then(result => result.json())
            .then(data => {
                const transformed = data.map((row: any) => ({
                    ...row,
                }))

                setRowData(transformed)
                setLoading(false)
                setFiltered([])
                setNewData(true)
            })
            .catch(() => setLoading(false))
    }, [selectedDate, selectedStore]);

    const getFilteredData = () => {
        if (!gridRef.current) return;
        const api = gridRef.current.api;

        const filteredNodes: any[] = [];
        api.forEachNodeAfterFilter((node: any) => filteredNodes.push(node.data));
        setFiltered(filteredNodes);

        const filterModel = api.getFilterModel();

        const hasAnyFilterValue = Object.values(filterModel).some((filter: any) => {
            return filter?.filter != null && filter.filter !== "";
        });

        const hideView = hasAnyFilterValue && filteredNodes.length === 0;

        //console.log("hideView:", hideView);
        setHideView(hideView)

        return filteredNodes;
    };
    const calculateTotals = (data: any[]) => {
        if (data.length === 0) return { total: {}, avg: {} }
        //console.log("data", data)
        const numericCols = ["SALE"]

        //console.log('numericCols', numericCols)
        const total: Record<string, number> = {}
        const avg: Record<string, number> = {}

        numericCols.forEach(col => {
            const sum = data.reduce((acc, row) => acc + (parseFloat(row[col]) || 0), 0)
            total[col] = col === 'GP_PERC' ? sum : Math.round(sum)   // GP_PERC as float, others integer
            avg[col] = col === 'GP_PERC' ? sum / data.length : Math.round(sum / data.length)
        })

        return { total, avg }
    }


    useEffect(() => {
        const timer = setTimeout(() => {
            const wrapper = rootRef.current;
            if (!wrapper) return;

            const agRoot = wrapper.querySelector(".ag-root");
            if (!agRoot) return;

            const existingFooter = agRoot.querySelector(".custom-footer");
            if (existingFooter) existingFooter.remove();

            const customFooter = document.createElement('div');
            customFooter.className = "custom-footer";   // important!
            agRoot.appendChild(customFooter);


            const { total } = calculateTotals(filtered.length ? filtered : rowData)

            const data = filtered.length ? filtered : rowData
            const current = total
            const colCount = colDef.length
            const gridTemplate = `repeat(${colCount + 0}, 1fr)`

            let rowHTML = ''

            colDef.forEach(col => {
                const val = current[col.field!] ?? ''
                if (typeof val === 'number') {
                    let formattedVal = val

                    // if field is GP_PERC, divide by total row count first
                    if (col.field === 'GP_PERC' && data) {
                        formattedVal = val / data.length
                    }

                    const formatted = formattedVal.toLocaleString()
                    const colorClass = val < 0 ? 'text-red-600 bg-[#ffe6e6]' : 'text-white'

                    rowHTML += `<div class="text-left px-2 text-lg  ${colorClass}">${formatted}${col.field === 'GP_PERC' ? '%' : ''}</div>`
                } else {
                    rowHTML += `<div></div>`
                }
            })

            customFooter.innerHTML = `
                    <div class="w-full bg-black border-t pr-3  border-gray-300 "
                        style="display:grid; grid-template-columns:${gridTemplate}; align-items:center;">
                        ${rowHTML}
                    </div>
                `



            // Pagination update
            const gridPanels = document.getElementsByClassName('ag-paging-panel')
            if (gridPanels.length > 0) {
                const paginationPanel = gridPanels[0]
                let customDiv = paginationPanel.querySelector('.custom-btn') as HTMLDivElement
                if (!customDiv) {
                    customDiv = document.createElement('div')
                    customDiv.className = 'custom-btn mr-auto text-[13px] font-medium flex items-center text-gray-800'
                    paginationPanel.prepend(customDiv)
                }
                customDiv.innerText = `Result Count:  ${filtered.length ? filtered.length : rowData.length}`
            }
        }, 200)

        return () => clearTimeout(timer)
    }, [filtered, rowData, colDef])

    const [activeTab, setActiveTab] = useState<"gp" | "damage" | "sales">("gp");

    const tabClass = (tab: any) =>
        `py-2 px-4 text-sm font-medium !border-b-2 transition-colors
     ${activeTab === tab
            ? "!border-blue-600 text-blue-600"
            : "border-transparent text-gray-500 hover:text-blue-600"
        } dark:text-neutral-400 dark:hover:text-blue-500`;




    const NoRowsOverlay = () => (
        <div className="h-88 w-88 ">
            {(!selectedStore || !selectedDate) ? (

                <>
                    <NotSelected />
                    <div className="text-xl text-gray-700 mt-2">
                        Please select one store and date
                    </div>
                </>
            ) : (
                <>
                    <NoDatafound />
                    <div className="text-xl text-gray-700 mt-2">
                        No data available <span className='font-semibold'>{selectedStore?.LOCATION_NAME}</span>  on <span className='font-semibold'>{selectedDate ? new Date(selectedDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : ''}</span>
                    </div>

                </>
            )}
        </div>
    );





    const rootRef = useRef<HTMLDivElement | null>(null);

    const [newData, setNewData] = useState(false)


    const [options, setOptions] = useState({});
    const [series, setSeries] = useState<any>([]);
    const [hideView, setHideView] = useState<boolean>(false);
    useEffect(() => {


        const isAnyFilterActive = () => {
            const api = gridRef.current?.api;
            if (!api) return false;

            // 1. Column filters
            const filterModel = api.getFilterModel();
            const hasColumnFilters = Object.keys(filterModel).length > 0;

            // 2. Quick filter (global search)
            const quickFilter = api.getQuickFilter();
            const hasQuickFilter = !!quickFilter;

            return hasColumnFilters || hasQuickFilter;
        };

        const anySctive = isAnyFilterActive()

        console.log("rowData", rowData)
        console.log("rowData", rowData)

        const source = newData && !anySctive ? rowData : filtered

        const uniqueDates = Array.from(
            new Set(source.map(item => item.DT))
        );

        const sectionData: Record<string, Record<string, number>> = {};

        source.forEach(item => {
            if (!sectionData[item.SECTION_NAME]) {
                sectionData[item.SECTION_NAME] = {};
            }
            if (activeTab === "gp") {
                sectionData[item.SECTION_NAME][item.DT] = item.GP;
            }
            else if (activeTab === "damage") {
                sectionData[item.SECTION_NAME][item.DT] = item.DMG_VAL;
            }
            else {
                sectionData[item.SECTION_NAME][item.DT] = item.SALE;
            }

        });
        console.table(sectionData)
        function toCamelCase(input: string): string {
            return input
                .toLowerCase()
                .split('_')
                .map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                )
                .join(',') + " " + activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
        }

        const series = Object.keys(sectionData).map(sectionName => ({
            name: toCamelCase(sectionName),
            data: uniqueDates.map(date =>
                sectionData[sectionName][date] ?? 0
            ),
        }));
        const sortedByName = [...series].sort((a, b) => a.name.localeCompare(b.name));
        setSeries(sortedByName);
        // ApexChart options









        const withDays = uniqueDates.map(item => {
            const [date1, date2] = item.split(",");
            const d1 = parseDate(date1);
            const d2 = parseDate(date2);
            const diffDays = Math.abs(Math.round((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24)));
            return `${item} (${diffDays}D)`;
        });


        const newOptions: any = {
            chart: {
                type: "bar",
                height: 380,
                toolbar: { show: false }
            },
            plotOptions: {
                bar: {
                    //borderRadius: 6,
                    columnWidth: "45%"
                }
            },
            colors: ["#2563EB", "#10B981", "#F59E0B", "#FF391A", "#40a9ff"],
            dataLabels: {
                enabled: true
            },
            xaxis: {
                categories: withDays,
                labels: {
                    style: { fontSize: "13px" }
                },
            },
            yaxis: {
                tickAmount: 15,
                labels: {
                    formatter: (v: number) => v.toLocaleString()
                }
            },
            legend: {
                position: "top"
            },
            tooltip: {
                y: {
                    formatter: (v: number) => v.toLocaleString()
                }
            }
        };


        setOptions(newOptions);
        setNewData(false)

    }, [rowData, filtered, selectedStore, selectedDate, activeTab]);
    return (
        <div className="summary-grid-wrapper" ref={rootRef}>
            <div className={`ag-theme-quartz ${!hideView && rowData.length > 0 ? " h-[calc(50vh-40px)]" : "h-[calc(100vh-100px)]"} w-full relative`}>

                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={colDef}
                    // pagination={true}
                    defaultColDef={{
                        sortable: true,
                        filter: true,
                        resizable: true,

                    }}
                    // onCellValueChanged={handleCellValueChanged}
                    stopEditingWhenCellsLoseFocus={true} // commit edit when you click away
                    loading={isLoading}
                    noRowsOverlayComponent={NoRowsOverlay}
                    onFilterChanged={getFilteredData}
                    loadingOverlayComponent={CustomLoadingOverlay}
                />
            </div>

            <div className="w-full rounded-lg bg-white shadow-md dark:bg-neutral-800">
                {/* Tabs */}
                <div className="border-b border-gray-200 px-4 dark:border-neutral-700">
                    <nav className="flex justify-center gap-4">
                        <button
                            onClick={() => { setNewData(true); setActiveTab("gp") }}
                            className={tabClass("gp")}
                        >
                            GP %
                        </button>

                        <button
                            onClick={() => { setNewData(true); setActiveTab("damage") }}
                            className={tabClass("damage")}
                        >
                            Damage %
                        </button>

                        <button
                            onClick={() => { setNewData(true); setActiveTab("sales") }}
                            className={tabClass("sales")}
                        >
                            Sales
                        </button>
                    </nav>
                </div>

                {/* <div className="p-4">
                    {activeTab === "gp" && (
                        <p className="text-gray-600 dark:text-neutral-300">
                            This is the <span className="font-semibold">GP %</span> tab content.
                        </p>
                    )}

                    {activeTab === "damage" && (
                        <p className="text-gray-600 dark:text-neutral-300">
                            This is the <span className="font-semibold">Damage %</span> tab content.
                        </p>
                    )}

                    {activeTab === "sales" && (
                        <p className="text-gray-600 dark:text-neutral-300">
                            This is the <span className="font-semibold">Sales</span> tab content.
                        </p>
                    )}
                </div> */}
            </div>
            {
                !hideView && rowData.length > 0 &&
                <div className="w-full pt-">

                    <ReactApexChart
                        key={activeTab}
                        options={options}
                        series={series}
                        type="bar"
                        height={380} onClick={() => openChartModal(options, series, headerTitle)}
                    />
                </div>
            }
        </div>
    )
}
