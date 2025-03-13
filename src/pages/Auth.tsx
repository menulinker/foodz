
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui-custom/Button";
import { ArrowLeft, Eye, EyeOff, Check, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useFirebaseAuth, UserRole } from "@/context/FirebaseAuthContext";

const Auth = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  
  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Signup state
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    accountType: "client" as UserRole
  });
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  
  // Restaurant info state (for restaurant signup)
  const [showRestaurantInfo, setShowRestaurantInfo] = useState(false);
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "",
    description: "",
    cuisine: "",
    address: "",
    phone: "",
    website: ""
  });
  
  const { login, register, isLoading } = useFirebaseAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(loginEmail, loginPassword);
      
      // Navigate to the appropriate page after successful login
      // The navigation will happen automatically based on the user's role
      // which is retrieved during auth state change in FirebaseAuthContext
      navigate("/");
    } catch (error: any) {
      // Error is handled in the auth context with toast
      console.error("Login error:", error);
    }
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData(prev => ({ 
      ...prev, 
      [name]: name === "accountType" ? value as UserRole : value 
    }));
  };

  const handleRestaurantInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRestaurantInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // If it's a restaurant account, pass restaurant info
      if (signupData.accountType === "restaurant") {
        await register(
          signupData.email,
          signupData.password,
          signupData.name,
          signupData.accountType,
          restaurantInfo.name ? restaurantInfo : { name: signupData.name }
        );
      } else {
        // For client account, no restaurant info is needed
        await register(
          signupData.email,
          signupData.password,
          signupData.name,
          signupData.accountType
        );
      }
      
      // Navigate based on role
      if (signupData.accountType === "restaurant") {
        navigate("/restaurant/dashboard");
      } else {
        navigate("/restaurants");
      }
    } catch (error: any) {
      // Error is handled in the auth context with toast
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-sm font-medium text-foodz-600 hover:text-foodz-700 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </Link>
          </div>
          
          <div className="glass-card p-8 rounded-2xl">
            {/* Tabs */}
            <div className="flex mb-8 border-b">
              <button
                className={`flex-1 pb-3 text-center font-medium ${
                  activeTab === "login" 
                    ? "text-foodz-600 border-b-2 border-foodz-500" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab("login")}
              >
                Log In
              </button>
              <button
                className={`flex-1 pb-3 text-center font-medium ${
                  activeTab === "signup" 
                    ? "text-foodz-600 border-b-2 border-foodz-500" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab("signup")}
              >
                Sign Up
              </button>
            </div>
            
            {/* Login Form */}
            {activeTab === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div>
                  <label 
                    htmlFor="login-email" 
                    className="block text-sm font-medium mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="login-password" 
                    className="block text-sm font-medium mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      aria-label={showLoginPassword ? "Hide password" : "Show password"}
                    >
                      {showLoginPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <div className="flex justify-end mt-2">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-foodz-600 hover:text-foodz-700 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isLoading}
                >
                  Log in
                </Button>
              </form>
            )}
            
            {/* Signup Form */}
            {activeTab === "signup" && (
              <form onSubmit={handleSignupSubmit} className="space-y-6">
                <div>
                  <label 
                    htmlFor="name" 
                    className="block text-sm font-medium mb-2"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={signupData.name}
                    onChange={handleSignupChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                    placeholder="Your name"
                    required
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-medium mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="password" 
                    className="block text-sm font-medium mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showSignupPassword ? "text" : "password"}
                      value={signupData.password}
                      onChange={handleSignupChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                      placeholder="Create a strong password"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      aria-label={showSignupPassword ? "Hide password" : "Show password"}
                    >
                      {showSignupPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Password must be at least 8 characters long
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Account type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label 
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                        signupData.accountType === "restaurant" 
                          ? "border-foodz-500 bg-foodz-50" 
                          : "border-border hover:border-foodz-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="accountType"
                        value="restaurant"
                        checked={signupData.accountType === "restaurant"}
                        onChange={handleSignupChange}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">Restaurant</span>
                        {signupData.accountType === "restaurant" && (
                          <Check className="h-4 w-4 text-foodz-500" />
                        )}
                      </div>
                    </label>
                    
                    <label 
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                        signupData.accountType === "client" 
                          ? "border-foodz-500 bg-foodz-50" 
                          : "border-border hover:border-foodz-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="accountType"
                        value="client"
                        checked={signupData.accountType === "client"}
                        onChange={handleSignupChange}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">Customer</span>
                        {signupData.accountType === "client" && (
                          <Check className="h-4 w-4 text-foodz-500" />
                        )}
                      </div>
                    </label>
                  </div>
                </div>
                
                {/* Restaurant info form (appears when restaurant type is selected) */}
                {signupData.accountType === "restaurant" && (
                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center cursor-pointer" 
                         onClick={() => setShowRestaurantInfo(!showRestaurantInfo)}>
                      <h3 className="text-base font-medium">Restaurant Information</h3>
                      {showRestaurantInfo ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    
                    {showRestaurantInfo && (
                      <div className="space-y-4 pt-2">
                        <div>
                          <label htmlFor="restaurant-name" className="block text-sm font-medium mb-1">
                            Restaurant Name
                          </label>
                          <input
                            id="restaurant-name"
                            name="name"
                            type="text"
                            value={restaurantInfo.name}
                            onChange={handleRestaurantInfoChange}
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-foodz-500 text-sm"
                            placeholder="Name of your restaurant"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="cuisine" className="block text-sm font-medium mb-1">
                            Cuisine Type
                          </label>
                          <input
                            id="cuisine"
                            name="cuisine"
                            type="text"
                            value={restaurantInfo.cuisine}
                            onChange={handleRestaurantInfoChange}
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-foodz-500 text-sm"
                            placeholder="e.g. Italian, Mexican, Indian"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium mb-1">
                            Description
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            value={restaurantInfo.description}
                            onChange={handleRestaurantInfoChange}
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-foodz-500 text-sm"
                            placeholder="Brief description of your restaurant"
                            rows={3}
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
                            value={restaurantInfo.address}
                            onChange={handleRestaurantInfoChange}
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-foodz-500 text-sm"
                            placeholder="Your restaurant's address"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium mb-1">
                            Phone
                          </label>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={restaurantInfo.phone}
                            onChange={handleRestaurantInfoChange}
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-foodz-500 text-sm"
                            placeholder="Contact phone number"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="website" className="block text-sm font-medium mb-1">
                            Website (Optional)
                          </label>
                          <input
                            id="website"
                            name="website"
                            type="url"
                            value={restaurantInfo.website}
                            onChange={handleRestaurantInfoChange}
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-foodz-500 text-sm"
                            placeholder="https://yourrestaurant.com"
                          />
                        </div>
                      </div>
                    )}
                    
                    {!showRestaurantInfo && (
                      <p className="text-xs text-muted-foreground">
                        Click to add restaurant details (can be completed later in your profile)
                      </p>
                    )}
                  </div>
                )}
                
                <div className="flex items-start">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 text-foodz-500 rounded border-gray-300 focus:ring-foodz-500 mt-1"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-muted-foreground">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-foodz-600 hover:text-foodz-700 transition-colors"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-foodz-600 hover:text-foodz-700 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isLoading}
                >
                  Create Account
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Auth;
