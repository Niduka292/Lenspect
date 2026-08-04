"use client"

interface Variant {
  id: string; options: Record<string, string>
  price: number; imageUrl?: string | null; description?: string | null
}

export function VariantSelector({ variants, selected, onChange }: {
  variants: Variant[]; selected: Variant; onChange: (v: Variant) => void
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#22252A" }}>
        Size
      </p>
      <div className="flex gap-2 flex-wrap">
        {variants.map((v) => {
          const isSelected = selected.id === v.id
          return (
            <button
              key={v.id}
              onClick={() => onChange(v)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "0.75rem",
                border: `1.5px solid ${isSelected ? "#D9826C" : "#E8E4DE"}`,
                backgroundColor: isSelected ? "#D9826C" : "#FFFFFF",
                color: isSelected ? "#FFFFFF" : "#22252A",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {v.options.Size}
            </button>
          )
        })}
      </div>
    </div>
  )
}