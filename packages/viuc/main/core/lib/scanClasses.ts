import { executionContext, ExecutionContext } from "./executionContext";
import { Config, ConfigWithoutPlugins } from "./types/Config";
import { GUCClass } from "./types/GUCClass";
import { ThemeBase } from "./types/ThemeBase";
import { stringToGUCClass } from "./util/stringToGUCClass";

function isValidClassName<TTheme extends ThemeBase>(
  className: string,
  config: ConfigWithoutPlugins<TTheme>,
  context: ExecutionContext<TTheme>
): boolean {
  let valid = false;
  for (const prefix in context.typePrefixes) {
    if (className.startsWith(prefix)) {
      for (const plugin of context.typePrefixes[prefix]!) {
        if (plugin.isValidClass(className, config)) {
          markAsValid();
        }
      }
    }
  }
  for (const plugin of context.typesWithoutPrefix) {
    if (plugin.isValidClass(className, config)) {
      markAsValid();
    }
  }
  return valid;

  var alreadyWarned: true | undefined;
  function warn() {
    if (alreadyWarned) return;
    alreadyWarned = true;
    const warn = `Same class has multiple handlers: ${className}`;
    context.warnings[warn] ??= 0;
    context.warnings[warn]++;
  }
  function markAsValid() {
    if (valid) warn();
    valid = true;
  }
}

function isValidVariant<TTheme extends ThemeBase>(
  variant: string,
  config: ConfigWithoutPlugins<TTheme>,
  context: ExecutionContext<TTheme>
): boolean {
  let valid = false;
  for (const prefix in context.variantPrefixes) {
    if (variant.startsWith(prefix)) {
      for (const plugin of context.variantPrefixes[prefix]) {
        if (plugin.isValidVariant(variant, config)) {
          markAsValid();
        }
      }
    }
  }
  for (const plugin of context.variantsWithoutPrefix) {
    if (plugin.isValidVariant(variant, config)) {
      markAsValid();
    }
  }
  return valid;

  var alreadyWarned: true | undefined;
  function warn() {
    if (alreadyWarned) return;
    alreadyWarned = true;
    const warn = `Same variant has multiple handlers: ${variant}`;
    context.warnings[warn] ??= 0;
    context.warnings[warn]++;
  }
  function markAsValid() {
    if (valid) warn();
    valid = true;
  }
}

function isValidGUCClass<TTheme extends ThemeBase>(
  { className, variants }: GUCClass,
  config: ConfigWithoutPlugins<TTheme>,
  context: ExecutionContext<TTheme>
): boolean {
  return (
    isValidClassName(className, config, context) &&
    variants.every((variant) => isValidVariant(variant, config, context))
  );
}

export function scanClasses<TTheme extends ThemeBase>(
  source: string,
  config: Config<TTheme>,
  context: ExecutionContext<TTheme> = executionContext(config)
): GUCClass[] {
  const { typePlugins, variantPlugins, ...configWithoutPlugins } = config;
  const regex =
    /(?:^|[^\w-])((?:[\w-]+(?:\[[^\s:]*\])?:)*)([\w]+-[\w-]*(?:\[[^\s:]*\]|\w+))(?:[^\w-]|$)/gm;
  const allPossibilities: string[] = [];
  for (
    let match: RegExpExecArray | null = regex.exec(source);
    match !== null;
    match = regex.exec(source)
  ) {
    allPossibilities.push(`${match[1]}${match[2]}`);
  }

  allPossibilities.sort();

  const deduplicatedPossibilities: GUCClass[] = [];
  for (let i = 0; i < allPossibilities.length; i++) {
    if (i === 0 || allPossibilities[i] !== allPossibilities[i - 1]) {
      deduplicatedPossibilities.push(stringToGUCClass(allPossibilities[i]));
    }
  }

  return deduplicatedPossibilities.filter((possibility) =>
    isValidGUCClass(possibility, configWithoutPlugins, context)
  );
}
