import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"
import { ProductForm } from "@/components/admin/ProductForm"

export default async function NewProductPage() {
  await requireAdmin()
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } })
  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold mb-6">New Product</h1>
      <ProductForm categories={categories} />
    </div>
  )
}