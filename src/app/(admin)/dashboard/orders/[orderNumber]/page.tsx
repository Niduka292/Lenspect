import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"
import { notFound } from "next/navigation"
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge"
import { AdminOrderActions } from "../../../../../components/admin/AdminOrderActions"
import Image from "next/image"

export const revalidate = 0

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>
}) {
  await requireAdmin()
  const { orderNumber } = await params

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      items: {
        include: {
          product: { select: { name: true } },
          variant: { select: { options: true } },
        },
      },
      statusLogs: { orderBy: { createdAt: "asc" } },
    },
  })

  if (!order) notFound()

  const shippingAddress = order.shippingAddress as Record<string, string> | null

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Order</p>
          <h1 className="text-xl font-semibold font-mono">{order.orderNumber}</h1>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="space-y-4">
        {/* Customer + shipping */}
        <div className="p-5 rounded-xl border" style={{ backgroundColor: "#FFFFFF" }}>
          <h2 className="font-semibold text-sm mb-3">Customer & Delivery</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Name</p>
              <p className="font-medium">{order.shippingName ?? order.user?.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Phone</p>
              <p className="font-medium">{order.shippingPhone ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Email</p>
              <p className="font-medium">{order.user?.email ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Address</p>
              <p className="font-medium">
                {shippingAddress
                  ? `${shippingAddress.line1}, ${shippingAddress.city}${shippingAddress.district ? `, ${shippingAddress.district}` : ""}`
                  : "—"}
              </p>
            </div>
            {order.notes && (
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground mb-0.5">Notes</p>
                <p className="font-medium">{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="p-5 rounded-xl border" style={{ backgroundColor: "#FFFFFF" }}>
          <h2 className="font-semibold text-sm mb-3">Items</h2>
          <div className="space-y-2">
            {order.items.map((item) => {
              const opts = item.variant?.options as Record<string, string> | null
              return (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.product.name}
                    {opts?.Size ? ` — ${opts.Size}` : ""} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    LKR {(item.unitPrice * item.quantity).toLocaleString()}
                  </span>
                </div>
              )
            })}
            <div className="flex justify-between font-semibold pt-2" style={{ borderTop: "1px solid #E8E4DE" }}>
              <span>Total</span>
              <span style={{ color: "#D9826C" }}>LKR {order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment slip */}
        <div className="p-5 rounded-xl border" style={{ backgroundColor: "#FFFFFF" }}>
          <h2 className="font-semibold text-sm mb-3">Payment Slip</h2>
          {order.paymentSlipUrl ? (
            <div className="space-y-3">
              <div style={{ position: "relative", width: "100%", height: "14rem", borderRadius: "0.5rem", overflow: "hidden", backgroundColor: "#F9F9F9" }}>
                <Image src={order.paymentSlipUrl} alt="Payment slip" fill className="object-contain" />
              </div>
              <a
                href={order.paymentSlipUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline"
                style={{ color: "#D9826C" }}
              >
                Open full size ↗
              </a>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No slip uploaded yet.
            </p>
          )}
          {order.paymentNote && (
            <p className="text-xs mt-2 text-muted-foreground">Note: {order.paymentNote}</p>
          )}
        </div>

        {/* Status actions */}
        <AdminOrderActions order={{
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          paymentSlipUrl: order.paymentSlipUrl,
        }} />

        {/* Status log */}
        <div className="p-5 rounded-xl border" style={{ backgroundColor: "#FFFFFF" }}>
          <h2 className="font-semibold text-sm mb-3">Status History</h2>
          <div className="space-y-2">
            {order.statusLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 text-sm">
                <div style={{ width: "0.5rem", height: "0.5rem", borderRadius: "9999px", backgroundColor: "#A3B19B", marginTop: "0.35rem", flexShrink: 0 }} />
                <div>
                  <span className="font-medium">{log.status.replace(/_/g, " ")}</span>
                  {log.note && <span className="text-muted-foreground ml-2">— {log.note}</span>}
                  <p className="text-xs text-muted-foreground">
                    {new Date(log.createdAt).toLocaleString("en-LK")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}