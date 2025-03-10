
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, query, where, addDoc, updateDoc, deleteDoc, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
}

export const useRestaurantData = (restaurantId?: string) => {
  const { user } = useFirebaseAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use the currently logged-in restaurant user ID if no specific ID provided
  const effectiveRestaurantId = restaurantId || (user?.role === 'restaurant' ? user.uid : null);

  useEffect(() => {
    if (!effectiveRestaurantId) {
      setIsLoading(false);
      return;
    }

    const fetchRestaurantData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch menu items
        const menuQuery = query(
          collection(db, 'menuItems'), 
          where('restaurantId', '==', effectiveRestaurantId)
        );
        const menuSnapshot = await getDocs(menuQuery);
        const items = menuSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as MenuItem[];
        setMenuItems(items);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(items.map(item => item.category)));
        setCategories(uniqueCategories);
        
        // Fetch restaurant stats
        const statsDoc = await getDoc(doc(db, 'restaurantStats', effectiveRestaurantId));
        if (statsDoc.exists()) {
          setStats(statsDoc.data());
        } else {
          // Create default stats if none exist
          setStats({
            totalOrders: 0,
            pendingOrders: 0,
            todayRevenue: 0,
            menuItems: items.length,
            popularItems: [],
            recentOrders: []
          });
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching restaurant data:', err);
        setError('Failed to load restaurant data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurantData();
  }, [effectiveRestaurantId]);

  // CRUD operations for menu items
  const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
    if (!effectiveRestaurantId) return null;
    
    try {
      const newItemRef = await addDoc(collection(db, 'menuItems'), {
        ...item,
        restaurantId: effectiveRestaurantId,
        createdAt: new Date()
      });
      
      const newItem = {
        id: newItemRef.id,
        ...item
      };
      
      setMenuItems(prev => [...prev, newItem]);
      
      // Update categories if needed
      if (!categories.includes(item.category)) {
        setCategories(prev => [...prev, item.category]);
      }
      
      return newItem;
    } catch (err) {
      console.error('Error adding menu item:', err);
      throw err;
    }
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      const itemRef = doc(db, 'menuItems', id);
      await updateDoc(itemRef, { ...updates, updatedAt: new Date() });
      
      setMenuItems(prev => 
        prev.map(item => item.id === id ? { ...item, ...updates } : item)
      );
      
      // Update categories if needed
      if (updates.category && !categories.includes(updates.category)) {
        setCategories(prev => [...prev, updates.category!]);
      }
      
      return { id, ...updates };
    } catch (err) {
      console.error('Error updating menu item:', err);
      throw err;
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'menuItems', id));
      setMenuItems(prev => prev.filter(item => item.id !== id));
      return id;
    } catch (err) {
      console.error('Error deleting menu item:', err);
      throw err;
    }
  };

  const addCategory = async (category: string) => {
    if (categories.includes(category)) return category;
    
    setCategories(prev => [...prev, category]);
    return category;
  };

  return {
    menuItems,
    categories,
    stats,
    isLoading,
    error,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addCategory
  };
};