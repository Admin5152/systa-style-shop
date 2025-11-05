// Centralized product data for server-side validation
export interface ProductData {
  id: number;
  name: string;
  price: number;
}

export const PRODUCT_PRICES: ProductData[] = [
  { id: 1, name: "Fringe Buubu Dress", price: 240.00 },
  { id: 2, name: "Short Buubu Dress", price: 150.00 },
  { id: 3, name: "Long Buubu Dress", price: 180.00 },
  { id: 4, name: "Long Buubu Dress - Style 2", price: 180.00 },
  { id: 5, name: "Fringe Buubu Dress - Premium", price: 250.00 },
  { id: 6, name: "Long Buubu Dress - Deluxe", price: 200.00 },
];

export function validateOrderTotal(items: Array<{ id: number; quantity: number }>, submittedTotal: number): boolean {
  const calculatedTotal = items.reduce((sum, item) => {
    const product = PRODUCT_PRICES.find(p => p.id === item.id);
    if (!product) throw new Error(`Invalid product ID: ${item.id}`);
    return sum + (product.price * item.quantity);
  }, 0);

  // Allow small floating point differences (1 cent)
  return Math.abs(calculatedTotal - submittedTotal) < 0.01;
}
