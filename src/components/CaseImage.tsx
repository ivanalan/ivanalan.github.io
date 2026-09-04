import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type CaseImageProps = {
  src: string
  alt: string
  caption: string
  href?: string
  linkLabel?: string
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
}: CaseImageProps) {
  return (
    <figure>
      <Dialog>
        <DialogTrigger
          className="block w-full cursor-zoom-in rounded-xl bg-muted p-0 text-left"
          aria-label={`Enlarge: ${alt}`}
        >
          <img src={src} alt={alt} className="w-full rounded-xl" />
        </DialogTrigger>
        <DialogContent
          showCloseButton
          overlayClassName="bg-black/70 duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] supports-backdrop-filter:backdrop-blur-sm"
          className="max-h-[90vh] w-[min(90vw,72rem)] max-w-none gap-3 overflow-auto bg-background p-3 duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:max-w-none"
        >
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <img
            src={src}
            alt=""
            className="mx-auto max-h-[min(80vh,900px)] w-auto max-w-full object-contain"
          />
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
