"use client"

import { useState } from "react"
import { ProductCard } from "./ProductCard"

interface Variant { price: number }

interface Product {
  id: string
  name: string
  slug: string
  description?: string | null
  basePrice: number
  thumbnailUrl?: string | null
  category: { id: string; name: string }
  variants: Variant[]
}

interface Category {
  id: string
  name: string
  slug: string
}

interface Props {
  products: Product[]
  categories: Category[]
}

export function ProductGrid({ products, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("all")

  const filtered = activeCategory === "all"
    ? products
    : products.filter((p) => p.category.id === activeCategory)

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
            activeCategory === "all"
              ? "bg-foreground text-background border-foreground"
              : "bg-white text-muted-foreground border-border hover:border-foreground hover:text-foreground"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
              activeCategory === cat.id
                ? "bg-foreground text-background border-foreground"
                : "bg-white text-muted-foreground border-border hover:border-foreground hover:text-foreground"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground text-sm">
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