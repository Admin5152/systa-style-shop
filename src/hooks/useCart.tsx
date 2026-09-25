import { useState, useEffect } from "react";
import { CartItem, Product } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any>(null);

  // Listen for auth changes to load cart
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch cart items from Supabase when user changes
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          id,
          quantity,
          size,
          product_id,
          products (
            id,
            title,
            price,
            images,
            slug,
            description,
            stock,
            is_featured,
            is_archived
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;

      // Transform data into CartItem[]
      if (data) {
        const transformedCart = data.map((item: any) => ({
          ...item.products,
          // Use the cart_item id as a unique identifier if needed, but the product ID is what the UI expects for `id`
          // Actually, our CartItem extends Product and adds quantity and size
          cartItemId: item.id,
          quantity: item.quantity,
          size: item.size || "M",
          // ensure we map product fields properly
          id: item.products.id,
          name: item.products.title,
          image: item.products.images && item.products.images.length > 0 ? item.products.images[0] : "",
        })) as CartItem[];
        setCart(transformedCart);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const addToCart = async (product: Product, quantityToAdd: number = 1, size: string = "M") => {
    if (!user) {
      toast.error("Please sign in to add to cart");
      return;
    }

    try {
      // Check if product is already in cart for this user
      const existingItem = cart.find(item => item.id === product.id && item.size === size);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantityToAdd;
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: newQuantity })
          .eq("id", existingItem.cartItemId as string);
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("cart_items")
          .insert({
            user_id: user.id,
            product_id: product.id,
            quantity: quantityToAdd,
            size: size
          });
          
        if (error) throw error;
      }
      
      fetchCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;
    
    // We need to find the cart_item id corresponding to this product
    const item = cart.find(c => c.id === productId);
    if (!item) return;

    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", item.cartItemId as string);
        
      if (error) throw error;
      fetchCart();
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return;
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const item = cart.find(c => c.id === productId);
    if (!item) return;

    try {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("id", item.cartItemId as string);
        
      if (error) throw error;
      fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id);
        
      if (error) throw error;
      setCart([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getItemCount,
  };
}
