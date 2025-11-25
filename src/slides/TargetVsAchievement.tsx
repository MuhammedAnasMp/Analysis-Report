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
ModuleRegistry.registerModules([AllCommunityModule])

export default function TargetVsAchievement() {
    const [isLoading, setLoading] = useState(false)
    const [rowData, setRowData] = useState<any[]>([])
    const [filtered, setFiltered] = useState<any[]>([])
    const gridRef = useRef<AgGridReact | any>(null)


    const [colDef] = useState<ColDef<any>[]>([
        { field: "SEC_CODE", headerName: "Code", cellClass: "text-center", flex: 1 },
        { field: "SEC_NAME", headerName: "Section", cellClass: "text-left", flex: 1 },
        {
            field: "TOTAL_BUDGET",
            headerName: "Month Budget",
            cellClass: "text-right",
            flex: 1,
            cellStyle: params =>
                params.value < 0 ? { backgroundColor: '#ffe6e6', color: 'red' } : null,
        },         
        {
            field: "BUD_AVG",
            headerName: "Average Budget",
            cellClass: "text-right",
            flex: 1,
            cellStyle: params =>
                params.value < 0 ? { backgroundColor: '#ffe6e6', color: 'red' } : null,
        },
        {
            field: "TILL_SALES",
            headerName: "Total Sale",
            cellClass: "text-right",
            flex: 1,
            cellStyle: params =>
                params.value < 0 ? { backgroundColor: '#ffe6e6', color: 'red' } : null,
        },
        {
            field: "AVG_SALE",
            headerName: "Average Sales",
            cellClass: "text-right",
            flex: 1,
            cellStyle: params =>
                params.value < 0 ? { backgroundColor: '#ffe6e6', color: 'red' } : null,
        },
        {
            field: "DIFFERENCE",
            headerName: "Difference",
            cellClass: "text-right",
            flex: 1,
            cellStyle: params =>
                params.value < 0 ? { backgroundColor: '#ffe6e6', color: 'red' } : null,
        },
        {
            field: "DIF_PERC",
            headerName: "% Hike/Decline",
            cellClass: "text-center",
            flex: 1,
            cellStyle: params =>
                params.value < 0 ? { backgroundColor: '#ffe6e6', color: 'red' } : null,

        },
        {
            field: "REMARK",
            headerName: "Remarks",
            flex: 2,
            editable: true, // ✅ still editable
            // cellStyle: (params) =>
            //     !params.value ? { backgroundColor: "#ffe6e6", color: "red" } : null,
            cellRenderer: (params: any) => {
                // Show placeholder if value is empty
                if (!params.value || params.value === "") {
                    return <span className="text-gray-400 italic">Click to edit ,Enter to save</span>
                }
                return <span>{params.value}</span>
            },
        }


    ])

    const { selectedStore, selectedDate } = useSelector((state: RootState) => state.store);

    const lastEdit = useRef<{ code: string; value: any } | null>(null);

    const handleCellValueChanged = async (event: CellValueChangedEvent) => {
        const { data, colDef, newValue, oldValue } = event;

        // Only handle REMARK edits
        if (colDef.field !== "REMARK" || newValue === oldValue) return;

        const code = data.SEC_CODE?.trim(); // Use SEC_CODE as unique key

        //  Prevent duplicate API hits for same SEC_CODE and value
        if (
            lastEdit.current &&
            lastEdit.current.code === code &&
            lastEdit.current.value === newValue
        ) {
            return;
        }
        lastEdit.current = { code, value: newValue };

        try {
            const res = await fetch(`http://localhost:5000/api/target-vs-achievement`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ REMARK: newValue, ...data }),
            });

            if (!res.ok) throw new Error("Failed to update");

        } catch (err) {
            console.error("❌ Update failed:", err);

            // event.node.setDataValue("REMARK", oldValue);
        }
    };

    useEffect(() => {
        if (!selectedDate || !selectedStore) return;

        setLoading(true);

        const dateObj = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);

        // Convert to YYYYMM
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1; // JS months are 0-indexed
        const yyyymm = `${year}${month.toString().padStart(2, '0')}`;

        fetch(`http://localhost:5000/api/target-vs-achievement?yyyymm=${yyyymm}&location=${selectedStore?.LOCATION_ID}`)
            .then(result => result.json())
            .then(data => {
                // Convert all numeric fields to integer except DIF_PERC
                const transformed = data.map((row: any) => ({
                    ...row,
                    TOTAL_BUDGET: Math.round(row.TOTAL_BUDGET),
                    BUD_AVG: Math.round(row.BUD_AVG),
                    TILL_SALES: Math.round(row.TILL_SALES),
                    AVG_SALE: Math.round(row.AVG_SALE),
                    DIFFERENCE: Math.round(row.DIFFERENCE),
                    DIF_PERC: parseFloat(row.DIF_PERC), // keep as float
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

        const numericCols = ["TOTAL_BUDGET", "BUD_AVG", "TILL_SALES", "AVG_SALE", "DIFFERENCE", "DIF_PERC"]
        const total: Record<string, number> = {}
        const avg: Record<string, number> = {}

        numericCols.forEach(col => {
            const sum = data.reduce((acc, row) => acc + (parseFloat(row[col]) || 0), 0)
            total[col] = col === 'DIF_PERC' ? sum : Math.round(sum)   // DIF_PERC as float, others integer
            avg[col] = col === 'DIF_PERC' ? sum / data.length : Math.round(sum / data.length)
        })

        return { total, avg }
    }


    useEffect(() => {
        const timer = setTimeout(() => {
            const wrapper = rootRef.current;
            if (!wrapper) return;

            const agRoot = wrapper.querySelector(".ag-root");
            if (!agRoot) return;

            const customFooter = document.createElement('div')
            agRoot.appendChild(customFooter)



            const { total } = calculateTotals(filtered.length ? filtered : rowData)
            console.log(total)
            const data = filtered.length ? filtered : rowData
            const current = total
            const colCount = colDef.length
            const gridTemplate = `repeat(${colCount + 1}, 1fr)`

            let rowHTML = ''

            colDef.forEach(col => {
                const val = current[col.field!] ?? ''
                if (typeof val === 'number') {
                    let formattedVal = val

                    // if field is DIF_PERC, divide by total row count first
                    if (col.field === 'DIF_PERC' && data) {
                        formattedVal = val / data.length
                    }

                    const formatted = (formattedVal).toFixed(2)
                    const colorClass = val < 0 ? 'text-red-600 bg-[#ffe6e6]' : 'text-gray-800'

                    rowHTML += `<div class="text-right px-2 text-lg  ${colorClass}">${formatted}${col.field === 'DIF_PERC' ? '%' : ''}</div>`
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
    const rootRef = useRef<HTMLDivElement | null>(null);
    return (
        <div className="summary-grid-wrapper" ref={rootRef}>

            <div className="ag-theme-quartz h-[calc(100vh-150px)] w-full relative">

                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={colDef}
                    pagination={true}
                    defaultColDef={{
                        sortable: true,
                        filter: true,
                        resizable: true,
                        floatingFilter: true,
                    }}
                    onCellValueChanged={handleCellValueChanged}
                    stopEditingWhenCellsLoseFocus={true} // commit edit when you click away
                    loading={isLoading}
                    noRowsOverlayComponent={NoRowsOverlay}
                    onFilterChanged={getFilteredData}
                    loadingOverlayComponent={CustomLoadingOverlay}

                />
            </div>
        </div>
    )
}
