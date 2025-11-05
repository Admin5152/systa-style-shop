import { Product } from "@/types/product";
import fringeBuubu1 from "@/assets/products/fringe-buubu-1.jpg";
import shortBuubu from "@/assets/products/short-buubu.jpg";
import longBuubu1 from "@/assets/products/long-buubu-1.jpg";
import longBuubu2 from "@/assets/products/long-buubu-2.jpg";
import fringeBuubu2 from "@/assets/products/fringe-buubu-2.jpg";
import longBuubu3 from "@/assets/products/long-buubu-3.jpg";

export const products: Product[] = [
  {
    id: 1,
    name: "Fringe Buubu Dress",
    description: "Elegant fringe buubu dress with modern styling",
    price: 240.00,
    image: fringeBuubu1,
  },
  {
    id: 2,
    name: "Short Buubu Dress",
    description: "Comfortable short buubu dress for everyday wear",
    price: 150.00,
    image: shortBuubu,
  },
  {
    id: 3,
    name: "Long Buubu Dress",
    description: "Classic long buubu dress with timeless elegance",
    price: 180.00,
    image: longBuubu1,
  },
  {
    id: 4,
    name: "Long Buubu Dress - Style 2",
    description: "Stylish long buubu dress with unique design",
    price: 180.00,
    image: longBuubu2,
  },
  {
    id: 5,
    name: "Fringe Buubu Dress - Premium",
    description: "Premium fringe buubu dress with enhanced details",
    price: 250.00,
    image: fringeBuubu2,
  },
  {
    id: 6,
    name: "Long Buubu Dress - Deluxe",
    description: "Deluxe long buubu dress for special occasions",
    price: 200.00,
    image: longBuubu3,
  },
];
