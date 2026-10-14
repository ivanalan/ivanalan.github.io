import { companyToBrand } from "@/components/BrandChip";
import type { WorkCard, WorkCardMeta } from "@/components/work-tabs.types";
import { getImage } from "astro:assets";
import { getCollection } from "astro:content";

type Entry = Awaited<ReturnType<typeof getCollection<"work" | "sideProjects">>>[number];

function cardMeta(entry: Entry, omitCompany: boolean): WorkCardMeta[] {
  const isSideProject = entry.collection === "sideProjects";
  const items: WorkCardMeta[] = [];

  if (!omitCompany && entry.data.company) {
    items.push({ label: entry.data.company });
  }
  if (isSideProject && entry.data.projectType) {
    if (entry.id === "guardias") {
      items.push({ label: entry.data.projectType, icon: "logo-apple" });
    } else if (entry.id === "table-layout-switcher") {
      items.push({ label: entry.data.projectType, mark: "figma" });
    } else {
      items.push({ label: entry.data.projectType });
    }
  }
  if (!isSideProject && entry.data.role) {
    items.push({ label: entry.data.role, icon: "person" });
  }
  if (isSideProject && entry.data.metrics) {
    items.push({ label: entry.data.metrics, icon: "analytics" });
  }
  if (entry.data.year !== undefined) {
    items.push({ label: String(entry.data.year), icon: "calendar-clear" });
  }

  return items;
}

const toCard = async (entry: Entry, featured = false): Promise<WorkCard> => {
  const cover = entry.data.cover
    ? await getImage({ src: entry.data.cover, width: 1280 })
    : undefined;
  const companyBrand = entry.data.company
    ? companyToBrand(entry.data.company)
    : undefined;

  return {
    href: `/work/${entry.id}`,
    title: entry.data.title,
    companyBrand,
    meta: cardMeta(entry, companyBrand !== undefined),
    status: entry.data.status,
    coverSrc: cover?.src,
    coverWidth: cover?.attributes.width,
    coverHeight: cover?.attributes.height,
    coverShader: entry.data.coverShader,
    coverVideo: entry.data.coverVideo,
    coverVideoPoster: entry.data.coverVideoPoster,
    coverVideoClassName: entry.data.coverVideoClassName,
    fetchPriority: featured ? "high" : undefined,
  };
};

/** Shared by / and /side-projects, which render the same two tab panels and
 *  differ only in which one opens first. */
export async function getWorkCards() {
  const [work, sideProjects] = await Promise.all([
    getCollection("work"),
    getCollection("sideProjects"),
  ]);

  work.sort((a, b) => a.data.order - b.data.order);
  sideProjects.sort((a, b) => a.data.order - b.data.order);

  return {
    work: await Promise.all(
      work.map((entry, index) => toCard(entry, index === 0)),
    ),
    sideProjects: await Promise.all(
      sideProjects.map((entry) => toCard(entry)),
    ),
  };
}
