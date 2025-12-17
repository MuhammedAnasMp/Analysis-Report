import { AgGridReact } from 'ag-grid-react'
import { useEffect, useRef, useState } from "react"
import type { CellValueChangedEvent, ColDef } from "ag-grid-community"
import { ModuleRegistry, AllCommunityModule, ALWAYS_SYNC_GLOBAL_EVENTS } from 'ag-grid-community'
import '../layouts/table.css'

import NoDatafound from '../componenets/vectorIllustrations/NoDataFound'
import NotSelected from '../componenets/vectorIllustrations/NotSelected'
import type { RootState } from '../redux/app/rootReducer'
import { useSelector } from 'react-redux'
import CustomLoadingOverlay from '../componenets/CustomLoadingOverlay'
import { param } from 'jquery'
import ReactApexChart from 'react-apexcharts'
import { useChartModal } from '../hooks/ChartModalContext'
ModuleRegistry.registerModules([AllCommunityModule])

export default function MonthWiseFreshComparison(props:any) {
   const { headerTitle} = props;
    const { openChartModal } = useChartModal();

    const [isLoading, setLoading] = useState(false)
    const [rowData, setRowData] = useState<any[]>([])
    const [filtered, setFiltered] = useState<any[]>([])
    const gridRef = useRef<AgGridReact | any>(null)

    const [year, setYear] = useState<number>();

    const [colDef, setColDef] = useState<ColDef<any>[]>()

    useEffect(() => {

        setColDef([
            { field: "MM", headerName: "Month", cellClass: "text-center", flex: 1 },
            {
                field: "BAKERY", headerName: `Backery ${year}`, flex: 1, valueFormatter: (params) => {
                    if (params.value == null) return "";
                    return params.value.toLocaleString();
                },
                cellClass: (params) => {
                    let classes = ["text-right"]; // Always apply right alignment
                    if (params.value != null && params.data.BAKERY_PREV != null) {
                        if (params.value > params.data.BAKERY_PREV) classes.push("text-green");
                        else if (params.value < params.data.BAKERY_PREV) classes.push("text-red");
                    }
                    return classes.join(" "); // Combine classes into a single string
                },
            },
            {
                field: "BAKERY_PREV", headerName: `Backery ${year && year - 1}`, cellClass: "text-right", flex: 1, valueFormatter: (params) => {
                    if (params.value == null) return "";
                    return params.value.toLocaleString();
                }
            },
            {
                field: "BUTCHERY", headerName: `Butchery ${year}`, flex: 1, valueFormatter: (params) => {
                    if (params.value == null) return "";
                    return params.value.toLocaleString();
                },
                cellClass: (params) => {
                    let classes = ["text-right"]; // Always apply right alignment
                    if (params.value != null && params.data.BUTCHERY_PREV != null) {
                        if (params.value > params.data.BUTCHERY_PREV) classes.push("text-green");
                        else if (params.value < params.data.BUTCHERY_PREV) classes.push("text-red");
                    }
                    return classes.join(" "); // Combine classes into a single string
                },
            },
            {
                field: "BUTCHERY_PREV", headerName: `Butchery ${year && year - 1}`, cellClass: "text-right", flex: 1, valueFormatter: (params) => {
                    if (params.value == null) return "";
                    return params.value.toLocaleString();
                }
            },
            {
                field: "FISHERY", headerName: `Fishery ${year}`, flex: 1, valueFormatter: (params) => {
                    if (params.value == null) return "";
                    return params.value.toLocaleString();
                },
                cellClass: (params) => {
                    let classes = ["text-right"]; // Always apply right alignment
                    if (params.value != null && params.data.FISHERY_PREV != null) {
                        if (params.value > params.data.FISHERY_PREV) classes.push("text-green");
                        else if (params.value < params.data.FISHERY_PREV) classes.push("text-red");
                    }
                    return classes.join(" "); // Combine classes into a single string
                },
            },
            {
                field: "FISHERY_PREV", headerName: `Fishery ${year && year - 1}`, cellClass: "text-right", flex: 1, valueFormatter: (params) => {
                    if (params.value == null) return "";
                    return params.value.toLocaleString();
                }
            },
            {
                field: "FRUITS_VEG", headerName: `F & V ${year} `, flex: 1, valueFormatter: (params) => {
                    if (params.value == null) return "";
                    return params.value.toLocaleString();
                },
                cellClass: (params) => {
                    let classes = ["text-right"]; // Always apply right alignment
                    if (params.value != null && params.data.FRUITS_VEG_PREV != null) {
                        if (params.value > params.data.FRUITS_VEG_PREV) classes.push("text-green");
                        else if (params.value < params.data.FRUITS_VEG_PREV) classes.push("text-red");
                    }
                    return classes.join(" "); // Combine classes into a single string
                },
            },
            {
                field: "FRUITS_VEG_PREV", headerName: `F & V ${year && year - 1}`, cellClass: "text-right", flex: 1, valueFormatter: (params) => {
                    if (params.value == null) return "";
                    return params.value.toLocaleString();
                }
            },
            {
                field: "HOTFOOD", headerName: `HotFood ${year}`, flex: 1, valueFormatter: (params) => {
                    if (params.value == null) return "";
                    return params.value.toLocaleString();
                },
                cellClass: (params) => {
                    let classes = ["text-right"]; // Always apply right alignment
                    if (params.value != null && params.data.HOTFOOD_PREV != null) {
                        if (params.value > params.data.HOTFOOD_PREV) classes.push("text-green");
                        else if (params.value < params.data.HOTFOOD_PREV) classes.push("text-red");
                    }
                    return classes.join(" "); // Combine classes into a single string
                },
            },
            {
                field: "HOTFOOD_PREV", headerName: `HotFood ${year && year - 1}`, cellClass: "text-right", flex: 1, valueFormatter: (params) => {
                    if (params.value == null) return "";
                    return params.value.toLocaleString();
                }
            }

        ])
    }, [year])

    const { selectedStore, selectedDate } = useSelector((state: RootState) => state.store);

    useEffect(() => {
        if (!selectedDate || !selectedStore) return;

        setLoading(true);

        const dateObj = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);

        // Convert to YYYYMM
        const year = dateObj.getFullYear();
        setYear(year)
        const month = dateObj.getMonth() + 1; // JS months are 0-indexed
        const yyyymm = `${year}${month.toString().padStart(2, '0')}`;

        // fetch(`http://172.16.4.167:5000/api/month-wise-sales-fresh?yyyymm=${yyyymm}&location=${selectedStore?.LOCATION_ID}`)
        fetch(`http://172.16.4.167:5000/api/month-wise-sales-fresh?yyyymm=202511&location=${selectedStore?.LOCATION_ID}`)
            .then(result => result.json())
            .then(data => {
                // Convert all numeric fields to integer except DIF_PERC
                const transformed = data.map((row: any) => ({
                    ...row,
                    // TOTAL_BUDGET: Math.round(row.TOTAL_BUDGET),
                    // BUD_AVG: Math.round(row.BUD_AVG),
                    // TILL_SALES: Math.round(row.TILL_SALES),
                    // AVG_SALE: Math.round(row.AVG_SALE),
                    // DIFFERENCE: Math.round(row.DIFFERENCE),
                    // DIF_PERC: parseFloat(row.DIF_PERC), // keep as float
                }))

                setRowData(transformed)
                setLoading(false)
                setNewData(true)
                setFiltered([])
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
        const numericCols = ["BAKERY", "BAKERY_PREV", "BUTCHERY", "BUTCHERY_PREV", "FISHERY", "FISHERY_PREV", "FRUITS_VEG", "FRUITS_VEG_PREV", "HOTFOOD", "HOTFOOD_PREV"]

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
        if (!colDef) return;
        const timer = setTimeout(() => {
            const wrapper = rootRefSale.current;
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
                    22
                    23

                    const formatted = formattedVal.toLocaleString()
                    const colorClass = val < 0 ? 'text-red-600 bg-[#ffe6e6]' : 'text-white'

                    rowHTML += `<div class="text-right px-2 text-lg  ${colorClass}">${formatted}${col.field === 'GP_PERC' ? '%' : ''}</div>`
                } else {
                    rowHTML += `<div></div>`
                }
            })

            customFooter.innerHTML = `
                    <div class="w-full bg-black border-t  border-gray-300 "
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
    }, [filtered, rowData, colDef, year])


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
    const rootRefSale = useRef<HTMLDivElement | null>(null);

    const [newData, setNewData] = useState(false)


    const [options, setOptions] = useState({});
    const [series, setSeries] = useState<any>([]);
    const [hideView, setHideView] = useState<boolean>(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    useEffect(() => {
        const isAnyFilterActive = () => {
            const api = gridRef.current?.api;
            if (!api) return false;

            const filterModel = api.getFilterModel();
            const hasColumnFilters = Object.keys(filterModel).length > 0;

            const quickFilter = api.getQuickFilter();
            const hasQuickFilter = !!quickFilter;

            return hasColumnFilters || hasQuickFilter;
        };

        const anyActive = isAnyFilterActive();
        const source = newData && !anyActive ? rowData : filtered;
        const categories = source.map(item => item.MM?.trim());

        const allSeries = [
            { name: "BAKERY", data: source.map(d => d.BAKERY), color: "#FF6384" },
            { name: "BAKERY PREV", data: source.map(d => d.BAKERY_PREV), color: "#FF9AA2" },

            { name: "BUTCHERY", data: source.map(d => d.BUTCHERY), color: "#36A2EB" },
            { name: "BUTCHERY PREV", data: source.map(d => d.BUTCHERY_PREV), color: "#89CFF0" },

            { name: "FISHERY", data: source.map(d => d.FISHERY), color: "#FFCE56" },
            { name: "FISHERY PREV", data: source.map(d => d.FISHERY_PREV), color: "#FFE29A" },

            { name: "FRUITS VEG", data: source.map(d => d.FRUITS_VEG), color: "#4BC0C0" },
            { name: "FRUITS VEG PREV", data: source.map(d => d.FRUITS_VEG_PREV), color: "#9DE0E0" },

            { name: "HOTFOOD", data: source.map(d => d.HOTFOOD ?? 0), color: "#9966FF" },
            { name: "HOTFOOD PREV", data: source.map(d => d.HOTFOOD_PREV ?? 0), color: "#C2A3FF" }
        ];

        // Determine visible series
        const visibleSeries =
            selectedCategories.includes("ALL")
                ? allSeries
                : selectedCategories.length > 0
                    ? allSeries.filter(s =>
                        selectedCategories.some(cat => s.name === cat || s.name === `${cat} PREV`)
                    )
                    : allSeries.filter(s => !s.name.includes("PREV")); // default: main only

        const newOptions: ApexCharts.ApexOptions = {
            chart: { type: "line", height: 450, toolbar: { show: false } },
            stroke: { width: 2.5 },
            xaxis: { categories },
            yaxis: {   tickAmount: 15 },
            legend: { show: false }, // hide built-in legend
            tooltip: { shared: true, intersect: false }
        };


        setSeries(visibleSeries);
        setOptions(newOptions);
    }, [rowData, filtered, selectedCategories]);

    const categories = [
        { name: "BAKERY", color: "#FF6384" },
        { name: "BUTCHERY", color: "#36A2EB" },
        { name: "FISHERY", color: "#FFCE56" },
        { name: "FRUITS VEG", color: "#4BC0C0" },
        { name: "HOTFOOD", color: "#9966FF" }
    ];

    const allColor = "#888"; // gray for "All"


    return (
        <div className="summary-grid-wrapper " ref={rootRefSale}>

            <div className={`ag-theme-quartz ${!hideView && rowData.length > 0 ? " h-[calc(50vh-10px)]" : "h-[calc(100vh-100px)]"} w-full relative`}>

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
            {
                !hideView && rowData.length > 0 && <>
                    <div className='relative '>

                        <div className='top-3 pt-2 absolute  mx-0 ' style={{ left: "50%", transform: "translateX(-50%)" }}>

                            <div className='' style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "10px" }}>
                                {/* All option */}
                                <div
                                    style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                                    onClick={() => setSelectedCategories(["ALL"])}
                                >
                                    <span
                                        style={{
                                            display: "inline-block",
                                            width: "10px",
                                            height: "10px",
                                            borderRadius: "50%",
                                            background: selectedCategories.includes("ALL") ? allColor : "#ccc",
                                            marginRight: "5px"
                                        }}
                                    />
                                    <span className='text-xs'>All</span>
                                </div>

                                {/* Individual categories */}
                                {categories.map(cat => {
                                    const isSelected =
                                        selectedCategories.includes("ALL") || selectedCategories.includes(cat.name);
                                    return (
                                        <div
                                            key={cat.name}
                                            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                                            onClick={() => {
                                                if (selectedCategories.includes("ALL")) {
                                                    setSelectedCategories([cat.name]);
                                                } else if (selectedCategories.includes(cat.name)) {
                                                    setSelectedCategories(selectedCategories.filter(s => s !== cat.name));
                                                } else {
                                                    setSelectedCategories([...selectedCategories, cat.name]);
                                                }
                                            }}
                                        >
                                            <span
                                                style={{
                                                    display: "inline-block",
                                                    width: "10px",
                                                    height: "10px",
                                                    borderRadius: "50%",
                                                    background: cat.color,
                                                    opacity: isSelected ? 1 : 0.3,
                                                    marginRight: "5px"
                                                }}
                                            />
                                            <span className='text-xs'>{cat.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="w-full pt-8">

                            <ReactApexChart
                                options={options}
                                series={series}
                                type="line"
                                height={330}
                            />
                        </div>
                    </div>
                </>
            }
        </div>
    )
}
