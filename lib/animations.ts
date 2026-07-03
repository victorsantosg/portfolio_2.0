type AssemblyCustom = {
  direction?: "left" | "right" | "top" | "bottom" | "scale" | "none"
  delay?: number
}

export const jarvisVariants = {
  hidden: (custom?: AssemblyCustom) => {
    const dir = custom?.direction || "bottom"
    switch (dir) {
      case "left":
        return { x: -150, opacity: 0, scale: 0.9, rotate: -5 }
      case "right":
        return { x: 150, opacity: 0, scale: 0.9, rotate: 5 }
      case "top":
        return { y: -100, opacity: 0, scale: 0.95 }
      case "bottom":
        return { y: 100, opacity: 0, scale: 0.95 }
      case "scale":
        return { scale: 0.6, opacity: 0, rotate: 15 }
      case "none":
        return { opacity: 0 }
      default:
        return { y: 100, opacity: 0 }
    }
  },
  visible: (custom?: AssemblyCustom) => ({
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 75,
      damping: 14,
      delay: custom?.delay || 0,
    },
  }),
}
