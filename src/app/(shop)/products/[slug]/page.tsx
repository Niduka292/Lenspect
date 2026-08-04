import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ProductDetailClient } from "@/components/product/ProductDetailClient"

export const revalidate = 60

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: true,
      variants: { orderBy: { price: "asc" } },
    },
  })

  if (!product) notFound()

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <ProductDetailClient
        product={{
          ...product,
          variants: product.variants.map((v) => ({
            ...v,
            options: v.options as Record<string, string>,
          })),
        }}
      />
    </div>
  )
}