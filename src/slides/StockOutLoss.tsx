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
import ReactApexChart from 'react-apexcharts'
import { useChartModal } from '../hooks/ChartModalContext'
ModuleRegistry.registerModules([AllCommunityModule])

export default function StockOutLoss(props: any) {
    const { headerTitle } = props;
    const { openChartModal } = useChartModal();

    const [isLoading, setLoading] = useState(false)
    const [rowCustomerData, setRowData] = useState<any[]>([])
    const [filtered, setFiltered] = useState<any[]>([])
    const gridRef = useRef<AgGridReact | any>(null)

    const [colDef] = useState<ColDef<any>[]>([
        { field: "SEC_CODE", headerName: "CODE", cellClass: "text-center", flex: 1 },
        { field: "SEC_NAME", headerName: "NAME", cellClass: "text-center", flex: 1 },
        {
            field: "SKU_COUNT", headerName: "Total SKU", cellClass: "text-right", flex: 1, valueFormatter: (params) => {
                if (params.value == null) return "";
                return params.value.toLocaleString();
            }
        },
        {
            field: "SALES_TM", headerName: "TM Sale", cellClass: "text-right", flex: 1, valueFormatter: (params) => {
                if (params.value == null) return "";
                return params.value.toLocaleString(undefined, {
                    // minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })
            }
        },
        {
            field: "SALES_LM", headerName: "LM Sale", cellClass: "text-right", flex: 1, valueFormatter: (params) => {
                if (params.value == null) return "";
                return params.value.toLocaleString(undefined, {
                    // minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })
            }
        },
        {
            field: "SALES_LY", headerName: "LY Sale", cellClass: "text-right", flex: 1, valueFormatter: (params) => {
                if (params.value == null) return "";
                return params.value.toLocaleString(undefined, {
                    // minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })
            }
        },
        {
            field: "TOTAL_PROFIT", headerName: "Total Profit", cellClass: "text-right", flex: 1, valueFormatter: (params) => {
                if (params.value == null) return "";
                return params.value.toLocaleString(undefined, {
                    // minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })
            }
        },
        {
            field: "PROFIT_LOSS", headerName: "Profit Loss", cellClass: "text-right", flex: 1, valueFormatter: (params) => {
                if (params.value == null) return "";
                return params.value.toLocaleString(undefined, {
                    // minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })
            }
        },
        {
            field: "PROFIT_LOSS_PERC", headerName: "Profit Loss (%)", cellClass: "text-right text-red", flex: 1, valueFormatter: (params) => {
                if (params.value == null) return (params.data.PROFIT_LOSS / params.data.TOTAL_PROFIT * 100).toLocaleString();
                return params.value.toLocaleString();
            }
        },
        {
            field: "SALE_LOSS", headerName: "Sale Loss", cellClass: "text-right", flex: 1, valueFormatter: (params) => {
                if (params.value == null) return "";
                return params.value.toLocaleString(undefined, {
                    // minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })
            }
        },
        {
            field: "SALE_LOSS_PERC", headerName: "Sale Loss (%)", cellClass: "text-right text-red", flex: 1, valueFormatter: (params) => {
                if (params.value == null) return (params.data.SALE_LOSS / params.data.TOTAL_PROFIT * 100).toLocaleString();
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

        fetch(`http://172.16.4.167:5000/api/stock-out-loss?yyyymm=${yyyymm}&location=${selectedStore?.LOCATION_ID}`)
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
        const numericCols = ["PROFIT_LOSS", "SALES_LM", "SALES_LY", "SALE_VALUE25", "SALES_TM", "SKU_COUNT", "SALE_LOSS","SALE_LOSS_PERC","PROFIT_LOSS_PERC", "TOTAL_PROFIT"]

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

                    if (col.field === 'SALE_LOSS_PERC' && data) {


                        const total_SALE_LOSS = data.reduce((sum, item) => sum + (item.SALE_LOSS || 0), 0);
                        const total_PROFIT = data.reduce((sum, item) => sum + (item.TOTAL_PROFIT || 0), 0);

                        formattedVal = total_SALE_LOSS ? total_SALE_LOSS / total_PROFIT  : 0;

                    }
                    if (col.field === 'PROFIT_LOSS_PERC' && data) {


                        const total_PROFIT_LOSS = data.reduce((sum, item) => sum + (item.PROFIT_LOSS || 0), 0);
                        const total_PROFIT = data.reduce((sum, item) => sum + (item.TOTAL_PROFIT || 0), 0);

                        formattedVal = total_PROFIT_LOSS ? total_PROFIT_LOSS / total_PROFIT  : 0;

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

        const source = newData && !anySctive ? rowCustomerData : filtered
        const categories = source.map(item => item.MM?.trim());

        const profit_loss = source.map((item) => (item.PROFIT_LOSS / item.TOTAL_PROFIT * 100 || 0), 0);
        const sales_loss = source.map((item) => (item.SALE_LOSS / item.TOTAL_PROFIT * 100 || 0), 0);
        console.table(profit_loss)
        // Build series
        const newSeries = [
            {
                name: "Profit Loss (%)",
                data: profit_loss.map(num => num.toFixed(3))
            },
            {
                name: "Sales Loss (%)",
                data: sales_loss.map(num => num.toFixed(3))
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
        setNewData(false)

    }, [rowCustomerData, filtered, selectedStore, selectedDate]);   // 🔥 return whenever data changes
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
                <div className="w-full pt-">

                    <ReactApexChart
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
