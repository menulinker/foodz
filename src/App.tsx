
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import RestaurantMenu from "./pages/RestaurantMenu";
import RestaurantSettings from "./pages/RestaurantSettings";
import ClientProfile from "./pages/ClientProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Restaurant Routes */}
          <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
          <Route path="/restaurant/menu" element={<RestaurantMenu />} />
          <Route path="/restaurant/settings" element={<RestaurantSettings />} />
          
          {/* Client Routes */}
          <Route path="/client/profile" element={<ClientProfile />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
