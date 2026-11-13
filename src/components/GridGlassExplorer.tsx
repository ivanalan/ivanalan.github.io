import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { LiquidGlass } from "simple-liquid-glass";
import { BrandChip, MetaChip } from "@/components/BrandChip";
import { GifCover } from "@/components/GifCover";
import { ShaderCover } from "@/components/ShaderCover";
import { VideoCover } from "@/components/VideoCover";
import type { WorkCard } from "@/components/work-tabs.types";
import headshot from "@/assets/about/headshot.jpg?url";
import abInitioMark from "@/icons/AbInitioLogo.svg?url";
import chickfilaLogo from "@/assets/companies/chickfila.png?url";
import docusignLogo from "@/assets/companies/docusign.png?url";
import qualtricsLogo from "@/assets/companies/qualtrics.jpg?url";
import schwabLogo from "@/assets/companies/schwab.png?url";
import zillowLogo from "@/assets/companies/zillow.jpg?url";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type Chrome = "grid" | "rail" | "dock";
type Collection = "work" | "side-projects" | "about";
type CoverWidthMode = "stretch" | "hug";
type PortraitStyle =
  | "circle"
  | "square"
  | "soft"
  | "polaroid"
  | "badge"
  | "stamp";

/** Live controls for the Left rail layout only. */
type RailTweaks = {
  pageMax: number;
  projectMax: number;
  coverMode: CoverWidthMode;
  coverWidth: number;
  featured: boolean;
  featuredMax: number;
  columns: 1 | 2;
  stickyRail: boolean;
  railPercent: number;
  cardGap: number;
};

const DEFAULT_RAIL: RailTweaks = {
  pageMax: 1280,
  projectMax: 920,
  coverMode: "stretch",
  coverWidth: 420,
  featured: true,
  featuredMax: 920,
  columns: 2,
  stickyRail: true,
  railPercent: 20,
  cardGap: 32,
};

const PORTRAIT_OPTIONS: { id: PortraitStyle; label: string }[] = [
  { id: "circle", label: "Circle" },
  { id: "square", label: "Square" },
  { id: "soft", label: "Soft" },
  { id: "polaroid", label: "Polaroid" },
  { id: "badge", label: "Badge" },
  { id: "stamp", label: "Stamp" },
];

type Experience = {
  company: string;
  title: string;
  /** Compact year range, Esben-style (e.g. 2023–25). */
  period: string;
  duration: string;
  logo: string;
  /** Full-bleed LinkedIn tiles vs padded SVG marks. */
  bleed?: boolean;
};

/** Experience for About — career repo + linkedin.com/in/alanmatias. */
const EXPERIENCE: Experience[] = [
  {
    company: "Qualtrics",
    title: "UX Designer",
    period: "2025–current",
    duration: "2 years",
    logo: qualtricsLogo,
    bleed: true,
  },
  {
    company: "Ab Initio",
    title: "UX Designer",
    period: "2023–25",
    duration: "2 years",
    // LinkedIn wordmark is too light on white — use the pink mark.
    logo: abInitioMark,
    bleed: false,
  },
  {
    company: "Zillow",
    title: "UX Design Intern",
    period: "2023",
    duration: "3 months",
    logo: zillowLogo,
    bleed: true,
  },
  {
    company: "DocuSign",
    title: "UX Design Intern",
    period: "2022",
    duration: "3 months",
    logo: docusignLogo,
    bleed: true,
  },
  {
    company: "Charles Schwab",
    title: "UX Design Intern",
    period: "2021",
    duration: "3 months",
    logo: schwabLogo,
    bleed: true,
  },
  {
    company: "Chick-fil-A",
    title: "UX Design Intern",
    period: "2020",
    duration: "3 months",
    logo: chickfilaLogo,
    bleed: true,
  },
];

const COLLECTION_OPTIONS: { id: Collection; label: string }[] = [
  { id: "work", label: "Work" },
  { id: "side-projects", label: "Side projects" },
  { id: "about", label: "About" },
];

type Props = {
  work: WorkCard[];
  sideProjects: WorkCard[];
};

/** Zooms foreground media only — dither / color backdrop stays put. */
const mediaZoomClass =
  "transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] motion-safe:group-hover:scale-[1.04] motion-reduce:transform-none";

