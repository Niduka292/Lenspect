"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ColorSelector } from "./ColorSelector"
import { VariantSelector } from "./VariantSelector"
import { PreviewPlaceholder } from "./PreviewPlaceholder"
import { ShoppingCart, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Variant {
  id: string; options: Record<string, string>; price: number
  imageUrl?: string | null; description?: string | null
}
interface Product {
  id: string; name: string; slug: string; description?: string | null
  basePrice: number; thumbnailUrl?: string | null; optionSchema?: unknown
  category: { name: string }; variants: Variant[]
}

export function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter()
  const hasVariants = product.variants.length > 0

  const colors = (() => {
    if (!product.optionSchema) return []
    const schema = product.optionSchema as Array<{ name: string; values: string[] }>
    return schema.find((o) => o.name === "Color")?.values ?? []
  })()

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    hasVariants ? product.variants[0] : null
  )
  const [selectedColor, setSelectedColor] = useState<string>(colors[0] ?? "")

  const displayImage = selectedVariant?.imageUrl ?? product.thumbnailUrl
  const displayPrice = selectedVariant?.price ?? product.basePrice
  const displayDescription = selectedVariant?.description ?? product.description

  return (
    <div style={{ backgroundColor: "#FBF9F5" }}>
      {/* Back link */}
      <Link
        href="/products"
        className="inline-flex items-center gap-1 text-sm mb-8"
        style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <div className="grid md:grid-cols-2 gap-10 pb-24 md:pb-0">
        {/* Left — image */}
        <div className="space-y-3">
          <div
            style={{
              aspectRatio: "1 / 1",
              backgroundColor: "#F9F9F9",
              borderRadius: "1rem",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {displayImage ? (
              <Image src={displayImage} alt={product.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm" style={{ color: "#E8E4DE" }}>
                No image
              </div>
            )}
          </div>

          {/* Variant thumbnails */}
          {hasVariants && product.variants.some((v) => v.imageUrl) && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  style={{
                    width: "4rem", height: "4rem", flexShrink: 0,
                    borderRadius: "0.5rem", overflow: "hidden",
                    border: `2px solid ${selectedVariant?.id === v.id ? "#D9826C" : "transparent"}`,
                    position: "relative", cursor: "pointer",
                    backgroundColor: "#F9F9F9",
                  }}
                >
                  {v.imageUrl ? (
                    <Image src={v.imageUrl} alt={v.options.Size ?? ""} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ fontSize: "0.6rem", color: "#6B7280" }}>
                      {v.options.Size}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right — details */}
        <div className="space-y-6">
          <div>
            <span
              className="inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-3"
              style={{ backgroundColor: "#EDF0EB", color: "#A3B19B" }}
            >
              {product.category.name}
            </span>
            <h1
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#22252A", lineHeight: 1.25 }}
              className="text-2xl font-bold mb-3"
            >
              {product.name}
            </h1>
            {displayDescription && (
              <p style={{ color: "#6B7280", fontFamily: "Inter, sans-serif", lineHeight: 1.7 }} className="text-sm">
                {displayDescription}
              </p>
            )}
          </div>

          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#D9826C" }} className="text-2xl font-bold">
            LKR {displayPrice.toLocaleString()}
          </div>

          {colors.length > 0 && (
            <ColorSelector colors={colors} selected={selectedColor} onChange={setSelectedColor} />
          )}

          {hasVariants && selectedVariant && (
            <VariantSelector
              variants={product.variants}
              selected={selectedVariant}
              onChange={setSelectedVariant}
            />
          )}

          <PreviewPlaceholder />

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button size="lg" className="w-full gap-2" onClick={() => router.push("/cart")}>
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
          </div>

          {/* Payment info */}
          <div
            style={{ backgroundColor: "#EDF0EB", borderRadius: "0.75rem", padding: "1rem" }}
            className="text-sm space-y-1.5"
          >
            <p style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }}>💳 Pay via bank transfer after ordering</p>
            <p style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }}>📦 Delivered island-wide across Sri Lanka</p>
            <p style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }}>🖨️ Professional print quality guaranteed</p>
          </div>
        </div>
      </div>

      {/* Sticky mobile CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 md:hidden z-40"
        style={{
          backgroundColor: "#FBF9F5",
          borderTop: "1px solid #E8E4DE",
          padding: "1rem",
        }}
      >
        <Button size="lg" className="w-full gap-2" onClick={() => router.push("/cart")}>
          <ShoppingCart className="h-5 w-5" />
          Add to Cart — LKR {displayPrice.toLocaleString()}
        </Button>
      </div>
    </div>
  )
}