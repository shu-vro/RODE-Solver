"use client";
import { differentiationSolveAction } from "../differentiation-action";
import CommonSolution from "../CommonSolution";
import useEquation from "@/lib/useEquation";
import { useState } from "react";

export default function Page() {
    const equation = useEquation();
    const [value, setValue] = useState("$\\frac{d}{dt}ln (3t+5)$");

    return (
        <CommonSolution
            pageType="differentiation"
            actionFunction={differentiationSolveAction}
            setValue={setValue}
            defaultQuestion={equation || value}
        />
    );
}
