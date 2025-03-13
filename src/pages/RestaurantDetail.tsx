
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Phone, Globe, Clock, Plus, Minus, ShoppingBag, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useFirebaseAuth } from "@/context/FirebaseAuthContext";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  address: string;
  phone: string;
  website: string;
  rating?: number;
  openingHours?: {
    [day: string]: string;
  };
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image?: string;
}

interface Category {
  id: string;
  name: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const RestaurantDetail = () => {
  const { id: restaurantId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useFirebaseAuth();
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [todayHours, setTodayHours] = useState<string>("Closed");
  
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerNotes, setCustomerNotes] = useState("");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  
  // Category filter
  const [activeCategory, setActiveCategory] = useState<string>("All");
  
  // Fetch restaurant data
  useEffect(() => {
    if (!restaurantId) return;
    
    const fetchRestaurantData = async () => {
      try {
        const restaurantRef = doc(db, "restaurants", restaurantId);
        const docSnapshot = await getDoc(restaurantRef);
        
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as Omit<Restaurant, 'id'>;
          setRestaurant({
            id: docSnapshot.id,
            ...data
          });
          
          // Set today's hours
          const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
          const today = days[new Date().getDay()];
          setTodayHours(data.openingHours?.[today] || "Closed");
        } else {
          toast.error("Restaurant not found");
          navigate("/restaurants");
        }
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
        toast.error("Failed to load restaurant data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRestaurantData();
  }, [restaurantId, navigate]);
  
  // Make sure user is authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);
  
  // Fetch categories
  const {
    data: categories,
    isLoading: categoriesLoading
  } = useFirestoreCollection<Category>({
    collectionName: "categories",
    parentDoc: restaurantId ? { collection: "restaurants", id: restaurantId } : undefined
  });
  
  // Fetch menu items
  const {
    data: menuItems,
    isLoading: menuItemsLoading
  } = useFirestoreCollection<MenuItem>({
    collectionName: "menuItems",
    parentDoc: restaurantId ? { collection: "restaurants", id: restaurantId } : undefined
  });
  
  // Filter menu items by category
  const filteredItems = activeCategory === "All" 
    ? menuItems?.filter(item => item.available) 
    : menuItems?.filter(item => item.category === activeCategory && item.available);
  
  // Add item to cart
  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Item already in cart, increment quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      } else {
        // Add new item to cart
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
    
    toast.success(`Added ${item.name} to cart`);
  };
  
  // Update item quantity in cart
  const updateCartItemQuantity = (itemId: string, change: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === itemId) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };
  
  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };
  
  // Calculate cart total
  const calculateCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  // Submit order
  const handleSubmitOrder = async () => {
    if (!user || !restaurantId) return;
    
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    setIsSubmittingOrder(true);
    
    try {
      // Create order in restaurant's orders collection
      const orderData = {
        customer: {
          id: user.uid,
          name: user.displayName || "Customer"
        },
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: calculateCartTotal(),
        status: "pending",
        timestamp: serverTimestamp(),
        notes: customerNotes || undefined
      };
      
      // Add to restaurant's orders collection
      const restaurantOrdersRef = collection(db, "restaurants", restaurantId, "orders");
      const restaurantOrderDoc = await addDoc(restaurantOrdersRef, orderData);
      
      // Also add to client's orders collection
      const clientOrdersRef = collection(db, "users", user.uid, "orders");
      await addDoc(clientOrdersRef, {
        ...orderData,
        orderId: restaurantOrderDoc.id,
        restaurant: {
          id: restaurantId,
          name: restaurant?.name || "Restaurant"
        }
      });
      
      // Clear cart
      setCart([]);
      setCustomerNotes("");
      setIsCartOpen(false);
      
      toast.success("Order placed successfully", {
        description: "You can track your order in your profile"
      });
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Failed to place order");
    } finally {
      setIsSubmittingOrder(false);
    }
  };
  
