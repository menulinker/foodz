
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';

export interface MenuItemType {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image?: string;
}

interface MenuItemProps {
  item: MenuItemType;
  onAddToCart: (item: MenuItemType) => void;
}

const MenuItem = ({ item, onAddToCart }: MenuItemProps) => {
  return (
    <Card key={item.id} className="overflow-hidden border-gray-100">
      {item.image && (
        <div className="h-40 overflow-hidden">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{item.name}</CardTitle>
          <span className="font-medium text-foodz-600">${item.price.toFixed(2)}</span>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        {item.description && (
          <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          variant="default" 
          size="sm"
          className="w-full"
          onClick={() => onAddToCart(item)}
        >
          <Plus className="mr-1" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MenuItem;
