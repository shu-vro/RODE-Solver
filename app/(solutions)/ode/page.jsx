"use client";

import { odeSolveAction } from "../ode-action";
import CommonSolution from "../CommonSolution";
import useEquation from "@/lib/useEquation";
import { useState } from "react";

const presetQuestions = [
    "$\\frac{\\mathrm{d}y}{\\mathrm{d}x} + 2y = e^{-x}$",
    "$\\frac{\\mathrm{d}y}{\\mathrm{d}x} = y\\sin(x)$",
    "$\\frac{\\mathrm{d}y}{\\mathrm{d}x} = x^2 + y^2$",
    "$\\frac{\\mathrm{d}y}{\\mathrm{d}x}=\\frac{1-y^2}{1-x^2}$",
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
