
import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc, collection } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { toast } from "sonner";

export type UserRole = "client" | "restaurant";

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole, restaurantInfo?: any) => Promise<void>;
  logout: () => Promise<void>;
}

const FirebaseAuthContext = createContext<AuthContextType | undefined>(undefined);

export const FirebaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              displayName: firebaseUser.displayName || "",
              role: userData.role as UserRole,
            });
          } else {
            await firebaseSignOut(auth);
            throw new Error("User account is incomplete. Please contact support.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      
      if (!userDoc.exists()) {
        await firebaseSignOut(auth);
        throw new Error("User account is incomplete. Please contact support.");
      }
      
      toast.success("Logged in successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to log in");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole, restaurantInfo?: any) => {
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        displayName: name,
        role,
        createdAt: new Date()
      });
      
      if (role === "restaurant") {
        // For restaurant accounts, create a restaurant document with required fields
        const restaurantData = {
          name: restaurantInfo?.name || name,
          ownerId: userCredential.user.uid,
          email,
          description: restaurantInfo?.description || "",
          cuisine: restaurantInfo?.cuisine || "",
          address: restaurantInfo?.address || "",
          phone: restaurantInfo?.phone || "",
          website: restaurantInfo?.website || "",
          createdAt: new Date()
        };
        
        await setDoc(doc(db, "restaurants", userCredential.user.uid), restaurantData);
      }
      
      toast.success("Account created successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to log out");
      throw error;
    }
  };

  return (
    <FirebaseAuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};

export const useFirebaseAuth = () => {
  const context = useContext(FirebaseAuthContext);
  if (context === undefined) {
    throw new Error("useFirebaseAuth must be used within a FirebaseAuthProvider");
  }
  return context;
};
