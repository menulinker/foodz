
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui-custom/Button";
import { Eye, EyeOff } from "lucide-react";
import { useFirebaseAuth } from "@/context/FirebaseAuthContext";

const LoginForm = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  const { login, isLoading } = useFirebaseAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(loginEmail, loginPassword);
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
    }
  };

  return (
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
  );
};

export default LoginForm;
