import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { DeleteCategoryButton } from "@/components/admin/DeleteCategoryButton"

export default async function CategoriesPage() {
  await requireAdmin()

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Categories</h1>
        <Button size="sm" asChild>
          <Link href="/admin/dashboard/categories/new">
            <Plus className="h-4 w-4 mr-2" />
            New Category
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Slug</th>
              <th className="text-left px-4 py-3 font-medium">Products</th>
              <th className="text-left px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">{cat.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{cat.slug}</td>
                <td className="px-4 py-3">
                  <Badge variant="secondary">{cat._count.products}</Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{cat.sortOrder}</td>
                <td className="px-4 py-3 flex items-center justify-end gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/dashboard/categories/${cat.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DeleteCategoryButton id={cat.id} name={cat.name} />
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No categories yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}