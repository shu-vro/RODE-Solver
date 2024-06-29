"use client";

import React, { useState } from "react";
import MarkdownView from "@/app/components/MarkdownView";
import MathField from "@/app/components/MathField";

let ans = `Here's how to solve the ODE and reach the given answer:

**Step 1: Check for separability**

The equation is not directly separable because the variables x and y are mixed in both the numerator and denominator. 

**Step 2: Homogenize the equation (optional)**

This equation is already homogeneous (meaning of degree 1 in both x and y) so this step isn't necessary. However, for some ODEs, homogenization can help separate the variables.

**Step 3: Manipulate the equation**

We can try to manipulate the equation to make it separable. Notice that both the numerator and denominator have a term of -3. Let's subtract 3 from both sides:

$$ \\frac{\\mathrm{d}y}{\\mathrm{d}x} = \\frac{x+2y-3}{2x+y-3} - 3 = \\frac{x+2y-6}{2x+y-6} $$

Now both the numerator and denominator have a common factor of (x+2y-6). We can rewrite the equation:

$$ \\frac{\\mathrm{d}y}{\\mathrm{d}x} = \\frac{x+2y-6}{2x+y-6} = \\frac{1}{2} \\cdot \\frac{2(x+2y-6)}{2(x+y-6)} $$

**Step 4: Separate the variables**

Now, if we let  u = x+2y-6, then du = (2+2y) dx = 2(dx+dy). Substituting and manipulating:

$$ \\frac{\\mathrm{d}y}{\\mathrm{d}x} = \\frac{1}{2} \\cdot \\frac{du}{2(dx+dy)} = \\frac{du}{4(dx+dy)} $$

Notice how dy is now isolated on the right side. We can separate the variables:

$$ 4(dx+dy) = du $$

**Step 5: Integrate both sides**

Integrate both sides of the equation:

$$ \\int 4(dx+dy) = \\int du $$

This gives us:

$$ 4x + 4y = u + C_1 $$

where C_1 is the constant of integration.

**Step 6: Substitute back and simplify**

We defined u = x+2y-6. Substitute this back and rearrange:

$$ 4x + 4y = (x+2y-6) + C_1 $$

$$ 3x + 2y = C_1 + 6 $$

Finally, factor out a constant (let a = (C_1+6)/2):

$$ x+y-2 = a(x-y)^3 $$

This is the solution to the ODE, where a is an arbitrary constant obtained by combining the original constant of integration (C_1) with another constant. `;

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
