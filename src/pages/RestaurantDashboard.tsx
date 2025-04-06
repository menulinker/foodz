
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  AlertTriangle, ArrowRight, ArrowUp, ArrowDown, 
  BarChart3, Calendar, Check, Clock, Clipboard, 
  CreditCard, Menu, Settings, ShoppingBag, Store, 
  Utensils, Users, Wallet, ChevronRight
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui-custom/Button";
import { useFirebaseAuth } from "@/context/FirebaseAuthContext";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRealTimeOrders } from "@/hooks/useRealTimeOrders";
import { useRestaurantData } from "@/hooks/useRestaurantData";

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
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foodz-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
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

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Period selector
  const PeriodSelector = () => (
    <div className="inline-flex p-1 bg-gray-100 rounded-lg">
      {(["today", "week", "month", "year"] as const).map((period) => (
        <button
          key={period}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            selectedPeriod === period 
              ? "bg-white text-gray-800 shadow-sm" 
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setSelectedPeriod(period)}
        >
          {period.charAt(0).toUpperCase() + period.slice(1)}
        </button>
      ))}
    </div>
  );

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
                <PeriodSelector />
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
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                    <h3 className="text-2xl md:text-3xl font-bold mt-1 text-gray-900">{formatCurrency(restaurantData.revenue)}</h3>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Wallet className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center text-green-600">
                  <ArrowUp className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="text-sm font-medium">12% from last {selectedPeriod}</span>
                </div>
              </div>
              
              {/* Orders Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Orders</p>
                    <h3 className="text-2xl md:text-3xl font-bold mt-1 text-gray-900">{restaurantData.ordersCount}</h3>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <ShoppingBag className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center text-green-600">
                  <ArrowUp className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="text-sm font-medium">10% from last {selectedPeriod}</span>
                </div>
              </div>
              
              {/* Customers Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Customers</p>
                    <h3 className="text-2xl md:text-3xl font-bold mt-1 text-gray-900">{restaurantData.customersCount}</h3>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="flex items-center text-green-600">
                  <ArrowUp className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="text-sm font-medium">5% from last {selectedPeriod}</span>
                </div>
              </div>
              
              {/* Menu Items Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Menu Items</p>
                    <h3 className="text-2xl md:text-3xl font-bold mt-1 text-gray-900">{menuItems?.length || 0}</h3>
                  </div>
                  <div className="bg-amber-100 p-3 rounded-full">
                    <Menu className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                
                {outOfStockCount > 0 ? (
                  <div className="flex items-center text-amber-600">
                    <AlertTriangle className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="text-sm font-medium">{outOfStockCount} items out of stock</span>
                  </div>
                ) : (
                  <div className="flex items-center text-green-600">
                    <Check className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="text-sm font-medium">All items in stock</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center">
                  <ShoppingBag className="h-5 w-5 text-foodz-500 mr-2" />
                  <h2 className="text-xl font-semibold">Recent Orders</h2>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate("/restaurant/orders")}>
                  View All
                </Button>
              </div>
              
              <div className="p-6">
                {recentOrders && recentOrders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-sm text-gray-500 border-b">
                          <th className="pb-3 font-medium">Order ID</th>
                          <th className="pb-3 font-medium">Customer</th>
                          <th className="pb-3 font-medium">Date</th>
                          <th className="pb-3 font-medium">Amount</th>
                          <th className="pb-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.slice(0, 5).map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 text-sm font-medium text-gray-900">#{order.id.slice(0, 6)}</td>
                            <td className="py-3 text-sm text-gray-600">{order.customer.name}</td>
                            <td className="py-3 text-sm text-gray-600">{formatDate(order.timestamp)}</td>
                            <td className="py-3 text-sm font-medium text-gray-900">{formatCurrency(order.total)}</td>
                            <td className="py-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                  order.status === 'active' ? 'bg-blue-100 text-blue-800' :
                                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-red-100 text-red-800'
                                }
                              `}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No recent orders found</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => navigate("/restaurant/orders")}
                    >
                      Go to Orders
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Popular Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-foodz-500 mr-2" />
                  <h2 className="text-xl font-semibold">Popular Items</h2>
                </div>
              </div>
              
              <div className="p-6 pb-3">
                {restaurantData.popularItems.length > 0 ? (
                  <div className="space-y-4">
                    {restaurantData.popularItems.map((item, index) => (
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
          </div>
          
          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="bg-foodz-100 p-3 rounded-full mr-3">
                  <Utensils className="h-6 w-6 text-foodz-600" />
                </div>
                <h3 className="text-lg font-semibold">Menu Management</h3>
              </div>
              <p className="text-muted-foreground mb-4">Create, edit, and manage your restaurant's menu items and categories.</p>
              <Button 
                className="w-full justify-between group"
                onClick={() => navigate("/restaurant/menu")}
              >
                <span>Manage Menu</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="bg-foodz-100 p-3 rounded-full mr-3">
                  <ShoppingBag className="h-6 w-6 text-foodz-600" />
                </div>
                <h3 className="text-lg font-semibold">Order Management</h3>
              </div>
              <p className="text-muted-foreground mb-4">View and manage incoming orders from customers.</p>
              <Button 
                className="w-full justify-between group"
                onClick={() => navigate("/restaurant/orders")}
              >
                <span>View Orders</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="bg-foodz-100 p-3 rounded-full mr-3">
                  <Settings className="h-6 w-6 text-foodz-600" />
                </div>
                <h3 className="text-lg font-semibold">Restaurant Settings</h3>
              </div>
              <p className="text-muted-foreground mb-4">Update your restaurant profile, business hours, and other settings.</p>
              <Button 
                className="w-full justify-between group"
                onClick={() => navigate("/restaurant/settings")}
              >
                <span>Edit Settings</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="bg-foodz-100 p-3 rounded-full mr-3">
                  <CreditCard className="h-6 w-6 text-foodz-600" />
                </div>
                <h3 className="text-lg font-semibold">Payments</h3>
              </div>
              <p className="text-muted-foreground mb-4">Manage your payment methods and view transaction history.</p>
              <Button 
                className="w-full justify-between group"
                variant="outline"
                onClick={() => navigate("/restaurant/settings")}
              >
                <span>View Payments</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
          
          {/* Upcoming Features */}
          <div className="bg-gradient-to-r from-foodz-500 to-foodz-600 rounded-xl shadow-md overflow-hidden">
            <div className="p-6 sm:p-8 md:max-w-2xl">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Upgrade to Pro</h2>
              <p className="text-white/90 mb-6">Get access to advanced analytics, marketing tools, and priority support.</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-white mr-3 flex-shrink-0" />
                  <p className="text-white">Detailed sales and customer analytics</p>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-white mr-3 flex-shrink-0" />
                  <p className="text-white">Custom branding for your menu</p>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-white mr-3 flex-shrink-0" />
                  <p className="text-white">Loyalty program tools</p>
                </div>
              </div>
              
              <Button 
                className="bg-white text-foodz-600 hover:bg-gray-100 hover:text-foodz-700"
                onClick={() => {}}
              >
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RestaurantDashboard;
