import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string;
  category: string;
  size: string[] | null;
  color: string[] | null;
  stock_quantity: number;
}

const normalizePublicStorageUrl = (url: string) => {
  // Avoid breaking the protocol (https://) — only collapse repeated slashes
  // AFTER the bucket segment in public storage URLs.
  return url
    .trim()
    .replace(/(\/storage\/v1\/object\/public\/[^/]+)\/{2,}/g, "$1/");
};

const getPublicUrl = (imageUrl: string | null): string => {
  if (!imageUrl) return "/placeholder.svg";

  // If it's already a full public storage URL, normalize it and return.
  // (Fixes common issue: pasted URLs like .../public/clothes//file.jpg)
  if (imageUrl.startsWith("http")) {
    return normalizePublicStorageUrl(imageUrl);
  }

  // If it's just a filename or path, build the public URL.
  const cleanPath = imageUrl.trim().replace(/^\/+/, "");
  const { data } = supabase.storage.from("clothes").getPublicUrl(cleanPath);
  return data.publicUrl;
};

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name)")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data || []).map((item) => ({
        id: item.id,
        name: item.title,
        description: item.description,
        price: Number(item.price),
        image: item.images && item.images.length > 0 ? getPublicUrl(item.images[0]) : "/placeholder.svg",
        category: item.categories?.name || "Uncategorized",
        size: null,
        color: null,
        stock_quantity: item.stock,
      }));
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name)")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null;
        throw error;
      }

      return {
        id: data.id,
        name: data.title,
        description: data.description,
        price: Number(data.price),
        image: data.images && data.images.length > 0 ? getPublicUrl(data.images[0]) : "/placeholder.svg",
        category: data.categories?.name || "Uncategorized",
        size: null,
        color: null,
        stock_quantity: data.stock,
      };
    },
    enabled: !!id,
  });
};
