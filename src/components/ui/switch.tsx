import * as React from "react"
import { cn } from "@/lib/utils"

interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  size?: "sm" | "default"
}

function Switch({
  className,
  checked = false,
  onCheckedChange,
  size = "default",
  disabled,
  ...props
}: SwitchProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return
    props.onClick?.(e)
    onCheckedChange?.(!checked)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      data-size={size}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        // Sizes
        size === "default" ? "h-6 w-11" : "h-5 w-9",
        // States
        checked ? "bg-primary" : "bg-input/90",
        className
      )}
      {...props}
    >
      <span
        data-state={checked ? "checked" : "unchecked"}
        className={cn(
          "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform",
          // Sizes
          size === "default" ? "h-5 w-5" : "h-4 w-4",
          // Translation
          checked 
            ? (size === "default" ? "translate-x-5" : "translate-x-4") 
            : "translate-x-0"
        )}
      />
    </button>
  )
}

export { Switch }
