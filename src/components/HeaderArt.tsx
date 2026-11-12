import { useEffect, useState, type CSSProperties } from "react"
import { Dithering } from "@paper-design/shaders-react"

const ANCHORS = {
  tl: [0, 0],
  t: [0.5, 0],
  tr: [1, 0],
  l: [0, 0.35],
  c: [0.5, 0.35],
  r: [1, 0.35],
} as const

type Anchor = keyof typeof ANCHORS
type Fade = "radial" | "ellipse" | "steps" | "disc" | "band"
type DitherType = "2x2" | "4x4" | "8x8" | "random"

export type HeaderArtSettings = {
  anchor: Anchor
  fade: Fade
  /** px: how far the pattern travels from the anchor before it fades out. */
  reach: number
  scale: number
  rotation: number
  /** Dither pixel size in px. */
  size: number
  type: DitherType
  front: string
  /** 0-100 */
  intensity: number
  /** % of the band that stays fully opaque before the downward fade. */
  solidUntil: number
  artHeight: number
  /** 0-1: how much the left (text) side is dimmed. */
  leftDim: number
  /** 0-1: black scrim behind the intro. */
  scrim: number
}

/** The shipped look. Edit these values to change what visitors see. */
export const DEFAULTS: HeaderArtSettings = {
  anchor: "t",
  fade: "band",
  reach: 2000,
  scale: 3.2,
  rotation: 0,
  size: 4,
  type: "4x4",
  front: "#2b46f2",
  intensity: 7,
  solidUntil: 40,
  artHeight: 1000,
  leftDim: 0,
  scrim: 0.79,
}

const BG = "var(--background)"
const bgAlpha = (pct: number) =>
  `color-mix(in oklab, ${BG} ${pct}%, transparent)`

/** Overlay in --background that erases the pattern with distance from the anchor. */
function veil(s: HeaderArtSettings): string | undefined {
  const [ax, ay] = ANCHORS[s.anchor]
  const at = `${ax * 100}% ${ay * 100}%`
  const r = s.reach

  switch (s.fade) {
    case "radial":
      return `radial-gradient(circle at ${at}, transparent 0, transparent ${r * 0.35}px, ${BG} ${r}px)`
    case "ellipse":
      return `radial-gradient(ellipse ${r * 0.5}px ${r * 1.05}px at ${at}, transparent 0, transparent 30%, ${BG} 100%)`
    case "steps":
      return `radial-gradient(circle at ${at}, transparent 0 ${r * 0.4}px, ${bgAlpha(30)} ${r * 0.4}px ${r * 0.55}px, ${bgAlpha(60)} ${r * 0.55}px ${r * 0.7}px, ${bgAlpha(88)} ${r * 0.7}px ${r * 0.85}px, ${BG} ${r * 0.85}px)`
    case "disc":
      return `radial-gradient(circle at ${at}, transparent 0 ${r * 0.5}px, ${BG} ${r * 0.5 + 2}px)`
    default:
      return undefined
  }
}

/** Opaque for `solidUntil`%, then a soft three-step ramp to nothing, intersected
 *  with a left-side dim so the text column stays clear. */
function maskFor(s: HeaderArtSettings): CSSProperties {
  const solid = s.solidUntil
  const at = (k: number) => `${(solid + (100 - solid) * k).toFixed(1)}%`
  const down = `linear-gradient(to bottom, #000 0, #000 ${solid}%, rgb(0 0 0 / .62) ${at(0.38)}, rgb(0 0 0 / .22) ${at(0.7)}, transparent 100%)`
  const left = `linear-gradient(to right, rgb(0 0 0 / ${(1 - s.leftDim).toFixed(2)}) 0, #000 62%)`

  return {
    WebkitMaskImage: `${down}, ${left}`,
    maskImage: `${down}, ${left}`,
    WebkitMaskComposite: "source-in",
    maskComposite: "intersect",
  }
}

const SHADER_STYLE = { position: "absolute", inset: 0 } as const

/** Home-page header art: the same Paper dither as the card covers, in the warp
 *  shape, as a band at the top that fades out downward. Frozen under reduced motion. */
export function HeaderArt() {
  const s = DEFAULTS
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setAnimated(!query.matches)

    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  const [ax, ay] = ANCHORS[s.anchor]
  const overlay = veil(s)

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-hidden"
      style={{ height: s.artHeight }}
    >
      <div
        className="absolute inset-0"
        style={{ opacity: s.intensity / 100, ...maskFor(s) }}
      >
        <Dithering
          colorBack="#00000000"
          colorFront={s.front}
          shape="warp"
          type={s.type}
          size={s.size}
          scale={s.scale}
          rotation={s.rotation}
          // Warp's dense centre stays in view; the offset pulls it toward the anchor.
          offsetX={(ax - 0.5) * 0.6}
          offsetY={(ay - 0.5) * 0.6}
          speed={animated ? 0.04 : 0}
          frame={2000}
          style={SHADER_STYLE}
        />
        {overlay ? (
          <div className="absolute inset-0" style={{ background: overlay }} />
        ) : null}
      </div>
      {/* Darkens the page behind the intro so type never sits on the pattern. */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 620px 360px at calc(50% - 130px) 240px, rgb(0 0 0 / ${s.scrim}), transparent 72%)`,
        }}
      />
    </div>
  )
}
