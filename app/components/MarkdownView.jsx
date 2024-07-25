import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";
import { BsQuestionOctagonFill } from "react-icons/bs";

export default function MarkdownView({ children, ...rest }) {
    const slices = children.split("\n\n");
    return (
        <div
            className={cn(
                "rounded-xl p-2 w-[min(calc(100vw-104px),710px)]",
                "bg-[#f0f4f9] dark:bg-[#0e1724]"
            )}>
            {slices.map((slice, index) => {
                return (
                    <div className="pl-2 relative group">
                        <span
                            className="absolute top-1/2 right-full transform -translate-y-1/2 hidden group-hover:block cursor-pointer hover:scale-125 transition-all"
                            onClick={() => {
                                console.log(slice);
                            }}>
                            <BsQuestionOctagonFill className="text-xl" />
                        </span>
                        <Markdown
                            key={index}
                            children={slice}
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            {...rest}
                            className={cn("text-lg leading-6", rest?.className)}
                        />
                    </div>
                );
            })}
        </div>
    );
}
