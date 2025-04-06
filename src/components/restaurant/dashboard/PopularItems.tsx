
import React from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PopularItem {
  name: string;
  count: number;
}

interface PopularItemsProps {
  items: PopularItem[];
}

const PopularItems = ({ items }: PopularItemsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center">
          <BarChart3 className="h-5 w-5 text-foodz-500 mr-2" />
          <h2 className="text-xl font-semibold">Popular Items</h2>
        </div>
      </div>
      
      <div className="p-6 pb-3">
        {items.length > 0 ? (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-foodz-100 flex items-center justify-center mr-3">
                  <span className="text-sm font-bold text-foodz-600">{index + 1}</span>
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                  <p className="text-xs text-gray-500">{item.count} orders</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No data available</p>
          </div>
        )}
      </div>
      
      <div className="px-6 py-3 border-t border-gray-100">
        <Button 
          variant="link" 
          className="p-0 h-auto text-foodz-600 hover:text-foodz-500 transition-colors w-full justify-start text-sm"
          onClick={() => navigate("/restaurant/menu")}
        >
          Manage Menu
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default PopularItems;
