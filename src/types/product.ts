export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string;
  category: string;
  size?: string[] | null;
  color?: string[] | null;
  stock_quantity?: number;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}
