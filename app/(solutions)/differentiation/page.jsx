"use client";
import { differentiationSolveAction } from "../differentiation-action";
import CommonSolution from "../CommonSolution";
import useEquation from "@/lib/useEquation";
import { useState } from "react";

const presetQuestions = [
    "\\frac{d}{dx} \\left( e^{x^2} \\cos(x) \\right)",
    "\\frac{d}{dx} \\left( \\ln(\\sqrt{x^2 + 1}) \\right)",
    "\\frac{d}{dx} \\left( \\frac{\\sin(x)}{x^2 + 1} \\right)",
    "\\frac{d^2}{dx^2} \\left( x^4 \\cos(x^2) \\right)",
];

export default function Page() {
    const equation = useEquation();
    const [value, setValue] = useState("$\\frac{d}{dt}ln (3t+5)$");

    return (
        <CommonSolution
            pageType="differentiation"
            actionFunction={differentiationSolveAction}
            setValue={setValue}
            defaultQuestion={equation || value}
            presets={presetQuestions}
        />
    );
}
