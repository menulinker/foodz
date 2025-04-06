
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  AlertTriangle, Settings, ShoppingBag, 
  Wallet, Users, Menu, Utensils, CreditCard,
  Check
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useFirebaseAuth } from "@/context/FirebaseAuthContext";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRealTimeOrders } from "@/hooks/useRealTimeOrders";

// Import Dashboard Components
import StatsCard from "@/components/restaurant/dashboard/StatsCard";
import RecentOrders from "@/components/restaurant/dashboard/RecentOrders";
import PopularItems from "@/components/restaurant/dashboard/PopularItems";
import QuickAction from "@/components/restaurant/dashboard/QuickAction";
import PeriodSelector from "@/components/restaurant/dashboard/PeriodSelector";
import UpgradePromotionCard from "@/components/restaurant/dashboard/UpgradePromotionCard";
import LoadingDashboard from "@/components/restaurant/dashboard/LoadingDashboard";

// Type definitions
interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  available: boolean;
}

interface Order {
  id: string;
  customer: {
    id: string;
    name: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: "pending" | "active" | "completed" | "cancelled";
  timestamp: number;
}

const RestaurantDashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useFirebaseAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<"today" | "week" | "month" | "year">("week");
  const [restaurantData, setRestaurantData] = useState<{
    name: string;
    ordersCount: number;
    customersCount: number;
    revenue: number;
    popularItems: { name: string; count: number }[];
  }>({
    name: "",
    ordersCount: 0,
    customersCount: 0,
    revenue: 0,
    popularItems: []
  });
  
  // Fetch menu items from Firestore
  const { 
    data: menuItems,
    isLoading: menuItemsLoading
  } = useFirestoreCollection<MenuItem>({
    collectionName: "menuItems",
    parentDoc: user?.uid ? { collection: "restaurants", id: user.uid } : undefined
  });

  // Fetch real-time orders
  const { 
    orders: recentOrders,
    isLoading: ordersLoading
  } = useRealTimeOrders({
    restaurantId: user?.uid,
    type: 'restaurant'
  });

  // Redirect if not authenticated as restaurant
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    
    if (!authLoading && user && user.role !== "restaurant") {
      navigate("/");
      return;
    }
    
    document.title = "Restaurant Dashboard | Foodz";
  }, [user, authLoading, navigate]);

  // Fetch restaurant data
  useEffect(() => {
    const fetchRestaurantData = async () => {
      if (!user?.uid) return;
      
      try {
        // Get all orders to calculate statistics
        const ordersRef = collection(db, "restaurants", user.uid, "orders");
        const ordersSnapshot = await getDocs(ordersRef);
        
        // Calculate revenue and count
        let totalRevenue = 0;
        const customerIds = new Set<string>();
        const itemCounts: Record<string, number> = {};
        
        ordersSnapshot.forEach(doc => {
          const orderData = doc.data() as Order;
          totalRevenue += orderData.total;
          
          // Add customer ID to set for unique customer count
          if (orderData.customer?.id) {
            customerIds.add(orderData.customer.id);
          }
          
          // Count popular items
          orderData.items.forEach(item => {
            if (itemCounts[item.name]) {
              itemCounts[item.name] += item.quantity;
            } else {
              itemCounts[item.name] = item.quantity;
            }
          });
        });
        
        // Sort items by popularity
        const popularItems = Object.entries(itemCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        
        setRestaurantData({
          name: user.displayName || "Restaurant",
          ordersCount: ordersSnapshot.size,
          customersCount: customerIds.size,
          revenue: totalRevenue,
          popularItems
        });
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      }
    };
    
    if (user?.uid) {
      fetchRestaurantData();
    }
  }, [user]);

  // Loading state
  if (authLoading || menuItemsLoading || ordersLoading) {
    return <LoadingDashboard />;
  }

  // Calculate the number of menu items out of stock
  const outOfStockCount = menuItems?.filter(item => !item.available).length || 0;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back, {user?.displayName}!</h1>
                <p className="text-muted-foreground mt-1">Here's an overview of your restaurant's performance</p>
              </div>
              <div className="flex items-center gap-3">
                <PeriodSelector 
                  selectedPeriod={selectedPeriod} 
                  setSelectedPeriod={setSelectedPeriod}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={() => navigate("/restaurant/settings")}
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Settings</span>
                </Button>
              </div>
            </div>
            
            {/* Stats cards with shadow and upgraded design */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Revenue Card */}
              <StatsCard
                title="Total Revenue"
                value={formatCurrency(restaurantData.revenue)}
                icon={<Wallet className="h-6 w-6 text-green-600" />}
                change={12}
                period={selectedPeriod}
                iconBgColor="bg-green-100"
                iconColor="text-green-600"
              />
              
              {/* Orders Card */}
              <StatsCard
                title="Total Orders"
                value={restaurantData.ordersCount}
                icon={<ShoppingBag className="h-6 w-6 text-blue-600" />}
                change={10}
                period={selectedPeriod}
                iconBgColor="bg-blue-100"
                iconColor="text-blue-600"
              />
              
              {/* Customers Card */}
              <StatsCard
                title="Total Customers"
                value={restaurantData.customersCount}
                icon={<Users className="h-6 w-6 text-purple-600" />}
                change={5}
                period={selectedPeriod}
                iconBgColor="bg-purple-100"
                iconColor="text-purple-600"
              />
              
              {/* Menu Items Card */}
              <StatsCard
                title="Menu Items"
                value={menuItems?.length || 0}
                icon={<Menu className="h-6 w-6 text-amber-600" />}
                change={0}
                period={selectedPeriod}
                iconBgColor="bg-amber-100"
                iconColor="text-amber-600"
                // Note: This component is customized elsewhere for the menu items warnings
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Orders */}
            <RecentOrders orders={recentOrders} isLoading={ordersLoading} />
            
            {/* Popular Items */}
            <PopularItems items={restaurantData.popularItems} />
          </div>
          
          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <QuickAction
              title="Menu Management"
              description="Create, edit, and manage your restaurant's menu items and categories."
              icon={<Utensils className="h-6 w-6 text-foodz-600" />}
              buttonText="Manage Menu"
              onClick={() => navigate("/restaurant/menu")}
            />
            
            <QuickAction
              title="Order Management"
              description="View and manage incoming orders from customers."
              icon={<ShoppingBag className="h-6 w-6 text-foodz-600" />}
              buttonText="View Orders"
              onClick={() => navigate("/restaurant/orders")}
            />
            
            <QuickAction
              title="Restaurant Settings"
              description="Update your restaurant profile, business hours, and other settings."
              icon={<Settings className="h-6 w-6 text-foodz-600" />}
              buttonText="Edit Settings"
              onClick={() => navigate("/restaurant/settings")}
            />
            
            <QuickAction
              title="Payments"
              description="Manage your payment methods and view transaction history."
              icon={<CreditCard className="h-6 w-6 text-foodz-600" />}
              buttonText="View Payments"
              onClick={() => navigate("/restaurant/settings")}
              variant="outline"
            />
          </div>
          
          {/* Upgrade to Pro */}
          <UpgradePromotionCard
            title="Upgrade to Pro"
            description="Get access to advanced analytics, marketing tools, and priority support."
            features={[
              { text: "Detailed sales and customer analytics" },
              { text: "Custom branding for your menu" },
              { text: "Loyalty program tools" }
            ]}
            buttonText="Upgrade Now"
            onButtonClick={() => {}}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RestaurantDashboard;
