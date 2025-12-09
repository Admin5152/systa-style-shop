import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { SearchBar } from "@/components/SearchBar";
import { products } from "@/lib/products";
import { Product } from "@/types/product";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-buubu.jpg";

interface HomeProps {
  onAddToCart: (product: Product) => void;
}

export default function Home({ onAddToCart }: HomeProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const featuredProducts = products.slice(0, 4);
  
  const filteredProducts = searchQuery
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 animate-fade-in">
            BUUBU & MORE
          </h1>
          <p className="text-base md:text-xl mb-6 max-w-2xl mx-auto leading-relaxed">
            Bold, timeless, and unique. Say hello to{" "}
            <span className="font-bold text-primary">SYSTA | SYSTA</span>
          </p>
          <div className="flex flex-wrap gap-2 justify-center text-xs md:text-sm text-primary font-medium mb-8">
            <span>#SYSTASYSTA</span>
            <span>#BuubuVibes</span>
            <span>#EffortlessElegance</span>
          </div>
          <Link to="/products">
            <Button size="lg" className="text-base px-6 py-5">
              Shop Collection
            </Button>
          </Link>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-6 bg-background sticky top-16 z-20 border-b">
        <div className="container mx-auto px-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search for dresses..."
          />
        </div>
      </section>

      {/* Show search results or normal content */}
      {searchQuery ? (
        <section className="py-8 bg-background">
          <div className="container mx-auto px-4">
            <p className="text-sm text-muted-foreground mb-4">
              {filteredProducts.length} result{filteredProducts.length !== 1 && "s"} for "{searchQuery}"
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No products found matching your search.
              </p>
            )}
          </div>
        </section>
      ) : (
        <>
          {/* Featured Carousel */}
          <section className="py-8 md:py-12 bg-background">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Featured</h2>
              <FeaturedCarousel products={featuredProducts} onAddToCart={onAddToCart} />
            </div>
          </section>

          {/* All Products Grid */}
          <section className="py-8 md:py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">All Products</h2>
                <Link to="/products">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2025 SYSTA SYSTA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
