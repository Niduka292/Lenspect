import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })
  const pathname = request.nextUrl.pathname

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() { return request.cookies.getAll() },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()

  // Admin routes — must be logged in AND have ADMIN role
  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
    if (!dbUser || dbUser.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // Customer account routes — must be logged in
  if (pathname.startsWith("/customer")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Cart + checkout — must be logged in
  if (pathname.startsWith("/cart") || pathname.startsWith("/checkout")) {
    if (!user) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Everything else (products, home) — public
  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}