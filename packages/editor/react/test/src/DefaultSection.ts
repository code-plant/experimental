import { SectionComponentProps } from "@this-project/editor-react-mdcode";
import { createElement } from "react";

export function DefaultSection({
  level,
  title,
  id,
  children,
}: SectionComponentProps<unknown>) {
  const heading =
    level <= 6
      ? createElement(
          `h${level}`,
          {
            id,
          },
          title
        )
      : createElement(
          "div",
          { id, role: "heading", "aria-level": level },
          title
        );
  return createElement("section", { id }, heading, children);
}
