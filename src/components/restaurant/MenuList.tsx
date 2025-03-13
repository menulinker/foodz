
import React from 'react';
import MenuItem, { MenuItemType } from './MenuItem';

interface MenuListProps {
  items: MenuItemType[] | null;
  activeCategory: string;
  onAddToCart: (item: MenuItemType) => void;
}

const MenuList = ({ items, activeCategory, onAddToCart }: MenuListProps) => {
  // Filter menu items by category
  const filteredItems = activeCategory === "All" 
    ? items?.filter(item => item.available) 
    : items?.filter(item => item.category === activeCategory && item.available);
    
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">
          {activeCategory === "All" ? "All Menu Items" : activeCategory}
        </h2>
      </div>
      
      <div className="p-6">
        {filteredItems && filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems.map((item) => (
              <MenuItem 
                key={item.id} 
                item={item} 
                onAddToCart={onAddToCart} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No items available in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuList;
