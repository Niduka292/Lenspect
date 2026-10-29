"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCartStore } from "../../app/store/cartStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export function CheckoutClient({ userId }: { userId: string }) {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCartStore()

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [district, setDistrict] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handlePlaceOrder() {
    if (!name || !phone || !address || !city) {
      setError("Please fill in all required fields.")
      return
    }
    if (items.length === 0) {
      setError("Your cart is empty.")
      return
    }

    setLoading(true)
    setError("")

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
          unitPrice: i.price,
          customizationData: {
            selectedColor: i.selectedColor,
          },
        })),
        totalAmount: totalPrice(),
        shippingName: name,
        shippingPhone: phone,
        shippingAddress: { line1: address, city, district },
        notes,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? "Something went wrong. Please try again.")
      setLoading(false)
      return
    }

    const order = await res.json()
    clearCart()
    router.push(`/orders/${order.orderNumber}`)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <span style={{ display: "block", width: "2.5rem", height: "1px", backgroundColor: "#D9826C", marginBottom: "1rem" }} />
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#22252A" }} className="text-2xl font-bold">
          Checkout
        </h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Shipping form */}
        <div className="md:col-span-2 space-y-5">
          <div
            className="p-5 rounded-xl"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8E4DE" }}
          >
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#22252A" }} className="font-semibold mb-4">
              Delivery Details
            </h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Full Name *</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
              </div>
              <div className="space-y-1.5">
                <Label>Phone Number *</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07X XXX XXXX" />
              </div>
              <div className="space-y-1.5">
                <Label>Address *</Label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street address" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>City *</Label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Colombo" />
                </div>
                <div className="space-y-1.5">
                  <Label>District</Label>
                  <Input value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="Western" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Order Notes (optional)</Label>
                <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special instructions?" />
              </div>
            </div>
          </div>

          {/* Payment info */}
          <div
            className="p-5 rounded-xl"
            style={{ backgroundColor: "#EDF0EB", border: "1px solid #A3B19B33" }}
          >
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#22252A" }} className="font-semibold mb-3">
              How payment works
            </h2>
            <ol className="space-y-2 text-sm" style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }}>
              <li>1. Place your order — you'll receive an order number and our bank details.</li>
              <li>2. Transfer the total amount to our bank account.</li>
              <li>3. Upload your payment slip on the order confirmation page.</li>
              <li>4. We verify and begin printing once payment is confirmed.</li>
            </ol>
          </div>
        </div>

        {/* Order summary */}
        <div>
          <div
            className="p-5 rounded-xl sticky top-20"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8E4DE" }}
          >
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#22252A" }} className="font-semibold mb-4">
              Your Order
            </h2>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div style={{ width: "3rem", height: "3rem", borderRadius: "0.5rem", overflow: "hidden", backgroundColor: "#F9F9F9", flexShrink: 0, position: "relative" }}>
                    {item.thumbnailUrl && (
                      <Image src={item.thumbnailUrl} alt={item.productName} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#22252A" }} className="text-xs font-semibold truncate">
                      {item.productName}
                    </p>
                    {item.variantSize && (
                      <p className="text-xs" style={{ color: "#6B7280" }}>{item.variantSize}</p>
                    )}
                    <p className="text-xs" style={{ color: "#6B7280" }}>× {item.quantity}</p>
                  </div>
                  <p style={{ color: "#22252A", fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-xs font-semibold">
                    LKR {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid #E8E4DE", paddingTop: "1rem", marginBottom: "1.25rem" }}>
              <div className="flex justify-between">
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#22252A" }} className="font-semibold">
                  Total
                </span>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#D9826C" }} className="font-bold text-lg">
                  LKR {totalPrice().toLocaleString()}
                </span>
              </div>
            </div>

            {error && (
              <p className="text-xs mb-3" style={{ color: "#ef4444", fontFamily: "Inter, sans-serif" }}>
                {error}
              </p>
            )}

            <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={loading}>
              {loading ? "Placing Order..." : "Place Order"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}