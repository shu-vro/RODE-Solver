"use client";

import { integrationSolveAction } from "../integration-action";
import CommonSolution from "../CommonSolution";
import useEquation from "@/lib/useEquation";
import { useState } from "react";

const presetQuestions = [
    "\\int x^{x^2} dx",
    "\\int \\frac{dx}{\\ln(x)}",
    "\\int x^x dx",
    "\\int \\frac{\\sin(x)}{x} dx",
];

export default function Page() {
    const equation = useEquation();
    const [value, setValue] = useState(
        "$\\int\\frac{e^{x}-e^{-x}}{e^{x}+e^{-x}}\\mathrm{d}x$"
    );

    return (
        <CommonSolution
            pageType="integration"
            actionFunction={integrationSolveAction}
            setValue={setValue}
            defaultQuestion={equation || value}
            presets={presetQuestions}
        />
    );
}
