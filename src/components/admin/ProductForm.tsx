"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2 } from "lucide-react"

interface Category { id: string; name: string }

interface Variant {
  id?: string
  options: Record<string, string>
  price: number
  imageUrl?: string
  description?: string
  sku?: string
}

interface Props {
  categories: Category[]
  initial?: {
    id: string
    categoryId: string
    name: string
    slug: string
    description?: string | null
    basePrice: number
    isActive: boolean
    sortOrder: number
    optionSchema?: unknown
    thumbnailUrl?: string | null
    variants: Variant[]
  }
}

export function ProductForm({ categories, initial }: Props) {
  const router = useRouter()
  const [name, setName] = useState(initial?.name ?? "")
  const [slug, setSlug] = useState(initial?.slug ?? "")
  const [description, setDescription] = useState(initial?.description ?? "")
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "")
  const [basePrice, setBasePrice] = useState(initial?.basePrice ?? 0)
  const [isActive, setIsActive] = useState(initial?.isActive ?? true)
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0)
  const [thumbnailUrl, setThumbnailUrl] = useState(initial?.thumbnailUrl ?? "")

  // Color options for simple products like mugs
  const [colorInput, setColorInput] = useState("")
  const initialColors = (() => {
    if (!initial?.optionSchema) return []
    const schema = initial.optionSchema as Array<{ name: string; values: string[] }>
    return schema.find((o) => o.name === "Color")?.values ?? []
  })()
  const [colors, setColors] = useState<string[]>(initialColors)

  // Variants for frame-type products
  const [variants, setVariants] = useState<Variant[]>(initial?.variants ?? [])
  const [variantSize, setVariantSize] = useState("")
  const [variantPrice, setVariantPrice] = useState(0)
  const [variantImage, setVariantImage] = useState("")
  const [variantDesc, setVariantDesc] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function generateSlug(value: string) {
    return value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
  }

  function addColor() {
    if (!colorInput.trim()) return
    setColors([...colors, colorInput.trim()])
    setColorInput("")
  }

  function removeColor(color: string) {
    setColors(colors.filter((c) => c !== color))
  }

  function addVariant() {
    if (!variantSize.trim() || variantPrice <= 0) return
    setVariants([
      ...variants,
      {
        options: { Size: variantSize.trim() },
        price: variantPrice,
        imageUrl: variantImage || undefined,
        description: variantDesc || undefined,
      },
    ])
    setVariantSize("")
    setVariantPrice(0)
    setVariantImage("")
    setVariantDesc("")
  }

  function removeVariant(index: number) {
    setVariants(variants.filter((_, i) => i !== index))
  }

  async function handleSubmit() {
    setLoading(true)
    setError("")

    const optionSchema = colors.length > 0
      ? [{ name: "Color", values: colors }]
      : undefined

    const method = initial ? "PUT" : "POST"
    const url = initial ? `/api/products/${initial.id}` : "/api/products"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryId, name, slug, description,
        basePrice, isActive, sortOrder, thumbnailUrl,
        optionSchema,
        variants: variants.length > 0 ? variants : undefined,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? "Something went wrong")
      setLoading(false)
      return
    }

    router.push("/admin/dashboard/products")
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Basic info */}
      <div className="space-y-4">
        <h2 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
          Basic Info
        </h2>

        <div className="space-y-2">
          <Label>Category</Label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>Product Name</Label>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (!initial) setSlug(generateSlug(e.target.value))
            }}
            placeholder="e.g. Custom Mug"
          />
        </div>

        <div className="space-y-2">
          <Label>Slug</Label>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. custom-mug"
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short product description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Base Price (LKR)</Label>
            <Input
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(Number(e.target.value))}
              placeholder="0 if price is per variant"
            />
          </div>
          <div className="space-y-2">
            <Label>Sort Order</Label>
            <Input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Thumbnail URL</Label>
          <Input
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            placeholder="Cloudinary URL"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="isActive">Active (visible to customers)</Label>
        </div>
      </div>

      {/* Color options (for mugs etc.) */}
      <div className="space-y-4 border-t pt-4">
        <h2 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
          Color Options
          <span className="ml-2 normal-case font-normal">(for products like mugs)</span>
        </h2>
        <div className="flex gap-2">
          <Input
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
            placeholder="e.g. White"
            onKeyDown={(e) => e.key === "Enter" && addColor()}
          />
          <Button type="button" variant="outline" onClick={addColor}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {colors.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <Badge
                key={c}
                variant="secondary"
                className="cursor-pointer gap-1"
                onClick={() => removeColor(c)}
              >
                {c} ×
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Size variants (for frames etc.) */}
      <div className="space-y-4 border-t pt-4">
        <h2 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
          Size Variants
          <span className="ml-2 normal-case font-normal">(for products like frames)</span>
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Size</Label>
            <Input
              value={variantSize}
              onChange={(e) => setVariantSize(e.target.value)}
              placeholder={`e.g. 4x6"`}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Price (LKR)</Label>
            <Input
              type="number"
              value={variantPrice || ""}
              onChange={(e) => setVariantPrice(Number(e.target.value))}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Image URL (optional)</Label>
            <Input
              value={variantImage}
              onChange={(e) => setVariantImage(e.target.value)}
              placeholder="Cloudinary URL"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Description (optional)</Label>
            <Input
              value={variantDesc}
              onChange={(e) => setVariantDesc(e.target.value)}
              placeholder="e.g. Perfect for desk display"
            />
          </div>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addVariant}>
          <Plus className="h-4 w-4 mr-2" />
          Add Size
        </Button>

        {variants.length > 0 && (
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left px-3 py-2 font-medium">Size</th>
                  <th className="text-left px-3 py-2 font-medium">Price</th>
                  <th className="text-left px-3 py-2 font-medium">Description</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {variants.map((v, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2">{v.options.Size}</td>
                    <td className="px-3 py-2">LKR {v.price}</td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {v.description ?? "—"}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeVariant(i)}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3 pt-2 border-t">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : initial ? "Update Product" : "Create Product"}
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/dashboard/products")}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}