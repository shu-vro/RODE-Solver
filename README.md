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

4. Head to [Firebase](https://firebase.google.com/) and create a new project. Then grab the following keys from the project settings by creating a web app

    - Web API Key
    - Auth Domain
    - Project Id
    - Storage Bucket
    - Messaging Sender Id
    - App Id

5. Create a `.env` file in the root directory and add the following

    ```env
    GEMINI_API_KEY=<your key here>
    NEXT_PUBLIC_FIREBASE_API_KEY=<your key here>
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your key here>
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your key here>
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your key here>
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your key here>
    NEXT_PUBLIC_FIREBASE_APP_ID=<your key here>
    ```

6. Run the app
    ```bash
    bun run dev
    ```

## Contributing

Please head to [CONTRIBUTING.md](CONTRIBUTING.md) to know more about contributing to this project.

I hosted my code to vercel, you can host it to any platform you prefer.

## Constrains

Please head to https://ai.google.dev/pricing for knowing more about the constrains of the free API.

## TODO

-   [x] theming for mobile
-   [x] Up and down arrow for navigation
-   [x] login system
-   [x] save the question
-   [ ] four different modes
    -   [ ] backend
    -   [ ] frontend
-   [ ] equation from url
-   [ ] Other's solutions
-   [ ] Preset Solve button
-   [ ] Miscellaneous
