import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  if (!dbUser || dbUser.role !== "ADMIN") return null
  return dbUser
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      variants: { orderBy: { price: "asc" } },
    },
  })
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(product)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { id } = await params
  const body = await req.json()
  const { variants, ...productData } = body

  // Update product fields
  const product = await prisma.product.update({
    where: { id },
    data: productData,
  })

  // If variants provided, replace them all
  if (variants) {
    await prisma.productVariant.deleteMany({ where: { productId: id } })
    if (variants.length > 0) {
      await prisma.productVariant.createMany({
        data: variants.map((v: {
          options: object
          price: number
          sku?: string
          imageUrl?: string
          description?: string
        }) => ({
          productId: id,
          options: v.options,
          price: v.price,
          sku: v.sku,
          imageUrl: v.imageUrl,
          description: v.description,
        })),
      })
    }
  }

  const updated = await prisma.product.findUnique({
    where: { id },
    include: { variants: true },
  })
  return NextResponse.json(updated)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { id } = await params
  await prisma.productVariant.deleteMany({ where: { productId: id } })
  await prisma.product.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}