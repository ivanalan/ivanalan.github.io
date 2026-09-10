const WORDS_PER_MINUTE = 200;

/** Strip MDX/markdown noise so JSX tags and imports do not inflate the count. */
function toPlainText(source: string): string {
  return source
    .replace(/^import\s.+from\s.+;?$/gm, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~]/g, " ");
}

export function readingTimeLabel(source: string | undefined): string {
  const words = toPlainText(source ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}