const BIO_P1 =
  "3+ years shipping products, from scrappy work at Ab Initio to scale at Qualtrics.";
const BIO_P2 =
  "My computer science background shows up in how I think about systems, ship code, and measure analytics.";

/**
 * About prose — UXfolio 2026: career path + tone of voice matter more than
 * personal trivia; keep it short and in your own voice (ch. 1.5 / 5.2).
 * Phrasing from career/voice/writing.md + SiteIntro.
 */
const ABOUT_COPY = [
  "3+ years shipping products, from scrappy work at Ab Initio to scale at Qualtrics. My computer science background shows up in how I think about systems, ship code, and measure analytics.",
  "I design in Figma, iterate in Cursor, and measure impact in Amplitude. Lately that meant redesigning Guidance & Errors so more people actually use it (10% → 40% MAU on Survey Builder). Before Qualtrics I was often the sole designer on eng-heavy teams, including a data-platform MVP and our first design tokens in code.",
] as const;

const CHROME_OPTIONS: { id: Chrome; label: string }[] = [
  { id: "grid", label: "Grid" },
  { id: "rail", label: "Left rail" },
  { id: "dock", label: "Bottom dock" },
];

/** Shared optical recipe — keep tabs, dock, and toolbar on one material. */
const GLASS = {
  material: "clear" as const,
  blur: 12,
  frost: 0.2,
  saturation: 125,
  aberrationIntensity: 0.1,
  glassColor: "rgba(255,255,255,0.14)",
  borderColor: "rgba(255,255,255,0.42)",
};

const chipGlassClass =
  "rounded-lg border-white/25 bg-white/14 px-2 py-1 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_24px_-12px_rgba(0,0,0,0.55)] backdrop-blur-xl backdrop-saturate-150";

function GlassPill({
  children,
  backdropRef,
  className,
  radius = 999,
  style,
}: {
  children: ReactNode;
  backdropRef: RefObject<HTMLElement | null>;
  className?: string;
  radius?: number;
  style?: CSSProperties;
}) {
  return (
    <LiquidGlass
      backdropRef={backdropRef}
      renderer="auto"
      material={GLASS.material}
      radius={radius}
      blur={GLASS.blur}
      frost={GLASS.frost}
      saturation={GLASS.saturation}
      aberrationIntensity={GLASS.aberrationIntensity}
      glassColor={GLASS.glassColor}
      borderColor={GLASS.borderColor}
      className={cn("w-fit max-w-fit", className)}
      style={{
        display: "inline-flex",
        width: "fit-content",
        maxWidth: "fit-content",
        flex: "0 0 auto",
        ...style,
      }}
      reveal="immediate"
    >
      {children}
    </LiquidGlass>
  );
}

function MetaChipRow({
  item,
  onCover = false,
}: {
  item: WorkCard;
  onCover?: boolean;
}) {
  const hasChips = Boolean(item.companyBrand || item.meta.length > 0);
  if (!hasChips) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {item.companyBrand ? (
        <BrandChip
          brand={item.companyBrand}
          className={onCover ? chipGlassClass : undefined}
        />
      ) : null}
      {item.meta.map((part, i) => (
        <MetaChip
          key={`${part.label}-${i}`}
          icon={part.icon}
          mark={part.mark}
          className={onCover ? chipGlassClass : undefined}
        >
          {part.label}
        </MetaChip>
      ))}
    </div>
  );
}

function OverlayChips({ item }: { item: WorkCard }) {
  const hasChips = Boolean(item.companyBrand || item.meta.length > 0);
  if (!hasChips) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-wrap gap-2 p-3.5">
      <MetaChipRow item={item} onCover />
    </div>
  );
}

