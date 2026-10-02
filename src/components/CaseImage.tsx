import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react"
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
  /** Constrain the figure (e.g. `mx-auto max-w-xs` for phone crops). */
  className?: string
}

const DEFAULT_ZOOM = 1.5
const MAX_ZOOM = 4
const DRAG_THRESHOLD = 5
const ZOOM_EASE = "cubic-bezier(0.16, 1, 0.3, 1)"

type Transform = {
  scale: number
  x: number
  y: number
  focusX: number
  focusY: number
  imgW: number
  imgH: number
  frameW: number
  frameH: number
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
  className,
}: CaseImageProps) {
  const [scale, setScale] = useState(1)
  const [dragging, setDragging] = useState(false)
  const [miniVp, setMiniVp] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  })

  const frameRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const minimapRef = useRef<HTMLDivElement>(null)
  const transformRef = useRef<Transform>({
    scale: 1,
    x: 0,
    y: 0,
    focusX: 0.5,
    focusY: 0.5,
    imgW: 0,
    imgH: 0,
    frameW: 0,
    frameH: 0,
  })
  const gestureRef = useRef({
    pointerId: null as number | null,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    moved: false,
    panning: false,
  })
  const miniGestureRef = useRef({
    pointerId: null as number | null,
    active: false,
  })

  const zoomed = scale > 1.01

  function measure() {
    const frame = frameRef.current
    const img = imgRef.current
    const t = transformRef.current
    if (!frame || !img) return
    const fr = frame.getBoundingClientRect()
    t.frameW = fr.width
    t.frameH = fr.height
    const nw = img.naturalWidth || 1
    const nh = img.naturalHeight || 1
    const fit = Math.min(t.frameW / nw, t.frameH / nh)
    t.imgW = nw * fit
    t.imgH = nh * fit
  }

  function updateMinimapVp() {
    const t = transformRef.current
    const minimap = minimapRef.current
    if (!minimap || !t.imgW || !t.frameW) return
    const mini = minimap.getBoundingClientRect()
    if (!mini.width) return

    const scaleX = mini.width / t.imgW
    const scaleY = mini.height / t.imgH
    const ox = (t.frameW - t.imgW) / 2
    const oy = (t.frameH - t.imgH) / 2
    const visLeft = -t.x / t.scale
    const visTop = -t.y / t.scale
    const visRight = (t.frameW - t.x) / t.scale
    const visBottom = (t.frameH - t.y) / t.scale

    setMiniVp({
      left: (visLeft - ox) * scaleX,
      top: (visTop - oy) * scaleY,
      width: Math.max(8, (visRight - visLeft) * scaleX),
      height: Math.max(8, (visBottom - visTop) * scaleY),
    })
  }

  function applyTransform(animate: boolean) {
    const stage = stageRef.current
    if (!stage) return
    const { x, y, scale: s } = transformRef.current
    stage.style.transition = animate
      ? `transform 280ms ${ZOOM_EASE}`
      : "none"
    stage.style.transform = `translate(${x}px, ${y}px) scale(${s})`
    setScale(s)
    updateMinimapVp()
  }

  function resetZoom(animate = true) {
    transformRef.current.scale = 1
    transformRef.current.x = 0
    transformRef.current.y = 0
    transformRef.current.focusX = 0.5
    transformRef.current.focusY = 0.5
    applyTransform(animate)
    setDragging(false)
  }

  function setScaleAround(
    nextScale: number,
    clientX?: number,
    clientY?: number,
    animate = true,
  ) {
    const frame = frameRef.current
    if (!frame) return
    measure()
    const t = transformRef.current
    nextScale = Math.min(MAX_ZOOM, Math.max(1, nextScale))
    const prev = t.scale
    if (Math.abs(nextScale - prev) < 0.001) return

    const rect = frame.getBoundingClientRect()
    const mx =
      clientX != null ? clientX - rect.left : t.frameW * t.focusX
    const my =
      clientY != null ? clientY - rect.top : t.frameH * t.focusY

    if (nextScale <= 1.001) {
      t.scale = 1
      t.x = 0
      t.y = 0
    } else {
      const ratio = nextScale / prev
      t.x = mx - (mx - t.x) * ratio
      t.y = my - (my - t.y) * ratio
      t.scale = nextScale
      t.focusX = mx / t.frameW
      t.focusY = my / t.frameH
    }
    applyTransform(animate)
  }

  function zoomToPoint(clientX: number, clientY: number) {
    const frame = frameRef.current
    if (!frame) return
    measure()
    const rect = frame.getBoundingClientRect()
    const mx = clientX - rect.left
    const my = clientY - rect.top
    const t = transformRef.current
    t.scale = DEFAULT_ZOOM
    t.x = mx - mx * DEFAULT_ZOOM
    t.y = my - my * DEFAULT_ZOOM
    t.focusX = mx / t.frameW
    t.focusY = my / t.frameH
    applyTransform(true)
  }

  function jumpViaMinimap(clientX: number, clientY: number) {
    const minimap = minimapRef.current
    if (!minimap) return
    measure()
    const t = transformRef.current
    const rect = minimap.getBoundingClientRect()
    const nx = (clientX - rect.left) / rect.width
    const ny = (clientY - rect.top) / rect.height
    const ox = (t.frameW - t.imgW) / 2
    const oy = (t.frameH - t.imgH) / 2
    const stageX = ox + nx * t.imgW
    const stageY = oy + ny * t.imgH
    if (t.scale <= 1.01) t.scale = DEFAULT_ZOOM
    t.x = t.frameW / 2 - stageX * t.scale
    t.y = t.frameH / 2 - stageY * t.scale
    t.focusX = 0.5
    t.focusY = 0.5
    applyTransform(false)
  }

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return
    if ((e.target as HTMLElement).closest("[data-minimap]")) return
    const frame = frameRef.current
    if (!frame) return
    frame.setPointerCapture(e.pointerId)
    const zoomedNow = transformRef.current.scale > 1
    gestureRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      moved: false,
      panning: zoomedNow,
    }
    if (zoomedNow) setDragging(true)
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    const g = gestureRef.current
    if (g.pointerId !== e.pointerId) return

    if (
      Math.hypot(e.clientX - g.startX, e.clientY - g.startY) > DRAG_THRESHOLD
    ) {
      g.moved = true
    }

    if (g.panning && transformRef.current.scale > 1) {
      transformRef.current.x += e.clientX - g.lastX
      transformRef.current.y += e.clientY - g.lastY
      g.lastX = e.clientX
      g.lastY = e.clientY
      applyTransform(false)
    }
  }

  function endPointer(e: ReactPointerEvent<HTMLDivElement>) {
    const g = gestureRef.current
    if (g.pointerId !== e.pointerId) return

    const frame = frameRef.current
    if (frame?.hasPointerCapture(e.pointerId)) {
      frame.releasePointerCapture(e.pointerId)
    }

    const { moved, panning } = g
    g.pointerId = null
    g.panning = false
    setDragging(false)

    if (panning && moved) return

    if (transformRef.current.scale <= 1) {
      zoomToPoint(e.clientX, e.clientY)
    } else {
      resetZoom(true)
    }
  }

  function onMiniPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return
    e.stopPropagation()
    const el = minimapRef.current
    if (!el) return
    el.setPointerCapture(e.pointerId)
    miniGestureRef.current = { pointerId: e.pointerId, active: true }
    jumpViaMinimap(e.clientX, e.clientY)
  }

  function onMiniPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    const g = miniGestureRef.current
    if (!g.active || g.pointerId !== e.pointerId) return
    jumpViaMinimap(e.clientX, e.clientY)
  }

  function onMiniPointerEnd(e: ReactPointerEvent<HTMLDivElement>) {
    const g = miniGestureRef.current
    if (g.pointerId !== e.pointerId) return
    const el = minimapRef.current
    if (el?.hasPointerCapture(e.pointerId)) {
      el.releasePointerCapture(e.pointerId)
    }
    miniGestureRef.current = { pointerId: null, active: false }
  }

  return (
    <figure className={className}>
      <Dialog
        onOpenChange={(open) => {
          if (!open) resetZoom(false)
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
          className="max-h-[90vh] w-[min(90vw,72rem)] max-w-none gap-3 overflow-hidden bg-background p-3 duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:max-w-none"
        >
          <DialogTitle className="sr-only">{alt}</DialogTitle>

          <div className="flex flex-wrap items-center gap-3 px-0.5 font-sans text-xs text-muted-foreground">
            <button
              type="button"
              className="rounded-md border border-foreground/10 bg-background px-2 py-1 font-medium text-foreground hover:bg-muted disabled:opacity-40"
              onClick={() => resetZoom(true)}
              disabled={!zoomed}
            >
              Fit
            </button>
            <label className="flex min-w-0 flex-1 items-center gap-2 sm:max-w-xs">
              <span className="w-10 shrink-0 tabular-nums">
                {Math.round(scale * 100)}%
              </span>
              <input
                type="range"
                min={1}
                max={MAX_ZOOM}
                step={0.05}
                value={scale}
                aria-label="Zoom level"
                className="h-1.5 w-full cursor-pointer accent-foreground"
                onChange={(e) => {
                  const frame = frameRef.current
                  if (!frame) return
                  measure()
                  const t = transformRef.current
                  const rect = frame.getBoundingClientRect()
                  setScaleAround(
                    Number(e.target.value),
                    rect.left + t.frameW * t.focusX,
                    rect.top + t.frameH * t.focusY,
                    false,
                  )
                }}
              />
            </label>
          </div>

          <div
            ref={frameRef}
            className={cn(
              "relative max-h-[min(80vh,900px)] overflow-hidden rounded-xl touch-none",
              bgClassName,
              zoomed
                ? dragging
                  ? "cursor-grabbing"
                  : "cursor-grab"
                : "cursor-zoom-in",
            )}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endPointer}
            onPointerCancel={endPointer}
            role="presentation"
            aria-label={
              zoomed
                ? "Drag to pan, or click to zoom out"
                : "Click to zoom in"
            }
          >
            <div
              ref={stageRef}
              className="flex w-full origin-top-left justify-center will-change-transform"
              style={{ transform: "translate(0px, 0px) scale(1)" }}
            >
              <img
                ref={imgRef}
                src={src}
                alt=""
                draggable={false}
                className="mx-auto h-auto max-h-[min(80vh,900px)] w-auto max-w-full rounded-xl object-contain select-none"
                onLoad={() => {
                  measure()
                  updateMinimapVp()
                }}
              />
            </div>

            {zoomed && (
              <div
                ref={minimapRef}
                data-minimap
                className={cn(
                  "absolute right-2 bottom-2 z-10 w-28 cursor-pointer overflow-hidden rounded-lg ring-1 ring-white/50 shadow-lg touch-none sm:w-32",
                  bgClassName,
                )}
                onPointerDown={onMiniPointerDown}
                onPointerMove={onMiniPointerMove}
                onPointerUp={onMiniPointerEnd}
                onPointerCancel={onMiniPointerEnd}
                role="img"
                aria-label="Overview map — drag to pan"
              >
                <img
                  src={src}
                  alt=""
                  draggable={false}
                  className="block h-auto w-full select-none opacity-90"
                />
                <div
                  className="pointer-events-none absolute border-2 border-white bg-white/20 shadow-[0_0_0_1px_rgba(0,0,0,0.35)]"
                  style={{
                    left: miniVp.left,
                    top: miniVp.top,
                    width: miniVp.width,
                    height: miniVp.height,
                  }}
                />
              </div>
            )}
          </div>

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
