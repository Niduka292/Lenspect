import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Tag, ShoppingBag, Clock } from "lucide-react"

export default async function AdminDashboardPage() {
  await requireAdmin()

  const [productCount, categoryCount, orderCount, pendingCount] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
    ])

  const stats = [
    { label: "Products", value: productCount, icon: Package },
    { label: "Categories", value: categoryCount, icon: Tag },
    { label: "Total Orders", value: orderCount, icon: ShoppingBag },
    { label: "Pending Orders", value: pendingCount, icon: Clock },
  ]

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Overview</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {s.label}
              </CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}