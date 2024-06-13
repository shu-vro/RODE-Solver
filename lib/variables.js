const answer = `$\\frac{\\mathrm{d}y}{\\mathrm{d}x}=\\frac{1-y^2}{1-x^2}$

$\\frac{dy}{1-y^2} = \\frac{dx}{1-x^2}$

$\\int \\frac{dy}{1-y^2} = \\int \\frac{dx}{1-x^2}$

$\\frac{1}{2} \\ln|\\frac{y+1}{y-1}| = \\frac{1}{2} \\ln|\\frac{x+1}{x-1}| + C$

$\\ln|\\frac{y+1}{y-1}| = \\ln|\\frac{x+1}{x-1}| + 2C$

$\\frac{y+1}{y-1} = C_1 \\frac{x+1}{x-1}$

$y = \\frac{C_1x + C_1 + x - 1}{C_1x + C_1 - x + 1}$

$y = \\frac{(C_1 + 1)x + (C_1 - 1)}{(C_1 - 1)x + (C_1 + 1)}$ 
`;

const md = `Here's a step-by-step explanation of how to solve the differential equation $\\frac{\\mathrm{d}y}{\\mathrm{d}x}=\\frac{1-y^2}{1-x^2}$:

**1. Separation of Variables:**

The first step is to separate the variables, meaning we want to get all the 'y' terms on one side of the equation and all the 'x' terms on the other. We can do this by multiplying both sides by $(1-y^2)$ and $(1-x^2)$:

* $(1-y^2) \\mathrm{d}y = (1-x^2) \\mathrm{d}x$

**2. Integration:**

Now we integrate both sides of the equation.  This gives us:

* $\\int \\frac{dy}{1-y^2} = \\int \\frac{dx}{1-x^2}$

**3. Evaluating the Integrals:**

We can evaluate the integrals using standard integration formulas. Remember that $\\int \\frac{du}{1-u^2} = \\frac{1}{2} \\ln|\\frac{u+1}{u-1}| + C$:

* $\\frac{1}{2} \\ln|\\frac{y+1}{y-1}| = \\frac{1}{2} \\ln|\\frac{x+1}{x-1}| + C$

**4. Simplifying:**

We can simplify this equation by multiplying both sides by 2 and combining the constants:

* $\\ln|\\frac{y+1}{y-1}| = \\ln|\\frac{x+1}{x-1}| + 2C$
* $\\ln|\\frac{y+1}{y-1}| = \\ln|\\frac{x+1}{x-1}| + C_1$ (where $C_1 = 2C$)

**5. Solving for y:**

To isolate 'y', we can use the property that $e^{\\ln a} = a$:

* $e^{\\ln|\\frac{y+1}{y-1}|} = e^{\\ln|\\frac{x+1}{x-1}| + C_1}$
* $|\\frac{y+1}{y-1}| = e^{C_1} |\\frac{x+1}{x-1}|$

Let $C_1 = \\ln K$, where $K$ is another arbitrary constant. Then:

* $|\\frac{y+1}{y-1}| = K|\\frac{x+1}{x-1}|$

Since both sides are absolute values, we can introduce a new constant $C_2$ which can be positive or negative:

* $\\frac{y+1}{y-1} = C_2 \\frac{x+1}{x-1}$ (where $C_2 = \\pm K$)

**6. Solving for y (continued):**

To get 'y' explicitly, we can solve for it algebraically:

* $y+1 = C_2 \\frac{x+1}{x-1} (y-1)$
* $y(1 - C_2 \\frac{x+1}{x-1}) = -1 - C_2 \\frac{x+1}{x-1}$
* $y = \\frac{-1 - C_2 \\frac{x+1}{x-1}}{1 - C_2 \\frac{x+1}{x-1}}$

**7. Simplifying:**

Simplifying the expression for 'y':

* $y = \\frac{-(x-1) - C_2(x+1)}{(x-1) - C_2(x+1)}$
* $y = \\frac{(-1 - C_2)x - (1 + C_2)}{(1 - C_2)x - (1 + C_2)}$
* $y = \\frac{(C_2 + 1)x + (C_2 + 1)}{(C_2 - 1)x + (C_2 - 1)}$

**General Solution:**

The general solution to the differential equation is therefore:

* $y = \\frac{(C + 1)x + (C + 1)}{(C - 1)x + (C - 1)}$, where 'C' is an arbitrary constant. 
`;
