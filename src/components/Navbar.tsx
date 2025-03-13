
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui-custom/Button";
import { Menu, X, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFirebaseAuth } from "@/context/FirebaseAuthContext";
import ProfileButton from "./ProfileButton";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useFirebaseAuth();
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

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Logout error",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getDashboardLink = () => {
    if (user?.role === "restaurant") {
      return "/restaurant/dashboard";
    } else if (user?.role === "client") {
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
            <svg width="120" viewBox="0 0 171 39" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M159.832 15.6006L158.21 8.40894C158.069 7.82922 157.771 7.53936 157.317 7.53936H149.044C148.589 7.53936 148.299 7.82922 148.174 8.40894L146.552 15.6006H159.832ZM144.954 22.6747L142.768 32.2636H135.576L140.982 8.31493C141.499 5.99606 142.4 4.13156 143.685 2.72143C145.126 1.12329 146.881 0.324219 148.95 0.324219H157.411C159.479 0.324219 161.242 1.12329 162.699 2.72143C163.984 4.13156 164.885 5.99606 165.402 8.31493L170.808 32.2636H163.592L161.43 22.6747H144.954Z" fill="#444444"/>
            <path d="M113.882 0.324219V24.2258C113.882 24.8056 114.179 25.0954 114.775 25.0954H132.402V25.0954C132.402 29.0802 129.172 32.3106 125.187 32.3106H114.681C112.487 32.3106 110.607 31.5272 109.04 29.9604C107.473 28.3935 106.689 26.5134 106.689 24.3199V0.324219H113.882Z" fill="#444444"/>
            <ellipse cx="86.0186" cy="16.3172" rx="3.57133" ry="3.57111" fill="#FF661F"/>
            <path d="M78.0401 0.351562C75.8465 0.351562 70.0489 0.35447 70.0489 0.353444C70.0489 0.353444 70.0489 6.14874 70.0489 8.34227V30.4107C70.0489 32.4633 70.7462 34.2572 72.1407 35.7927C73.5196 37.3125 75.2197 38.1664 77.241 38.3544V8.43628C77.241 7.85656 77.5387 7.5667 78.1341 7.5667H93.905C94.5004 7.5667 94.7981 7.85656 94.7981 8.43628V24.2297C94.7981 24.8094 94.5004 25.0993 93.905 25.0993H79.0038V32.2909H93.999C96.1927 32.2909 98.073 31.5075 99.6399 29.9407C101.207 28.3896 101.99 26.5172 101.99 24.3237V8.34227C101.99 6.14874 101.207 4.26858 99.6399 2.70177C98.073 1.13497 96.1927 0.351562 93.999 0.351562H78.0401Z" fill="#FF661F"/>
            <path d="M55.992 15.6006L54.3702 8.40894C54.2292 7.82922 53.9315 7.53936 53.4771 7.53936H45.2039C44.7495 7.53936 44.4596 7.82922 44.3342 8.40894L42.7125 15.6006H55.992ZM41.1142 22.6747L38.9284 32.2636H31.7363L37.1421 8.31493C37.6592 5.99606 38.5602 4.13156 39.8451 2.72143C41.2866 1.12329 43.0415 0.324219 45.1098 0.324219H53.5711C55.6394 0.324219 57.4022 1.12329 58.8594 2.72143C60.1443 4.13156 61.0453 5.99606 61.5623 8.31493L66.9682 32.2636H59.7526L57.5902 22.6747H41.1142Z" fill="#444444"/>
            <path d="M0.806641 6.71679V0.324219H32.2074V6.71679H20.0325V32.2636H12.9815V6.71679H0.806641Z" fill="#444444"/>
            </svg>
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
            {user ? (
              <ProfileButton />
            ) : (
              <Button 
                variant="primary" 
                size="sm" 
                asChild
              >
                <Link to="/auth" className="inline-flex items-center justify-center rounded-full px-6 py-3 text-white font-medium bg-foodz-500 text-foodz-600 hover:bg-opacity-90 transition-all transform hover:-translate-y-1 shadow-lg"
                >
                  Sign in </Link>
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
              {user ? (
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
