"use client";

import { odeSolveAction } from "../ode-action";
import CommonSolution from "../CommonSolution";
import useEquation from "@/lib/useEquation";
import { useState } from "react";

const presetQuestions = [
    "$\\frac{\\mathrm{d}y}{\\mathrm{d}x} + 2y = e^{-x}$", // First-order linear differential equation
    "$\\frac{\\mathrm{d}y}{\\mathrm{d}x} = y\\sin(x)$", // First-order separable differential equation
    "$\\frac{\\mathrm{d}y}{\\mathrm{d}x} = x^2 + y^2$", // First-order nonlinear differential equation
    "$\\frac{\\mathrm{d}y}{\\mathrm{d}x}=\\frac{1-y^2}{1-x^2}$", // Second-order linear homogeneous differential equation (Simple harmonic motion)
];

export default function Page() {
    const equation = useEquation();
    const [value, setValue] = useState(
        "$\\frac{\\mathrm{d}y}{\\mathrm{d}x}=\\frac{1-y^2}{1-x^2}$"
    );

    return (
        <CommonSolution
            pageType="ode"
            actionFunction={odeSolveAction}
            setValue={setValue}
            defaultQuestion={equation || value}
            presets={presetQuestions}
        />
    );
}
