import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { CartModal } from "@/components/CartModal";
import { CheckoutModal } from "@/components/CheckoutModal";
import { useCart } from "@/hooks/useCart";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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

  const handleAddToCart = (product: any) => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = () => {
    clearCart();
  };

  return (
    <div className="min-h-screen">
      <Navbar
        cartItemCount={getItemCount()}
        onCartClick={() => setIsCartOpen(true)}
      />
      <Routes>
        <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
        <Route path="/products" element={<Products onAddToCart={handleAddToCart} />} />
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
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
