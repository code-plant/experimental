#!/usr/bin/env node

import { once } from "@this-project/development-guc-node";
import { Args } from "@this-project/development-util-args";
import { basename } from "node:path";
import { typePlugins, TypePluginsTheme } from "./typePlugins";
import { variantPlugins, VariantPluginsTheme } from "./variantPlugins";

export interface AllPluginsTheme
  extends TypePluginsTheme,
    VariantPluginsTheme {}

const args = Args.instance.boolean("near", "n").parse(process.argv.slice(2));
if (args.type === "error") {
  throw new Error(args.reason);
} else if (args.type === "version") {
  console.log("Version 0.1.0");
  process.exit(0);
} else if (args.type === "help") {
  console.log(`Usage: node ${process.argv[1]} [...options]
Options:
-n --near: place output near source
`);
  process.exit(0);
}

const near = args.keywords.near;

once<AllPluginsTheme>({
  allowArbitraryValue: true,
  darkModeStrategy: { type: "class", fallbackDarkMode: false, on: "html" },
  emitTo: near
    ? {
        to: "nearSource",
        path: {
          type: "function",
          path: (sourcePath) => ({
            relativePath: `./${basename(sourcePath)}.guc.css`,
            onConflict: "error",
          }),
        },
      }
    : {
        to: "oneFile",
        path: "./output.guc.css",
      },
  typePlugins,
  variantPlugins,
  theme: {
    margin: { auto: "auto" },
    media: { dark: "prefers-color-scheme:dark" },
  },
  prefix: "",
  filesToProcessGlobPattern: "**/*.{ts,tsx}",
  filesToClearBeforeStartGlobPattern: "**/*.guc.css",
});
