import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/app/rootReducer";

interface SupermarketData {
  salesByCategory: {
    categories: string[];
    values: number[];
  };
  monthlyRevenue: {
    months: string[];
    values: number[];
  };
  productShare: {
    labels: string[];
    values: number[];
  };
  dailyCustomers: {
    days: string[];
    values: number[];
  };
}

const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: "14px",
  padding: "16px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)"
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState<SupermarketData | null>(null);
    const { selectedStore, selectedDate } = useSelector((state: RootState) => state.store);
  useEffect(() => {
    fetch("/api/supermarket.json")
      .then(res => res.json())
      .then(json => setData(json));
  }, [ selectedStore, selectedDate]);

  if (!data) return <div>Loading dashboard...</div>;

  const openChartModal = (options: any, series: any, title: string) => {
    console.log("Open chart modal:", title);
  };

  return (
    <div
      style={{
        padding: "24px",
        background: "#f5f7fb",
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gap: "20px"
      }}
    >
      {/* Sales by Category */}
      <div style={{ ...cardStyle, gridColumn: "span 6" }}>
        <ReactApexChart
          options={{
            chart: {
              type: "bar",
              toolbar: { show: false }
            },
            xaxis: {
              categories: data.salesByCategory.categories
            },
            title: { text: "Sales by Category" },
            colors: ["#4f46e5"]
          }}
          series={[
            { name: "Sales", data: data.salesByCategory.values }
          ]}
          type="bar"
          height={320}
          onClick={() =>
            openChartModal(
              {},
              data.salesByCategory.values,
              "Sales by Category"
            )
          }
        />
      </div>

      {/* Monthly Revenue */}
      <div style={{ ...cardStyle, gridColumn: "span 6" }}>
        <ReactApexChart
          options={{
            chart: {
              type: "line",
              toolbar: { show: false }
            },
            stroke: { curve: "smooth", width: 3 },
            xaxis: {
              categories: data.monthlyRevenue.months
            },
            title: { text: "Monthly Revenue" },
            colors: ["#22c55e"]
          }}
          series={[
            { name: "Revenue", data: data.monthlyRevenue.values }
          ]}
          type="line"
          height={320}
          onClick={() =>
            openChartModal(
              {},
              data.monthlyRevenue.values,
              "Monthly Revenue"
            )
          }
        />
      </div>

      {/* Product Share */}
      <div style={{ ...cardStyle, gridColumn: "span 4" }}>
        <ReactApexChart
          options={{
            chart: {
              toolbar: { show: false }
            },
            labels: data.productShare.labels,
            title: { text: "Product Share" },
            legend: { position: "bottom" }
          }}
          series={data.productShare.values}
          type="donut"
          height={320}
          onClick={() =>
            openChartModal(
              {},
              data.productShare.values,
              "Product Share"
            )
          }
        />
      </div>

      {/* Daily Customers */}
      <div style={{ ...cardStyle, gridColumn: "span 8" }}>
        <ReactApexChart
          options={{
            chart: {
              type: "area",
              toolbar: { show: false }
            },
            xaxis: {
              categories: data.dailyCustomers.days
            },
            stroke: { curve: "smooth" },
            fill: {
              type: "gradient",
              gradient: {
                opacityFrom: 0.6,
                opacityTo: 0.1
              }
            },
            title: { text: "Daily Customers" },
            colors: ["#f97316"]
          }}
          series={[
            { name: "Customers", data: data.dailyCustomers.values }
          ]}
          type="area"
          height={320}
          onClick={() =>
            openChartModal(
              {},
              data.dailyCustomers.values,
              "Daily Customers"
            )
          }
        />
      </div>
    </div>
  );
};

export default Dashboard;
