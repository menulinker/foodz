
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, DocumentData, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UseFirestoreCollectionProps {
  collectionName: string;
  queries?: QueryConstraint[];
  parentDoc?: {
    collection: string;
    id: string;
  };
}

export const useFirestoreCollection = <T extends DocumentData>({ 
  collectionName, 
  queries = [],
  parentDoc
}: UseFirestoreCollectionProps) => {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      let collectionRef;
      
      if (parentDoc) {
        // Use a subcollection if parentDoc is provided
        collectionRef = collection(db, parentDoc.collection, parentDoc.id, collectionName);
      } else {
        // Use a root collection otherwise
        collectionRef = collection(db, collectionName);
      }
      
      const q = query(collectionRef, ...queries);
      const querySnapshot = await getDocs(q);
      
      const fetchedData: T[] = [];
      querySnapshot.forEach((doc) => {
        const docData = doc.data() as Partial<T>;
        // Create a new object with the document data and ID
        fetchedData.push({ 
          ...docData, 
          id: doc.id 
        } as unknown as T);
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
      let docRef;
      
      if (parentDoc) {
        // Get document from subcollection
        docRef = doc(db, parentDoc.collection, parentDoc.id, collectionName, id);
      } else {
        // Get document from root collection
        docRef = doc(db, collectionName, id);
      }
      
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const docData = docSnap.data() as Partial<T>;
        // Create a new object with the document data and ID
        return { 
          ...docData, 
          id: docSnap.id 
        } as unknown as T;
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
      let collectionRef;
      
      if (parentDoc) {
        // Add to subcollection
        collectionRef = collection(db, parentDoc.collection, parentDoc.id, collectionName);
      } else {
        // Add to root collection
        collectionRef = collection(db, collectionName);
      }
      
      const docRef = await addDoc(collectionRef, data);
      return docRef.id;
    } catch (err) {
      console.error('Error adding document:', err);
      throw err;
    }
  };

  const updateDocument = async (id: string, data: Partial<T>) => {
    try {
      let docRef;
      
      if (parentDoc) {
        // Update document in subcollection
        docRef = doc(db, parentDoc.collection, parentDoc.id, collectionName, id);
      } else {
        // Update document in root collection
        docRef = doc(db, collectionName, id);
      }
      
      await updateDoc(docRef, data as DocumentData);
    } catch (err) {
      console.error('Error updating document:', err);
      throw err;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      let docRef;
      
      if (parentDoc) {
        // Delete document from subcollection
        docRef = doc(db, parentDoc.collection, parentDoc.id, collectionName, id);
      } else {
        // Delete document from root collection
        docRef = doc(db, collectionName, id);
      }
      
      await deleteDoc(docRef);
    } catch (err) {
      console.error('Error deleting document:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchData();
  }, [collectionName, JSON.stringify(queries), parentDoc?.id]);

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
