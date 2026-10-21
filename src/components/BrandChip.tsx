import abInitioLogo from "@/icons/AbInitioLogo.svg?url";
import figmaLogo from "@/icons/figma.svg?url";
import xmMarkColor from "@/icons/xmMarkColor.svg?url";
import { IonIcon, type IonIconName } from "@/components/IonIcon";
import type { MetaMark } from "@/components/work-tabs.types";
import { cn } from "@/lib/utils";

const marks: Record<MetaMark, { src: string; className: string }> = {
  figma: { src: figmaLogo, className: "h-3 w-auto" },
};

const brands = {
  "ab-initio": {
    label: "Ab Initio",
    src: abInitioLogo,
    icon: "size-3",
  },
  qualtrics: {
    label: "Qualtrics",
    src: xmMarkColor,
    // Wide XM wordmark — size to the tile width so it doesn't clip.
    icon: "h-auto w-3.5",
  },
} as const;

export type CompanyBrand = keyof typeof brands;

export function companyToBrand(company: string): CompanyBrand | undefined {
  switch (company) {
    case "Ab Initio":
      return "ab-initio";
    case "Qualtrics":
      return "qualtrics";
    default:
      return undefined;
  }
}

const chipClass =
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-border bg-secondary py-0.5 text-sm leading-none text-foreground";

type BrandChipProps = {
  brand: CompanyBrand;
  className?: string;
};

export function BrandChip({ brand, className }: BrandChipProps) {
  const { label, src, icon } = brands[brand];

  return (
    <span className={cn(chipClass, "pr-1 pl-1", className)}>
      <span className="inline-flex size-4 shrink-0 items-center justify-center overflow-hidden rounded-[0.25rem]">
        <img src={src} alt="" className={icon} aria-hidden="true" />
      </span>
      {label}
    </span>
  );
}

type MetaChipProps = {
  children: string;
  icon?: IonIconName;
  mark?: MetaMark;
  className?: string;
};

/** Pill for role, year, and other card meta — optional mark/Ionicon on the left. */
export function MetaChip({ children, icon, mark, className }: MetaChipProps) {
  const markAsset = mark ? marks[mark] : undefined;
  const hasLeading = Boolean(icon || markAsset);

  return (
    <span
      className={cn(chipClass, hasLeading ? "pr-1.5 pl-1" : "px-1.5", className)}
    >
      {markAsset ? (
        <img
          src={markAsset.src}
          alt=""
          className={cn("shrink-0", markAsset.className)}
          aria-hidden="true"
        />
      ) : null}
      {icon ? <IonIcon name={icon} className="text-muted-foreground" /> : null}
      {children}
    </span>
  );
}
