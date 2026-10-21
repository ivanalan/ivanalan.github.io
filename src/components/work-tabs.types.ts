import type { CompanyBrand } from "@/components/BrandChip";
import type { IonIconName } from "@/components/IonIcon";

export type CoverShader = "r5" | "qualtrics";

export type MetaMark = "figma";

export type WorkCardMeta = {
  label: string;
  icon?: IonIconName;
  mark?: MetaMark;
};

export type WorkCard = {
  href: string;
  title: string;
  subtitle?: string;
  companyBrand?: CompanyBrand;
  meta: WorkCardMeta[];
  status: "placeholder" | "published";
  coverSrc?: string;
  coverWidth?: number | string;
  coverHeight?: number | string;
  coverShader?: CoverShader;
  coverVideo?: string;
  coverVideoPoster?: string;
  coverVideoClassName?: string;
  fetchPriority?: "high" | "low" | "auto";
};

export type WorkTabsProps = {
  work: WorkCard[];
  sideProjects: WorkCard[];
  defaultTab?: "work" | "side-projects";
};
