
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Clock, PlayCircle, CheckCircle, XCircle, Search, Plus, ChevronDown, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useFirebaseAuth } from "@/context/FirebaseAuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useRealTimeOrders, Order, OrderItem } from "@/hooks/useRealTimeOrders";

const RestaurantOrders = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useFirebaseAuth();
  const [activeFilter, setActiveFilter] = useState<"all" | "pending" | "active" | "completed" | "cancelled">("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Create order modal state
  const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState<{
    customerName: string;
    tableNumber: string;
    notes: string;
    items: OrderItem[];
    newItemName: string;
    newItemPrice: string;
    newItemQuantity: string;
  }>({
    customerName: "",
    tableNumber: "",
    notes: "",
    items: [],
    newItemName: "",
    newItemPrice: "",
    newItemQuantity: "1"
  });

  // Get real-time orders
  const { 
    orders, 
    isLoading: ordersLoading, 
    updateOrderStatus 
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
  }, [user, authLoading, navigate]);

  // Create a new order
  const handleAddOrderItem = () => {
    if (!newOrder.newItemName || !newOrder.newItemPrice) {
      toast.error("Please enter item name and price");
      return;
    }

    const price = parseFloat(newOrder.newItemPrice);
    const quantity = parseInt(newOrder.newItemQuantity) || 1;

    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (isNaN(quantity) || quantity <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    const newItem = {
      name: newOrder.newItemName,
      price,
      quantity
    };

    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, newItem],
      newItemName: "",
      newItemPrice: "",
      newItemQuantity: "1"
    });
  };

  const handleRemoveOrderItem = (index: number) => {
    const updatedItems = [...newOrder.items];
    updatedItems.splice(index, 1);
    setNewOrder({
      ...newOrder,
      items: updatedItems
    });
  };

  const calculateOrderTotal = () => {
    return newOrder.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCreateOrder = async () => {
    if (!newOrder.customerName) {
      toast.error("Please enter customer name");
      return;
    }

    if (newOrder.items.length === 0) {
      toast.error("Please add at least one item to the order");
      return;
    }

    try {
      const orderData = {
        customer: {
          id: "manual-entry",
          name: newOrder.customerName
        },
        items: newOrder.items,
        total: calculateOrderTotal(),
        status: "pending" as const,
        timestamp: Date.now(),
        tableNumber: newOrder.tableNumber || undefined,
        notes: newOrder.notes || undefined
      };

      if (!user || !user.uid) {
        throw new Error("User not authenticated");
      }

      const orderRef = collection(db, "restaurants", user.uid, "orders");
      await addDoc(orderRef, orderData);

      setNewOrder({
        customerName: "",
        tableNumber: "",
        notes: "",
        items: [],
        newItemName: "",
        newItemPrice: "",
        newItemQuantity: "1"
      });

      setIsCreateOrderModalOpen(false);
      toast.success("Order created successfully");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order");
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      
      // Show toast notification
      toast.success(`Order status updated to ${newStatus}`, {
        description: `The order has been moved to ${newStatus} status.`,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status. Please try again.");
    }
  };

  const filteredOrders = (orders || []).filter(order => {
    // Filter by status
    if (activeFilter !== "all" && order.status !== activeFilter) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.id.toString().includes(query) ||
        order.customer.name.toLowerCase().includes(query) ||
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

  // Format timestamp to readable date and time
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Loading state
  if (authLoading || ordersLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foodz-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading orders...</p>
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
            <div className="mt-4 md:mt-0">
              <Button onClick={() => setIsCreateOrderModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Order
              </Button>
            </div>
          </div>
          
          {/* Filters and Search */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={activeFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter("all")}
                >
                  All Orders
                </Button>
                <Button 
                  variant={activeFilter === "pending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter("pending")}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Pending
                </Button>
                <Button 
                  variant={activeFilter === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter("active")}
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Active
                </Button>
                <Button 
                  variant={activeFilter === "completed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter("completed")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Completed
                </Button>
                <Button 
                  variant={activeFilter === "cancelled" ? "default" : "outline"}
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
          
          {/* Orders Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {filteredOrders.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-lg text-gray-500">No orders match your filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id.slice(0, 6)}</TableCell>
                        <TableCell>{order.customer.name}</TableCell>
                        <TableCell>
                          {formatDate(order.timestamp)}<br/>
                          <span className="text-xs text-muted-foreground">{formatTime(order.timestamp)}</span>
                        </TableCell>
                        <TableCell>
                          {order.items.map((item, idx) => (
                            <div key={idx} className="text-sm">
                              {item.quantity}x {item.name}
                            </div>
                          ))}
                        </TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusBadgeStyle(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {order.status === "pending" && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleStatusChange(order.id, "active")}
                              >
                                Start
                              </Button>
                            )}
                            
                            {order.status === "active" && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleStatusChange(order.id, "completed")}
                              >
                                Complete
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
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Create Order Modal */}
      {isCreateOrderModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Create New Order</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsCreateOrderModalOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Customer Name*</label>
                <input
                  type="text"
                  value={newOrder.customerName}
                  onChange={(e) => setNewOrder({...newOrder, customerName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                  placeholder="Enter customer name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Table Number (Optional)</label>
                <input
                  type="text"
                  value={newOrder.tableNumber}
                  onChange={(e) => setNewOrder({...newOrder, tableNumber: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                  placeholder="e.g. Table 5"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                <textarea
                  value={newOrder.notes}
                  onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                  placeholder="Any special instructions"
                  rows={2}
                />
              </div>
              
              <div className="border-t border-b py-4">
                <h3 className="font-medium mb-3">Order Items*</h3>
                
                {newOrder.items.length > 0 ? (
                  <div className="mb-4 space-y-3">
                    {newOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <div className="text-sm text-muted-foreground">
                            {item.quantity} x ${item.price.toFixed(2)}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="mr-3 font-medium">
                            ${(item.quantity * item.price).toFixed(2)}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRemoveOrderItem(index)}
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between font-medium pt-2">
                      <span>Total:</span>
                      <span>${calculateOrderTotal().toFixed(2)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded mb-4">
                    <p className="text-muted-foreground">No items added yet</p>
                  </div>
                )}
                
                <div className="space-y-3">
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-5">
                      <input
                        type="text"
                        placeholder="Item name"
                        value={newOrder.newItemName}
                        onChange={(e) => setNewOrder({...newOrder, newItemName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        placeholder="Price"
                        value={newOrder.newItemPrice}
                        onChange={(e) => setNewOrder({...newOrder, newItemPrice: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Qty"
                        value={newOrder.newItemQuantity}
                        onChange={(e) => setNewOrder({...newOrder, newItemQuantity: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        min="1"
                      />
                    </div>
                    <div className="col-span-2">
                      <Button 
                        onClick={handleAddOrderItem}
                        variant="outline"
                        className="w-full py-2 h-full"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsCreateOrderModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateOrder}>
                Create Order
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default RestaurantOrders;
