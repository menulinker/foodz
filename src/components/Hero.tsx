
import { useState, useEffect } from "react";
import { Button } from "@/components/ui-custom/Button";
import { ArrowRight } from "lucide-react";
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
                className="group" 
                asChild
              >
                <Link to="/auth" className="inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-medium bg-[#F9432B] text-white hover:bg-opacity-90 transition-all transform hover:-translate-y-1 shadow-lg">
                  Get Started 
                  <span className="ml-2 bg-white/20 rounded-full p-1 transition-transform group-hover:translate-x-1">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Chef Image with dynamic animations */}
          <div className={`transition-all duration-1000 delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="relative mx-auto perspective-800">
              <div className="relative">
                {/* Main chef image */}
                <div className="transform hover:scale-105 transition-transform duration-500 rounded-xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Chef using digital menu" 
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                
                {/* Floating elements */}
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white rounded-lg shadow-lg p-3 transform rotate-6 animate-pulse">
                  <img 
                    src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" 
                    alt="Restaurant food" 
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-white rounded-lg shadow-lg p-2 transform -rotate-12 animate-bounce">
                  <div className="w-full h-full bg-[#F9432B] rounded flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M19 6V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                
                {/* Mobile device mockup */}
                <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-36 h-72 bg-black rounded-xl overflow-hidden border-8 border-gray-800 shadow-xl">
                  <div className="absolute top-0 w-full h-6 bg-black"></div>
                  <div className="absolute bottom-0 w-full h-6 bg-black flex justify-center items-center">
                    <div className="w-16 h-1 bg-gray-700 rounded-full"></div>
                  </div>
                  <div className="w-full h-full overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1559329007-40df8a9345d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" 
                      alt="Restaurant menu on mobile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
