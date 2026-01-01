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

const getPublicUrl = (imageUrl: string | null): string => {
  if (!imageUrl) return "/placeholder.svg";
  
  // If it's already a full URL, return as-is
  if (imageUrl.startsWith("http")) return imageUrl;
  
  // Build the public URL from the storage bucket
  const { data } = supabase.storage.from("clothes").getPublicUrl(imageUrl);
  return data.publicUrl;
};

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("clothes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data || []).map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: Number(item.price),
        image: getPublicUrl(item.image_url),
        category: item.category,
        size: item.size,
        color: item.color,
        stock_quantity: item.stock_quantity,
      }));
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from("clothes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null;
        throw error;
      }

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        price: Number(data.price),
        image: getPublicUrl(data.image_url),
        category: data.category,
        size: data.size,
        color: data.color,
        stock_quantity: data.stock_quantity,
      };
    },
    enabled: !!id,
  });
};
