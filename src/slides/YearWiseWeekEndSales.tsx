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

export default function YearWiseWeekEndSales(props:any) {
   const { headerTitle} = props;
    const { openChartModal } = useChartModal();

    const [isLoading, setLoading] = useState(false)
    const [rowCustomerData, setRowData] = useState<any[]>([])
    const [filtered, setFiltered] = useState<any[]>([])
    const gridRef = useRef<AgGridReact | any>(null)

    const [colDef] = useState<ColDef<any>[]>([
        { field: "MM", headerName: "Month", cellClass: "text-center", flex: 1 },
        {
            field: "WEEKDAYS_SALES", headerName: "Weekdays Sales", cellClass: "text-right", flex: 1, valueFormatter: (params) => {
                if (params.value == null) return "";
                return params.value.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    });
            }
        },
        {
            field: "WEEKDAYS_CUSTOMERS", headerName: "Weekdays Customers", cellClass: "text-right", flex: 1, valueFormatter: (params) => {
                if (params.value == null) return "";
                return params.value.toLocaleString();
            }
        },
        {
            field: "WEEKDAYS_BV", headerName: "Weekdays BV", cellClass: "text-right", flex: 1, valueFormatter: (params) => {
                if (params.value == null) return (params.data.WEEKDAYS_SALES / params.data.WEEKDAYS_CUSTOMERS).toLocaleString();
                return '';
            }
        },
        {
            field: "WEEKENDS_SALES", headerName: "Weekend Sales", cellClass: "text-right", flex: 1, valueFormatter: (params) => {
                if (params.value == null) return "";
                return params.value.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    });
            }
        },
        {
            field: "WEEKENDS_CUSTOMERS", headerName: "Weekend Customrers", cellClass: "text-right", flex: 1, valueFormatter: (params) => {
                if (params.value == null) return "";
                return params.value.toLocaleString();
            }
        },
        {
            field: "WEEKENDS_BV", headerName: "Weekend BV", cellClass: "text-right", flex: 1, valueFormatter: (params) => {
                if (params.value == null) return (params.data.WEEKENDS_SALES / params.data.WEEKENDS_CUSTOMERS).toLocaleString();
                return params.value.toLocaleString();
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

        fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/year-wise-weekend-sales?yyyymm=${yyyymm}&location=${selectedStore?.LOCATION_ID}`)
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
        const numericCols = ["WEEKDAYS_SALES", "WEEKDAYS_CUSTOMERS", "WEEKDAYS_BV", "WEEKENDS_SALES", "WEEKENDS_CUSTOMERS", "WEEKENDS_BV"]

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


            const { total } = calculateTotals(filtered.length ? filtered : rowCustomerData)

            const data = filtered.length ? filtered : rowCustomerData
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
                    if (col.field === 'WEEKDAYS_BV' && data) {


                        const total_weekdays_sales = data.reduce((sum, item) => sum + (item.WEEKDAYS_SALES || 0), 0);
                        const total_weekdays_customers = data.reduce((sum, item) => sum + (item.WEEKDAYS_CUSTOMERS || 0), 0);

                        formattedVal = total_weekdays_customers ? total_weekdays_sales / total_weekdays_customers : 0;

                    }
                    if (col.field === 'WEEKENDS_BV' && data) {


                        const total_weekends_sales = data.reduce((sum, item) => sum + (item.WEEKENDS_SALES || 0), 0);
                        const total_weekends_customers = data.reduce((sum, item) => sum + (item.WEEKENDS_CUSTOMERS || 0), 0);

                        formattedVal = total_weekends_customers ? total_weekends_sales / total_weekends_customers : 0;

                    }


                    const formatted = formattedVal.toLocaleString()
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
                customDiv.innerText = `Result Count:  ${filtered.length ? filtered.length : rowCustomerData.length}`
            }
        }, 200)

        return () => clearTimeout(timer)
    }, [filtered, rowCustomerData, colDef])


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
    const [options1, setOptions1] = useState({});
    const [series1, setSeries1] = useState<any>([]);

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

        const source = newData && !anySctive ? rowCustomerData : filtered
        const categories = source.map(item => item.MM?.trim());

        // Build series
        const newSeries = [
            {
                name: "Weekdays Sales",
                data: source.map(item => item.WEEKDAYS_SALES ?? 0)
            },
           
            {
                name: "Weekends Sales",
                data: source.map(item => item.WEEKENDS_SALES ?? 0)
            },
           
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
            colors: ["#F59E0B", "#a36803"],
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

        setSeries1(newSeries);
        setOptions1(newOptions);
        setNewData(false)

    }, [rowCustomerData, filtered, selectedStore, selectedDate]);


    const [options2, setOptions2] = useState({});
    const [series2, setSeries2] = useState<any>([]);

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

        const source = newData && !anySctive ? rowCustomerData : filtered
        const categories = source.map(item => item.MM?.trim());

        // Build series
        const newSeries = [
           
            {
                name: "Weekdays Customers",
                data: source.map(item => item.WEEKDAYS_CUSTOMERS ?? 0)
            },
          
            {
                name: "Weekends Customers",
                data: source.map(item => item.WEEKENDS_CUSTOMERS ?? 0)
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
            colors: [ "#FF391A", "#b01a02",],
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

        setSeries2(newSeries);
        setOptions2(newOptions);
        setNewData(false)

    }, [rowCustomerData, filtered, selectedStore, selectedDate]);

    return (
        <div className="summary-grid-wrapper" ref={rootRef}>
            <div className={`ag-theme-quartz ${!hideView && rowCustomerData.length > 0 ? " h-[calc(50vh-10px)]" : "h-[calc(100vh-100px)]"} w-full relative`}>

                <AgGridReact
                    ref={gridRef}
                    rowData={rowCustomerData}
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
                !hideView && rowCustomerData.length > 0 &&
                <div className='flex w-full'>
                    <div className="w-full pt- ">
                        <div className='w-full flex flex-col justify-center'>

                            <ReactApexChart
                                key={2}
                                options={options1}
                                series={series1}
                                type="bar"
                                 height={380} onClick={()=>openChartModal(options1, series1 , headerTitle)}

                            />
                        </div>
                    </div>
                    <div className="w-full pt- ">
                        <div className='w-full flex flex-col justify-center'>
                            <ReactApexChart
                                key={2}
                                options={options2}
                                series={series2}
                                type="bar"
                                 height={380} onClick={()=>openChartModal(options2, series2 , headerTitle)}

                            />
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
