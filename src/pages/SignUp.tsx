
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui-custom/Button";
import { ArrowLeft, Eye, EyeOff, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    accountType: "restaurant" // Default to restaurant account
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("SignUp attempt with:", formData);
      setIsLoading(false);
      // Here you would normally redirect or update auth state
    }, 1500);
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
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold">Create your account</h1>
              <p className="text-muted-foreground mt-2">
                Get started with Foodz in just a few steps
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={formData.name}
                  onChange={handleChange}
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
                  value={formData.email}
                  onChange={handleChange}
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
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                    placeholder="Create a strong password"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
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
                      formData.accountType === "restaurant" 
                        ? "border-foodz-500 bg-foodz-50" 
                        : "border-border hover:border-foodz-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="accountType"
                      value="restaurant"
                      checked={formData.accountType === "restaurant"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">Restaurant</span>
                      {formData.accountType === "restaurant" && (
                        <Check className="h-4 w-4 text-foodz-500" />
                      )}
                    </div>
                  </label>
                  
                  <label 
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                      formData.accountType === "customer" 
                        ? "border-foodz-500 bg-foodz-50" 
                        : "border-border hover:border-foodz-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="accountType"
                      value="customer"
                      checked={formData.accountType === "customer"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">Customer</span>
                      {formData.accountType === "customer" && (
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
                isLoading={isLoading}
              >
                Create Account
              </Button>
              
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-foodz-600 hover:text-foodz-700 transition-colors"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SignUp;
