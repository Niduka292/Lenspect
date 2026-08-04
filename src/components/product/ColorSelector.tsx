"use client"

interface Props {
  colors: string[]
  selected: string
  onChange: (color: string) => void
}

const colorMap: Record<string, string> = {
  white: "#ffffff",
  black: "#1a1a1a",
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#eab308",
  pink: "#ec4899",
  purple: "#a855f7",
  orange: "#f97316",
}

export function ColorSelector({ colors, selected, onChange }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">
        Color: <span className="text-muted-foreground">{selected}</span>
      </p>
      <div className="flex gap-2 flex-wrap">
        {colors.map((color) => {
          const hex = colorMap[color.toLowerCase()] ?? "#e2e8f0"
          const isSelected = selected === color
          return (
            <button
              key={color}
              onClick={() => onChange(color)}
              title={color}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                isSelected
                  ? "border-foreground scale-110 shadow-md"
                  : "border-transparent hover:border-slate-300"
              }`}
              style={{ backgroundColor: hex }}
            />
          )
        })}
      </div>
    </div>
  )
}