import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const count = await prisma.order.count()
  const seq = String(count + 1).padStart(4, "0")
  return `ORD-${year}-${seq}`
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const {
    items, totalAmount, shippingName,
    shippingPhone, shippingAddress, notes,
  } = body

  const orderNumber = await generateOrderNumber()

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: user.id,
      status: "PENDING",
      paymentMethod: "BANK_TRANSFER",
      totalAmount,
      currency: "LKR",
      shippingName,
      shippingPhone,
      shippingAddress,
      notes,
      items: {
        create: items.map((i: {
          productId: string
          variantId?: string
          quantity: number
          unitPrice: number
          customizationData?: object
        }) => ({
          productId: i.productId,
          variantId: i.variantId ?? null,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          customizationData: i.customizationData ?? null,
        })),
      },
      statusLogs: {
        create: {
          status: "PENDING",
          note: "Order placed",
        },
      },
    },
  })

  return NextResponse.json(order, { status: 201 })
}