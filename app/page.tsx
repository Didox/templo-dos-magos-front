"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/header";
import CategorySidebar from "@/components/category-sidebar";
import ProductGrid from "@/components/product-grid";
import CartButton from "@/components/cart-button";
import { useSearch } from "@/contexts/search-context";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const { isSearching } = useSearch();
  const searchTerm = searchParams.get("search");

  // Resetar a categoria selecionada quando houver um termo de busca
  useEffect(() => {
    if (searchTerm) {
      setSelectedCategory(null);
    }
  }, [searchTerm]);

  return (
    <main className="min-h-screen bg-purple-900 bg-opacity-95 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-purple-500 opacity-20"
            style={{
              width: Math.random() * 20 + 5 + "px",
              height: Math.random() * 20 + 5 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <Header />

        <div className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <CategorySidebar
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              disabled={isSearching}
            />
          </div>

          <div className="md:col-span-3">
            <ProductGrid
              selectedCategory={selectedCategory}
              searchTerm={searchTerm}
            />
            <div className="mt-6 flex justify-center">
              <CartButton />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
