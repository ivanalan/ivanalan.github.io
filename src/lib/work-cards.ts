import type { WorkCard } from "@/components/work-tabs.types";
import { getImage } from "astro:assets";
import { getCollection } from "astro:content";

type Entry = Awaited<ReturnType<typeof getCollection<"work" | "sideProjects">>>[number];

const toCard = async (entry: Entry, featured = false): Promise<WorkCard> => {
  const cover = entry.data.cover
    ? await getImage({ src: entry.data.cover, width: 1280 })
    : undefined;

  return {
    href: `/work/${entry.id}`,
    title: entry.data.title,
    summary: entry.data.summary,
    status: entry.data.status,
    coverSrc: cover?.src,
    coverWidth: cover?.attributes.width,
    coverHeight: cover?.attributes.height,
    coverShader: entry.data.coverShader,
    coverVideo:
      entry.collection === "sideProjects" ? entry.data.coverVideo : undefined,
    coverVideoPoster:
      entry.collection === "sideProjects"
        ? entry.data.coverVideoPoster
        : undefined,
    coverVideoClassName:
      entry.collection === "sideProjects"
        ? entry.data.coverVideoClassName
        : undefined,
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
