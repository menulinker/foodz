import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customer: {
    id: string;
    name: string;
  };
  items: OrderItem[];
  total: number;
  status: "pending" | "active" | "completed" | "cancelled";
  timestamp: number;
  tableNumber?: string;
  notes?: string;
}

interface UseRealTimeOrdersProps {
  restaurantId?: string;
  userId?: string;
  type: 'restaurant' | 'customer';
}

export const useRealTimeOrders = ({ restaurantId, userId, type }: UseRealTimeOrdersProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Guard against missing required IDs
    if (type === 'restaurant' && !restaurantId) return;
    if (type === 'customer' && !userId) return;

    setIsLoading(true);
    
    let ordersQuery;
    
    if (type === 'restaurant') {
      // Subscribe to orders for the restaurant
      ordersQuery = query(
        collection(db, 'restaurants', restaurantId!, 'orders'),
        orderBy('timestamp', 'desc')
      );
    } else {
      // Subscribe to orders for the customer
      ordersQuery = query(
        collection(db, 'users', userId!, 'orders'),
        orderBy('timestamp', 'desc')
      );
    }
    
    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const ordersData: Order[] = [];
        snapshot.forEach((doc) => {
          ordersData.push({
            id: doc.id,
            ...doc.data()
          } as Order);
        });
        
        setOrders(ordersData);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error getting real-time orders:", err);
        setError(err);
        setIsLoading(false);
        toast.error("Failed to load orders");
      }
    );
    
    // Clean up subscription
    return () => unsubscribe();
  }, [restaurantId, userId, type]);

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    if (!restaurantId) return;
    
    try {
      const orderRef = doc(db, 'restaurants', restaurantId, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
      
      // Update user's order copy to keep in sync
      const orderData = orders.find(order => order.id === orderId);
      if (orderData && orderData.customer && orderData.customer.id) {
        const userOrderRef = doc(db, 'users', orderData.customer.id, 'orders');
        // Try to update the customer order copy if it exists
        try {
          await updateDoc(userOrderRef, { status: newStatus });
        } catch (e) {
          console.log('Customer order copy not found or cannot update');
        }
      }
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
      throw error;
    }
  };

  return { orders, isLoading, error, updateOrderStatus };
};
