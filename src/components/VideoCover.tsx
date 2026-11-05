import { AmbientVideo } from "@/components/AmbientVideo"
import {
  COVER_BACKDROPS,
  CoverDither,
} from "@/components/CoverDither"
import type { CoverBackdrop } from "@/components/work-tabs.types"
import { cn } from "@/lib/utils"

/** Sibling HEVC-with-alpha for Safari / iOS Chrome (WebKit ignores WebM alpha). */
function hevcSibling(src: string) {
  return src.endsWith(".webm") ? src.replace(/\.webm$/, "-hevc.mp4") : undefined
}

/** Card cover: ambient clip cropped to the frame. Optional dither sits behind
 *  transparent WebM/alpha posters. */
export function VideoCover({
  src,
  poster,
  backdrop,
  className,
  videoClassName,
}: {
  src: string
  poster?: string
  backdrop?: CoverBackdrop
  className?: string
  videoClassName?: string
}) {
  const preset = backdrop ? COVER_BACKDROPS[backdrop] : undefined

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        !preset && "bg-muted",
        className,
      )}
      style={preset ? { background: preset.colorBack } : undefined}
    >
      {backdrop ? <CoverDither backdrop={backdrop} /> : null}
      <AmbientVideo
        src={src}
        hevcSrc={hevcSibling(src)}
        poster={poster}
        width={1280}
        height={720}
        decorative
        className="relative size-full bg-transparent"
        videoClassName={cn("size-full object-cover", videoClassName)}
      />
    </div>
  )
}
