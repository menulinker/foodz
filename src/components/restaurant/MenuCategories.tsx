
import React from 'react';

interface MenuCategoriesProps {
  categories: { id: string; name: string }[] | null;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const MenuCategories = ({ categories, activeCategory, onCategoryChange }: MenuCategoriesProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
      <h2 className="text-lg font-semibold mb-4">Menu Categories</h2>
      
      <div className="space-y-2">
        <button
          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
            activeCategory === "All" 
              ? "bg-foodz-100 text-foodz-800 font-medium" 
              : "hover:bg-gray-100"
          }`}
          onClick={() => onCategoryChange("All")}
        >
          All Items
        </button>
        
        {categories?.map((category) => (
          <button
            key={category.id}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
              activeCategory === category.name 
                ? "bg-foodz-100 text-foodz-800 font-medium" 
                : "hover:bg-gray-100"
            }`}
            onClick={() => onCategoryChange(category.name)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuCategories;
