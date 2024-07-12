import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";

export default function MarkdownPlain({ children, ...rest }) {
    return (
        <Markdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            {...rest}
            className={cn("text-lg", rest?.className)}>
            {children}
        </Markdown>
    );
}
