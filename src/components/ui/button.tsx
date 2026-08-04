import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9826C] disabled:pointer-events-none disabled:opacity-50 font-[Plus_Jakarta_Sans,sans-serif]",
  {
    variants: {
      variant: {
        default:
          "bg-[#D9826C] text-white rounded-[0.75rem] hover:bg-[#C8705B] active:scale-[0.98]",
        outline:
          "border border-[#E8E4DE] bg-white text-[#22252A] rounded-[0.75rem] hover:border-[#D9826C] hover:text-[#D9826C]",
        secondary:
          "bg-[#EDF0EB] text-[#22252A] rounded-[0.75rem] hover:bg-[#A3B19B] hover:text-white",
        ghost:
          "text-[#22252A] rounded-[0.75rem] hover:bg-[#F0EDE8]",
        destructive:
          "bg-destructive text-white rounded-[0.75rem] hover:bg-destructive/90",
        link: "text-[#D9826C] underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-9 w-9",
        "icon-sm": "h-6 w-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }