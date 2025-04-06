
import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpgradeFeature {
  text: string;
}

interface UpgradePromotionCardProps {
  title: string;
  description: string;
  features: UpgradeFeature[];
  buttonText: string;
  onButtonClick: () => void;
}

const UpgradePromotionCard = ({ 
  title, 
  description, 
  features, 
  buttonText, 
  onButtonClick 
}: UpgradePromotionCardProps) => {
  return (
    <div className="bg-gradient-to-r from-foodz-500 to-foodz-600 rounded-xl shadow-md overflow-hidden">
      <div className="p-6 sm:p-8 md:max-w-2xl">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">{title}</h2>
        <p className="text-white/90 mb-6">{description}</p>
        
        <div className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <Check className="h-5 w-5 text-white mr-3 flex-shrink-0" />
              <p className="text-white">{feature.text}</p>
            </div>
          ))}
        </div>
        
        <Button 
          className="bg-white text-foodz-600 hover:bg-gray-100 hover:text-foodz-700"
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default UpgradePromotionCard;
