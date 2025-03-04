
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin, Save, Upload } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui-custom/Button";

const RestaurantSettings = () => {
  useEffect(() => {
    document.title = "Restaurant Settings | Foodz";
  }, []);

  const [profile, setProfile] = useState({
    name: "Delicious Bites",
    description: "A family-friendly restaurant serving delicious meals made with fresh ingredients.",
    address: "123 Main Street, Anytown, CA 12345",
    phone: "(555) 123-4567",
    email: "contact@deliciousbites.com",
    website: "www.deliciousbites.com",
    cuisine: "American, Italian",
    logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80"
  });

  const [businessHours, setBusinessHours] = useState([
    { day: "Monday", open: "09:00", close: "22:00", closed: false },
    { day: "Tuesday", open: "09:00", close: "22:00", closed: false },
    { day: "Wednesday", open: "09:00", close: "22:00", closed: false },
    { day: "Thursday", open: "09:00", close: "22:00", closed: false },
    { day: "Friday", open: "09:00", close: "23:00", closed: false },
    { day: "Saturday", open: "10:00", close: "23:00", closed: false },
    { day: "Sunday", open: "10:00", close: "21:00", closed: false },
  ]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleHoursChange = (index: number, field: string, value: string | boolean) => {
    const updatedHours = [...businessHours];
    updatedHours[index] = { ...updatedHours[index], [field]: value };
    setBusinessHours(updatedHours);
  };

  const handleSave = () => {
    console.log("Saving profile:", profile);
    console.log("Saving business hours:", businessHours);
    // Here you would normally save to a database
  };

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
              <p className="text-muted-foreground mt-1">Manage your restaurant's profile and settings</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Restaurant Profile */}
              <div className="bg-white rounded-xl shadow-sm mb-8">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Restaurant Profile</h2>
                </div>
                
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Restaurant Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      name="description"
                      value={profile.description}
                      onChange={handleProfileChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        value={profile.phone}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Website</label>
                      <input
                        type="text"
                        name="website"
                        value={profile.website}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Cuisine Type</label>
                      <input
                        type="text"
                        name="cuisine"
                        value={profile.cuisine}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                        placeholder="e.g., Italian, Mexican, etc."
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={profile.address}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Business Hours */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">
                    <Calendar className="h-5 w-5 inline mr-2" />
                    Business Hours
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {businessHours.map((hours, index) => (
                      <div key={hours.day} className="flex items-center flex-wrap space-y-2 md:space-y-0">
                        <div className="w-full md:w-1/4">
                          <span className="font-medium">{hours.day}</span>
                        </div>
                        
                        <div className="w-full md:w-3/4 flex items-center">
                          <input
                            type="checkbox"
                            checked={hours.closed}
                            onChange={(e) => handleHoursChange(index, 'closed', e.target.checked)}
                            className="mr-2"
                          />
                          <label className="text-sm mr-4">Closed</label>
                          
                          {!hours.closed && (
                            <div className="flex items-center space-x-2 flex-1">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <input
                                type="time"
                                value={hours.open}
                                onChange={(e) => handleHoursChange(index, 'open', e.target.value)}
                                disabled={hours.closed}
                                className="px-2 py-1 border border-gray-300 rounded"
                              />
                              <span>to</span>
                              <input
                                type="time"
                                value={hours.close}
                                onChange={(e) => handleHoursChange(index, 'close', e.target.value)}
                                disabled={hours.closed}
                                className="px-2 py-1 border border-gray-300 rounded"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div>
              {/* Logo Upload */}
              <div className="bg-white rounded-xl shadow-sm mb-8">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Logo</h2>
                </div>
                
                <div className="p-6">
                  <div className="flex flex-col items-center">
                    {profile.logo ? (
                      <div className="mb-4">
                        <img 
                          src={profile.logo} 
                          alt="Restaurant Logo" 
                          className="h-32 w-32 rounded-full object-cover border-4 border-foodz-100"
                        />
                      </div>
                    ) : (
                      <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                        <span className="text-gray-500 text-lg">No Logo</span>
                      </div>
                    )}
                    
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Quick Settings */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Quick Settings</h2>
                </div>
                
                <div className="p-6 space-y-5">
                  <div>
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-foodz-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-foodz-500"></div>
                      <span className="ml-3 text-sm font-medium">
                        Accept Online Orders
                      </span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-foodz-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-foodz-500"></div>
                      <span className="ml-3 text-sm font-medium">
                        Show Restaurant on Directory
                      </span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-foodz-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-foodz-500"></div>
                      <span className="ml-3 text-sm font-medium">
                        Email Notifications
                      </span>
                    </label>
                  </div>
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

export default RestaurantSettings;
