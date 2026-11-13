import {
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { CheckIcon, CopyIcon, DownloadIcon, ExternalLinkIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { LiquidGlass } from "simple-liquid-glass";
import { BrandChip, MetaChip } from "@/components/BrandChip";
import { GifCover } from "@/components/GifCover";
import { ShaderCover } from "@/components/ShaderCover";
import { VideoCover } from "@/components/VideoCover";
import type { WorkCard } from "@/components/work-tabs.types";
import polaroidPhoto from "@/assets/about/polaroid.jpg?url";
import abInitioMark from "@/icons/AbInitioLogo.svg?url";
import chickfilaLogo from "@/assets/companies/chickfila.png?url";
import docusignLogo from "@/assets/companies/docusign.png?url";
import georgiaTechLogo from "@/assets/companies/georgia-tech.png?url";
import qualtricsLogo from "@/assets/companies/qualtrics.jpg?url";
import schwabLogo from "@/assets/companies/schwab.png?url";
import zillowLogo from "@/assets/companies/zillow.jpg?url";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const RESUME_HREF = "/alan-matias-resume.pdf";
const LINKEDIN_HREF = "https://www.linkedin.com/in/alanmatias";
const EMAIL = "10alanm@gmail.com";

/** Same interactive chrome as GlassBackLink, sized for icon + label pills. */
const glassActionClass =
  "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm text-foreground outline-none transition-[background-color,transform] duration-300 ease-out hover:scale-[0.98] hover:bg-white/18 focus-visible:bg-white/18 focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.96] active:bg-white/28 active:duration-100";

type TabId = "work" | "play" | "about";

type Props = {
  work: WorkCard[];
  sideProjects: WorkCard[];
  defaultTab?: TabId;
};

const TABS: { id: TabId; label: string }[] = [
  { id: "work", label: "Work" },
  { id: "play", label: "Play" },
  { id: "about", label: "About" },
];

const BIO =
  "3+ years shipping products, from scrappy work at Ab Initio to scale at Qualtrics. My computer science background shows in how I tackle complex systems, ship code, and measure analytics.";

/** Depth under the page chrome bio — outcomes, not a second intro. */
const ABOUT_COPY = [
  "I've focused on making complex workflows, unstructured data, and powerful tools feel simple.",
  "At Ab Initio I led the design of our first high-performance data platform from 0→1. At Qualtrics I simplified complex survey builder guidance that increased usage by 600%.",
] as const;

const EXPERIENCE = [
  {
    name: "Qualtrics",
    title: "UX Designer",
    period: "2025–current",
    duration: "1.5 years",
    logo: qualtricsLogo,
    bleed: true,
  },
  {
    name: "Ab Initio",
    title: "UX Designer",
    period: "2023–25",
    duration: "2 years",
    logo: abInitioMark,
    bleed: false,
  },
  {
    name: "Zillow",
    title: "UX Design Intern",
    period: "2023",
    duration: "3 months",
    logo: zillowLogo,
    bleed: true,
  },
  {
    name: "DocuSign",
    title: "UX Design Intern",
    period: "2022",
    duration: "3 months",
    logo: docusignLogo,
    bleed: true,
  },
  {
    name: "Charles Schwab",
    title: "UX Design Intern",
    period: "2021",
    duration: "3 months",
    logo: schwabLogo,
    bleed: true,
  },
  {
    name: "Chick-fil-A",
    title: "UX Design Intern",
    period: "2020",
    duration: "3 months",
    logo: chickfilaLogo,
    bleed: true,
  },
] as const;

const EDUCATION = [
  {
    name: "Georgia Tech",
    title: "M.S. Computer Science",
    period: "2022–23",
    duration: "1 year",
    logo: georgiaTechLogo,
    bleed: true,
  },
  {
    name: "Georgia Tech",
    title: "B.S. Computer Science",
    period: "2018–22",
    duration: "4 years",
    logo: georgiaTechLogo,
    bleed: true,
  },
] as const;

const mediaZoomClass =
  "transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] motion-safe:group-hover:scale-[1.04] motion-reduce:transform-none";

/** Chip content sits on LiquidGlass — no CSS blur/fill of its own. */
const chipOnGlassClass =
  "rounded-xl border-transparent bg-transparent px-2.5 py-1 text-white shadow-none";

const CARD_REVEAL_OFFSET = 4;

function GlassShell({
  children,
  backdropRef,
  className,
  radius = 999,
}: {
  children: ReactNode;
  backdropRef: RefObject<HTMLElement | null>;
  className?: string;
  radius?: number;
}) {
  return (
    <LiquidGlass
      backdropRef={backdropRef}
      renderer="auto"
      material="clear"
      radius={radius}
      blur={12}
      frost={0.2}
      saturation={125}
      aberrationIntensity={0.1}
      glassColor="rgba(255,255,255,0.14)"
      borderColor="rgba(255,255,255,0.42)"
      className={cn("w-fit max-w-fit", className)}
      style={{
        display: "inline-flex",
        width: "fit-content",
        maxWidth: "fit-content",
        flex: "0 0 auto",
      }}
      reveal="immediate"
    >
      {children}
    </LiquidGlass>
  );
}

function GlassChip({
  children,
  backdropRef,
}: {
  children: ReactNode;
  backdropRef: RefObject<HTMLElement | null>;
}) {
  return (
    <GlassShell backdropRef={backdropRef} radius={14}>
      {children}
    </GlassShell>
  );
}

function CoverMedia({ item }: { item: WorkCard }) {
  const frame = "aspect-[16/9] size-full";

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

function Card({ item, index }: { item: WorkCard; index: number }) {
  // Sibling of the chip lenses (not an ancestor) so refraction can sample the cover.
  const coverBackdropRef = useRef<HTMLDivElement>(null);
  const hasChips = Boolean(item.companyBrand || item.meta.length > 0);

  return (
    <a
      href={item.href}
      style={{ "--reveal-index": index } as CSSProperties}
      className="reveal group relative flex flex-col gap-0 overflow-hidden rounded-[1.25rem] bg-white/[0.04] outline-none backdrop-blur-md transition-[background-color,scale] duration-400 ease-out hover:bg-white/[0.06] focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.99] active:duration-100"
    >
      {/* Soft white inner fade: blurred stroke clipped inward + crisp edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[inherit]"
      >
        <div className="absolute inset-0 rounded-[inherit] border border-white/28 blur-[5px]" />
        <div className="absolute inset-0 rounded-[inherit] border border-white/18 blur-[1.5px]" />
        <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.26),inset_0_1px_0_rgba(255,255,255,0.35)]" />
      </div>

      <div className="relative isolate overflow-hidden rounded-t-[calc(1.25rem-1px)] rounded-b-none">
        <div ref={coverBackdropRef} className="relative">
          <CoverMedia item={item} />
        </div>
        {/* Cover overlay chips + fade — only when wide enough for chips on video. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-1/2 bg-gradient-to-t from-black/55 via-black/15 to-transparent min-[450px]:block"
        />
        {hasChips ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden flex-wrap gap-2 p-3.5 min-[450px]:flex">
            {item.companyBrand ? (
              <GlassChip backdropRef={coverBackdropRef}>
                <BrandChip
                  brand={item.companyBrand}
                  className={chipOnGlassClass}
                />
              </GlassChip>
            ) : null}
            {item.meta.map((part, i) => (
              <GlassChip key={`${part.label}-${i}`} backdropRef={coverBackdropRef}>
                <MetaChip
                  icon={part.icon}
                  mark={part.mark}
                  className={chipOnGlassClass}
                >
                  {part.label}
                </MetaChip>
              </GlassChip>
            ))}
          </div>
        ) : null}
      </div>
      <div className="relative z-10 flex flex-col gap-2 px-3 pt-3 pb-3.5">
        {/* Narrow: chips sit above the title instead of on the cover. */}
        {hasChips ? (
          <div className="flex flex-wrap items-center gap-1.5 min-[450px]:hidden">
            {item.companyBrand ? (
              <BrandChip brand={item.companyBrand} />
            ) : null}
            {item.meta.map((part, i) => (
              <MetaChip
                key={`${part.label}-${i}`}
                icon={part.icon}
                mark={part.mark}
              >
                {part.label}
              </MetaChip>
            ))}
          </div>
        ) : null}
        <h2 className="font-heading text-work-title text-foreground">
          {item.title}
        </h2>
        {item.subtitle ? (
          <p className="text-base text-muted-foreground">{item.subtitle}</p>
        ) : null}
      </div>
    </a>
  );
}

function AboutPolaroid() {
  const caption = "Alan at Arches";

  return (
    <figure
      className="polaroid-frame w-[16.5rem] shrink-0 bg-white p-3 pb-4 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55),0_2px_8px_-2px_rgba(0,0,0,0.2)] sm:w-[19rem]"
      aria-label={caption}
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-zinc-200">
        <img
          src={polaroidPhoto}
          alt=""
          className="polaroid-image size-full object-cover object-center"
        />
        {/* Instant fog: milky overlay clears so the print “develops.” */}
        <div
          aria-hidden="true"
          className="polaroid-fog pointer-events-none absolute inset-0 bg-[#f4f0e8]"
        />
      </div>
      <figcaption className="polaroid-caption mt-3.5 mb-1 px-0.5 text-center font-hand text-[1.05rem] leading-snug text-zinc-800 sm:text-[1.15rem]">
        {caption}
      </figcaption>
    </figure>
  );
}

function AboutEntryRow({
  name,
  title,
  period,
  duration,
  logo,
  bleed,
}: {
  name: string;
  title: string;
  period: string;
  duration: string;
  logo: string;
  bleed: boolean;
}) {
  return (
    <li className="flex items-start gap-3.5 py-2.5 min-[450px]:py-3.5">
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg",
          bleed ? "p-0" : "bg-white/95 p-1.5",
        )}
      >
        <img
          src={logo}
          alt=""
          className={cn(
            bleed ? "size-full object-cover" : "size-[70%] object-contain",
          )}
          aria-hidden="true"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-base leading-snug font-medium text-foreground">
          {name}
        </p>
        <p className="mt-0.5 text-base leading-snug text-muted-foreground">
          {title}
        </p>
      </div>
      <div className="shrink-0 pt-0.5 text-right">
        <p className="text-sm tabular-nums text-muted-foreground">{period}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{duration}</p>
      </div>
    </li>
  );
}

function AboutActions({
  backdropRef,
}: {
  backdropRef: RefObject<HTMLElement | null>;
}) {
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
      copiedTimer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard can fail without permission — leave label unchanged */
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-4">
      <GlassShell backdropRef={backdropRef}>
        <a
          href={RESUME_HREF}
          download="alan-matias-resume.pdf"
          className={glassActionClass}
        >
          <DownloadIcon className="size-4" aria-hidden="true" strokeWidth={2} />
          Resume
        </a>
      </GlassShell>

      <GlassShell backdropRef={backdropRef}>
        <a
          href={LINKEDIN_HREF}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn (opens in new tab)"
          className={glassActionClass}
        >
          <ExternalLinkIcon
            className="size-4"
            aria-hidden="true"
            strokeWidth={2}
          />
          LinkedIn
        </a>
      </GlassShell>

      <GlassShell backdropRef={backdropRef}>
        <button
          type="button"
          onClick={() => void copyEmail()}
          className={cn(glassActionClass, "relative cursor-pointer")}
          aria-label={copied ? "Email copied" : `Copy email ${EMAIL}`}
        >
          {copied ? (
            <CheckIcon className="size-4" aria-hidden="true" strokeWidth={2} />
          ) : (
            <CopyIcon className="size-4" aria-hidden="true" strokeWidth={2} />
          )}
          <span className="relative">
            <span className={copied ? "invisible" : undefined}>{EMAIL}</span>
            {copied ? (
              <span className="absolute inset-0 flex items-center justify-center">
                Copied
              </span>
            ) : null}
          </span>
        </button>
      </GlassShell>
    </div>
  );
}

