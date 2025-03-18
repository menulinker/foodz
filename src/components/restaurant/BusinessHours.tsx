
import React from "react";

interface BusinessHoursProps {
  openingHours: {
    [day: string]: string;
  };
  onHoursChange: (day: string, value: string) => void;
}

const BusinessHours = ({ openingHours, onHoursChange }: BusinessHoursProps) => {
  return (
    <div className="p-6 border-t">
      <h2 className="text-xl font-semibold mb-6">Business Hours</h2>
      
      <div className="space-y-4">
        {Object.entries(openingHours).map(([day, hours]) => (
          <div key={day} className="flex items-center">
            <span className="w-28 font-medium capitalize">{day}</span>
            <input
              type="text"
              value={hours}
              onChange={(e) => onHoursChange(day, e.target.value)}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
              placeholder="e.g. 9:00 AM - 5:00 PM or Closed"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessHours;
