import { AmbientVideo } from "@/components/AmbientVideo"
import { cn } from "@/lib/utils"

/** Card cover: ambient clip cropped to the frame. */
export function VideoCover({
  src,
  poster,
  className,
  videoClassName,
}: {
  src: string
  poster?: string
  className?: string
  videoClassName?: string
}) {
  return (
    <AmbientVideo
      src={src}
      poster={poster}
      width={1280}
      height={720}
      decorative
      className={cn("bg-muted", className)}
      videoClassName={cn("size-full object-cover", videoClassName)}
    />
  )
}
