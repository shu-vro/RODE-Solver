"use client";

import { integrationSolveAction } from "../integration-action";
import CommonSolution from "../CommonSolution";

export default function Page() {
    return (
        <CommonSolution
            pageType="integration"
            actionFunction={integrationSolveAction}
            defaultQuestion="$\int\frac{e^{x}-e^{-x}}{e^{x}+e^{-x}}\mathrm{d}x$"
        />
    );
}
