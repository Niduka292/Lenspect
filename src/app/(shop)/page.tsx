import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ImageIcon, Coffee, Frame, Star } from "lucide-react"

const categories = [
  {
    icon: Coffee,
    name: "Mug Printing",
    description: "Custom mugs with your photos and designs",
    href: "/products?category=mugs",
  },
  {
    icon: Frame,
    name: "Photo Framing",
    description: "Premium frames for your memories",
    href: "/products?category=frames",
  },
  {
    icon: ImageIcon,
    name: "Canvas Prints",
    description: "Gallery-quality canvas for any space",
    href: "/products?category=canvas",
  },
]

const steps = [
  { step: "01", title: "Choose a product", description: "Browse our catalog and pick what you want printed" },
  { step: "02", title: "Upload your image", description: "Upload your photo and preview the end result in 3D" },
  { step: "03", title: "Place your order", description: "Confirm your order and transfer payment" },
  { step: "04", title: "We deliver", description: "We print and deliver to your doorstep" },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Turn your photos into
            <span className="text-slate-500"> lasting memories</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Custom mug printing, photo framing, canvas prints and more.
            Preview your design in 3D before you order.
          </p>
          <div className="flex gap-3 justify-center">
            <Button size="lg" asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-12">What we offer</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link key={cat.name} href={cat.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="pt-8 pb-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                      <cat.icon className="h-6 w-6 text-slate-600" />
                    </div>
                    <h3 className="font-semibold mb-2">{cat.name}</h3>
                    <p className="text-sm text-muted-foreground">{cat.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="text-3xl font-bold text-slate-200 mb-3">{s.step}</div>
                <h3 className="font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-muted-foreground text-sm">
            Trusted by customers across Sri Lanka for quality printing and fast delivery
          </p>
        </div>
      </section>
    </div>
  )
}