
import React from "react";
import { ArrowUp, ArrowDown, LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change: number;
  period: string;
  iconBgColor: string;
  iconColor: string;
}

const StatsCard = ({ title, value, icon, change, period, iconBgColor, iconColor }: StatsCardProps) => {
  const isPositive = change >= 0;
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl md:text-3xl font-bold mt-1 text-gray-900">{value}</h3>
        </div>
        <div className={`${iconBgColor} p-3 rounded-full`}>
          {icon}
        </div>
      </div>
      <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? (
          <ArrowUp className="h-4 w-4 mr-1 flex-shrink-0" />
        ) : (
          <ArrowDown className="h-4 w-4 mr-1 flex-shrink-0" />
        )}
        <span className="text-sm font-medium">{Math.abs(change)}% from last {period}</span>
      </div>
    </div>
  );
};

export default StatsCard;