function CoverMedia({
  item,
  className,
}: {
  item: WorkCard;
  className?: string;
}) {
  const frame = cn("aspect-[16/9] size-full", className);

  if (item.coverGif && item.coverBackdrop) {
    return (
      <GifCover
        src={item.coverGif}
        poster={item.coverGifPoster}
        backdrop={item.coverBackdrop}
        className={frame}
        mediaClassName={mediaZoomClass}
      />
    );
  }
  if (item.coverVideo) {
    return (
      <VideoCover
        src={item.coverVideo}
        poster={item.coverVideoPoster}
        backdrop={item.coverBackdrop}
        className={frame}
        videoClassName={cn(item.coverVideoClassName, mediaZoomClass)}
      />
    );
  }
  if (item.coverShader) {
    return (
      <ShaderCover
        variant={item.coverShader}
        className={cn(frame, mediaZoomClass)}
      />
    );
  }
  if (item.coverSrc) {
    return (
      <img
        src={item.coverSrc}
        alt=""
        width={item.coverWidth}
        height={item.coverHeight}
        fetchPriority={item.fetchPriority}
        className={cn(frame, "bg-muted object-cover", mediaZoomClass)}
      />
    );
  }
  return <div className={cn(frame, "bg-muted")} aria-hidden="true" />;
}

function Card({
  item,
  wide,
  style,
}: {
  item: WorkCard;
  wide?: boolean;
  style?: CSSProperties;
}) {
  const cover = (
    <div className="relative isolate overflow-hidden rounded-t-[calc(0.95rem-1px)] rounded-b-none">
      <div className="relative">
        <CoverMedia item={item} />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 via-black/15 to-transparent"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
      />

      <OverlayChips item={item} />
    </div>
  );

  return (
    <a
      href={item.href}
      style={style}
      className={cn(
        "group flex w-full flex-col gap-0 overflow-hidden rounded-[0.95rem] border border-white/12 border-t-white/10 bg-white/[0.035] outline-none backdrop-blur-md transition-[background-color] duration-400 ease-out",
        "hover:bg-white/[0.055] focus-visible:ring-3 focus-visible:ring-ring/50",
        "active:scale-[0.99] active:duration-100",
        wide && "md:col-span-2",
      )}
    >
      {cover}
      <div className="flex flex-col gap-1.5 px-3 pt-2.5 pb-3">
        <h2
          className={cn(
            "font-heading text-work-title text-foreground",
            wide && "md:text-[1.4rem]",
          )}
        >
          {item.title}
        </h2>
        {item.subtitle ? (
          <p className="text-base text-muted-foreground">{item.subtitle}</p>
        ) : null}
      </div>
    </a>
  );
}

function CardGrid({
  items,
  isWork,
  columns = 2,
  rail,
}: {
  items: WorkCard[];
  isWork: boolean;
  columns?: 1 | 2;
  /** When set, uses Left rail width/cover tweaks. */
  rail?: RailTweaks;
}) {
  const cols = rail?.columns ?? columns;
  const gap = rail?.cardGap ?? 32;
  const hug = rail?.coverMode === "hug";
  const featured = Boolean(rail?.featured && isWork && items.length > 0);
  const rest = featured ? items.slice(1) : items;
  const lead = featured ? items[0] : null;

  const cardWidth = hug ? rail!.coverWidth : undefined;

  return (
    <div
      className={cn("flex flex-col", hug && "w-fit max-w-full")}
      style={{ gap }}
    >
      {lead ? (
        <Card
          item={lead}
          wide
          style={{
            width: "100%",
            maxWidth: rail!.featuredMax,
          }}
        />
      ) : null}

      <div
        className={cn(
          "grid grid-cols-1",
          cols === 2 && "md:grid-cols-2",
          hug && "w-fit",
        )}
        style={{
          gap,
          ...(hug && cols === 2
            ? {
                gridTemplateColumns: `repeat(2, ${rail!.coverWidth}px)`,
              }
            : null),
          ...(hug && cols === 1
            ? { gridTemplateColumns: `${rail!.coverWidth}px` }
            : null),
        }}
      >
        {rest.map((item) => (
          <Card
            key={item.href}
            item={item}
            style={
              hug
                ? { width: cardWidth, maxWidth: "100%" }
                : { width: "100%" }
            }
          />
        ))}
      </div>
    </div>
  );
}

