import { CSSContent, Media, MediaCompound } from "./types/CSSContent";

function flatMedia(media: Media[], type: MediaCompound["type"]): Media[] {
  const result: Media[] = [];
  for (const node of media) {
    if (node.type === "terminal") {
      result.push(node);
    } else {
      result.push(...flatMedia(node.media, type));
    }
  }
  return result;
}

function stringifyMedia(media: Media | undefined): string | undefined {
  if (!media) {
    return undefined;
  }
  switch (media.type) {
    case "terminal":
      return `(${media.media})`;
    case "and": {
      return flatMedia(media.media, "and")
        .map((media) =>
          media.type === "or"
            ? `(${stringifyMedia(media)})`
            : stringifyMedia(media)
        )
        .join(" and ");
    }
    case "or": {
      return flatMedia(media.media, "or").map(stringifyMedia).join(",");
    }
  }
}

export function stringify(contents: CSSContent[]): string {
  // TODO: group same media, optimize media
  const result: string[] = [];
  for (const content of contents) {
    const media = stringifyMedia(content.media);
    result.push(
      media
        ? `@media ${media}{${content.selector}{${content.content}}}`
        : `${content.selector}{${content.content}}`
    );
  }
  return result.join("");
}
