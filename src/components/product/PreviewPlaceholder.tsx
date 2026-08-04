import { Upload } from "lucide-react"

export function PreviewPlaceholder() {
  return (
    <div
      style={{
        border: "2px dashed #E8E4DE",
        borderRadius: "0.75rem",
        padding: "2rem",
        textAlign: "center",
        backgroundColor: "#F9F9F9",
      }}
    >
      <div
        style={{
          width: "3rem", height: "3rem", borderRadius: "9999px",
          backgroundColor: "#EDF0EB", display: "flex",
          alignItems: "center", justifyContent: "center",
          margin: "0 auto 0.75rem",
        }}
      >
        <Upload className="h-5 w-5" style={{ color: "#A3B19B" }} />
      </div>
      <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#22252A", fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.25rem" }}>
        Upload your photo
      </p>
      <p style={{ color: "#6B7280", fontFamily: "Inter, sans-serif", fontSize: "0.75rem", lineHeight: 1.6 }}>
        See how it looks on the product before you order
      </p>
      <p style={{ color: "#D9826C", fontFamily: "Inter, sans-serif", fontSize: "0.7rem", marginTop: "0.75rem", fontWeight: 500 }}>
        3D preview coming soon
      </p>
    </div>
  )
}