function Intro({ compact }: { compact?: boolean }) {
  const copy = cn(
    "text-base leading-[1.7] text-foreground",
    compact && "text-[0.95rem] leading-[1.65]",
  );

  return (
    <header className={cn("flex flex-col gap-2", compact && "gap-3")}>
      <div className="flex flex-col gap-0.5">
        <h1 className="text-name text-foreground">{site.name}</h1>
        <p className="text-base text-muted-foreground">{site.role}</p>
      </div>
      <div className={cn("flex flex-col gap-3", compact && "gap-2.5")}>
        <p className={copy}>{BIO_P1}</p>
        <p className={copy}>{BIO_P2}</p>
      </div>
    </header>
  );
}

function AboutPortrait({ style }: { style: PortraitStyle }) {
  const photo = (
    <img
      src={headshot}
      alt=""
      className="size-full object-cover object-[50%_18%]"
    />
  );

  if (style === "circle") {
    return (
      <div className="size-28 shrink-0 overflow-hidden rounded-full ring-1 ring-white/15 sm:size-32">
        {photo}
      </div>
    );
  }

  if (style === "square") {
    return (
      <div className="size-28 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/12 sm:size-32">
        {photo}
      </div>
    );
  }

  if (style === "soft") {
    return (
      <div className="size-28 shrink-0 overflow-hidden rounded-[1.75rem] shadow-[0_12px_40px_-18px_rgba(0,0,0,0.7)] ring-1 ring-white/10 sm:size-32">
        {photo}
      </div>
    );
  }

  if (style === "polaroid") {
    return (
      <div className="w-[8.75rem] shrink-0 rotate-[-2.5deg] bg-[#f3f0ea] p-2 pb-8 shadow-[0_14px_32px_-12px_rgba(0,0,0,0.65)] sm:w-[9.5rem]">
        <div className="aspect-square overflow-hidden bg-muted">{photo}</div>
        <p className="mt-2 text-center font-heading text-sm text-zinc-800">
          {site.name}
        </p>
      </div>
    );
  }

  if (style === "badge") {
    return (
      <div className="w-[8.5rem] shrink-0 overflow-hidden rounded-[0.65rem] bg-[#f4f2ee] p-2 pb-3 shadow-[0_16px_34px_-14px_rgba(0,0,0,0.65)] sm:w-[9.25rem]">
        <div className="aspect-[4/5] overflow-hidden rounded-[0.35rem]">
          {photo}
        </div>
        <div
          aria-hidden="true"
          className="mt-2.5 h-[3px] w-full rounded-full bg-gradient-to-r from-[#1e4fd6] via-[#4a6fe8] to-[#1a2a5c]"
        />
        <p className="mt-2 text-center text-[0.85rem] leading-none font-semibold tracking-[-0.01em] text-zinc-900">
          {site.name}
        </p>
      </div>
    );
  }

  // stamp
  return (
    <div className="size-28 shrink-0 rotate-[1.5deg] overflow-hidden rounded-md border-2 border-dashed border-white/35 p-1 sm:size-32">
      <div className="size-full overflow-hidden rounded-[2px]">{photo}</div>
    </div>
  );
}

