export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'long' | 'short' | 'fringe' | 'full-set';
}

export interface CartItem extends Product {
  quantity: number;
}
