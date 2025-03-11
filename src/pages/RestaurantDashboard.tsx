
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BarChart3, Calendar, List, PieChart, Settings, Users, Utensils, ClipboardList } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui-custom/Button";
import { useFirebaseAuth } from "@/context/FirebaseAuthContext";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { where, orderBy } from "firebase/firestore";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer: {
    id: string;
    name: string;
  };
  items: OrderItem[];
  total: number;
  status: "pending" | "active" | "completed" | "cancelled";
  timestamp: number;
  restaurantId: string;
  tableNumber?: string;
  notes?: string;
}

const RestaurantDashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useFirebaseAuth();
  
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
    
    document.title = "Dashboard | Tapla";
  }, [user, authLoading, navigate]);

  // Fetch orders from Firestore
  const {
    data: orders,
    isLoading: ordersLoading
  } = useFirestoreCollection<Order>({
    collectionName: "orders",
    parentDoc: user?.uid ? { collection: "restaurants", id: user.uid } : undefined,
    queries: [orderBy("timestamp", "desc")]
  });

  // Calculate dashboard statistics
  const stats = {
    totalOrders: orders?.length || 0,
    revenue: orders?.reduce((sum, order) => sum + order.total, 0) || 0,
    customers: orders ? new Set(orders.map(order => order.customer.id)).size : 0,
    avgOrderValue: orders?.length ? (orders.reduce((sum, order) => sum + order.total, 0) / orders.length) : 0
  };

  // Format timestamp to readable date and time
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Helper function to get status badge style
  const getStatusStyle = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Loading state
  if (authLoading || ordersLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foodz-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard data...</p>
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
              <h1 className="text-2xl md:text-3xl font-bold">Restaurant Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your restaurant and orders</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <Button asChild>
                <Link to="/restaurant/orders">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Manage Orders
                </Link>
              </Button>
              <Button asChild>
                <Link to="/restaurant/menu">
                  <Utensils className="mr-2 h-4 w-4" />
                  Manage Menu
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="bg-foodz-100 p-3 rounded-full mr-4">
                  <List className="h-6 w-6 text-foodz-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <h3 className="text-2xl font-bold">${stats.revenue.toFixed(2)}</h3>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Customers</p>
                  <h3 className="text-2xl font-bold">{stats.customers}</h3>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <PieChart className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Order</p>
                  <h3 className="text-2xl font-bold">${stats.avgOrderValue.toFixed(2)}</h3>
                </div>
              </div>
            </div>
          </div>
          
          {/* Orders Table */}
          <div className="bg-white rounded-xl shadow-sm mb-8">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Recent Orders</h2>
              <Button size="sm" variant="outline" asChild>
                <Link to="/restaurant/orders">View All</Link>
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-6 py-3 text-left">Order #</th>
                    <th className="px-6 py-3 text-left">Customer</th>
                    <th className="px-6 py-3 text-left">Items</th>
                    <th className="px-6 py-3 text-left">Total</th>
                    <th className="px-6 py-3 text-left">Time</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders && orders.length > 0 ? (
                    orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">#{order.id.slice(0, 6)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{order.customer.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {order.items.map(item => item.name).join(", ")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">${order.total.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatTime(order.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button size="sm" variant="ghost" asChild>
                            <Link to={`/restaurant/orders`}>View</Link>
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-muted-foreground">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <ClipboardList className="h-5 w-5 mr-2 text-foodz-600" />
                <h3 className="font-semibold">Order Management</h3>
              </div>
              <p className="text-muted-foreground text-sm">Track and manage incoming customer orders.</p>
              <Button variant="outline" className="mt-4 w-full" asChild>
                <Link to="/restaurant/orders">
                  View Orders
                </Link>
              </Button>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <Utensils className="h-5 w-5 mr-2 text-foodz-600" />
                <h3 className="font-semibold">Menu Management</h3>
              </div>
              <p className="text-muted-foreground text-sm">Update your menu items, prices, and availability.</p>
              <Button variant="outline" className="mt-4 w-full" asChild>
                <Link to="/restaurant/menu">
                  Edit Menu
                </Link>
              </Button>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <Settings className="h-5 w-5 mr-2 text-foodz-600" />
                <h3 className="font-semibold">Profile Settings</h3>
              </div>
              <p className="text-muted-foreground text-sm">Update your restaurant profile and preferences.</p>
              <Button variant="outline" className="mt-4 w-full" asChild>
                <Link to="/restaurant/settings">
                  Edit Settings
                </Link>
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
