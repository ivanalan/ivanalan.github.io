import { PauseIcon, PlayIcon } from "lucide-react"
import { useEffect, useRef, useState, type MouseEvent } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AmbientVideoProps = {
  src: string
  poster?: string
  title?: string
  width?: number
  height?: number
  className?: string
  videoClassName?: string
  /** Classes for the paused still. Defaults to videoClassName. */
  stillClassName?: string
  /** Decorative covers hide the video from assistive tech. */
  decorative?: boolean
}

/** Muted looping clip with a play/pause toggle. Paused state shows the poster
 *  still. Playback starts on hydration so reduced motion can hold the still. */
export function AmbientVideo({
  src,
  poster,
  title,
  width,
  height,
  className,
  videoClassName,
  stillClassName,
  decorative = false,
}: AmbientVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  /* Mirrors the element's own play/pause events, so the toggle stays honest
     whether the reader, reduced motion, or a blocked autoplay stopped it. */
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
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
  }, [])

  const toggle = (event: MouseEvent) => {
    /* Covers sit inside links; stop the click from navigating away. */
    event.preventDefault()
    event.stopPropagation()

    const video = ref.current
    if (!video) return

    if (video.paused) {
      void video.play().catch(() => {})
    } else {
      video.pause()
    }
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        title={decorative ? undefined : title}
        width={width}
        height={height}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden={decorative || undefined}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className={cn(
          videoClassName,
          !playing && poster && "invisible",
        )}
      />
      {!playing && poster ? (
        <img
          src={poster}
          alt=""
          width={width}
          height={height}
          aria-hidden="true"
          className={cn(
            "absolute inset-0 size-full object-cover",
            stillClassName ?? videoClassName,
          )}
        />
      ) : null}
      <Button
        size="icon-sm"
        onClick={toggle}
        aria-label={playing ? "Pause animation" : "Play animation"}
        className="absolute right-2 bottom-2 z-10 cursor-pointer bg-background/70 text-foreground opacity-70 supports-backdrop-filter:backdrop-blur-sm hover:bg-background/90 hover:opacity-100 focus-visible:opacity-100"
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </Button>
    </div>
  )
}
