import { useEffect, useState, useCallback } from "react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeaturedCarouselProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onProductClick?: (id: string) => void;
}

export function FeaturedCarousel({ products, onAddToCart, onProductClick }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  }, [products.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  }, [products.length]);

  useEffect(() => {
    if (!isAutoPlaying || products.length === 0) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, products.length]);

  if (products.length === 0) {
    return null;
  }

  const currentProduct = products[currentIndex];

  const handleClick = () => {
    if (onProductClick) {
      onProductClick(currentProduct.id);
    }
  };

  return (
    <div 
      className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-secondary/50 to-background"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div 
        className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-10 cursor-pointer"
        onClick={handleClick}
      >
        {/* Image */}
        <div className="relative w-full md:w-1/2 aspect-[3/4] max-h-[400px] overflow-hidden rounded-xl">
          <img
            src={currentProduct.image}
            alt={currentProduct.name}
            className="w-full h-full object-cover transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <h3 className="text-2xl md:text-3xl font-bold">{currentProduct.name}</h3>
          <p className="text-muted-foreground">{currentProduct.description}</p>
          <p className="text-3xl font-bold text-primary">GHS {currentProduct.price.toFixed(2)}</p>
          <Button 
            onClick={(e) => { e.stopPropagation(); onAddToCart(currentProduct); }} 
            size="lg" 
            className="w-full md:w-auto"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background shadow-lg transition-all"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background shadow-lg transition-all"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === currentIndex ? "bg-primary w-6" : "bg-muted-foreground/40"
            )}
          />
        ))}
      </div>
    </div>
  );
}
