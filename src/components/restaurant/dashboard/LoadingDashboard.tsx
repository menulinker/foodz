
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const LoadingDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foodz-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoadingDashboard;
