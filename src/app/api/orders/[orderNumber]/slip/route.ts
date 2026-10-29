import { prisma } from "@/lib/prisma"
import { cloudinary } from "@/lib/cloudinary/client"
import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const order = await prisma.order.findUnique({ where: { orderNumber } })
  if (!order || order.userId !== user.id) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  // Read file from form data
  const formData = await req.formData()
  const file = formData.get("slip") as File | null
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

  // Convert to buffer for Cloudinary
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Upload to Cloudinary
  const result = await new Promise<{ secure_url: string; public_id: string }>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `studio-app/payment-slips`,
            public_id: `${orderNumber}-slip`,
            overwrite: true,
            resource_type: "auto",
          },
          (error, result) => {
            if (error || !result) reject(error)
            else resolve(result as { secure_url: string; public_id: string })
          }
        )
        .end(buffer)
    }
  )

  // Update order
  await prisma.order.update({
    where: { orderNumber },
    data: {
      paymentSlipUrl: result.secure_url,
      status: "SLIP_SUBMITTED",
    },
  })

  await prisma.orderStatusLog.create({
    data: {
      orderId: order.id,
      status: "SLIP_SUBMITTED",
      note: "Customer uploaded payment slip",
    },
  })

  return NextResponse.json({ url: result.secure_url })
}