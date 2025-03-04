
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Edit, Plus, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui-custom/Button";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image?: string;
}

interface Category {
  id: number;
  name: string;
}

const RestaurantMenu = () => {
  useEffect(() => {
    document.title = "Menu Management | Foodz";
  }, []);

  // Mock data
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Appetizers" },
    { id: 2, name: "Main Dishes" },
    { id: 3, name: "Desserts" },
    { id: 4, name: "Beverages" }
  ]);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { 
      id: 1, 
      name: "Classic Burger", 
      description: "Beef patty, lettuce, tomato, cheese, and special sauce", 
      price: 12.99, 
      category: "Main Dishes",
      available: true,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
    },
    { 
      id: 2, 
      name: "French Fries", 
      description: "Crispy golden fries served with ketchup", 
      price: 4.99, 
      category: "Appetizers",
      available: true,
      image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
    },
    { 
      id: 3, 
      name: "Chocolate Cake", 
      description: "Rich chocolate cake with a creamy frosting", 
      price: 6.99, 
      category: "Desserts",
      available: true,
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
    },
    { 
      id: 4, 
      name: "Iced Coffee", 
      description: "Cold brewed coffee served over ice", 
      price: 3.99, 
      category: "Beverages",
      available: true,
      image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
    },
  ]);

  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredItems = activeCategory === "All" 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link 
              to="/restaurant/dashboard" 
              className="inline-flex items-center text-sm font-medium text-foodz-600 hover:text-foodz-700 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Menu Management</h1>
              <p className="text-muted-foreground mt-1">Create and manage your restaurant menu</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Menu Item
              </Button>
            </div>
          </div>
          
          {/* Category filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={activeCategory === "All" ? "primary" : "outline"}
                size="sm"
                onClick={() => setActiveCategory("All")}
              >
                All
              </Button>
              
              {categories.map(category => (
                <Button 
                  key={category.id}
                  variant={activeCategory === category.name ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category.name)}
                >
                  {category.name}
                </Button>
              ))}
              
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New Category
              </Button>
            </div>
          </div>
          
          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                {item.image && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <span className="text-lg font-medium text-foodz-600">${item.price.toFixed(2)}</span>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-3">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      item.available 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {item.available ? "Available" : "Unavailable"}
                    </span>
                    
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RestaurantMenu;
