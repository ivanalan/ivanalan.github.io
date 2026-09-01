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
  fetchPriority?: "high" | "low" | "auto";
};

export type WorkTabsProps = {
  projects: WorkCard[];
  playground: WorkCard[];
  defaultTab?: "projects" | "playground";
};