function AboutPanel({
  backdropRef,
}: {
  backdropRef: RefObject<HTMLElement | null>;
}) {
  return (
    <div className="flex w-full flex-col gap-10 min-[450px]:gap-12">
      <div className="flex flex-col items-start gap-8 min-[450px]:gap-12 sm:flex-row sm:items-center sm:gap-14">
        <AboutPolaroid />
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          {ABOUT_COPY.map((p) => (
            <p
              key={p.slice(0, 24)}
              className="text-base leading-[1.7] text-foreground"
            >
              {p}
            </p>
          ))}
          <AboutActions backdropRef={backdropRef} />
        </div>
      </div>

      <section className="flex flex-col gap-5 min-[450px]:mt-6">
        <h2 className="font-heading text-work-title text-foreground">
          Experience
        </h2>
        <ul className="flex flex-col">
          {EXPERIENCE.map((entry) => (
            <AboutEntryRow
              key={`${entry.name}-${entry.title}`}
              name={entry.name}
              title={entry.title}
              period={entry.period}
              duration={entry.duration}
              logo={entry.logo}
              bleed={entry.bleed}
            />
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="font-heading text-work-title text-foreground">
          Education
        </h2>
        <ul className="flex flex-col">
          {EDUCATION.map((entry) => (
            <AboutEntryRow
              key={`${entry.name}-${entry.title}`}
              name={entry.name}
              title={entry.title}
              period={entry.period}
              duration={entry.duration}
              logo={entry.logo}
              bleed={entry.bleed}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}

/** Shell radius for tabs; inner pill = shell − pad (nested corner rule). */
const TAB_SHELL_RADIUS = 20;
const TAB_PAD_PX = 4;

/** Liquid-glass segmented control; Motion `layoutId` slides the selected pill. */
function GlassTabs({
  value,
  onChange,
  backdropRef,
}: {
  value: TabId;
  onChange: (next: TabId) => void;
  backdropRef: RefObject<HTMLElement | null>;
}) {
  const layoutId = `${useId()}-tab-pill`;
  const reduceMotion = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);
  const pillRadius = Math.max(0, TAB_SHELL_RADIUS - TAB_PAD_PX);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const i = TABS.findIndex((t) => t.id === value);
    if (i < 0) return;
    let next = i;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = (i + 1) % TABS.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = (i - 1 + TABS.length) % TABS.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = TABS.length - 1;
    } else {
      return;
    }
    event.preventDefault();
    onChange(TABS[next].id);
    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>(
      '[role="tab"]',
    );
    buttons?.[next]?.focus();
  };

  return (
    <div
      style={{ "--reveal-index": 3 } as CSSProperties}
      className="reveal w-fit"
    >
      <GlassShell backdropRef={backdropRef} radius={TAB_SHELL_RADIUS}>
        <div
          ref={listRef}
          role="tablist"
          aria-label="Site sections"
          onKeyDown={onKeyDown}
          className="relative flex w-fit gap-0.5"
          style={{ padding: TAB_PAD_PX }}
        >
          {TABS.map((tab) => {
            const selected = value === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => onChange(tab.id)}
                style={{ borderRadius: pillRadius }}
                className={cn(
                  "relative cursor-pointer px-3.5 py-2 text-sm whitespace-nowrap transition-colors duration-300",
                  "active:scale-[0.97] active:duration-100",
                  selected
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {selected ? (
                  <motion.span
                    layoutId={layoutId}
                    className="absolute inset-0 bg-white/18"
                    style={{ borderRadius: pillRadius }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 480, damping: 38 }
                    }
                    initial={false}
                  />
                ) : null}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </GlassShell>
    </div>
  );
}

export function GlassHomeExplorer({
  work,
  sideProjects,
  defaultTab = "work",
}: Props) {
  const [tab, setTab] = useState<TabId>(defaultTab);
  const backdropRef = useRef<HTMLDivElement>(null);
  const play = sideProjects;

  return (
    <div className="relative">
      {/* Sibling backdrop for LiquidGlass (must not be an ancestor of the lens). */}
      <div
        ref={backdropRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      />

      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <div className="flex flex-col gap-0.5">
            <h1
              className="reveal text-name text-foreground"
              style={{ "--reveal-index": 0 } as CSSProperties}
            >
              {site.name}
            </h1>
            <p
              className="reveal text-base text-muted-foreground"
              style={{ "--reveal-index": 1 } as CSSProperties}
            >
              {site.role}
            </p>
          </div>
          <p
            className="reveal text-base leading-[1.7] text-foreground"
            style={{ "--reveal-index": 2 } as CSSProperties}
          >
            {BIO}
          </p>
        </header>

        <div className="flex flex-col gap-4">
          <GlassTabs
            value={tab}
            onChange={setTab}
            backdropRef={backdropRef}
          />

          {tab === "work" ? (
            <div className="flex flex-col gap-12" role="tabpanel">
              {work.map((item, index) => (
                <Card
                  key={item.href}
                  item={item}
                  index={CARD_REVEAL_OFFSET + index}
                />
              ))}
            </div>
          ) : null}

          {tab === "play" ? (
            <div className="flex flex-col gap-12" role="tabpanel">
              {play.length > 0 ? (
                play.map((item, index) => (
                  <Card
                    key={item.href}
                    item={item}
                    index={CARD_REVEAL_OFFSET + index}
                  />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nothing here yet.</p>
              )}
            </div>
          ) : null}

          {tab === "about" ? (
            <div className="mt-8" role="tabpanel">
              <AboutPanel backdropRef={backdropRef} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
