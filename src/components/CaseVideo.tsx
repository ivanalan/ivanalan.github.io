import { PauseIcon, PlayIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"

type CaseVideoProps = {
  src: string
  poster?: string
  caption: string
  title: string
  /** Intrinsic size, so the figure holds its box before the poster loads. */
  width: number
  height: number
  /** A silent clip that repeats on its own instead of a demo the reader
   *  starts, so it drops the controls for a single play/pause toggle. */
  ambient?: boolean
}

export function CaseVideo({
  src,
  poster,
  caption,
  title,
  width,
  height,
  ambient = false,
}: CaseVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  /* Mirrors the element's own play/pause events, so the toggle stays honest
     whether the reader, reduced motion, or a blocked autoplay stopped it. */
  const [playing, setPlaying] = useState(false)

  /* Ambient playback starts on hydration rather than through the autoplay
     attribute, so reduced motion holds the clip on its poster frame. */
  useEffect(() => {
    if (!ambient) return

    const query = window.matchMedia("(prefers-reduced-motion: reduce)")

    const sync = () => {
      const video = ref.current
      if (!video) return

      if (query.matches) {
        video.pause()
      } else {
        void video.play().catch(() => {})
      }
    }

    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [ambient])

  const toggle = () => {
    const video = ref.current
    if (!video) return

    if (video.paused) {
      void video.play().catch(() => {})
    } else {
      video.pause()
    }
  }

  return (
    <figure>
      <div className="relative">
        <video
          ref={ref}
          src={src}
          poster={poster}
          title={title}
          width={width}
          height={height}
          controls={!ambient}
          loop={ambient}
          muted={ambient}
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="h-auto w-full rounded-xl bg-muted"
        />
        {ambient && (
          <Button
            size="icon-sm"
            onClick={toggle}
            aria-label={playing ? "Pause animation" : "Play animation"}
            className="absolute right-2 bottom-2 bg-background/70 text-foreground opacity-70 supports-backdrop-filter:backdrop-blur-sm hover:bg-background/90 hover:opacity-100 focus-visible:opacity-100"
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </Button>
        )}
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  )
}
