import type { WorkCard } from "@/components/work-tabs.types";
import { getImage } from "astro:assets";
import { getCollection } from "astro:content";

type Entry = Awaited<ReturnType<typeof getCollection<"work" | "sideProjects">>>[number];

function cardMeta(entry: Entry): string {
  const isSideProject = entry.collection === "sideProjects";
  const projectType = isSideProject ? entry.data.projectType : undefined;
  const role = isSideProject ? undefined : entry.data.role;
  const metrics = isSideProject ? entry.data.metrics : undefined;

  return [entry.data.company, projectType, role, metrics, entry.data.year]
    .filter((part) => part !== undefined && part !== "")
    .join(" · ");
}

const toCard = async (entry: Entry, featured = false): Promise<WorkCard> => {
  const cover = entry.data.cover
    ? await getImage({ src: entry.data.cover, width: 1280 })
    : undefined;

  return {
    href: `/work/${entry.id}`,
    title: entry.data.title,
    meta: cardMeta(entry),
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
