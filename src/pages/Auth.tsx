
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useFirebaseAuth, UserRole } from "@/context/FirebaseAuthContext";
import AuthContainer from "@/components/auth/AuthContainer";
import LoginForm from "@/components/auth/LoginForm";
import SignUpForm from "@/components/auth/SignUpForm";
import RestaurantInfoForm, { RestaurantInfoData } from "@/components/auth/RestaurantInfoForm";

enum SignupStep {
  ACCOUNT_INFO = 1,
  RESTAURANT_INFO = 2
}

const Auth = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [signupStep, setSignupStep] = useState<SignupStep>(SignupStep.ACCOUNT_INFO);
  
  // Signup state
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    accountType: "client" as UserRole
  });
  
  // Restaurant info state
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfoData>({
    name: "",
    description: "",
    cuisine: "",
    address: "",
    phone: "",
    website: ""
  });
  
  const { register, isLoading } = useFirebaseAuth();
  const navigate = useNavigate();

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

  const handleAccountInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.accountType === "restaurant") {
      // If restaurant, go to step 2 to collect restaurant info
      setSignupStep(SignupStep.RESTAURANT_INFO);
      // Pre-fill restaurant name with user name if empty
      if (!restaurantInfo.name) {
        setRestaurantInfo(prev => ({ ...prev, name: signupData.name }));
      }
    } else {
      // If client, complete registration
      handleSignupSubmit(e);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (signupData.accountType === "restaurant") {
        await register(
          signupData.email,
          signupData.password,
          signupData.name,
          signupData.accountType,
          restaurantInfo
        );
        navigate("/restaurant/dashboard");
      } else {
        await register(
          signupData.email,
          signupData.password,
          signupData.name,
          signupData.accountType
        );
        navigate("/restaurants");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
    }
  };

  const handleGoBackToAccountInfo = () => {
    setSignupStep(SignupStep.ACCOUNT_INFO);
  };

  // Determine what to render based on active tab and signup step
  const renderAuthContent = () => {
    if (activeTab === "login") {
      return <LoginForm />;
    }
    
    if (activeTab === "signup") {
      if (signupStep === SignupStep.ACCOUNT_INFO) {
        return (
          <SignUpForm 
            signupData={signupData}
            onDataChange={handleSignupChange}
            onSubmit={handleAccountInfoSubmit}
            isLoading={isLoading}
          />
        );
      }
      
      if (signupStep === SignupStep.RESTAURANT_INFO) {
        return (
          <RestaurantInfoForm
            restaurantInfo={restaurantInfo}
            onInfoChange={handleRestaurantInfoChange}
            onSubmit={handleSignupSubmit}
            onBack={handleGoBackToAccountInfo}
            isLoading={isLoading}
          />
        );
      }
    }
    
    return null;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <AuthContainer>
          {/* Tabs - Only show when on step 1 */}
          {signupStep === SignupStep.ACCOUNT_INFO && (
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
          )}
          
          {renderAuthContent()}
        </AuthContainer>
      </main>
      
      <Footer />
    </div>
  );
};

export default Auth;
