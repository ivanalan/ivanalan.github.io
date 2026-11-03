import { useEffect, useState } from "react"
import {
  Dithering,
  type DitheringProps,
} from "@paper-design/shaders-react"

import type { CoverBackdrop } from "@/components/work-tabs.types"
import { cn } from "@/lib/utils"

type BackdropPreset = Pick<
  DitheringProps,
  | "colorBack"
  | "colorFront"
  | "shape"
  | "type"
  | "size"
  | "scale"
  | "rotation"
  | "speed"
> & { strength: number }

/** Locked exploration presets — low contrast so the GIF UI stays brightest. */
const BACKDROPS: Record<CoverBackdrop, BackdropPreset> = {
  "quiet-ripple": {
    colorBack: "#171b22",
    colorFront: "#243040",
    shape: "ripple",
    type: "4x4",
    size: 4.8,
    scale: 0.85,
    rotation: 0,
    speed: 0.09,
    strength: 0.55,
  },
  "deep-teal": {
    colorBack: "#0e1416",
    colorFront: "#1a2c2e",
    shape: "wave",
    type: "4x4",
    size: 4.2,
    scale: 0.95,
    rotation: 6,
    speed: 0.08,
    strength: 0.5,
  },
  "night-indigo": {
    colorBack: "#101218",
    colorFront: "#222848",
    shape: "ripple",
    type: "4x4",
    size: 5,
    scale: 0.8,
    rotation: 0,
    speed: 0.07,
    strength: 0.48,
  },
}

const SHADER_STYLE = { position: "absolute", inset: 0 } as const

/** Transparent GIF over a muted dither backdrop. Reduced motion freezes the
 *  shader and swaps the GIF for a static poster (GIFs cannot be paused). */
export function GifCover({
  src,
  poster,
  backdrop,
  className,
}: {
  src: string
  poster?: string
  backdrop: CoverBackdrop
  className?: string
}) {
  const [animated, setAnimated] = useState(false)
  const preset = BACKDROPS[backdrop]

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setAnimated(!query.matches)

    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  const showGif = animated || !poster

  return (
    <div
      className={cn("relative overflow-hidden rounded-xl", className)}
      style={{ background: preset.colorBack }}
    >
      <div className="absolute inset-0" style={{ opacity: preset.strength }}>
        <Dithering
          colorBack={preset.colorBack}
          colorFront={preset.colorFront}
          shape={preset.shape}
          type={preset.type}
          size={preset.size}
          scale={preset.scale}
          rotation={preset.rotation}
          speed={animated ? preset.speed : 0}
          style={SHADER_STYLE}
        />
      </div>
      <img
        src={showGif ? src : poster}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover"
      />
    </div>
  )
}
