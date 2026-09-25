import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";
import { BracketLabel } from "@/components/ui/BracketLabel";

interface ProductsProps {
  onAddToCart: (product: Product) => void;
  isInWishlist: (id: string) => boolean;
  toggleWishlist: (id: string) => void;
}

const categories = [
  { value: 'all', label: 'ALL' },
  { value: 'long', label: 'LONG' },
  { value: 'short', label: 'SHORT' },
  { value: 'fringe', label: 'FRINGE' },
  { value: 'full-set', label: 'FULL SET' },
];

export default function Products({ onAddToCart, isInWishlist, toggleWishlist }: ProductsProps) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: products = [], isLoading } = useProducts();

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <BracketLabel className="mb-4 text-muted-foreground">FULL CATALOG</BracketLabel>
          <h1 className="text-6xl md:text-7xl font-heading font-black tracking-tighter uppercase">
            Shop <span className="font-accent italic font-normal text-accent normal-case">Collection</span>
          </h1>
        </div>

        {/* Search & Filters */}
        <div className="sticky top-[100px] z-20 bg-background/95 backdrop-blur-md pb-6 mb-12 border-b border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="w-full md:w-1/3">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="[ search products ]"
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 font-heading text-xs tracking-widest font-bold">
            {categories.map((category) => (
              <button 
                key={category.value} 
                onClick={() => setSelectedCategory(category.value)}
                className={`transition-colors uppercase pb-1 ${
                  selectedCategory === category.value 
                    ? "text-accent border-b-2 border-accent" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="font-heading text-xs tracking-widest text-muted-foreground mb-8 uppercase text-center md:text-left">
          [ {isLoading ? "LOADING..." : `${filteredProducts.length} PRODUCT${filteredProducts.length !== 1 ? 'S' : ''}`} ]
        </p>

        {/* Loading state */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[3/4] rounded-none bg-muted/50" />
                <Skeleton className="h-4 w-3/4 rounded-none bg-muted/50" />
                <Skeleton className="h-4 w-1/4 rounded-none bg-muted/50" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {filteredProducts.map((product) => (
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

            {filteredProducts.length === 0 && (
              <div className="text-center py-24 border border-dashed border-border mt-12">
                <BracketLabel className="text-muted-foreground mb-4">NO MATCHES</BracketLabel>
                <p className="font-heading text-sm tracking-widest uppercase">
                  No products found. Try a different search or category.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
