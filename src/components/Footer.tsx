
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              <span className="text-[#F9432B]">Foodz</span>
            </h2>
          </div>
          
          <div className="text-center mb-8">
            <p className="text-muted-foreground max-w-lg mx-auto">
              The all-in-one digital menu and order management platform for modern restaurants.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Foodz. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
