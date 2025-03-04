
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CreditCard, Edit, MapPin, Receipt, Save, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui-custom/Button";

const ClientProfile = () => {
  useEffect(() => {
    document.title = "My Profile | Foodz";
  }, []);

  const [profile, setProfile] = useState({
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(555) 987-6543",
    address: "456 Oak Street, Anytown, CA 12345"
  });

  const [orderHistory, setOrderHistory] = useState([
    { 
      id: "ORD-001", 
      date: "2023-06-10", 
      restaurant: "Delicious Bites", 
      items: ["Burger", "Fries", "Coke"], 
      total: 18.99, 
      status: "Delivered" 
    },
    { 
      id: "ORD-002", 
      date: "2023-05-25", 
      restaurant: "Pizza Palace", 
      items: ["Large Pizza", "Garlic Bread"], 
      total: 22.50, 
      status: "Delivered" 
    },
    { 
      id: "ORD-003", 
      date: "2023-05-15", 
      restaurant: "Sushi World", 
      items: ["California Roll", "Miso Soup", "Green Tea"], 
      total: 24.75, 
      status: "Delivered" 
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saving profile:", profile);
    setIsEditing(false);
    // Here you would normally save to a database
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link 
              to="/" 
              className="inline-flex items-center text-sm font-medium text-foodz-600 hover:text-foodz-700 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">My Profile</h1>
              <p className="text-muted-foreground mt-1">Manage your account and view your order history</p>
            </div>
            <div className="mt-4 md:mt-0">
              {isEditing ? (
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Profile Information */}
              <div className="bg-white rounded-xl shadow-sm mb-8">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Personal Information
                  </h2>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500 ${
                          !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
                        }`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500 ${
                          !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
                        }`}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        value={profile.phone}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500 ${
                          !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
                        }`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        Delivery Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={profile.address}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500 ${
                          !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Order History */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Receipt className="h-5 w-5 mr-2" />
                    Order History
                  </h2>
                </div>
                
                <div className="overflow-x-auto">
                  {orderHistory.length > 0 ? (
                    <table className="w-full">
                      <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                        <tr>
                          <th className="px-6 py-3 text-left">Order #</th>
                          <th className="px-6 py-3 text-left">Date</th>
                          <th className="px-6 py-3 text-left">Restaurant</th>
                          <th className="px-6 py-3 text-left">Items</th>
                          <th className="px-6 py-3 text-left">Total</th>
                          <th className="px-6 py-3 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {orderHistory.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{order.restaurant}</td>
                            <td className="px-6 py-4">{order.items.join(", ")}</td>
                            <td className="px-6 py-4 whitespace-nowrap">${order.total.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div>
              {/* Payment Methods */}
              <div className="bg-white rounded-xl shadow-sm mb-8">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Methods
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="rounded-lg border p-4 mb-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-8 w-12 rounded bg-gray-800 mr-3 flex items-center justify-center text-white text-xs">VISA</div>
                        <div>
                          <p className="font-medium">•••• •••• •••• 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 12/24</p>
                        </div>
                      </div>
                      <div className="text-sm text-foodz-600 font-medium">Default</div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              </div>
              
              {/* Account Actions */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Account Actions</h2>
                </div>
                
                <div className="p-6 space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    Change Password
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    Notification Settings
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                    Delete Account
                  </Button>
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
