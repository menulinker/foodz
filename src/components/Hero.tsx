
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

          {/* Chef Image */}
          <div className={`transition-all duration-1000 delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="relative mx-auto max-w-md perspective-800">
              <div className="bg-white rounded-lg shadow-xl p-6 transform rotate-y-5 rotate-x-5">
                <img 
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Chef using digital menu" 
                  className="w-full h-auto rounded-lg"
                />
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
