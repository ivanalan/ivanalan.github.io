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
  projects,
  playground,
  defaultTab = "projects",
}: WorkTabsProps) {
  return (
    <Tabs defaultValue={defaultTab} className="gap-8">
      <TabsList
        aria-label="Work collections"
        style={{ "--reveal-index": 3 } as CSSProperties}
        className="reveal h-auto gap-2 bg-transparent p-0 group-data-horizontal/tabs:h-auto"
      >
        <TabsTrigger
          value="projects"
          className={cn(
            "h-auto cursor-pointer rounded-lg p-2 text-sm",
            "hover:not-data-active:bg-muted",
            "dark:data-active:border-transparent dark:data-active:bg-muted",
          )}
        >
          Projects
        </TabsTrigger>
        <TabsTrigger
          value="playground"
          className={cn(
            "h-auto cursor-pointer rounded-lg p-2 text-sm",
            "hover:not-data-active:bg-muted",
            "dark:data-active:border-transparent dark:data-active:bg-muted",
          )}
        >
          Playground
        </TabsTrigger>
      </TabsList>
      <TabsContent value="projects" className="flex flex-col gap-12">
        {projects.map((item, index) => (
          <Card key={item.href} item={item} index={CARD_REVEAL_OFFSET + index} />
        ))}
      </TabsContent>
      <TabsContent value="playground" className="flex flex-col gap-12">
        {playground.length > 0 ? (
          playground.map((item, index) => (
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
