import { requireAdmin } from "@/lib/admin"
import { CategoryForm } from "@/components/admin/CategoryForm"

export default async function NewCategoryPage() {
  await requireAdmin()
  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-semibold mb-6">New Category</h1>
      <CategoryForm />
    </div>
  )
}