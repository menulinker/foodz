
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Search, Utensils, Star, Filter, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui-custom/Button";
import { useFirebaseAuth } from "@/context/FirebaseAuthContext";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  address: string;
  imageUrl?: string;
  rating?: number;
  openingHours?: {
    [day: string]: string;
  };
}

const RestaurantList = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useFirebaseAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState<string | null>(null);
  const [cuisines, setCuisines] = useState<string[]>([]);

  // Fetch restaurant data
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        // Get restaurants directly from the restaurants collection
        const restaurantsRef = collection(db, "restaurants");
        const q = query(restaurantsRef);
        const querySnapshot = await getDocs(q);
        
        const restaurantData: Restaurant[] = [];
        const uniqueCuisines = new Set<string>();
        
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Restaurant;
          
          // Make sure we only include restaurants with names
          if (data.name) {
            const restaurant = {
              id: doc.id,
              name: data.name,
              description: data.description || "",
              cuisine: data.cuisine || "",
              address: data.address || "",
              imageUrl: data.imageUrl || "",
              rating: data.rating || 4.5,
              openingHours: data.openingHours || {}
            };
            
            restaurantData.push(restaurant);
            
            // Track unique cuisines for filtering
            if (data.cuisine) {
              uniqueCuisines.add(data.cuisine);
            }
          }
        });
        
        setRestaurants(restaurantData);
        setFilteredRestaurants(restaurantData);
        setCuisines(Array.from(uniqueCuisines));
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        toast.error("Failed to load restaurants");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRestaurants();
  }, []);
  
  // Filter restaurants when search or cuisine filter changes
  useEffect(() => {
    let results = restaurants;
    
    // Apply search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      results = results.filter((restaurant) => 
        restaurant.name.toLowerCase().includes(lowerQuery) || 
        restaurant.description.toLowerCase().includes(lowerQuery) ||
        restaurant.cuisine.toLowerCase().includes(lowerQuery) ||
        restaurant.address.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Apply cuisine filter
    if (cuisineFilter) {
      results = results.filter((restaurant) => 
        restaurant.cuisine === cuisineFilter
      );
    }
    
    setFilteredRestaurants(results);
  }, [searchQuery, cuisineFilter, restaurants]);
  
  // Handle cuisine filter toggle
  const toggleCuisineFilter = (cuisine: string) => {
    if (cuisineFilter === cuisine) {
      setCuisineFilter(null);
    } else {
      setCuisineFilter(cuisine);
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setCuisineFilter(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foodz-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading restaurants...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Restaurants</h1>
          <p className="text-muted-foreground mb-8">Find and order from restaurants near you</p>
          
          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <input
                  type="text"
                  placeholder="Search restaurants, cuisines..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              
              <div className="md:w-auto">
                <Button variant="outline" className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
            
            {/* Cuisine filters */}
            {cuisines.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {cuisines.map((cuisine) => (
                    <Button 
                      key={cuisine}
                      variant={cuisineFilter === cuisine ? "primary" : "outline"}
                      size="sm"
                      onClick={() => toggleCuisineFilter(cuisine)}
                    >
                      {cuisine}
                    </Button>
                  ))}
                  
                  {(searchQuery || cuisineFilter) && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={clearFilters}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Restaurant List */}
          {filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <div 
                  key={restaurant.id} 
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                >
                  <div className="h-48 bg-gray-200 relative">
                    {restaurant.imageUrl ? (
                      <img 
                        src={restaurant.imageUrl} 
                        alt={restaurant.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Utensils className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <div className="flex justify-between mb-2">
                      <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                      
                      <div className="flex items-center bg-amber-50 px-2 py-1 rounded text-amber-600">
                        <Star className="h-4 w-4 mr-1 fill-amber-500 text-amber-500" />
                        <span className="text-sm font-medium">{restaurant.rating?.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    {restaurant.cuisine && (
                      <p className="text-foodz-600 text-sm mb-2">{restaurant.cuisine}</p>
                    )}
                    
                    {restaurant.address && (
                      <div className="flex items-start text-sm text-muted-foreground mb-3">
                        <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                        <span>{restaurant.address}</span>
                      </div>
                    )}
                    
                    <Button variant="outline" className="w-full mt-2">
                      View Menu
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <p className="text-muted-foreground mb-4">No restaurants found matching your search criteria</p>
              <Button 
                variant="outline" 
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RestaurantList;
