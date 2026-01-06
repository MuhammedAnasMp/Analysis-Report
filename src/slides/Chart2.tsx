import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/app/rootReducer";

export default function SectionPerformanceChart() {
const { selectedStore, selectedDate } = useSelector((state: RootState) => state.store);
    const [isLoading, setLoading] = useState(false)
const [data, setRowData] = useState<any[]>([])
   useEffect(() => {
          if (!selectedDate || !selectedStore) return;
  
          setLoading(true);
  
          const dateObj = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);
  
          // Convert to YYYYMM
          const year = dateObj.getFullYear();
          const month = dateObj.getMonth() + 1; // JS months are 0-indexed
          const yyyymm = `${year}${month.toString().padStart(2, '0')}`;
  
          fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/stockvsageing?yyyymm=${yyyymm}&location=${selectedStore?.LOCATION_ID}`)
              .then(result => result.json())
              .then(data => {
                  setRowData(data)
                  setLoading(false)
              })
              .catch(() => setLoading(false))
      }, [selectedDate, selectedStore]);




      useEffect(()=>{

      },[data])

  // -------------------------------
  // Extracting X-axis and series
  // -------------------------------
  const categories = data.map(item => item.SEC_NAME.trim());

  const series = [
    {
      name: "Monthly Sales",
      data: data.map(item => item.MONTH_SALES ?? 0)
    },
    {
      name: "Profit",
      data: data.map(item => item.PROFIT ?? 0)
    },
    {
      name: "Stock Value",
      data: data.map(item => item.VALUE ?? 0)
    }
  ];

  // -------------------------------
  // ApexChart options
  // -------------------------------
  const options :any = {
    chart: {
      type: "bar",
      height: 380,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        //borderRadius: 6,
        columnWidth: "45%",
      }
    },
    colors: ["#2563EB", "#10B981", "#F59E0B"],
    dataLabels: {
      enabled: true
    },
    xaxis: {
      categories,
      labels: {
        style: {
          fontSize: "13px"
        }
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

  return (
    <div className="w-full px-8">
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
         height={380} onClick={()=>openChartModal(options, series , headerTitle)}
      />
    </div>
  );
}
