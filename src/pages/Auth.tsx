
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui-custom/Button";
import { ArrowLeft, Eye, EyeOff, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

// Mock authentication - In a real app, this would connect to a backend service
const useAuth = () => {
  const login = (email: string, password: string, type: string) => {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userType", type);
    return true;
  };

  const signup = (name: string, email: string, password: string, type: string) => {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userType", type);
    return true;
  };

  return { login, signup };
};

const Auth = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  
  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  
  // Signup state
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    accountType: "restaurant" // Default to restaurant account
  });
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);
    
    setTimeout(() => {
      const success = login(loginEmail, loginPassword, "restaurant");
      
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome back to Foodz!",
        });
        navigate("/restaurant/dashboard");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
      
      setIsLoginLoading(false);
    }, 1000);
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSignupLoading(true);
    
    setTimeout(() => {
      const success = signup(
        signupData.name,
        signupData.email,
        signupData.password,
        signupData.accountType
      );
      
      if (success) {
        toast({
          title: "Account created successfully",
          description: "Welcome to Foodz!",
        });
        
        if (signupData.accountType === "restaurant") {
          navigate("/restaurant/dashboard");
        } else {
          navigate("/client/profile");
        }
      } else {
        toast({
          title: "Signup failed",
          description: "There was an error creating your account. Please try again.",
          variant: "destructive",
        });
      }
      
      setIsSignupLoading(false);
    }, 1000);
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
                  isLoading={isLoginLoading}
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
                        signupData.accountType === "customer" 
                          ? "border-foodz-500 bg-foodz-50" 
                          : "border-border hover:border-foodz-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="accountType"
                        value="customer"
                        checked={signupData.accountType === "customer"}
                        onChange={handleSignupChange}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">Customer</span>
                        {signupData.accountType === "customer" && (
                          <Check className="h-4 w-4 text-foodz-500" />
                        )}
                      </div>
                    </label>
                  </div>
                </div>
                
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
                  isLoading={isSignupLoading}
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
