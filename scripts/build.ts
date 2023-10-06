import chalk from "chalk";
import { type BuildOptions, build } from "esbuild";

const ESM_FIX_BANNER = `
const require = (await import("node:module")).createRequire(import.meta.url);
const __filename = (await import("node:url")).fileURLToPath(import.meta.url);
`.trim();

const isProduction = process.argv.slice(2).includes("--production");

console.log(
  chalk.gray(`[Env] ${isProduction ? "Production" : "Development"}\n`),
);

const config = {
  entryPoints: ["src/index.ts"],
  outdir: "./dist",
  format: "esm",
  outExtension: {
    ".js": ".mjs",
  },
  platform: "node",
  bundle: true,
  minify: isProduction,
  sourcemap: false,
  banner: {
    js: ESM_FIX_BANNER,
  },
} satisfies BuildOptions;

const start = performance.now();
try {
  await build(config);
  const duration = readableTime(performance.now() - start);
  console.log(`⚡️ Build success took ${duration}`);
  process.exit(0);
} catch (e) {
  console.log("☠️ Build failed");
  process.exit(1);
}

/* Helpers */
function readableTime(ms: number) {
  const minutes = Math.floor(ms / 1000 / 60);
  const seconds = Math.floor(ms / 1000) % 60;

  if (minutes) {
    return `${minutes}m` + (seconds ? `${seconds}s` : "");
  }

  if (seconds) {
    return `${seconds}s`;
  }

  return `${ms.toPrecision(3)}ms`;
}
