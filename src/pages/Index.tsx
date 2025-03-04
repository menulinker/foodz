
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    // Set document title
    document.title = "Foodz | Restaurant Management Platform";
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        
        {/* CTA Section */}
        <section className="py-20 bg-foodz-500 text-white">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 max-w-2xl mx-auto">
              Ready to transform your restaurant's digital experience?
            </h2>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of restaurants already using Foodz to grow their business and delight their customers.
            </p>
            <a 
              href="/signup" 
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-medium bg-white text-foodz-600 hover:bg-opacity-90 transition-all transform hover:-translate-y-1 shadow-lg"
            >
              Get Started for Free
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
