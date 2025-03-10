
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, DocumentData, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UseFirestoreCollectionProps {
  collectionName: string;
  queries?: QueryConstraint[];
}

export const useFirestoreCollection = <T extends DocumentData>({ 
  collectionName, 
  queries = [] 
}: UseFirestoreCollectionProps) => {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, collectionName), ...queries);
      const querySnapshot = await getDocs(q);
      
      const fetchedData: T[] = [];
      querySnapshot.forEach((doc) => {
        fetchedData.push({ id: doc.id, ...doc.data() } as T);
      });
      
      setData(fetchedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching collection data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch data'));
    } finally {
      setIsLoading(false);
    }
  };

  const getDocument = async (id: string) => {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      } else {
        throw new Error('Document not found');
      }
    } catch (err) {
      console.error('Error fetching document:', err);
      throw err;
    }
  };

  const addDocument = async (data: Omit<T, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      return docRef.id;
    } catch (err) {
      console.error('Error adding document:', err);
      throw err;
    }
  };

  const updateDocument = async (id: string, data: Partial<T>) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, data as DocumentData);
    } catch (err) {
      console.error('Error updating document:', err);
      throw err;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error('Error deleting document:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchData();
  }, [collectionName, JSON.stringify(queries)]);

  return {
    data,
    isLoading,
    error,
    refreshData: fetchData,
    getDocument,
    addDocument,
    updateDocument,
    deleteDocument
  };
};
