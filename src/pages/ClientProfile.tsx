
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Edit, Clock, MapPin, Phone, Mail, Save } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui-custom/Button";
import { useFirebaseAuth } from "@/context/FirebaseAuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";

interface ClientProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Order {
  id: string;
  restaurant: {
    id: string;
    name: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: "pending" | "active" | "completed" | "cancelled";
  timestamp: number;
}

const ClientProfile = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useFirebaseAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Client profile state
  const [profileData, setProfileData] = useState<ClientProfileData>({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  
  // Fetch recent orders for this client
  const { 
    data: recentOrders,
    isLoading: ordersLoading
  } = useFirestoreCollection<Order>({
    collectionName: "clientOrders",
    parentDoc: user?.uid ? { collection: "clients", id: user.uid } : undefined
  });
  
  // Redirect if not authenticated as client
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    
    if (!authLoading && user && user.role !== "client") {
      navigate("/");
      return;
    }
    
    document.title = "My Profile | Tapla";
  }, [user, authLoading, navigate]);
  
  // Load client profile from Firestore
  useEffect(() => {
    const fetchClientProfile = async () => {
      if (!user?.uid) return;
      
      try {
        const clientRef = doc(db, "clients", user.uid);
        const docSnapshot = await getDoc(clientRef);
        
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as ClientProfileData;
          setProfileData({
            ...data,
            // Make sure name has a value
            name: data.name || user.displayName || "",
            // Make sure email has a value
            email: data.email || user.email || ""
          });
        } else {
          // Create initial client profile if it doesn't exist
          const initialProfile = {
            name: user.displayName || "",
            email: user.email || "",
            phone: "",
            address: ""
          };
          
          // Set initial profile in state
          setProfileData(initialProfile);
          
          // Save initial profile to Firestore
          await setDoc(clientRef, initialProfile);
        }
      } catch (error) {
        console.error("Error fetching client profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user?.uid && !authLoading) {
      fetchClientProfile();
    }
  }, [user, authLoading]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Save profile
  const handleSaveProfile = async () => {
    if (!user?.uid) return;
    
    setIsSaving(true);
    
    try {
      const clientRef = doc(db, "clients", user.uid);
      await setDoc(clientRef, profileData, { merge: true });
      
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error saving client profile:", error);
      toast.error("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };
  
  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Loading state
  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foodz-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
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
          <h1 className="text-2xl md:text-3xl font-bold mb-8">My Profile</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 text-center border-b">
                  <div className="bg-foodz-100 inline-flex p-4 rounded-full mb-4">
                    <User className="h-8 w-8 text-foodz-600" />
                  </div>
                  <h2 className="text-xl font-semibold">{profileData.name}</h2>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Personal Information</h3>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>
                  </div>
                  
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">
                          Full Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={profileData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                          Email Address
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={profileData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                          disabled
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-1">
                          Phone Number
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={profileData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium mb-1">
                          Address
                        </label>
                        <input
                          id="address"
                          name="address"
                          type="text"
                          value={profileData.address}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                        />
                      </div>
                      
                      <Button 
                        className="w-full"
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></div>
                        ) : (
                          <Save className="mr-2 h-4 w-4" />
                        )}
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Mail className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p>{profileData.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p>{profileData.phone || "Not provided"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Address</p>
                          <p>{profileData.address || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-6 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate("/restaurants")}
                  >
                    Browse Restaurants
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Order History */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Order History</h2>
                </div>
                
                <div className="p-6">
                  {ordersLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-foodz-500 mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading orders...</p>
                    </div>
                  ) : recentOrders && recentOrders.length > 0 ? (
                    <div className="space-y-6">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="border border-gray-100 rounded-lg p-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                            <div>
                              <h3 className="font-semibold">{order.restaurant.name}</h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{formatDate(order.timestamp)}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center mt-2 md:mt-0">
                              <span className="text-lg font-medium mr-3">
                                {formatCurrency(order.total)}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium
                                ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                  order.status === 'active' ? 'bg-blue-100 text-blue-800' :
                                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-red-100 text-red-800'
                                }
                              `}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="border-t pt-3">
                            <p className="text-sm font-medium mb-2">Order Items:</p>
                            <div className="space-y-1">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>{item.quantity}x {item.name}</span>
                                  <span>{formatCurrency(item.price * item.quantity)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">You haven't placed any orders yet</p>
                      <Button 
                        variant="outline"
                        onClick={() => navigate("/restaurants")}
                      >
                        Browse Restaurants
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ClientProfile;
