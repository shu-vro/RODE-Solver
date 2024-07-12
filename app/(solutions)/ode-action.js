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
    systemInstruction: `Your name is RODE Solver. you are a ODE equation solver. that's your only job. let me tell you how you should take input and how you should take output.
you will have two parameters as input:
1. the equation (in latex format)
2. the mode {explain | minimal}
for example: y' + 2y = x^2 (minimal)
for explain mode, you will be explaining every step that you have done to solve this equation make them minimal. that format would be
\${the equation}$
{what needs to be done}:

{step 1}
{\\Rightarrow {step 2}}
.
.
.
$\\boxed{\\Rightarrow{the final answer}}$

For minimal mode, you will just give the equation as output. NO extra text needed. that format would be:
\${the equation}$
$\\Rightarrow{next line for solving}$
.
.
.
$\\boxed{\\Rightarrow{the final answer}}$
The variables in the input could be x, y, z, t, $\\theta$ and no more. Rest of all are constants. Any equation that you write as output should always be in latex format regardless of the mode.  The output should be compatible for markdown code. If you find any error in user input, you should correct it yourself and then solve it. If you can't solve the equation, you should say that you can't solve it.`,
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
                        text: "$ \\frac{\\mathrm{d}y}{\\mathrm{d}x}+2y=x^2 $ (minimal)",
                    },
                ],
            },
            {
                role: "model",
                parts: [
                    {
                        text: "$\\frac{\\mathrm{d}y}{\\mathrm{d}x} + 2y = x^2$\n\nhere, integrating factor = $e^{\\int 2 \\, dx} = e^{2x}$\n\n$\\Rightarrow e^{2x} \\frac{\\mathrm{d}y}{\\mathrm{d}x} + 2 e^{2x} y = x^2 e^{2x}$\n\n$\\Rightarrow \\frac{d}{dx} \\left( y e^{2x} \\right) = x^2 e^{2x}$\n\n$\\Rightarrow \\int \\frac{d}{dx} \\left( y e^{2x} \\right) \\, dx = \\int x^2 e^{2x} \\, dx$\n\n$\\Rightarrow y e^{2x} = e^{2x} \\left( \\frac{x^2}{2} - \\frac{x}{2} + \\frac{1}{4} \\right) + C$\n\n$\\boxed{\\Rightarrow y = \\frac{x^2}{2} - \\frac{x}{2} + \\frac{1}{4} + C e^{-2x}}$\n",
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
                        text: "Here's a step-by-step explanation of how to solve the differential equation $\\frac{\\mathrm{d}y}{\\mathrm{d}x}=\\frac{1-y^2}{1-x^2}$:\n\n**1. Separation of Variables:**\n\nThe first step is to separate the variables, meaning we want to get all the 'y' terms on one side of the equation and all the 'x' terms on the other. We can do this by multiplying both sides by $(1-y^2)$ and $(1-x^2)$:\n\n* $(1-y^2) \\mathrm{d}y = (1-x^2) \\mathrm{d}x$\n\n**2. Integration:**\n\nNow we integrate both sides of the equation.  This gives us:\n\n* $\\int \\frac{dy}{1-y^2} = \\int \\frac{dx}{1-x^2}$\n\n**3. Evaluating the Integrals:**\n\nWe can evaluate the integrals using standard integration formulas. Remember that $\\int \\frac{du}{1-u^2} = \\frac{1}{2} \\ln|\\frac{u+1}{u-1}| + C$:\n\n* $\\frac{1}{2} \\ln|\\frac{y+1}{y-1}| = \\frac{1}{2} \\ln|\\frac{x+1}{x-1}| + C$\n\n**4. Simplifying:**\n\nWe can simplify this equation by multiplying both sides by 2 and combining the constants:\n\n* $\\ln|\\frac{y+1}{y-1}| = \\ln|\\frac{x+1}{x-1}| + 2C$\n* $\\ln|\\frac{y+1}{y-1}| = \\ln|\\frac{x+1}{x-1}| + C_1$ (where $C_1 = 2C$)\n\n**5. Solving for y:**\n\nTo isolate 'y', we can use the property that $e^{\\ln a} = a$:\n\n* $e^{\\ln|\\frac{y+1}{y-1}|} = e^{\\ln|\\frac{x+1}{x-1}| + C_1}$\n* $|\\frac{y+1}{y-1}| = e^{C_1} |\\frac{x+1}{x-1}|$\n\nLet $C_1 = \\ln K$, where $K$ is another arbitrary constant. Then:\n\n* $|\\frac{y+1}{y-1}| = K|\\frac{x+1}{x-1}|$\n\nSince both sides are absolute values, we can introduce a new constant $C_2$ which can be positive or negative:\n\n* $\\frac{y+1}{y-1} = C_2 \\frac{x+1}{x-1}$ (where $C_2 = \\pm K$)\n\n**6. Solving for y (continued):**\n\nTo get 'y' explicitly, we can solve for it algebraically:\n\n* $y+1 = C_2 \\frac{x+1}{x-1} (y-1)$\n* $y(1 - C_2 \\frac{x+1}{x-1}) = -1 - C_2 \\frac{x+1}{x-1}$\n* $y = \\frac{-1 - C_2 \\frac{x+1}{x-1}}{1 - C_2 \\frac{x+1}{x-1}}$\n\n**7. Simplifying:**\n\nSimplifying the expression for 'y':\n\n* $y = \\frac{-(x-1) - C_2(x+1)}{(x-1) - C_2(x+1)}$\n* $y = \\frac{(-1 - C_2)x - (1 + C_2)}{(1 - C_2)x - (1 + C_2)}$\n* $y = \\frac{(C_2 + 1)x + (C_2 + 1)}{(C_2 - 1)x + (C_2 - 1)}$\n\n**General Solution:**\n\nThe general solution to the differential equation is therefore:\n\n* $\\boxed{y = \\frac{(C + 1)x + (C + 1)}{(C - 1)x + (C - 1)}}$, where 'C' is an arbitrary constant. \n",
                    },
                ],
            },
            {
                role: "user",
                parts: [{ text: "$ (x^2 + y^2)dx + 2xy dy = 0 $ (explain)" }],
            },
            {
                role: "model",
                parts: [
                    {
                        text: "$ (x^2 + y^2)dx + 2xy dy = 0 $\n\n### 2. Simplifying\n\nRewrite the equation in the form $\\frac{dy}{dx} = \\dots$:\n\n$ \\frac{dy}{dx} = -\\frac{x^2 + y^2}{2xy} $\n\n### 3. Recognize Homogeneous Differential Equation\n\nA homogeneous differential equation can be solved using the substitution $ y = vx $, where $ v $ is a function of $ x $. Thus, $ y = vx $ and $ \\frac{dy}{dx} = v + x \\frac{dv}{dx} $.\n\n### 4. Substitute and Simplify\n\nSubstitute $ y = vx $ into the differential equation:\n$ \\frac{dy}{dx} = v + x \\frac{dv}{dx} $\n\nNow, substituting $ y = vx $ in $\\frac{dy}{dx} = -\\frac{x^2 + y^2}{2xy}$:\n$ v + x \\frac{dv}{dx} = -\\frac{x^2 + v^2 x^2}{2x \\cdot vx} = -\\frac{x^2(1 + v^2)}{2x^2 v} = -\\frac{1 + v^2}{2v} $\n\nRearrange to isolate $ \\frac{dv}{dx} $:\n$ x \\frac{dv}{dx} = -\\frac{1 + v^2}{2v} - v $\n\nCombine the terms:\n$ x \\frac{dv}{dx} = \\frac{-1 - v^2 - 2v^2}{2v} = \\frac{-1 - 3v^2}{2v} $\n\n### 5. Separate Variables\n\nSeparate the variables $ x $ and $ v $:\n$ \\frac{dx}{x} = \\frac{2v}{1 + 3v^2} \\, dv $\n\n### 6. Integrate Both Sides\n\nIntegrate both sides to solve for $ x $ and $ v $:\n\nIntegrate the left side:\n$ \\int \\frac{dx}{x} = \\ln |x| + C_1 $\n\nIntegrate the right side:\n$ \\int \\frac{2v}{1 + 3v^2} \\, dv $\n\nTo integrate the right side, use the substitution \n\n$ u = 1 + 3v^2 $:\n\n$\\Rightarrow du = 6v \\, dv $\n\n$ \\int \\frac{2v}{1 + 3v^2} dv = \\frac{1}{3} \\int \\frac{du}{u} = \\frac{1}{3} \\ln |u| + C_2 = \\frac{1}{3} \\ln |1 + 3v^2| + C_2 $\n\nCombining the integrals, we have:\n$ \\ln |x| = -\\frac{1}{3} \\ln |1 + 3v^2| + C $\n\nWhere $ C = C_1 - C_2 $ is a constant.\n\n### 7. Simplify the Expression\n\nExponentiate both sides to solve for $ x $:\n$ x = C \\cdot (1 + 3v^2)^{-\\frac{1}{3}} $\n\nRewriting in terms of $ y $ and $ x $:\n$ v = \\frac{y}{x} $\n\n$ x (1 + 3v^2)^{\\frac{1}{3}} = C $\n\n$ \\boxed{x \\left(1 + 3 \\left(\\frac{y}{x}\\right)^2 \\right)^{\\frac{1}{3}} = C} $\n\nThis is the general solution to the given differential equation. Here, $ C $ is an arbitrary constant.",
                    },
                ],
            },
            {
                role: "user",
                parts: [
                    {
                        text: "$x^2 y \\, dx - (x^3 + y^3) \\, dy = 0$ (minimal)",
                    },
                ],
            },
            {
                role: "model",
                parts: [
                    {
                        text: "$x^2ydx-(x^3+y^3)dy=0$\n\n$\\frac{dy}{dx}=\\frac{xy}{x^3+y^3}$\n\nPutting$y=vx$:\n\n$\\frac{dy}{dx}=v+x\\frac{dv}{dx}$\n\n$v+x\\frac{dv}{dx}=\\frac{vx^3}{x^3(1+v^3)}$\n\n$v+x\\frac{dv}{dx}=\\frac{v}{1+v^3}$\n\n$x\\frac{dv}{dx}=\\frac{v}{1+v^3}-v$\n\n$x\\frac{dv}{dx}=\\frac{v-v(1+v^3)}{1+v^3}=\\frac{-v^4}{1+v^3}$\n\n$\\frac{dx}{x}=-\\frac{1+v^3}{v^4}\\,dv$\n\n$\\frac{dx}{x}=-\\left(\\frac{1}{v^4}+\\frac{1}{v}\\right)\\,dv$\n\n$\\int\\frac{dx}{x}=-\\int\\left(\\frac{1}{v^4}+\\frac{1}{v}\\right)\\,dv$\n\n$\\ln(x)=-\\frac{1}{3v^3}-\\ln(v)+C$\n\n$\\ln(vx)=-\\frac{1}{3v^3}+C$\n\nSubstituting back $v=\\frac{y}{x}$\n\n$\\boxed{\\ln(y)=\\frac{x^2}{3y^3}+C}$",
                    },
                ],
            },
            {
                role: "user",
                parts: [
                    {
                        text: "\\frac{dy}{dx} = \\frac{x + 2y - 3}{2x + y - 3} (minimal)",
                    },
                ],
            },
            {
                role: "model",
                parts: [
                    {
                        text: "$\\frac{dy}{dx} = \\frac{x + 2y - 3}{2x + y - 3}$\n\nLet $ x = X + h $ and $ y = Y + k $.\n\n$\\frac{dY}{dX} = \\frac{X + 2Y + (h + 2k - 3)}{2X + Y + (2h + k - 3)}$\n\nSolving for $ h $ and $ k $:\n\n$h + 2k - 3 = 0$\n\n$2h + k - 3 = 0$\n\n$\\therefore h = 1 \\quad k = 1 $.\n\n$\\frac{dY}{dX} = \\frac{X + 2Y}{2X + Y}$\n\nLet $ Y = vX $\n\n$\\frac{dY}{dX} = v + X \\frac{dv}{dX}$\n\n$\\Rightarrow v + X \\frac{dv}{dX} = \\frac{X + 2vX}{2X + vX}$\n\n$\\Rightarrow v + X \\frac{dv}{dX} = \\frac{1 + 2v}{2 + v}$\n\n$\\Rightarrow X \\frac{dv}{dX} = \\frac{1 + 2v - v(2 + v)}{2 + v} = \\frac{1 + 2v - 2v - v^2}{2 + v} = \\frac{1 - v^2}{2 + v}$\n\n\n$\\Rightarrow \\frac{dv}{dX} = \\frac{1 - v^2}{X(2 + v)}$\n\n$\\Rightarrow \\frac{dX}{X} = \\left( \\frac{2+v}{1 - v^2}\\right) dv$\n\n$\\Rightarrow\\frac{dX}{X} = \\left( \\frac{2}{1 - v^2} + \\frac{v}{1 - v^2} \\right) dv$\n\n$\\ln X = 2 \\frac{1}{2} \\ln \\left| \\frac{1 + v}{1 - v} \\right| + \\frac{1}{2} \\ln \\left| 1-v^2 \\right| + \\ln C $\n\n$\\Rightarrow X = C \\frac{1+v}{1-v} \\frac{1}{\\sqrt {1-v^2}}$\n\n<!-- $\\Rightarrow X = \\frac{c \\left {1+v} \\right}{1}$ -->\n\n$\\Rightarrow X = \\frac{c (1+ \\nu)}{(1-\\nu)(1-\\nu)^{\\frac{1}{2}} (1+\\nu)^{\\frac{1}{2}}} $\n\n$\\Rightarrow X = \\frac{C (1+\\nu)^{\\frac{1}{2}}}{(1-\\nu)^{\\frac{3}{2}}} $\n\n$\\Rightarrow X^2 = \\frac{C^2 (1+\\nu)}{(1-\\nu)^3} $\n\n$\\Rightarrow X^2 (1-\\nu)^3 = C^2 (1+\\nu)$\n\n$\\Rightarrow X^2 (1-\\frac{Y}{X})^3 = C^2 (1 + \\frac{Y}{X})$\n\n$\\Rightarrow X^2 (\\frac{X-Y}{X})^3 = C^2 (\\frac{X+Y}{X})$\n\n$\\Rightarrow \\ (X - Y)^3 = C^2 (X + Y)$\n\nBut\n$ \\ x = X + 1 \\quad y = Y + 1$\n\n$\\boxed {\\Rightarrow \\ (x - y)^3 = c^2 (x + y - 2)}$\n",
                    },
                ],
            },
            {
                role: "user",
                parts: [
                    {
                        text: "\\left(x-y^2\\right)\\mathrm{dx}+2xydy=0 (minimal)",
                    },
                ],
            },
            {
                role: "model",
                parts: [
                    {
                        text: "$ \\left(x-y^2\\right)\\mathrm{dx}+2xydy=0 $\n\n$ \\Rightarrow2y\\frac{\\mathrm{d}y}{\\mathrm{d}x}-\\frac{1}{x}y^2=-1 $\n\nlet $ v=y^2 $\n\n$ \\therefore\\frac{\\mathrm{d}v}{\\mathrm{d}x}-\\frac{1}{x}v=-1 $\n\n$ IF=e^{\\int-\\frac{1}{x}\\mathrm{d}x}=e^{-\\ln x}=\\frac{1}{x} $\n\n$ \\therefore v\\cdot\\frac{1}{x}=-\\int\\frac{1}{x}\\mathrm{d}x+C $\n\n$ \\boxed {\\Rightarrow\\frac{y^2}{x}=-\\ln x+C} $",
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
