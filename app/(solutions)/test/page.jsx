"use client";

import React, { useState } from "react";
import MarkdownView from "@/app/components/MarkdownView";
import MathField from "@/app/components/MathField";

let ans = `$ (x^2 + y^2)dx + 2xy dy = 0 $

### 2. Simplifying

Rewrite the equation in the form $\\frac{dy}{dx} = \\dots$:

$ \\frac{dy}{dx} = -\\frac{x^2 + y^2}{2xy} $

### 3. Recognize Homogeneous Differential Equation

A homogeneous differential equation can be solved using the substitution $ y = vx $, where $ v $ is a function of $ x $. Thus, $ y = vx $ and $ \\frac{dy}{dx} = v + x \\frac{dv}{dx} $.

### 4. Substitute and Simplify

Substitute $ y = vx $ into the differential equation:
$ \\frac{dy}{dx} = v + x \\frac{dv}{dx} $

Now, substituting $ y = vx $ in $\\frac{dy}{dx} = -\\frac{x^2 + y^2}{2xy}$:
$ v + x \\frac{dv}{dx} = -\\frac{x^2 + v^2 x^2}{2x \\cdot vx} = -\\frac{x^2(1 + v^2)}{2x^2 v} = -\\frac{1 + v^2}{2v} $

Rearrange to isolate $ \\frac{dv}{dx} $:
$ x \\frac{dv}{dx} = -\\frac{1 + v^2}{2v} - v $

Combine the terms:
$ x \\frac{dv}{dx} = \\frac{-1 - v^2 - 2v^2}{2v} = \\frac{-1 - 3v^2}{2v} $

### 5. Separate Variables

Separate the variables $ x $ and $ v $:
$ \\frac{dx}{x} = \\frac{2v}{1 + 3v^2} \\, dv $

### 6. Integrate Both Sides

Integrate both sides to solve for $ x $ and $ v $:

Integrate the left side:
$ \\int \\frac{dx}{x} = \\ln |x| + C_1 $

Integrate the right side:
$ \\int \\frac{2v}{1 + 3v^2} \\, dv $

To integrate the right side, use the substitution 

$ u = 1 + 3v^2 $:

$\\Rightarrow du = 6v \\, dv $

$ \\int \\frac{2v}{1 + 3v^2} dv = \\frac{1}{3} \\int \\frac{du}{u} = \\frac{1}{3} \\ln |u| + C_2 = \\frac{1}{3} \\ln |1 + 3v^2| + C_2 $

Combining the integrals, we have:
$ \\ln |x| = -\\frac{1}{3} \\ln |1 + 3v^2| + C $

Where $ C = C_1 - C_2 $ is a constant.

### 7. Simplify the Expression

Exponentiate both sides to solve for $ x $:
$ x = C \\cdot (1 + 3v^2)^{-\\frac{1}{3}} $

Rewriting in terms of $ y $ and $ x $:
$ v = \\frac{y}{x} $

$ x (1 + 3v^2)^{\\frac{1}{3}} = C $

$ \\boxed{x \\left(1 + 3 \\left(\\frac{y}{x}\\right)^2 \\right)^{\\frac{1}{3}} = C} $

This is the general solution to the given differential equation. Here, $ C $ is an arbitrary constant.
`;

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
