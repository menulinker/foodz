
import { useState } from "react";
import { Check, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui-custom/Button";
import { UserRole } from "@/context/FirebaseAuthContext";
import { Link } from "react-router-dom";

interface SignUpFormProps {
  signupData: {
    name: string;
    email: string;
    password: string;
    accountType: UserRole;
  };
  onDataChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const SignUpForm = ({ signupData, onDataChange, onSubmit, isLoading }: SignUpFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
          onChange={onDataChange}
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
          onChange={onDataChange}
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
            value={signupData.password}
            onChange={onDataChange}
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
              onChange={onDataChange}
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
              onChange={onDataChange}
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
        {signupData.accountType === "restaurant" ? "Continue" : "Create Account"}
      </Button>
    </form>
  );
};

export default SignUpForm;
