import { AgGridReact } from 'ag-grid-react'
import { useEffect, useRef, useState } from "react"
import type { CellValueChangedEvent, ColDef } from "ag-grid-community"
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import '../layouts/table.css'

import NoDatafound from '../componenets/vectorIllustrations/NoDataFound'
import NotSelected from '../componenets/vectorIllustrations/NotSelected'
import type { RootState } from '../redux/app/rootReducer'
import { useSelector } from 'react-redux'
import CustomLoadingOverlay from '../componenets/CustomLoadingOverlay'
import { param } from 'jquery'
import ReactApexChart from 'react-apexcharts'
ModuleRegistry.registerModules([AllCommunityModule])

export default function MonthWiseBasketValueComparison() {
    const [isLoading, setLoading] = useState(false)
    const [rowData, setRowData] = useState<any[]>([])
    const [filtered, setFiltered] = useState<any[]>([])
    const gridRef = useRef<AgGridReact | any>(null)

    const [colDef] = useState<ColDef<any>[]>([
        { field: "MM", headerName: "Month", cellClass: "text-center", flex: 1 },
        { field: "BK_2022", headerName: "Basket Value - 2022", cellClass: "text-right", flex: 1 },
        { field: "BK_2023", headerName: "Basket Value - 2023", cellClass: "text-right", flex: 1 },
        { field: "BK_2024", headerName: "Basket Value - 2024", cellClass: "text-right", flex: 1 },
        { field: "BK_2025", headerName: "Basket Value - 2025", cellClass: "text-right", flex: 1 },
        // {
        //     field: "SKU_COUNT",
        //     headerName: "SKU Count",
        //     cellClass: "text-right",
        //     flex: 1,
        //     cellStyle: params =>
        //         params.value < 0 ? { backgroundColor: '#ffe6e6', color: 'red' } : null,
        // },
        // {
        //     field: "STOCK_QTY",
        //     headerName: "Stock Quantity",
        //     cellClass: "text-right",
        //     flex: 1,
        //     cellStyle: params =>
        //         params.value < 0 ? { backgroundColor: '#ffe6e6', color: 'red' } : null,
        // },
        // {
        //     field: "VALUE",
        //     headerName: "Value",
        //     cellClass: "text-right",
        //     flex: 1,
        //     cellStyle: params =>
        //         params.value < 0 ? { backgroundColor: '#ffe6e6', color: 'red' } : null,
        // },
        // {
        //     field: "AGE_180",
        //     headerName: "6 Month Ageing",
        //     cellClass: "text-right",
        //     flex: 1,
        //     cellStyle: params =>
        //         params.value < 0 ? { backgroundColor: '#ffe6e6', color: 'red' } : null,
        // },
        // {
        //     field: "AGE_365",
        //     headerName: "1 Year Ageing",
        //     cellClass: "text-right",
        //     flex: 1,
        //     cellStyle: params =>
        //         params.value < 0 ? { backgroundColor: '#ffe6e6', color: 'red' } : null,
        // },
        // {
        //     field: "AGE_ABOVE730",
        //     headerName: "2 Year + Ageing",
        //     cellClass: "text-right",
        //     flex: 1,
        //     cellStyle: params =>
        //         params.value < 0 ? { backgroundColor: '#ffe6e6', color: 'red' } : null,
        // },
        // {
        //     field: "MONTH_SALES",
        //     headerName: "Monthly Sales",
        //     cellClass: "text-right",
        //     flex: 1,
        //     cellStyle: params =>
        //         params.value < 0 ? { backgroundColor: '#ffe6e6', color: 'red' } : null,
        // },
        // {
        //     field: "PROFIT",
        //     headerName: "Profit",
        //     cellClass: "text-right",
        //     flex: 1,
        //     cellStyle: params =>
        //         params.value < 0 ? { backgroundColor: '#ffe6e6', color: 'red' } : null,
        // },

        // {
        //     field: "GP_PERC",
        //     headerName: "GP %",
        //     cellClass: "text-right",
        //     flex: 1,
        //     cellStyle: params =>
        //         params.value < 0 ? { backgroundColor: '#ffe6e6', color: 'red' } : null,
        // },
        // {
        //     field: "STOCK_DAYS",
        //     headerName: "Stock Days",
        //     cellClass: "text-right",
        //     flex: 1,
        //     cellStyle: params =>
        //         params.value < 0 ? { backgroundColor: '#ffe6e6', color: 'red' } : null,
        // },
        // {
        //     field: "DIF_PERC",
        //     headerName: "% Hike/Decline",
        //     cellClass: "text-center",
        //     flex: 1,
        //     cellStyle: params =>
        //         params.value < 0 ? { backgroundColor: '#ffe6e6', color: 'red' } : null,

        // },
        // {
        //     field: "REMARK",
        //     headerName: "Remarks",
        //     flex: 2,
        //     editable: true, // ✅ still editable
        //     // cellStyle: (params) =>
        //     //     !params.value ? { backgroundColor: "#ffe6e6", color: "red" } : null,
        //     cellRenderer: (params: any) => {
        //         // Show placeholder if value is empty
        //         if (!params.value || params.value === "") {
        //             return <span className="text-gray-400 italic">Click to edit ,Enter to save</span>
        //         }
        //         return <span>{params.value}</span>
        //     },
        // }


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

        fetch(`http://localhost:5000/api/month-wise-basket-value-comparison?yyyymm=${yyyymm}&location=${selectedStore?.LOCATION_ID}`)
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
            })
            .catch(() => setLoading(false))
    }, [selectedDate, selectedStore]);


    // 🔍 Get filtered rows
    const getFilteredData = () => {
        if (!gridRef.current) return
        const filteredNodes: any[] = []
        gridRef.current.api.forEachNodeAfterFilter((node: any) => filteredNodes.push(node.data))
        setFiltered(filteredNodes)
        return filteredNodes
    }

    const calculateTotals = (data: any[]) => {
        if (data.length === 0) return { total: {}, avg: {} }
        console.log("data", data)
        const numericCols = ["BK_2022", "BK_2023", "BK_2024", "BK_2025",]

        console.log('numericCols', numericCols)
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

                    // if field is GP_PERC, divide by total row count first
                    if (col.field === 'GP_PERC' && data) {
                        formattedVal = val / data.length
                    }

                    const formatted = formattedVal
                    const colorClass = val < 0 ? 'text-red-600 bg-[#ffe6e6]' : 'text-gray-800'

                    rowHTML += `<div class="text-right px-2 text-lg  ${colorClass}">${formatted}${col.field === 'GP_PERC' ? '%' : ''}</div>`
                } else {
                    rowHTML += `<div></div>`
                }
            })

            customFooter.innerHTML = `
                    <div class="w-full bg-gray-100 border-t border-gray-300 "
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


    
    
const [options, setOptions] = useState({});
const [series, setSeries] = useState<any>([]);

useEffect(() => {

    // Use filtered if available, else fallback to rowData
    const source = filtered?.length ? filtered : rowData;

    // Build categories
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
            toolbar: { show: true }
        },
        plotOptions: {
            bar: {
                borderRadius: 6,
                columnWidth: "45%"
            }
        },
        colors: ["#2563EB", "#10B981", "#F59E0B" , "#FF391A"],
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories,
            labels: {
                style: { fontSize: "13px" }
            }
        },
        yaxis: {
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
        
            <div className="ag-theme-quartz h-[calc(50vh-10px)] w-full relative">

                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={colDef}
                    // pagination={true}
                    defaultColDef={{
                        sortable: true,
                        filter: true,
                        resizable: true,
                        floatingFilter: true,
                    }}
                    // onCellValueChanged={handleCellValueChanged}
                    stopEditingWhenCellsLoseFocus={true} // commit edit when you click away
                    loading={isLoading}
                    noRowsOverlayComponent={NoRowsOverlay}
                    onFilterChanged={getFilteredData}
                    loadingOverlayComponent={CustomLoadingOverlay}
                />
            </div>
            <div className="w-full pt-4">
                <ReactApexChart
                    options={options}
                    series={series}
                    type="bar"
                    height={380}
                />
            </div>
        </div>
    )
}
