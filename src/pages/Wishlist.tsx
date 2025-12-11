import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { products } from "@/lib/products";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Wishlist() {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleAddToCart = (product: typeof products[0]) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to cart",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          {wishlistProducts.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearWishlist}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary fill-primary" />
          My Wishlist ({wishlistProducts.length})
        </h1>

        {wishlistProducts.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Save items you love by clicking the heart icon
            </p>
            <Button onClick={() => navigate("/products")}>
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="bg-card rounded-lg border overflow-hidden group"
              >
                <div
                  className="relative aspect-square cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-2 right-2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
                  >
                    <Heart className="h-4 w-4 text-primary fill-primary" />
                  </button>
                </div>
                
                <div className="p-3">
                  <h3 className="font-medium text-sm line-clamp-1 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-primary font-bold text-sm mb-3">
                    GHS {product.price.toFixed(2)}
                  </p>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
