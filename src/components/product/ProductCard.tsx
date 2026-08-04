import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

interface Variant {
  price: number
}

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
    <Link href={`/products/${product.slug}`}>
      <div className="group border rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white">
        <div className="aspect-square bg-slate-100 relative overflow-hidden">
          {product.thumbnailUrl ? (
            <Image
              src={product.thumbnailUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300 text-sm">
              No image
            </div>
          )}
        </div>
        <div className="p-4">
          <Badge variant="secondary" className="text-xs mb-2">
            {product.category.name}
          </Badge>
          <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
          {product.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {product.description}
            </p>
          )}
          <p className="text-sm font-semibold">{priceLabel}</p>
        </div>
      </div>
    </Link>
  )
}