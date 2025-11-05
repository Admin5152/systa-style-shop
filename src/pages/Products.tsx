import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";
import { Product } from "@/types/product";

interface ProductsProps {
  onAddToCart: (product: Product) => void;
}

export default function Products({ onAddToCart }: ProductsProps) {
  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Collection</h1>
          <p className="text-muted-foreground text-lg">
            Browse our complete range of elegant Buubu dresses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-2xl font-bold text-primary">& More!!!</p>
        </div>
      </div>
    </div>
  );
}
