import {
  CSSContent,
  Media,
  MediaTerminal,
  VariantPlugin,
} from "@this-project/development-guc-core";

export interface MediaVariantPluginTheme {
  media: Record<string, string>;
}

const PREFIX = "media-";

export const MediaVariantPlugin: VariantPlugin<MediaVariantPluginTheme> = {
  prefixes: [PREFIX],
  isValidVariant(variant, config): boolean {
    return (
      variant.startsWith(PREFIX) &&
      (variant.startsWith(PREFIX + "[") ||
        variant.slice(PREFIX.length) in config.theme.media)
    );
  },
  process(content, variant, config): CSSContent[] {
    const value = variant.startsWith(PREFIX + "[")
      ? variant.slice(PREFIX.length + 1, -1).replace(/_/g, " ")
      : config.theme.media[variant.slice(PREFIX.length)];
    const newMedia: MediaTerminal = { type: "terminal", media: value };
    const media: Media = content.media
      ? content.media.type === "and"
        ? { type: "and", media: [...content.media.media, newMedia] }
        : { type: "and", media: [content.media, newMedia] }
      : newMedia;
    return [{ ...content, media }];
  },
};
