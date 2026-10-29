import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"
import { OrderStatusBadge } from "../../../../components/admin/OrderStatusBadge"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const revalidate = 0

export default async function AdminOrdersPage() {
  await requireAdmin()

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: { select: { name: true } } } },
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Orders</h1>
        <span className="text-sm text-muted-foreground">{orders.length} total</span>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Order</th>
              <th className="text-left px-4 py-3 font-medium">Customer</th>
              <th className="text-left px-4 py-3 font-medium">Items</th>
              <th className="text-left px-4 py-3 font-medium">Total</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono font-medium text-xs">
                  {order.orderNumber}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{order.user?.name ?? order.shippingName ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">{order.user?.email}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {order.items.map((i) => i.product.name).join(", ")}
                </td>
                <td className="px-4 py-3 font-semibold" style={{ color: "#D9826C" }}>
                  LKR {order.totalAmount.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {new Date(order.createdAt).toLocaleDateString("en-LK", {
                    day: "numeric", month: "short", year: "numeric"
                  })}
                </td>
                <td className="px-4 py-3">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/orders/${order.orderNumber}`}>
                      View
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No orders yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}