
import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
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
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
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
          // Get user data from Firestore
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
            // If user document doesn't exist but user is authenticated
            // Create a default user document (fallback)
            const defaultRole = "client";
            await setDoc(doc(db, "users", firebaseUser.uid), {
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              role: defaultRole
            });
            
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              displayName: firebaseUser.displayName || "",
              role: defaultRole,
            });
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

  const login = async (email: string, password: string, role: UserRole) => {
    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if user has the right role
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role !== role) {
          await firebaseSignOut(auth);
          throw new Error(`You're not registered as a ${role}. Please use the correct account type.`);
        }
      } else {
        // If user exists in auth but not in Firestore, create the document
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          role: role
        });
      }
      
      toast.success("Logged in successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to log in");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      // Store additional user data in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        displayName: name,
        role,
        createdAt: new Date()
      });
      
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