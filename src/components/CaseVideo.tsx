type CaseVideoProps = {
  src: string
  poster?: string
  caption: string
  title: string
  /** Intrinsic size, so the figure holds its box before the poster loads. */
  width: number
  height: number
}

export function CaseVideo({
  src,
  poster,
  caption,
  title,
  width,
  height,
}: CaseVideoProps) {
  return (
    <figure>
      <video
        src={src}
        poster={poster}
        title={title}
        width={width}
        height={height}
        controls
        playsInline
        preload="metadata"
        className="h-auto w-full rounded-xl bg-muted"
      />
      <figcaption>{caption}</figcaption>
    </figure>
  )
}
