import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Initial fetch
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
      if (session?.user?.id) fetchWishlist(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserId(session?.user?.id ?? null);
        if (session?.user?.id) {
          fetchWishlist(session.user.id);
        } else {
          setWishlist([]);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchWishlist = async (uid: string) => {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('product_id')
      .eq('user_id', uid);
    
    if (!error && data) {
      setWishlist(data.map(item => item.product_id));
    }
  };

  const toggleWishlist = async (productId: string) => {
    if (!userId) {
      // If not logged in, we could fallback to local storage or just reject
      // but standard is to reject since we are syncing with DB
      console.warn("User not logged in, wishlist action ignored.");
      return;
    }

    const isCurrentlyIn = wishlist.includes(productId);
    
    // Optimistic UI update
    setWishlist(prev => 
      isCurrentlyIn 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );

    try {
      if (isCurrentlyIn) {
        // Remove from DB
        await supabase
          .from('wishlist_items')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', productId);
      } else {
        // Add to DB
        await supabase
          .from('wishlist_items')
          .insert({ user_id: userId, product_id: productId });
      }
    } catch (error) {
      console.error("Failed to toggle wishlist", error);
      // Revert if failed
      fetchWishlist(userId);
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const clearWishlist = async () => {
    if (!userId) return;
    setWishlist([]);
    await supabase.from('wishlist_items').delete().eq('user_id', userId);
  };

  return {
    wishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
  };
}
