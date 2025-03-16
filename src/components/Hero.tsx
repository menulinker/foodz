
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
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-foodz-100 rounded-full filter blur-3xl opacity-60"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-50 rounded-full filter blur-3xl opacity-60"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            {/* Logo and branding */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <QrCode className="h-10 w-10 text-foodz-500" />
                <h2 className="text-3xl font-bold text-foodz-500">foodz</h2>
              </div>
              <span className="inline-block mb-4 px-3 py-1 text-xs font-medium text-foodz-700 bg-foodz-100 rounded-full">
                Digital Menu Solutions
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight mb-6">
              Transform Your <span className="text-foodz-500">Restaurant Experience</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Create digital menus, manage orders, and grow your business with Foodz - the all-in-one platform for modern restaurants.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="group" 
                asChild
              >
                <Link to="/auth">
                  Get Started 
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* QR Code Tent Card Mockup */}
          <div className={`transition-all duration-1000 delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="relative mx-auto max-w-md perspective-800">
              <div className="bg-white rounded-lg shadow-xl p-6 transform rotate-y-5 rotate-x-5">
                <div className="bg-foodz-50 p-4 rounded-lg text-center">
                  <div className="flex justify-center mb-4">
                    <QrCode className="h-8 w-8 text-foodz-500" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">Scan to see our menu</h3>
                  <div className="bg-white p-4 rounded-md inline-block">
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://foodz.app/restaurant/123" 
                      alt="Restaurant QR Code" 
                      className="w-32 h-32 mx-auto"
                    />
                  </div>
                  <p className="mt-2 text-sm text-foodz-700">Powered by Foodz</p>
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
