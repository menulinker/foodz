
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, limit, orderBy, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  address: string;
  isOpen: boolean;
}

export const useRestaurants = (cuisineFilter?: string, searchQuery?: string) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [cuisines, setCuisines] = useState<string[]>(['All']);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setIsLoading(true);
        
        // Create base query
        let restaurantsQuery = query(
          collection(db, 'restaurants'),
          orderBy('rating', 'desc')
        );
        
        // Apply cuisine filter if provided
        if (cuisineFilter && cuisineFilter !== 'All') {
          restaurantsQuery = query(
            restaurantsQuery,
            where('cuisine', '==', cuisineFilter)
          );
        }
        
        const querySnapshot = await getDocs(restaurantsQuery);
        let results = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Restaurant[];
        
        // Apply search filter on client side if provided
        if (searchQuery) {
          const lowerCaseSearch = searchQuery.toLowerCase();
          results = results.filter(restaurant => 
            restaurant.name.toLowerCase().includes(lowerCaseSearch) ||
            restaurant.cuisine.toLowerCase().includes(lowerCaseSearch) ||
            restaurant.address.toLowerCase().includes(lowerCaseSearch)
          );
        }
        
        setRestaurants(results);
        
        // Get unique cuisines for filters
        const allCuisines = await getDocs(query(
          collection(db, 'restaurants'),
          orderBy('cuisine')
        ));
        
        const uniqueCuisines = ['All', ...new Set(allCuisines.docs.map(doc => doc.data().cuisine))];
        setCuisines(uniqueCuisines);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        setError('Failed to load restaurants');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, [cuisineFilter, searchQuery]);

  return {
    restaurants,
    cuisines,
    isLoading,
    error
  };
};