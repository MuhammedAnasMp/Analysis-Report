import { AgGridReact } from 'ag-grid-react'
import { useEffect, useRef, useState } from "react"
import type { ColDef } from "ag-grid-community"
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import '../layouts/table.css'

import NoDatafound from '../componenets/vectorIllustrations/NoDataFound'
import NotSelected from '../componenets/vectorIllustrations/NotSelected'
import type { RootState } from '../redux/app/rootReducer'
import { useSelector } from 'react-redux'
import CustomLoadingOverlay from '../componenets/CustomLoadingOverlay'

interface Dates {
    current: string[];
    prev_month: string[];
    prev_year: string[];
}
import ReactApexChart from 'react-apexcharts'
import { useChartModal } from '../hooks/ChartModalContext'
ModuleRegistry.registerModules([AllCommunityModule])

export default function MonthWiseLFL(props:any) {
   const { headerTitle} = props;
    const { openChartModal } = useChartModal();

    const [isLoading, setLoading] = useState(false)
    const [rowData, setRowData] = useState<any[]>([])
    const [filtered, setFiltered] = useState<any[]>([])
    const gridRef = useRef<AgGridReact | any>(null)
    const [newData, setNewData] = useState(false)


    const [dates, setDates] = useState<Dates>()

    const [colDef, setColDef] = useState<ColDef<any>[]>([]);

    const formatDateRange = (start: string, end: string) => {
        const format = (d: string) => {
            const date = new Date(d);
            const day = String(date.getDate()).padStart(2, "0");
            const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
            return `${day}-${month}`;
        };

        const year = new Date(start).getFullYear(); // use start date's year

        return `${format(start)} - ${format(end)} (${year})`;
    };


    useEffect(() => {
        if (!dates) return;

        setColDef([
            {
                field: "SEC_CODE", headerName: "Code", cellClass: "text-center", flex: 1, valueFormatter: (params) => {
                    if (params.value == null) return "";
                    return params.value.toLocaleString();
                }
            },
            { field: "SEC_NAME", headerName: "Section", cellClass: "text-center", flex: 1, },
            {
                field: "MTD_VALUE", headerName: `TM (${formatDateRange(dates.current[0], dates.current[1])})`, cellClass: "text-right", flex: 1, valueFormatter: (params) => {
                    if (params.value == null) return "";
                    return params.value.toLocaleString();
                }
            },
            {
                field: "LM_VALUE", headerName: `LM (${formatDateRange(dates.prev_month[0], dates.prev_month[1])})`, cellClass: "text-right", flex: 1, valueFormatter: (params) => {
                    if (params.value == null) return "";
                    return params.value.toLocaleString();
                }
            },
            {
                field: "LY_VALUE", headerName: `LY (${formatDateRange(dates.prev_year[0], dates.prev_year[1])})`, cellClass: "text-right", flex: 1, valueFormatter: (params) => {
                    if (params.value == null) return "";
                    return params.value.toLocaleString();
                }
            },
            {
                field: "TM_VS_LM_PCT", headerName: `TM VS LM (%)`, cellClass: "text-right", flex: 1, valueFormatter: (params) => {
                    if (params.value == null) return "";
                    return params.value.toLocaleString() + " %";
                },
                cellStyle: (params) =>
                    params.value < 0
                        ? { backgroundColor: '#ffe6e6', color: 'red' }
                        : null,
            },
            {
                field: "TM_VS_LY_PCT", headerName: `TM VS LY (%)`, cellClass: "text-right", flex: 1, valueFormatter: (params) => {
                    if (params.value == null) return "";
                    return params.value.toLocaleString() + " %";
                },
                cellStyle: (params) =>
                    params.value < 0
                        ? { backgroundColor: '#ffe6e6', color: 'red' }
                        : null,
            },
           

        ]);
    }, [dates]);

    const { selectedStore, selectedDate } = useSelector((state: RootState) => state.store);

    useEffect(() => {
        if (!selectedDate || !selectedStore) return;

        setLoading(true);

        const dateObj = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);

        // Convert to YYYYMM
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1; // JS months are 0-indexed
        const yyyymm = `${year}${month.toString().padStart(2, '0')}`;

        fetch(`http://172.16.4.167:5000/api/monthly-lfl?yyyymm=${yyyymm}&location=${selectedStore?.LOCATION_ID}`)
            .then(result => result.json())
            .then(data => {
                // Convert all numeric fields to integer except DIF_PERC
                const transformed = data.data.map((row: any) => ({
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
                setDates(data.dates)
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
        const numericCols = ["MTD_VALUE", "LM_VALUE", "LY_VALUE" ,"TM_VS_LM_PCT","TM_VS_LY_PCT"]

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
                let formattedVal = val
                if (typeof val === 'number') {

                    if (col.field === 'TM_VS_LY_PCT'  && data) {

                        const MTD_VALUE = data.reduce((sum, item) => sum + (item.MTD_VALUE || 0), 0);
                        const LM_VALUE = data.reduce((sum, item) => sum + (item.LM_VALUE || 0), 0);
                        const PERC_CHANGE = (MTD_VALUE - LM_VALUE)/MTD_VALUE
                        formattedVal = PERC_CHANGE  ? PERC_CHANGE *100 : 0;
                        
                    }
                    if ( col.field === 'TM_VS_LM_PCT'   && data) {
                        const MTD_VALUE = data.reduce((sum, item) => sum + (item.MTD_VALUE || 0), 0);
                        const LY_VALUE = data.reduce((sum, item) => sum + (item.LY_VALUE || 0), 0);
                        const PERC_CHANGE = (MTD_VALUE - LY_VALUE)/MTD_VALUE
                        formattedVal = PERC_CHANGE  ? PERC_CHANGE *100 : 0;

                    }

                    const formatted = formattedVal.toLocaleString()
                    const colorClass = formattedVal < 0 ? 'text-red-600 bg-[#ffe6e6]' : 'text-white'

                    rowHTML += `<div class="text-right px-2 text-lg  ${colorClass}">${formatted}${col.field === 'TM_VS_LM_PCT' || col.field === 'TM_VS_LY_PCT' ? '%' : ''}</div>`
                } else {


                    //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", val)
                    //console.log(val)
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

        const categories = source.map(item => item.SEC_NAME?.trim());
        //console.log("source", source)
        // Build series
        const newSeries = [
            {
                name: "This Month",
                data: source.map(item => item.MTD_VALUE ?? 0)
            },
            {
                name: "Last Month",
                data: source.map(item => item.LM_VALUE ?? 0)
            },
            {
                name: "Last Year",
                data: source.map(item => item.LY_VALUE ?? 0)
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
                    borderRadius: 6,
                    columnWidth: "45%"
                }
            },
            colors: ["#2563EB", "#10B981", "#F59E0B"],
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

    }, [rowData, filtered, hideView]);

    return (
        <div className="summary-grid-wrapper " ref={rootRefSale}>
            <div className={`ag-theme-quartz ${!hideView && rowData.length > 0 ? " h-[calc(50vh-10px)]" : "h-[calc(100vh-150px)]"} w-full relative`}>
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
                <div className="w-full pt-4">

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
