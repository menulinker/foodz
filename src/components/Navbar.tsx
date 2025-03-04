
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui-custom/Button";
import { Menu, X, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock authentication - In a real app, this would be connected to a proper auth system
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });
  const [userType, setUserType] = useState(() => {
    return localStorage.getItem("userType") || "";
  });

  const login = (email: string, password: string, type: string) => {
    // In a real app, this would validate credentials with a backend
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userType", type);
    setIsAuthenticated(true);
    setUserType(type);
    return true;
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userType");
    setIsAuthenticated(false);
    setUserType("");
  };

  return { isAuthenticated, userType, login, logout };
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, userType, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Determine if we're on the main landing page or not
  const isLandingPage = location.pathname === "/";

  // Update scroll state for navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    navigate("/");
  };

  const getDashboardLink = () => {
    if (userType === "restaurant") {
      return "/restaurant/dashboard";
    } else if (userType === "customer") {
      return "/client/profile";
    }
    return "/";
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/80 backdrop-blur-md shadow-sm py-4" 
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-foodz-600 to-foodz-500 bg-clip-text text-transparent">
              Foodz
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-sm font-medium text-foreground hover:text-foodz-500 transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/features" 
              className="text-sm font-medium text-foreground hover:text-foodz-500 transition-colors"
            >
              Features
            </Link>
          </nav>

          {/* Auth Buttons Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  asChild
                >
                  <Link to={getDashboardLink()}>Dashboard</Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                  icon={<LogOut className="h-4 w-4" />}
                >
                  Log out
                </Button>
              </>
            ) : (
              <Button 
                variant="primary" 
                size="sm" 
                asChild
              >
                <Link to="/auth">Log in / Sign up</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-foreground p-2 rounded-md"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 right-0 shadow-lg animate-smooth-appear">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-base font-medium py-2 text-foreground hover:text-foodz-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/features" 
              className="text-base font-medium py-2 text-foreground hover:text-foodz-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <div className="pt-2 flex flex-col space-y-3">
              {isAuthenticated ? (
                <>
                  <Button 
                    variant="outline" 
                    size="md" 
                    className="w-full justify-center" 
                    asChild
                  >
                    <Link to={getDashboardLink()} onClick={() => setIsMobileMenuOpen(false)}>
                      Dashboard
                    </Link>
                  </Button>
                  <Button 
                    variant="primary" 
                    size="md" 
                    className="w-full justify-center"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    icon={<LogOut className="h-4 w-4" />}
                  >
                    Log out
                  </Button>
                </>
              ) : (
                <Button 
                  variant="primary" 
                  size="md" 
                  className="w-full justify-center" 
                  asChild
                >
                  <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                    Log in / Sign up
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
