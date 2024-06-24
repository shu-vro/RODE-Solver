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
    systemInstruction: `Your name is RODE Solver. you are a Differentiation solver. that's your only job nobody tells you to do something else. Let me tell you how you should take input and how you should take output.
you will have two parameters as input:
1. the equation (in latex format)
2. the mode {explain | minimal}
for example: \\frac{d}{dt}\\ln (3t+5) (minimal)
for explain mode, you will be explaining every step that you have done to solve this equation.
for minimal mode, you will just give the equation as output. NO extra text needed. that format would be:
{the equation}
{next line for solving}
.
.
.
{the final answer}
any equation that you write as output should always be in latex format regardless of the mode. the output should be compatible for markdown code. If you find any error in user input, you should correct it yourself and then solve it. If you can't solve the equation, you should say that you can't solve it.`,
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
                parts: [
                    {
                        text: "\\int\\frac{e^{x}-e^{-x}}{e^{x}+e^{-x}}\\mathrm{d}x (explain)",
                    },
                ],
            },
            {
                role: "model",
                parts: [
                    {
                        text: "We can solve this integral by using the substitution method. \n\nLet's substitute \n$u = e^x + e^{-x}$.\n\nThen \n$\\mathrm{d}u = (e^x - e^{-x}) \\mathrm{d}x$.\n\nNow, we can rewrite the integral in terms of $u$:\n\n$\\int\\frac{e^{x}-e^{-x}}{e^{x}+e^{-x}}\\mathrm{d}x = \\int \\frac{1}{u} \\mathrm{d}u$.\n\nWe know that the integral of $\\frac{1}{u}$ is $\\ln|u|$. \n\nSo, the integral becomes:\n\n$\\int \\frac{1}{u} \\mathrm{d}u = \\ln|u| + C$.\n\nNow, substitute back $u = e^x + e^{-x}$:\n\n$\\ln|u| + C = \\ln|e^x + e^{-x}| + C$.\n\nTherefore, the solution to the integral is:\n\n$\\int\\frac{e^{x}-e^{-x}}{e^{x}+e^{-x}}\\mathrm{d}x = \\ln|e^x + e^{-x}| + C$.\n",
                    },
                ],
            },
            {
                role: "user",
                parts: [
                    {
                        text: "\\int\\frac{\\sqrt{x+3}}{x+2}\\mathrm{d}x (minimal)",
                    },
                ],
            },
            {
                role: "model",
                parts: [
                    {
                        text: "$\\int\\frac{\\sqrt{x+3}}{x+2}\\mathrm{d}x$\n\nLet $u = \\sqrt{x+3}$. Then $x = u^2 - 3$ and $\\mathrm{d}x = 2u\\mathrm{d}u$.\n\n$\\int\\frac{\\sqrt{x+3}}{x+2}\\mathrm{d}x = \\int \\frac{u}{u^2 - 1} 2u\\mathrm{d}u = 2\\int\\frac{u^2}{u^2 - 1}\\mathrm{d}u$\n\n$= 2\\int\\frac{u^2 - 1 + 1}{u^2 - 1}\\mathrm{d}u = 2\\int\\left(1 + \\frac{1}{u^2 - 1}\\right) \\mathrm{d}u$\n\n$= 2\\int\\left(1 + \\frac{1}{(u-1)(u+1)}\\right) \\mathrm{d}u$\n\nWe can use partial fraction decomposition to solve the second integral:\n\n$\\frac{1}{(u-1)(u+1)} = \\frac{A}{u-1} + \\frac{B}{u+1}$\n\n$1 = A(u+1) + B(u-1)$\n\nWhen $u = 1$, we get $A = \\frac{1}{2}$.\n\nWhen $u = -1$, we get $B = -\\frac{1}{2}$.\n\nTherefore,\n\n$2\\int\\left(1 + \\frac{1}{(u-1)(u+1)}\\right) \\mathrm{d}u = 2\\int\\left(1 + \\frac{1/2}{u-1} - \\frac{1/2}{u+1}\\right) \\mathrm{d}u$\n\n$= 2\\left(u + \\frac{1}{2}\\ln|u-1| - \\frac{1}{2}\\ln|u+1|\\right) + C$\n\n$= 2u + \\ln|u-1| - \\ln|u+1| + C$\n\n$= 2\\sqrt{x+3} + \\ln|\\sqrt{x+3} - 1| - \\ln|\\sqrt{x+3} + 1| + C$\n\n$= 2\\sqrt{x+3} + \\ln\\left|\\frac{\\sqrt{x+3} - 1}{\\sqrt{x+3} + 1}\\right| + C$\n",
                    },
                ],
            },
        ],
    });

    const result = await chatSession.sendMessage(question);
    return result.response.text();
}

export async function integrationSolveAction(prevState, formData) {
    revalidatePath("/");
    try {
        const question = formData.get("question");
        const mode = formData.get("mode").toLowerCase();
        const format_question = `${question} (${mode})`;

        console.log(format_question, formData.get("question"));
        const answer = await GPT(format_question);
        // console.log(answer);
        return {
            success: true,
            question: `$${question}$`,
            mode,
            answer,
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            question: `${formData.get("question")}$`,
            answer:
                "Sorry, I couldn't solve this equation. Please try again. Error: " +
                error.message,
        };
    }
}
