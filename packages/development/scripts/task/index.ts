#!/usr/bin/env node

import { Args } from "@this-project/development-util-args";
import { env } from "@this-project/util-atomic-env";
import { ThrottledPool } from "@this-project/util-atomic-throttled-pool";
import { unwrapNonNullable } from "@this-project/util-atomic-unwrap-non-nullable";
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { cpus } from "node:os";
import { resolve } from "node:path";

const args = Args.instance
  .keyword(Args.STRING, "cwd", "C")
  .keyword(Args.STRING, "file", "f")
  .keyword(Args.INT, "jobs", "j")
  .boolean("keep-going", "k")
  .positional(Args.STRING)
  .parse(process.argv.slice(2));

if (args.type === "help") {
  console.log(`Usage: task [options] <task> [...args]

Options:
  -c, --cwd <path>  The directory to run the task in
  -f, --file <path> Path to the task file
  -k, --keep-going  Keep going even if some tasks fail
  -h, --help        Show help
  -v, --version     Show version
`);
  process.exit(0);
}

if (args.type === "version") {
  console.log("Version 0.1.0");
  process.exit(0);
}

if (args.type === "error") {
  throw new Error(args.reason);
}

const cwd = args.keywords.cwd ? resolve(args.keywords.cwd) : process.cwd();
const jobs = (args.keywords.jobs ?? cpus().length) || 1;
const keepGoing = args.keywords["keep-going"] ?? false;
const [task] = args.positional;
const extra = args.extra;

type TaskFile = Partial<Record<string, TaskDefinition>>;

interface TaskDefinition {
  deps?: string[];
  cmd: Command;
  env?: Partial<Record<string, string>>;
}

type Command = string | CommandItem[];

type CommandItem = string | CommandItemEnv | CommandItemCwd | CommandItemExtra;

interface CommandItemEnv {
  type: "env";
  name: string;
}

interface CommandItemCwd {
  type: "cwd";
}

interface CommandItemExtra {
  type: "extra";
  index: number;
}

// TODO: validate task file

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const taskFile: TaskFile = JSON.parse(
  readFileSync(resolve(cwd, args.keywords.file ?? "Task.json"), "utf8"),
);

type State =
  | { type: "running"; promise: Promise<void> }
  | { type: "done"; succeed: boolean };

const pool = new ThrottledPool(jobs);
const states = new Map<string, State>();

async function runTask(name: string) {
  if (states.has(name)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const state = states.get(name)!;
    if (state.type === "running") {
      await state.promise;
    }
    return;
  }
  const promise = new Promise<void>((resolve, reject) => {
    const taskDefinition = taskFile[name];
    if (!taskDefinition) {
      reject(new Error(`Task "${name}" not found`));
      return;
    }

    (async () => {
      await Promise.all(taskDefinition.deps?.map((dep) => runTask(dep)) ?? []);
      await pool.run(() => {
        const args =
          typeof taskDefinition.cmd === "string"
            ? ["sh", "-c", taskDefinition.cmd]
            : taskDefinition.cmd.map((item) =>
                typeof item === "string"
                  ? item
                  : item.type === "cwd"
                    ? cwd
                    : item.type === "env"
                      ? env(item.name)
                      : unwrapNonNullable(extra[item.index]),
              );
        if (
          (taskDefinition.deps ?? []).some((dep) => {
            const state = states.get(dep);
            return state?.type !== "done" || !state.succeed;
          })
        ) {
          states.set(name, { type: "done", succeed: false });
          resolve();
          return;
        } else {
          resolve(
            new Promise<void>((resolve, reject) => {
              console.log(`Running ${name}...`);
              const proc = spawn(String(args[0]), args.slice(1), {
                stdio: "inherit",
                env: {
                  ...process.env,
                  ...taskDefinition.env,
                },
                cwd,
              });
              proc.on("close", (code) => {
                if (code === 0) {
                  states.set(name, { type: "done", succeed: true });
                  console.log(`Task "${name}" succeeded`);
                  resolve();
                } else {
                  if (keepGoing) {
                    states.set(name, { type: "done", succeed: false });
                    console.log(`Task "${name}" failed with code ${code}`);
                    resolve();
                  } else {
                    reject(
                      new Error(`Task "${name}" failed with code ${code}`),
                    );
                  }
                }
              });
            }),
          );
        }
      });
    })().catch(reject);
  });
  if (!states.has(name)) {
    states.set(name, { type: "running", promise });
  }
  return await promise;
}

runTask(task)
  .then(() => {
    const atLeastOneTaskFailed = Array.from(states.values()).some(
      (state) => state.type !== "done" || !state.succeed,
    );
    process.exit(atLeastOneTaskFailed ? 1 : 0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
