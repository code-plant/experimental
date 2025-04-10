#!/usr/bin/env node

// copypasted from https://github.com/42ts/-ft-mode-codegen/blob/2f80f373f57b95685f54f337b7ee9320f6ff84cf/bin.d.ts

import { mkdir, readFile, writeFile } from "node:fs/promises";

import { Mode } from "@this-project/frontend-util-mode";

/** how to save/load mode */
export interface ModeCodegenConfigPersist {
  /** where to store the mode. default is 'cookie' for SSR */
  type?: "cookie" | "localStorage" | "sessionStorage";
  /** cookie name, or local/session storage key. default is 'mode'. */
  key?: string;
  /** don't save in generated code. default is false. */
  custom?: boolean;
}

/** how to apply the theme - custom: do nothing */
export type ModeCodegenConfigApply =
  | {
      /** which element to add class. default is 'html' */
      querySelector?: string;
      /** class name to add on dark theme. default is 'dark`. */
      darkClassName?: string;
      /** class name to add on light theme. default is null. */
      lightClassName?: string | null;
    }
  | "custom";

/** mode-codegen config (mode.config.json) */
export interface ModeCodegenConfig {
  /** persist strategy */
  persist?: ModeCodegenConfigPersist;
  /** apply strategy */
  apply?: ModeCodegenConfigApply;
  /** default theme mode. default is 'system' */
  defaultMode?: Mode;
  /** variable name of exposed ModeManager */
  variableName: string;
}

function validateMode(mode: unknown): asserts mode is Mode {
  if (mode !== "system" && mode !== "dark" && mode !== "light")
    throw new Error(`Invalid mode: ${mode}`);
}

function validatePersist(
  persist: unknown
): asserts persist is ModeCodegenConfigPersist {
  if (typeof persist !== "object" || !persist) {
    throw new Error(`Invalid persist: must be an object`);
  }
  if (
    "type" in persist &&
    persist.type !== "cookie" &&
    persist.type !== "localStorage" &&
    persist.type !== "localStorage"
  )
    throw new Error(`Invalid persist type: ${persist.type}`);
  if (
    "key" in persist &&
    persist.key !== undefined &&
    typeof persist.key !== "string"
  )
    throw new Error("Invalid persist key: string expected");
  if (
    "custom" in persist &&
    persist.custom !== undefined &&
    typeof persist.custom !== "boolean"
  )
    throw new Error("Invalid persist custom: boolean expected");
}

function validateApply(
  apply: unknown
): asserts apply is ModeCodegenConfigApply {
  if (apply === "custom") return;
  if (typeof apply !== "object" || !apply)
    throw new Error("Invalid apply object given");
  if (
    "querySelector" in apply &&
    apply.querySelector !== undefined &&
    typeof apply.querySelector !== "string"
  )
    throw new Error("Invalid apply query selector: string expected");
  if (
    "darkClassName" in apply &&
    apply.darkClassName !== undefined &&
    (typeof apply.darkClassName !== "string" || !apply.darkClassName)
  )
    throw new Error("Invalid apply dark class name");
  if (
    "lightClassName" in apply &&
    apply.lightClassName !== undefined &&
    apply.lightClassName !== null &&
    (typeof apply.lightClassName !== "string" || !apply.lightClassName)
  )
    throw new Error("Invalid apply light class name");
}

function validateConfig(config: unknown): asserts config is ModeCodegenConfig {
  if (typeof config !== "object" || !config)
    throw new Error("Invalid config object given");
  if (!("variableName" in config) || typeof config.variableName !== "string")
    throw new Error("variable name must be a string");
  if ("defaultMode" in config) validateMode(config.defaultMode);
  if ("persist" in config) validatePersist(config.persist);
  if ("apply" in config) validateApply(config.apply);
}

function addslashes(str: string) {
  return str.replace(/[\\"']/g, "\\$&");
}

(async () => {
  /** @type {import('./bin').ModeCodegenConfig} */
  const config = JSON.parse((await readFile("./mode.config.json")).toString());
  validateConfig(config);
  const fallbackToDefault =
    !config.defaultMode || config.defaultMode === "system"
      ? ""
      : `||'${config.defaultMode}'`;
  const load = config.persist?.custom
    ? `'${config.defaultMode}'`
    : !config.persist?.type || config.persist.type === "cookie"
    ? `(function(c,i){for(;i<c.length;i++)if(!c[i].indexOf(K+'='))return c[i].substring(${
        (config.persist?.key ?? "dark").length + 1
      })})(document.cookie.split('; '),0)${fallbackToDefault}`
    : `${config.persist.type}.getItem(K)${fallbackToDefault}`;
  const apply =
    config.apply === "custom"
      ? ""
      : `_=document.querySelector('${addslashes(
          config.apply?.querySelector ?? "html"
        )}').classList;if(t==d)_.add(y);else _.remove(y)${
          config.apply?.lightClassName
            ? `;if(t==l)_.add(Y);else _.remove(Y)`
            : ""
        }`;
  const save = config.persist?.custom
    ? ""
    : !config.persist?.type || config.persist.type === "cookie"
    ? `;document.cookie=K+'='+m+'; path=/'`
    : `;${config.persist.type}.setItem(K,m)`;
  await mkdir("public");
  await writeFile(
    "public/mode.js",
    // q = mediaQuery, m/t = current mode/theme, M/T = mode/theme watchers
    `;window['${addslashes(
      config.variableName
    )}']=(function(q,M,T,l,d,X,K,C,y,Y,m,t,H){` +
      // x = sanitizeMode
      `function x(_){return _==l||_==d?_:X}` +
      // s = setTheme
      `function s(_){t=_;T.forEach(function(_){_(t)});${apply}}` +
      // S = setMode
      `function S(_){m=x(_);M.forEach(function(_){_(m)});if(H)q.removeEventListener(C,H);H=0;if(m==X){H=h;q.addEventListener(C,H);s(m==X?[l,d][+q.matches]:m)}else s(m)${save}}` +
      // h = eventListener
      `function h(e){s([l,d][+e.matches])}` +
      `S(${load});` +
      `return{` +
      `getMode:function(){return m},` +
      `getTheme:function(){return t},` +
      `setMode:S,` +
      `watchMode:function(l,w){w=function(_){l(_)};w(m);M.push(w);return function(i){i=M.indexOf(w);i>=0&&M.splice(i,1)}},` +
      `watchTheme:function(l,w){w=function(_){l(_)};w(t);T.push(w);return function(i){i=T.indexOf(w);i>=0&&T.splice(i,1)}}` +
      `}` +
      `})(window.matchMedia('(prefers-color-scheme: dark)'),[],[],'light','dark','system','${addslashes(
        config.persist?.key ?? ""
      )}','change'${
        config.apply !== "custom"
          ? `,'${addslashes(config.apply?.darkClassName ?? "dark")}'${
              config.apply?.lightClassName
                ? `,'${addslashes(config.apply.lightClassName)}'`
                : ""
            }`
          : ""
      });`
  );
})();
