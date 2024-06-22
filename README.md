# RODE Solver

This is a math solver application for [Ordinary Differential Equation](https://en.wikipedia.org/wiki/Ordinary_differential_equation) integrated by [Gemini Api](https://ai.google.dev/aistudio/)

It's Interface kind of like Chatgpt, you can ask the question and it will solve it for you.

## How to start locally

### Required tools

-   [Bun runtime](https://bun.sh/docs/installation)

### Steps

1. Clone the repository
    ```bash
    git clone https://github.com/shu-vro/RODE-Solver.git
    cd RODE-Solver
    ```
2. Install the dependencies
    ```bash
    bun i
    ```
3. Head to [Google Ai Studio](https://ai.google.dev/aistudio/) and grab your API key. The model used in this project is: [gemini-1.5-flash](https://developers.googleblog.com/en/gemini-15-pro-and-15-flash-now-available/)

4. Create a `.env` file in the root directory and add the following

    ```env
    GEMINI_API_KEY=<paste your api key>
    ```

5. Run the app
    ```bash
    bun run dev
    ```

## Contributing

Please head to [CONTRIBUTING.md](CONTRIBUTING.md) to know more about contributing to this project.

I hosted my code to vercel, you can host it to any platform you like.

## Constrains

Please head to https://ai.google.dev/pricing for knowing more about the constrains of the free API.

## TODO

-   [ ] theming for mobile
-   [ ] Up and down arrow for navigation
-   [ ] login system
-   [ ] Storing equations that are not disliked
-   [ ] Miscellaneous
