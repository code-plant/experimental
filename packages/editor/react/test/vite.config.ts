import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // https://vite.dev/guide/dep-pre-bundling.html#monorepos-and-linked-dependencies
  optimizeDeps: {
    include: [
      "@this-project/editor-core-builder",
      "@this-project/editor-core-parser",
      "@this-project/editor-core-types",
      "@this-project/editor-plugins-section",
      "@this-project/editor-react-mdcode",
      "@this-project/editor-react-types",
      "@this-project/util-atomic-unwrap",
      "@this-project/util-common-types",
    ],
  },
  build: {
    commonjsOptions: { include: [/^@this-project\//] },
  },
});
