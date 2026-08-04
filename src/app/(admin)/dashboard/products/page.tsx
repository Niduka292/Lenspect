import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil } from "lucide-react"
import { DeleteProductButton } from "@/components/admin/DeleteProductButton"

export default async function ProductsPage() {
  await requireAdmin()

  const products = await prisma.product.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      category: true,
      variants: true,
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Products</h1>
        <Button size="sm" asChild>
          <Link href="/admin/dashboard/products/new">
            <Plus className="h-4 w-4 mr-2" />
            New Product
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Category</th>
              <th className="text-left px-4 py-3 font-medium">Base Price</th>
              <th className="text-left px-4 py-3 font-medium">Variants</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.category.name}</td>
                <td className="px-4 py-3">
                  {p.basePrice ? `LKR ${p.basePrice}` : "—"}
                </td>
                <td className="px-4 py-3">
                  <Badge variant="secondary">{p.variants.length}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={p.isActive ? "default" : "outline"}>
                    {p.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-4 py-3 flex items-center justify-end gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/dashboard/products/${p.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DeleteProductButton id={p.id} name={p.name} />
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No products yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}