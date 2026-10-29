"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useCartStore } from "./../../app/store/cartStore"
import { Button } from "@/components/ui/button"

export function CartBadge() {
  const totalItems = useCartStore((s) => s.totalItems())

  return (
    <Button variant="ghost" size="icon" asChild className="relative">
      <Link href="/cart" aria-label="Cart">
        <ShoppingCart className="h-5 w-5" style={{ color: "#22252A" }} />
        {totalItems > 0 && (
          <span
            className="absolute -top-1 -right-1 flex items-center justify-center text-white rounded-full"
            style={{
              width: "1.1rem", height: "1.1rem",
              backgroundColor: "#D9826C",
              fontSize: "0.6rem", fontWeight: 700,
            }}
          >
            {totalItems > 9 ? "9+" : totalItems}
          </span>
        )}
      </Link>
    </Button>
  )
}