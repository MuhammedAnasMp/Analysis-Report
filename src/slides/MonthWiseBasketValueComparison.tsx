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

export default function MonthWiseBasketValueComparison(props:any) {
   const { headerTitle} = props;
    const { openChartModal } = useChartModal();


    const [isLoading, setLoading] = useState(false)
    const [rowData, setRowData] = useState<any[]>([])
    const [filtered, setFiltered] = useState<any[]>([])
    const gridRef = useRef<AgGridReact | any>(null)

    const [colDef] = useState<ColDef<any>[]>([
        { field: "MM", headerName: "Month", cellClass: "text-center", flex: 1 },
        {
            field: "BK_2022", headerName: "Basket Value - 2022", cellClass: "text-right", flex: 1, valueFormatter: (params) => {
                if (params.value == null) return "";
                return params.value.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 3,
                    });;
            }
        },
        {
            field: "BK_2023", headerName: "Basket Value - 2023", cellClass: "text-right", flex: 1, valueFormatter: (params) => {
                if (params.value == null) return "";
                return params.value.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 3,
                    });;
            }
        },
        {
            field: "BK_2024", headerName: "Basket Value - 2024", cellClass: "text-right", flex: 1, valueFormatter: (params) => {
                if (params.value == null) return "";
                return params.value.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 3,
                    });;
            }
        },
        {
            field: "BK_2025", headerName: "Basket Value - 2025", cellClass: "text-right", flex: 1, valueFormatter: (params) => {
                if (params.value == null) return "";
                return params.value.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 3,
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

        fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/month-wise-basket-value-comparison?yyyymm=${yyyymm}&location=${selectedStore?.LOCATION_ID}`)
            .then(result => result.json())
            .then(data => {
                const transformed = data.map((row: any) => ({
                    ...row,
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
        const numericCols = ["BK_2022", "BK_2023", "BK_2024", "BK_2025",]

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
24
25

                    if (col.field === 'BK_2022' && data?.length) {
                        const total_sales22 = data.reduce((sum, item) => sum + (item.SALES22 || 0), 0);
                        const total_customer22 = data.reduce((sum, item) => sum + (item.CUSTOMER22 || 0), 0);

                        const DIF_PERC = total_customer22 ? (total_sales22/ total_customer22)  : 0;

                        formattedVal = DIF_PERC;
                    }
                    if (col.field === 'BK_2023' && data?.length) {
                        const total_sales23 = data.reduce((sum, item) => sum + (item.SALES23 || 0), 0);
                        const total_customer23 = data.reduce((sum, item) => sum + (item.CUSTOMER23 || 0), 0);

                        const DIF_PERC = total_customer23 ? (total_sales23/ total_customer23)  : 0;

                        formattedVal = DIF_PERC;
                    }
                    if (col.field === 'BK_2024' && data?.length) {
                        const total_sales24 = data.reduce((sum, item) => sum + (item.SALES24 || 0), 0);
                        const total_customer24 = data.reduce((sum, item) => sum + (item.CUSTOMER24 || 0), 0);

                        const DIF_PERC = total_customer24 ? (total_sales24/ total_customer24)  : 0;

                        formattedVal = DIF_PERC;
                    }
                    if (col.field === 'BK_2025' && data?.length) {
                        const total_sales25 = data.reduce((sum, item) => sum + (item.SALES25 || 0), 0);
                        const total_customer25 = data.reduce((sum, item) => sum + (item.CUSTOMER25 || 0), 0);

                        const DIF_PERC = total_customer25 ? (total_sales25/ total_customer25)  : 0;

                        formattedVal = DIF_PERC;
                    }

                    const formatted = formattedVal.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 3,
                    })
                    const colorClass = val < 0 ? 'text-red-600 bg-[#ffe6e6]' : 'text-white'

                    rowHTML += `<div class="text-right px-2 text-lg  ${colorClass}">${formatted}${col.field === 'GP_PERC' ? '%' : ''}</div>`
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

        const source = newData && !anySctive ? rowData : filtered
        const categories = source.map(item => item.MM?.trim());

        // Build series
        const newSeries = [
            {
                name: "Basket Value2022",
                data: source.map(item => item.BK_2022 ?? 0)
            },
            {
                name: "Basket Value2023",
                data: source.map(item => item.BK_2023 ?? 0)
            },
            {
                name: "Basket Value2024",
                data: source.map(item => item.BK_2024 ?? 0)
            },
            {
                name: "Basket Value2025",
                data: source.map(item => item.BK_2025 ?? 0)
            }
        ];

        // ApexChart options
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
            colors: ["#2563EB", "#10B981", "#F59E0B", "#FF391A"],
            dataLabels: {
                enabled: true
            },
            xaxis: {
                categories,
                labels: {
                    style: { fontSize: "13px" }
                }
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

        setSeries(newSeries);
        setOptions(newOptions);

    }, [rowData, filtered]);   // 🔥 return whenever data changes

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
                !hideView && rowData.length > 0 &&
                <div className="w-full pt-">

                    <ReactApexChart
                        options={options}
                        series={series}
                        type="bar"
                         height={380} onClick={()=>openChartModal(options, series , headerTitle)}
                    />
                </div>
            }
        </div>
    )
}
