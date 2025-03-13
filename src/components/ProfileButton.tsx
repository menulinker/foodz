
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  User, 
  LogOut, 
  Settings, 
  ChevronDown,
  Share,
  QrCode
} from "lucide-react";
import { useFirebaseAuth } from "@/context/FirebaseAuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui-custom/Button";
import QRCodeModal from "./QRCodeModal";

const ProfileButton = () => {
  const { user, logout } = useFirebaseAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  
  if (!user) return null;
  
  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const hideDropdown = () => setShowDropdown(false);
  
  // Create initials for avatar fallback
  const getInitials = () => {
    if (!user.displayName) return "U";
    return user.displayName
      .split(" ")
      .map(name => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Get dashboard link based on user role
  const getDashboardLink = () => {
    if (user.role === "restaurant") {
      return "/restaurant/dashboard";
    } else {
      return "/client/profile";
    }
  };
  
  // Get profile settings link based on user role
  const getSettingsLink = () => {
    if (user.role === "restaurant") {
      return "/restaurant/settings";
    } else {
      return "/client/profile";
    }
  };
  
  return (
    <>
      <div className="relative">
        <button
          className="flex items-center space-x-1 rounded-full p-1 hover:bg-gray-100 transition-colors"
          onClick={toggleDropdown}
          aria-label="User profile menu"
        >
          <Avatar className="h-8 w-8 border border-gray-200">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.displayName || "User")}`} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </button>
        
        {showDropdown && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={hideDropdown}
            />
            <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
              <div className="py-2 px-3 border-b border-gray-100">
                <p className="text-sm font-medium truncate">{user.displayName}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <div className="py-1">
                <Link
                  to={getDashboardLink()}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={hideDropdown}
                >
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  to={getSettingsLink()}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={hideDropdown}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
                
                {user.role === "restaurant" && (
                  <button
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={(e) => {
                      e.preventDefault();
                      hideDropdown();
                      setShowQRCode(true);
                    }}
                  >
                    <Share className="mr-2 h-4 w-4" />
                    Share Restaurant
                  </button>
                )}
                
                <button
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={async () => {
                    hideDropdown();
                    await logout();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* QR Code Modal for Restaurant Sharing */}
      {user.role === "restaurant" && (
        <QRCodeModal 
          isOpen={showQRCode}
          onClose={() => setShowQRCode(false)}
          restaurantId={user.uid}
          restaurantName={user.displayName}
        />
      )}
    </>
  );
};

export default ProfileButton;
