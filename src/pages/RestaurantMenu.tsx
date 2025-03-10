
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Plus, Trash2, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui-custom/Button";
import { useToast } from "@/hooks/use-toast";

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
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    document.title = "Menu Management | Tapla";
    
    // Check if user is authenticated as restaurant
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const userType = localStorage.getItem("userType");
    
    if (!isAuthenticated || userType !== "restaurant") {
      navigate("/auth");
    }
  }, [navigate]);

  // State management
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
  const [isAddMenuItemModalOpen, setIsAddMenuItemModalOpen] = useState(false);
  const [isEditMenuItemModalOpen, setIsEditMenuItemModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  
  // New menu item form state
  const [newMenuItem, setNewMenuItem] = useState<Omit<MenuItem, 'id'>>({
    name: "",
    description: "",
    price: 0,
    category: "",
    available: true,
    image: ""
  });

  const filteredItems = activeCategory === "All" 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);
    
  // Handle adding a new menu item
  const handleAddMenuItem = () => {
    // Basic validation
    if (!newMenuItem.name || !newMenuItem.category || newMenuItem.price <= 0) {
      toast({
        title: "Invalid form data",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }
    
    const newId = Math.max(0, ...menuItems.map(item => item.id)) + 1;
    
    setMenuItems([
      ...menuItems,
      {
        id: newId,
        ...newMenuItem
      }
    ]);
    
    // Reset form and close modal
    setNewMenuItem({
      name: "",
      description: "",
      price: 0,
      category: "",
      available: true,
      image: ""
    });
    
    setIsAddMenuItemModalOpen(false);
    
    toast({
      title: "Menu item added",
      description: `${newMenuItem.name} has been added to your menu`,
    });
  };
  
  // Handle editing a menu item
  const handleEditMenuItem = () => {
    if (!editingItemId) return;
    
    setMenuItems(menuItems.map(item => 
      item.id === editingItemId 
        ? { id: editingItemId, ...newMenuItem } 
        : item
    ));
    
    setIsEditMenuItemModalOpen(false);
    setEditingItemId(null);
    
    toast({
      title: "Menu item updated",
      description: `${newMenuItem.name} has been updated in your menu`,
    });
  };
  
  // Start editing an item
  const startEditingItem = (itemId: number) => {
    const itemToEdit = menuItems.find(item => item.id === itemId);
    if (!itemToEdit) return;
    
    setNewMenuItem({
      name: itemToEdit.name,
      description: itemToEdit.description,
      price: itemToEdit.price,
      category: itemToEdit.category,
      available: itemToEdit.available,
      image: itemToEdit.image || ""
    });
    
    setEditingItemId(itemId);
    setIsEditMenuItemModalOpen(true);
  };
  
  // Handle deleting a menu item
  const handleDeleteMenuItem = (itemId: number) => {
    const itemToDelete = menuItems.find(item => item.id === itemId);
    
    if (window.confirm(`Are you sure you want to delete "${itemToDelete?.name}"?`)) {
      setMenuItems(menuItems.filter(item => item.id !== itemId));
      
      toast({
        title: "Menu item deleted",
        description: `${itemToDelete?.name} has been removed from your menu`,
      });
    }
  };
  
  // Handle adding a new category
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Invalid category name",
        description: "Please enter a valid category name.",
        variant: "destructive",
      });
      return;
    }
    
    const newId = Math.max(0, ...categories.map(cat => cat.id)) + 1;
    
    setCategories([
      ...categories,
      {
        id: newId,
        name: newCategoryName.trim()
      }
    ]);
    
    setNewCategoryName("");
    setIsAddCategoryModalOpen(false);
    
    toast({
      title: "Category added",
      description: `${newCategoryName} has been added to your categories`,
    });
  };

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
              <Button onClick={() => setIsAddMenuItemModalOpen(true)}>
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
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsAddCategoryModalOpen(true)}
              >
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
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => startEditingItem(item.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteMenuItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* No items message */}
          {filteredItems.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <p className="text-muted-foreground">No menu items found in this category.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setIsAddMenuItemModalOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add your first menu item
              </Button>
            </div>
          )}
        </div>
      </main>
      
      {/* Add Menu Item Modal */}
      {isAddMenuItemModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Add Menu Item</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsAddMenuItemModalOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Item Name*
                </label>
                <input
                  id="name"
                  type="text"
                  value={newMenuItem.name}
                  onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={newMenuItem.description}
                  onChange={(e) => setNewMenuItem({...newMenuItem, description: e.target.value})}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500 min-h-[100px]"
                />
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-2">
                  Price*
                </label>
                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newMenuItem.price}
                  onChange={(e) => setNewMenuItem({...newMenuItem, price: parseFloat(e.target.value)})}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-2">
                  Category*
                </label>
                <select
                  id="category"
                  value={newMenuItem.category}
                  onChange={(e) => setNewMenuItem({...newMenuItem, category: e.target.value})}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="image" className="block text-sm font-medium mb-2">
                  Image URL
                </label>
                <input
                  id="image"
                  type="url"
                  value={newMenuItem.image}
                  onChange={(e) => setNewMenuItem({...newMenuItem, image: e.target.value})}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  id="available"
                  type="checkbox"
                  checked={newMenuItem.available}
                  onChange={(e) => setNewMenuItem({...newMenuItem, available: e.target.checked})}
                  className="h-4 w-4 text-foodz-500 focus:ring-foodz-500 border-gray-300 rounded"
                />
                <label htmlFor="available" className="ml-2 block text-sm">
                  Available for ordering
                </label>
              </div>
            </div>
            
            <div className="p-6 border-t flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsAddMenuItemModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddMenuItem}>
                Add Item
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Menu Item Modal */}
      {isEditMenuItemModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Edit Menu Item</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsEditMenuItemModalOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium mb-2">
                  Item Name*
                </label>
                <input
                  id="edit-name"
                  type="text"
                  value={newMenuItem.name}
                  onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="edit-description" className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  value={newMenuItem.description}
                  onChange={(e) => setNewMenuItem({...newMenuItem, description: e.target.value})}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500 min-h-[100px]"
                />
              </div>
              
              <div>
                <label htmlFor="edit-price" className="block text-sm font-medium mb-2">
                  Price*
                </label>
                <input
                  id="edit-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newMenuItem.price}
                  onChange={(e) => setNewMenuItem({...newMenuItem, price: parseFloat(e.target.value)})}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="edit-category" className="block text-sm font-medium mb-2">
                  Category*
                </label>
                <select
                  id="edit-category"
                  value={newMenuItem.category}
                  onChange={(e) => setNewMenuItem({...newMenuItem, category: e.target.value})}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="edit-image" className="block text-sm font-medium mb-2">
                  Image URL
                </label>
                <input
                  id="edit-image"
                  type="url"
                  value={newMenuItem.image}
                  onChange={(e) => setNewMenuItem({...newMenuItem, image: e.target.value})}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  id="edit-available"
                  type="checkbox"
                  checked={newMenuItem.available}
                  onChange={(e) => setNewMenuItem({...newMenuItem, available: e.target.checked})}
                  className="h-4 w-4 text-foodz-500 focus:ring-foodz-500 border-gray-300 rounded"
                />
                <label htmlFor="edit-available" className="ml-2 block text-sm">
                  Available for ordering
                </label>
              </div>
            </div>
            
            <div className="p-6 border-t flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsEditMenuItemModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditMenuItem}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Category Modal */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Add Category</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsAddCategoryModalOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-6">
              <label htmlFor="categoryName" className="block text-sm font-medium mb-2">
                Category Name
              </label>
              <input
                id="categoryName"
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                placeholder="e.g. Pasta, Salads, etc."
                required
              />
            </div>
            
            <div className="p-6 border-t flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsAddCategoryModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddCategory}>
                Add Category
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default RestaurantMenu;
