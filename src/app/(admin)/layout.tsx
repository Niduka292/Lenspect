import Link from "next/link"
import { requireAdmin } from "@/lib/admin"
import { LayoutDashboard, Package, Tag, LogOut } from "lucide-react"
import { logout } from "@/lib/supabase/actions"
import { Button } from "@/components/ui/button"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/products", label: "Products", icon: Package },
    { href: "/dashboard/categories", label: "Categories", icon: Tag },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 border-r bg-slate-50 flex flex-col">
        <div className="h-16 flex items-center px-5 border-b">
          <span className="font-semibold text-sm">Lenspect Admin</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-slate-100 transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t">
          <form action={logout}>
            <Button variant="ghost" size="sm" className="w-full justify-start gap-3 text-muted-foreground">
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">
        <div className="h-16 border-b flex items-center px-6">
          <span className="text-sm text-muted-foreground">Studio Dashboard</span>
        </div>
        <div className="flex-1 p-6 overflow-auto">{children}</div>
      </main>
    </div>
  )
}