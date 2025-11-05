import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300">
      <div className="aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader className="p-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.description}</p>
      </CardHeader>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <span className="text-2xl font-bold text-primary">
          GHS {product.price.toFixed(2)}
        </span>
        <Button onClick={() => onAddToCart(product)} size="sm">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
