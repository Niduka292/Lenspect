import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav
      style={{ backgroundColor: "#FBF9F5", borderBottom: "1px solid #E8E4DE" }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#22252A" }}
            className="font-bold text-lg tracking-tight"
          >
            Lenspect
          </span>
          <span
            style={{ color: "#D9826C", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            className="font-light text-lg"
          >
            Studio
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/products"
            style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }}
            className="text-sm hover:text-[#22252A] transition-colors"
          >
            Products
          </Link>
          {user && (
            <Link
              href="/customer/orders"
              style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }}
              className="text-sm hover:text-[#22252A] transition-colors"
            >
              My Orders
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" style={{ color: "#22252A" }} />
            </Link>
          </Button>

          {user ? (
            <Button variant="outline" size="sm" asChild>
              <Link href="/customer/orders">Account</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}