  // Loading state
  if (isLoading || categoriesLoading || menuItemsLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foodz-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading restaurant...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!restaurant) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl font-medium mb-4">Restaurant not found</p>
            <Button onClick={() => navigate("/restaurants")}>
              Go Back to Restaurants
            </Button>
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
          <div className="mb-6">
            <Link 
              to="/restaurants" 
              className="inline-flex items-center text-sm font-medium text-foodz-600 hover:text-foodz-700 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Restaurants
            </Link>
          </div>
          
          {/* Restaurant Header */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="h-48 md:h-64 bg-gray-200 relative">
              {/* Restaurant hero image would go here */}
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
                    onClick={() => setIsCartOpen(true)}
                    disabled={cart.length === 0}
                  >
                    <ShoppingBag className="mr-2" />
                    View Cart 
                    {cart.length > 0 && (
                      <span className="ml-2 bg-white text-foodz-600 px-2 py-0.5 rounded-full text-sm font-medium">
                        {cart.length}
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Menu */}
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4 order-1 lg:order-none">
              <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
                <h2 className="text-lg font-semibold mb-4">Menu Categories</h2>
                
                <div className="space-y-2">
                  <button
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeCategory === "All" 
                        ? "bg-foodz-100 text-foodz-800 font-medium" 
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveCategory("All")}
                  >
                    All Items
                  </button>
                  
                  {categories?.map((category) => (
                    <button
                      key={category.id}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        activeCategory === category.name 
                          ? "bg-foodz-100 text-foodz-800 font-medium" 
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => setActiveCategory(category.name)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:w-3/4">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">
                    {activeCategory === "All" ? "All Menu Items" : activeCategory}
                  </h2>
                </div>
                
                <div className="p-6">
                  {filteredItems && filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredItems.map((item) => (
                        <Card key={item.id} className="overflow-hidden border-gray-100">
                          {item.image && (
                            <div className="h-40 overflow-hidden">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          
                          <CardHeader className="p-4 pb-0">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">{item.name}</CardTitle>
                              <span className="font-medium text-foodz-600">${item.price.toFixed(2)}</span>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="p-4 pt-2">
                            {item.description && (
                              <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                            )}
                          </CardContent>
                          
                          <CardFooter className="p-4 pt-0">
                            <Button 
                              variant="default" 
                              size="sm"
                              className="w-full"
                              onClick={() => addToCart(item)}
                            >
                              <Plus className="mr-1" />
                              Add to Cart
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No items available in this category</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Order</h2>
              <button 
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => setIsCartOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-6">
              {cart.length > 0 ? (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between border-b pb-4">
                      <div className="flex-grow pr-4">
                        <div className="flex justify-between mb-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                        
                        <div className="flex items-center mt-2">
                          <button 
                            className="p-1 rounded-full border border-gray-200 hover:bg-gray-100"
                            onClick={() => updateCartItemQuantity(item.id, -1)}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="mx-3 font-medium">{item.quantity}</span>
                          <button 
                            className="p-1 rounded-full border border-gray-200 hover:bg-gray-100"
                            onClick={() => updateCartItemQuantity(item.id, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                          
                          <button 
                            className="ml-auto text-red-500 hover:text-red-700"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setIsCartOpen(false)}
                  >
                    Add Items
                  </Button>
                </div>
              )}
              
              {cart.length > 0 && (
                <div className="mt-6">
                  <label htmlFor="notes" className="block text-sm font-medium mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                    placeholder="Special instructions, allergies, etc."
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                  />
                </div>
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="p-6 border-t">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Subtotal</span>
                  <span>${calculateCartTotal().toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between mb-4">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-semibold">${calculateCartTotal().toFixed(2)}</span>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={handleSubmitOrder}
                  isLoading={isSubmittingOrder}
                >
                  <ShoppingBag className="mr-2" />
                  Order Now
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default RestaurantDetail;
