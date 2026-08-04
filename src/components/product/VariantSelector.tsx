"use client"

interface Variant {
  id: string
  options: Record<string, string>
  price: number
  imageUrl?: string | null
  description?: string | null
}

interface Props {
  variants: Variant[]
  selected: Variant
  onChange: (variant: Variant) => void
}

export function VariantSelector({ variants, selected, onChange }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Size</p>
      <div className="flex gap-2 flex-wrap">
        {variants.map((v) => {
          const isSelected = selected.id === v.id
          return (
            <button
              key={v.id}
              onClick={() => onChange(v)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                isSelected
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-white text-foreground hover:border-foreground"
              }`}
            >
              {v.options.Size}
            </button>
          )
        })}
      </div>
    </div>
  )
}