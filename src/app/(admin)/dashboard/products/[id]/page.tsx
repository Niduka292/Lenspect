import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"
import { ProductForm } from "@/components/admin/ProductForm"
import { notFound } from "next/navigation"

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { variants: { orderBy: { price: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ])

  if (!product) notFound()

  const initial = {
    id: product.id,
    categoryId: product.categoryId,
    name: product.name,
    slug: product.slug,
    description: product.description,
    basePrice: product.basePrice,
    isActive: product.isActive,
    sortOrder: product.sortOrder,
    optionSchema: product.optionSchema,
    thumbnailUrl: product.thumbnailUrl,
    variants: product.variants.map((v) => ({
      id: v.id,
      options: v.options as Record<string, string>,
      price: v.price,
      sku: v.sku ?? undefined,
      imageUrl: v.imageUrl ?? undefined,
      description: v.description ?? undefined,
    })),
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold mb-6">Edit Product</h1>
      <ProductForm categories={categories} initial={initial} />
    </div>
  )
}