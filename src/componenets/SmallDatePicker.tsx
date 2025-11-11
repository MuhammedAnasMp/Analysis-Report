import React, { useEffect, useState } from "react";
import { SelectPicker } from "rsuite";

interface SmallDatePickerProps {
  value?: Date | string | null;
  onDateChange?: (date: Date | null) => void;
}

interface YearDate {
  YYYYMM: string;
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const SmallDatePicker: React.FC<SmallDatePickerProps> = ({ value, onDateChange }) => {
  const [yearDate, setYearDate] = useState<YearDate[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/year-date-periods")
      .then((res) => res.json())
      .then((data) => setYearDate(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  const options = yearDate.map((p) => {
    const year = parseInt(p.YYYYMM.slice(0, 4), 10);
    const month = parseInt(p.YYYYMM.slice(4, 6), 10) - 1;
    return {
      label: `${monthNames[month]} ${year}`,
      value: p.YYYYMM, // string value
    };
  });

  // 🔹 Normalize Redux date (ISO string or Date) → "YYYYMM"
  const normalizeToYYYYMM = (input: Date | string | null | undefined) => {
    if (!input) return null;
    const d = input instanceof Date ? input : new Date(input);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    return `${year}${month}`;
  };

  const selectedValue = normalizeToYYYYMM(value);

  return (
    <SelectPicker
      data={options}
      searchable={true}
      cleanable={false}
      labelKey="label"
      valueKey="value"
      style={{ width: 200 }}
      placeholder="Select Month"
      value={selectedValue || undefined}
      onChange={(val) => {
        if (!val) return onDateChange?.(null);
        const year = parseInt(val.slice(0, 4), 10);
        const month = parseInt(val.slice(4, 6), 10) - 1;
        onDateChange?.(new Date(year, month));
      }}
    />
  );
};

export default SmallDatePicker;
