"use client"

import { useState } from "react"
import { ProductCard } from "./ProductCard"

interface Variant { price: number }
interface Product {
  id: string; name: string; slug: string; description?: string | null
  basePrice: number; thumbnailUrl?: string | null
  category: { id: string; name: string }; variants: Variant[]
}
interface Category { id: string; name: string; slug: string }

export function ProductGrid({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("all")

  const filtered = activeCategory === "all"
    ? products
    : products.filter((p) => p.category.id === activeCategory)

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        {[{ id: "all", name: "All" }, ...categories].map((cat) => {
          const isActive = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                backgroundColor: isActive ? "#D9826C" : "#FFFFFF",
                color: isActive ? "#FFFFFF" : "#6B7280",
                border: `1px solid ${isActive ? "#D9826C" : "#E8E4DE"}`,
                borderRadius: "9999px",
                padding: "0.5rem 1.25rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {cat.name}
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-sm" style={{ color: "#6B7280" }}>
          No products in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}