import { Product } from "@/types/product";
import fringeBuubu1 from "@/assets/products/fringe-buubu-1.jpg";
import fringeBuubu2 from "@/assets/products/fringe-buubu-2.jpg";

import longBuubu1 from "@/assets/products/long-buubu-1.jpg";
import longBuubu2 from "@/assets/products/long-buubu-2.jpg";
import longBuubu3 from "@/assets/products/long-buubu-3.jpg";
import longBuubu4 from "@/assets/products/long-buubu-short-sleeve-1.jpeg";
import longBuubu5 from "@/assets/products/long-buubu-short-sleeve-2.jpeg";
import longBuubu6 from "@/assets/products/long-buubu-short-sleeve-3.jpeg";
import longBuubu7 from "@/assets/products/long-buubu-dress-orange.jpeg";

import shortBuubu1 from "@/assets/products/short-buubu.jpg";
import shortBuubu2 from "@/assets/products/short-buubu-dress.jpeg";
import shortBuubu3 from "@/assets/products/AI-short-buubu.jpg";
import shortBuubu4 from "@/assets/products/short-buubu-dress-green.jpeg";


export const products: Product[] = [
  {
    id: 1,
    name: "Fringe Buubu Dress",
    description: "Elegant fringe buubu dress with modern styling",
    price: 240.00,
    image: fringeBuubu1,
    category: 'fringe',
  },
  {
    id: 2,
    name: "Short Buubu Dress",
    description: "Comfortable short buubu dress for everyday wear",
    price: 150.00,
    image: shortBuubu1,
    category: 'short',
  },
  {
    id: 3,
    name: "Long Buubu Dress",
    description: "Classic long buubu dress with timeless elegance",
    price: 180.00,
    image: longBuubu1,
    category: 'long',
  },
  {
    id: 4,
    name: "Long Buubu Dress - Style 2",
    description: "Stylish long buubu dress with unique design",
    price: 180.00,
    image: longBuubu2,
    category: 'long',
  },
  {
    id: 5,
    name: "Fringe Buubu Dress - Premium",
    description: "Premium fringe buubu dress with enhanced details",
    price: 250.00,
    image: fringeBuubu2,
    category: 'fringe',
  },
  {
    id: 6,
    name: "Long Buubu Dress - Deluxe",
    description: "Deluxe long buubu dress for special occasions",
    price: 200.00,
    image: longBuubu3,
    category: 'long',
  },
  {
    id: 7,
    name: "Long Buubu Dress - Short Sleeve",
    description: "Deluxe long buubu dress for special occasions",
    price: 200.00,
    image: longBuubu4,
    category: 'long',
  },
  {
    id: 8,
    name: "Long Buubu Dress - Christmas style 1",
    description: "Deluxe long buubu dress for special occasions",
    price: 200.00,
    image: longBuubu5,
    category: 'long',
  },
  {
    id: 9,
    name: "Long Buubu Dress - Blue Style",
    description: "Deluxe long buubu dress for special occasions",
    price: 200.00,
    image: longBuubu6,
    category: 'long',
  },
  {
    id: 10,
    name: "Short Buubu Dress",
    description: "Deluxe long buubu dress for special occasions",
    price: 200.00,
    image: shortBuubu2,
    category: 'short',
  },
  {
    id: 11,
    name: "Short Buubu Dress",
    description: "Deluxe long buubu dress for special occasions",
    price: 200.00,
    image: shortBuubu3,
    category: 'short',
  },
  {
    id: 12,
    name: "Short Buubu Dress - Green Style",
    description: "Deluxe long buubu dress for special occasions",
    price: 200.00,
    image: shortBuubu4,
    category: 'short',
  },
  {
    id: 13,
    name: "Long Buubu Dress - Christmas style 3",
    description: "Deluxe long buubu dress for special occasions",
    price: 200.00,
    image: longBuubu7,
    category: 'long',
  },
  // Add more products here by copying and pasting the structure above
  // Example:
  // {
  //   id: 7,
  //   name: "Your Product Name",
  //   description: "Your product description",
  //   price: 150.00,
  //   image: yourImageImport,
  //   category: 'long', // or 'short', 'fringe', 'full-set'
  // },
];
