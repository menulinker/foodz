
import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

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
}

interface RecentOrdersProps {
  orders: Order[] | null;
  isLoading: boolean;
}

const RecentOrders = ({ orders, isLoading }: RecentOrdersProps) => {
  const navigate = useNavigate();

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
        {orders && orders.length > 0 ? (
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
                {orders.slice(0, 5).map((order) => (
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
  );
};

export default RecentOrders;
