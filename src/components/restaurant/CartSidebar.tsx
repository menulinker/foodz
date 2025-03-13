
import React, { useState } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CartItem from './CartItem';
import { MenuItemType } from './MenuItem';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: (MenuItemType & { quantity: number })[];
  onUpdateQuantity: (itemId: string, change: number) => void;
  onRemoveItem: (itemId: string) => void;
  onSubmitOrder: () => void;
  isSubmittingOrder: boolean;
  customerNotes: string;
  onCustomerNotesChange: (notes: string) => void;
  cartTotal: number;
}

const CartSidebar = ({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQuantity, 
  onRemoveItem, 
  onSubmitOrder, 
  isSubmittingOrder,
  customerNotes,
  onCustomerNotesChange,
  cartTotal
}: CartSidebarProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Order</h2>
          <button 
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-6">
          {cart.length > 0 ? (
            <div className="space-y-4">
              {cart.map((item) => (
                <CartItem 
                  key={item.id}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemoveItem}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-muted-foreground">Your cart is empty</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={onClose}
              >
                Add Items
              </Button>
            </div>
          )}
          
          {cart.length > 0 && (
            <div className="mt-6">
              <label htmlFor="notes" className="block text-sm font-medium mb-2">
                Order Notes (Optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
                placeholder="Special instructions, allergies, etc."
                value={customerNotes}
                onChange={(e) => onCustomerNotesChange(e.target.value)}
              />
            </div>
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="p-6 border-t">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between mb-4">
              <span className="font-medium">Total</span>
              <span className="text-xl font-semibold">${cartTotal.toFixed(2)}</span>
            </div>
            
            <Button 
              className="w-full"
              onClick={onSubmitOrder}
              isLoading={isSubmittingOrder}
            >
              <ShoppingBag className="mr-2" />
              Order Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;
