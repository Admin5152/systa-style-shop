import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { CartModal } from "@/components/CartModal";
import { CheckoutModal } from "@/components/CheckoutModal";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const queryClient = new QueryClient();

const AppContent = () => {
  const navigate = useNavigate();
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getItemCount,
  } = useCart();

  const { isInWishlist, toggleWishlist } = useWishlist();

  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleAddToCart = (product: Product, quantity: number = 1, size: string = "M") => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    // Add product with quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`${product.name} (${size}) added to cart!`);
  };

  const handleBuyNow = (product: Product, quantity: number = 1, size: string = "M") => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    // Add to cart and open checkout
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setIsCheckoutOpen(true);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = () => {
    clearCart();
  };

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="min-h-screen animate-fade-in">
      <Navbar
        cartItemCount={getItemCount()}
        onCartClick={() => setIsCartOpen(true)}
      />
      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              onAddToCart={handleAddToCart} 
              isInWishlist={isInWishlist}
              toggleWishlist={toggleWishlist}
            />
          } 
        />
        <Route 
          path="/products" 
          element={
            <Products 
              onAddToCart={handleAddToCart}
              isInWishlist={isInWishlist}
              toggleWishlist={toggleWishlist}
            />
          } 
        />
        <Route 
          path="/product/:id" 
          element={
            <ProductDetail 
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              isInWishlist={isInWishlist}
              toggleWishlist={toggleWishlist}
            />
          } 
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
        total={getTotalPrice()}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        total={getTotalPrice()}
        onSuccess={handleCheckoutSuccess}
      />

      <AlertDialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign in required</AlertDialogTitle>
            <AlertDialogDescription>
              Please sign in to add items to your cart and place orders.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setShowAuthDialog(false); navigate("/auth"); }}>
              Sign In
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <AppContent />
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
