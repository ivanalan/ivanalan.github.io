import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type CaseImageProps = {
  src: string
  alt: string
  caption: string
  href?: string
  linkLabel?: string
  /** Fill behind transparent images. Defaults to muted. */
  bgClassName?: string
}

function CaptionText({
  caption,
  href,
  linkLabel,
}: Pick<CaseImageProps, "caption" | "href" | "linkLabel">) {
  if (href && linkLabel && caption.includes(linkLabel)) {
    const [before, ...rest] = caption.split(linkLabel)
    return (
      <>
        {before}
        <a href={href} target="_blank" rel="noreferrer">
          {linkLabel}
        </a>
        {rest.join(linkLabel)}
      </>
    )
  }

  if (href) {
    return (
      <>
        {caption}{" "}
        <a href={href} target="_blank" rel="noreferrer">
          {linkLabel ?? href}
        </a>
      </>
    )
  }

  return <>{caption}</>
}

export function CaseImage({
  src,
  alt,
  caption,
  href,
  linkLabel,
  bgClassName = "bg-muted",
}: CaseImageProps) {
  const [zoomed, setZoomed] = useState(false)

  return (
    <figure>
      <Dialog
        onOpenChange={(open) => {
          if (!open) setZoomed(false)
        }}
      >
        <DialogTrigger
          className={cn(
            "block w-full cursor-zoom-in rounded-xl p-0 text-left",
            bgClassName,
          )}
          aria-label={`Enlarge: ${alt}`}
        >
          <img src={src} alt={alt} className="w-full rounded-xl" />
        </DialogTrigger>
        <DialogContent
          showCloseButton
          overlayClassName="bg-black/70 duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] supports-backdrop-filter:backdrop-blur-sm"
          className={cn(
            "max-h-[90vh] max-w-none gap-3 overflow-auto bg-background p-3 duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:max-w-none",
            zoomed ? "w-[min(96vw,90rem)]" : "w-[min(90vw,72rem)]",
          )}
        >
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <button
            type="button"
            onClick={() => setZoomed((z) => !z)}
            className={cn(
              "mx-auto block rounded-xl p-0",
              zoomed ? "cursor-zoom-out" : "cursor-zoom-in",
              bgClassName,
            )}
            aria-label={zoomed ? "Zoom out" : "Zoom in"}
          >
            <img
              src={src}
              alt=""
              className={cn(
                "mx-auto w-auto max-w-full rounded-xl object-contain transition-[max-height] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                zoomed
                  ? "max-h-[min(92vh,1400px)]"
                  : "max-h-[min(80vh,900px)]",
              )}
            />
          </button>
          <DialogDescription className="max-w-prose">
            <CaptionText
              caption={caption}
              href={href}
              linkLabel={linkLabel}
            />
          </DialogDescription>
        </DialogContent>
      </Dialog>
      <figcaption>
        <CaptionText caption={caption} href={href} linkLabel={linkLabel} />
      </figcaption>
    </figure>
  )
}
