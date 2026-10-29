import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { OrderConfirmationClient } from "../../../../components/order/OrderConfirmationClient"

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>
}) {
  const { orderNumber } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        include: { product: true, variant: true },
      },
    },
  })

  if (!order || order.userId !== user.id) notFound()

  return <OrderConfirmationClient order={order} />
}