import { visit } from "unist-util-visit";

type CodeNode = {
  type: "code";
  lang?: string | null;
  value: string;
};

type Parent = {
  children: unknown[];
};

/**
 * Turns a ```mermaid fence into <Mermaid chart="..." /> so notes stay plain Markdown.
 */
export function remarkMermaid() {
  return (tree: unknown) => {
    visit(tree, "code", (node: CodeNode, index: number | undefined, parent: Parent | undefined) => {
      if (node.lang !== "mermaid" || index == null || !parent) return;
      parent.children[index] = {
        type: "mdxJsxFlowElement",
        name: "Mermaid",
        attributes: [
          {
            type: "mdxJsxAttribute",
            name: "chart",
            value: node.value,
          },
        ],
        children: [],
      };
    });
  };
}
