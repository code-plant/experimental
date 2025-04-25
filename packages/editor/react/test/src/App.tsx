import { Builder } from "@this-project/editor-core-builder";
import { parse } from "@this-project/editor-core-parser";
import { SectionPlugin } from "@this-project/editor-plugins-section";
import { render } from "@this-project/editor-react-mdcode";
import { Result } from "@this-project/util-common-types";
import { ReactNode, useEffect, useRef, useState } from "react";
import { unwrap } from "../../../../util/atomic/unwrap";
import { DefaultSection } from "./DefaultSection";
import "./style.css";

export function App() {
  const [editorContent, setEditorContent] = useState("");
  const [previewContent, setPreviewContent] = useState<Result<ReactNode>>();
  const timerRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      const result1 = new Builder(parse(editorContent))
        .apply(SectionPlugin)
        .build();
      if (result1.type === "error") {
        setPreviewContent({
          type: "error",
          error:
            typeof result1.error === "string"
              ? result1.error
              : JSON.stringify(result1.error, null, 2),
        });
      } else {
        setPreviewContent(
          render(result1.value, {
            code: {
              renderNode: (node) => {
                return {
                  type: "ok",
                  value: (
                    <pre>
                      <code>{node.content}</code>
                    </pre>
                  ),
                };
              },
            },
            text: {
              renderNode: (node) => {
                return { type: "ok", value: <span>{node.content}</span> };
              },
            },
            tag: {
              renderNode: (node, _options, renderOtherNode) => {
                try {
                  if (node.name === "section") {
                    return {
                      type: "ok",
                      value: (
                        <DefaultSection
                          level={1}
                          title={node.attrs.title! as string}
                          id={node.attrs.id as string | undefined}
                          children={node.children.map((node) =>
                            unwrap(renderOtherNode(node))
                          )}
                        />
                      ),
                    };
                  }
                  return {
                    type: "error",
                    error: `Unrecognized tag: ${node.name}`,
                  };
                } catch (e) {
                  return {
                    type: "error",
                    error: `Error rendering tag: ${node.name}: ${e}`,
                  };
                }
              },
            },
          })
        );
      }
      timerRef.current = null;
    }, 100);
  }, [editorContent]);

  return (
    <div className="root">
      <textarea
        className="editor"
        value={editorContent}
        onChange={(e) => setEditorContent(e.target.value)}
      />
      <div className="preview">
        {previewContent === undefined && (
          <p>Type something to see the preview</p>
        )}
        {previewContent?.type === "error" && <p>{previewContent.error}</p>}
        {previewContent?.type === "ok" && previewContent.value}
      </div>
    </div>
  );
}
