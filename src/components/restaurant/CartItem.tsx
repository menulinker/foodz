
import React from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { MenuItemType } from './MenuItem';

interface CartItemProps {
  item: MenuItemType & { quantity: number };
  onUpdateQuantity: (itemId: string, change: number) => void;
  onRemove: (itemId: string) => void;
}

const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  return (
    <div className="flex justify-between border-b pb-4">
      <div className="flex-grow pr-4">
        <div className="flex justify-between mb-1">
          <h3 className="font-medium">{item.name}</h3>
          <span>${(item.price * item.quantity).toFixed(2)}</span>
        </div>
        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
        
        <div className="flex items-center mt-2">
          <button 
            className="p-1 rounded-full border border-gray-200 hover:bg-gray-100"
            onClick={() => onUpdateQuantity(item.id, -1)}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="mx-3 font-medium">{item.quantity}</span>
          <button 
            className="p-1 rounded-full border border-gray-200 hover:bg-gray-100"
            onClick={() => onUpdateQuantity(item.id, 1)}
          >
            <Plus className="h-4 w-4" />
          </button>
          
          <button 
            className="ml-auto text-red-500 hover:text-red-700"
            onClick={() => onRemove(item.id)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
