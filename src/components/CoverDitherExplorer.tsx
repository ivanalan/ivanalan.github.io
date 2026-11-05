import { useMemo, useState, type ReactNode } from "react"
import { Dithering, type DitheringProps } from "@paper-design/shaders-react"

import { COVER_BACKDROPS } from "@/components/CoverDither"
import type { CoverBackdrop } from "@/components/work-tabs.types"

type Shape = NonNullable<DitheringProps["shape"]>
type DitherType = NonNullable<DitheringProps["type"]>

type Draft = {
  colorBack: string
  colorFront: string
  shape: Shape
  type: DitherType
  size: number
  scale: number
  rotation: number
  speed: number
  strength: number
}

type Cover = {
  id: string
  label: string
  backdrop: CoverBackdrop
  src: string
  poster: string
}

/** Every published cover that uses a dither backdrop. */
const COVERS: Cover[] = [
  {
    id: "qualtrics",
    label: "Survey Building Guidance",
    backdrop: "quiet-ripple",
    src: "/survey-building-guidance/assets/cover.webm",
    poster: "/survey-building-guidance/assets/cover-poster.webp",
  },
  {
    id: "data-platform",
    label: "Ab Initio Data Platform",
    backdrop: "deep-teal",
    src: "/ab-initio-data-platform/assets/cover.webm",
    poster: "/ab-initio-data-platform/assets/cover-poster.webp",
  },
  {
    id: "active-decisions",
    label: "Active Decisions",
    backdrop: "night-indigo",
    src: "/ab-initio-active-decisions/assets/cover.webm",
    poster: "/ab-initio-active-decisions/assets/cover-poster.webp",
  },
  {
    id: "guardias",
    label: "DeGuardia",
    backdrop: "pine-simplex",
    src: "/guardias/assets/cover.webm",
    poster: "/guardias/assets/cover-poster.webp",
  },
  {
    id: "table",
    label: "Table Layout Switcher",
    backdrop: "cobalt-warp",
    src: "/table-layout-switcher/assets/cover.webm",
    poster: "/table-layout-switcher/assets/cover-poster.webp",
  },
]

const SHAPES: Shape[] = [
  "simplex",
  "warp",
  "dots",
  "wave",
  "ripple",
  "swirl",
  "sphere",
]
const TYPES: DitherType[] = ["random", "2x2", "4x4", "8x8"]

const SHADER_STYLE = { position: "absolute", inset: 0 } as const

const inputClass =
  "rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground"

function draftFromBackdrop(backdrop: CoverBackdrop): Draft {
  const p = COVER_BACKDROPS[backdrop]
  return {
    colorBack: p.colorBack,
    colorFront: p.colorFront,
    shape: p.shape,
    type: p.type,
    size: p.size,
    scale: p.scale,
    rotation: p.rotation,
    speed: p.speed,
    strength: p.strength,
  }
}

function initialDrafts(): Record<string, Draft> {
  return Object.fromEntries(
    COVERS.map((cover) => [cover.id, draftFromBackdrop(cover.backdrop)]),
  )
}

function formatConfig(backdrop: CoverBackdrop, draft: Draft) {
  return `"${backdrop}": {
  colorBack: "${draft.colorBack}",
  colorFront: "${draft.colorFront}",
  shape: "${draft.shape}",
  type: "${draft.type}",
  size: ${draft.size},
  scale: ${draft.scale},
  rotation: ${draft.rotation},
  speed: ${draft.speed},
  strength: ${draft.strength},
},`
}

function isDirty(backdrop: CoverBackdrop, draft: Draft) {
  const saved = COVER_BACKDROPS[backdrop]
  return (
    draft.colorBack !== saved.colorBack ||
    draft.colorFront !== saved.colorFront ||
    draft.shape !== saved.shape ||
    draft.type !== saved.type ||
    draft.size !== saved.size ||
    draft.scale !== saved.scale ||
    draft.rotation !== saved.rotation ||
    draft.speed !== saved.speed ||
    draft.strength !== saved.strength
  )
}

