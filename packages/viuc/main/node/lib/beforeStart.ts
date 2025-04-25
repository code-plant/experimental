import { unlink } from "node:fs/promises";

import { ThemeBase } from "@this-project/viuc-main-core";
import { glob } from "glob";
import { Config } from "./types/Config";

export async function beforeStart<TTheme extends ThemeBase>(
  config: Config<TTheme>
): Promise<void> {
  if (config.filesToClearBeforeStartGlobPattern) {
    const filePathsToClear = await glob(
      config.filesToClearBeforeStartGlobPattern
    );
    for (const filePath of filePathsToClear) {
      if (
        !config.shouldClearFileBeforeStart ||
        (await config.shouldClearFileBeforeStart(filePath))
      ) {
        await unlink(filePath);
      }
    }
  }
}
