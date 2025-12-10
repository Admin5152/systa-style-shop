import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onClick?: () => void;
  isInWishlist?: boolean;
  onToggleWishlist?: () => void;
}

export function ProductCard({ 
  product, 
  onAddToCart, 
  onClick,
  isInWishlist = false,
  onToggleWishlist
}: ProductCardProps) {
  return (
    <div 
      className="group cursor-pointer"
      onClick={onClick}
    >
      {/* Compact Amazon-style card */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Wishlist button */}
        {onToggleWishlist && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleWishlist(); }}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors z-10"
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                isInWishlist
                  ? "fill-red-500 text-red-500"
                  : "text-muted-foreground"
              )}
            />
          </button>
        )}

        {/* Quick add button on hover */}
        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }} 
            size="sm" 
            className="w-full h-8 text-xs"
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            Add to Cart
          </Button>
        </div>
      </div>
      
      {/* Compact info section */}
      <div className="mt-2 space-y-1">
        <h3 className="font-medium text-sm line-clamp-2 leading-tight">
          {product.name}
        </h3>
        <p className="text-lg font-bold text-primary">
          GHS {product.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
