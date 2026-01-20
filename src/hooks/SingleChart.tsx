
import ReactApexChart from 'react-apexcharts';
import type { ChartModalProps } from './ChartModal';

type SingleChartProps = Pick<ChartModalProps, "series" | "options"> & {
  height?: number | string; // Add height type here
};
export default function SingleChart({ series, options, height }: SingleChartProps) {

    let gridColsClass: string;
    if (series.length === 1) {
        gridColsClass = "grid-cols-1";
    } else if (series.length === 2) {
        gridColsClass = "grid-cols-2";
    } else if (series.length === 3) {
        gridColsClass = "grid-cols-3";
    } else {
        gridColsClass = "grid-cols-4"; 
    }

    return (
        <div className={`grid ${gridColsClass} gap-0 w-full`}>
            {series.map((item, idx) => {
                const chartOptions = {
                    ...options,
                    colors: [options.colors[idx % options.colors.length]],
                };

                return (
                    <div className="w-full" key={idx}>
                        <div className="flex justify-center items-center m-2 w-full">
                            <p className="text-xl font-semibold">{item.name}</p>
                        </div>
                        <ReactApexChart
                            key={idx}
                            options={chartOptions}
                            series={[item]}
                            type={chartOptions.chart.type}
                            height={height}
                        />
                    </div>
                );
            })}
        </div>
    );
}
