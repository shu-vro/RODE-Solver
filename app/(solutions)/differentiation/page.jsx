"use client";
import { differentiationSolveAction } from "../differentiation-action";
import CommonSolution from "../CommonSolution";

export default function Page() {
    return (
        <CommonSolution
            pageType="differentiation"
            actionFunction={differentiationSolveAction}
            defaultQuestion="$\frac{d}{dt}\ln (3t+5)$"
        />
    );
}