function CoverPreview({
  src,
  poster,
  draft,
}: {
  src: string
  poster: string
  draft: Draft
}) {
  return (
    <div
      className="relative aspect-video w-full overflow-hidden rounded-xl"
      style={{ background: draft.colorBack }}
    >
      <div className="absolute inset-0" style={{ opacity: draft.strength }}>
        <Dithering
          colorBack={draft.colorBack}
          colorFront={draft.colorFront}
          shape={draft.shape}
          type={draft.type}
          size={draft.size}
          scale={draft.scale}
          rotation={draft.rotation}
          speed={draft.speed}
          style={SHADER_STYLE}
        />
      </div>
      <video
        poster={poster}
        muted
        loop
        playsInline
        autoPlay
        className="relative size-full object-cover"
      >
        {src.endsWith(".webm") ? (
          <source
            src={src.replace(/\.webm$/, "-hevc.mp4")}
            type='video/mp4; codecs="hvc1"'
          />
        ) : null}
        <source src={src} type={src.endsWith(".webm") ? "video/webm" : undefined} />
      </video>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-muted-foreground">
      <span>{label}</span>
      {children}
    </label>
  )
}

function CoverControls({
  backdrop,
  draft,
  dirty,
  copied,
  onPatch,
  onReset,
  onCopy,
}: {
  backdrop: CoverBackdrop
  draft: Draft
  dirty: boolean
  copied: boolean
  onPatch: (partial: Partial<Draft>) => void
  onReset: () => void
  onCopy: () => void
}) {
  const yaml = useMemo(() => formatConfig(backdrop, draft), [backdrop, draft])

  return (
    <div className="grid gap-3 rounded-xl border border-border bg-secondary/30 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs text-foreground">{backdrop}</span>
        <div className="flex items-center gap-2">
          {dirty ? (
            <span className="text-[11px] text-amber-400">unsaved vs code</span>
          ) : (
            <span className="text-[11px] text-muted-foreground">matches code</span>
          )}
          <button
            type="button"
            onClick={onReset}
            disabled={!dirty}
            className="rounded-md border border-border px-2 py-1 text-xs text-foreground enabled:hover:bg-secondary disabled:opacity-40"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Field label="colorBack">
          <input
            type="color"
            value={draft.colorBack}
            onChange={(e) => onPatch({ colorBack: e.target.value })}
            className="h-9 w-full cursor-pointer rounded-md border border-border bg-background"
          />
        </Field>
        <Field label="colorFront">
          <input
            type="color"
            value={draft.colorFront}
            onChange={(e) => onPatch({ colorFront: e.target.value })}
            className="h-9 w-full cursor-pointer rounded-md border border-border bg-background"
          />
        </Field>
        <Field label="shape">
          <select
            value={draft.shape}
            onChange={(e) => onPatch({ shape: e.target.value as Shape })}
            className={inputClass}
          >
            {SHAPES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="type">
          <select
            value={draft.type}
            onChange={(e) => onPatch({ type: e.target.value as DitherType })}
            className={inputClass}
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {(
          [
            ["size", draft.size, 1, 12, 0.1],
            ["scale", draft.scale, 0.4, 1.6, 0.05],
            ["rotation", draft.rotation, 0, 360, 1],
            ["speed", draft.speed, 0, 0.3, 0.01],
            ["strength", draft.strength, 0, 1, 0.01],
          ] as const
        ).map(([key, value, min, max, step]) => (
          <Field key={key} label={`${key}: ${value}`}>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => onPatch({ [key]: Number(e.target.value) })}
              className="w-full"
            />
          </Field>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">
            Paste into COVER_BACKDROPS in CoverDither.tsx
          </span>
          <button
            type="button"
            onClick={onCopy}
            className="rounded-md border border-border bg-background px-2.5 py-1 text-xs text-foreground hover:bg-secondary"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre className="overflow-x-auto rounded-lg bg-background p-2.5 font-mono text-[11px] text-foreground whitespace-pre-wrap">
          {yaml}
        </pre>
      </div>
    </div>
  )
}

/** Fine-tune every live cover dither against its transparent WebM. */
export function CoverDitherExplorer() {
  const [drafts, setDrafts] = useState(initialDrafts)
  const [focusId, setFocusId] = useState(COVERS[0].id)
  const [copiedFor, setCopiedFor] = useState<string | null>(null)

  const patchCover = (coverId: string, partial: Partial<Draft>) => {
    setDrafts((prev) => ({
      ...prev,
      [coverId]: { ...prev[coverId], ...partial },
    }))
  }

  const resetCover = (cover: Cover) => {
    setDrafts((prev) => ({
      ...prev,
      [cover.id]: draftFromBackdrop(cover.backdrop),
    }))
  }

  const copyCover = async (cover: Cover) => {
    await navigator.clipboard.writeText(
      formatConfig(cover.backdrop, drafts[cover.id]),
    )
    setCopiedFor(cover.id)
    window.setTimeout(
      () => setCopiedFor((cur) => (cur === cover.id ? null : cur)),
      1500,
    )
  }

  const scrollTo = (coverId: string) => {
    setFocusId(coverId)
    document.getElementById(`cover-${coverId}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden">
      <header className="shrink-0 border-b border-border px-4 py-4">
        <p className="text-sm text-muted-foreground">
          Local tool · {COVERS.length} live dither covers
        </p>
        <h1 className="font-heading text-2xl text-foreground">
          Fine-tune cover dithers
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Each card starts from the values in{" "}
          <code className="text-foreground">COVER_BACKDROPS</code>. Tweak, copy,
          then paste back into{" "}
          <code className="text-foreground">CoverDither.tsx</code>.
        </p>
      </header>

      <div className="flex min-h-0 flex-1">
        <div className="min-w-0 flex-1 overflow-y-auto px-4 py-4">
          <div className="mx-auto flex max-w-4xl flex-col gap-10">
            {COVERS.map((cover) => {
              const draft = drafts[cover.id]
              const dirty = isDirty(cover.backdrop, draft)
              const focused = focusId === cover.id
              return (
                <section
                  key={cover.id}
                  id={`cover-${cover.id}`}
                  onClick={() => setFocusId(cover.id)}
                  className={`flex scroll-mt-4 flex-col gap-3 rounded-2xl border p-3 transition-colors ${
                    focused
                      ? "border-foreground/40 bg-secondary/20"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <h2 className="text-sm font-medium text-foreground">
                      {cover.label}
                    </h2>
                    <span className="font-mono text-xs text-muted-foreground">
                      {cover.backdrop}
                      {dirty ? " · edited" : ""}
                    </span>
                  </div>
                  <CoverPreview
                    src={cover.src}
                    poster={cover.poster}
                    draft={draft}
                  />
                  <CoverControls
                    backdrop={cover.backdrop}
                    draft={draft}
                    dirty={dirty}
                    copied={copiedFor === cover.id}
                    onPatch={(partial) => patchCover(cover.id, partial)}
                    onReset={() => resetCover(cover)}
                    onCopy={() => void copyCover(cover)}
                  />
                </section>
              )
            })}
          </div>
        </div>

        <aside className="flex w-64 shrink-0 flex-col border-l border-border bg-background">
          <div className="flex min-h-0 flex-1 flex-col gap-3 p-3">
            <h2 className="text-sm font-medium text-foreground">Covers</h2>
            <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
              {COVERS.map((cover) => {
                const dirty = isDirty(cover.backdrop, drafts[cover.id])
                const focused = focusId === cover.id
                return (
                  <button
                    key={cover.id}
                    type="button"
                    onClick={() => scrollTo(cover.id)}
                    className={`rounded-xl border px-3 py-2.5 text-left transition-colors ${
                      focused
                        ? "border-foreground bg-secondary"
                        : "border-border hover:bg-secondary/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-foreground">
                        {cover.label}
                      </span>
                      <span
                        className="size-3 shrink-0 rounded-full border border-border"
                        style={{
                          background: drafts[cover.id].colorBack,
                        }}
                        aria-hidden
                      />
                    </div>
                    <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                      {cover.backdrop}
                      {dirty ? " · edited" : ""}
                    </p>
                  </button>
                )
              })}
            </nav>
            <button
              type="button"
              onClick={() => setDrafts(initialDrafts())}
              className="shrink-0 rounded-md border border-border px-3 py-2 text-xs text-foreground hover:bg-secondary"
            >
              Reset all to code
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
