import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";
import { Product } from "@/types/product";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-buubu.jpg";

interface HomeProps {
  onAddToCart: (product: Product) => void;
}

export default function Home({ onAddToCart }: HomeProps) {
  const featuredProducts = products.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            BUUBU & MORE
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover fashion that speaks your identity. Bold, timeless, and unique. 
            Say hello to <span className="font-bold text-primary">SYSTA | SYSTA</span>...a clothing brand where comfort meets style in every thread.
          </p>
          <p className="text-lg mb-8 text-muted max-w-2xl mx-auto">
            Our Buubu collection is designed for the modern woman who values elegance, ease, and effortless chic.
          </p>
          <div className="flex flex-wrap gap-3 justify-center text-sm text-primary font-medium mb-12">
            <span>#SYSTASYSTA</span>
            <span>#BuubuVibes</span>
            <span>#EffortlessElegance</span>
            <span>#ComfortInStyle</span>
            <span>#RichAuntie</span>
          </div>
          <Link to="/products">
            <Button size="lg" className="text-lg px-8 py-6">
              Shop Collection
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground text-lg">
              Explore our handpicked selection of Buubu dresses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>

          <div className="text-center">
            <Link to="/products">
              <Button size="lg" variant="outline">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2025 SYSTA SYSTA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
