
import React from "react";

interface PeriodSelectorProps {
  selectedPeriod: "today" | "week" | "month" | "year";
  setSelectedPeriod: (period: "today" | "week" | "month" | "year") => void;
}

const PeriodSelector = ({ selectedPeriod, setSelectedPeriod }: PeriodSelectorProps) => {
  return (
    <div className="inline-flex p-1 bg-gray-100 rounded-lg">
      {(["today", "week", "month", "year"] as const).map((period) => (
        <button
          key={period}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            selectedPeriod === period 
              ? "bg-white text-gray-800 shadow-sm" 
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setSelectedPeriod(period)}
        >
          {period.charAt(0).toUpperCase() + period.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default PeriodSelector;
