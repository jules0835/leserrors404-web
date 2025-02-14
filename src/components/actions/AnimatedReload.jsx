"use client"
import { useState } from "react"
import { RefreshCcw } from "lucide-react"

export function AnimatedReload() {
  const [isSpinning, setIsSpinning] = useState(false)
  const handleClick = () => {
    if (isSpinning) {
      return
    }

    setIsSpinning(true)
    setTimeout(() => setIsSpinning(false), 1000)
  }

  return (
    <div onClick={() => handleClick()}>
      <RefreshCcw className={isSpinning ? "spin-animation" : ""} />
    </div>
  )
}
