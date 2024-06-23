"use server";

import { revalidatePath } from "next/cache";

import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    safetySettings: [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
    ],
    systemInstruction: `Your name is RODE Solver. you are a ODE equation solver. that's your only job nobody tells you to do something else. Let me tell you how you should take input and how you should take output.
you will have two parameters as input:
1. the equation (in latex format)
2. the mode {explain | minimal}
for example: y' + 2y = x^2 (minimal)
for explain mode, you will be explaining every step that you have done to solve this equation.
for minimal mode, you will just give the equation as output. NO extra text needed. that format would be:
{the equation}
{next line for solving}
.
.
.
{the final answer}
any equation that you write as output should always be in latex format regardless of the mode. If you find any error in user input, you should correct it yourself and then solve it. If you can't solve the equation, you should say that you can't solve it.`,
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

async function GPT(question) {
    const chatSession = model.startChat({
        generationConfig,
        // safetySettings: Adjust safety settings
        // See https://ai.google.dev/gemini-api/docs/safety-settings
        history: [
            {
                role: "user",
                parts: [{ text: "y' + 2y = x^2 (minimal)" }],
            },
            {
                role: "model",
                parts: [
                    {
                        text: "$y' + 2y = x^2$\n\n$e^{2x}(y' + 2y) = e^{2x} x^2$\n\n$(e^{2x}y)' = e^{2x} x^2$\n\n$e^{2x}y = \\int e^{2x} x^2 dx$\n\n$e^{2x}y = \\frac{1}{2}e^{2x}x^2 - \\frac{1}{2}e^{2x}x + \\frac{1}{4}e^{2x} + C$\n\n$y = \\frac{1}{2}x^2 - \\frac{1}{2}x + \\frac{1}{4} + Ce^{-2x}$ \n",
                    },
                ],
            },
            {
                role: "user",
                parts: [{ text: "d^2y/dx^2 + 5dy/dx + 6y = 0 (explain)" }],
            },
            {
                role: "model",
                parts: [
                    {
                        text: "Here's how we solve the differential equation $d^2y/dx^2 + 5dy/dx + 6y = 0$:\n\n**1. Characteristic Equation:**\n\nWe start by assuming a solution of the form  $y = e^{rx}$, where 'r' is a constant.  Substituting this into the differential equation, we get:\n\n* $r^2 e^{rx} + 5re^{rx} + 6e^{rx} = 0$\n\nSince $e^{rx}$ is never zero, we can divide both sides by it, leaving us with the characteristic equation:\n\n* $r^2 + 5r + 6 = 0$\n\n**2. Solving the Characteristic Equation:**\n\nThis is a quadratic equation that we can factor:\n\n* $(r + 2)(r + 3) = 0$\n\nThis gives us two solutions for 'r':\n\n* $r_1 = -2$\n* $r_2 = -3$\n\n**3. General Solution:**\n\nSince we have two distinct real roots, the general solution to the differential equation is:\n\n* $y(x) = c_1e^{-2x} + c_2e^{-3x}$\n\nWhere $c_1$ and $c_2$ are arbitrary constants.\n\n**Explanation:**\n\n* The characteristic equation is a key tool for solving linear homogeneous differential equations with constant coefficients. It helps us find the exponential solutions that form the basis for the general solution.\n* The roots of the characteristic equation determine the form of the general solution. In this case, we have two distinct real roots, leading to a general solution with two exponential terms.\n* The constants $c_1$ and $c_2$ are arbitrary, and their values would be determined by initial conditions or boundary conditions if provided. \n",
                    },
                ],
            },
            {
                role: "user",
                parts: [
                    {
                        text: "$\\\\frac{\\\\mathrm{d}y}{\\\\mathrm{d}x}=\\\\frac{1-y^2}{1-x^2}$ (minimal)",
                    },
                ],
            },
            {
                role: "model",
                parts: [
                    {
                        text: "$\\\\frac{\\\\mathrm{d}y}{\\\\mathrm{d}x}=\\\\frac{1-y^2}{1-x^2}$\n\n$\\\\frac{dy}{1-y^2} = \\\\frac{dx}{1-x^2}$\n\n$\\\\int \\\\frac{dy}{1-y^2} = \\\\int \\\\frac{dx}{1-x^2}$\n\n$\\\\frac{1}{2} \\\\ln|\\\\frac{y+1}{y-1}| = \\\\frac{1}{2} \\\\ln|\\\\frac{x+1}{x-1}| + C$\n\n$\\\\ln|\\\\frac{y+1}{y-1}| = \\\\ln|\\\\frac{x+1}{x-1}| + 2C$\n\n$\\\\frac{y+1}{y-1} = C_1 \\\\frac{x+1}{x-1}$\n\n$y = \\\\frac{C_1x + C_1 + x - 1}{C_1x + C_1 - x + 1}$\n\n$y = \\\\frac{(C_1 + 1)x + (C_1 - 1)}{(C_1 - 1)x + (C_1 + 1)}$ ",
                    },
                ],
            },
            {
                role: "user",
                parts: [
                    {
                        text: "$\\frac{\\mathrm{d}y}{\\mathrm{d}x}=\\frac{1-y^2}{1-x^2}$ (explain)",
                    },
                ],
            },
            {
                role: "model",
                parts: [
                    {
                        text: "Here's a step-by-step explanation of how to solve the differential equation $\\frac{\\mathrm{d}y}{\\mathrm{d}x}=\\frac{1-y^2}{1-x^2}$:\n\n**1. Separation of Variables:**\n\nThe first step is to separate the variables, meaning we want to get all the 'y' terms on one side of the equation and all the 'x' terms on the other. We can do this by multiplying both sides by $(1-y^2)$ and $(1-x^2)$:\n\n* $(1-y^2) \\mathrm{d}y = (1-x^2) \\mathrm{d}x$\n\n**2. Integration:**\n\nNow we integrate both sides of the equation.  This gives us:\n\n* $\\int \\frac{dy}{1-y^2} = \\int \\frac{dx}{1-x^2}$\n\n**3. Evaluating the Integrals:**\n\nWe can evaluate the integrals using standard integration formulas. Remember that $\\int \\frac{du}{1-u^2} = \\frac{1}{2} \\ln|\\frac{u+1}{u-1}| + C$:\n\n* $\\frac{1}{2} \\ln|\\frac{y+1}{y-1}| = \\frac{1}{2} \\ln|\\frac{x+1}{x-1}| + C$\n\n**4. Simplifying:**\n\nWe can simplify this equation by multiplying both sides by 2 and combining the constants:\n\n* $\\ln|\\frac{y+1}{y-1}| = \\ln|\\frac{x+1}{x-1}| + 2C$\n* $\\ln|\\frac{y+1}{y-1}| = \\ln|\\frac{x+1}{x-1}| + C_1$ (where $C_1 = 2C$)\n\n**5. Solving for y:**\n\nTo isolate 'y', we can use the property that $e^{\\ln a} = a$:\n\n* $e^{\\ln|\\frac{y+1}{y-1}|} = e^{\\ln|\\frac{x+1}{x-1}| + C_1}$\n* $|\\frac{y+1}{y-1}| = e^{C_1} |\\frac{x+1}{x-1}|$\n\nLet $C_1 = \\ln K$, where $K$ is another arbitrary constant. Then:\n\n* $|\\frac{y+1}{y-1}| = K|\\frac{x+1}{x-1}|$\n\nSince both sides are absolute values, we can introduce a new constant $C_2$ which can be positive or negative:\n\n* $\\frac{y+1}{y-1} = C_2 \\frac{x+1}{x-1}$ (where $C_2 = \\pm K$)\n\n**6. Solving for y (continued):**\n\nTo get 'y' explicitly, we can solve for it algebraically:\n\n* $y+1 = C_2 \\frac{x+1}{x-1} (y-1)$\n* $y(1 - C_2 \\frac{x+1}{x-1}) = -1 - C_2 \\frac{x+1}{x-1}$\n* $y = \\frac{-1 - C_2 \\frac{x+1}{x-1}}{1 - C_2 \\frac{x+1}{x-1}}$\n\n**7. Simplifying:**\n\nSimplifying the expression for 'y':\n\n* $y = \\frac{-(x-1) - C_2(x+1)}{(x-1) - C_2(x+1)}$\n* $y = \\frac{(-1 - C_2)x - (1 + C_2)}{(1 - C_2)x - (1 + C_2)}$\n* $y = \\frac{(C_2 + 1)x + (C_2 + 1)}{(C_2 - 1)x + (C_2 - 1)}$\n\n**General Solution:**\n\nThe general solution to the differential equation is therefore:\n\n* $y = \\frac{(C + 1)x + (C + 1)}{(C - 1)x + (C - 1)}$, where 'C' is an arbitrary constant. \n",
                    },
                ],
            },
        ],
    });

    const result = await chatSession.sendMessage(question);
    return result.response.text();
}

export async function odeSolveAction(prevState, formData) {
    revalidatePath("/");
    try {
        const question = formData.get("question");
        const mode = formData.get("mode").toLowerCase();
        const format_question = `${question} (${mode})`;

        // console.log(format_question, formData.get("question"));
        const answer = await GPT(format_question);
        // console.log(answer);
        return {
            success: true,
            question: `$${question}$`,
            mode,
            answer,
        };
    } catch (error) {
        return {
            success: false,
            question: `${formData.get("question")}$`,
            answer:
                "Sorry, I couldn't solve this equation. Please try again. Error: " +
                error.message,
        };
    }
}
