export type CoverShader = "r5" | "qualtrics";

export type WorkCard = {
  href: string;
  title: string;
  summary: string;
  status: "placeholder" | "published";
  coverSrc?: string;
  coverWidth?: number | string;
  coverHeight?: number | string;
  coverShader?: CoverShader;
  coverVideo?: string;
  coverVideoClassName?: string;
  fetchPriority?: "high" | "low" | "auto";
};

export type WorkTabsProps = {
  work: WorkCard[];
  sideProjects: WorkCard[];
  defaultTab?: "work" | "side-projects";
};
