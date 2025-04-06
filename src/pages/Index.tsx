
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import { 
  ArrowRight, 
  Smartphone, 
  Utensils, 
  CreditCard, 
  Award, 
  QrCode, 
  FileText, 
  ShoppingBag, 
  BarChart4, 
  Settings,
  ChevronRight,
  CheckCircle2,
  ListOrdered
} from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui-custom/Button";

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
        
        {/* Restaurant Use Case Carousel MOVED BEFORE CLIENT SECTION */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">For Restaurant Owners</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Powerful tools to streamline your operations and enhance customer experience
              </p>
            </div>
            
            <div className="mx-auto max-w-5xl">
              <Carousel className="w-full">
                <CarouselContent>
                  {/* Feature 1: Menu Management */}
                  <CarouselItem>
                    <Card className="border-0 shadow-lg overflow-hidden rounded-xl transform transition-all duration-300 hover:scale-[1.02]">
                      <CardContent className="p-0">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                          <div className="bg-gradient-to-br from-[#F9432B] to-foodz-600 p-8 flex items-center text-white rounded-l-xl">
                            <div>
                              <FileText className="h-10 w-10 mb-4" />
                              <h3 className="text-2xl font-bold mb-2">Menu Management</h3>
                              <p className="opacity-90 mb-4">
                                Create and update digital menus with photos, descriptions, and prices in minutes
                              </p>
                              <ul className="space-y-3">
                                <li className="flex items-center gap-3">
                                  <CheckCircle2 className="h-5 w-5 text-white/80" />
                                  <span>Unlimited menu items & categories</span>
                                </li>
                                <li className="flex items-center gap-3">
                                  <CheckCircle2 className="h-5 w-5 text-white/80" />
                                  <span>Custom modifiers & add-ons</span>
                                </li>
                                <li className="flex items-center gap-3">
                                  <CheckCircle2 className="h-5 w-5 text-white/80" />
                                  <span>Seasonal menu updates</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="p-6">
                            <img 
                              src="https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" 
                              alt="Menu Management" 
                              className="w-full h-64 object-cover rounded-lg shadow-md"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                  
                  {/* Feature 2: Order Management */}
                  <CarouselItem>
                    <Card className="border-0 shadow-lg overflow-hidden rounded-xl transform transition-all duration-300 hover:scale-[1.02]">
                      <CardContent className="p-0">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                          <div className="bg-gradient-to-br from-[#F9432B] to-foodz-700 p-8 flex items-center text-white rounded-l-xl">
                            <div>
                              <ShoppingBag className="h-10 w-10 mb-4" />
                              <h3 className="text-2xl font-bold mb-2">Order Management</h3>
                              <p className="opacity-90 mb-4">
                                Receive and manage orders in real-time with an intuitive dashboard
                              </p>
                              <ul className="space-y-3">
                                <li className="flex items-center gap-3">
                                  <CheckCircle2 className="h-5 w-5 text-white/80" />
                                  <span>Real-time order notifications</span>
                                </li>
                                <li className="flex items-center gap-3">
                                  <CheckCircle2 className="h-5 w-5 text-white/80" />
                                  <span>Order status tracking</span>
                                </li>
                                <li className="flex items-center gap-3">
                                  <CheckCircle2 className="h-5 w-5 text-white/80" />
                                  <span>Kitchen display system</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="p-6">
                            <img 
                              src="https://images.unsplash.com/photo-1556740772-1a741367b93e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" 
                              alt="Order Management" 
                              className="w-full h-64 object-cover rounded-lg shadow-md"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                  
                  {/* Feature 3: Analytics */}
                  <CarouselItem>
                    <Card className="border-0 shadow-lg overflow-hidden rounded-xl transform transition-all duration-300 hover:scale-[1.02]">
                      <CardContent className="p-0">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                          <div className="bg-gradient-to-br from-[#F9432B] to-foodz-800 p-8 flex items-center text-white rounded-l-xl">
                            <div>
                              <BarChart4 className="h-10 w-10 mb-4" />
                              <h3 className="text-2xl font-bold mb-2">Analytics & Insights</h3>
                              <p className="opacity-90 mb-4">
                                Make data-driven decisions with powerful analytics and reporting
                              </p>
                              <ul className="space-y-3">
                                <li className="flex items-center gap-3">
                                  <CheckCircle2 className="h-5 w-5 text-white/80" />
                                  <span>Sales reports & trends</span>
                                </li>
                                <li className="flex items-center gap-3">
                                  <CheckCircle2 className="h-5 w-5 text-white/80" />
                                  <span>Popular item analysis</span>
                                </li>
                                <li className="flex items-center gap-3">
                                  <CheckCircle2 className="h-5 w-5 text-white/80" />
                                  <span>Customer behavior insights</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="p-6">
                            <img 
                              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" 
                              alt="Analytics" 
                              className="w-full h-64 object-cover rounded-lg shadow-md"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                </CarouselContent>
                <div className="flex justify-center gap-2 mt-6">
                  <CarouselPrevious className="relative inset-0 translate-y-0 hover:bg-foodz-100 hover:text-[#F9432B]" />
                  <CarouselNext className="relative inset-0 translate-y-0 hover:bg-foodz-100 hover:text-[#F9432B]" />
                </div>
              </Carousel>
            </div>
          </div>
        </section>
        
        {/* Client Use Case Section - ENHANCED AND MOVED AFTER RESTAURANT SECTION */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">How It Works For Customers</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A seamless dining experience in just 3 simple steps
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {/* Step 1 */}
              <div className="relative bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-[#F9432B] text-white flex items-center justify-center font-bold text-xl">1</div>
                <div className="flex flex-col items-center text-center pt-6">
                  <div className="w-20 h-20 rounded-full bg-foodz-100 flex items-center justify-center mb-4">
                    <QrCode className="h-10 w-10 text-[#F9432B]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Scan QR Code</h3>
                  <p className="text-muted-foreground">
                    Simply scan the QR code on your table to access the digital menu
                  </p>
                </div>
                <div className="absolute right-0 bottom-1/2 translate-x-1/2 hidden md:block">
                  <ChevronRight className="h-8 w-8 text-[#F9432B]" />
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-[#F9432B] text-white flex items-center justify-center font-bold text-xl">2</div>
                <div className="flex flex-col items-center text-center pt-6">
                  <div className="w-20 h-20 rounded-full bg-foodz-100 flex items-center justify-center mb-4">
                    <ShoppingBag className="h-10 w-10 text-[#F9432B]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Browse & Order</h3>
                  <p className="text-muted-foreground">
                    Browse the menu, customize items, and place your order directly from your phone
                  </p>
                </div>
                <div className="absolute right-0 bottom-1/2 translate-x-1/2 hidden md:block">
                  <ChevronRight className="h-8 w-8 text-[#F9432B]" />
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-[#F9432B] text-white flex items-center justify-center font-bold text-xl">3</div>
                <div className="flex flex-col items-center text-center pt-6">
                  <div className="w-20 h-20 rounded-full bg-foodz-100 flex items-center justify-center mb-4">
                    <CreditCard className="h-10 w-10 text-[#F9432B]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Pay & Enjoy</h3>
                  <p className="text-muted-foreground">
                    Pay securely through the app and enjoy your meal without waiting
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <Features />
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-[#F9432B] to-foodz-700 text-white">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 max-w-2xl mx-auto">
              Ready to transform your restaurant's digital experience?
            </h2>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of restaurants already using Foodz to grow their business and delight their customers.
            </p>
            <Button 
              size="lg"
              asChild
              className="bg-white text-[#F9432B] hover:bg-white/90"
            >
              <Link to="/auth" className="rounded-full px-8 py-4 text-base font-medium transition-all transform hover:-translate-y-1 shadow-lg">
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
