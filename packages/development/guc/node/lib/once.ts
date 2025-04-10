import { readFile, stat, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import {
  cssContent,
  ExecutionContext,
  executionContext,
  scanClasses,
  stringify,
} from "@this-project/development-guc-core";
import { glob } from "glob";
import { beforeStart } from "./beforeStart";
import { Config, ConfigEmitToNearSource } from "./types/Config";

export async function once<TTheme>(config: Config<TTheme>) {
  await beforeStart(config);

  if (config.emitTo.to === "oneFile") {
    const filePathsToProcess = await glob(config.filesToProcessGlobPattern);
    const allFiles: string[] = [];
    for (const filePath of filePathsToProcess) {
      if (!config.shouldProcess || (await config.shouldProcess(filePath))) {
        allFiles.push((await readFile(filePath)).toString());
      }
    }
    const context = executionContext(config);
    const result = stringify(
      scanClasses(allFiles.join(), config, context).flatMap((gucClass) =>
        cssContent(gucClass, config, context)
      )
    );
    if (result) {
      await writeFile(config.emitTo.path, result);
    }
  } else {
    const filePathsToProcess = await glob(config.filesToProcessGlobPattern);
    const context = executionContext(config);
    for (const filePath of filePathsToProcess) {
      if (!config.shouldProcess || (await config.shouldProcess(filePath))) {
        processFile(
          filePath,
          config as Config<TTheme> & { emitTo: ConfigEmitToNearSource },
          context
        );
      }
    }
  }
}

async function processFile<TTheme>(
  filePath: string,
  config: Config<TTheme> & { emitTo: ConfigEmitToNearSource },
  context: ExecutionContext<TTheme>
): Promise<void> {
  const { relativePath, onConflict } =
    config.emitTo.path.type === "relativePath"
      ? config.emitTo.path
      : config.emitTo.path.path(filePath);
  const outPath = resolve(dirname(filePath), relativePath);
  if (await fileExists(outPath)) {
    if (onConflict === "error") {
      throw new Error(
        `Failed to process ${filePath}: path conflict: ${outPath}`
      );
    } else {
      throw new Error("// TODO: merge is not supported yet");
    }
  }
  const result = stringify(
    scanClasses((await readFile(filePath)).toString(), config, context).flatMap(
      (gucClass) => cssContent(gucClass, config, context)
    )
  );
  if (result) {
    await writeFile(outPath, result);
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return false;
    } else {
      throw error;
    }
  }
}
