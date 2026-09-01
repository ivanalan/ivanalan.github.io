import { useEffect, useState } from "react";
import {
  GrainGradient,
  type GrainGradientParams,
} from "@paper-design/shaders-react";
import type { CoverShader } from "./work-tabs.types";
import qualtricsLogoUrl from "@/assets/QualtricsXM Logo.svg?url";
import r5LogoUrl from "@/assets/R5_Logo.svg?url";
import { cn } from "@/lib/utils";

/** Dark base plus a brightening ramp in the brand hue: value contrast reads as depth.
 *  Both covers run the wave, so r5 starts 9s in: the crests beat as well as travel,
 *  so a time offset lands on a different form rather than the same one shifted
 *  sideways. It also keeps the two apart when reduced motion freezes both. */
const COVERS: Record<CoverShader, GrainGradientParams> = {
  r5: {
    colorBack: "#1C1641",
    colors: ["#2b288f", "#3d36c4", "#6A78E6"],
    shape: "wave",
    softness: 0.2,
    intensity: 0.35,
    speed: 1.2,
    frame: 9000,
  },
  qualtrics: {
    colorBack: "#0a2740",
    colors: ["#12557a", "#1b8ca8", "#2fc0c8"],
    shape: "wave",
    softness: 0.85,
    intensity: 0.35,
    speed: 1.4,
  },
};

const LOGOS: Record<CoverShader, { src: string; className: string }> = {
  r5: { src: r5LogoUrl, className: "w-1/6" },
  qualtrics: { src: qualtricsLogoUrl, className: "w-2/5" },
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
  const cover = COVERS[variant];

  return (
    /* The gradient is painted behind the canvas so the card reads the same before
       hydration and on devices without WebGL 2, which Paper Shaders requires. */
    <div
      className={cn("relative overflow-hidden rounded-xl", className)}
      style={{
        background: `linear-gradient(160deg, ${cover.colorBack}, ${cover.colors!.join(", ")})`,
      }}
    >
      <GrainGradient
        {...cover}
        noise={0.3}
        speed={animated ? cover.speed : 0}
        style={SHADER_STYLE}
      />
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
