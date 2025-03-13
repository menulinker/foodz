
import { useState } from "react";
import { Button } from "@/components/ui-custom/Button";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface RestaurantInfoData {
  name: string;
  description: string;
  cuisine: string;
  address: string;
  phone: string;
  website: string;
}

interface RestaurantInfoFormProps {
  restaurantInfo: RestaurantInfoData;
  onInfoChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  isLoading: boolean;
}

const RestaurantInfoForm = ({ 
  restaurantInfo, 
  onInfoChange, 
  onSubmit, 
  onBack,
  isLoading 
}: RestaurantInfoFormProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <button 
          type="button" 
          onClick={onBack}
          className="text-foodz-600 hover:text-foodz-700 flex items-center text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>
      </div>
      
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold">Restaurant Information</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Tell us more about your restaurant
        </p>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label htmlFor="restaurant-name" className="block text-sm font-medium mb-2">
            Restaurant Name *
          </label>
          <Input
            id="restaurant-name"
            name="name"
            value={restaurantInfo.name}
            onChange={onInfoChange}
            placeholder="Name of your restaurant"
            required
          />
        </div>
        
        <div>
          <label htmlFor="cuisine" className="block text-sm font-medium mb-2">
            Cuisine Type *
          </label>
          <Input
            id="cuisine"
            name="cuisine"
            value={restaurantInfo.cuisine}
            onChange={onInfoChange}
            placeholder="e.g. Italian, Mexican, Indian"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description *
          </label>
          <Textarea
            id="description"
            name="description"
            value={restaurantInfo.description}
            onChange={onInfoChange}
            placeholder="Brief description of your restaurant"
            rows={3}
            required
          />
        </div>
        
        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-2">
            Address *
          </label>
          <Input
            id="address"
            name="address"
            value={restaurantInfo.address}
            onChange={onInfoChange}
            placeholder="Your restaurant's address"
            required
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            Phone *
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={restaurantInfo.phone}
            onChange={onInfoChange}
            placeholder="Contact phone number"
            required
          />
        </div>
        
        <div>
          <label htmlFor="website" className="block text-sm font-medium mb-2">
            Website (Optional)
          </label>
          <Input
            id="website"
            name="website"
            type="url"
            value={restaurantInfo.website}
            onChange={onInfoChange}
            placeholder="https://yourrestaurant.com"
          />
        </div>
        
        <Button
          type="submit"
          className="w-full mt-6"
          isLoading={isLoading}
        >
          Create Account
        </Button>
      </form>
    </div>
  );
};

export default RestaurantInfoForm;
