import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { BracketLabel } from "@/components/ui/BracketLabel";

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
      className="group cursor-pointer flex flex-col h-full"
      onClick={onClick}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-4 border border-transparent group-hover:border-foreground transition-colors">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Wishlist button */}
        {onToggleWishlist && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleWishlist(); }}
            className="absolute top-4 right-4 p-2 bg-background/0 hover:bg-background/90 backdrop-blur-none transition-all z-10"
          >
            <Heart
              className={cn(
                "h-5 w-5 stroke-[1.5] transition-colors",
                isInWishlist
                  ? "fill-accent text-accent"
                  : "text-foreground group-hover:text-foreground"
              )}
            />
          </button>
        )}
      </div>
      
      <div className="flex flex-col flex-grow justify-between">
        <div className="mb-4">
          <h3 className="font-heading font-black text-xl md:text-2xl tracking-tighter leading-none mb-2">
            {product.name}
          </h3>
          <BracketLabel className="text-muted-foreground">
            GHS {product.price.toFixed(2)}
          </BracketLabel>
        </div>

        <Button 
          onClick={(e) => { e.stopPropagation(); onAddToCart(product); }} 
          size="sm" 
          variant="outline"
          className="w-full h-10 font-heading text-xs tracking-widest rounded-none border-foreground text-foreground hover:bg-foreground hover:text-background"
        >
          ADD TO CART
        </Button>
      </div>
    </div>
  );
}
