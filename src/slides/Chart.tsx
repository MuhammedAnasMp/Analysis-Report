import React from "react";
import ReactApexChart from "react-apexcharts";

export default function RevenueCompareChart() {
  const series = [
    {
      name: "2023",
      data: [18000, 51000, 60000, 38000, 88000, 50000, 40000, 52000, 88000, 80000, 60000, 70000],
    },
    {
      name: "2022",
      data: [27000, 38000, 60000, 77000, 40000, 50000, 49000, 29000, 42000, 27000, 42000, 50000],
    },
  ];

  const options :any= {
    chart: {
      type: "area",
      height: 300,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: ["#2563eb", "#9333ea"], // blue & purple
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: { curve: "straight", width: 2 },
    grid: {
      strokeDashArray: 2,
      borderColor: "#e5e7eb",
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.1,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [50, 100],
      },
    },
    xaxis: {
      type: "category",
      categories: [
        "15 January",
        "15 February",
        "15 March",
        "15 April",
        "15 May",
        "15 June",
        "15 July",
        "15 August",
        "15 September",
        "15 October",
        "15 November",
        "15 December",
      ],
      tickPlacement: "on",
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#9ca3af",
          fontSize: "13px",
          fontFamily: "Inter, ui-sans-serif",
          fontWeight: 400,
        },
        formatter: (title: string) => {
          if (!title) return "";
          const [, month] = title.split(" ");
          return month.slice(0, 3);
        },
      },
    },
    yaxis: {
      labels: {
        align: "left",
        minWidth: 0,
        maxWidth: 140,
        style: {
          colors: "#9ca3af",
          fontSize: "13px",
          fontFamily: "Inter, ui-sans-serif",
          fontWeight: 400,
        },
        formatter: (value: number) => (value >= 1000 ? `${value / 1000}k` : value),
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
        const label = w.globals.labels[dataPointIndex];
        const value2023 = series[0][dataPointIndex];
        const value2022 = series[1][dataPointIndex];

        return `
          <div class="min-w-44 rounded-md bg-white dark:bg-neutral-800 shadow-md border border-gray-200 dark:border-neutral-700 p-3">
            <h6 class="text-sm font-medium text-gray-800 dark:text-neutral-200 mb-1">${label}</h6>
            <div class="flex justify-between text-sm">
              <span class="text-blue-600 font-medium">2023:</span>
              <span class="text-gray-800 dark:text-neutral-100 font-semibold">$${value2023.toLocaleString()}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-purple-600 font-medium">2022:</span>
              <span class="text-gray-800 dark:text-neutral-100 font-semibold">$${value2022.toLocaleString()}</span>
            </div>
          </div>
        `;
      },
    },
    responsive: [
      {
        breakpoint: 568,
        options: {
          chart: { height: 300 },
          xaxis: {
            labels: {
              style: {
                colors: "#9ca3af",
                fontSize: "11px",
                fontFamily: "Inter, ui-sans-serif",
                fontWeight: 400,
              },
              offsetX: -2,
              formatter: (title: string) => title.slice(0, 3),
            },
          },
          yaxis: {
            labels: {
              align: "left",
              minWidth: 0,
              maxWidth: 140,
              style: {
                colors: "#9ca3af",
                fontSize: "11px",
                fontFamily: "Inter, ui-sans-serif",
                fontWeight: 400,
              },
              formatter: (value: number) => (value >= 1000 ? `${value / 1000}k` : value),
            },
          },
        },
      },
    ],
  };

  return (
    <div className="w-full px-8">
      <ReactApexChart options={options} series={series} type="area" height={300} width="100%" />
    </div>
  );
}
