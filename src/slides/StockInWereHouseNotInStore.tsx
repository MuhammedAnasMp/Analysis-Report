import { AgGridReact } from 'ag-grid-react'
import { useEffect, useRef, useState } from "react"
import type { CellValueChangedEvent, ColDef, ColGroupDef } from "ag-grid-community"
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

export default function StockInWereHouseNotInStore(props: any) {
    const { headerTitle } = props;
    const { openChartModal } = useChartModal();

    const [isLoading, setLoading] = useState(false)
    const [rowData, setRowData] = useState<any[]>([])
    const [filtered, setFiltered] = useState<any[]>([])
    const gridRef = useRef<AgGridReact | any>(null)

    const [colDef] = useState<(ColDef | ColGroupDef)[]>([
        { field: "SECTION_CODE", headerName: "Code", cellClass: "text-center", flex: 1 },
        {
            field: "SECTION_NAME", headerName: "Name", cellClass: "text-left", flex: 1, valueFormatter: (params) => {
                if (params.value == null) return "";
                return params.value.toLocaleString();
            }
        },

        {
            field: "1",
            headerName: 'Assortment Based',
            headerClass: "bg-gray-700 text-white",
            children: [
                {
                    field: "TOTAL_SKU", headerName: "Total SKU", cellClass: "text-right", flex: 1, valueFormatter: (params) => {
                        if (params.value == null) return "";
                        return params.value.toLocaleString();
                    }
                },
                {
                    field: "OOS", headerName: "Outof Stock", cellClass: "text-right", flex: 1, valueFormatter: (params) => {
                        if (params.value == null) return "";
                        return params.value.toLocaleString();
                    }
                },
                {
                    field: "AVLBL", headerName: "Available", cellClass: "text-right", flex: 1, valueFormatter: (params) => {
                        if (params.value == null) return "";
                        return params.value.toLocaleString();
                    }
                },
                {

                    field: "OOS_PERC", headerName: "OOS (%)", cellClass: "text-right text-red", flex: 1, valueFormatter: (params) => {
                        if (params.value == null) return (params.data.OOS / params.data.TOTAL_SKU * 100).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }); + ' %';
                        return params.value.toLocaleString();
                    }
                },
                {
                    field: "AVLBL_PERC", headerName: "Avlbl (%)", cellClass: "text-right text-green", flex: 1, valueFormatter: (params) => {
                        if (params.value == null) return (params.data.AVLBL / params.data.TOTAL_SKU * 100).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }); + ' %';
                        return params.value.toLocaleString();
                    }
                },
            ]
        },
        {
            field: "2",
            headerName: 'Assortment & Sales Based',
            headerClass: "bg-gray-800 text-white border-s",
            children: [
                {
                    field: "TOTAL_SALE_ITEM", headerName: "Total Sale Item", cellClass: "text-right", flex: 1, valueFormatter: (params) => {
                        return params.value.toLocaleString();
                    }
                },
                {
                    field: "OOS_SALE_ITEM", headerName: "OOS Sale Item", cellClass: "text-right", flex: 1, valueFormatter: (params) => {
                        if (params.value == null) return "";
                        return params.value.toLocaleString();
                    }
                },
                {
                    field: "AVLBL_SALE_ITEM", headerName: "Avlbl Sale Item", cellClass: "text-right", flex: 1, valueFormatter: (params) => {
                        if (params.value == null) return "";
                        return params.value.toLocaleString();
                    }
                },
                {
                    field: "OOS_SALE_ITEM_PERC", headerName: "OOS Sale Item % ", cellClass: "text-right text-red", flex: 1, valueFormatter: (params) => {
                        if (params.value == null) return (params.data.OOS_SALE_ITEM / params.data.TOTAL_SALE_ITEM * 100).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }); + ' %';
                        return params.value.toLocaleString();
                    }
                },
                {
                    field: "AVLBL_SALE_ITEM_PERC", headerName: "Avlbl Sale Item % ", cellClass: "text-right text-green", flex: 1, valueFormatter: (params) => {
                        if (params.value == null) return (params.data.AVLBL_SALE_ITEM / params.data.TOTAL_SALE_ITEM * 100).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }); + ' %';
                        return params.value.toLocaleString();
                    }
                },
            ]
        }

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

        // fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/stock-in-warehouse-not-in-store?location=${selectedStore?.LOCATION_ID}`)
        fetch(`/api/stock-in-warehouse-not-in-store.json`)
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
        const numericCols = ["TOTAL_SKU", "ACTUAL_STOCK", "OOS", "AVLBL_PERC", "OOS_PERC", "AVLBL", "TOTAL_SALE_ITEM", "OOS_SALE_ITEM", "AVLBL_SALE_ITEM", "OOS_SALE_ITEM_PERC", "AVLBL_SALE_ITEM_PERC"]

        //console.log('numericCols', numericCols)
        const total: Record<string, number> = {}
        const avg: Record<string, number> = {}

        numericCols.forEach(col => {
            const sum = data.reduce((acc, row) => acc + (parseFloat(row[col]) || 0), 0)
            total[col] = col === 'GP_PERC' ? sum : Math.round(sum)
            avg[col] = col === 'OOS_PERC' ? sum / data.length : Math.round(sum / data.length)
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
            
            let rowHTML = ''
            const allCol: any[] = []
            colDef.forEach((colMain: any) => {
                if (colMain.children){

                    colMain.children.forEach((col: any) => {
                        allCol.push(col)
                    })
                }
                else{
                    allCol.push(colMain)
                }  
            })
            const colCount = allCol.length 
            const gridTemplate = `repeat(${colCount + 0}, 1fr)`
            
            allCol.forEach((col: any) => {
                    const val = current[col.field!] ?? ''
                    if (typeof val === 'number' && col.field !== 'SECTION_CODE') {
                        let formattedVal = val
                        if (col.field === 'OOS_PERC' && data) {


                            const OOS = data.reduce((sum, item) => sum + (item.OOS || 0), 0);
                            const TOTAL_AVAILABLE = data.reduce((sum, item) => sum + (item.TOTAL_SKU || 0), 0);
                            formattedVal = OOS ? OOS / TOTAL_AVAILABLE * 100 : 0;

                        }
                        if (col.field === 'AVLBL_PERC' && data) {


                            const AVLBL = data.reduce((sum, item) => sum + (item.AVLBL || 0), 0);
                            const TOTAL_AVAILABLE = data.reduce((sum, item) => sum + (item.TOTAL_SKU || 0), 0);
                            formattedVal = AVLBL ? AVLBL / TOTAL_AVAILABLE * 100 : 0;

                        }
                        if (col.field === 'AVLBL_SALE_ITEM_PERC' && data) {


                            const AVLBL_SALE_ITEM = data.reduce((sum, item) => sum + (item.AVLBL_SALE_ITEM || 0), 0);
                            const TOTAL_SALE_ITEM = data.reduce((sum, item) => sum + (item.TOTAL_SALE_ITEM || 0), 0);
                            formattedVal = AVLBL_SALE_ITEM ? AVLBL_SALE_ITEM / TOTAL_SALE_ITEM * 100 : 0;

                        }
                        if (col.field === 'OOS_SALE_ITEM_PERC' && data) {


                            const OOS_SALE_ITEM = data.reduce((sum, item) => sum + (item.OOS_SALE_ITEM || 0), 0);
                            const TOTAL_SALE_ITEM = data.reduce((sum, item) => sum + (item.TOTAL_SALE_ITEM || 0), 0);

                            formattedVal = OOS_SALE_ITEM ? OOS_SALE_ITEM / TOTAL_SALE_ITEM * 100 : 0;

                        }


                        const formatted = formattedVal.toLocaleString(undefined, {
                        // minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })
                        const colorClass = val < 0 ? 'text-red-600 bg-[#ffe6e6]' : 'text-white'

                        rowHTML += `<div class="text-right px-2 text-lg  ${colorClass}">${formatted}${col.field === 'OOS_SALE_ITEM_PERC' || col.field === 'AVLBL_SALE_ITEM_PERC' ||col.field === 'OOS_PERC' || col.field === 'AVLBL_PERC' ? '%' : ''}</div>`
                    } else {
                        rowHTML += `<div>{xxx}</div>`
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
    const rootRef = useRef<HTMLDivElement | null>(null);



    const [newData, setNewData] = useState(false)
    const [hideView, setHideView] = useState<boolean>(false);


    const [options1, setOptions1] = useState({});
    const [series1, setSeries1] = useState<any>([]);
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
        const categories = source.map(item => item.SECTION_NAME?.trim());






        const AVLBL_SALE_ITEM = source.map((item) => (item.AVLBL / item.TOTAL_SKU * 100 || 0), 0);
        const OOS_SALE_ITEM = source.map((item) => (item.OOS / item.TOTAL_SKU * 100 || 0), 0);


        const newSeries = [


            {
                name: "Assortment Avlbl (%)",
                data: AVLBL_SALE_ITEM.map(num => num.toFixed(3))
            },
            {
                name: "Assortment OOS (%)",
                data: OOS_SALE_ITEM.map(num => num.toFixed(3))
            },
        ];

        // ApexChart options
        const newOptions: any = {
            chart: {
                type: "bar",
                height: 380,
                toolbar: { show: false },
                stacked: true
            },
            plotOptions: {
                bar: {
                    //borderRadius: 6,
                    columnWidth: "45%"
                }
            },

            colors: ["blue", "red",],
            dataLabels: {
                enabled: true, style: {
                    fontSize: '14px',  // adjust size
                    fontWeight: 'bold',
                    colors: ['#000']   // optional: color
                }
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

    }, [rowData, filtered, selectedStore, selectedDate]);

    const [options2, setOptions2] = useState({});
    const [series2, setSeries2] = useState<any>([]);
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

        const anySctive = isAnyFilterActive()

        const source = newData && !anySctive ? rowData : filtered
        const categories = source.map(item => item.SECTION_NAME?.trim());
        const AVLBL_SALE_ITEM = source.map((item) => (item.AVLBL_SALE_ITEM / item.TOTAL_SALE_ITEM * 100 || 0), 0);
        const OOS_SALE_ITEM = source.map((item) => (item.OOS_SALE_ITEM / item.TOTAL_SALE_ITEM * 100 || 0), 0);


        const newSeries = [
            {
                name: "Assortment & Sales Avlbl (%)",
                data: AVLBL_SALE_ITEM.map(num => num.toFixed(3))
            },

            {
                name: "Assortment & Sales OOS (%)",
                data: OOS_SALE_ITEM.map(num => num.toFixed(3))
            },

        ];

        // ApexChart options
        const newOptions: any = {
            chart: {
                type: "bar",
                height: 380,
                toolbar: { show: false },
                stacked: true
            },
            plotOptions: {
                bar: {
                    //borderRadius: 6,
                    columnWidth: "45%"
                }
            },

            colors: ["blue", "red",],
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

    }, [rowData, filtered, selectedStore, selectedDate]);





    return (
        <div className="summary-grid-wrapper age-page" ref={rootRef}>
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
                <div className='flex w-full'>
                    <div className="w-full pt- ">
                        <div className='w-full flex flex-col justify-center'>

                            <ReactApexChart
                                key={2}
                                options={options1}
                                series={series1}
                                type="bar"
                                height={380} onClick={() => openChartModal(options1, series1, headerTitle)}

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
                                height={380} onClick={() => openChartModal(options2, series2, headerTitle)}

                            />
                        </div>
                    </div>
                </div>
            }

        </div>
    )
}
