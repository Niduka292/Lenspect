"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Check, Loader2, FileImage } from "lucide-react"
import Image from "next/image"

interface Props {
  orderNumber: string
  existingSlipUrl?: string | null
}

export function SlipUploader({ orderNumber, existingSlipUrl }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(existingSlipUrl ?? null)
  const [uploading, setUploading] = useState(false)
  const [done, setDone] = useState(!!existingSlipUrl)
  const [error, setError] = useState("")

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Local preview
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)

    handleUpload(file)
  }

  async function handleUpload(file: File) {
    setUploading(true)
    setError("")

    const formData = new FormData()
    formData.append("slip", file)

    const res = await fetch(`/api/orders/${orderNumber}/slip`, {
      method: "POST",
      body: formData,
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? "Upload failed. Please try again.")
      setUploading(false)
      return
    }

    setDone(true)
    setUploading(false)
  }

  return (
    <div>
      {preview ? (
        <div className="space-y-3">
          <div
            style={{ position: "relative", width: "100%", height: "12rem", borderRadius: "0.75rem", overflow: "hidden", backgroundColor: "#F9F9F9" }}
          >
            <Image src={preview} alt="Payment slip" fill className="object-contain" />
          </div>
          {done && !uploading && (
            <div className="flex items-center gap-2 text-sm" style={{ color: "#A3B19B", fontFamily: "Inter, sans-serif" }}>
              <Check className="h-4 w-4" />
              Slip uploaded — we'll verify your payment shortly.
            </div>
          )}
          {!done && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              Replace slip
            </Button>
          )}
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{
            width: "100%", padding: "2rem",
            border: "2px dashed #E8E4DE",
            borderRadius: "0.75rem",
            backgroundColor: "#F9F9F9",
            cursor: "pointer",
            textAlign: "center",
            transition: "border-color 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#D9826C")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E8E4DE")}
        >
          <div
            style={{ width: "3rem", height: "3rem", borderRadius: "9999px", backgroundColor: "#EDF0EB", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.75rem" }}
          >
            {uploading
              ? <Loader2 className="h-5 w-5 animate-spin" style={{ color: "#A3B19B" }} />
              : <FileImage className="h-5 w-5" style={{ color: "#A3B19B" }} />
            }
          </div>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#22252A", fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.25rem" }}>
            {uploading ? "Uploading..." : "Click to upload payment slip"}
          </p>
          <p style={{ color: "#6B7280", fontFamily: "Inter, sans-serif", fontSize: "0.75rem" }}>
            JPG, PNG or PDF — screenshot of bank transfer
          </p>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {error && (
        <p className="text-xs mt-2" style={{ color: "#ef4444", fontFamily: "Inter, sans-serif" }}>
          {error}
        </p>
      )}
    </div>
  )
}