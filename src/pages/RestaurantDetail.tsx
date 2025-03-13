
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useFirebaseAuth } from "@/context/FirebaseAuthContext";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import RestaurantHeader from "@/components/restaurant/RestaurantHeader";
import MenuCategories from "@/components/restaurant/MenuCategories";
import MenuList from "@/components/restaurant/MenuList";
import CartSidebar from "@/components/restaurant/CartSidebar";
import { MenuItemType } from "@/components/restaurant/MenuItem";

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

interface CartItem extends MenuItemType {
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
  } = useFirestoreCollection<{ id: string; name: string }>({
    collectionName: "categories",
    parentDoc: restaurantId ? { collection: "restaurants", id: restaurantId } : undefined
  });
  
  // Fetch menu items
  const {
    data: menuItems,
    isLoading: menuItemsLoading
  } = useFirestoreCollection<MenuItemType>({
    collectionName: "menuItems",
    parentDoc: restaurantId ? { collection: "restaurants", id: restaurantId } : undefined
  });
  
  // Add item to cart
  const addToCart = (item: MenuItemType) => {
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
        timestamp: Date.now(),
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
            <button onClick={() => navigate("/restaurants")}>
              Go Back to Restaurants
            </button>
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
          <RestaurantHeader 
            restaurant={restaurant}
            cartItemsCount={cart.length}
            todayHours={todayHours}
            onOpenCart={() => setIsCartOpen(true)}
          />
          
          {/* Menu */}
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4 order-1 lg:order-none">
              <MenuCategories 
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>
            
            <div className="lg:w-3/4">
              <MenuList 
                items={menuItems}
                activeCategory={activeCategory}
                onAddToCart={addToCart}
              />
            </div>
          </div>
        </div>
      </main>
      
      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateCartItemQuantity}
        onRemoveItem={removeFromCart}
        onSubmitOrder={handleSubmitOrder}
        isSubmittingOrder={isSubmittingOrder}
        customerNotes={customerNotes}
        onCustomerNotesChange={setCustomerNotes}
        cartTotal={calculateCartTotal()}
      />
      
      <Footer />
    </div>
  );
};

export default RestaurantDetail;
