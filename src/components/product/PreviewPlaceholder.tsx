import { ImageIcon } from "lucide-react"

export function PreviewPlaceholder() {
  return (
    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-3">
        <ImageIcon className="h-6 w-6 text-slate-400" />
      </div>
      <p className="text-sm font-medium text-slate-600 mb-1">3D Preview</p>
      <p className="text-xs text-muted-foreground">
        Upload your image to preview it on the product
      </p>
      <p className="text-xs text-slate-300 mt-3">Coming soon</p>
    </div>
  )
}