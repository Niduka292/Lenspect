import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ImageIcon, Coffee, Frame, Star, Truck, CreditCard, Clock } from "lucide-react"

const categories = [
  {
    icon: Coffee,
    name: "Mug Printing",
    description: "Your photos wrapped around premium ceramic mugs",
    href: "/products?category=mugs",
    accent: "#D9826C",
  },
  {
    icon: Frame,
    name: "Photo Framing",
    description: "Gallery-quality frames for every wall and moment",
    href: "/products?category=frames",
    accent: "#A3B19B",
  },
  {
    icon: ImageIcon,
    name: "Canvas Prints",
    description: "Stretch your memories across professional canvas",
    href: "/products?category=canvas",
    accent: "#22252A",
  },
]

const steps = [
  { step: "01", title: "Pick your product", description: "Browse mugs, frames, canvas, and more" },
  { step: "02", title: "Upload your photo", description: "See it fitted live on the product before ordering" },
  { step: "03", title: "Place your order", description: "Confirm details and transfer payment via bank" },
  { step: "04", title: "We deliver", description: "Printed and delivered across Sri Lanka" },
]

const reviews = [
  {
    name: "Sanduni P.",
    location: "Colombo",
    text: "Ordered a framed photo for my parents' anniversary. The quality was exceptional and arrived beautifully packaged.",
    rating: 5,
  },
  {
    name: "Kasun R.",
    location: "Kandy",
    text: "Got custom mugs for our office team. Fast turnaround and the print quality is spot on. Highly recommend.",
    rating: 5,
  },
  {
    name: "Dilini M.",
    location: "Galle",
    text: "The canvas print of our family photo looks amazing. Great communication throughout the whole process.",
    rating: 5,
  },
]

export default function HomePage() {
  return (
    <div style={{ backgroundColor: "#FBF9F5" }}>

      {/* Hero */}
      <section className="px-4 py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <span
            className="section-rule mx-auto"
            style={{ display: "block", width: "2.5rem", height: "1px", backgroundColor: "#D9826C", marginBottom: "1.5rem" }}
          />
          <h1
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#22252A", lineHeight: 1.15 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            Your memories,
            <br />
            <span style={{ color: "#D9826C" }}>beautifully printed.</span>
          </h1>
          <p
            style={{ color: "#6B7280", fontFamily: "Inter, sans-serif", maxWidth: "36rem", margin: "0 auto 2.5rem" }}
            className="text-lg leading-relaxed"
          >
            Custom mug printing, photo framing, and canvas prints — crafted in Sri Lanka
            and delivered to your door. Preview your design before you order.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
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
      <section className="px-4 py-16" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <span style={{ display: "block", width: "2.5rem", height: "1px", backgroundColor: "#D9826C", marginBottom: "1rem" }} />
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#22252A" }} className="text-2xl font-bold">
              What we make
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <Link key={cat.name} href={cat.href} className="card-lift block p-6 group">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${cat.accent}18` }}
                >
                  <cat.icon className="h-5 w-5" style={{ color: cat.accent }} />
                </div>
                <h3
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#22252A" }}
                  className="font-semibold mb-2"
                >
                  {cat.name}
                </h3>
                <p style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }} className="text-sm leading-relaxed">
                  {cat.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <span style={{ display: "block", width: "2.5rem", height: "1px", backgroundColor: "#D9826C", marginBottom: "1rem" }} />
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#22252A" }} className="text-2xl font-bold">
              How it works
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={s.step}>
                <span
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#D9826C", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em" }}
                  className="block mb-2"
                >
                  {s.step}
                </span>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#22252A" }} className="font-semibold mb-2">
                  {s.title}
                </h3>
                <p style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }} className="text-sm leading-relaxed">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="px-4 py-12" style={{ backgroundColor: "#EDF0EB" }}>
        <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-6">
          {[
            { icon: Truck, title: "Island-wide delivery", desc: "We deliver to all districts across Sri Lanka" },
            { icon: CreditCard, title: "Bank transfer payment", desc: "Simple and secure — pay via local bank transfer" },
            { icon: Clock, title: "Fast turnaround", desc: "Most orders printed and dispatched within 3 days" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#A3B19B22" }}
              >
                <item.icon className="h-5 w-5" style={{ color: "#A3B19B" }} />
              </div>
              <div>
                <h4 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#22252A" }} className="font-semibold text-sm mb-1">
                  {item.title}
                </h4>
                <p style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }} className="text-xs leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="px-4 py-16" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <span style={{ display: "block", width: "2.5rem", height: "1px", backgroundColor: "#D9826C", marginBottom: "1rem" }} />
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#22252A" }} className="text-2xl font-bold">
              What customers say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {reviews.map((r) => (
              <div key={r.name} className="card-lift p-6">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#D9826C] text-[#D9826C]" />
                  ))}
                </div>
                <p style={{ color: "#22252A", fontFamily: "Inter, sans-serif" }} className="text-sm leading-relaxed mb-4">
                  "{r.text}"
                </p>
                <div>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#22252A" }} className="text-sm font-semibold">
                    {r.name}
                  </p>
                  <p style={{ color: "#A3B19B", fontFamily: "Inter, sans-serif" }} className="text-xs">
                    {r.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-4 py-16">
        <div className="max-w-xl mx-auto text-center">
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#22252A" }} className="text-2xl font-bold mb-4">
            Ready to create something special?
          </h2>
          <p style={{ color: "#6B7280" }} className="text-sm mb-6">
            Browse our full catalog and preview your design before placing an order.
          </p>
          <Button size="lg" asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </section>

    </div>
  )
}