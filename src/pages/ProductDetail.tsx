import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { products } from "@/lib/products";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { Heart, Minus, Plus, ShoppingCart, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductDetailProps {
  onAddToCart: (product: Product, quantity: number, size: string) => void;
  onBuyNow: (product: Product, quantity: number, size: string) => void;
  isInWishlist: (id: number) => boolean;
  toggleWishlist: (id: number) => void;
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

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Button onClick={() => navigate("/products")}>Back to Products</Button>
      </div>
    );
  }

  // Find similar products based on category
  const similarProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedSize);
  };

  const handleBuyNow = () => {
    onBuyNow(product, quantity, selectedSize);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Product detail section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Product image */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
            >
              <Heart
                className={cn(
                  "h-6 w-6 transition-colors",
                  isInWishlist(product.id)
                    ? "fill-red-500 text-red-500"
                    : "text-muted-foreground"
                )}
              />
            </button>
          </div>

          {/* Product info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <div className="text-3xl font-bold text-primary">
              GHS {product.price.toFixed(2)}
            </div>

            {/* Size selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Size</label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "px-4 py-2 rounded-lg border-2 font-medium transition-all",
                      selectedSize === size
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Most popular: Medium (M)
              </p>
            </div>

            {/* Quantity selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Quantity</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium text-lg">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleAddToCart}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                onClick={handleBuyNow}
                className="flex-1"
                size="lg"
              >
                Buy Now
              </Button>
            </div>

            {/* Category badge */}
            <div className="pt-4 border-t">
              <span className="text-sm text-muted-foreground">Category: </span>
              <span className="text-sm font-medium capitalize">{product.category} Buubu</span>
            </div>
          </div>
        </div>

        {/* Similar products */}
        {similarProducts.length > 0 && (
          <div className="border-t pt-8">
            <h2 className="text-xl font-bold mb-6">Similar Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
