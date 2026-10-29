"use client"

import { useCartStore } from "../../store/cartStore"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCartStore()
  const router = useRouter()

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div
          style={{ width: "4rem", height: "4rem", borderRadius: "9999px", backgroundColor: "#EDF0EB", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}
        >
          <ShoppingBag className="h-6 w-6" style={{ color: "#A3B19B" }} />
        </div>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#22252A" }} className="text-xl font-bold mb-2">
          Your cart is empty
        </h1>
        <p style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }} className="text-sm mb-6">
          Browse our products and add something you'd like to print.
        </p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <span style={{ display: "block", width: "2.5rem", height: "1px", backgroundColor: "#D9826C", marginBottom: "1rem" }} />
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#22252A" }} className="text-2xl font-bold">
          Your Cart
        </h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Items */}
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 rounded-xl"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8E4DE" }}
            >
              {/* Thumbnail */}
              <div style={{ width: "5rem", height: "5rem", borderRadius: "0.5rem", overflow: "hidden", backgroundColor: "#F9F9F9", flexShrink: 0, position: "relative" }}>
                {item.thumbnailUrl ? (
                  <Image src={item.thumbnailUrl} alt={item.productName} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: "#E8E4DE" }}>
                    No img
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#22252A" }} className="font-semibold text-sm mb-0.5 truncate">
                  {item.productName}
                </h3>
                <div className="flex gap-2 flex-wrap mb-2">
                  {item.variantSize && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#EDF0EB", color: "#A3B19B" }}>
                      {item.variantSize}
                    </span>
                  )}
                  {item.selectedColor && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#EDF0EB", color: "#A3B19B" }}>
                      {item.selectedColor}
                    </span>
                  )}
                </div>
                <p style={{ color: "#D9826C", fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-sm font-bold">
                  LKR {(item.price * item.quantity).toLocaleString()}
                </p>
              </div>

              {/* Quantity + remove */}
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => removeItem(item.id)}>
                  <Trash2 className="h-4 w-4" style={{ color: "#6B7280" }} />
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    style={{ width: "1.75rem", height: "1.75rem", borderRadius: "0.5rem", border: "1px solid #E8E4DE", backgroundColor: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                  >
                    <Minus className="h-3 w-3" style={{ color: "#22252A" }} />
                  </button>
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#22252A", minWidth: "1.25rem", textAlign: "center" }} className="text-sm font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    style={{ width: "1.75rem", height: "1.75rem", borderRadius: "0.5rem", border: "1px solid #E8E4DE", backgroundColor: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                  >
                    <Plus className="h-3 w-3" style={{ color: "#22252A" }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div>
          <div
            className="p-5 rounded-xl sticky top-20"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8E4DE" }}
          >
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#22252A" }} className="font-semibold mb-4">
              Order Summary
            </h2>

            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }} className="truncate max-w-[60%]">
                    {item.productName} × {item.quantity}
                  </span>
                  <span style={{ color: "#22252A", fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="font-medium">
                    LKR {(item.price * item.quantity).toLocaleString()}
                  </span>
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

            <Button className="w-full" size="lg" onClick={() => router.push("/checkout")}>
              Proceed to Checkout
            </Button>

            <Link href="/products" className="block text-center mt-3 text-sm" style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }}>
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}