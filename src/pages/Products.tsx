import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";
import { Product } from "@/types/product";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductsProps {
  onAddToCart: (product: Product) => void;
}

const categories = [
  { value: 'all', label: 'All Styles' },
  { value: 'long', label: 'Long Buubu' },
  { value: 'short', label: 'Short Buubu' },
  { value: 'fringe', label: 'Fringe Buubu' },
  { value: 'full-set', label: 'Full Set' },
];

export default function Products({ onAddToCart }: ProductsProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Our Collection</h1>
          <p className="text-muted-foreground text-lg">
            Browse our complete range of elegant Buubu dresses
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full max-w-2xl">
            <TabsList className="grid w-full grid-cols-5 h-auto">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.value} 
                  value={category.value}
                  className="text-xs sm:text-sm py-2"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No products found in this category yet. Check back soon!
            </p>
          </div>
        )}

        <div className="text-center mt-12">
          <p className="text-2xl font-bold text-primary">& More!!!</p>
        </div>
      </div>
    </div>
  );
}
