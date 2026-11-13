import { useRef, type CSSProperties } from "react";
import { LiquidGlass } from "simple-liquid-glass";
import { cn } from "@/lib/utils";

type Props = {
  href?: string;
  className?: string;
};

/** Article back control — same clear liquid glass as explore tabs. */
export function GlassBackLink({ href = "/", className }: Props) {
  const backdropRef = useRef<HTMLDivElement>(null);

  return (
    <div
      style={{ "--reveal-index": 0 } as CSSProperties}
      className={cn("reveal relative -ml-1 mb-8 w-fit self-start", className)}
    >
      <div
        ref={backdropRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      />
      <LiquidGlass
        backdropRef={backdropRef}
        renderer="auto"
        material="clear"
        radius={999}
        blur={12}
        frost={0.2}
        saturation={125}
        aberrationIntensity={0.1}
        glassColor="rgba(255,255,255,0.14)"
        borderColor="rgba(255,255,255,0.42)"
        className="w-fit max-w-fit"
        style={{
          display: "inline-flex",
          width: "fit-content",
          maxWidth: "fit-content",
          flex: "0 0 auto",
        }}
        reveal="immediate"
      >
        <a
          href={href}
          className="inline-flex size-11 items-center justify-center rounded-full text-foreground outline-none transition-[background-color,transform] duration-300 ease-out hover:bg-white/18 focus-visible:bg-white/18 focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.96] active:duration-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="size-5"
            aria-hidden="true"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="48"
              d="M244 400 100 256l144-144M120 256h292"
            />
          </svg>
          <span className="sr-only">Back</span>
        </a>
      </LiquidGlass>
    </div>
  );
}
