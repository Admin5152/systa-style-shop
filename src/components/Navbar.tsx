import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, LogOut, User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TopUtilityBar } from "./TopUtilityBar";
import { useAdmin } from "@/hooks/useAdmin";

interface NavbarProps {
  cartItemCount: number;
  onCartClick: () => void;
}

export function Navbar({ cartItemCount, onCartClick }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const { isAdmin } = useAdmin();

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <TopUtilityBar />
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="text-2xl md:text-3xl font-heading font-black tracking-tight flex items-center">
              SYSTA<span className="text-accent font-light">/</span>SYSTA
            </Link>
            
            <div className="hidden md:flex items-center gap-8 font-heading text-xs tracking-[0.15em] font-bold">
              <Link
                to="/"
                className={`transition-colors hover:text-accent ${
                  isActive("/") ? "text-accent" : "text-foreground"
                }`}
              >
                HOME
              </Link>
              <Link
                to="/products"
                className={`transition-colors hover:text-accent ${
                  isActive("/products") ? "text-accent" : "text-foreground"
                }`}
              >
                SHOP
              </Link>
              <Link
                to="/contact"
                className={`transition-colors hover:text-accent ${
                  isActive("/contact") ? "text-accent" : "text-foreground"
                }`}
              >
                CONTACT
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`hidden lg:inline text-xs font-bold tracking-widest transition-colors hover:text-foreground ${
                    isActive("/admin") ? "text-foreground" : "text-accent"
                  }`}
                >
                  ADMIN
                </Link>
              )}
              {user ? (
                <>
                  <Link
                    to="/wishlist"
                    className="text-foreground hover:text-accent transition-colors"
                  >
                    <Heart className="h-5 w-5 stroke-[1.5]" />
                  </Link>
                  <Link
                    to="/account"
                    className="text-foreground hover:text-accent transition-colors"
                  >
                    <User className="h-5 w-5 stroke-[1.5]" />
                  </Link>
                  <button
                    onClick={onCartClick}
                    className="flex items-center gap-2 text-foreground hover:text-accent transition-colors font-heading text-xs font-bold tracking-widest"
                  >
                    <ShoppingCart className="h-5 w-5 stroke-[1.5]" />
                    <span className="hidden sm:inline">[ {cartItemCount.toString().padStart(2, '0')} ]</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    title="Sign out"
                    className="text-foreground hover:text-accent transition-colors"
                  >
                    <LogOut className="h-5 w-5 stroke-[1.5]" />
                  </button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/auth")}
                  className="font-heading text-xs tracking-widest rounded-none border-foreground text-foreground hover:bg-foreground hover:text-background h-8"
                >
                  SIGN IN →
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
