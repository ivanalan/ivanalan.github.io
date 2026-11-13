import { useEffect, useState } from "react"

import {
  COVER_BACKDROPS,
  CoverDither,
} from "@/components/CoverDither"
import type { CoverBackdrop } from "@/components/work-tabs.types"
import { cn } from "@/lib/utils"

/** Transparent GIF over a muted dither backdrop. Reduced motion freezes the
 *  shader and swaps the GIF for a static poster (GIFs cannot be paused). */
export function GifCover({
  src,
  poster,
  backdrop,
  className,
  mediaClassName,
}: {
  src: string
  poster?: string
  backdrop: CoverBackdrop
  className?: string
  /** Applied to the foreground GIF/poster only (not the dither). */
  mediaClassName?: string
}) {
  const [animated, setAnimated] = useState(false)
  const preset = COVER_BACKDROPS[backdrop]

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
      <CoverDither backdrop={backdrop} />
      <img
        src={showGif ? src : poster}
        alt=""
        aria-hidden="true"
        className={cn("absolute inset-0 size-full object-cover", mediaClassName)}
      />
    </div>
  )
}
