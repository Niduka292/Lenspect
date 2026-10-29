import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params

  // Admin only
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  if (!dbUser || dbUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { status, note } = await req.json()

  const order = await prisma.order.findUnique({ where: { orderNumber } })
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 })

  await prisma.order.update({
    where: { orderNumber },
    data: {
      status,
      ...(status === "CONFIRMED" ? { paidAt: new Date() } : {}),
      ...(note ? { paymentNote: note } : {}),
    },
  })

  await prisma.orderStatusLog.create({
    data: {
      orderId: order.id,
      status,
      note: note || null,
    },
  })

  return NextResponse.json({ ok: true })
}