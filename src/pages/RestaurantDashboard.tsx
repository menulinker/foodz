
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, Calendar, List, PieChart, Settings, Users, Utensils, ClipboardList } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui-custom/Button";

const RestaurantDashboard = () => {
  useEffect(() => {
    document.title = "Dashboard | Foodz";
  }, []);

  // Mock data for dashboard
  const [orders, setOrders] = useState([
    { id: 1, customer: "John Doe", items: ["Burger", "Fries"], total: 15.99, status: "Completed", time: "12:30 PM" },
    { id: 2, customer: "Alice Smith", items: ["Pizza", "Coke"], total: 18.50, status: "Preparing", time: "12:45 PM" },
    { id: 3, customer: "Bob Johnson", items: ["Salad", "Water"], total: 9.95, status: "New", time: "1:00 PM" },
  ]);

  const stats = {
    totalOrders: 42,
    revenue: 859.95,
    customers: 28,
    avgOrderValue: 20.47
  };

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
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{order.customer}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{order.items.join(", ")}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{order.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === "Completed" 
                            ? "bg-green-100 text-green-800" 
                            : order.status === "Preparing" 
                            ? "bg-yellow-100 text-yellow-800" 
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button size="sm" variant="ghost" asChild>
                          <Link to="/restaurant/orders">View</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
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
