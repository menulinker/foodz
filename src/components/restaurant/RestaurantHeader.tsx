
import { Link } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Phone, Globe, Clock, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Restaurant {
  id: string;
  name: string;
  description?: string;
  cuisine?: string;
  address?: string;
  phone?: string;
  website?: string;
  imageUrl?: string;
  rating?: number;
  openingHours?: {
    [day: string]: string;
  };
}

interface RestaurantHeaderProps {
  restaurant: Restaurant;
  cartItemsCount: number;
  todayHours: string;
  onOpenCart: () => void;
}

const RestaurantHeader = ({ restaurant, cartItemsCount, todayHours, onOpenCart }: RestaurantHeaderProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
      <div className="h-48 md:h-64 bg-gray-200 relative">
        {restaurant.imageUrl ? (
          <img 
            src={restaurant.imageUrl} 
            alt={restaurant.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center mb-2">
              <h1 className="text-2xl md:text-3xl font-bold mr-3">{restaurant.name}</h1>
              {restaurant.rating && (
                <div className="flex items-center bg-amber-50 px-2 py-1 rounded text-amber-600">
                  <Star className="h-4 w-4 mr-1 fill-amber-500 text-amber-500" />
                  <span className="text-sm font-medium">{restaurant.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            
            {restaurant.cuisine && (
              <p className="text-foodz-600 mb-4">{restaurant.cuisine}</p>
            )}
            
            {restaurant.description && (
              <p className="text-muted-foreground mb-4">{restaurant.description}</p>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {restaurant.address && (
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 mt-0.5 text-foodz-600 flex-shrink-0" />
                  <span>{restaurant.address}</span>
                </div>
              )}
              
              {restaurant.phone && (
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-2 mt-0.5 text-foodz-600 flex-shrink-0" />
                  <span>{restaurant.phone}</span>
                </div>
              )}
              
              {restaurant.website && (
                <div className="flex items-start">
                  <Globe className="h-5 w-5 mr-2 mt-0.5 text-foodz-600 flex-shrink-0" />
                  <a 
                    href={restaurant.website.startsWith('http') ? restaurant.website : `https://${restaurant.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-foodz-600 hover:underline"
                  >
                    Website
                  </a>
                </div>
              )}
              
              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-2 mt-0.5 text-foodz-600 flex-shrink-0" />
                <div>
                  <span className="block text-sm">Hours today</span>
                  <span className="font-medium">{todayHours}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button 
              className="flex items-center"
              onClick={onOpenCart}
              disabled={cartItemsCount === 0}
            >
              <ShoppingBag className="mr-2" />
              View Cart 
              {cartItemsCount > 0 && (
                <span className="ml-2 bg-white text-foodz-600 px-2 py-0.5 rounded-full text-sm font-medium">
                  {cartItemsCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantHeader;
