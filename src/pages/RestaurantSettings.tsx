
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui-custom/Button";
import { useFirebaseAuth } from "@/context/FirebaseAuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import ProfileImageUploader from "@/components/restaurant/ProfileImageUploader";
import ProfileForm from "@/components/restaurant/ProfileForm";
import BusinessHours from "@/components/restaurant/BusinessHours";

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
    
    document.title = "Restaurant Settings | Foodz";
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
  const handleHoursChange = (day: string, value: string) => {
    setRestaurantProfile((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: value
      }
    }));
  };
  
  // Handle profile image update
  const handleImageUpdate = (url: string) => {
    setRestaurantProfile((prev) => ({
      ...prev,
      imageUrl: url
    }));
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
              <ProfileImageUploader 
                userId={user!.uid} 
                imageUrl={restaurantProfile.imageUrl}
                onImageUpdate={handleImageUpdate}
              />
            </div>
            
            <ProfileForm 
              name={restaurantProfile.name}
              cuisine={restaurantProfile.cuisine}
              description={restaurantProfile.description}
              address={restaurantProfile.address}
              phone={restaurantProfile.phone}
              email={restaurantProfile.email}
              website={restaurantProfile.website}
              onInputChange={handleInputChange}
            />
            
            <BusinessHours 
              openingHours={restaurantProfile.openingHours}
              onHoursChange={handleHoursChange}
            />
            
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
