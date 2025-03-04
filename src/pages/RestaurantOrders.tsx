
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, PlayCircle, CheckCircle, XCircle, Search, Filter, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui-custom/Button";
import { toast } from "sonner";

interface Order {
  id: number;
  customer: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: "pending" | "active" | "completed" | "cancelled";
  time: string;
  date: string;
  tableNumber?: string;
  notes?: string;
}

const RestaurantOrders = () => {
  useEffect(() => {
    document.title = "Order Management | Foodz";
  }, []);

  // Mock data
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1001,
      customer: "John Doe",
      items: [
        { name: "Classic Burger", quantity: 1, price: 12.99 },
        { name: "French Fries", quantity: 1, price: 4.99 }
      ],
      total: 17.98,
      status: "active",
      time: "12:30 PM",
      date: "2023-03-04",
      tableNumber: "T5",
      notes: "No pickles on burger"
    },
    {
      id: 1002,
      customer: "Alice Smith",
      items: [
        { name: "Vegetarian Pizza", quantity: 1, price: 14.50 },
        { name: "Cola", quantity: 2, price: 2.00 }
      ],
      total: 18.50,
      status: "pending",
      time: "12:45 PM",
      date: "2023-03-04"
    },
    {
      id: 1003,
      customer: "Bob Johnson",
      items: [
        { name: "Caesar Salad", quantity: 1, price: 9.95 },
        { name: "Water", quantity: 1, price: 0.00 }
      ],
      total: 9.95,
      status: "completed",
      time: "1:00 PM",
      date: "2023-03-04",
      tableNumber: "T3"
    },
    {
      id: 1004,
      customer: "Emma Davis",
      items: [
        { name: "Fish & Chips", quantity: 1, price: 16.50 }
      ],
      total: 16.50,
      status: "cancelled",
      time: "1:15 PM",
      date: "2023-03-04",
      notes: "Customer changed their mind"
    },
  ]);

  const [activeFilter, setActiveFilter] = useState<"all" | "pending" | "active" | "completed" | "cancelled">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleStatusChange = (orderId: number, newStatus: Order["status"]) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    
    // Show toast notification
    toast.success(`Order #${orderId} status updated to ${newStatus}`, {
      description: `The order has been moved to ${newStatus} status.`,
      position: "top-right",
    });
  };

  const filteredOrders = orders.filter(order => {
    // Filter by status
    if (activeFilter !== "all" && order.status !== activeFilter) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.id.toString().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.items.some(item => item.name.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  // Helper function to get status badge style
  const getStatusBadgeStyle = (status: Order["status"]) => {
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

  // Helper function to get status icon
  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "active":
        return <PlayCircle className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link 
              to="/restaurant/dashboard" 
              className="inline-flex items-center text-sm font-medium text-foodz-600 hover:text-foodz-700 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Order Management</h1>
              <p className="text-muted-foreground mt-1">Track and manage customer orders</p>
            </div>
          </div>
          
          {/* Filters and Search */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={activeFilter === "all" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter("all")}
                >
                  All Orders
                </Button>
                <Button 
                  variant={activeFilter === "pending" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter("pending")}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Pending
                </Button>
                <Button 
                  variant={activeFilter === "active" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter("active")}
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Active
                </Button>
                <Button 
                  variant={activeFilter === "completed" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter("completed")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Completed
                </Button>
                <Button 
                  variant={activeFilter === "cancelled" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter("cancelled")}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancelled
                </Button>
              </div>
              
              <div className="flex-grow md:ml-auto md:max-w-xs">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search orders..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-foodz-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-white p-10 rounded-xl shadow-sm text-center">
                <p className="text-lg text-gray-500">No orders match your filters</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold">Order #{order.id}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusBadgeStyle(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {order.status === "pending" && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleStatusChange(order.id, "active")}
                          >
                            Start Preparation
                          </Button>
                        )}
                        
                        {order.status === "active" && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleStatusChange(order.id, "completed")}
                          >
                            Complete Order
                          </Button>
                        )}
                        
                        {(order.status === "pending" || order.status === "active") && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleStatusChange(order.id, "cancelled")}
                          >
                            Cancel
                          </Button>
                        )}
                        
                        <Button size="sm" variant="ghost">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Order details */}
                      <div className="flex-grow">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Customer</p>
                            <p className="font-medium">{order.customer}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Date & Time</p>
                            <p className="font-medium">{order.date} at {order.time}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="font-medium">${order.total.toFixed(2)}</p>
                          </div>
                          {order.tableNumber && (
                            <div>
                              <p className="text-sm text-gray-500">Table</p>
                              <p className="font-medium">{order.tableNumber}</p>
                            </div>
                          )}
                        </div>
                        
                        {order.notes && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-500">Customer Notes</p>
                            <p className="text-sm bg-gray-50 p-2 rounded mt-1">{order.notes}</p>
                          </div>
                        )}
                        
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Order Items</p>
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>
                                  {item.quantity}x {item.name}
                                </span>
                                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RestaurantOrders;
