
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, Phone, Clock, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui-custom/Button";
import { useFirebaseAuth } from "@/context/FirebaseAuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  cuisine: string;
  logo: string;
  settings: {
    showInDirectory: boolean;
    acceptOnlineOrders: boolean;
  };
}

const RestaurantList = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useFirebaseAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    
    document.title = "Restaurants | Tapla";
  }, [user, authLoading, navigate]);

  // Fetch restaurants from Firestore
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const q = query(
          collection(db, "restaurants"), 
          where("settings.showInDirectory", "==", true)
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedRestaurants: Restaurant[] = [];
        
        querySnapshot.forEach((doc) => {
          fetchedRestaurants.push({
            id: doc.id,
            ...doc.data() as Omit<Restaurant, 'id'>
          });
        });
        
        setRestaurants(fetchedRestaurants);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchRestaurants();
    }
  }, [user]);

  // Filter restaurants based on search query
  const filteredRestaurants = restaurants.filter(restaurant => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      restaurant.name.toLowerCase().includes(query) ||
      restaurant.description.toLowerCase().includes(query) ||
      restaurant.cuisine.toLowerCase().includes(query) ||
      restaurant.address.toLowerCase().includes(query)
    );
  });

  // Loading state
  if (authLoading || isLoading) {
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Restaurants</h1>
              <p className="text-muted-foreground mt-1">Find restaurants and place your order</p>
            </div>
            
            <div className="mt-4 md:mt-0 md:w-1/3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search restaurants, cuisine, location..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-foodz-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
          
          {/* Restaurant List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.length > 0 ? (
              filteredRestaurants.map(restaurant => (
                <div key={restaurant.id} className="bg-white rounded-xl shadow-sm overflow-hidden h-full flex flex-col">
                  {restaurant.logo ? (
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={restaurant.logo} 
                        alt={restaurant.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-40 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  
                  <div className="p-5 flex-grow">
                    <h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
                    
                    <div className="text-sm text-gray-500 mb-3">
                      <span className="inline-flex items-center">
                        {restaurant.cuisine}
                      </span>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {restaurant.description}
                    </p>
                    
                    {restaurant.address && (
                      <div className="flex items-start gap-2 mb-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                        <span className="text-gray-700">{restaurant.address}</span>
                      </div>
                    )}
                    
                    {restaurant.phone && (
                      <div className="flex items-center gap-2 mb-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">{restaurant.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5 pt-0 mt-auto">
                    <Button 
                      className="w-full" 
                      asChild
                      disabled={!restaurant.settings?.acceptOnlineOrders}
                    >
                      <Link to={`/restaurant/${restaurant.id}`}>
                        View Menu
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                    
                    {!restaurant.settings?.acceptOnlineOrders && (
                      <p className="text-center text-xs text-red-500 mt-2">
                        Online ordering not available
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white p-10 rounded-xl shadow-sm text-center">
                <p className="text-lg text-gray-500">No restaurants found</p>
                {searchQuery && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your search query
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RestaurantList;
