
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, X, Upload, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui-custom/Button";
import { useFirebaseAuth } from "@/context/FirebaseAuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

interface RestaurantProfile {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  cuisine: string;
  imageUrl: string;
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
}

const RestaurantSettings = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useFirebaseAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Restaurant profile state
  const [restaurantProfile, setRestaurantProfile] = useState<RestaurantProfile>({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    cuisine: "",
    imageUrl: "",
    openingHours: {
      monday: "9:00 AM - 9:00 PM",
      tuesday: "9:00 AM - 9:00 PM",
      wednesday: "9:00 AM - 9:00 PM",
      thursday: "9:00 AM - 9:00 PM",
      friday: "9:00 AM - 9:00 PM",
      saturday: "9:00 AM - 9:00 PM",
      sunday: "Closed"
    }
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
    
    document.title = "Restaurant Settings | Tapla";
  }, [user, authLoading, navigate]);
  
  // Load restaurant profile from Firestore
  useEffect(() => {
    const fetchRestaurantProfile = async () => {
      if (!user?.uid) return;
      
      try {
        const restaurantRef = doc(db, "restaurants", user.uid);
        const docSnapshot = await getDoc(restaurantRef);
        
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as RestaurantProfile;
          setRestaurantProfile({
            ...data,
            // Make sure name has a value
            name: data.name || user.displayName || "",
            // Make sure email has a value
            email: data.email || user.email || "",
            // Ensure opening hours object exists
            openingHours: data.openingHours || {
              monday: "9:00 AM - 9:00 PM",
              tuesday: "9:00 AM - 9:00 PM",
              wednesday: "9:00 AM - 9:00 PM",
              thursday: "9:00 AM - 9:00 PM",
              friday: "9:00 AM - 9:00 PM",
              saturday: "9:00 AM - 9:00 PM",
              sunday: "Closed"
            },
            // Ensure imageUrl exists
            imageUrl: data.imageUrl || ""
          });
        } else {
          // Create initial restaurant profile if it doesn't exist
          const initialProfile = {
            name: user.displayName || "",
            description: "",
            address: "",
            phone: "",
            email: user.email || "",
            website: "",
            cuisine: "",
            imageUrl: "",
            openingHours: {
              monday: "9:00 AM - 9:00 PM",
              tuesday: "9:00 AM - 9:00 PM",
              wednesday: "9:00 AM - 9:00 PM",
              thursday: "9:00 AM - 9:00 PM",
              friday: "9:00 AM - 9:00 PM",
              saturday: "9:00 AM - 9:00 PM",
              sunday: "Closed"
            }
          };
          
          // Set initial profile in state
          setRestaurantProfile(initialProfile);
          
          // Save initial profile to Firestore
          await setDoc(restaurantRef, initialProfile);
        }
      } catch (error) {
        console.error("Error fetching restaurant profile:", error);
        toast.error("Failed to load restaurant profile");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user?.uid && !authLoading) {
      fetchRestaurantProfile();
    }
  }, [user, authLoading]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRestaurantProfile((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle opening hours change
  const handleHoursChange = (day: keyof RestaurantProfile['openingHours'], value: string) => {
    setRestaurantProfile((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: value
      }
    }));
  };
  
  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user?.uid) return;
    
    setIsUploading(true);
    
    try {
      const file = e.target.files[0];
      const storage = getStorage();
      const storageRef = ref(storage, `restaurants/${user.uid}/profile`);
      
      // Upload the file
      await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update state with the new image URL
      setRestaurantProfile((prev) => ({
        ...prev,
        imageUrl: downloadURL
      }));
      
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };
  
  // Handle image removal
  const handleRemoveImage = async () => {
    if (!user?.uid || !restaurantProfile.imageUrl) return;
    
    setIsUploading(true);
    
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `restaurants/${user.uid}/profile`);
      
      // Delete the file from storage
      await deleteObject(storageRef);
      
      // Update state
      setRestaurantProfile((prev) => ({
        ...prev,
        imageUrl: ""
      }));
      
      toast.success("Image removed successfully");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Failed to remove image");
    } finally {
      setIsUploading(false);
    }
  };
  
  // Save restaurant profile
  const handleSaveProfile = async () => {
    if (!user?.uid) return;
    
    setIsSaving(true);
    
    try {
      const restaurantRef = doc(db, "restaurants", user.uid);
      await setDoc(restaurantRef, restaurantProfile, { merge: true });
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error saving restaurant profile:", error);
      toast.error("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };
  
  // Loading state
  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foodz-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading settings...</p>
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
              <h1 className="text-2xl md:text-3xl font-bold">Restaurant Settings</h1>
              <p className="text-muted-foreground mt-1">Manage your restaurant profile and preferences</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button 
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
          </div>
          
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Restaurant Profile</h2>
            </div>
            
            <div className="p-6 border-b">
              <h3 className="text-lg font-medium mb-4">Profile Image</h3>
              <div className="flex items-start space-x-6">
                <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden relative">
                  {restaurantProfile.imageUrl ? (
                    <img 
                      src={restaurantProfile.imageUrl} 
                      alt={restaurantProfile.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Upload a clear image of your restaurant or logo. <br />
                    Recommended size: 500x500 pixels.
                  </p>
                  
                  <div className="flex space-x-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-foodz-500 mr-2"></div>
                      ) : (
                        <Upload className="mr-2 h-4 w-4" />
                      )}
                      Upload Image
                    </Button>
                    
                    {restaurantProfile.imageUrl && (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={handleRemoveImage}
                        disabled={isUploading}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    )}
                    
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/png, image/jpeg, image/jpg"
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Restaurant Name*
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={restaurantProfile.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="cuisine" className="block text-sm font-medium mb-2">
                    Cuisine Type
                  </label>
                  <input
                    id="cuisine"
                    name="cuisine"
                    type="text"
                    value={restaurantProfile.cuisine}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                    placeholder="e.g. Italian, Mexican, Chinese"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={restaurantProfile.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                    rows={4}
                    placeholder="Describe your restaurant..."
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t">
              <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-2">
                    Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={restaurantProfile.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={restaurantProfile.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={restaurantProfile.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="website" className="block text-sm font-medium mb-2">
                    Website (Optional)
                  </label>
                  <input
                    id="website"
                    name="website"
                    type="url"
                    value={restaurantProfile.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t">
              <h2 className="text-xl font-semibold mb-6">Business Hours</h2>
              
              <div className="space-y-4">
                {Object.entries(restaurantProfile.openingHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center">
                    <span className="w-28 font-medium capitalize">{day}</span>
                    <input
                      type="text"
                      value={hours}
                      onChange={(e) => handleHoursChange(day as keyof RestaurantProfile['openingHours'], e.target.value)}
                      className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                      placeholder="e.g. 9:00 AM - 5:00 PM or Closed"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t flex justify-end">
              <Button onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></div>
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RestaurantSettings;
