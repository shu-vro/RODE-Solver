"use client";

import React, { useState } from "react";
import MarkdownView from "@/app/components/MarkdownView";
import MathField from "@/app/components/MathField";

let ans = `A nice differential equation problem!

Let's start by separating the variables:

$$\\frac{\\mathrm{d}y}{\\mathrm{d}x}=\\frac{x(2\\log x+1)}{\\sin y+y\\cos y}$$

$$\\Rightarrow\\qquad\\frac{\\mathrm{d}y}{\\sin y+y\\cos y}=\\frac{2\\log x+1}{x}\\mathrm{d}x$$

Now, let's introduce a new variable $u=\\sin y+y\\cos y$. Then, we can rewrite the equation as:

$$\\frac{\\mathrm{d}y}{u}=\\frac{2\\log x+1}{x}\\mathrm{d}x$$

$$\\Rightarrow\\qquad\\int\\frac{\\mathrm{d}y}{u}=\\int\\frac{2\\log x+1}{x}\\mathrm{d}x$$

Evaluating the integrals, we get:

$$\\ln|u|+C=\\int\\frac{2\\log x+1}{x}\\mathrm{d}x$$

$$=\\int\\frac{\\log x^2}{x}\\mathrm{d}x+\\int\\frac{1}{x}\\mathrm{d}x$$

$$=\\log|x|+\\log|x|+C$$

$$=2\\log|x|+C$$

$$\\Rightarrow\\qquad u=e^{2\\log|x|+C}=e^{2\\log|x|}\\cdot e^C$$

$$=e^C|x|^2$$

Now, we can express $u$ in terms of $y$:

$$u=\\sin y+y\\cos y=e^C|x|^2$$

$$\\Rightarrow\\qquad\\sin y+y\\cos y=e^C|x|^2$$

This is the general solution of the differential equation. Note that we have an arbitrary constant $C$, which can be determined by the initial conditions of the problem.

To simplify the solution, we can use the fact that $e^C|x|^2$ is a constant multiple of $|x|^2$. Therefore, we can write:

$$\\sin y+y\\cos y=k|x|^2$$

where $k$ is a constant.

This is the final solution of the differential equation.`;

export default function Page() {
    const [value, setValue] = useState("");
    const [md, setMd] = useState("");
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

            <textarea
                name="whatever"
                id=""
                cols="30"
                rows="10"
                value={md}
                onChange={e => {
                    setMd(e.target.value);
                }}></textarea>
            <MarkdownView>{md}</MarkdownView>
            <hr />
            <MarkdownView>{ans}</MarkdownView>
        </div>
    );
}
