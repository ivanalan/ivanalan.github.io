import { AmbientVideo } from "@/components/AmbientVideo"

type CaseVideoProps = {
  src: string
  poster?: string
  caption: string
  title: string
  /** Intrinsic size, so the figure holds its box before the poster loads. */
  width: number
  height: number
  /** Fill behind the video. Defaults to muted. */
  bgClassName?: string
}

export function CaseVideo({
  src,
  poster,
  caption,
  title,
  width,
  height,
  bgClassName = "bg-muted",
}: CaseVideoProps) {
  return (
    <figure>
      <AmbientVideo
        src={src}
        poster={poster}
        title={title}
        width={width}
        height={height}
        className={`rounded-xl ${bgClassName}`}
        videoClassName="h-auto w-full rounded-xl"
        stillClassName="rounded-xl"
      />
      <figcaption>{caption}</figcaption>
    </figure>
  )
}
