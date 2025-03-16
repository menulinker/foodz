
import { useState, useEffect } from "react";
import { Button } from "@/components/ui-custom/Button";
import { ArrowRight, QrCode } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading delay for animation purposes
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative pt-20 pb-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-50 rounded-full filter blur-3xl opacity-60"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-red-50 rounded-full filter blur-3xl opacity-60"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            {/* Hero content */}
            <span className="inline-block mb-4 px-3 py-1 text-xs font-medium bg-red-50 text-[#F9432B] rounded-full">
              Digital Menu Platform
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Digitize Your <span className="text-[#F9432B]">Restaurant Experience</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Create QR menus, manage orders, and grow your business with Foodz - the all-in-one platform for modern restaurants.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="group bg-[#F9432B] hover:bg-[#e33a23] rounded-full transition-all duration-300" 
                asChild
              >
                <Link to="/auth" className="flex items-center">
                  Get Started 
                  <span className="ml-2 bg-white/20 rounded-full p-1 transition-transform group-hover:translate-x-1">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </Button>
            </div>
          </div>

          {/* QR Code Tent Card Mockup */}
          <div className={`transition-all duration-1000 delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="relative mx-auto max-w-md perspective-800">
              <div className="bg-white rounded-lg shadow-xl p-6 transform rotate-y-5 rotate-x-5">
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <div className="flex justify-center mb-4">
                    <QrCode className="h-8 w-8 text-[#F9432B]" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">Scan for menu</h3>
                  <div className="bg-white p-4 rounded-md inline-block">
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://foodz.app/restaurant/123" 
                      alt="Restaurant QR Code" 
                      className="w-32 h-32 mx-auto"
                    />
                  </div>
                  <p className="mt-2 text-sm text-[#F9432B]">Powered by Foodz</p>
                </div>
              </div>
              
              {/* Shadow effect */}
              <div className="absolute -bottom-4 inset-x-0 h-10 bg-black/10 blur-md rounded-full z-0"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
