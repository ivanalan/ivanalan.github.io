import type { CSSProperties } from "react";
import type { WorkCard, WorkTabsProps } from "./work-tabs.types";
import { ShaderCover } from "@/components/ShaderCover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

/** Cards continue the cascade started by the intro (0-2) and the tab bar (3). */
const CARD_REVEAL_OFFSET = 4;

function Card({ item, index }: { item: WorkCard; index: number }) {
  return (
    <a
      href={item.href}
      style={{ "--reveal-index": index } as CSSProperties}
      className="reveal group flex flex-col gap-3 rounded-xl p-2 outline-none transition-colors hover:bg-secondary focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {item.coverShader ? (
        <ShaderCover
          variant={item.coverShader}
          className="aspect-[16/9] w-full transition-opacity group-hover:opacity-85"
        />
      ) : item.coverSrc ? (
        <img
          src={item.coverSrc}
          alt=""
          width={item.coverWidth}
          height={item.coverHeight}
          fetchPriority={item.fetchPriority}
          className="aspect-[16/9] w-full rounded-xl bg-muted object-cover transition-opacity group-hover:opacity-85"
        />
      ) : (
        <div
          className="aspect-[16/9] w-full rounded-xl bg-muted transition-colors group-hover:bg-muted/70"
          aria-hidden="true"
        />
      )}
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-work-title text-foreground">
          {item.title}
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          {item.summary}
        </p>
      </div>
    </a>
  );
}

export function WorkTabs({
  work,
  sideProjects,
  defaultTab = "work",
}: WorkTabsProps) {
  return (
    <Tabs defaultValue={defaultTab} className="gap-4">
      <TabsList
        aria-label="Work collections"
        style={{ "--reveal-index": 3 } as CSSProperties}
        className="reveal h-auto gap-2 bg-transparent p-0 group-data-horizontal/tabs:h-auto"
      >
        <TabsTrigger
          value="work"
          className={cn(
            "h-auto cursor-pointer rounded-lg p-2 text-sm",
            "hover:not-data-active:bg-muted",
            "dark:data-active:border-transparent dark:data-active:bg-muted",
          )}
        >
          Work
        </TabsTrigger>
        <TabsTrigger
          value="side-projects"
          className={cn(
            "h-auto cursor-pointer rounded-lg p-2 text-sm",
            "hover:not-data-active:bg-muted",
            "dark:data-active:border-transparent dark:data-active:bg-muted",
          )}
        >
          Side projects
        </TabsTrigger>
      </TabsList>
      <TabsContent value="work" className="flex flex-col gap-12">
        {work.map((item, index) => (
          <Card key={item.href} item={item} index={CARD_REVEAL_OFFSET + index} />
        ))}
      </TabsContent>
      <TabsContent value="side-projects" className="flex flex-col gap-12">
        {sideProjects.length > 0 ? (
          sideProjects.map((item, index) => (
            <Card key={item.href} item={item} index={CARD_REVEAL_OFFSET + index} />
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            Nothing here yet.
          </p>
        )}
      </TabsContent>
    </Tabs>
  );
}
