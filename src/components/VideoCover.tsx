import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/** Playback starts on hydration rather than through the autoplay attribute, so
 *  reduced motion holds the clip on its first frame instead of looping it. */
export function VideoCover({
  src,
  className,
  videoClassName,
}: {
  src: string;
  className?: string;
  videoClassName?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      const video = ref.current;
      if (!video) return;

      if (query.matches) {
        video.pause();
      } else {
        void video.play().catch(() => {});
      }
    };

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return (
    /* The wrapper clips the scaled video so the zoom crops the frame rather
       than spilling the card's rounded corners. */
    <div className={cn("overflow-hidden bg-muted", className)}>
      <video
        ref={ref}
        src={src}
        width={1280}
        height={720}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        className={cn("size-full object-cover", videoClassName)}
      />
    </div>
  );
}
