"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ColorSelector } from "./ColorSelector"
import { VariantSelector } from "./VariantSelector"
import { PreviewPlaceholder } from "./PreviewPlaceholder"
import { ShoppingCart } from "lucide-react"

interface Variant {
  id: string
  options: Record<string, string>
  price: number
  imageUrl?: string | null
  description?: string | null
}

interface Product {
  id: string
  name: string
  slug: string
  description?: string | null
  basePrice: number
  thumbnailUrl?: string | null
  optionSchema?: unknown
  category: { name: string }
  variants: Variant[]
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

  function handleAddToCart() {
    // Cart logic comes in next phase
    // For now redirect to login if needed — cart page handles auth check
    router.push("/cart")
  }

  return (
    <div className="grid md:grid-cols-2 gap-12">
      {/* Left — image */}
      <div className="space-y-4">
        <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden relative">
          {displayImage ? (
            <Image
              src={displayImage}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300 text-sm">
              No image
            </div>
          )}
        </div>

        {/* Variant image thumbnails for frames */}
        {hasVariants && product.variants.some((v) => v.imageUrl) && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                  selectedVariant?.id === v.id
                    ? "border-foreground"
                    : "border-transparent"
                }`}
              >
                {v.imageUrl ? (
                  <Image src={v.imageUrl} alt={v.options.Size ?? ""} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xs text-slate-400">
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
          <Badge variant="secondary" className="mb-3">{product.category.name}</Badge>
          <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
          {displayDescription && (
            <p className="text-muted-foreground text-sm leading-relaxed">
              {displayDescription}
            </p>
          )}
        </div>

        <div className="text-2xl font-bold">
          LKR {displayPrice.toLocaleString()}
        </div>

        {/* Color selector for mugs */}
        {colors.length > 0 && (
          <ColorSelector
            colors={colors}
            selected={selectedColor}
            onChange={setSelectedColor}
          />
        )}

        {/* Size selector for frames */}
        {hasVariants && (
          <VariantSelector
            variants={product.variants}
            selected={selectedVariant!}
            onChange={setSelectedVariant}
          />
        )}

        {/* 3D Preview placeholder */}
        <PreviewPlaceholder />

        {/* Add to cart */}
        <Button size="lg" className="w-full gap-2" onClick={handleAddToCart}>
          <ShoppingCart className="h-5 w-5" />
          Add to Cart
        </Button>

        {/* Payment info */}
        <div className="border rounded-lg p-4 text-sm space-y-2 text-muted-foreground">
          <p>💳 Payment via bank transfer after order placement</p>
          <p>📦 Delivery across Sri Lanka</p>
          <p>🖨️ High quality professional printing</p>
        </div>
      </div>
    </div>
  )
}