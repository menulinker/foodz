
import React from "react";
import { ArrowRight, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  onClick: () => void;
  variant?: "default" | "outline";
}

const QuickAction = ({ 
  title, 
  description, 
  icon, 
  buttonText, 
  onClick, 
  variant = "default" 
}: QuickActionProps) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1">
      <div className="flex items-center mb-4">
        <div className="bg-foodz-100 p-3 rounded-full mr-3">
          {icon}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-muted-foreground mb-4">{description}</p>
      <Button 
        className="w-full justify-between group"
        variant={variant}
        onClick={onClick}
      >
        <span>{buttonText}</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </div>
  );
};

export default QuickAction;
