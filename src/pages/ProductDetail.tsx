import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { Heart, Minus, Plus, ShoppingCart, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { BracketLabel } from "@/components/ui/BracketLabel";

interface ProductDetailProps {
  onAddToCart: (product: Product, quantity: number, size: string) => void;
  onBuyNow: (product: Product, quantity: number, size: string) => void;
  isInWishlist: (id: string) => boolean;
  toggleWishlist: (id: string) => void;
}

const SIZES = ["S", "M", "L", "XL"];

export default function ProductDetail({ 
  onAddToCart, 
  onBuyNow, 
  isInWishlist, 
  toggleWishlist 
}: ProductDetailProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");

  const { data: product, isLoading } = useProduct(id || "");
  const { data: allProducts = [] } = useProducts();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-8 w-20 mb-4" />
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Button onClick={() => navigate("/products")}>Back to Products</Button>
      </div>
    );
  }

  // Find similar products based on category
  const similarProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedSize);
  };

  const handleBuyNow = () => {
    onBuyNow(product, quantity, selectedSize);
  };

  // Use product sizes if available, otherwise use default sizes
  const availableSizes = product.size && product.size.length > 0 ? product.size : SIZES;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Back button */}
        <div className="mb-12">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="font-heading text-xs tracking-widest uppercase hover:bg-transparent hover:text-accent p-0 h-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            BACK TO SHOP
          </Button>
        </div>

        {/* Product detail section */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 mb-24">
          {/* Product image */}
          <div className="relative aspect-[3/4] bg-muted border border-border">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-4 right-4 p-3 bg-background border border-border hover:bg-foreground hover:text-background transition-colors duration-300 group"
            >
              <Heart
                className={cn(
                  "h-5 w-5 transition-colors stroke-[1.5]",
                  isInWishlist(product.id)
                    ? "fill-red-500 text-red-500 group-hover:text-red-500"
                    : ""
                )}
              />
            </button>
            <div className="absolute top-4 left-4">
              <BracketLabel className="bg-background/90 backdrop-blur-sm px-2 py-1">{product.category}</BracketLabel>
            </div>
          </div>

          {/* Product info */}
          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black tracking-tighter mb-4 uppercase">{product.name}</h1>
              <div className="flex items-center gap-4 mb-6">
                <BracketLabel className="text-xl">GHS {product.price.toFixed(2)}</BracketLabel>
              </div>
              <p className="text-muted-foreground font-heading text-sm leading-relaxed">
                {product.description || "A signature piece from the SYSTA SYSTA collection. Designed with an oversized fit and premium fabric for maximum comfort and style."}
              </p>
            </div>

            <div className="space-y-8 py-8 border-y border-border mb-8">
              {/* Size selection */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="font-heading text-xs tracking-widest uppercase font-bold">SELECT SIZE</label>
                  <span className="font-accent italic text-muted-foreground text-sm">Size Guide</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "w-12 h-12 flex items-center justify-center border font-heading text-sm font-bold transition-colors",
                        selectedSize === size
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-foreground"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity selector */}
              <div className="space-y-4">
                <label className="font-heading text-xs tracking-widest uppercase font-bold">QUANTITY</label>
                <div className="flex items-center border border-border w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-muted transition-colors disabled:opacity-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-heading font-bold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-muted transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 border-2 border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background py-4 px-8 font-heading text-sm font-black tracking-widest uppercase transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                ADD TO CART
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-accent text-white py-4 px-8 font-heading text-sm font-black tracking-widest uppercase hover:bg-accent/90 transition-colors duration-300"
              >
                BUY NOW →
              </button>
            </div>
          </div>
        </div>

        {/* Similar products */}
        {similarProducts.length > 0 && (
          <div className="pt-24 border-t border-border">
            <div className="mb-12 text-center">
              <BracketLabel className="mb-4 text-muted-foreground">DISCOVER MORE</BracketLabel>
              <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tighter uppercase">
                Similar <span className="font-accent italic font-normal text-accent normal-case">Styles</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {similarProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={() => onAddToCart(p, 1, "M")}
                  onClick={() => navigate(`/product/${p.id}`)}
                  isInWishlist={isInWishlist(p.id)}
                  onToggleWishlist={() => toggleWishlist(p.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
