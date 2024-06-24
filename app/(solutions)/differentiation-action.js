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
                parts: [{ text: "\\frac{d}{dt}\\ln (3t+5) (minimal)" }],
            },
            {
                role: "model",
                parts: [
                    {
                        text: "$\\frac{d}{dt}\\ln (3t+5)$\n\n$\\frac{1}{3t+5} \\cdot \\frac{d}{dt}(3t+5)$\n\n$\\frac{3}{3t+5}$\n",
                    },
                ],
            },
            {
                role: "user",
                parts: [{ text: "\\frac{d}{dt}\\ln (3t+5) (explain)" }],
            },
            {
                role: "model",
                parts: [
                    {
                        text: "We are given the equation: \n$\\frac{d}{dt}\\ln (3t+5)$\n\nThis equation represents the derivative of the natural logarithm of $(3t+5)$ with respect to $t$. \n\nTo solve this, we will use the chain rule: \n$\\frac{d}{dx} f(g(x)) = f'(g(x)) \\cdot g'(x)$\n\nIn our case,  $f(x) = \\ln(x)$ and $g(x) = 3t+5$. \n\nFirst, we find the derivative of $f(x)$:\n$f'(x) = \\frac{1}{x}$\n\nThen, we find the derivative of $g(x)$:\n$g'(x) = 3$\n\nNow, we apply the chain rule:\n$\\frac{d}{dt}\\ln (3t+5) = \\frac{1}{3t+5} \\cdot \\frac{d}{dt}(3t+5)$\n\nFinally, we simplify the expression:\n$\\frac{d}{dt}\\ln (3t+5) = \\frac{3}{3t+5}$\n\nTherefore, the derivative of $\\ln (3t+5)$ with respect to $t$ is $\\frac{3}{3t+5}$. \n",
                    },
                ],
            },
        ],
    });

    const result = await chatSession.sendMessage(question);
    return result.response.text();
}

export async function differentiationSolveAction(prevState, formData) {
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
