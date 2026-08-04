"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    await fetch(`/api/products/${id}`, { method: "DELETE" })
    router.refresh()
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleDelete}>
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  )
}