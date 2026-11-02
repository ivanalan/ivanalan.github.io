import { createReadStream, existsSync, statSync } from "node:fs";
import { cp, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const MIME = {
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webm": "video/webm",
  ".webp": "image/webp",
};

/** A project folder is `src/projects/<name>/index.mdx` plus `assets/`. */
function assetFile(projectsDir, url) {
  const pathname = decodeURIComponent((url ?? "").split("?")[0]);
  const match = pathname.match(/^\/([^/]+)\/assets\/(.+)$/);
  if (!match) return;
  const [, project, rel] = match;
  if (rel.includes("\0")) return;

  const projectDir = path.resolve(projectsDir, project);
  if (!existsSync(path.join(projectDir, "index.mdx"))) return;

  const assetsDir = path.join(projectDir, "assets");
  const file = path.resolve(assetsDir, rel);
  const relative = path.relative(assetsDir, file);
  if (relative.startsWith("..") || path.isAbsolute(relative)) return;
  if (!existsSync(file)) return;

  const info = statSync(file);
  if (!info.isFile()) return;

  const type = MIME[path.extname(file).toLowerCase()] ?? "application/octet-stream";
  return { file, size: info.size, type };
}

function send(req, res, asset) {
  const { file, size, type } = asset;
  const range = req.headers.range;

  if (range) {
    const matched = /bytes=(\d*)-(\d*)/.exec(range);
    if (!matched) {
      res.statusCode = 416;
      res.end();
      return;
    }
    const start = matched[1] ? Number(matched[1]) : 0;
    const end = matched[2] ? Number(matched[2]) : size - 1;
    if (start >= size || end >= size || start > end) {
      res.statusCode = 416;
      res.setHeader("Content-Range", `bytes */${size}`);
      res.end();
      return;
    }
    res.statusCode = 206;
    res.setHeader("Content-Range", `bytes ${start}-${end}/${size}`);
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Content-Length", String(end - start + 1));
    res.setHeader("Content-Type", type);
    if (req.method === "HEAD") {
      res.end();
      return;
    }
    createReadStream(file, { start, end }).on("error", () => res.destroy()).pipe(res);
    return;
  }

  res.statusCode = 200;
  res.setHeader("Accept-Ranges", "bytes");
  res.setHeader("Content-Length", String(size));
  res.setHeader("Content-Type", type);
  if (req.method === "HEAD") {
    res.end();
    return;
  }
  createReadStream(file).on("error", () => res.destroy()).pipe(res);
}

/** Serves each project's assets/ at /<project>/assets/ in dev, and copies them into the build. */
export function projectAssets(root) {
  const projectsDir = path.join(root, "src", "projects");
  return {
    name: "project-assets",
    hooks: {
      "astro:server:setup"({ server }) {
        server.middlewares.use((req, res, next) => {
          if (req.method !== "GET" && req.method !== "HEAD") return next();
          const asset = assetFile(projectsDir, req.url);
          if (!asset) return next();
          send(req, res, asset);
        });
      },
      async "astro:build:done"({ dir }) {
        const out = fileURLToPath(dir);
        const entries = await readdir(projectsDir, { withFileTypes: true });
        await Promise.all(
          entries.map(async (entry) => {
            if (!entry.isDirectory()) return;
            const projectDir = path.join(projectsDir, entry.name);
            if (!existsSync(path.join(projectDir, "index.mdx"))) return;
            const assetsDir = path.join(projectDir, "assets");
            if (!existsSync(assetsDir)) return;
            await cp(assetsDir, path.join(out, entry.name, "assets"), { recursive: true });
          }),
        );
      },
    },
  };
}
