import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const payload = await req.json()
  const { id, email, raw_user_meta_data } = payload.record

  await prisma.user.create({
    data: {
      id,
      email,
      name: raw_user_meta_data?.name ?? null,
    },
  })

  return NextResponse.json({ ok: true })
}