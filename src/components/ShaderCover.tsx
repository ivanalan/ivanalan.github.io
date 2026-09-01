import { useEffect, useState } from "react";
import { GrainGradient, MeshGradient } from "@paper-design/shaders-react";
import type { CoverShader } from "./work-tabs.types";
import qualtricsLogoUrl from "@/assets/QualtricsXM Logo.svg?url";
import r5LogoUrl from "@/assets/R5_Logo.svg?url";
import { cn } from "@/lib/utils";

/** Gentle hue drift toward teal, narrow luminance band: value contrast reads as depth. */
const R5_COLORS = ["#3d36c4", "#2b288f", "#243a8c", "#1f5578"];
const QUALTRICS_BACK = "#0a2740";
const QUALTRICS_COLORS = ["#12557a", "#1b8ca8", "#2fc0c8"];

const LOGOS: Record<CoverShader, { src: string; className: string }> = {
  r5: { src: r5LogoUrl, className: "h-12 w-12" },
  qualtrics: { src: qualtricsLogoUrl, className: "w-2/5" },
};

/** Painted behind the canvas so the card reads the same before hydration and
 *  on devices without WebGL 2, which Paper Shaders requires. */
const FALLBACKS: Record<CoverShader, string> = {
  r5: `linear-gradient(160deg, ${R5_COLORS.join(", ")})`,
  qualtrics: `linear-gradient(160deg, ${QUALTRICS_BACK}, ${QUALTRICS_COLORS.join(", ")})`,
};

const SHADER_STYLE = { position: "absolute", inset: 0 } as const;

export function ShaderCover({
  variant,
  className,
}: {
  variant: CoverShader;
  className?: string;
}) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setAnimated(!query.matches);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const logo = LOGOS[variant];

  return (
    <div
      className={cn("relative overflow-hidden rounded-xl", className)}
      style={{ background: FALLBACKS[variant] }}
    >
      {variant === "r5" ? (
        <MeshGradient
          colors={R5_COLORS}
          distortion={0.2}
          swirl={0}
          grainMixer={0.45}
          grainOverlay={0.28}
          speed={animated ? 0.12 : 0}
          style={SHADER_STYLE}
        />
      ) : (
        <GrainGradient
          colorBack={QUALTRICS_BACK}
          colors={QUALTRICS_COLORS}
          shape="wave"
          softness={0.85}
          intensity={0.35}
          noise={0.3}
          speed={animated ? 0.5 : 0}
          style={SHADER_STYLE}
        />
      )}
      <img
        src={logo.src}
        alt=""
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          logo.className,
        )}
      />
    </div>
  );
}
