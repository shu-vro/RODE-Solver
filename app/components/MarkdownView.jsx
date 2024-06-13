import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";

export default function MarkdownView({ children, ...rest }) {
    return (
        <Markdown
            className="text-lg"
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            {...rest}>
            {children}
        </Markdown>
    );
}
