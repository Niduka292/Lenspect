import { prisma } from "@/lib/prisma"
import { ProductGrid } from "@/components/product/ProductGrid"

export const revalidate = 60

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        variants: { orderBy: { price: "asc" } },
      },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
    }),
  ])

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold mb-2">Our Products</h1>
        <p className="text-muted-foreground text-sm">
          Custom printing and framing for every occasion
        </p>
      </div>
      <ProductGrid
        products={products.map((p) => ({
          ...p,
          variants: p.variants.map((v) => ({
            ...v,
            options: v.options as Record<string, string>,
          })),
        }))}
        categories={categories}
      />
    </div>
  )
}