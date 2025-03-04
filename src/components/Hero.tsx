
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
    <section className="relative pt-28 pb-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-foodz-100 rounded-full filter blur-3xl opacity-60"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-50 rounded-full filter blur-3xl opacity-60"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div 
            className={`transition-all duration-700 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <span className="inline-block mb-4 px-3 py-1 text-xs font-medium text-foodz-700 bg-foodz-100 rounded-full">
              Simple. Powerful. Delicious.
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Elevate Your Restaurant's Digital Presence
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Create beautiful menus, manage orders, and grow your business with Foodz - the all-in-one platform designed for modern restaurants.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                className="group" 
                asChild
              >
                <Link to="/signup">
                  Get Started 
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                asChild
              >
                <Link to="/demo">
                  View Demo
                </Link>
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div 
            className={`mt-12 relative transition-all duration-1000 delay-300 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="glass-card rounded-2xl overflow-hidden shadow-xl border border-white/30">
              <img 
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2567&q=80" 
                alt="Restaurant dashboard showcase" 
                className={`w-full transition-all duration-700 ${isLoaded ? "img-loaded" : "img-loading"}`}
                loading="lazy"
              />
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 lg:right-0 p-4 glass-card rounded-xl shadow-lg transform rotate-3 hidden md:block animate-smooth-appear">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                <p className="text-sm font-medium">Order received</p>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 lg:left-0 p-4 glass-card rounded-xl shadow-lg transform -rotate-2 hidden md:block animate-smooth-appear delay-150">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-foodz-500 rounded-full flex items-center justify-center text-white text-xs">+26%</div>
                <p className="text-sm font-medium">More orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