/** About — Esben-simple resume layout in this site’s type + color system. */
function AboutPanel({
  backdropRef,
}: {
  backdropRef: RefObject<HTMLElement | null>;
}) {
  const [portrait, setPortrait] = useState<PortraitStyle>("circle");

  return (
    <div className="flex w-full max-w-2xl flex-col gap-12">
      <div className="flex flex-col gap-5">
        <GlassPill backdropRef={backdropRef}>
          <div
            role="toolbar"
            aria-label="Portrait style"
            className="flex flex-wrap gap-0.5 p-1"
          >
            {PORTRAIT_OPTIONS.map((opt) => {
              const on = portrait === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setPortrait(opt.id)}
                  className={cn(
                    "cursor-pointer rounded-full px-3 py-1.5 text-xs whitespace-nowrap transition-colors",
                    on
                      ? "bg-white/18 text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </GlassPill>

        <div className="flex flex-col items-start gap-6 sm:flex-row sm:gap-8">
          <AboutPortrait style={portrait} />
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            {ABOUT_COPY.map((p) => (
              <p
                key={p.slice(0, 24)}
                className="text-base leading-[1.7] text-foreground"
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>

      <section className="flex flex-col gap-5">
        <h2 className="font-heading text-work-title text-foreground">
          Experience
        </h2>
        <ul className="flex flex-col">
          {EXPERIENCE.map((job) => (
            <li
              key={`${job.company}-${job.title}`}
              className="flex items-start gap-3.5 py-3.5"
            >
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg",
                  job.bleed ? "p-0" : "bg-white/95 p-1.5",
                )}
              >
                <img
                  src={job.logo}
                  alt=""
                  className={cn(
                    job.bleed
                      ? "size-full object-cover"
                      : "size-[70%] object-contain",
                  )}
                  aria-hidden="true"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-base leading-snug font-medium text-foreground">
                  {job.company}
                </p>
                <p className="mt-0.5 text-base leading-snug text-muted-foreground">
                  {job.title}
                </p>
              </div>
              <div className="shrink-0 pt-0.5 text-right">
                <p className="text-sm tabular-nums text-muted-foreground">
                  {job.period}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {job.duration}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function CollectionPanel({
  tab,
  items,
  columns = 2,
  rail,
  backdropRef,
}: {
  tab: Collection;
  items: WorkCard[];
  columns?: 1 | 2;
  rail?: RailTweaks;
  backdropRef: RefObject<HTMLElement | null>;
}) {
  if (tab === "about") return <AboutPanel backdropRef={backdropRef} />;
  return (
    <CardGrid
      items={items}
      isWork={tab === "work"}
      columns={columns}
      rail={rail}
    />
  );
}

function RailTweakPanel({
  value,
  onChange,
}: {
  value: RailTweaks;
  onChange: (next: RailTweaks) => void;
}) {
  const set = <K extends keyof RailTweaks>(key: K, next: RailTweaks[K]) => {
    onChange({ ...value, [key]: next });
  };

  return (
    <aside
      className="fixed right-3 bottom-3 z-50 w-[min(20rem,calc(100%-1.5rem))] rounded-2xl border border-white/12 bg-black/70 p-3.5 text-[0.8rem] text-foreground shadow-[0_20px_50px_-24px_rgba(0,0,0,0.8)] backdrop-blur-xl"
      aria-label="Left rail layout tweaks"
    >
      <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground">
        Left rail tweaks
      </p>
      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="flex justify-between text-muted-foreground">
            Page max width
            <span className="tabular-nums text-foreground">{value.pageMax}px</span>
          </span>
          <input
            type="range"
            min={960}
            max={1600}
            step={20}
            value={value.pageMax}
            onChange={(e) => set("pageMax", Number(e.target.value))}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="flex justify-between text-muted-foreground">
            Project container max
            <span className="tabular-nums text-foreground">
              {value.projectMax}px
            </span>
          </span>
          <input
            type="range"
            min={480}
            max={1200}
            step={20}
            value={value.projectMax}
            onChange={(e) => set("projectMax", Number(e.target.value))}
          />
        </label>

        <div className="flex flex-col gap-1.5">
          <span className="text-muted-foreground">Cover width mode</span>
          <div className="flex gap-1 rounded-lg bg-white/8 p-0.5">
            {(
              [
                ["stretch", "Container stretch"],
                ["hug", "Hug covers"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={value.coverMode === id}
                onClick={() => set("coverMode", id)}
                className={cn(
                  "flex-1 cursor-pointer rounded-md px-2 py-1.5 text-[0.7rem] transition-colors",
                  value.coverMode === id
                    ? "bg-white/18 text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <label
          className={cn(
            "flex flex-col gap-1",
            value.coverMode !== "hug" && "opacity-40",
          )}
        >
          <span className="flex justify-between text-muted-foreground">
            Each cover width
            <span className="tabular-nums text-foreground">
              {value.coverWidth}px
            </span>
          </span>
          <input
            type="range"
            min={280}
            max={640}
            step={10}
            disabled={value.coverMode !== "hug"}
            value={value.coverWidth}
            onChange={(e) => set("coverWidth", Number(e.target.value))}
          />
        </label>

        <label className="flex cursor-pointer items-center justify-between gap-3">
          <span className="text-muted-foreground">Featured first cover</span>
          <input
            type="checkbox"
            checked={value.featured}
            onChange={(e) => set("featured", e.target.checked)}
            className="size-4 accent-white"
          />
        </label>

        <label
          className={cn(
            "flex flex-col gap-1",
            !value.featured && "opacity-40",
          )}
        >
          <span className="flex justify-between text-muted-foreground">
            Featured max width
            <span className="tabular-nums text-foreground">
              {value.featuredMax}px
            </span>
          </span>
          <input
            type="range"
            min={480}
            max={1200}
            step={20}
            disabled={!value.featured}
            value={value.featuredMax}
            onChange={(e) => set("featuredMax", Number(e.target.value))}
          />
        </label>

        <div className="flex flex-col gap-1.5">
          <span className="text-muted-foreground">Columns</span>
          <div className="flex gap-1 rounded-lg bg-white/8 p-0.5">
            {([1, 2] as const).map((n) => (
              <button
                key={n}
                type="button"
                aria-pressed={value.columns === n}
                onClick={() => set("columns", n)}
                className={cn(
                  "flex-1 cursor-pointer rounded-md px-2 py-1.5 text-[0.7rem] transition-colors",
                  value.columns === n
                    ? "bg-white/18 text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <label className="flex cursor-pointer items-center justify-between gap-3">
          <span className="text-muted-foreground">Sticky left rail</span>
          <input
            type="checkbox"
            checked={value.stickyRail}
            onChange={(e) => set("stickyRail", e.target.checked)}
            className="size-4 accent-white"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="flex justify-between text-muted-foreground">
            Rail width
            <span className="tabular-nums text-foreground">
              {value.railPercent}%
            </span>
          </span>
          <input
            type="range"
            min={14}
            max={32}
            step={1}
            value={value.railPercent}
            onChange={(e) => set("railPercent", Number(e.target.value))}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="flex justify-between text-muted-foreground">
            Card gap
            <span className="tabular-nums text-foreground">{value.cardGap}px</span>
          </span>
          <input
            type="range"
            min={12}
            max={56}
            step={4}
            value={value.cardGap}
            onChange={(e) => set("cardGap", Number(e.target.value))}
          />
        </label>
      </div>
    </aside>
  );
}

function CollectionTabs({
  value,
  onChange,
  backdropRef,
}: {
  value: Collection;
  onChange: (next: Collection) => void;
  backdropRef: RefObject<HTMLElement | null>;
}) {
  return (
    <div className="w-fit self-start">
      <GlassPill backdropRef={backdropRef}>
        <div
          role="tablist"
          aria-label="Work collections"
          className="flex w-fit gap-0.5 p-1"
        >
          {COLLECTION_OPTIONS.map(({ id, label }) => {
            const selected = value === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => onChange(id)}
                className={cn(
                  "cursor-pointer rounded-full px-3.5 py-2 text-sm whitespace-nowrap transition-[color,background-color,scale] duration-300",
                  selected
                    ? "bg-white/18 text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                  "active:scale-[0.97] active:duration-100",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </GlassPill>
    </div>
  );
}

function BottomDock({
  value,
  onChange,
  backdropRef,
}: {
  value: Collection;
  onChange: (next: Collection) => void;
  backdropRef: RefObject<HTMLElement | null>;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto w-fit max-w-full">
        <GlassPill
          backdropRef={backdropRef}
          radius={28}
          style={{ minWidth: "18rem" }}
        >
          <div
            role="tablist"
            aria-label="Work collections"
            className="grid grid-cols-3 gap-1 p-1.5"
          >
            {COLLECTION_OPTIONS.map(({ id, label }) => {
              const selected = value === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => onChange(id)}
                  className={cn(
                    "cursor-pointer rounded-[1.15rem] px-4 py-3 text-sm font-medium whitespace-nowrap transition-[color,background-color,scale] duration-300",
                    selected
                      ? "bg-white/16 text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                    "active:scale-[0.98] active:duration-100",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </GlassPill>
      </div>
    </div>
  );
}

function ExploreToolbar({
  chrome,
  onChrome,
  backdropRef,
}: {
  chrome: Chrome;
  onChrome: (next: Chrome) => void;
  backdropRef: RefObject<HTMLElement | null>;
}) {
  return (
    <div className="fixed top-3 left-1/2 z-50 flex w-fit max-w-[calc(100%-1.5rem)] -translate-x-1/2">
      <GlassPill backdropRef={backdropRef}>
        <div
          role="toolbar"
          aria-label="Layout chrome"
          className="flex flex-wrap justify-center gap-0.5 p-1"
        >
          {CHROME_OPTIONS.map((opt) => {
            const on = chrome === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                aria-pressed={on}
                onClick={() => onChrome(opt.id)}
                className={cn(
                  "cursor-pointer rounded-full px-3 py-1.5 text-xs whitespace-nowrap transition-colors",
                  on
                    ? "bg-white/18 text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </GlassPill>
    </div>
  );
}

export function GridGlassExplorer({ work, sideProjects }: Props) {
  const [chrome, setChrome] = useState<Chrome>("grid");
  const [tab, setTab] = useState<Collection>("work");
  const [rail, setRail] = useState<RailTweaks>(DEFAULT_RAIL);
  const backdropRef = useRef<HTMLDivElement>(null);
  const items =
    tab === "side-projects"
      ? sideProjects
      : tab === "work"
        ? work
        : [];

  useEffect(() => {
    const fromHash = location.hash.replace(/^#/, "").split("/")[0];
    if (fromHash === "rail-stack") {
      setChrome("rail");
      return;
    }
    if (CHROME_OPTIONS.some((o) => o.id === fromHash)) {
      setChrome(fromHash as Chrome);
    }
  }, []);

  useEffect(() => {
    history.replaceState(null, "", `#${chrome}`);
  }, [chrome]);

  const pageMax =
    chrome === "rail" ? rail.pageMax : 1280;

  return (
    <div className="relative min-h-dvh">
      <div
        ref={backdropRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(90% 55% at 12% -10%, rgba(90,140,220,.18), transparent 55%), radial-gradient(70% 45% at 92% 8%, rgba(160,120,220,.12), transparent 50%), oklch(18.561% 0.00161 197.742)",
        }}
      />

      <div
        className={cn(
          "relative mx-auto flex w-full flex-col px-6 pt-20 md:px-8",
          chrome === "dock" ? "pb-28" : "pb-16 md:pb-24",
        )}
        style={{ maxWidth: pageMax }}
      >
        <ExploreToolbar
          chrome={chrome}
          onChrome={setChrome}
          backdropRef={backdropRef}
        />

        {chrome === "rail" ? (
          <div
            className="grid gap-10 lg:grid-cols-[minmax(11rem,var(--rail-pct))_minmax(0,1fr)] lg:items-start lg:gap-12"
            style={{ ["--rail-pct" as string]: `${rail.railPercent}%` }}
          >
            <aside className={cn(rail.stickyRail && "lg:sticky lg:top-24")}>
              <Intro compact />
            </aside>
            <div
              className="flex w-full flex-col items-start gap-5"
              style={{
                maxWidth: rail.projectMax,
                width: rail.coverMode === "hug" ? "fit-content" : "100%",
              }}
            >
              <CollectionTabs
                value={tab}
                onChange={setTab}
                backdropRef={backdropRef}
              />
              <div
                className="w-full max-w-full"
                style={{
                  width: rail.coverMode === "hug" ? "fit-content" : "100%",
                }}
              >
                <CollectionPanel
                  tab={tab}
                  items={items}
                  rail={rail}
                  backdropRef={backdropRef}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-6">
            <Intro />
            {chrome === "grid" ? (
              <CollectionTabs
                value={tab}
                onChange={setTab}
                backdropRef={backdropRef}
              />
            ) : null}
            <div className="w-full">
              <CollectionPanel
                tab={tab}
                items={items}
                backdropRef={backdropRef}
              />
            </div>
          </div>
        )}

        <p className="mt-12 w-full border-t border-border pt-4 text-sm text-muted-foreground">
          {chrome === "rail"
            ? "Left rail · use the bottom-right panel to tune widths, covers, and featured hero."
            : "Chips + glass frame locked in. Hover slow-zooms foreground media only."}
        </p>
      </div>

      {chrome === "rail" ? (
        <RailTweakPanel value={rail} onChange={setRail} />
      ) : null}

      {chrome === "dock" ? (
        <BottomDock
          value={tab}
          onChange={setTab}
          backdropRef={backdropRef}
        />
      ) : null}
    </div>
  );
}
