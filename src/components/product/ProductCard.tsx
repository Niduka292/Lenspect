import Link from "next/link"
import Image from "next/image"

interface Variant { price: number }

interface Product {
  id: string
  name: string
  slug: string
  description?: string | null
  basePrice: number
  thumbnailUrl?: string | null
  category: { name: string }
  variants: Variant[]
}

export function ProductCard({ product }: { product: Product }) {
  const displayPrice = product.variants.length > 0
    ? Math.min(...product.variants.map((v) => v.price))
    : product.basePrice

  const priceLabel = product.variants.length > 0
    ? `from LKR ${displayPrice.toLocaleString()}`
    : `LKR ${displayPrice.toLocaleString()}`

  return (
    <Link href={`/products/${product.slug}`} className="group block card-lift overflow-hidden">
      <div className="aspect-square bg-[#F9F9F9] relative overflow-hidden">
        {product.thumbnailUrl ? (
          <Image
            src={product.thumbnailUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm" style={{ color: "#E8E4DE" }}>
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <span
          className="inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-2"
          style={{ backgroundColor: "#EDF0EB", color: "#A3B19B", fontFamily: "Inter, sans-serif" }}
        >
          {product.category.name}
        </span>
        <h3
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#22252A" }}
          className="font-semibold text-sm mb-1 line-clamp-2"
        >
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs line-clamp-2 mb-2" style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }}>
            {product.description}
          </p>
        )}
        <p className="text-sm font-bold" style={{ color: "#D9826C", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {priceLabel}
        </p>
      </div>
    </Link>
  )
}