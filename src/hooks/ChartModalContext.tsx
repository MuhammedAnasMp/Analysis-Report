import React, {
  createContext,
  useContext,
  useState,
} from "react";
import ChartModal from "./ChartModal";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/app/rootReducer";
import { capitalizeEachWord } from "../layouts/Navbar";

interface ChartModalContextType {
  openChartModal: (options: any, serasdies: ApexAxisChartSeries , heading : any) => void;
  closeChartModal: () => void;
}

const ChartModalContext = createContext<ChartModalContextType | undefined>(
  undefined
);

export const useChartModal = (): ChartModalContextType => {
  const context = useContext(ChartModalContext);
  if (!context) {
    throw new Error("useChartModal must be used within ChartModalProvider");
  }
  return context;
};

interface ChartModalProviderProps {
  children: any;
}

export const ChartModalProvider: React.FC<ChartModalProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [options, setOptions] = useState<any | null>(null);
  const [heading, setHeading] = useState<string>("");
  const [series, setSeries] = useState<ApexAxisChartSeries | null>(null);

  const openChartModal = (
    chartOptions: any,
    chartSeries: ApexAxisChartSeries,
    heading :string 
  ) => {
    setOptions(chartOptions);
    setSeries(chartSeries);
    setHeading(heading);
    setIsOpen(true);
  };

  const closeChartModal = () => {
    setIsOpen(false);
    setOptions(null);
    setHeading('')
    setSeries(null);
  };
    const { selectedStore} = useSelector((state: RootState) => state.store);
  return (
    <ChartModalContext.Provider value={{ openChartModal, closeChartModal }}>
      {children}

      {isOpen && options && series && (
        <ChartModal
          options={options}
          series={series}
          heading ={`${heading}  ${capitalizeEachWord(selectedStore?.LOCATION_NAME || '')}`}
          onClose={closeChartModal}
        />
      )}
    </ChartModalContext.Provider>
  );
};
