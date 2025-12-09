// Centralized product data for server-side validation
export interface ProductData {
  id: number;
  name: string;
  price: number;
}

export const PRODUCT_PRICES: ProductData[] = [
  { id: 1, name: "Fringe Buubu Dress", price: 240.00 },
  { id: 2, name: "Fring Buubu Dress - Purple Style", price: 150.00 },
  { id: 3, name: "Long Buubu Dress", price: 180.00 },
  { id: 4, name: "Long Buubu Dress - Style 2", price: 180.00 },
  { id: 5, name: "Fringe Buubu Dress - Premium", price: 250.00 },
  { id: 6, name: "Long Buubu Dress - Deluxe", price: 200.00 },
  { id: 7, name: "Long Buubu Dress - Short Sleeve", price: 200.00 },
  { id: 8, name: "Long Buubu Dress - Christmas style 1", price: 200.00 },
  { id: 9, name: "Long Buubu Dress - Christmas style 2", price: 200.00 },
  { id: 10, name: "Short Buubu Dress", price: 200.00 },
  { id: 11, name: "Short Buubu Dress - Purple Style", price: 200.00 },
  { id: 12, name: "Long Buubu Dress - Christmas style 3", price: 200.00 },
  { id: 13, name: "Short Buubu Dress- Green Style", price: 200.00 },
  // When you add new products, make sure to add them here too with the same ID and price
  // Example:
  // { id: 7, name: "Your Product Name", price: 150.00 },
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
