import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types/product";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-buubu.jpg";
import { Skeleton } from "@/components/ui/skeleton";
import { BracketLabel } from "@/components/ui/BracketLabel";
import { MarqueeTicker } from "@/components/MarqueeTicker";

interface HomeProps {
  onAddToCart: (product: Product) => void;
  isInWishlist: (id: string) => boolean;
  toggleWishlist: (id: string) => void;
}

export default function Home({ onAddToCart, isInWishlist, toggleWishlist }: HomeProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: products = [], isLoading } = useProducts();
  
  const filteredProducts = searchQuery
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row min-h-[85vh] border-b border-border">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-20 flex flex-col justify-between relative bg-background">
          <div className="flex justify-between items-start w-full absolute top-8 left-0 px-8 md:px-12 lg:px-20">
            <BracketLabel>COLLECTION / SS_'26</BracketLabel>
            <BracketLabel>001 / 010</BracketLabel>
          </div>
          
          <div className="mt-24 md:mt-32">
            <BracketLabel className="mb-6">SYSTA · SYSTA</BracketLabel>
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-heading font-black tracking-tighter leading-[0.8] mb-0 text-foreground">
              BE
            </h1>
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-accent italic text-accent mt-[-10px] ml-1 mb-8">
              yourself
            </h2>
            
            <p className="font-heading font-bold tracking-widest text-xs md:text-sm max-w-sm mb-16 uppercase leading-relaxed text-muted-foreground">
              BOLD · TIMELESS · UNIQUE — THE BUUBU EDITION
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8 w-full mt-auto">
            <BracketLabel className="text-[10px] text-muted-foreground max-w-[200px] leading-relaxed">
              A STUDY IN SILHOUETTE, RESTRAINT, AND GHANAIAN CRAFT.
            </BracketLabel>
            <Link to="/products">
              <Button size="lg" className="rounded-none bg-foreground text-background font-heading tracking-widest text-xs h-12 px-8 hover:bg-accent hover:text-white transition-colors">
                SHOP COLLECTION →
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 relative bg-black min-h-[50vh] md:min-h-full overflow-hidden">
          {/* Background Image filling the entire panel */}
          <img 
            src={heroImage} 
            alt="SYSTA Buubu" 
            className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
          />
          
          {/* Decorative ambient blobs over the image for mood */}
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-accent/30 blur-[120px] pointer-events-none" />
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-orange-500/20 blur-[120px] pointer-events-none" />
          
          <div className="absolute top-8 right-8 z-10">
            <BracketLabel className="text-white backdrop-blur-md bg-black/20">BUUBU & MORE</BracketLabel>
          </div>
        </div>
      </section>

      <MarqueeTicker />

      {/* Search Section */}
      <section className="py-12 border-b border-border bg-background">
        <div className="container mx-auto px-4 max-w-2xl">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="[ search dresses ]"
          />
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <BracketLabel className="mb-4 text-muted-foreground">POPULAR PRODUCTS</BracketLabel>
              <h2 className="text-5xl md:text-6xl font-heading font-black tracking-tight text-foreground flex items-baseline gap-3">
                The <span className="font-accent italic text-accent font-normal text-6xl md:text-7xl">Collection</span>
              </h2>
            </div>
            <Link to="/products" className="font-heading text-xs tracking-widest font-bold border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-colors">
              VIEW ALL →
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[3/4] rounded-none bg-muted/50" />
                  <Skeleton className="h-4 w-3/4 rounded-none bg-muted/50" />
                  <Skeleton className="h-4 w-1/4 rounded-none bg-muted/50" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {searchQuery && (
                <p className="text-sm font-heading tracking-widest text-muted-foreground mb-8 uppercase">
                  [ {filteredProducts.length} result{filteredProducts.length !== 1 && "s"} for "{searchQuery}" ]
                </p>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                {(searchQuery ? filteredProducts : products.slice(0, 4)).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    onClick={() => navigate(`/product/${product.id}`)}
                    isInWishlist={isInWishlist(product.id)}
                    onToggleWishlist={() => toggleWishlist(product.id)}
                  />
                ))}
              </div>
              
              {searchQuery && filteredProducts.length === 0 && (
                <div className="text-center py-24 border border-dashed border-border">
                  <BracketLabel className="text-muted-foreground mb-4">NO MATCHES</BracketLabel>
                  <p className="font-heading text-sm tracking-widest uppercase">
                    Try another search term.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
