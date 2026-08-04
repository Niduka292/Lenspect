"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props {
  initial?: {
    id: string
    name: string
    slug: string
    description?: string | null
    sortOrder: number
  }
}

export function CategoryForm({ initial }: Props) {
  const router = useRouter()
  const [name, setName] = useState(initial?.name ?? "")
  const [slug, setSlug] = useState(initial?.slug ?? "")
  const [description, setDescription] = useState(initial?.description ?? "")
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function generateSlug(value: string) {
    return value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
  }

  async function handleSubmit() {
    setLoading(true)
    setError("")

    const method = initial ? "PUT" : "POST"
    const url = initial ? `/api/categories/${initial.id}` : "/api/categories"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, description, sortOrder }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? "Something went wrong")
      setLoading(false)
      return
    }

    router.push("/dashboard/categories")
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Name</Label>
        <Input
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            if (!initial) setSlug(generateSlug(e.target.value))
          }}
          placeholder="e.g. Photo Frames"
        />
      </div>

      <div className="space-y-2">
        <Label>Slug</Label>
        <Input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="e.g. photo-frames"
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description"
        />
      </div>

      <div className="space-y-2">
        <Label>Sort Order</Label>
        <Input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3 pt-2">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : initial ? "Update" : "Create"}
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/dashboard/categories")}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}