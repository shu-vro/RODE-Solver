"use client";

import { odeSolveAction } from "../ode-action";
import CommonSolution from "../CommonSolution";

export default function Page() {
    return (
        <CommonSolution
            pageType="ode"
            actionFunction={odeSolveAction}
            defaultQuestion="$\frac{\mathrm{d}y}{\mathrm{d}x}=\frac{1-y^2}{1-x^2}$"
        />
    );
}
