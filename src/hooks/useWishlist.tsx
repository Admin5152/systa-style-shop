import { useState, useEffect } from "react";

const WISHLIST_STORAGE_KEY = "systa-wishlist";

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const clearWishlist = () => setWishlist([]);

  return {
    wishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
  };
}
