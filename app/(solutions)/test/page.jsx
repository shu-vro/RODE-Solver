"use client";

import React, { useState } from "react";
import MarkdownView from "@/app/components/MarkdownView";
import MathField from "@/app/components/MathField";

let ans = `$\\int\\frac{\\sqrt{x+3}}{x+2}\\mathrm{d}x$\n\nLet $u = \\sqrt{x+3}$. Then $x = u^2 - 3$ and $\\mathrm{d}x = 2u\\mathrm{d}u$.\n\n$\\int\\frac{\\sqrt{x+3}}{x+2}\\mathrm{d}x = \\int \\frac{u}{u^2 - 1} 2u\\mathrm{d}u = 2\\int\\frac{u^2}{u^2 - 1}\\mathrm{d}u$\n\n$= 2\\int\\frac{u^2 - 1 + 1}{u^2 - 1}\\mathrm{d}u = 2\\int\\left(1 + \\frac{1}{u^2 - 1}\\right) \\mathrm{d}u$\n\n$= 2\\int\\left(1 + \\frac{1}{(u-1)(u+1)}\\right) \\mathrm{d}u$\n\nWe can use partial fraction decomposition to solve the second integral:\n\n$\\frac{1}{(u-1)(u+1)} = \\frac{A}{u-1} + \\frac{B}{u+1}$\n\n$1 = A(u+1) + B(u-1)$\n\nWhen $u = 1$, we get $A = \\frac{1}{2}$.\n\nWhen $u = -1$, we get $B = -\\frac{1}{2}$.\n\nTherefore,\n\n$2\\int\\left(1 + \\frac{1}{(u-1)(u+1)}\\right) \\mathrm{d}u = 2\\int\\left(1 + \\frac{1/2}{u-1} - \\frac{1/2}{u+1}\\right) \\mathrm{d}u$\n\n$= 2\\left(u + \\frac{1}{2}\\ln|u-1| - \\frac{1}{2}\\ln|u+1|\\right) + C$\n\n$= 2u + \\ln|u-1| - \\ln|u+1| + C$\n\n$= 2\\sqrt{x+3} + \\ln|\\sqrt{x+3} - 1| - \\ln|\\sqrt{x+3} + 1| + C$\n\n$= 2\\sqrt{x+3} + \\ln\\left|\\frac{\\sqrt{x+3} - 1}{\\sqrt{x+3} + 1}\\right| + C$\n`;

export default function Page() {
    const [value, setValue] = useState("");
    return (
        <div className="w-full">
            <MathField
                value={value}
                style={{ margin: "0 auto", maxWidth: "600px" }}
                onInput={evt => setValue(evt.target.value)}
            />
            <textarea
                placeholder="output goes here"
                value={value}
                readOnly
                rows={10}
                cols={40}
                className="mx-auto block mt-4 mb-20"></textarea>
            <MarkdownView>{ans}</MarkdownView>
        </div>
    );
}
