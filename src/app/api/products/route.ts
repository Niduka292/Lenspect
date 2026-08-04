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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const categorySlug = searchParams.get("category")

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(categorySlug && {
        category: { slug: categorySlug },
      }),
    },
    include: {
      category: true,
      variants: { orderBy: { price: "asc" } },
    },
    orderBy: { sortOrder: "asc" },
  })
  return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const body = await req.json()
  const {
    categoryId, name, slug, description, basePrice,
    previewType, modelUrl, thumbnailUrl, previewRegion,
    printAreaMm, dpiMinimum, optionSchema, variants,
  } = body

  const product = await prisma.product.create({
    data: {
      categoryId, name, slug, description,
      basePrice: basePrice ?? 0,
      previewType: previewType ?? "IMAGE_2D",
      modelUrl, thumbnailUrl, previewRegion,
      printAreaMm, dpiMinimum: dpiMinimum ?? 150,
      optionSchema,
      variants: variants?.length
        ? {
            create: variants.map((v: {
              options: object
              price: number
              sku?: string
              imageUrl?: string
              description?: string
            }) => ({
              options: v.options,
              price: v.price,
              sku: v.sku,
              imageUrl: v.imageUrl,
              description: v.description,
            })),
          }
        : undefined,
    },
    include: { variants: true },
  })
  return NextResponse.json(product, { status: 201 })
}