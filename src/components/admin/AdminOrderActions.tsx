"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const STATUS_FLOW = [
  "PENDING",
  "SLIP_SUBMITTED",
  "CONFIRMED",
  "IN_PRODUCTION",
  "READY",
  "DELIVERED",
] as const

type OrderStatus = typeof STATUS_FLOW[number] | "CANCELLED"

interface Props {
  order: {
    id: string
    orderNumber: string
    status: string
    paymentSlipUrl: string | null
  }
}

export function AdminOrderActions({ order }: Props) {
  const router = useRouter()
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const currentIndex = STATUS_FLOW.indexOf(order.status as typeof STATUS_FLOW[number])
  const nextStatus = currentIndex >= 0 && currentIndex < STATUS_FLOW.length - 1
    ? STATUS_FLOW[currentIndex + 1]
    : null

  const nextStatusLabels: Record<string, string> = {
    SLIP_SUBMITTED: "Mark Slip Submitted",
    CONFIRMED:      "Confirm Payment",
    IN_PRODUCTION:  "Mark In Production",
    READY:          "Mark Ready",
    DELIVERED:      "Mark Delivered",
  }

  async function updateStatus(status: string) {
    setLoading(true)
    setError("")

    const res = await fetch(`/api/orders/${order.orderNumber}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, note }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? "Failed to update status")
      setLoading(false)
      return
    }

    setNote("")
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="p-5 rounded-xl border" style={{ backgroundColor: "#FFFFFF" }}>
      <h2 className="font-semibold text-sm mb-4">Update Status</h2>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Note (optional)
          </label>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Verified via HNB ref #1234"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {nextStatus && (
            <Button
              onClick={() => updateStatus(nextStatus)}
              disabled={loading}
              size="sm"
            >
              {nextStatusLabels[nextStatus] ?? nextStatus}
            </Button>
          )}

          {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateStatus("CANCELLED")}
              disabled={loading}
              style={{ borderColor: "#ef4444", color: "#ef4444" }}
            >
              Cancel Order
            </Button>
          )}
        </div>

        {error && (
          <p className="text-xs" style={{ color: "#ef4444" }}>{error}</p>
        )}
      </div>
    </div>
  )
}