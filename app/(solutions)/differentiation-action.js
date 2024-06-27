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
                parts: [{ text: "\\frac{d}{dt}x^{x^{x}} (minimal)" }],
            },
            {
                role: "model",
                parts: [
                    {
                        text: "$\\frac{d}{dx}x^{x^{x}}$\n\n$\\frac{d}{dx}e^{x^{x}\\ln(x)}$\n\n$e^{x^{x}\\ln(x)} \\cdot \\frac{d}{dx}(x^{x}\\ln(x))$\n\n$x^{x^{x}} \\cdot (\\frac{d}{dx}(x^{x})\\ln(x) + x^{x}\\frac{d}{dx}\\ln(x))$\n\n$x^{x^{x}} \\cdot (\\frac{d}{dx}(e^{x\\ln(x)})\\ln(x) + x^{x}\\frac{d}{dx}\\ln(x))$\n\n$x^{x^{x}} \\cdot (e^{x\\ln(x)}(\\frac{d}{dx}(x\\ln(x)))\\ln(x) + x^{x}\\frac{1}{x})$\n\n$x^{x^{x}} \\cdot (x^{x}(\\ln(x)+1)\\ln(x) + x^{x-1})$\n\n$x^{x^{x}} \\cdot x^{x}(\\ln^{2}(x)+\\ln(x)+x^{-1})$\n\n$x^{x^{x}+x}(\\ln^{2}(x)+\\ln(x)+x^{-1})$ \n",
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
                        text: "We are given the expression: \n \n $\\frac{d}{dt}\\ln (3t+5)$ \n \n This is asking us to find the derivative of the natural logarithm of (3t + 5) with respect to t.\n \n To solve this, we will use the chain rule. The chain rule states that the derivative of a composite function is equal to the derivative of the outer function evaluated at the inner function multiplied by the derivative of the inner function.\n \n In our case, the outer function is the natural logarithm (ln), and the inner function is (3t + 5).\n \n Therefore, the derivative of the outer function is 1/(3t + 5).\n \n The derivative of the inner function is 3.\n \n Now, applying the chain rule:\n \n $\\frac{d}{dt}\\ln (3t+5) = \\frac{1}{3t+5} \\cdot 3$\n \n Simplifying the expression:\n \n $\\frac{d}{dt}\\ln (3t+5) = \\frac{3}{3t+5}$ \n \n Thus, the derivative of ln(3t + 5) with respect to t is 3/(3t + 5).\n \n \n \n \n",
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
