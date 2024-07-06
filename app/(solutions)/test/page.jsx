"use client";

import React, { useState } from "react";
import MarkdownView from "@/app/components/MarkdownView";
import MathField from "@/app/components/MathField";

let ans = `$\\frac{dy}{dx} = \\frac{x + 2y - 3}{2x + y - 3}$

Let $ x = X + h $ and $ y = Y + k $. The given equation becomes:

$\\frac{dY}{dX} = \\frac{X + 2Y + (h + 2k - 3)}{2X + Y + (2h + k - 3)}$

Solving for $ h $ and $ k $:

$h + 2k - 3 = 0$

$2h + k - 3 = 0$

This gives $ h = 1 $ and $ k = 1 $. Thus, the equation becomes:

$\\frac{dY}{dX} = \\frac{X + 2Y}{2X + Y}$

Let $ Y = vX $, then:

$\\frac{dY}{dX} = v + X \\frac{dv}{dX}$

Substituting:

$v + X \\frac{dv}{dX} = \\frac{X + 2vX}{2X + vX}$

Simplifying:

$v + X \\frac{dv}{dX} = \\frac{1 + 2v}{2 + v}$

$\\Rightarrow X \\frac{dv}{dX} = \\frac{1 + 2v - v(2 + v)}{2 + v} = \\frac{1 + 2v - 2v - v^2}{2 + v} = \\frac{1 - v^2}{2 + v}$


$\\Rightarrow \\frac{dv}{dX} = \\frac{1 - v^2}{X(2 + v)}$

Separating variables and integrating:

$\\frac{X dX}{X} = \\left( \\frac{1}{1 - v^2} + \\frac{1}{v} \\right) dv$

Integrating:

$\\ln X = \\frac{1}{2} \\ln \\left| \\frac{1 + v}{1 - v} \\right| + \\ln C$

$\\Rightarrow X = C \\sqrt{\\frac{1 + v}{1 - v}}$

Substituting back $ v = \\frac{Y}{X} $:

$X = C \\sqrt{\\frac{1 + \\frac{Y}{X}}{1 - \\frac{Y}{X}}}$

Further simplification:

$X(1 - \\frac{Y}{X})^3 = C (1 + \\frac{Y}{X})$


$\\Rightarrow (X - Y)^3 = C(X + Y)$


Substituting back:

$x = X + 1 \\quad \\text{and} \\quad y = Y + 1$

We get:

$\\boxed{(x - y)^3 = C(x + y - 2)}$`;

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
