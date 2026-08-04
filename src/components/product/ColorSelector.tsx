"use client"

const colorMap: Record<string, string> = {
  white: "#FFFFFF", black: "#1a1a1a", red: "#ef4444",
  blue: "#3b82f6", green: "#22c55e", yellow: "#eab308",
  pink: "#ec4899", purple: "#a855f7", orange: "#f97316",
}

export function ColorSelector({ colors, selected, onChange }: {
  colors: string[]; selected: string; onChange: (color: string) => void
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#22252A" }}>
        Color: <span style={{ color: "#6B7280", fontWeight: 400 }}>{selected}</span>
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
              style={{
                width: "2rem", height: "2rem",
                borderRadius: "9999px",
                backgroundColor: hex,
                border: isSelected ? "2px solid #D9826C" : "2px solid #E8E4DE",
                transform: isSelected ? "scale(1.15)" : "scale(1)",
                boxShadow: isSelected ? "0 0 0 2px #FBF9F5, 0 0 0 4px #D9826C" : "none",
                transition: "all 0.15s ease",
                cursor: "pointer",
              }}
            />
          )
        })}
      </div>
    </div>
  )
}