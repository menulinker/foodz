
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowUp, Menu, Store, Users, ShoppingBag, Utensils, Settings } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui-custom/Button";
import { useFirebaseAuth } from "@/context/FirebaseAuthContext";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  const [restaurantData, setRestaurantData] = useState<{
    name: string;
    ordersCount: number;
    customersCount: number;
    revenue: number;
  }>({
    name: "",
    ordersCount: 0,
    customersCount: 0,
    revenue: 0
  });
  
  // Fetch menu items from Firestore
  const { 
    data: menuItems,
    isLoading: menuItemsLoading
  } = useFirestoreCollection<MenuItem>({
    collectionName: "menuItems",
    parentDoc: user?.uid ? { collection: "restaurants", id: user.uid } : undefined
  });

  // Fetch recent orders from Firestore
  const { 
    data: recentOrders,
    isLoading: ordersLoading
  } = useFirestoreCollection<Order>({
    collectionName: "orders",
    parentDoc: user?.uid ? { collection: "restaurants", id: user.uid } : undefined,
    queries: [orderBy("timestamp", "desc"), limit(5)]
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
    
    document.title = "Restaurant Dashboard | Tapla";
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
        
        ordersSnapshot.forEach(doc => {
          const orderData = doc.data() as Order;
          totalRevenue += orderData.total;
          
          // Add customer ID to set for unique customer count
          if (orderData.customer?.id) {
            customerIds.add(orderData.customer.id);
          }
        });
        
        setRestaurantData({
          name: user.displayName || "Restaurant",
          ordersCount: ordersSnapshot.size,
          customersCount: customerIds.size,
          revenue: totalRevenue
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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Restaurant Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.displayName}!</p>
            </div>
            <div className="hidden sm:block">
              <Button onClick={() => navigate("/restaurant/menu")}>
                <Utensils className="mr-2 h-4 w-4" />
                Manage Menu
              </Button>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground">Total Orders</p>
                  <h3 className="text-3xl font-bold mt-2">{restaurantData.ordersCount}</h3>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-green-600">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">10% from last month</span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground">Total Customers</p>
                  <h3 className="text-3xl font-bold mt-2">{restaurantData.customersCount}</h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-green-600">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">5% from last month</span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground">Total Revenue</p>
                  <h3 className="text-3xl font-bold mt-2">{formatCurrency(restaurantData.revenue)}</h3>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Store className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-green-600">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">12% from last month</span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground">Menu Items</p>
                  <h3 className="text-3xl font-bold mt-2">{menuItems?.length || 0}</h3>
                </div>
                <div className="bg-amber-100 p-3 rounded-full">
                  <Menu className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              {outOfStockCount > 0 && (
                <div className="mt-4 flex items-center text-amber-600">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">{outOfStockCount} items out of stock</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Recent Orders</h2>
                <Button variant="outline" size="sm" onClick={() => navigate("/restaurant/orders")}>
                  View All
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              {recentOrders && recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-muted-foreground">
                        <th className="pb-4 font-medium">Order ID</th>
                        <th className="pb-4 font-medium">Customer</th>
                        <th className="pb-4 font-medium">Date</th>
                        <th className="pb-4 font-medium">Amount</th>
                        <th className="pb-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-t border-gray-100">
                          <td className="py-4">#{order.id.slice(0, 6)}</td>
                          <td className="py-4">{order.customer.name}</td>
                          <td className="py-4">{formatDate(order.timestamp)}</td>
                          <td className="py-4">{formatCurrency(order.total)}</td>
                          <td className="py-4">
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
          
          {/* Quick Access */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-foodz-100 p-2 rounded-full mr-3">
                  <Utensils className="h-5 w-5 text-foodz-600" />
                </div>
                <h3 className="text-lg font-semibold">Menu Management</h3>
              </div>
              <p className="text-muted-foreground mb-4">Create, edit, and manage your restaurant's menu items and categories.</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/restaurant/menu")}
              >
                Manage Menu
              </Button>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-foodz-100 p-2 rounded-full mr-3">
                  <ShoppingBag className="h-5 w-5 text-foodz-600" />
                </div>
                <h3 className="text-lg font-semibold">Order Management</h3>
              </div>
              <p className="text-muted-foreground mb-4">View and manage incoming orders from customers.</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/restaurant/orders")}
              >
                View Orders
              </Button>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-foodz-100 p-2 rounded-full mr-3">
                  <Settings className="h-5 w-5 text-foodz-600" />
                </div>
                <h3 className="text-lg font-semibold">Restaurant Settings</h3>
              </div>
              <p className="text-muted-foreground mb-4">Update your restaurant profile, business hours, and other settings.</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/restaurant/settings")}
              >
                Edit Settings
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
